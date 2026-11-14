const THEME_KEY = "taskflow_theme";

export function initTheme() {
    const themeToggleBtn = document.getElementById("themeToggle");

    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    }

    themeToggleBtn.addEventListener("click", function () {
        document.body.classList.toggle("dark-theme");

        const isDark = document.body.classList.contains("dark-theme");
        localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    });
}