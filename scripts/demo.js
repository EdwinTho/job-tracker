/**
 * Demo Module - Provides sample data for exploring app features
 */

import Storage from './storage.js';
import Kanban from './kanban.js';
import Stats from './stats.js';
import Print from './print.js';
import Modal from './modal.js';

const DEMO_APPLICATIONS = [
  {
    companyName: 'TechCorp Inc.',
    position: 'Senior Frontend Developer',
    jobUrl: 'https://techcorp.com/careers/frontend',
    dateApplied: getDateDaysAgo(28),
    salaryMin: 140000,
    salaryMax: 180000,
    location: 'San Francisco, CA',
    status: 'Offer',
    notes: 'Great culture, competitive salary. Negotiating start date.'
  },
  {
    companyName: 'DataFlow Systems',
    position: 'Full Stack Engineer',
    jobUrl: 'https://dataflow.io/jobs/fullstack',
    dateApplied: getDateDaysAgo(21),
    salaryMin: 120000,
    salaryMax: 150000,
    location: 'Remote',
    status: 'Interview',
    notes: 'Final round scheduled. Team uses React and Node.js.'
  },
  {
    companyName: 'CloudNine Solutions',
    position: 'Software Engineer II',
    jobUrl: 'https://cloudnine.tech/careers',
    dateApplied: getDateDaysAgo(18),
    salaryMin: 130000,
    salaryMax: 160000,
    location: 'Austin, TX',
    status: 'Interview',
    notes: 'Technical interview completed. Waiting for next steps.'
  },
  {
    companyName: 'InnovateLabs',
    position: 'React Developer',
    jobUrl: 'https://innovatelabs.com/jobs/react',
    dateApplied: getDateDaysAgo(14),
    salaryMin: 110000,
    salaryMax: 140000,
    location: 'New York, NY',
    status: 'Screening',
    notes: 'Recruiter call went well. Technical assessment pending.'
  },
  {
    companyName: 'GreenTech Energy',
    position: 'Frontend Engineer',
    jobUrl: 'https://greentech.energy/careers',
    dateApplied: getDateDaysAgo(10),
    salaryMin: 100000,
    salaryMax: 130000,
    location: 'Denver, CO',
    status: 'Screening',
    notes: 'Sustainability-focused company. Excited about the mission.'
  },
  {
    companyName: 'FinServe Global',
    position: 'UI/UX Developer',
    jobUrl: 'https://finserve.com/careers/uiux',
    dateApplied: getDateDaysAgo(7),
    salaryMin: 125000,
    salaryMax: 155000,
    location: 'Chicago, IL',
    status: 'Applied',
    notes: 'Fintech sector. Strong benefits package.'
  },
  {
    companyName: 'HealthPlus Digital',
    position: 'JavaScript Developer',
    jobUrl: 'https://healthplus.digital/jobs',
    dateApplied: getDateDaysAgo(5),
    salaryMin: 115000,
    salaryMax: 145000,
    location: 'Boston, MA',
    status: 'Applied',
    notes: 'Healthcare technology. Hybrid work model.'
  },
  {
    companyName: 'StartupXYZ',
    position: 'Senior Developer',
    jobUrl: 'https://startupxyz.io/join',
    dateApplied: getDateDaysAgo(3),
    salaryMin: 130000,
    salaryMax: 170000,
    location: 'Remote',
    status: 'Applied',
    notes: 'Early-stage startup. Equity offered.'
  },
  {
    companyName: 'MegaCorp Industries',
    position: 'Web Developer',
    jobUrl: 'https://megacorp.com/jobs',
    dateApplied: getDateDaysAgo(25),
    salaryMin: 95000,
    salaryMax: 120000,
    location: 'Seattle, WA',
    status: 'Rejected',
    notes: 'Position filled internally. Encouraged to apply again.'
  },
  {
    companyName: 'ByteWise Tech',
    position: 'Frontend Architect',
    jobUrl: 'https://bytewise.tech/careers',
    dateApplied: getDateDaysAgo(30),
    salaryMin: 150000,
    salaryMax: 190000,
    location: 'Los Angeles, CA',
    status: 'Rejected',
    notes: 'Looking for more experience with system design.'
  }
];

const DEMO_CONTACTS = [
  { appIndex: 0, name: 'Sarah Johnson', role: 'Hiring Manager', email: 'sarah.j@techcorp.com', phone: '(555) 123-4567', notes: 'Very responsive' },
  { appIndex: 0, name: 'Mike Chen', role: 'Tech Lead', email: 'mike.c@techcorp.com', phone: '', notes: 'Led the technical interview' },
  { appIndex: 1, name: 'Alex Rivera', role: 'Recruiter', email: 'alex@dataflow.io', phone: '(555) 234-5678', notes: 'Initial phone screen contact' },
  { appIndex: 2, name: 'Jordan Lee', role: 'Engineering Manager', email: 'jlee@cloudnine.tech', phone: '', notes: 'Nice to work with' }
];

const DEMO_INTERVIEWS = [
  { appIndex: 0, date: getDateTimeDaysAgo(20), type: 'phone', notes: 'Initial recruiter call', completed: true },
  { appIndex: 0, date: getDateTimeDaysAgo(14), type: 'video', notes: 'Technical interview with team', completed: true },
  { appIndex: 0, date: getDateTimeDaysAgo(7), type: 'onsite', notes: 'Final round with leadership', completed: true },
  { appIndex: 1, date: getDateTimeDaysAgo(10), type: 'phone', notes: 'HR screening call', completed: true },
  { appIndex: 1, date: getDateTimeDaysAgo(5), type: 'video', notes: 'Coding challenge review', completed: true },
  { appIndex: 1, date: getDateTimeDaysFromNow(2), type: 'video', notes: 'Final round interview', completed: false },
  { appIndex: 2, date: getDateTimeDaysAgo(8), type: 'video', notes: 'Technical screen', completed: true }
];

/**
 * Get a date string for N days ago
 */
function getDateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

/**
 * Get a datetime string for N days ago (for interviews)
 */
function getDateTimeDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(10, 0, 0, 0);
  return date.toISOString().slice(0, 16);
}

/**
 * Get a datetime string for N days from now (for future interviews)
 */
function getDateTimeDaysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(14, 0, 0, 0);
  return date.toISOString().slice(0, 16);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

/**
 * Show confirmation dialog
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
          <button type="button" class="btn btn--primary" id="confirmOkBtn">Load Demo Data</button>
        </div>
      </div>
    `;
    document.body.appendChild(confirmOverlay);

    const cancelBtn = document.getElementById('confirmCancelBtn');
    const okBtn = document.getElementById('confirmOkBtn');

    function cleanup(result) {
      confirmOverlay.remove();
      resolve(result);
    }

    cancelBtn.addEventListener('click', () => cleanup(false));
    okBtn.addEventListener('click', () => cleanup(true));
    okBtn.focus();
  });
}

/**
 * Load demo data into storage
 */
async function loadDemoData(showConfirm = true) {
  const existingApps = Storage.getApplications();
  
  if (showConfirm && existingApps.length > 0) {
    const confirmed = await showConfirmDialog(
      'Loading demo data will add sample applications to your existing data. Do you want to continue?'
    );
    if (!confirmed) return false;
  }

  const savedApps = [];
  DEMO_APPLICATIONS.forEach(appData => {
    const saved = Storage.saveApplication(appData);
    savedApps.push(saved);
  });

  DEMO_CONTACTS.forEach(contactData => {
    const app = savedApps[contactData.appIndex];
    if (app) {
      Storage.saveContact({
        applicationId: app.id,
        name: contactData.name,
        role: contactData.role,
        email: contactData.email,
        phone: contactData.phone,
        notes: contactData.notes
      });
    }
  });

  DEMO_INTERVIEWS.forEach(interviewData => {
    const app = savedApps[interviewData.appIndex];
    if (app) {
      Storage.saveInterview({
        applicationId: app.id,
        date: interviewData.date,
        type: interviewData.type,
        notes: interviewData.notes,
        completed: interviewData.completed
      });
    }
  });

  Kanban.render();
  Stats.render();
  Print.render();
  
  return true;
}

/**
 * Check if there are no applications (empty state)
 */
function isEmpty() {
  return Storage.getApplications().length === 0;
}

/**
 * Render empty state with Load Demo Data button
 */
function renderEmptyState() {
  const kanbanContainer = document.getElementById('kanban');
  if (!kanbanContainer || !isEmpty()) return;

  const emptyStateHtml = `
    <div class="empty-state">
      <div class="empty-state__content">
        <h2 class="empty-state__title">No Applications Yet</h2>
        <p class="empty-state__text">Start tracking your job applications or load sample data to explore the app.</p>
        <div class="empty-state__actions">
          <button class="btn btn--primary" id="emptyStateAddBtn">Add Application</button>
          <button class="btn btn--secondary" id="emptyStateLoadDemoBtn">Load Demo Data</button>
        </div>
      </div>
    </div>
  `;

  kanbanContainer.innerHTML = emptyStateHtml;

  document.getElementById('emptyStateAddBtn')?.addEventListener('click', () => {
    Modal.openAddApplication();
  });

  document.getElementById('emptyStateLoadDemoBtn')?.addEventListener('click', async () => {
    await loadDemoData(false);
  });
}

/**
 * Create settings dropdown menu in header
 */
function createSettingsMenu() {
  const headerNav = document.querySelector('.header__nav');
  if (!headerNav) return;

  const settingsContainer = document.createElement('div');
  settingsContainer.className = 'settings-menu';
  settingsContainer.innerHTML = `
    <button class="btn btn--icon settings-menu__toggle" aria-label="Settings menu" aria-expanded="false">⚙️</button>
    <div class="settings-menu__dropdown">
      <button class="settings-menu__item" id="loadDemoDataBtn">Load Demo Data</button>
    </div>
  `;

  headerNav.insertBefore(settingsContainer, headerNav.firstChild);

  const toggleBtn = settingsContainer.querySelector('.settings-menu__toggle');
  const dropdown = settingsContainer.querySelector('.settings-menu__dropdown');
  const loadDemoBtn = document.getElementById('loadDemoDataBtn');

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    dropdown.classList.toggle('settings-menu__dropdown--visible');
  });

  document.addEventListener('click', () => {
    toggleBtn.setAttribute('aria-expanded', 'false');
    dropdown.classList.remove('settings-menu__dropdown--visible');
  });

  loadDemoBtn.addEventListener('click', async () => {
    dropdown.classList.remove('settings-menu__dropdown--visible');
    toggleBtn.setAttribute('aria-expanded', 'false');
    await loadDemoData(true);
  });
}

/**
 * Initialize the demo module
 */
export function init() {
  createSettingsMenu();
  
  if (isEmpty()) {
    renderEmptyState();
  }
}

export default {
  init,
  loadDemoData,
  isEmpty,
  renderEmptyState
};
