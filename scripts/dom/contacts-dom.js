/**
 * DOM element references for the contacts page.
 * Centralizes access to all contact-related HTML elements used throughout the contacts module.
 * @type {Object}
 * @property {HTMLElement} contactsListEl - The container for the contacts list.
 * @property {HTMLElement} dialogEl - The dialog modal element.
 * @property {HTMLElement} headlineEl - The headline text in the dialog.
 * @property {HTMLElement} noButtonEl - The "No" button in the dialog.
 * @property {HTMLElement} okButtonEl - The "OK" button in the dialog.
 * @property {HTMLElement} contactOverviewContainerEl - The container for the contact overview.
 * @property {HTMLElement} contactOverviewEl - The contact overview display element.
 * @property {HTMLInputElement} contactNameEl - The contact name input field.
 * @property {HTMLInputElement} contactEmailEl - The contact email input field.
 * @property {HTMLInputElement} contactPhoneEl - The contact phone input field.
 * @property {HTMLElement} closeButtonEl - The close button for the contact panel.
 * @property {HTMLElement} personImageEl - The person profile image element.
 * @property {HTMLElement} warningMessageNameEl - Warning message for name validation.
 * @property {HTMLElement} warningMessageEmailEl - Warning message for email validation.
 * @property {HTMLElement} warningMessagePhoneEl - Warning message for phone validation.
 * @property {HTMLElement} userButtonEl - The user profile button.
 * @property {HTMLElement} screenDesktopEl - The desktop screen container.
 * @property {HTMLElement} fullscreenMobileEl - The mobile fullscreen container.
 * @property {HTMLElement} mobileContactMenuButtonEl - The mobile contact menu button.
 * @property {HTMLElement} mobileMenuEl - The mobile menu container.
 * @property {HTMLElement} toastMessageEl - The toast message display element.
 * @property {HTMLElement} toastSectionEl - The toast notification section.
 */
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
