/**
 * Filters Module - Search and filter functionality for applications
 */

import Storage from './storage.js';
import Kanban from './kanban.js';
import Stats from './stats.js';

const STATUSES = ['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

// Current filter state
const state = {
  searchQuery: '',
  status: 'All',
  dateFrom: '',
  dateTo: ''
};

/**
 * Get the current filter state
 */
export function getFilterState() {
  return { ...state };
}

/**
 * Apply filters to applications and return filtered list
 */
export function applyFilters(applications) {
  let filtered = [...applications];

  // Search filter (company name and position)
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(app => 
      app.companyName.toLowerCase().includes(query) ||
      app.position.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (state.status && state.status !== 'All') {
    filtered = filtered.filter(app => app.status === state.status);
  }

  // Date from filter
  if (state.dateFrom) {
    const fromDate = new Date(state.dateFrom);
    fromDate.setHours(0, 0, 0, 0);
    filtered = filtered.filter(app => {
      const appDate = new Date(app.dateApplied);
      return appDate >= fromDate;
    });
  }

  // Date to filter
  if (state.dateTo) {
    const toDate = new Date(state.dateTo);
    toDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter(app => {
      const appDate = new Date(app.dateApplied);
      return appDate <= toDate;
    });
  }

  return filtered;
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters() {
  return state.searchQuery !== '' || 
         state.status !== 'All' || 
         state.dateFrom !== '' || 
         state.dateTo !== '';
}

/**
 * Clear all filters
 */
function clearFilters() {
  state.searchQuery = '';
  state.status = 'All';
  state.dateFrom = '';
  state.dateTo = '';
  
  // Update UI inputs
  const searchInput = document.getElementById('filterSearch');
  const statusSelect = document.getElementById('filterStatus');
  const dateFromInput = document.getElementById('filterDateFrom');
  const dateToInput = document.getElementById('filterDateTo');
  
  if (searchInput) searchInput.value = '';
  if (statusSelect) statusSelect.value = 'All';
  if (dateFromInput) dateFromInput.value = '';
  if (dateToInput) dateToInput.value = '';
  
  updateFilteredCount();
  Kanban.render();
}

/**
 * Update the filtered results count display
 */
function updateFilteredCount() {
  const countElement = document.getElementById('filterCount');
  if (!countElement) return;
  
  const allApplications = Storage.getApplications();
  const filteredApplications = applyFilters(allApplications);
  
  if (hasActiveFilters()) {
    countElement.textContent = `Showing ${filteredApplications.length} of ${allApplications.length}`;
    countElement.classList.remove('filters__count--hidden');
  } else {
    countElement.classList.add('filters__count--hidden');
  }
}

/**
 * Handle search input
 */
function handleSearchInput(e) {
  state.searchQuery = e.target.value;
  updateFilteredCount();
  Kanban.render();
}

/**
 * Handle status filter change
 */
function handleStatusChange(e) {
  state.status = e.target.value;
  updateFilteredCount();
  Kanban.render();
}

/**
 * Handle date from change
 */
function handleDateFromChange(e) {
  state.dateFrom = e.target.value;
  updateFilteredCount();
  Kanban.render();
}

/**
 * Handle date to change
 */
function handleDateToChange(e) {
  state.dateTo = e.target.value;
  updateFilteredCount();
  Kanban.render();
}

/**
 * Render the filter bar HTML
 */
function render() {
  const container = document.getElementById('filters');
  if (!container) return;
  
  container.innerHTML = `
    <div class="filters__bar">
      <div class="filters__search">
        <input 
          type="text" 
          id="filterSearch" 
          class="form__input filters__input" 
          placeholder="Search company or position..."
          value="${state.searchQuery}"
        >
      </div>
      <div class="filters__group">
        <label for="filterStatus" class="visually-hidden">Filter by status</label>
        <select id="filterStatus" class="form__select filters__select">
          ${STATUSES.map(status => 
            `<option value="${status}" ${state.status === status ? 'selected' : ''}>${status}</option>`
          ).join('')}
        </select>
      </div>
      <div class="filters__group filters__dates">
        <label for="filterDateFrom" class="visually-hidden">From date</label>
        <input 
          type="date" 
          id="filterDateFrom" 
          class="form__input filters__input filters__input--date" 
          value="${state.dateFrom}"
          title="From date"
        >
        <span class="filters__date-separator">to</span>
        <label for="filterDateTo" class="visually-hidden">To date</label>
        <input 
          type="date" 
          id="filterDateTo" 
          class="form__input filters__input filters__input--date" 
          value="${state.dateTo}"
          title="To date"
        >
      </div>
      <button type="button" id="filterClearBtn" class="btn btn--secondary btn--small">Clear</button>
      <span id="filterCount" class="filters__count filters__count--hidden"></span>
    </div>
  `;
}

/**
 * Set up event listeners for filter controls
 */
function setupEventListeners() {
  const container = document.getElementById('filters');
  if (!container) return;
  
  const searchInput = document.getElementById('filterSearch');
  const statusSelect = document.getElementById('filterStatus');
  const dateFromInput = document.getElementById('filterDateFrom');
  const dateToInput = document.getElementById('filterDateTo');
  const clearBtn = document.getElementById('filterClearBtn');
  
  if (searchInput) {
    searchInput.addEventListener('keyup', handleSearchInput);
  }
  
  if (statusSelect) {
    statusSelect.addEventListener('change', handleStatusChange);
  }
  
  if (dateFromInput) {
    dateFromInput.addEventListener('change', handleDateFromChange);
  }
  
  if (dateToInput) {
    dateToInput.addEventListener('change', handleDateToChange);
  }
  
  if (clearBtn) {
    clearBtn.addEventListener('click', clearFilters);
  }
}

/**
 * Initialize the filters module
 */
export function init() {
  render();
  setupEventListeners();
  updateFilteredCount();
}

export default {
  init,
  applyFilters,
  getFilterState,
  hasActiveFilters
};
