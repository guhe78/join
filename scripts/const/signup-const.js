/**
 * DOM element references for the signup page.
 * Centralizes access to all signup-related HTML elements used throughout the signup module.
 * @type {Object}
 * @property {HTMLFormElement} formSignupEl - The main signup form element.
 * @property {HTMLInputElement} nameSignupEl - The name input field.
 * @property {HTMLInputElement} emailSignupEl - The email input field.
 * @property {HTMLInputElement} passwordSignupEl - The password input field.
 * @property {HTMLInputElement} passwordConfirmSignupEl - The password confirmation input field.
 * @property {HTMLInputElement} privacyAcceptEl - The privacy policy acceptance checkbox.
 * @property {HTMLButtonElement} buttonSignupEl - The signup submit button.
 * @property {HTMLElement} warningMessageNameSignupEl - Warning message for name validation.
 * @property {HTMLElement} warningMessageEmailSignupEl - Warning message for email validation.
 * @property {HTMLElement} warningMessagePasswordSignupEl - Warning message for password validation.
 * @property {HTMLElement} warningMessagePasswordConfirmSignupEl - Warning message for password confirmation validation.
 * @property {HTMLElement} warningMessagePolicySignupEl - Warning message for privacy policy acceptance.
 * @property {HTMLElement} toastSectionEl - The toast notification section.
 */
const DOM = {
  formSignupEl: document.getElementById("form-signup"),
  nameSignupEl: document.getElementById("name-signup"),
  emailSignupEl: document.getElementById("email-signup"),
  passwordSignupEl: document.getElementById("password-signup"),
  passwordConfirmSignupEl: document.getElementById("password-confirm-signup"),
  privacyAcceptEl: document.getElementById("privacy-accept"),
  buttonSignupEl: document.getElementById("signup-button"),
  warningMessageNameSignupEl: document.getElementById("warning-name-signup"),
  warningMessageEmailSignupEl: document.getElementById("warning-email-signup"),
  warningMessagePasswordSignupEl: document.getElementById(
    "warning-password-signup",
  ),
  warningMessagePasswordConfirmSignupEl: document.getElementById(
    "warning-password-confirm-signup",
  ),
  warningMessagePolicySignupEl: document.getElementById(
    "warning-policy-signup",
  ),
  toastSectionEl: document.getElementById("toast-section"),
};
