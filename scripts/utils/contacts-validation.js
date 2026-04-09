/**
 * Validates the contact inputs by checking the name, email, and phone fields.
 * It ensures that the name contains at least a first name and a last name, the email is in a valid format, and the phone number contains only valid characters.
 * If any of the validations fail, it displays appropriate warning messages to the user.
 * @returns {boolean} - Returns true if all inputs are valid, otherwise false.
 */
function validateContactInputs() {
  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();
  return isNameValid && isEmailValid && isPhoneValid;
}

/**
 * Validates the name input by checking if it contains at least a first name and a last name, and if each part of the name has at least 2 letters.
 * It displays a warning message if the validation fails.
 * @returns {boolean} - Returns true if the name is valid, otherwise false.
 */
function validateName() {
  const name = DOM.contactNameEl.value.trim();
  const parts = name.split(/\s+/).filter(Boolean);

  if (parts.length < 2) {
    DOM.warningMessageNameEl.textContent = "Firstname and lastname required";
    return false;
  }

  const isValid = parts.every((part) => /^[A-Za-zÄÖÜäöüß-]{2,}$/.test(part));
  DOM.warningMessageNameEl.textContent = isValid
    ? ""
    : "Each name part must have at least 2 letters";
  return isValid;
}

/**
 * Validates the email input by checking if it is not empty and if it matches a valid email format. It displays appropriate warning messages if the validation fails.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 */
function validateEmail() {
  const email = DOM.contactEmailEl.value.trim();

  if (email.length === 0) {
    DOM.warningMessageEmailEl.textContent = "Email required";
    return false;
  }

  if (!checkEmail(email)) {
    DOM.warningMessageEmailEl.textContent =
      "Please enter a valid email address";
    return false;
  }

  DOM.warningMessageEmailEl.textContent = "";
  return true;
}

/**
 * Validates the phone input by checking if it is not empty and if it matches a valid phone format. It displays appropriate warning messages if the validation fails.
 * @returns {boolean} - Returns true if the phone number is valid, otherwise false.
 */
function validatePhone() {
  const phone = DOM.contactPhoneEl.value.trim();

  if (phone.length === 0) {
    DOM.warningMessagePhoneEl.textContent = "Phone number required";
    return false;
  }

  if (!checkPhone(phone)) {
    DOM.warningMessagePhoneEl.textContent = "Please enter a valid phone number";
    return false;
  }

  DOM.warningMessagePhoneEl.textContent = "";
  return true;
}

/**
 * Checks if the given input is a valid email address.
 * @param {string} input - The email address to check.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 */
function checkEmail(input) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return pattern.test(input);
}

/**
 * Checks if the given input is a valid phone number.
 * @param {string} input - The phone number to check.
 * @returns {boolean} - Returns true if the phone number is valid, otherwise false.
 */
function checkPhone(input) {
  const pattern = /^[0-9+\-\s()]+$/;
  return pattern.test(input);
}
