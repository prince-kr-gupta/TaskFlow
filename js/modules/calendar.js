let currentDate = new Date();
let latestTasks = [];

function formatDateKey(year, month, day) {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
}

export function renderCalendar(tasks = latestTasks) {
    latestTasks = tasks;
    const container = document.querySelector(".calendar-container");
    if (!container) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthName = currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    });

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    const todayKey = formatDateKey(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    let html = `
        <div class="calendar-header">
            <h3>${monthName}</h3>
            <div class="calendar-nav">
                <button type="button" class="secondary-btn" id="prevMonthBtn">&lt; Prev</button>
                <button type="button" class="secondary-btn" id="todayBtn">Today</button>
                <button type="button" class="secondary-btn" id="nextMonthBtn">Next &gt;</button>
            </div>
        </div>
        <div class="calendar-weekdays">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
        </div>
        <div class="calendar-grid">
    `;

    for (let i = 0; i < firstDayIndex; i++) {
        html += `<div class="calendar-day empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = formatDateKey(year, month, day);
        const isToday = dateKey === todayKey ? "today" : "";
        const dayTasks = tasks.filter(task => task.dueDate === dateKey);

        const tasksHTML = dayTasks
            .map(task => {
                const doneClass = task.status === "done" ? "done" : "";
                return `<div class="calendar-task-pill priority-${task.priority || "medium"} ${doneClass}" title="${task.title}">${task.title}</div>`;
            })
            .join("");

        html += `
            <div class="calendar-day ${isToday}">
                <span class="calendar-day-number">${day}</span>
                <div class="calendar-tasks">${tasksHTML}</div>
            </div>
        `;
    }

    html += `</div>`;
    container.innerHTML = html;

    document.getElementById("prevMonthBtn").addEventListener("click", function () {
        currentDate = new Date(year, month - 1, 1);
        renderCalendar(latestTasks);
    });

    document.getElementById("todayBtn").addEventListener("click", function () {
        currentDate = new Date();
        renderCalendar(latestTasks);
    });

    document.getElementById("nextMonthBtn").addEventListener("click", function () {
        currentDate = new Date(year, month + 1, 1);
        renderCalendar(latestTasks);
    });
}