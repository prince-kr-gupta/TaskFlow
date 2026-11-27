export function generateId() {
    return crypto.randomUUID();
}

function parseLocalDate(dateString) {
    if (!dateString) return null;
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export function formatDate(dateString) {
    const date = parseLocalDate(dateString);
    if (!date) return "";

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

export function isOverdue(dueDate) {
    const deadline = parseLocalDate(dueDate);
    if (!deadline) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return deadline < today;
}

export function getDaysRemaining(dueDate) {
    const deadline = parseLocalDate(dueDate);
    if (!deadline) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
}

export function capitalizeFirstLetter(text) {
    if (!text) return "";
    return text[0].toUpperCase() + text.slice(1);
}

export function escapeHTML(text) {
    if (!text) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}