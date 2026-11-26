// Kanban board
import { formatDate, isOverdue, capitalizeFirstLetter } from "../utils.js";

function createTaskCard(task) {
    const card = document.createElement("div");
    card.className = "task-card";
    card.dataset.id = task.id;
    card.draggable = true;

    const dateClass = (isOverdue(task.dueDate) && task.status !== "done") ? "task-date overdue" : "task-date";
    const dateText = task.dueDate ? formatDate(task.dueDate) : "No due date";
    const priorityLabel = capitalizeFirstLetter(task.priority || "medium");

    let buttonsHTML = "";
    buttonsHTML += task.status !== "todo" ? `<button type="button" class="move-btn" data-status="todo">To Do</button>` : "";
    buttonsHTML += task.status !== "in-progress" ? `<button type="button" class="move-btn" data-status="in-progress">In Progress</button>` : "";
    buttonsHTML += task.status !== "done" ? `<button type="button" class="move-btn" data-status="done">Done</button>` : "";
    buttonsHTML += `<button type="button" class="edit-btn">Edit</button>`;
    buttonsHTML += `<button type="button" class="delete-btn">Delete</button>`;

    card.innerHTML = `
        <span class="task-priority priority-${task.priority || "medium"}">${priorityLabel}</span>
        <h4>${task.title}</h4>
        ${task.description ? `<p>${task.description}</p>` : ""}
        <p class="${dateClass}">${dateText}</p>
        <div class="task-actions">
            ${buttonsHTML}
        </div>
    `;

    return card;
}

export function renderBoard(tasks, allTasks = tasks) {
    const todoList = document.getElementById("todoList");
    const progressList = document.getElementById("progressList");
    const doneList = document.getElementById("doneList");

    todoList.innerHTML = "";
    progressList.innerHTML = "";
    doneList.innerHTML = "";

    let todoCount = 0;
    let progressCount = 0;
    let doneCount = 0;

    for (const task of tasks) {
        const card = createTaskCard(task);

        if (task.status === "todo") {
            todoList.appendChild(card);
            todoCount++;
        } else if (task.status === "in-progress") {
            progressList.appendChild(card);
            progressCount++;
        } else if (task.status === "done") {
            doneList.appendChild(card);
            doneCount++;
        }
    }

    // Column headers show visible/filtered counts
    document.getElementById("todoCount").textContent = todoCount;
    document.getElementById("progressCount").textContent = progressCount;
    document.getElementById("doneCount").textContent = doneCount;

    // Overview cards always show total workspace stats
    document.getElementById("totalTasks").textContent = allTasks.length;
    document.getElementById("todoTasks").textContent = allTasks.filter(t => t.status === "todo").length;
    document.getElementById("progressTasks").textContent = allTasks.filter(t => t.status === "in-progress").length;
    document.getElementById("completedTasks").textContent = allTasks.filter(t => t.status === "done").length;
}