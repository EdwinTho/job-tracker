/**
 * Storage Module - Data persistence layer using localStorage
 * Manages applications, contacts, and interviews data
 */

const STORAGE_KEY = 'jobTrackerData';

/**
 * Get the initial empty data structure
 */
function getEmptyData() {
  return {
    applications: [],
    contacts: [],
    interviews: []
  };
}

/**
 * Load all data from localStorage
 */
function loadData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading data from localStorage:', e);
  }
  return getEmptyData();
}

/**
 * Save all data to localStorage
 */
function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error saving data to localStorage:', e);
    return false;
  }
}

/**
 * Generate a unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// ============ Applications ============

/**
 * Get all applications
 * @returns {Array} Array of application objects
 */
export function getApplications() {
  const data = loadData();
  return data.applications;
}

/**
 * Get a single application by ID
 * @param {string} id - Application ID
 * @returns {Object|null} Application object or null if not found
 */
export function getApplicationById(id) {
  const applications = getApplications();
  return applications.find(app => app.id === id) || null;
}

/**
 * Save (create or update) an application
 * @param {Object} application - Application object
 * @returns {Object} Saved application with id and timestamps
 */
export function saveApplication(application) {
  const data = loadData();
  const now = new Date().toISOString();

  if (application.id) {
    // Update existing application
    const index = data.applications.findIndex(app => app.id === application.id);
    if (index !== -1) {
      data.applications[index] = {
        ...data.applications[index],
        ...application,
        updatedAt: now
      };
      saveData(data);
      return data.applications[index];
    }
  }

  // Create new application
  const newApplication = {
    id: generateId(),
    companyName: application.companyName || '',
    position: application.position || '',
    jobUrl: application.jobUrl || '',
    dateApplied: application.dateApplied || now.split('T')[0],
    salaryMin: application.salaryMin || null,
    salaryMax: application.salaryMax || null,
    location: application.location || '',
    status: application.status || 'Applied',
    notes: application.notes || '',
    createdAt: now,
    updatedAt: now
  };

  data.applications.push(newApplication);
  saveData(data);
  return newApplication;
}

/**
 * Delete an application and its associated contacts and interviews
 * @param {string} id - Application ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteApplication(id) {
  const data = loadData();
  const index = data.applications.findIndex(app => app.id === id);

  if (index === -1) {
    return false;
  }

  // Remove the application
  data.applications.splice(index, 1);

  // Remove associated contacts
  data.contacts = data.contacts.filter(contact => contact.applicationId !== id);

  // Remove associated interviews
  data.interviews = data.interviews.filter(interview => interview.applicationId !== id);

  saveData(data);
  return true;
}

// ============ Contacts ============

/**
 * Get all contacts for an application
 * @param {string} applicationId - Application ID
 * @returns {Array} Array of contact objects
 */
export function getContacts(applicationId) {
  const data = loadData();
  return data.contacts.filter(contact => contact.applicationId === applicationId);
}

/**
 * Save (create or update) a contact
 * @param {Object} contact - Contact object with applicationId
 * @returns {Object} Saved contact with id
 */
export function saveContact(contact) {
  const data = loadData();

  if (contact.id) {
    // Update existing contact
    const index = data.contacts.findIndex(c => c.id === contact.id);
    if (index !== -1) {
      data.contacts[index] = {
        ...data.contacts[index],
        ...contact
      };
      saveData(data);
      return data.contacts[index];
    }
  }

  // Create new contact
  const newContact = {
    id: generateId(),
    applicationId: contact.applicationId,
    name: contact.name || '',
    role: contact.role || '',
    email: contact.email || '',
    phone: contact.phone || '',
    notes: contact.notes || ''
  };

  data.contacts.push(newContact);
  saveData(data);
  return newContact;
}

/**
 * Delete a contact
 * @param {string} id - Contact ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteContact(id) {
  const data = loadData();
  const index = data.contacts.findIndex(c => c.id === id);

  if (index === -1) {
    return false;
  }

  data.contacts.splice(index, 1);
  saveData(data);
  return true;
}

// ============ Interviews ============

/**
 * Get all interviews for an application
 * @param {string} applicationId - Application ID
 * @returns {Array} Array of interview objects
 */
export function getInterviews(applicationId) {
  const data = loadData();
  return data.interviews.filter(interview => interview.applicationId === applicationId);
}

/**
 * Save (create or update) an interview
 * @param {Object} interview - Interview object with applicationId
 * @returns {Object} Saved interview with id
 */
export function saveInterview(interview) {
  const data = loadData();

  if (interview.id) {
    // Update existing interview
    const index = data.interviews.findIndex(i => i.id === interview.id);
    if (index !== -1) {
      data.interviews[index] = {
        ...data.interviews[index],
        ...interview
      };
      saveData(data);
      return data.interviews[index];
    }
  }

  // Create new interview
  const newInterview = {
    id: generateId(),
    applicationId: interview.applicationId,
    date: interview.date || '',
    type: interview.type || 'phone', // phone, video, onsite
    notes: interview.notes || '',
    completed: interview.completed || false
  };

  data.interviews.push(newInterview);
  saveData(data);
  return newInterview;
}

/**
 * Delete an interview
 * @param {string} id - Interview ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteInterview(id) {
  const data = loadData();
  const index = data.interviews.findIndex(i => i.id === id);

  if (index === -1) {
    return false;
  }

  data.interviews.splice(index, 1);
  saveData(data);
  return true;
}

// ============ Utility ============

/**
 * Clear all data (for testing/reset)
 * @returns {boolean} True if cleared successfully
 */
export function clearAllData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('Error clearing data:', e);
    return false;
  }
}

/**
 * Get all data (for export/backup)
 * @returns {Object} Complete data object
 */
export function getAllData() {
  return loadData();
}

export default {
  getApplications,
  getApplicationById,
  saveApplication,
  deleteApplication,
  getContacts,
  saveContact,
  deleteContact,
  getInterviews,
  saveInterview,
  deleteInterview,
  clearAllData,
  getAllData
};
