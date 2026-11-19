# TaskFlow — Modular Kanban & Productivity Workspace

A zero-dependency, responsive task and productivity management web application built with **Vanilla JavaScript (ES6 Modules)**, **CSS3**, and **HTML5**. Designed around modular state management and single-source-of-truth rendering without external frameworks.

🔗 **Live Demo:** [Add your GitHub Pages link here]

## Key Features
- **Kanban Task Board:** Full CRUD operations with status transitions across **To Do**, **In Progress**, and **Done** columns.
- **Native HTML5 Drag & Drop:** Smooth card dragging across columns using event delegation and `data-*` attributes.
- **Live Search & Priority Filters:** Non-destructive real-time filtering by keyword and priority level (`High`, `Medium`, `Low`).
- **Interactive Monthly Calendar:** Automatically maps tasks onto their due dates with priority color-coding, overdue tracking, and month navigation.
- **Productivity Analytics:** Pure CSS progress bars dynamically computing completion rates, column distribution, and priority breakdowns.
- **Quick Notes:** Persistent scratchpad for study notes and reminders with XSS-safe DOM rendering.
- **Persistent Dark/Light Theme:** CSS custom properties (`--variables`) paired with `localStorage` state persistence.

## Project Architecture
```text
TaskFlow/
├── index.html
├── README.md
├── css/
│   ├── main.css          # Theme variables, reset, base typography
│   ├── layout.css        # Grid and Flexbox page structures
│   ├── components.css    # Cards, modals, calendar, analytics, filters
│   └── responsive.css    # Mobile & tablet breakpoints
└── js/
    ├── app.js            # Entry point & event orchestration
    ├── utils.js          # ID generation & date formatting helpers
    └── modules/
        ├── storage.js    # localStorage abstraction layer
        ├── taskManager.js# Pure state & CRUD business logic
        ├── board.js      # Kanban DOM rendering & counters
        ├── dragDrop.js   # HTML5 Drag & Drop handlers
        ├── filters.js    # Search & priority filtering
        ├── calendar.js   # Dynamic monthly calendar grid
        ├── notes.js      # Notes CRUD & persistence
        ├── analytics.js  # Derived metrics & progress visualization
        └── theme.js      # Dark/Light mode toggling
```

## Tech Stack
- **Frontend:** HTML5, CSS3 (Custom Properties, Grid, Flexbox), Vanilla JavaScript (ES6+ Modules)
- **Storage:** Browser `localStorage` API

## Running Locally
Because this project uses native ES6 Modules (`type="module"`), serve it over a local HTTP server rather than opening `index.html` directly via `file://`:

1. Clone the repository:
   ```bash
   git clone [https://github.com/](https://github.com/)<your-username>/taskflow.git
   cd taskflow
   ```
2. Open with **VS Code Live Server** (right-click `index.html` → *Open with Live Server*) or run:
   ```bash
   npx serve .
   ```