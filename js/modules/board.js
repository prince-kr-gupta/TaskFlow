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