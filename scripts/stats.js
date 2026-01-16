/**
 * Stats Module - Statistics dashboard for job application data
 */

import { getApplications } from './storage.js';

const Stats = {
  containerEl: null,

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
    `;
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
