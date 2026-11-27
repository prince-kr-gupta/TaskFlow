const THEME_KEY = "taskflow_theme";

export function initTheme() {
    const themeToggleBtn = document.getElementById("themeToggle");
    if (!themeToggleBtn) return;

    const updateLabel = (isDark) => {
        themeToggleBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
    };

    const savedTheme = localStorage.getItem(THEME_KEY);
    const initialDark = savedTheme === "dark";
    document.body.classList.toggle("dark-theme", initialDark);
    updateLabel(initialDark);

    themeToggleBtn.addEventListener("click", function () {
        const isDark = document.body.classList.toggle("dark-theme");
        localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
        updateLabel(isDark);
    });
}