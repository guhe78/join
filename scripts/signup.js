/**
 * This function is the initialization function for the signup page.
 * It calls the initEvents function to set up event listeners for the signup form and input fields.
 * The init function is called when the DOM content is fully loaded, ensuring that all elements are available for manipulation.
 * @returns {void}
 */
function init() {
  initEvents();
}

/**
 * Handles the signup form submission by validating the input, creating a new user, and displaying a toast message upon successful signup.
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>}
 */
async function getSignupData(event) {
  event.preventDefault();
  if (!validateInputs()) return;
  const userNameArray = DOM.nameSignupEl.value.trim().split(/\s+/);
  const newUser = {
    firstName: userNameArray[0],
    lastName: userNameArray.at(-1),
    userEmail: DOM.emailSignupEl.value.trim(),
    userPassword: DOM.passwordSignupEl.value,
  };
  if (!DOM.privacyAcceptEl.checked) {
    DOM.warningMessagePolicySignupEl.textContent = "Accept the privacy policy";
    return;
  }
  if (await userExists(newUser.userEmail)) {
    DOM.warningMessageEmailSignupEl.textContent =
      "An account with this email already exists";
    return;
  }
  await setUser(newUser);
  forwardToIndex();
}

/**
 * Forwards the user to the index page after a successful signup by displaying a toast message and then redirecting to the index page after a short delay.
 * @returns {void}
 */
function forwardToIndex() {
  DOM.toastSectionEl.classList.add("fade-in");
  setTimeout(() => {
    DOM.toastSectionEl.classList.remove("fade-in");
    window.location.href = "../index.html";
  }, 2000);
}

/**
 * Validates the signup form inputs by checking the name, email, and password fields.
 * @returns {boolean} - Returns true if all inputs are valid, false otherwise.
 */
function validateInputs() {
  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword(true);
  return isNameValid && isEmailValid && isPasswordValid;
}

/**
 * Validates the name input by checking if it contains at least a first name and a last name, and if each part meets the required format.
 * @returns {boolean} - Returns true if the name is valid, false otherwise.
 */
function validateName() {
  const name = DOM.nameSignupEl.value.trim();
  const parts = name.split(/\s+/).filter(Boolean);

  if (parts.length < 2) {
    DOM.warningMessageNameSignupEl.textContent =
      "Firstname and lastname required";
    return false;
  }

  const isValid = parts.every((part) => /^[A-Za-zÄÖÜäöüß-]{2,}$/.test(part));
  DOM.warningMessageNameSignupEl.textContent = isValid
    ? ""
    : "Names with 2 letters";
  return isValid;
}

/**
 * Validates the email input by checking if it is not empty and if it matches a valid email format. The validation is triggered on input and on form submission.
 * @returns {boolean} - Returns true if the email is valid, false otherwise.
 */
function validateEmail() {
  const email = DOM.emailSignupEl.value.trim();

  if (email.length === 0) {
    DOM.warningMessageEmailSignupEl.textContent = "Email required";
    return false;
  }

  if (!checkEmail(email)) {
    DOM.warningMessageEmailSignupEl.textContent =
      "Please enter a valid email address";
    return false;
  }

  DOM.warningMessageEmailSignupEl.textContent = "";
  return true;
}

/**
 * Validates the password and password confirmation fields by checking if they are not empty and if they match. The validation is triggered on input and on form submission.
 * @param {boolean} forceValidation - true on submit, false while typing
 */
function validatePassword(forceValidation = false) {
  const password = DOM.passwordSignupEl.value;
  const passwordConfirm = DOM.passwordConfirmSignupEl.value;

  const hasStarted = password.length > 0 || passwordConfirm.length > 0;
  if (!forceValidation && !hasStarted) {
    DOM.warningMessagePasswordSignupEl.textContent = "";
    DOM.warningMessagePasswordConfirmSignupEl.textContent = "";
    return true;
  }

  let isValid = true;

  isValid = checkPasswordLength(password);

  isValid = checkConfirmPasswordLength(password, passwordConfirm);

  return isValid;
}

/**
 * Checks if the password meets the required length and updates the warning message accordingly.
 * @param {string} password - The password to check.
 * @returns {boolean} - Returns true if the password meets the required length, false otherwise.
 */
function checkPasswordLength(password) {
  if (password.length === 0) {
    DOM.warningMessagePasswordSignupEl.textContent = "Password required";
    return false;
  } else {
    DOM.warningMessagePasswordSignupEl.textContent = "";
    return true;
  }
}

/**
 * Checks if the password confirmation meets the required length and matches the password, updating the warning message accordingly.
 * @param {string} password - The password to check against.
 * @param {string} passwordConfirm - The password confirmation to check.
 * @returns {boolean} - Returns true if the password confirmation meets the required length and matches the password, false otherwise.
 */
function checkConfirmPasswordLength(password, passwordConfirm) {
  if (passwordConfirm.length === 0) {
    DOM.warningMessagePasswordConfirmSignupEl.textContent =
      "Please confirm your password";
    return false;
  } else if (password !== passwordConfirm) {
    DOM.warningMessagePasswordConfirmSignupEl.textContent =
      "Passwords do not match";
    return false;
  } else {
    DOM.warningMessagePasswordConfirmSignupEl.textContent = "";
    return true;
  }
}

/**
 * Checks if a user with the given email already exists in the database.
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} - Returns true if the user exists, false otherwise.
 */
async function userExists(email) {
  const users = await getData("users");
  const userArray = makeArray(users);
  return userArray.some((user) => user.userEmail === email);
}

/**
 * Posts a new user to the Firebase database using the postData function from services.js. This function is called when the user submits the signup form and the input validation is successful.
 * @param {Object} user - The user object containing the first name, last name, email, and password of the new user.
 * @returns {Promise<void>}
 */
async function setUser(user) {
  await postData("users", user);
}

/**
 * Checks if the email input is in a valid email format using a regular expression pattern.
 * @param {string} input - The email input string to be checked.
 * @returns {boolean} - Returns true if the input is in a valid email format, false otherwise.
 */
function checkEmail(input) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return pattern.test(input);
}
