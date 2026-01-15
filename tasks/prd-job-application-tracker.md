# PRD: Job Application Tracker

## Introduction

A web-based Job Application Tracker that helps job seekers organize and monitor their job search pipeline. The application provides a Kanban-style board for visualizing application status, detailed tracking of each application with notes and contacts, and analytics to understand job search performance. All data persists locally in the browser using localStorage.

**Branch:** `feature/job-tracker-mvp`

## Goals

- Provide a visual Kanban board to track application pipeline stages
- Enable quick entry and management of job applications
- Store detailed information including contacts, notes, and interview schedules
- Display meaningful statistics about job search progress
- Work offline with localStorage persistence
- Deliver a responsive, mobile-friendly experience
- Support dark mode for user preference

## User Stories

### US-001: Project Setup and Base Structure
**Description:** As a developer, I need the base HTML/CSS/JS structure so I can build features on a solid foundation.

**Acceptance Criteria:**
- [ ] Create index.html with semantic structure
- [ ] Create styles.css with CSS variables for theming (light/dark)
- [ ] Create app.js as main entry point
- [ ] Set up CSS reset and base typography
- [ ] Implement responsive breakpoints (mobile: <768px, tablet: 768-1024px, desktop: >1024px)
- [ ] Verify in browser - page loads without errors

---

### US-002: Data Model and localStorage Service
**Description:** As a developer, I need a data layer to persist and retrieve application data.

**Acceptance Criteria:**
- [ ] Create storage.js module with CRUD operations
- [ ] Data structure includes: applications array, contacts array, interviews array
- [ ] Application schema: id, companyName, position, jobUrl, dateApplied, salaryMin, salaryMax, location, status, notes, createdAt, updatedAt
- [ ] Contact schema: id, applicationId, name, role, email, phone, notes
- [ ] Interview schema: id, applicationId, date, type (phone/video/onsite), notes, completed
- [ ] All data saves to localStorage under key "jobTrackerData"
- [ ] Include methods: getApplications(), saveApplication(), deleteApplication(), getContacts(appId), saveContact(), getInterviews(appId), saveInterview()
- [ ] Verify data persists after page reload

---

### US-003: Add New Application Form
**Description:** As a job seeker, I want to add new job applications so I can track them.

**Acceptance Criteria:**
- [ ] Modal form with fields: company name (required), position (required), job URL, date applied (default today), salary min, salary max, location
- [ ] Form validates required fields before submission
- [ ] New applications default to "Applied" status
- [ ] Modal closes on successful save
- [ ] Keyboard accessible (Escape closes, Tab navigation works)
- [ ] Verify in browser - can add application and see it appear

---

### US-004: Kanban Board Display
**Description:** As a job seeker, I want to see my applications organized by status in columns so I can visualize my pipeline.

**Acceptance Criteria:**
- [ ] Display 5 columns: Applied, Screening, Interview, Offer, Rejected
- [ ] Each column shows count of applications
- [ ] Application cards show: company name, position, date applied, location
- [ ] Cards are visually distinct and readable
- [ ] Empty columns show placeholder message
- [ ] Columns scroll independently when content overflows
- [ ] Verify in browser - applications display in correct columns

---

### US-005: Drag and Drop Between Columns
**Description:** As a job seeker, I want to drag applications between columns so I can update their status quickly.

**Acceptance Criteria:**
- [ ] Implement using HTML5 Drag and Drop API
- [ ] Visual feedback when dragging (card opacity, cursor change)
- [ ] Drop zones highlight when card hovers over them
- [ ] Status updates in localStorage on drop
- [ ] Card animates into new position
- [ ] Works with keyboard (optional enhancement)
- [ ] Verify in browser - drag card between columns, status persists after reload

---

### US-006: Application Details View
**Description:** As a job seeker, I want to view and edit full details of an application so I can add notes and track progress.

**Acceptance Criteria:**
- [ ] Click on card opens detail modal/panel
- [ ] Shows all application fields (editable)
- [ ] Notes section with textarea for freeform text
- [ ] Contacts section: list existing, add new contact
- [ ] Interviews section: list scheduled interviews, add new with date/type
- [ ] Save and Cancel buttons
- [ ] Delete application option with confirmation
- [ ] Verify in browser - edit application, add contact, add interview

---

### US-007: Statistics Dashboard
**Description:** As a job seeker, I want to see statistics about my job search so I can understand my progress.

**Acceptance Criteria:**
- [ ] Dashboard section above or beside Kanban board
- [ ] Display: total applications count
- [ ] Display: applications by status (bar or pie chart)
- [ ] Display: response rate (% moved past "Applied")
- [ ] Display: average days to first response
- [ ] Display: applications over time (last 30 days line chart)
- [ ] Charts built with Chart.js via CDN
- [ ] Verify in browser - statistics update when applications change

---

### US-008: Search and Filter
**Description:** As a job seeker, I want to search and filter applications so I can find specific ones quickly.

**Acceptance Criteria:**
- [ ] Search bar filters by company name and position (live search)
- [ ] Filter dropdown for status (All, Applied, Screening, Interview, Offer, Rejected)
- [ ] Filter by date range (from/to date pickers)
- [ ] Filters combine (search + status + date)
- [ ] Clear filters button
- [ ] Show count of filtered results
- [ ] Verify in browser - filters work correctly, show/hide applications

---

### US-009: Export to CSV
**Description:** As a job seeker, I want to export my data to CSV so I can backup or analyze in spreadsheet software.

**Acceptance Criteria:**
- [ ] Export button in header or settings
- [ ] CSV includes all application fields
- [ ] Filename format: job-applications-YYYY-MM-DD.csv
- [ ] Triggers browser download
- [ ] Handles special characters (commas, quotes) correctly
- [ ] Verify - exported CSV opens correctly in spreadsheet app

---

### US-010: Dark Mode Toggle
**Description:** As a user, I want to toggle dark mode so I can use the app comfortably in low light.

**Acceptance Criteria:**
- [ ] Toggle button in header (icon: sun/moon)
- [ ] Dark theme uses CSS variables for colors
- [ ] Theme preference saves to localStorage
- [ ] Respects system preference on first load (prefers-color-scheme)
- [ ] Smooth transition between themes
- [ ] Verify in browser - toggle works, persists after reload

---

### US-011: Mobile Responsive Design
**Description:** As a job seeker, I want to use the app on my phone so I can update applications on the go.

**Acceptance Criteria:**
- [ ] Kanban columns stack or become horizontally scrollable on mobile
- [ ] Touch-friendly tap targets (min 44px)
- [ ] Modals are full-screen on mobile
- [ ] Navigation hamburger menu if needed
- [ ] Statistics charts resize appropriately
- [ ] Verify in browser - test at 375px width, all features accessible

---

### US-012: Print-Friendly View
**Description:** As a job seeker, I want to print my applications so I can have a physical reference.

**Acceptance Criteria:**
- [ ] Print stylesheet hides non-essential UI (buttons, navigation)
- [ ] Applications display in clean table format
- [ ] Includes: company, position, status, date applied, location
- [ ] Fits on standard letter/A4 paper
- [ ] Verify - print preview shows clean layout

---

### US-013: Demo Data Toggle
**Description:** As a new user, I want to load sample data so I can explore the app's features.

**Acceptance Criteria:**
- [ ] "Load Demo Data" button visible when no applications exist
- [ ] Also accessible from settings/menu
- [ ] Loads 8-10 sample applications across all statuses
- [ ] Demo data includes varied companies, positions, dates
- [ ] Confirmation before loading (warns it won't overwrite existing)
- [ ] Verify in browser - demo data loads and displays correctly

---

## Functional Requirements

- FR-1: The system must store all data in browser localStorage
- FR-2: The system must display applications in a 5-column Kanban board (Applied, Screening, Interview, Offer, Rejected)
- FR-3: The system must allow drag-and-drop of application cards between columns using HTML5 Drag API
- FR-4: The system must update application status in storage when dropped in a new column
- FR-5: The system must provide a form to add new applications with required fields (company, position)
- FR-6: The system must provide a detail view to edit applications, add notes, contacts, and interviews
- FR-7: The system must calculate and display statistics: total count, status distribution, response rate, avg response time
- FR-8: The system must render charts using Chart.js library
- FR-9: The system must filter applications by search text, status, and date range
- FR-10: The system must export all application data to a downloadable CSV file
- FR-11: The system must toggle between light and dark themes
- FR-12: The system must persist theme preference in localStorage
- FR-13: The system must be fully functional on mobile devices (320px - 768px width)
- FR-14: The system must provide print styles for clean printed output
- FR-15: The system must offer optional demo data loading for new users

## Non-Goals

- No user authentication or accounts
- No cloud sync or backend server
- No sharing or collaboration features
- No email/calendar integrations
- No browser notifications or reminders
- No import from external job boards (LinkedIn, Indeed, etc.)
- No resume or document storage
- No AI-powered features (auto-categorization, suggestions)

## Technical Considerations

- **No frameworks:** Pure vanilla JavaScript ES6+ modules
- **CSS:** Modern CSS with custom properties, flexbox, grid
- **Drag and Drop:** HTML5 Drag and Drop API (dragstart, dragover, drop events)
- **Charts:** Chart.js loaded via CDN (https://cdn.jsdelivr.net/npm/chart.js)
- **Data format:** JSON stored in localStorage
- **Browser support:** Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- **File structure:**
  ```
  /
  ├── index.html
  ├── styles.css
  ├── scripts/
  │   ├── app.js          (main entry, initialization)
  │   ├── storage.js      (localStorage CRUD)
  │   ├── kanban.js       (board rendering, drag-drop)
  │   ├── modal.js        (form/detail modals)
  │   ├── stats.js        (statistics calculation, charts)
  │   ├── filters.js      (search, filter logic)
  │   ├── export.js       (CSV export)
  │   └── theme.js        (dark mode toggle)
  └── tasks/
      └── prd-job-application-tracker.md
  ```

## Design Considerations

- Clean, minimal UI with clear visual hierarchy
- Status columns use distinct colors (e.g., blue=Applied, yellow=Screening, purple=Interview, green=Offer, red=Rejected)
- Cards should be scannable - key info visible at a glance
- Consistent spacing using 8px grid system
- Accessible contrast ratios (WCAG AA)
- Focus states for keyboard navigation

## Success Metrics

- User can add a new application in under 30 seconds
- Drag-and-drop status change takes under 2 seconds
- Page loads in under 1 second with 100+ applications
- All features accessible on mobile without horizontal scrolling (except Kanban columns)
- Statistics update immediately when data changes

## Open Questions

- Should there be undo functionality for accidental deletions?
- Should the app warn before closing with unsaved changes in a form?
- Should archived/old applications be hidden by default?
