// Kanban board
import { formatDate,isOverdue } from "../utils";

function createTaskCard(task) {
    const card = document.createElement("div");
    card.className = "task-card";
    card.dataset.id = task.id;

    const dateClass = (isOverdue(task.dueDate) && task.status !== "done") ? "overdue" : "";
    const dateText = task.dueDate ? formatDate(task.dueDate) : "No due date";

    card.innerHTML = `
    <h4>${task.title}</h4>
    <p class="${dateClass}">${dateText}</p>
    <div class="task-actions">
    ${buttonsHTML}
    </div>
    `;
return card;

}

export function renderBoard(tasks) {
    const todoList = document.querySelector("#todo-list");
    const inprogressList = document.querySelector("#inprogress-list");
    const doneList = document.querySelector("#done-list");

    todoList.innerHTML = "";
    inprogressList.innerHTML= "";
    doneList.innerHTML = "";

    for(const task of tasks) {
        const card  = createTaskCard(task);

        if(task.status === "todo") {
            todoList.appendChild(card);

        }
        else if(task.status === "inprogress") {
            inprogressList.appendChild(card);
        }
        else if(task.status === "done") {
            doneList.appendChild(card);
        }
    }
}