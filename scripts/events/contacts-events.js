/**
 * Initializes event listeners for contact form field validation.
 * Attaches input event listeners to the name, email, and phone fields.
 */
function initEvents() {
  DOM.contactNameEl.addEventListener("input", validateName);
  DOM.contactEmailEl.addEventListener("input", validateEmail);
  DOM.contactPhoneEl.addEventListener("input", validatePhone);
}
