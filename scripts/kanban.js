/**
 * Kanban Module - Renders the Kanban board with status columns
 */

import Storage from './storage.js';

const STATUSES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

/**
 * Get count of applications per status
 */
function getCountByStatus(applications, status) {
  return applications.filter(app => app.status === status).length;
}

/**
 * Render the Kanban board
 */
export function render() {
  const container = document.getElementById('kanban');
  if (!container) return;

  const applications = Storage.getApplications();

  container.innerHTML = STATUSES.map(status => {
    const count = getCountByStatus(applications, status);
    return `
      <div class="kanban__column" data-status="${status}">
        <div class="kanban__column-header">
          <h2 class="kanban__column-title">${status}</h2>
          <span class="kanban__column-count">${count}</span>
        </div>
        <div class="kanban__column-content">
          ${count === 0 ? '<p class="kanban__empty">No applications</p>' : ''}
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
