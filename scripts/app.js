/**
 * Job Application Tracker - Main Entry Point
 * Initializes the application and coordinates modules
 */

import Storage from './storage.js';
import Kanban from './kanban.js';
import Modal from './modal.js';
import Stats from './stats.js';
import Filters from './filters.js';
import Export from './export.js';
import Theme from './theme.js';
import Print from './print.js';
import Demo from './demo.js';

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

    // Initialize Filters first (renders filter UI)
    Filters.init();

    // Initialize Kanban board (uses Filters.applyFilters)
    Kanban.init();

    // Initialize Modal
    Modal.init();

    // Initialize Stats dashboard
    Stats.init();

    // Initialize Export
    Export.init();

    // Initialize Theme
    Theme.init();

    // Initialize Print (for print-friendly table view)
    Print.init();

    // Initialize Demo (empty state and settings menu)
    Demo.init();
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

export default App;
