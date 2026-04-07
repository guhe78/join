/**
 * Renders the profile dropdown menu by inserting the HTML template into the DOM. This function retrieves the container element with the ID "dropdown-container" and sets its innerHTML to the template returned by the `getProfileDropdownTemplate` function. If the container element is not found, the function simply returns without making any changes to the DOM.
 * @returns {void}
 */
function renderProfileDropdown() {
  const container = document.getElementById("dropdown-container");
  if (!container) return;

  container.innerHTML = getProfileDropdownTemplate();
}

/**
 * Toggles the visibility of the profile dropdown menu. This function stops the propagation of the click event to prevent it from closing the menu immediately after opening it. It then retrieves the dropdown menu element and toggles the "show" class to either display or hide the menu.
 * @param {Event} event - The click event that triggered the toggle.
 * @returns {void}
 */
function toggleProfileMenu(event) {
  event.stopPropagation();

  const menu = document.getElementById("profile-dropdown");
  if (!menu) return;

  menu.classList.toggle("show");
}

/**
 * Closes the profile dropdown menu by removing the "show" class from the menu element. This function is typically called when a click event occurs outside of the menu or when the Escape key is pressed, ensuring that the dropdown menu is hidden when it should not be visible.
 * @returns {void}
 */
function closeProfileMenu() {
  const menu = document.getElementById("profile-dropdown");
  if (!menu) return;

  menu.classList.remove("show");
}

/**
 * Initializes the profile dropdown menu by rendering the menu template and setting up event listeners for toggling and closing the menu. This function retrieves the profile button and dropdown container elements from the DOM, renders the dropdown menu using the `renderProfileDropdown` function, and sets up event listeners for clicks on the profile button to toggle the menu, clicks on the document to close the menu, and keydown events to handle closing the menu with the Escape key.
 * @returns {void}
 */
function initProfileMenu() {
  const btn = document.getElementById("profile-button");
  const container = document.getElementById("dropdown-container");

  if (!btn || !container) return;

  renderProfileDropdown();

  setupProfileMenuEvents(btn, container);
}

/**
 * Sets up event listeners for the profile dropdown menu, including toggling the menu, closing the menu, and handling the Escape key.
 * @param {HTMLElement} btn - The profile button element.
 * @param {HTMLElement} container - The dropdown container element.
 * @returns {void}
 */
function setupProfileMenuEvents(btn, container) {
  btn.addEventListener("click", toggleProfileMenu);

  document.addEventListener("click", closeProfileMenu);

  container.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("keydown", handleEscapeKey);
}

/**
 * Handles the keydown event for the Escape key to close the profile dropdown menu.
 * @param {KeyboardEvent} event - The keydown event.
 * @returns {void}
 */
function handleEscapeKey(event) {
  if (event.key === "Escape") {
    closeProfileMenu();
  }
}

initProfileMenu();
