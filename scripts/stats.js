/**
 * Stats Module - Statistics dashboard for job application data
 */

import { getApplications } from './storage.js';

const STATUSES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];
const STATUS_COLORS = {
  'Applied': '#6366f1',
  'Screening': '#f59e0b',
  'Interview': '#3b82f6',
  'Offer': '#10b981',
  'Rejected': '#ef4444'
};

const Stats = {
  containerEl: null,
  statusChart: null,
  timelineChart: null,

  init() {
    this.containerEl = document.getElementById('stats');
    if (this.containerEl) {
      this.render();
    }
  },

  render() {
    const applications = getApplications();
    const stats = this.calculateStats(applications);

    this.containerEl.innerHTML = `
      <div class="stats__cards">
        <div class="stats__card">
          <span class="stats__card-value">${stats.total}</span>
          <span class="stats__card-label">Total Applications</span>
        </div>
        <div class="stats__card">
          <span class="stats__card-value">${stats.responseRate}%</span>
          <span class="stats__card-label">Response Rate</span>
        </div>
        <div class="stats__card">
          <span class="stats__card-value">${stats.avgDaysToResponse}</span>
          <span class="stats__card-label">Avg. Days to Response</span>
        </div>
      </div>
      <div class="stats__charts">
        <div class="stats__chart">
          <h3 class="stats__chart-title">Applications by Status</h3>
          <canvas id="statusChart"></canvas>
        </div>
        <div class="stats__chart">
          <h3 class="stats__chart-title">Applications (Last 30 Days)</h3>
          <canvas id="timelineChart"></canvas>
        </div>
      </div>
    `;

    this.renderCharts(applications);
  },

  renderCharts(applications) {
    if (this.statusChart) {
      this.statusChart.destroy();
      this.statusChart = null;
    }
    if (this.timelineChart) {
      this.timelineChart.destroy();
      this.timelineChart = null;
    }

    this.renderStatusChart(applications);
    this.renderTimelineChart(applications);
  },

  renderStatusChart(applications) {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;

    const statusCounts = STATUSES.map(status => 
      applications.filter(app => app.status === status).length
    );

    this.statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: STATUSES,
        datasets: [{
          data: statusCounts,
          backgroundColor: STATUSES.map(s => STATUS_COLORS[s]),
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true
            }
          }
        }
      }
    });
  },

  renderTimelineChart(applications) {
    const ctx = document.getElementById('timelineChart');
    if (!ctx) return;

    const { labels, data } = this.getLast30DaysData(applications);

    this.timelineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Applications',
          data,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          },
          x: {
            ticks: {
              maxTicksLimit: 7
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  },

  getLast30DaysData(applications) {
    const labels = [];
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      const count = applications.filter(app => {
        if (!app.dateApplied) return false;
        return app.dateApplied === dateStr;
      }).length;
      
      data.push(count);
    }

    return { labels, data };
  },

  calculateStats(applications) {
    const total = applications.length;

    if (total === 0) {
      return {
        total: 0,
        responseRate: 0,
        avgDaysToResponse: '—'
      };
    }

    const movedPastApplied = applications.filter(app => app.status !== 'Applied');
    const responseRate = Math.round((movedPastApplied.length / total) * 100);

    const avgDays = this.calculateAvgDaysToResponse(applications);

    return {
      total,
      responseRate,
      avgDaysToResponse: avgDays !== null ? avgDays : '—'
    };
  },

  calculateAvgDaysToResponse(applications) {
    const appsWithResponse = applications.filter(app => {
      if (app.status === 'Applied') return false;
      return app.dateApplied && app.updatedAt;
    });

    if (appsWithResponse.length === 0) return null;

    let totalDays = 0;
    let validCount = 0;

    for (const app of appsWithResponse) {
      const appliedDate = new Date(app.dateApplied);
      const updatedDate = new Date(app.updatedAt);

      if (isNaN(appliedDate.getTime()) || isNaN(updatedDate.getTime())) continue;

      const diffTime = updatedDate.getTime() - appliedDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0) {
        totalDays += diffDays;
        validCount++;
      }
    }

    if (validCount === 0) return null;

    return Math.round(totalDays / validCount);
  }
};

export default Stats;
