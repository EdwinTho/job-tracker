/**
 * Job Application Tracker - Main Entry Point
 * Initializes the application and coordinates modules
 */

// Application state
const App = {
  initialized: false,

  /**
   * Initialize the application
   */
  init() {
    if (this.initialized) return;

    console.log('Job Application Tracker initialized');
    this.initialized = true;

    // Future modules will be initialized here
    // - storage.js
    // - kanban.js
    // - modal.js
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
