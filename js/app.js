import { loadTasks, addTask, moveTask, deleteTask } from "./modules/taskManager.js";
import { renderBoard } from "./modules/board.js";
import { initTheme } from "./modules/theme.js";
import { initDragDrop } from "./modules/dragDrop.js";
import { renderCalendar } from "./modules/calendar.js";
import { initNotes } from "./modules/notes.js";
import { renderAnalytics } from "./modules/analytics.js";
import { filterTasks, sortTasks, initFilters } from "./modules/filters.js";

const taskModal = document.getElementById("taskModal");
const addTaskBtn = document.getElementById("addTaskBtn");
const closeTaskModal = document.getElementById("closeTaskModal");

const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("taskTitle");
const descriptionInput = document.getElementById("taskDescription");
const priorityInput = document.getElementById("taskPriority");
const dateInput = document.getElementById("taskDueDate");
const kanbanBoard = document.querySelector(".kanban-board");

let tasks = loadTasks();

const { getFilterState } = initFilters(() => {
    updateBoard(tasks);
});

function updateBoard(latestTasks = loadTasks()) {
    tasks = latestTasks;

    const currentFilters = getFilterState();
    const filtered = filterTasks(tasks, currentFilters);
    const visibleTasks = sortTasks(filtered, currentFilters.sortBy);

    renderBoard(visibleTasks, tasks);
    renderCalendar(tasks);
    renderAnalytics(tasks);
}

initNotes();
initTheme();
initDragDrop(updateBoard);
updateBoard(tasks);

addTaskBtn.addEventListener("click", function () {
    taskModal.classList.remove("hidden");
    taskModal.setAttribute("aria-hidden", "false");
    titleInput.focus();
});

function closeModal() {
    taskModal.classList.add("hidden");
    taskModal.setAttribute("aria-hidden", "true");
}

closeTaskModal.addEventListener("click", closeModal);

taskModal.addEventListener("click", function (event) {
    if (event.target === taskModal) {
        closeModal();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !taskModal.classList.contains("hidden")) {
        closeModal();
    }
});

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = titleInput.value;
    const description = descriptionInput.value;
    const priority = priorityInput.value;
    const dueDate = dateInput.value;

    if (title.trim() === "") {
        return;
    }

    const updatedTasks = addTask(title, description, priority, dueDate);
    updateBoard(updatedTasks);

    taskForm.reset();
    closeModal();
});

kanbanBoard.addEventListener("click", function (event) {
    const clickedElement = event.target;
    const card = clickedElement.closest(".task-card");

    if (!card) {
        return;
    }

    const taskId = card.dataset.id;

    if (clickedElement.classList.contains("move-btn")) {
        const newStatus = clickedElement.dataset.status;
        const updatedTasks = moveTask(taskId, newStatus);
        updateBoard(updatedTasks);
    }

    if (clickedElement.classList.contains("delete-btn")) {
        const updatedTasks = deleteTask(taskId);
        updateBoard(updatedTasks);
    }
});