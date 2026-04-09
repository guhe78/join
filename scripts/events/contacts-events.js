function initEvents() {
  DOM.contactNameEl.addEventListener("input", validateName);
  DOM.contactEmailEl.addEventListener("input", validateEmail);
  DOM.contactPhoneEl.addEventListener("input", validatePhone);
}
