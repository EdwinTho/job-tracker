/**
 * Modal Module - Handles modal dialogs for application forms
 */

import Storage from './storage.js';
import Kanban from './kanban.js';

let modalElement = null;
let overlayElement = null;

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Create the modal HTML structure
 */
function createModalHtml(title, content, footerButtons) {
  return `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal__header">
        <h2 class="modal__title" id="modal-title">${escapeHtml(title)}</h2>
        <button class="modal__close" aria-label="Close modal">&times;</button>
      </div>
      <div class="modal__body">
        ${content}
      </div>
      <div class="modal__footer">
        ${footerButtons}
      </div>
    </div>
  `;
}

/**
 * Create the Add Application form content
 */
function getAddApplicationFormContent() {
  return `
    <form id="addApplicationForm" class="form">
      <div class="form__group">
        <label class="form__label" for="companyName">Company Name <span class="form__required">*</span></label>
        <input type="text" id="companyName" name="companyName" class="form__input" required>
      </div>
      <div class="form__group">
        <label class="form__label" for="position">Position <span class="form__required">*</span></label>
        <input type="text" id="position" name="position" class="form__input" required>
      </div>
      <div class="form__group">
        <label class="form__label" for="jobUrl">Job URL</label>
        <input type="url" id="jobUrl" name="jobUrl" class="form__input" placeholder="https://...">
      </div>
      <div class="form__group">
        <label class="form__label" for="dateApplied">Date Applied</label>
        <input type="date" id="dateApplied" name="dateApplied" class="form__input" value="${getTodayDate()}">
      </div>
      <div class="form__row">
        <div class="form__group">
          <label class="form__label" for="salaryMin">Salary Min</label>
          <input type="number" id="salaryMin" name="salaryMin" class="form__input" placeholder="50000">
        </div>
        <div class="form__group">
          <label class="form__label" for="salaryMax">Salary Max</label>
          <input type="number" id="salaryMax" name="salaryMax" class="form__input" placeholder="80000">
        </div>
      </div>
      <div class="form__group">
        <label class="form__label" for="location">Location</label>
        <input type="text" id="location" name="location" class="form__input" placeholder="City, State or Remote">
      </div>
    </form>
  `;
}

/**
 * Show the overlay
 */
function showOverlay() {
  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.className = 'modal-overlay';
    document.body.appendChild(overlayElement);
  }
  overlayElement.classList.add('modal-overlay--visible');
  overlayElement.addEventListener('click', close);
}

/**
 * Hide the overlay
 */
function hideOverlay() {
  if (overlayElement) {
    overlayElement.classList.remove('modal-overlay--visible');
    overlayElement.removeEventListener('click', close);
  }
}

/**
 * Open the Add Application modal
 */
export function openAddApplication() {
  const content = getAddApplicationFormContent();
  const footerButtons = `
    <button type="button" class="btn btn--secondary" id="modalCancelBtn">Cancel</button>
    <button type="submit" form="addApplicationForm" class="btn btn--primary">Save Application</button>
  `;

  showOverlay();

  modalElement = document.createElement('div');
  modalElement.className = 'modal-container';
  modalElement.innerHTML = createModalHtml('Add Application', content, footerButtons);
  document.body.appendChild(modalElement);

  // Add event listeners
  const form = document.getElementById('addApplicationForm');
  const closeBtn = modalElement.querySelector('.modal__close');
  const cancelBtn = document.getElementById('modalCancelBtn');

  form.addEventListener('submit', handleAddApplicationSubmit);
  closeBtn.addEventListener('click', close);
  cancelBtn.addEventListener('click', close);
  document.addEventListener('keydown', handleEscapeKey);

  // Focus the first input
  document.getElementById('companyName').focus();
}

/**
 * Handle form submission for adding application
 */
function handleAddApplicationSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const companyName = form.companyName.value.trim();
  const position = form.position.value.trim();

  // Validate required fields
  if (!companyName || !position) {
    return;
  }

  const applicationData = {
    companyName: companyName,
    position: position,
    jobUrl: form.jobUrl.value.trim(),
    dateApplied: form.dateApplied.value || getTodayDate(),
    salaryMin: form.salaryMin.value ? parseInt(form.salaryMin.value, 10) : null,
    salaryMax: form.salaryMax.value ? parseInt(form.salaryMax.value, 10) : null,
    location: form.location.value.trim(),
    status: 'Applied'
  };

  Storage.saveApplication(applicationData);
  Kanban.render();
  close();
}

/**
 * Handle Escape key press
 */
function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    close();
  }
}

/**
 * Close the modal
 */
export function close() {
  if (modalElement) {
    modalElement.remove();
    modalElement = null;
  }
  hideOverlay();
  document.removeEventListener('keydown', handleEscapeKey);
}

/**
 * Initialize the modal module
 */
export function init() {
  const addBtn = document.getElementById('addApplicationBtn');
  if (addBtn) {
    addBtn.addEventListener('click', openAddApplication);
  }
}

export default {
  init,
  openAddApplication,
  close
};
