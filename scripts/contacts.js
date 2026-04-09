/**
 * Initializes the contacts application by checking user authentication, fetching contacts data, and rendering the contacts list and main view. Also sets up event listeners for user interactions.
 * @param {void}
 * @returns {Promise<void>}
 */
async function init() {
  initEvents();
  checkAuth();
  await getContacts();
  renderContactsList();
  renderContactMain();
  renderLoginInitials();
  DOM.closeButtonEl.onclick = closeDialog;
  DOM.closeButtonEl.innerHTML = closeIcon();
}

/**
 * Opens the mobile contact menu by toggling the visibility of the menu and setting up event listeners for user interactions.
 * @returns {void}
 */
function openMobileContactMenu() {
  const menu = document.getElementById("mobile-menu");
  const button = document.querySelector(".mobile-button-container");

  if (!menu || !button) return;

  const isOpen = menu.classList.toggle("fade-in");

  if (isOpen) {
    button.style.display = "none";
    document.addEventListener("click", handleOutsideClick);
  }
}

/**
 * Handles clicks outside the mobile contact menu to close it when the user clicks outside the menu area.
 * @param {MouseEvent} event - The click event.
 * @returns {void}
 */
function handleOutsideClick(event) {
  const menu = document.getElementById("mobile-menu");
  const button = document.querySelector(".mobile-button-container");

  if (!menu || !button) {
    document.removeEventListener("click", handleOutsideClick);
    return;
  }

  if (!menu.contains(event.target)) {
    menu.classList.remove("fade-in");
    button.style.display = "flex";

    document.removeEventListener("click", handleOutsideClick);
  }
}

/**
 * Saves the edited contact by collecting the input values from the form, validating the form, updating the contact object, sending the updated contact to the backend, and updating the contacts list and overview. It also provides feedback to the user through a toast message and closes the dialog after the operation is completed.
 * @param {string} firebaseKey - The Firebase key of the contact to save.
 * @returns {Promise<void>}
 */
async function saveEditedContact(firebaseKey) {
  const contact = findContact(firebaseKey);
  if (!validateContactInputs()) return;
  const contactName = splitName(DOM.contactNameEl.value);
  if (!contactName) return;
  contact.firstName = contactName.firstName;
  contact.lastName = contactName.lastName;
  contact.email = DOM.contactEmailEl.value;
  contact.phone = DOM.contactPhoneEl.value;
  try {
    await updateContact(firebaseKey);
  } catch (error) {
    console.error("Error updating contact:", error);
    return;
  }
  renderContactsList();
  renderContact(firebaseKey);
  closeDialog();
  renderToastMessage("edited");
}

/**
 * Closes the contact detail view in the mobile layout by removing event listeners, updating the visibility of elements, and clearing the content of the fullscreen mobile element. This function is called when the user clicks the close button in the mobile contact detail view.
 * @returns {void}
 */
function closeContactDetailView() {
  document.removeEventListener("click", handleOutsideClick);
  const button = document.querySelector(".mobile-button-container");
  if (button) button.style.display = "flex";

  DOM.fullscreenMobileEl.classList.add("hide-mobile");
  DOM.contactsListEl.classList.remove("hide-mobile");
  DOM.screenDesktopEl.classList.remove("hide-mobile");
  DOM.fullscreenMobileEl.innerHTML = "";
}

/**
 * Checks if the current view is a mobile view based on the window width and the defined mobile breakpoint.
 * @returns {boolean} - Returns true if the current view is a mobile view, false otherwise.
 */
function isMobileView() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}
