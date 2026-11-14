import { generateId } from "../utils.js";
import { getTasks, saveTasks } from "./storage.js";

export function loadTasks() {
    return getTasks();
}

export function addTask(title, description, priority, dueDate) {
    const tasks = getTasks();

    const newTask = {
        id: generateId(),
        title: title.trim(),
        description: description.trim(),
        priority: priority,
        dueDate: dueDate,
        status: "todo"
    };

    tasks.push(newTask);
    saveTasks(tasks);

    return tasks;
}

export function moveTask(taskId, newStatus) {
    const tasks = getTasks();

    for (const task of tasks) {
        if (task.id === taskId) {
            task.status = newStatus;
            break;
        }
    }

    saveTasks(tasks);
    return tasks;
}

export function deleteTask(taskId) {
    const tasks = getTasks();
    const remainingTasks = tasks.filter(task => task.id !== taskId);

    saveTasks(remainingTasks);
    return remainingTasks;
}