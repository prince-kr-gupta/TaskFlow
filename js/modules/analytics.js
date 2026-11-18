import { isOverdue } from "../utils.js";

export function renderAnalytics(tasks) {
    const container = document.querySelector(".analytics-container");
    if (!container) return;

    const total = tasks.length;

    if (total === 0) {
        container.innerHTML = `<p class="empty-state">Add some tasks to see your productivity analytics.</p>`;
        return;
    }

    const doneCount = tasks.filter(task => task.status === "done").length;
    const progressCount = tasks.filter(task => task.status === "in-progress").length;
    const todoCount = tasks.filter(task => task.status === "todo").length;
    const overdueCount = tasks.filter(
        task => isOverdue(task.dueDate) && task.status !== "done"
    ).length;

    const completionRate = Math.round((doneCount / total) * 100);

    const highCount = tasks.filter(task => task.priority === "high").length;
    const mediumCount = tasks.filter(task => (task.priority || "medium") === "medium").length;
    const lowCount = tasks.filter(task => task.priority === "low").length;

    const highPct = Math.round((highCount / total) * 100);
    const mediumPct = Math.round((mediumCount / total) * 100);
    const lowPct = Math.round((lowCount / total) * 100);

    container.innerHTML = `
        <div class="analytics-card">
            <div class="analytics-card-header">
                <h3>Completion Progress</h3>
                <span class="analytics-stat">${completionRate}%</span>
            </div>

            <div class="progress-track">
                <div class="progress-fill" style="width: ${completionRate}%"></div>
            </div>

            <div class="analytics-meta">
                <span>Done: <strong>${doneCount}/${total}</strong></span>
                <span>In Progress: <strong>${progressCount}</strong></span>
                <span>To Do: <strong>${todoCount}</strong></span>
                <span class="${overdueCount > 0 ? "overdue-text" : ""}">Overdue: <strong>${overdueCount}</strong></span>
            </div>
        </div>

        <div class="analytics-card">
            <div class="analytics-card-header">
                <h3>Tasks by Priority</h3>
                <span class="analytics-stat">${total} Total</span>
            </div>

            <div class="priority-bars">
                <div class="priority-row">
                    <div class="priority-row-label">
                        <span>High</span>
                        <span>${highCount} (${highPct}%)</span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill high" style="width: ${highPct}%"></div>
                    </div>
                </div>

                <div class="priority-row">
                    <div class="priority-row-label">
                        <span>Medium</span>
                        <span>${mediumCount} (${mediumPct}%)</span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill medium" style="width: ${mediumPct}%"></div>
                    </div>
                </div>

                <div class="priority-row">
                    <div class="priority-row-label">
                        <span>Low</span>
                        <span>${lowCount} (${lowPct}%)</span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill low" style="width: ${lowPct}%"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}