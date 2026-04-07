DOM.formSignupEl.addEventListener("submit", getSignupData);
DOM.nameSignupEl.addEventListener("click", function () {
  DOM.warningMessageNameSignupEl.innerHTML = "";
});
DOM.emailSignupEl.addEventListener("click", function () {
  DOM.warningMessageEmailSignupEl.innerHTML = "";
});
DOM.passwordSignupEl.addEventListener("click", function () {
  DOM.warningMessagePasswordSignupEl.innerHTML = "";
});
DOM.passwordConfirmSignupEl.addEventListener("click", function () {
  DOM.warningMessagePasswordConfirmSignupEl.innerHTML = "";
});
DOM.privacyAcceptEl.addEventListener("click", function () {
  DOM.warningMessagePolicySignupEl.innerHTML = "";
});
