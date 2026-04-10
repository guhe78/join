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
  renderMobileView(contact);
  bindMobileEvents();
  toggleMobileView(contact);
}

/**
 * Renders the mobile view for a contact by inserting the appropriate HTML template into the DOM.
 * @param {*} contact - The contact object to render.
 */
function renderMobileView(contact) {
  DOM.fullscreenMobileEl.innerHTML =
    contactMainTemplate() +
    contactMobileButton(contact) +
    contactCloseDetailViewButton();

  const overview = DOM.fullscreenMobileEl.querySelector("#contact-overview");
  overview.innerHTML = contactDetailTemplate(contact);
  overview.classList.add("fade-in");
}

/**
 * Binds event listeners for the mobile view, including the close button for the contact detail view and the button to open the mobile contact menu. It also stores a reference to the mobile menu element in the DOM object for later use.
 * @returns {void}
 */
function bindMobileEvents() {
  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };

  document.getElementById("close-contact-detail").onclick = stop(
    closeContactDetailView,
  );

  document.getElementById("mobile-contact-menu-button").onclick = stop(
    openMobileContactMenu,
  );

  DOM.mobileMenuEl = document.getElementById("mobile-menu");
}

/**
 * Toggles the mobile view by updating the CSS classes of the relevant elements to show the fullscreen contact detail view and hide the desktop view. This function is called when a contact is selected in the mobile view to display the contact's details in a fullscreen overlay.
 * @param {*} contact - The contact object to render.
 * @returns {void}
 */
function toggleMobileView() {
  DOM.screenDesktopEl.classList.add("hide-mobile");
  DOM.contactsListEl.classList.add("hide-mobile");
  DOM.fullscreenMobileEl.classList.remove("hide-mobile");
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
  const current = document.querySelector(".active-contact");
  const next = document.getElementById(`contact${firebaseKey}`);
  if (!next) return;

  DOM.contactOverviewEl?.classList.remove("fade-in");
  const isSame = current === next;
  current?.classList.remove("active-contact");

  if (isMobileView()) {
    next.classList.add("active-contact");
    renderContact(firebaseKey);
    return;
  }

  if (isSame) {
    DOM.contactOverviewEl.innerHTML = "";
    return;
  }

  next.classList.add("active-contact");
  renderContact(firebaseKey);
}
