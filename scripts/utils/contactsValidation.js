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
