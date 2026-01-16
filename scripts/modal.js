/**
 * Modal Module - Handles modal dialogs for application forms
 */

import Storage from './storage.js';
import Kanban from './kanban.js';
import Stats from './stats.js';

let modalElement = null;
let overlayElement = null;
let currentApplicationId = null;

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
  Stats.render();
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
  currentApplicationId = null;
}

/**
 * Get the Edit Application form content
 */
function getEditApplicationFormContent(application) {
  const contacts = Storage.getContacts(application.id);
  const interviews = Storage.getInterviews(application.id);
  
  return `
    <form id="editApplicationForm" class="form">
      <div class="form__group">
        <label class="form__label" for="companyName">Company Name <span class="form__required">*</span></label>
        <input type="text" id="companyName" name="companyName" class="form__input" required value="${escapeHtml(application.companyName)}">
      </div>
      <div class="form__group">
        <label class="form__label" for="position">Position <span class="form__required">*</span></label>
        <input type="text" id="position" name="position" class="form__input" required value="${escapeHtml(application.position)}">
      </div>
      <div class="form__group">
        <label class="form__label" for="jobUrl">Job URL</label>
        <input type="url" id="jobUrl" name="jobUrl" class="form__input" placeholder="https://..." value="${escapeHtml(application.jobUrl || '')}">
      </div>
      <div class="form__group">
        <label class="form__label" for="dateApplied">Date Applied</label>
        <input type="date" id="dateApplied" name="dateApplied" class="form__input" value="${application.dateApplied || ''}">
      </div>
      <div class="form__row">
        <div class="form__group">
          <label class="form__label" for="salaryMin">Salary Min</label>
          <input type="number" id="salaryMin" name="salaryMin" class="form__input" placeholder="50000" value="${application.salaryMin || ''}">
        </div>
        <div class="form__group">
          <label class="form__label" for="salaryMax">Salary Max</label>
          <input type="number" id="salaryMax" name="salaryMax" class="form__input" placeholder="80000" value="${application.salaryMax || ''}">
        </div>
      </div>
      <div class="form__group">
        <label class="form__label" for="location">Location</label>
        <input type="text" id="location" name="location" class="form__input" placeholder="City, State or Remote" value="${escapeHtml(application.location || '')}">
      </div>
      <div class="form__group">
        <label class="form__label" for="status">Status</label>
        <select id="status" name="status" class="form__select">
          <option value="Applied" ${application.status === 'Applied' ? 'selected' : ''}>Applied</option>
          <option value="Screening" ${application.status === 'Screening' ? 'selected' : ''}>Screening</option>
          <option value="Interview" ${application.status === 'Interview' ? 'selected' : ''}>Interview</option>
          <option value="Offer" ${application.status === 'Offer' ? 'selected' : ''}>Offer</option>
          <option value="Rejected" ${application.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
        </select>
      </div>
      <div class="form__group">
        <label class="form__label" for="notes">Notes</label>
        <textarea id="notes" name="notes" class="form__textarea" placeholder="Add any notes about this application...">${escapeHtml(application.notes || '')}</textarea>
      </div>
    </form>

    <!-- Contacts Section -->
    <div class="details-section">
      <div class="details-section__header">
        <h3 class="details-section__title">Contacts</h3>
        <button type="button" class="btn btn--secondary btn--small" id="addContactBtn">+ Add Contact</button>
      </div>
      <div id="contactsList" class="details-section__list">
        ${renderContactsList(contacts)}
      </div>
      <div id="addContactForm" class="inline-form inline-form--hidden">
        <div class="form__group">
          <label class="form__label" for="contactName">Name <span class="form__required">*</span></label>
          <input type="text" id="contactName" class="form__input" placeholder="Contact name">
        </div>
        <div class="form__group">
          <label class="form__label" for="contactRole">Role</label>
          <input type="text" id="contactRole" class="form__input" placeholder="e.g. Hiring Manager, Recruiter">
        </div>
        <div class="form__row">
          <div class="form__group">
            <label class="form__label" for="contactEmail">Email</label>
            <input type="email" id="contactEmail" class="form__input" placeholder="email@company.com">
          </div>
          <div class="form__group">
            <label class="form__label" for="contactPhone">Phone</label>
            <input type="tel" id="contactPhone" class="form__input" placeholder="(555) 123-4567">
          </div>
        </div>
        <div class="form__group">
          <label class="form__label" for="contactNotes">Notes</label>
          <textarea id="contactNotes" class="form__textarea form__textarea--small" placeholder="Any notes about this contact..."></textarea>
        </div>
        <div class="inline-form__actions">
          <button type="button" class="btn btn--secondary btn--small" id="cancelContactBtn">Cancel</button>
          <button type="button" class="btn btn--primary btn--small" id="saveContactBtn">Save Contact</button>
        </div>
      </div>
    </div>

    <!-- Interviews Section -->
    <div class="details-section">
      <div class="details-section__header">
        <h3 class="details-section__title">Interviews</h3>
        <button type="button" class="btn btn--secondary btn--small" id="addInterviewBtn">+ Add Interview</button>
      </div>
      <div id="interviewsList" class="details-section__list">
        ${renderInterviewsList(interviews)}
      </div>
      <div id="addInterviewForm" class="inline-form inline-form--hidden">
        <div class="form__row">
          <div class="form__group">
            <label class="form__label" for="interviewDate">Date <span class="form__required">*</span></label>
            <input type="datetime-local" id="interviewDate" class="form__input">
          </div>
          <div class="form__group">
            <label class="form__label" for="interviewType">Type</label>
            <select id="interviewType" class="form__select">
              <option value="phone">Phone</option>
              <option value="video">Video</option>
              <option value="onsite">Onsite</option>
            </select>
          </div>
        </div>
        <div class="form__group">
          <label class="form__label" for="interviewNotes">Notes</label>
          <textarea id="interviewNotes" class="form__textarea form__textarea--small" placeholder="Interview details, preparation notes..."></textarea>
        </div>
        <div class="inline-form__actions">
          <button type="button" class="btn btn--secondary btn--small" id="cancelInterviewBtn">Cancel</button>
          <button type="button" class="btn btn--primary btn--small" id="saveInterviewBtn">Save Interview</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render the list of contacts
 */
function renderContactsList(contacts) {
  if (contacts.length === 0) {
    return '<p class="details-section__empty">No contacts added yet.</p>';
  }
  
  return contacts.map(contact => `
    <div class="contact-item" data-contact-id="${contact.id}">
      <div class="contact-item__info">
        <div class="contact-item__name">${escapeHtml(contact.name)}</div>
        ${contact.role ? `<div class="contact-item__role">${escapeHtml(contact.role)}</div>` : ''}
        <div class="contact-item__details">
          ${contact.email ? `<span class="contact-item__email">📧 ${escapeHtml(contact.email)}</span>` : ''}
          ${contact.phone ? `<span class="contact-item__phone">📞 ${escapeHtml(contact.phone)}</span>` : ''}
        </div>
        ${contact.notes ? `<div class="contact-item__notes">${escapeHtml(contact.notes)}</div>` : ''}
      </div>
    </div>
  `).join('');
}

/**
 * Format interview date for display
 */
function formatInterviewDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

/**
 * Get interview type label with icon
 */
function getInterviewTypeLabel(type) {
  const types = {
    phone: '📞 Phone',
    video: '💻 Video',
    onsite: '🏢 Onsite'
  };
  return types[type] || type;
}

/**
 * Render the list of interviews
 */
function renderInterviewsList(interviews) {
  if (interviews.length === 0) {
    return '<p class="details-section__empty">No interviews scheduled yet.</p>';
  }
  
  return interviews.map(interview => `
    <div class="interview-item ${interview.completed ? 'interview-item--completed' : ''}" data-interview-id="${interview.id}">
      <div class="interview-item__checkbox">
        <input type="checkbox" class="interview-item__completed" ${interview.completed ? 'checked' : ''} title="Mark as completed">
      </div>
      <div class="interview-item__info">
        <div class="interview-item__date">${escapeHtml(formatInterviewDate(interview.date))}</div>
        <div class="interview-item__type">${getInterviewTypeLabel(interview.type)}</div>
        ${interview.notes ? `<div class="interview-item__notes">${escapeHtml(interview.notes)}</div>` : ''}
      </div>
    </div>
  `).join('');
}

/**
 * Setup contacts section event listeners
 */
function setupContactsSection() {
  const addContactBtn = document.getElementById('addContactBtn');
  const cancelContactBtn = document.getElementById('cancelContactBtn');
  const saveContactBtn = document.getElementById('saveContactBtn');
  const addContactForm = document.getElementById('addContactForm');

  if (addContactBtn) {
    addContactBtn.addEventListener('click', () => {
      addContactForm.classList.remove('inline-form--hidden');
      document.getElementById('contactName').focus();
    });
  }

  if (cancelContactBtn) {
    cancelContactBtn.addEventListener('click', () => {
      clearContactForm();
      addContactForm.classList.add('inline-form--hidden');
    });
  }

  if (saveContactBtn) {
    saveContactBtn.addEventListener('click', handleSaveContact);
  }
}

/**
 * Clear the contact form fields
 */
function clearContactForm() {
  document.getElementById('contactName').value = '';
  document.getElementById('contactRole').value = '';
  document.getElementById('contactEmail').value = '';
  document.getElementById('contactPhone').value = '';
  document.getElementById('contactNotes').value = '';
}

/**
 * Handle saving a new contact
 */
function handleSaveContact() {
  const name = document.getElementById('contactName').value.trim();
  
  if (!name) {
    document.getElementById('contactName').focus();
    return;
  }

  const contactData = {
    applicationId: currentApplicationId,
    name: name,
    role: document.getElementById('contactRole').value.trim(),
    email: document.getElementById('contactEmail').value.trim(),
    phone: document.getElementById('contactPhone').value.trim(),
    notes: document.getElementById('contactNotes').value.trim()
  };

  Storage.saveContact(contactData);

  const contacts = Storage.getContacts(currentApplicationId);
  document.getElementById('contactsList').innerHTML = renderContactsList(contacts);

  clearContactForm();
  document.getElementById('addContactForm').classList.add('inline-form--hidden');
}

/**
 * Setup interviews section event listeners
 */
function setupInterviewsSection() {
  const addInterviewBtn = document.getElementById('addInterviewBtn');
  const cancelInterviewBtn = document.getElementById('cancelInterviewBtn');
  const saveInterviewBtn = document.getElementById('saveInterviewBtn');
  const addInterviewForm = document.getElementById('addInterviewForm');
  const interviewsList = document.getElementById('interviewsList');

  if (addInterviewBtn) {
    addInterviewBtn.addEventListener('click', () => {
      addInterviewForm.classList.remove('inline-form--hidden');
      document.getElementById('interviewDate').focus();
    });
  }

  if (cancelInterviewBtn) {
    cancelInterviewBtn.addEventListener('click', () => {
      clearInterviewForm();
      addInterviewForm.classList.add('inline-form--hidden');
    });
  }

  if (saveInterviewBtn) {
    saveInterviewBtn.addEventListener('click', handleSaveInterview);
  }

  if (interviewsList) {
    interviewsList.addEventListener('change', handleInterviewCompletedToggle);
  }
}

/**
 * Clear the interview form fields
 */
function clearInterviewForm() {
  document.getElementById('interviewDate').value = '';
  document.getElementById('interviewType').value = 'phone';
  document.getElementById('interviewNotes').value = '';
}

/**
 * Handle saving a new interview
 */
function handleSaveInterview() {
  const dateValue = document.getElementById('interviewDate').value;
  
  if (!dateValue) {
    document.getElementById('interviewDate').focus();
    return;
  }

  const interviewData = {
    applicationId: currentApplicationId,
    date: dateValue,
    type: document.getElementById('interviewType').value,
    notes: document.getElementById('interviewNotes').value.trim(),
    completed: false
  };

  Storage.saveInterview(interviewData);

  const interviews = Storage.getInterviews(currentApplicationId);
  document.getElementById('interviewsList').innerHTML = renderInterviewsList(interviews);

  clearInterviewForm();
  document.getElementById('addInterviewForm').classList.add('inline-form--hidden');
}

/**
 * Handle toggling interview completed status
 */
function handleInterviewCompletedToggle(e) {
  if (!e.target.classList.contains('interview-item__completed')) return;

  const interviewItem = e.target.closest('.interview-item');
  if (!interviewItem) return;

  const interviewId = interviewItem.dataset.interviewId;
  const interviews = Storage.getInterviews(currentApplicationId);
  const interview = interviews.find(i => i.id === interviewId);

  if (interview) {
    interview.completed = e.target.checked;
    Storage.saveInterview(interview);

    const updatedInterviews = Storage.getInterviews(currentApplicationId);
    document.getElementById('interviewsList').innerHTML = renderInterviewsList(updatedInterviews);
  }
}

/**
 * Show a confirmation dialog
 */
function showConfirmDialog(message) {
  return new Promise((resolve) => {
    const confirmOverlay = document.createElement('div');
    confirmOverlay.className = 'confirm-overlay';
    confirmOverlay.innerHTML = `
      <div class="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-message">
        <p id="confirm-message" class="confirm-dialog__message">${escapeHtml(message)}</p>
        <div class="confirm-dialog__buttons">
          <button type="button" class="btn btn--secondary" id="confirmCancelBtn">Cancel</button>
          <button type="button" class="btn btn--danger" id="confirmDeleteBtn">Delete</button>
        </div>
      </div>
    `;
    document.body.appendChild(confirmOverlay);

    const cancelBtn = document.getElementById('confirmCancelBtn');
    const deleteBtn = document.getElementById('confirmDeleteBtn');

    function cleanup(result) {
      confirmOverlay.remove();
      resolve(result);
    }

    cancelBtn.addEventListener('click', () => cleanup(false));
    deleteBtn.addEventListener('click', () => cleanup(true));

    deleteBtn.focus();
  });
}

/**
 * Handle delete application button click
 */
async function handleDeleteApplication() {
  if (!currentApplicationId) return;

  const confirmed = await showConfirmDialog('Are you sure you want to delete this application? This will also delete all associated contacts and interviews.');

  if (confirmed) {
    Storage.deleteApplication(currentApplicationId);
    Kanban.render();
    Stats.render();
    close();
  }
}

/**
 * Open the Application Details modal for viewing/editing
 */
export function openApplicationDetails(applicationId) {
  const application = Storage.getApplicationById(applicationId);
  if (!application) return;

  currentApplicationId = applicationId;

  const content = getEditApplicationFormContent(application);
  const footerButtons = `
    <button type="button" class="btn btn--danger" id="modalDeleteBtn">Delete</button>
    <div class="modal__footer-spacer"></div>
    <button type="button" class="btn btn--secondary" id="modalCancelBtn">Cancel</button>
    <button type="submit" form="editApplicationForm" class="btn btn--primary">Save Changes</button>
  `;

  showOverlay();

  modalElement = document.createElement('div');
  modalElement.className = 'modal-container';
  modalElement.innerHTML = createModalHtml('Application Details', content, footerButtons);
  document.body.appendChild(modalElement);

  // Add event listeners
  const form = document.getElementById('editApplicationForm');
  const closeBtn = modalElement.querySelector('.modal__close');
  const cancelBtn = document.getElementById('modalCancelBtn');
  const deleteBtn = document.getElementById('modalDeleteBtn');

  form.addEventListener('submit', handleEditApplicationSubmit);
  closeBtn.addEventListener('click', close);
  cancelBtn.addEventListener('click', close);
  deleteBtn.addEventListener('click', handleDeleteApplication);
  document.addEventListener('keydown', handleEscapeKey);

  // Setup contacts section
  setupContactsSection();

  // Setup interviews section
  setupInterviewsSection();

  // Focus the first input
  document.getElementById('companyName').focus();
}

/**
 * Handle form submission for editing application
 */
function handleEditApplicationSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const companyName = form.companyName.value.trim();
  const position = form.position.value.trim();

  if (!companyName || !position) {
    return;
  }

  const applicationData = {
    id: currentApplicationId,
    companyName: companyName,
    position: position,
    jobUrl: form.jobUrl.value.trim(),
    dateApplied: form.dateApplied.value || getTodayDate(),
    salaryMin: form.salaryMin.value ? parseInt(form.salaryMin.value, 10) : null,
    salaryMax: form.salaryMax.value ? parseInt(form.salaryMax.value, 10) : null,
    location: form.location.value.trim(),
    status: form.status.value,
    notes: form.notes.value
  };

  Storage.saveApplication(applicationData);
  Kanban.render();
  Stats.render();
  close();
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
  openApplicationDetails,
  close
};
