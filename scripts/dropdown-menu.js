function renderProfileDropdown() {
  const container = document.getElementById("dropdown-container");
  if (!container) return;

  container.innerHTML = getProfileDropdownTemplate();
}

function toggleProfileMenu(event) {
  event.stopPropagation();

  const menu = document.getElementById("profile-dropdown");
  if (!menu) return;

  menu.classList.toggle("show");
}

function closeProfileMenu() {
  const menu = document.getElementById("profile-dropdown");
  if (!menu) return;

  menu.classList.remove("show");
}

function initProfileMenu() {
  const btn = document.getElementById("profile-button");
  const container = document.getElementById("dropdown-container");

  if (!btn || !container) return;

  renderProfileDropdown();

  setupProfileMenuEvents(btn, container);
}

function setupProfileMenuEvents(btn, container) {
  btn.addEventListener("click", toggleProfileMenu);

  document.addEventListener("click", closeProfileMenu);

  container.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("keydown", handleEscapeKey);
}

function handleEscapeKey(event) {
  if (event.key === "Escape") {
    closeProfileMenu();
  }
}

initProfileMenu();