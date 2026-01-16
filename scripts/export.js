/**
 * Export Module - CSV export functionality for job applications
 */

import { getApplications } from './storage.js';

const Export = {
  /**
   * Initialize the export module
   */
  init() {
    this.addExportButton();
  },

  /**
   * Add export button to the header navigation
   */
  addExportButton() {
    const nav = document.querySelector('.header__nav');
    if (!nav) return;

    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn--secondary';
    exportBtn.id = 'exportBtn';
    exportBtn.textContent = 'Export CSV';
    exportBtn.addEventListener('click', () => this.exportToCSV());

    nav.insertBefore(exportBtn, nav.firstChild);
  },

  /**
   * Escape a value for CSV format
   * Handles commas, quotes, and newlines
   */
  escapeCSVValue(value) {
    if (value === null || value === undefined) {
      return '';
    }

    const str = String(value);
    
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    
    return str;
  },

  /**
   * Generate CSV content from applications
   */
  generateCSV(applications) {
    const headers = [
      'ID',
      'Company Name',
      'Position',
      'Job URL',
      'Date Applied',
      'Salary Min',
      'Salary Max',
      'Location',
      'Status',
      'Notes',
      'Created At',
      'Updated At'
    ];

    const rows = applications.map(app => [
      app.id,
      app.companyName,
      app.position,
      app.jobUrl,
      app.dateApplied,
      app.salaryMin,
      app.salaryMax,
      app.location,
      app.status,
      app.notes,
      app.createdAt,
      app.updatedAt
    ].map(val => this.escapeCSVValue(val)));

    const headerRow = headers.map(h => this.escapeCSVValue(h)).join(',');
    const dataRows = rows.map(row => row.join(','));

    return [headerRow, ...dataRows].join('\n');
  },

  /**
   * Get formatted date for filename (YYYY-MM-DD)
   */
  getDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Export applications to CSV file
   */
  exportToCSV() {
    const applications = getApplications();
    const csvContent = this.generateCSV(applications);
    const filename = `job-applications-${this.getDateString()}.csv`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
};

export default Export;
