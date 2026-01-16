/**
 * Kanban Module - Renders the Kanban board with status columns
 */

import Storage from './storage.js';
import Modal from './modal.js';
import Stats from './stats.js';
import Filters from './filters.js';

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
    <div class="card" data-id="${application.id}" draggable="true">
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

  const allApplications = Storage.getApplications();
  const applications = Filters.applyFilters(allApplications);

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
 * Handle drag start - store the dragged card's ID
 */
function handleDragStart(e) {
  const card = e.target.closest('.card');
  if (!card) return;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', card.dataset.id);
  card.classList.add('card--dragging');
}

/**
 * Handle drag end - remove dragging styles
 */
function handleDragEnd(e) {
  const card = e.target.closest('.card');
  if (card) {
    card.classList.remove('card--dragging');
  }
  
  document.querySelectorAll('.kanban__column-content--dragover').forEach(col => {
    col.classList.remove('kanban__column-content--dragover');
  });
}

/**
 * Handle drag over - allow drop on columns
 */
function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  
  const columnContent = e.target.closest('.kanban__column-content');
  if (columnContent && !columnContent.classList.contains('kanban__column-content--dragover')) {
    document.querySelectorAll('.kanban__column-content--dragover').forEach(col => {
      col.classList.remove('kanban__column-content--dragover');
    });
    columnContent.classList.add('kanban__column-content--dragover');
  }
}

/**
 * Handle drag leave - remove highlight when leaving column
 */
function handleDragLeave(e) {
  const columnContent = e.target.closest('.kanban__column-content');
  if (columnContent && !columnContent.contains(e.relatedTarget)) {
    columnContent.classList.remove('kanban__column-content--dragover');
  }
}

/**
 * Handle drop - update application status
 */
function handleDrop(e) {
  e.preventDefault();
  
  const columnContent = e.target.closest('.kanban__column-content');
  if (!columnContent) return;
  
  columnContent.classList.remove('kanban__column-content--dragover');
  
  const applicationId = e.dataTransfer.getData('text/plain');
  if (!applicationId) return;
  
  const column = columnContent.closest('.kanban__column');
  if (!column) return;
  
  const newStatus = column.dataset.status;
  
  const application = Storage.getApplicationById(applicationId);
  if (application && application.status !== newStatus) {
    application.status = newStatus;
    Storage.saveApplication(application);
    render();
    Stats.render();
  }
}

/**
 * Handle card click - open details modal
 */
function handleCardClick(e) {
  const card = e.target.closest('.card');
  if (!card) return;

  // Don't open modal if we're in the middle of dragging
  if (card.classList.contains('card--dragging')) return;

  const applicationId = card.dataset.id;
  if (applicationId) {
    Modal.openApplicationDetails(applicationId);
  }
}

/**
 * Set up drag and drop event listeners
 */
function setupDragAndDrop() {
  const container = document.getElementById('kanban');
  if (!container) return;

  container.addEventListener('dragstart', handleDragStart);
  container.addEventListener('dragend', handleDragEnd);
  container.addEventListener('dragover', handleDragOver);
  container.addEventListener('dragleave', handleDragLeave);
  container.addEventListener('drop', handleDrop);
}

/**
 * Set up card click event listeners
 */
function setupCardClick() {
  const container = document.getElementById('kanban');
  if (!container) return;

  container.addEventListener('click', handleCardClick);
}

/**
 * Initialize the Kanban board
 */
export function init() {
  render();
  setupDragAndDrop();
  setupCardClick();
}

export default {
  init,
  render,
  STATUSES
};
