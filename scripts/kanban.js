/**
 * Kanban Module - Renders the Kanban board with status columns
 */

import Storage from './storage.js';

const STATUSES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

/**
 * Get applications filtered by status
 */
function getApplicationsByStatus(applications, status) {
  return applications.filter(app => app.status === status);
}

/**
 * Format date for display (e.g., "Jan 15, 2026")
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Render a single application card
 */
function renderCard(application) {
  return `
    <div class="card" data-id="${application.id}">
      <h3 class="card__company">${escapeHtml(application.companyName)}</h3>
      <p class="card__position">${escapeHtml(application.position)}</p>
      <div class="card__meta">
        <span class="card__date">${formatDate(application.dateApplied)}</span>
        ${application.location ? `<span class="card__location">${escapeHtml(application.location)}</span>` : ''}
      </div>
    </div>
  `;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Render the Kanban board
 */
export function render() {
  const container = document.getElementById('kanban');
  if (!container) return;

  const applications = Storage.getApplications();

  container.innerHTML = STATUSES.map(status => {
    const statusApps = getApplicationsByStatus(applications, status);
    const count = statusApps.length;
    return `
      <div class="kanban__column" data-status="${status}">
        <div class="kanban__column-header">
          <h2 class="kanban__column-title">${status}</h2>
          <span class="kanban__column-count">${count}</span>
        </div>
        <div class="kanban__column-content">
          ${count === 0 ? '<p class="kanban__empty">No applications</p>' : statusApps.map(renderCard).join('')}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Initialize the Kanban board
 */
export function init() {
  render();
}

export default {
  init,
  render,
  STATUSES
};
