/**
 * Generates HTML for a single contact in the contact list.
 * @param {Object} contact - The contact object.
 * @param {string} contact.firebaseKey - The unique Firebase key for the contact.
 * @param {string} contact.firstName - The contact's first name.
 * @param {string} contact.lastName - The contact's last name.
 * @param {string} contact.email - The contact's email address.
 * @param {string} contact.badgeColor - The background color for the contact badge.
 * @returns {string} The HTML string for a contact list item.
 */
function contactTemplate(contact) {
  return `
    <div class="contact" id="contact${contact.firebaseKey}" 
        onclick="toggleActiveContact('${contact.firebaseKey}')" tabindex="0">
      <div class="contact-badge" style="background-color: ${contact.badgeColor}">
        ${contact.firstName[0].toUpperCase()}${contact.lastName[0].toUpperCase()}
      </div>
      <div class="contact-data">
        <p class="name">${contact.firstName} ${contact.lastName}</p>
        <p class="email">${contact.email}</p>
      </div>
    </div>
`;
}

/**
 * Generates HTML for a contact letter separator.
 * @param {string} letter - The letter (A-Z) to display as a separator.
 * @returns {string} The HTML string for a letter separator and divider line.
 */
function contactLetterTemplate(letter) {
  return `
    <div class="contact-letter">${letter}</div>
    <div class="contact-seperator"></div>
  `;
}

/**
 * Generates the headline for the add contact dialog.
 * @returns {string} The HTML string for the add contact headline.
 */
function addContactHeadlineTemplate() {
  return ` 
        <h1>Add contact</h1>
        <p>Tasks are better with a team!</p>
        <div class="contact-dialog-seperator"></div>
    `;
}

/**
 * Generates the headline for the edit contact dialog.
 * @returns {string} The HTML string for the edit contact headline.
 */
function editContactHeadlineTemplate() {
  return ` 
        <h1>Edit contact</h1>
    `;
}

/**
 * Generates the detailed view HTML for a single contact.
 * @param {Object} contact - The contact object.
 * @param {string} contact.firstName - The contact's first name.
 * @param {string} contact.lastName - The contact's last name.
 * @param {string} contact.email - The contact's email address.
 * @param {string} contact.phone - The contact's phone number.
 * @param {string} contact.badgeColor - The background color for the contact badge.
 * @param {string} contact.firebaseKey - The unique Firebase key for the contact.
 * @returns {string} The HTML string for the contact detail view.
 */
function contactDetailTemplate(contact) {
  return `
    <div class="contact-detail-view">
      <div class="contact-detail-header">
        ${contactBadgeTemplate(contact)}
        <div class="contact-detail-headline">
          <h2 class="name">${contact.firstName} ${contact.lastName}</h2>
          <div class="contact-detail-buttons" id="contact-detail-buttons">
            ${contactButtons(contact)}
          </div>
        </div>
      </div>
      <p class="font-size-20">Contact Information</p>
      <div class="contact-detail-data">
        <p class="bold">Email</p>
        <a href="mailto:${contact.email}" class="email">${contact.email}</a>
        <p class="bold">Phone</p>
        <p>${contact.phone}</p>
      </div>
    </div>
  `;
}

/**
 * Generates the mobile menu button and dropdown for contact actions.
 * @param {Object} contact - The contact object.
 * @param {string} contact.firebaseKey - The unique Firebase key for the contact.
 * @returns {string} The HTML string for the mobile contact menu.
 */
function contactMobileButton(contact) {
  return `
    <div class="mobile-contact-menu">
      <div class="mobile-button-container" id="mobile-contact-menu-button">${moreVerticalIcon()}</div>
      <div class="mobile-menu" id="mobile-menu">${contactButtons(contact)}</div>
    </div>
  `;
}

/**
 * Generates the close button for the contact detail view.
 * @returns {string} The HTML string for the back button.
 */
function contactCloseDetailViewButton() {
  return `
    <button class="back-button" id="close-contact-detail">${arrowLeftIcon()}</button>
  `;
}

/**
 * Generates the action buttons (Edit and Delete) for a contact.
 * @param {Object} contact - The contact object.
 * @param {string} contact.firebaseKey - The unique Firebase key for the contact.
 * @returns {string} The HTML string for contact action buttons.
 */
function contactButtons(contact) {
  return `
    <button onclick="openEditContact('${contact.firebaseKey}')">
      ${editIcon()}<span>Edit</span>
    </button>
    <button onclick="deleteContact('${contact.firebaseKey}')">
      ${deleteIcon()}<span>Delete</span>
    </button>
  `;
}

/**
 * Generates the badge display for a contact with initials.
 * @param {Object} contact - The contact object.
 * @param {string} contact.firstName - The contact's first name.
 * @param {string} contact.lastName - The contact's last name.
 * @param {string} contact.badgeColor - The background color for the contact badge.
 * @returns {string} The HTML string for the contact badge.
 */
function contactBadgeTemplate(contact) {
  return `
    <div class="contact-detail-badge" style="background-color: ${contact.badgeColor}">
      ${contact.firstName[0].toUpperCase()}${contact.lastName[0].toUpperCase()}
    </div>
  `;
}

/**
 * Generates a dummy badge with a generic person image.
 * Used when no contact is selected or during loading.
 * @returns {string} The HTML string for the dummy contact badge.
 */
function contactBadgeDummyTemplate() {
  return `
    <div class="contact-detail-badge">
      <img src="../assets/imgs/person.svg" alt="Dummy of a person" />
    </div>
  `;
}

/**
 * Generates the main contacts page layout with headline and contact overview area.
 * @returns {string} The HTML string for the main contacts page structure.
 */
function contactMainTemplate() {
  return `
    <div class="contact-headline">
      <h1>Contacts</h1>
      <div class="headline-seperator"></div>
      <p>Better with a team</p>
      <div class="headline-seperator-mobile"></div>
    </div>
    <div class="contact-overview" id="contact-overview"></div>
  `;
}
