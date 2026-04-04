const DOM = {
  contactsListEl: document.getElementById("contacts-list"),
  dialogEl: document.getElementById("dialog"),
  headlineEl: document.getElementById("dialog-headline"),
  noButtonEl: document.getElementById("no-button"),
  okButtonEl: document.getElementById("ok-button"),
  contactOverviewContainerEl: document.getElementById(
    "contact-overview-container",
  ),
  contactOverviewEl: document.getElementById("contact-overview"),
  contactNameEl: document.getElementById("contact-name-input"),
  contactEmailEl: document.getElementById("contact-email-input"),
  contactPhoneEl: document.getElementById("contact-phone-input"),
  closeButtonEl: document.getElementById("close-button"),
  personImageEl: document.getElementById("person-image"),
  warningMessageNameEl: document.getElementById("warning-name"),
  warningMessageEmailEl: document.getElementById("warning-email"),
  warningMessagePhoneEl: document.getElementById("warning-phone"),
  userButtonEl: document.getElementById("profile-button"),
  screenDesktopEl: document.getElementById("screen-desktop"),
  fullscreenMobileEl: document.getElementById("fullscreen-mobile"),
  mobileContactMenuButtonEl: document.getElementById(
    "mobile-contact-menu-button",
  ),
  mobileMenuEl: document.getElementById("mobile-menu"),
  toastMessageEl: document.getElementById("toast-message"),
  toastSectionEl: document.getElementById("toast-section"),
};

const MOBILE_BREAKPOINT = 850;
const DEFAULT_BADGE_COLORS = [
  "#ff7a00",
  "#9327ff",
  "#6e52ff",
  "#fc71ff",
  "#1fd7c1",
  "#ff5eb3",
  "#00bee8",
  "#ff745e",
  "#ffc701",
  "#0038ff",
  "#c3ff2b",
  "#ffe62b",
  "#ff4646",
  "#ffbb2b",
  "#ffa35e",
];

DOM.dialogEl.onclick = (event) => {
  if (event.target === DOM.dialogEl) {
    closeDialog();
  }
};
DOM.contactNameEl.addEventListener("input", () => {
  DOM.warningMessageNameEl.textContent = "";
});

DOM.contactEmailEl.addEventListener("input", () => {
  DOM.warningMessageEmailEl.textContent = "";
});

DOM.contactPhoneEl.addEventListener("input", () => {
  DOM.warningMessagePhoneEl.textContent = "";
});

/**
 * Initializes the contacts application by checking user authentication, fetching contacts data, and rendering the contacts list and main view. Also sets up event listeners for user interactions.
 * @param {void}
 * @returns {Promise<void>}
 */
async function init() {
  checkAuth();
  await getContacts();
  renderContactsList();
  renderContactMain();

  DOM.userButtonEl.innerHTML = getUserData().initials;
  DOM.closeButtonEl.onclick = closeDialog;
  DOM.closeButtonEl.innerHTML = closeIcon();
}

/**
 * Renders the contacts list by sorting the contacts alphabetically, grouping them by the first letter of their first name, and generating the HTML for each contact using templates. The generated HTML is then inserted into the DOM to display the contacts list.
 * @param {void}
 * @returns {void}
 */
function renderContactsList() {
  contacts.sort((a, b) => a.firstName.localeCompare(b.firstName, "de"));
  DOM.contactsListEl.innerHTML = "";
  let contactListString = "";
  let lastLetter = "";
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let letter = contact.firstName[0].toUpperCase();
    if (lastLetter != letter) {
      lastLetter = letter;
      contactListString += contactLetterTemplate(letter);
    }
    contactListString += contactTemplate(findContact(contacts[i].firebaseKey));
  }
  DOM.contactsListEl.innerHTML = contactListString;
}

/**
 * Renders the main contact view by inserting the appropriate HTML template into the DOM. This function is called when the application is initialized to set up the initial state of the contact overview section.
 * @param {void}
 * @returns {void}

 */
function renderContactMain() {
  DOM.contactOverviewContainerEl.innerHTML = contactMainTemplate();
  DOM.contactOverviewEl = document.getElementById("contact-overview");
}

/**
 * Renders the contact details view based on the provided index. It determines whether to render the view for mobile or desktop and calls the appropriate function.
 * @param {number} index - The index of the contact to render.
 * @returns {void}
 */
function renderContact(firebaseKey) {
  const contact = findContact(firebaseKey);
  if (!contact) return;
  if (isMobileView()) {
    renderContactMobile(contact);
  } else {
    renderContactDesktop(contact);
  }
}

/**
 * Renders the contact details view for desktop by inserting the appropriate HTML template into the DOM. This function is called when a contact is selected in the desktop view to display the contact's details in the overview section.
 * @param {number} contact - The index of the contact to render.
 * @returns {void}
 */
function renderContactDesktop(contact) {
  DOM.contactOverviewEl.innerHTML = contactDetailTemplate(contact);
  DOM.contactOverviewEl.classList.add("fade-in");
}

/**
 * Renders the contact details view for mobile by inserting the appropriate HTML template into the DOM and setting up event listeners for user interactions. This function is called when a contact is selected in the mobile view to display the contact's details in a fullscreen overlay.
 * @param {number} contact - The index of the contact to render.
 * @returns {void}
 */
function renderContactMobile(contact) {
  DOM.fullscreenMobileEl.innerHTML =
    contactMainTemplate() +
    contactMobileButton(contact) +
    contactCloseDetailViewButton();

  DOM.mobileMenuEl = document.getElementById("mobile-menu");
  const closeButton = document.getElementById("close-contact-detail");
  closeButton.onclick = (event) => {
    event.stopPropagation();
    closeContactDetailView();
  };
  const mobileContactMenuButtonEl = document.getElementById(
    "mobile-contact-menu-button",
  );
  mobileContactMenuButtonEl.onclick = (event) => {
    event.stopPropagation();
    openMobileContactMenu();
  };

  DOM.screenDesktopEl.classList.add("hide-mobile");

  const mobileOverviewEl =
    DOM.fullscreenMobileEl.querySelector("#contact-overview");

  mobileOverviewEl.innerHTML = contactDetailTemplate(contact);
  mobileOverviewEl.classList.add("fade-in");

  DOM.contactsListEl.classList.add("hide-mobile");
  DOM.fullscreenMobileEl.classList.remove("hide-mobile");
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

/** Renders a toast message to provide feedback to the user after performing an action such as creating, editing, or deleting a contact. The message is displayed for a short duration and then fades out.
 * @param {string} type - The type of action performed (e.g., "created", "edited", "deleted").
 * @returns {void}
 */
function renderToastMessage(type) {
  if (!DOM.toastMessageEl || !DOM.toastSectionEl) return;

  DOM.toastMessageEl.textContent = `Contact successfully ${type}`;
  DOM.toastSectionEl.classList.add("fade-in");

  setTimeout(() => {
    DOM.toastSectionEl.classList.remove("fade-in");
  }, 2000);
}

/**
 * Toggles the active contact in the desktop view by updating the CSS classes of the contact elements and rendering the contact details in the overview section. If the same contact is clicked again, it will be deselected and the overview will be cleared.
 * @param {number} firebaseKey - The index of the contact to toggle.
 * @returns {void}
 */
function toggleActiveContact(firebaseKey) {
  const currentActiveElement = document.querySelector(".active-contact");
  const newActiveElement = document.getElementById("contact" + firebaseKey);
  if (!newActiveElement) return;
  if (DOM.contactOverviewEl) {
    DOM.contactOverviewEl.classList.remove("fade-in");
  }
  if (isMobileView()) {
    if (currentActiveElement) {
      currentActiveElement.classList.remove("active-contact");
    }
    newActiveElement.classList.add("active-contact");
    renderContact(firebaseKey);
    return;
  }
  if (currentActiveElement) {
    currentActiveElement.classList.remove("active-contact");
    DOM.contactOverviewEl.innerHTML = "";
  }
  if (currentActiveElement === newActiveElement) {
    newActiveElement.classList.remove("active-contact");
  } else {
    newActiveElement.classList.add("active-contact");
    renderContact(firebaseKey);
  }
}

/**
 * Opens the dialog for adding a new contact by setting up the dialog elements and event listeners.
 * @returns {void}
 */
function openAddNewContact() {
  DOM.headlineEl.innerHTML = addContactHeadlineTemplate();
  DOM.noButtonEl.innerHTML = `Cancel&nbsp;${cancelIcon()}`;
  DOM.noButtonEl.onclick = cancelAddContact;
  DOM.noButtonEl.classList.add("cancel-button");
  DOM.okButtonEl.innerHTML = `Create contact&nbsp;${checkIcon()}`;
  DOM.personImageEl.innerHTML = contactBadgeDummyTemplate();
  DOM.okButtonEl.onclick = () => addContact();
  openDialog();
}

/**
 * Validates the contact form by checking the input values for the name, email, and phone fields. It uses helper functions to validate each field and displays appropriate warning messages if the validation fails. The function returns true if all fields are valid, otherwise it returns false.
 * @returns {boolean} - Returns true if the form is valid, false otherwise.
 */
function validateForm() {
  const name = DOM.contactNameEl.value.trim();
  const email = DOM.contactEmailEl.value.trim();
  const phone = DOM.contactPhoneEl.value.trim();

  const isNameValid = validateField(
    name,
    checkName,
    DOM.warningMessageNameEl,
    "This field is required",
    "Firstname and Lastname required",
  );

  const isEmailValid = validateField(
    email,
    checkEmail,
    DOM.warningMessageEmailEl,
    "This field is required",
    "Correct Email required",
  );

  const isPhoneValid = validateField(
    phone,
    checkPhone,
    DOM.warningMessagePhoneEl,
    "This field is required",
    "Phone number required",
  );

  return isNameValid && isEmailValid && isPhoneValid;
}

/**
 * Validates a single form field by checking its value against a validation function and updating the error message element accordingly.
 * @param {string} value - The value of the form field to validate.
 * @param {Function} checkFn - The validation function to apply to the field value.
 * @param {HTMLElement} errorEl - The DOM element to display the error message.
 * @param {string} emptyMsg - The error message to display if the field is empty.
 * @param {string} invalidMsg - The error message to display if the field value is invalid.
 * @returns {boolean} - Returns true if the field is valid, false otherwise.
 */
function validateField(value, checkFn, errorEl, emptyMsg, invalidMsg) {
  if (!value) {
    errorEl.textContent = emptyMsg;
    return false;
  }

  if (!checkFn(value)) {
    errorEl.textContent = invalidMsg;
    return false;
  }

  errorEl.textContent = "";
  return true;
}

/**
 * Adds a new contact by collecting the input values from the form, validating the form, creating a new contact object, sending it to the backend, and updating the contacts list and overview. It also provides feedback to the user through a toast message and closes the dialog after the operation is completed.
 * @returns {Promise<void>}
 */
async function addContact() {
  let name = DOM.contactNameEl.value.trim();
  let email = DOM.contactEmailEl.value.trim();
  let phone = DOM.contactPhoneEl.value.trim();
  if (!validateForm()) return;
  const contactName = splitName(name);
  if (!contactName) return;
  let newContact = {
    firstName: contactName.firstName,
    lastName: contactName.lastName,
    email: email,
    phone: phone,
    badgeColor: getRandomColor(),
  };
  let result;
  try {
    result = await postData("contacts", newContact);
  } catch (error) {
    console.error("Error adding contact:", error);
    return;
  }
  newContact.firebaseKey = result.name;
  contacts.push(newContact);
  renderContactsList();
  renderContact(newContact.firebaseKey);
  clearInputs();
  closeDialog();
  renderToastMessage("created");
}

/**
 * Opens the dialog for editing an existing contact by setting up the dialog elements and event listeners.
 * @param {number} firebaseKey - The index of the contact to edit.
 * @returns {void}
 */
function openEditContact(firebaseKey) {
  const contact = findContact(firebaseKey);
  if (!contact) return;
  clearInputs();
  DOM.headlineEl.innerHTML = editContactHeadlineTemplate();
  DOM.noButtonEl.innerHTML = "Delete";
  DOM.noButtonEl.onclick = () => deleteContact(firebaseKey);
  DOM.okButtonEl.innerHTML = `Save&nbsp;${checkIcon()}`;
  DOM.okButtonEl.onclick = () => saveEditedContact(firebaseKey);
  DOM.personImageEl.innerHTML = contactBadgeTemplate(contact);
  DOM.contactNameEl.value = contact.firstName + " " + contact.lastName;
  DOM.contactEmailEl.value = contact.email;
  DOM.contactPhoneEl.value = contact.phone;
  openDialog();
}

/**
 * Saves the edited contact by collecting the input values from the form, validating the form, updating the contact object, sending the updated contact to the backend, and updating the contacts list and overview. It also provides feedback to the user through a toast message and closes the dialog after the operation is completed.
 * @param {number} index - The index of the contact to save.
 * @returns {Promise<void>}
 */
async function saveEditedContact(firebaseKey) {
  const contact = findContact(firebaseKey);
  if (!validateForm()) return;
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
 * Deletes a contact by removing it from the backend and updating the contacts list and overview. It also provides feedback to the user through a toast message and closes the dialog after the operation is completed.
 * @param {number} firebaseKey - The firebaseKey of the contact to delete.
 * @returns {Promise<void>}
 */
async function deleteContact(firebaseKey) {
  const contact = findContact(firebaseKey);
  try {
    await deleteData("contacts", contact.firebaseKey);
  } catch (error) {
    console.error("Error deleting contact:", error);
    return;
  }
  contacts.splice(findContactIndex(contact.firebaseKey), 1);
  DOM.contactOverviewEl.innerHTML = "";
  DOM.contactOverviewEl.classList.remove("fade-in");
  renderContactsList();
  closeDialog();
  closeContactDetailView();
  renderToastMessage("deleted");
}

/**
 * Updates a contact by sending the updated contact data to the backend. It takes a contact object as a parameter and updates the corresponding contact in the backend using its firebaseKey.
 * @param {Object} contact - The contact object containing the updated contact information.
 * @returns {Promise<void>}
 */
async function updateContact(firebaseKey) {
  const contact = findContact(firebaseKey);
  const firstName = contact.firstName;
  const lastName = contact.lastName;
  const email = contact.email;
  const phone = contact.phone;
  if (!firstName || !lastName || !email || !phone) {
    return false;
  }
  let updatedContact = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
  };
  await updateData("contacts", contact.firebaseKey, updatedContact);
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
 * Splits a full name into first name and last name by trimming the input, splitting it by whitespace, and returning an object containing the first name and last name. If the input does not contain at least two parts, it returns null.
 * @param {string} name - The full name to split.
 * @returns {Object|null} - An object containing the first name and last name, or null if the input is invalid.
 */
function splitName(name) {
  let nameArray = name.trim().split(/\s+/);

  if (nameArray.length < 2) return null;

  return {
    firstName: nameArray[0],
    lastName: nameArray.slice(1).join(" "),
  };
}

/**
 * Checks if the input name is valid by ensuring that it contains at least two parts (first name and last name) after trimming and splitting the input by whitespace. It returns true if the name is valid, otherwise it returns false.
 * @param {string} input - The name input to check.
 * @returns {boolean} - Returns true if the name is valid, false otherwise.
 */
function checkName(input) {
  return input.trim().split(/\s+/).length > 1;
}

function checkEmail(input) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return pattern.test(input);
}

/**
 * Checks if the input phone number is valid by ensuring that it contains only digits, spaces, parentheses, plus signs, or hyphens. It returns true if the phone number is valid, otherwise it returns false.
 * @param {string} input - The phone number input to check.
 * @returns {boolean} - Returns true if the phone number is valid, false otherwise.
 */
function checkPhone(input) {
  return /^[0-9+\-\s()]+$/.test(input);
}

/**
 * Cancels the add contact operation by clearing the input fields and closing the dialog. This function is called when the user clicks the cancel button in the add contact dialog.
 * @returns {void}
 */
function cancelAddContact() {
  clearInputs();
  closeDialog();
}

/**
 * Clears the input fields and warning messages in the contact form. This function is called after adding a new contact or when canceling the add/edit contact operation to reset the form to its initial state.
 * @returns {void}
 */
function clearInputs() {
  DOM.contactNameEl.value = "";
  DOM.warningMessageNameEl.innerHTML = "";
  DOM.contactEmailEl.value = "";
  DOM.warningMessageEmailEl.innerHTML = "";
  DOM.contactPhoneEl.value = "";
  DOM.warningMessagePhoneEl.innerHTML = "";
}

/** Finds a contact by its firebaseKey by searching through the contacts array and returning the contact object that matches the provided firebaseKey. If no contact is found, it returns undefined.
 * @param {string} firebaseKey - The firebaseKey of the contact to find.
 * @returns {Object|undefined} - The contact object that matches the firebaseKey, or undefined if no contact is found.
 */
function findContact(firebaseKey) {
  return contacts.find((contact) => contact.firebaseKey === firebaseKey);
}

/** Finds the index of a contact in the contacts array by its firebaseKey. It searches through the contacts array and returns the index of the contact that matches the provided firebaseKey. If no contact is found, it returns -1.
 * @param {string} firebaseKey - The firebaseKey of the contact to find.
 * @returns {number} - The index of the contact that matches the firebaseKey, or -1 if no contact is found.
 */
function findContactIndex(firebaseKey) {
  return contacts.findIndex((contact) => contact.firebaseKey === firebaseKey);
}

/**
 * Checks if the current view is a mobile view based on the window width and the defined mobile breakpoint.
 * @returns {boolean} - Returns true if the current view is a mobile view, false otherwise.
 */
function isMobileView() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

/**
 * Opens the dialog for adding or editing a contact by displaying the dialog element. This function is called when the user clicks the button to add a new contact or edit an existing contact.
 * @returns {void}
 */
function openDialog() {
  DOM.dialogEl.showModal();
}

/**
 * Closes the dialog for adding or editing a contact by hiding the dialog element, clearing the input fields, and resetting the state of the cancel button. This function is called when the user clicks outside the dialog or clicks the close button in the dialog.
 * @returns {void}
 */
function closeDialog() {
  DOM.dialogEl.close();
  clearInputs();
  DOM.noButtonEl.classList.remove("cancel-button");
}

/**
 * Generates a random integer between 0 (inclusive) and the specified maximum (exclusive).
 * @param {number} max - The maximum value (exclusive) for the random integer.
 * @returns {number} - A random integer between 0 and max - 1.
 */
function getRandom(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Generates a random color from the default badge colors.
 * @returns {string} - A random color from the default badge colors.
 */
function getRandomColor() {
  return DEFAULT_BADGE_COLORS[getRandom(DEFAULT_BADGE_COLORS.length)];
}
