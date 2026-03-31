document.addEventListener("DOMContentLoaded", () => {
    initProfileMenu();
});

function initProfileMenu() {
  const btn = document.getElementById("profile-button");
  const menu = document.getElementById("profile-dropdown");

  if (!btn || !menu) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("show");
  });

  document.addEventListener("click", () => {
    menu.classList.remove("show");
  });
}