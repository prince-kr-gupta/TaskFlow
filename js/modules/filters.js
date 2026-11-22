const PRIORITY_WEIGHT = {
    high: 3,
    medium: 2,
    low: 1
};

/**
 * Returns today's date in local YYYY-MM-DD format to avoid UTC offset issues.
 */
function getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Filters an array of task objects based on search text, priority, status, and due date.
 *
 * @param {Array<Object>} tasks
 * @param {Object} filters
 * @param {string} [filters.search='']
 * @param {string} [filters.priority='all'] - 'all' | 'low' | 'medium' | 'high'
 * @param {string} [filters.status='all'] - 'all' | 'todo' | 'in-progress' | 'done'
 * @param {string} [filters.dueDate='all'] - 'all' | 'today' | 'overdue' | 'upcoming' | 'no-date'
 * @returns {Array<Object>}
 */
export function filterTasks(tasks, filters = {}) {
    const {
        search = '',
        priority = 'all',
        status = 'all',
        dueDate = 'all'
    } = filters;

    const query = search.trim().toLowerCase();
    const today = getTodayString();

    return tasks.filter((task) => {
        // 1. Search filter (matches title or description)
        if (query) {
            const titleMatch = task.title?.toLowerCase().includes(query);
            const descMatch = task.description?.toLowerCase().includes(query);
            if (!titleMatch && !descMatch) return false;
        }

        // 2. Priority filter
        if (priority !== 'all' && task.priority !== priority) {
            return false;
        }

        // 3. Status filter
        if (status !== 'all' && task.status !== status) {
            return false;
        }

        // 4. Due Date filter
        if (dueDate !== 'all') {
            if (dueDate === 'no-date' && task.dueDate) return false;
            if (dueDate !== 'no-date' && !task.dueDate) return false;

            if (dueDate === 'today' && task.dueDate !== today) return false;
            if (dueDate === 'overdue' && (task.dueDate >= today || task.status === 'done')) return false;
            if (dueDate === 'upcoming' && task.dueDate <= today) return false;
        }

        return true;
    });
}

/**
 * Sorts a filtered list of tasks without mutating the original array.
 *
 * @param {Array<Object>} tasks
 * @param {string} sortBy - 'default' | 'priority-desc' | 'priority-asc' | 'due-asc' | 'due-desc'
 * @returns {Array<Object>}
 */
export function sortTasks(tasks, sortBy = 'default') {
    const copy = [...tasks];

    switch (sortBy) {
        case 'priority-desc':
            return copy.sort((a, b) => (PRIORITY_WEIGHT[b.priority] || 0) - (PRIORITY_WEIGHT[a.priority] || 0));

        case 'priority-asc':
            return copy.sort((a, b) => (PRIORITY_WEIGHT[a.priority] || 0) - (PRIORITY_WEIGHT[b.priority] || 0));

        case 'due-asc':
            return copy.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return a.dueDate.localeCompare(b.dueDate);
            });

        case 'due-desc':
            return copy.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return b.dueDate.localeCompare(a.dueDate);
            });

        default:
            return copy;
    }
}

/**
 * Injects filter controls into #tasks (if not already present) and binds events.
 *
 * @param {Function} onFilterChange - Callback receiving `(filterState)` whenever any control changes.
 * @returns {Object} Helper methods `{ getFilterState, resetFilters }`
 */
export function initFilters(onFilterChange) {
    const kanbanSection = document.getElementById('tasks');
    const kanbanBoard = kanbanSection?.querySelector('.kanban-board');

    if (kanbanSection && kanbanBoard && !document.getElementById('taskFilterBar')) {
        const filterBar = document.createElement('div');
        filterBar.className = 'filter-bar';
        filterBar.id = 'taskFilterBar';
        filterBar.innerHTML = `
            <input
                type="search"
                id="filterSearch"
                class="filter-input"
                placeholder="Search tasks..."
                aria-label="Search tasks">

            <select id="filterPriority" class="filter-select" aria-label="Filter by priority">
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
            </select>

            <select id="filterDueDate" class="filter-select" aria-label="Filter by due date">
                <option value="all">All Dates</option>
                <option value="today">Due Today</option>
                <option value="overdue">Overdue</option>
                <option value="upcoming">Upcoming</option>
                <option value="no-date">No Due Date</option>
            </select>

            <select id="sortTasks" class="filter-select" aria-label="Sort tasks">
                <option value="default">Sort: Default</option>
                <option value="priority-desc">Priority (High → Low)</option>
                <option value="priority-asc">Priority (Low → High)</option>
                <option value="due-asc">Due Date (Earliest)</option>
                <option value="due-desc">Due Date (Latest)</option>
            </select>

            <button type="button" id="resetFiltersBtn" class="secondary-btn">
                Reset
            </button>
        `;

        kanbanSection.insertBefore(filterBar, kanbanBoard);
    }

    const searchInput = document.getElementById('filterSearch');
    const prioritySelect = document.getElementById('filterPriority');
    const dueDateSelect = document.getElementById('filterDueDate');
    const sortSelect = document.getElementById('sortTasks');
    const resetBtn = document.getElementById('resetFiltersBtn');

    const getFilterState = () => ({
        search: searchInput?.value || '',
        priority: prioritySelect?.value || 'all',
        dueDate: dueDateSelect?.value || 'all',
        sortBy: sortSelect?.value || 'default'
    });

    const triggerChange = () => {
        if (typeof onFilterChange === 'function') {
            onFilterChange(getFilterState());
        }
    };

    const resetFilters = () => {
        if (searchInput) searchInput.value = '';
        if (prioritySelect) prioritySelect.value = 'all';
        if (dueDateSelect) dueDateSelect.value = 'all';
        if (sortSelect) sortSelect.value = 'default';
        triggerChange();
    };

    // Debounce search input for smooth typing
    let debounceTimer;
    searchInput?.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(triggerChange, 150);
    });

    prioritySelect?.addEventListener('change', triggerChange);
    dueDateSelect?.addEventListener('change', triggerChange);
    sortSelect?.addEventListener('change', triggerChange);
    resetBtn?.addEventListener('click', resetFilters);

    return { getFilterState, resetFilters };
}