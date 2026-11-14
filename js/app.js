import { loadTasks, addTask, moveTask, deleteTask } from "./modules/taskManager.js";
import { renderBoard } from "./modules/board.js";
import { initTheme } from "./modules/theme.js";


const taskModal = document.getElementById("taskModal");
const addTaskBtn = document.getElementById("addTaskBtn");
const closeTaskModal = document.getElementById("closeTaskModal");

const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("taskTitle");
const descriptionInput = document.getElementById("taskDescription");
const priorityInput = document.getElementById("taskPriority");
const dateInput = document.getElementById("taskDueDate");
const kanbanBoard = document.querySelector(".kanban-board");

initTheme();
const initialTasks = loadTasks();
renderBoard(initialTasks);


addTaskBtn.addEventListener("click", function () {
    taskModal.classList.remove("hidden");
});

closeTaskModal.addEventListener("click", function () {
    taskModal.classList.add("hidden");
});

taskModal.addEventListener("click", function (event) {
    if (event.target === taskModal) {
        taskModal.classList.add("hidden");
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
    renderBoard(updatedTasks);

    taskForm.reset();
    taskModal.classList.add("hidden");
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
        renderBoard(updatedTasks);
    }

    if (clickedElement.classList.contains("delete-btn")) {
        const updatedTasks = deleteTask(taskId);
        renderBoard(updatedTasks);
    }
});