const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const themeToggle = document.getElementById("themeToggle");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "✕" : "☰";
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

const savedTheme = localStorage.getItem("tanvir-theme");
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);

function updateThemeButton() {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  themeToggle.textContent = isLight ? "☀ Light" : "☾ Dark";
}
updateThemeButton();

themeToggle.addEventListener("click", () => {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const nextTheme = isLight ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", nextTheme);
  localStorage.setItem("tanvir-theme", nextTheme);
  updateThemeButton();
});
