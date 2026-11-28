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

export function editTask(taskId, updates) {
    const tasks = getTasks();
    const index = tasks.findIndex(task => task.id === taskId);

    if (index !== -1) {
        tasks[index] = {
            ...tasks[index],
            title: updates.title.trim(),
            description: updates.description.trim(),
            priority: updates.priority,
            dueDate: updates.dueDate
        };
        saveTasks(tasks);
    }

    return tasks;
}
export function restoreTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
    return tasks;
}