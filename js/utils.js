// Generate unique id

export function generateId(){
    return crypto.randomUUID();
}

// Format Date

export function formatDate(dateString) {

    if(!dateString){
        return "";
    }

    return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

// Task is Overdue

export function isOverdue(dueDate) {
    if(!dueDate){
        return false;
    }
    const today = new Date().setHours(0,0,0,0);
    const deadline = new Date(dueDate);

    return deadline < today;
}

//Remaining Days

export function getDaysRemaining(dueDate) {
    if(!dueDate) return null;

    const diff = new Date(dueDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

//Capitalize first toLocaleDateString
export function CapitalizeFirstLetter(text) {
    if(!text) return "";

    return text[0].toUpperCase() + text.slice(1);
}