import { loadTasks, addTask, editTask, moveTask, deleteTask } from "./modules/taskManager.js";
import { renderBoard } from "./modules/board.js";
import { initTheme } from "./modules/theme.js";
import { initDragDrop } from "./modules/dragDrop.js";
import { renderCalendar } from "./modules/calendar.js";
import { initNotes } from "./modules/notes.js";
import { renderAnalytics } from "./modules/analytics.js";
import { filterTasks, sortTasks, initFilters } from "./modules/filters.js";

const taskModal = document.getElementById("taskModal");
const modalTitle = taskModal.querySelector(".modal-header h2");
const addTaskBtn = document.getElementById("addTaskBtn");
const closeTaskModal = document.getElementById("closeTaskModal");

const taskForm = document.getElementById("taskForm");
const modalSubmitBtn = taskForm.querySelector('button[type="submit"]');
const titleInput = document.getElementById("taskTitle");
const descriptionInput = document.getElementById("taskDescription");
const priorityInput = document.getElementById("taskPriority");
const dateInput = document.getElementById("taskDueDate");

const kanbanBoard = document.querySelector(".kanban-board");
const navLinks = document.querySelectorAll(".nav-link");
const headerTitle = document.querySelector(".header-left h2");

let tasks = loadTasks();
let editingTaskId = null;

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

function openModal(taskToEdit = null) {
    if (taskToEdit) {
        editingTaskId = taskToEdit.id;
        modalTitle.textContent = "Edit Task";
        modalSubmitBtn.textContent = "Save Changes";
        titleInput.value = taskToEdit.title;
        descriptionInput.value = taskToEdit.description || "";
        priorityInput.value = taskToEdit.priority || "medium";
        dateInput.value = taskToEdit.dueDate || "";
    } else {
        editingTaskId = null;
        modalTitle.textContent = "Add New Task";
        modalSubmitBtn.textContent = "Create Task";
        taskForm.reset();
    }

    taskModal.classList.remove("hidden");
    taskModal.setAttribute("aria-hidden", "false");
    titleInput.focus();
}

function closeModal() {
    editingTaskId = null;
    taskForm.reset();
    taskModal.classList.add("hidden");
    taskModal.setAttribute("aria-hidden", "true");
}

// Initialize modules
initNotes();
initTheme();
initDragDrop(updateBoard);
updateBoard(tasks);

// Modal events
addTaskBtn.addEventListener("click", () => openModal());
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

// Create or Edit task submit
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = titleInput.value;
    const description = descriptionInput.value;
    const priority = priorityInput.value;
    const dueDate = dateInput.value;

    if (title.trim() === "") {
        return;
    }

    const updatedTasks = editingTaskId
        ? editTask(editingTaskId, { title, description, priority, dueDate })
        : addTask(title, description, priority, dueDate);

    updateBoard(updatedTasks);
    closeModal();
});

// Kanban card actions (Move, Edit, Delete)
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

    if (clickedElement.classList.contains("edit-btn")) {
        const taskToEdit = tasks.find(t => t.id === taskId);
        if (taskToEdit) {
            openModal(taskToEdit);
        }
    }

    if (clickedElement.classList.contains("delete-btn")) {
        const updatedTasks = deleteTask(taskId);
        updateBoard(updatedTasks);
    }
});

// Active sidebar navigation & header sync
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.forEach(item => item.classList.remove("active"));
        link.classList.add("active");
        if (headerTitle) {
            headerTitle.textContent = link.textContent.trim();
        }
    });
});