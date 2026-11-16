import { generateId } from "../utils.js";

const NOTES_KEY = "taskflow_notes";

function getNotes() {
    const data = localStorage.getItem(NOTES_KEY);
    return data ? JSON.parse(data) : [];
}

function saveNotes(notes) {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function renderNotes(notes) {
    const container = document.getElementById("notesContainer");
    if (!container) return;

    container.innerHTML = "";

    if (notes.length === 0) {
        container.innerHTML = `<p class="empty-state">No notes yet. Add one above!</p>`;
        return;
    }

    for (const note of notes) {
        const card = document.createElement("article");
        card.className = "note-card";
        card.dataset.id = note.id;

        const titleEl = document.createElement("h4");
        titleEl.textContent = note.title;

        const contentEl = document.createElement("p");
        contentEl.textContent = note.content;

        const footer = document.createElement("div");
        footer.className = "note-card-footer";

        const dateEl = document.createElement("span");
        dateEl.className = "note-date";
        dateEl.textContent = note.createdAt;

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";

        footer.append(dateEl, deleteBtn);
        card.append(titleEl, contentEl, footer);
        container.appendChild(card);
    }
}

export function initNotes() {
    const noteForm = document.getElementById("noteForm");
    const titleInput = document.getElementById("noteTitle");
    const contentInput = document.getElementById("noteContent");
    const notesContainer = document.getElementById("notesContainer");

    if (!noteForm || !notesContainer) return;

    renderNotes(getNotes());

    noteForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        if (!title || !content) return;

        const notes = getNotes();
        notes.unshift({
            id: generateId(),
            title,
            content,
            createdAt: new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
            })
        });

        saveNotes(notes);
        renderNotes(notes);
        noteForm.reset();
    });

    notesContainer.addEventListener("click", function (event) {
        if (!event.target.classList.contains("delete-btn")) return;

        const card = event.target.closest(".note-card");
        if (!card) return;

        const remainingNotes = getNotes().filter(note => note.id !== card.dataset.id);
        saveNotes(remainingNotes);
        renderNotes(remainingNotes);
    });
}