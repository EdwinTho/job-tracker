/**
 * Print Module - Generates print-friendly table view
 * Renders applications as a table for printing
 */

import Storage from './storage.js';

const Print = {
  /**
   * Initialize the print module
   */
  init() {
    this.renderPrintTable();
    
    // Re-render when storage changes (other modules call this)
    window.addEventListener('storage-updated', () => {
      this.renderPrintTable();
    });
  },

  /**
   * Render the print table
   */
  renderPrintTable() {
    const main = document.querySelector('.main');
    if (!main) return;

    // Remove existing print elements
    const existingTable = document.querySelector('.print-table');
    const existingDate = document.querySelector('.print-date');
    if (existingTable) existingTable.remove();
    if (existingDate) existingDate.remove();

    const applications = Storage.getApplications();
    
    // Sort by status, then by company name
    const statusOrder = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];
    applications.sort((a, b) => {
      const statusDiff = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      if (statusDiff !== 0) return statusDiff;
      return a.companyName.localeCompare(b.companyName);
    });

    // Create print date
    const printDate = document.createElement('p');
    printDate.className = 'print-date';
    printDate.textContent = `Printed: ${new Date().toLocaleDateString()}`;
    main.insertBefore(printDate, main.firstChild);

    // Create table
    const table = document.createElement('table');
    table.className = 'print-table';

    // Table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Company</th>
        <th>Position</th>
        <th>Status</th>
        <th>Date Applied</th>
        <th>Location</th>
      </tr>
    `;
    table.appendChild(thead);

    // Table body
    const tbody = document.createElement('tbody');
    
    if (applications.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = '<td colspan="5" style="text-align: center;">No applications to display</td>';
      tbody.appendChild(emptyRow);
    } else {
      applications.forEach(app => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${this.escapeHtml(app.companyName)}</td>
          <td>${this.escapeHtml(app.position)}</td>
          <td>${this.escapeHtml(app.status)}</td>
          <td>${this.formatDate(app.dateApplied)}</td>
          <td>${this.escapeHtml(app.location || '—')}</td>
        `;
        tbody.appendChild(row);
      });
    }
    
    table.appendChild(tbody);
    main.appendChild(table);
  },

  /**
   * Format date for display
   */
  formatDate(dateStr) {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Trigger a refresh of the print table
   */
  render() {
    this.renderPrintTable();
  }
};

export default Print;
