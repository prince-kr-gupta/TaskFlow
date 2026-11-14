import { loadTasks,addTask,moveTask,deleteTask } from "./modules/taskManager";
import { renderBoard } from "./modules/board";

const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const dateInput = document.getElementById("task-date");
const kanbanBoard = document.querySelector(".kanban-board");

const initialTasks = loadTasks();
renderBoard(initialTasks);

taskForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop the browser from refreshing the page

    const title = titleInput.value;
    const dueDate = dateInput.value;

    if (title.trim() === "") {
        return;
    }

    const updatedTasks = addTask(title, dueDate);
    renderBoard(updatedTasks);

    taskForm.reset(); // Clear the input fields after adding
});

kanbanBoard.addEventListener("click", function (event) {
    const clickedElement = event.target;

    // Find the parent task card of whatever button was clicked
    const card = clickedElement.closest(".task-card");
    if (!card) {
        return;
    }

    const taskId = card.dataset.id;

    // If a Move button was clicked
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