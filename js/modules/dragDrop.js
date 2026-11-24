import { moveTask } from "./taskManager.js";
import { renderBoard } from "./board.js";

export function initDragDrop(onTaskDrop) {
    const kanbanBoard = document.querySelector(".kanban-board");
    const columns = document.querySelectorAll(".kanban-column");
    let draggedTaskId = null;

    kanbanBoard.addEventListener("dragstart", function (event) {
        const card = event.target.closest(".task-card");
        if (!card) return;

        draggedTaskId = card.dataset.id;
        card.classList.add("dragging");
    });

    kanbanBoard.addEventListener("dragend", function (event) {
        const card = event.target.closest(".task-card");
        if (card) card.classList.remove("dragging");

        for (const column of columns) {
            column.classList.remove("drag-over");
        }
    });

    for (const column of columns) {
        column.addEventListener("dragover", function (event) {
            event.preventDefault();
            column.classList.add("drag-over");
        });

        column.addEventListener("dragleave", function () {
            column.classList.remove("drag-over");
        });

        column.addEventListener("drop", function (event) {
            event.preventDefault();
            column.classList.remove("drag-over");

            if (!draggedTaskId) return;

            const newStatus = column.dataset.status;
            const updatedTasks = moveTask(draggedTaskId, newStatus);

            if (typeof onTaskDrop === "function") {
                onTaskDrop(updatedTasks);
            } else {
                renderBoard(updatedTasks);
            }

            draggedTaskId = null;
        });
    }
}