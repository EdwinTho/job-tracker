# 🎯 Job Application Tracker

A comprehensive web application to track job applications through the entire hiring pipeline with a beautiful Kanban board interface.

Job Tracker Preview!
<a href="https://edwintho.github.io/job-tracker/" target="_blank">
  <img
    src="https://github.com/user-attachments/assets/f97c425e-772b-4d2e-86fc-93cd2344096e"
    alt="Job Tracker Screenshot"
    width="1512"
  />
</a>


## ✨ Features

### 📊 **Kanban Board**
- Drag-and-drop cards between 5 status columns: Applied → Screening → Interview → Offer → Rejected
- Real-time status count badges
- Smooth animations and visual feedback

### 📝 **Application Management**
- Track company name, position, job URL, salary range, location
- Add detailed notes for each application
- Manage multiple contacts per application
- Schedule and track interviews (phone, video, on-site)
- Mark interviews as completed

### 📈 **Analytics Dashboard**
- Total applications count
- Response rate calculation
- Average days to response
- Interactive Chart.js visualizations:
  - Doughnut chart showing applications by status
  - Timeline chart for last 30 days activity

### 🔍 **Smart Filtering**
- Live search by company or position
- Filter by application status
- Date range filtering
- Clear all filters with one click
- Shows "X of Y applications" when filters active

### 💾 **Data Management**
- Export all data to CSV
- Local storage persistence (data never leaves your browser)
- Demo data for testing
- Print-friendly view

### 🌓 **User Experience**
- Dark mode toggle with system preference detection
- Fully responsive (mobile, tablet, desktop)
- Touch-friendly (44px minimum touch targets)
- Keyboard accessible
- Print-optimized layout

## 🚀 Live Demo

**[View Live Demo](https://edwintho.github.io/job-tracker)** ← *Add this after deploying*

## 📸 Screenshots

*Add screenshots here after testing the app*

## 🛠️ Tech Stack

- **Frontend:** Vanilla JavaScript (ES6 modules)
- **Styling:** CSS3 with CSS Variables for theming
- **Charts:** Chart.js 4.4.1
- **Storage:** Browser LocalStorage API
- **Build:** No build process - pure HTML/CSS/JS

## 💻 Installation & Usage

1. **Clone the repository**
```bash
   git clone https://github.com/EdwinTho/job-tracker.git
   cd job-tracker
```

2. **Open in browser**
```bash
   open index.html
   # or simply double-click index.html
```

3. **Start tracking!**
   - Click "New Application" to add your first job application
   - Drag cards between columns as your application progresses
   - Click any card to view/edit details, add contacts, or schedule interviews
   - Use filters to find specific applications
   - Export your data anytime

## 📁 Project Structure
```
job-tracker/
├── index.html              # Main HTML file
├── styles.css             # All styles (light + dark theme)
├── scripts/
│   ├── app.js            # Main entry point
│   ├── storage.js        # LocalStorage abstraction
│   ├── kanban.js         # Kanban board logic
│   ├── modal.js          # Modal dialogs
│   ├── stats.js          # Statistics & charts
│   ├── filters.js        # Search & filter logic
│   ├── export.js         # CSV export
│   ├── theme.js          # Dark mode toggle
│   ├── print.js          # Print view
│   └── demo.js           # Demo data
└── README.md
```

## 🎨 Design Patterns

- **ES6 Modules:** Modern JavaScript module system
- **Module Pattern:** Each feature encapsulated in its own module
- **Event Delegation:** Efficient event handling
- **BEM CSS:** Block-Element-Modifier naming convention
- **CSS Variables:** Easy theming and consistency
- **Mobile-First:** Responsive breakpoints

## 🤖 Built With AI

This project was built **autonomously** using:
- **[Ralph](https://github.com/snarktank/ralph)** - Autonomous AI agent loop
- **[Amp](https://ampcode.com)** - AI coding assistant

Ralph completed **18 user stories** in autonomous iterations, demonstrating the power of AI-assisted development while maintaining code quality and best practices.

## 📝 Key Learnings

- Implemented HTML5 Drag & Drop API for Kanban functionality
- Used CSS Grid and Flexbox for responsive layouts
- LocalStorage data modeling with relationships (applications → contacts, interviews)
- Chart.js integration for data visualization
- Accessible modal dialogs with keyboard support
- CSS custom properties for theming

## 🔜 Future Enhancements

- [ ] Browser notifications for interview reminders
- [ ] Chrome extension to auto-save job postings
- [ ] Email integration for application tracking
- [ ] Team collaboration features
- [ ] Backend API for cross-device sync
- [ ] Integration with LinkedIn/Indeed

## 📄 License

MIT License - feel free to use this for your own job search!

## 👤 Author

**Edwin Tho**
- GitHub: [@EdwinTho](https://github.com/EdwinTho)
- LinkedIn: *[Add your LinkedIn]*

---

⭐ **Star this repo if it helped you land a job!**
