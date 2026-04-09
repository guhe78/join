/**
 * This function initializes the event listeners for the signup form. It sets up listeners for the form submission and input events on the name, email, password, and password confirmation fields. Additionally, it listens for changes on the privacy policy acceptance checkbox to clear any warning messages when the user interacts with it.
 * @returns {void}
 */
function initEvents() {
  DOM.formSignupEl.addEventListener("submit", getSignupData);

  DOM.nameSignupEl.addEventListener("input", validateName);
  DOM.emailSignupEl.addEventListener("input", validateEmail);
  DOM.passwordSignupEl.addEventListener("input", validatePassword);
  DOM.passwordConfirmSignupEl.addEventListener("input", validatePassword);

  DOM.privacyAcceptEl.addEventListener("change", () => {
    DOM.warningMessagePolicySignupEl.textContent = "";
  });
}
