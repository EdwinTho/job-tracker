/**
 * Job Application Tracker - Main Entry Point
 * Initializes the application and coordinates modules
 */

import Storage from './storage.js';
import Kanban from './kanban.js';
import Modal from './modal.js';

// Application state
const App = {
  initialized: false,
  storage: Storage,

  /**
   * Initialize the application
   */
  init() {
    if (this.initialized) return;

    console.log('Job Application Tracker initialized');
    this.initialized = true;

    // Verify storage is working
    const apps = Storage.getApplications();
    console.log(`Loaded ${apps.length} applications from storage`);

    // Initialize Kanban board
    Kanban.init();

    // Initialize Modal
    Modal.init();

    // Future modules will be initialized here
    // - stats.js
    // - filters.js
    // - theme.js
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

export default App;
