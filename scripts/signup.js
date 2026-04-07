/**
 * Handles the signup form submission by validating the input, creating a new user, and displaying a toast message upon successful signup.
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>}
 */
async function getSignupData(event) {
  event.preventDefault();
  if (!isEmptyInputs() || !validateInputs()) return;

  let userNameArray = DOM.nameSignupEl.value.trim().split(" ");
  if (userNameArray.length < 2) {
    DOM.warningMessageNameSignupEl.innerHTML = "First- and lastname required";
    return;
  }
  const newUser = {
    firstName: userNameArray[0],
    lastName: userNameArray[1],
    userEmail: DOM.emailSignupEl.value,
    userPassword: DOM.passwordSignupEl.value,
  };
  if (!DOM.privacyAcceptEl.checked) {
    DOM.warningMessagePolicySignupEl.innerHTML = "Accept the privacy policy";
  } else {
    await setUser(newUser);
    DOM.toastSectionEl.classList.add("fade-in");
    setTimeout(() => {
      DOM.toastSectionEl.classList.remove("fade-in");
      window.location.href = "../index.html";
    }, 2000);
  }
}

/**
 * Validates the signup form inputs by checking the name, email, and password fields.
 * @returns {boolean} - Returns true if all inputs are valid, false otherwise.
 */
function validateInputs() {
  let isValidate = true;
  if (!checkName(DOM.nameSignupEl.value.trim())) {
    DOM.warningMessageNameSignupEl.innerHTML =
      "Firstname and Lastname required";
    isValidate = false;
  }
  if (!checkEmail(DOM.emailSignupEl.value)) {
    DOM.warningMessageEmailSignupEl.innerHTML = "Email required";
    isValidate = false;
  }
  if (
    !checkPassword(
      DOM.passwordSignupEl.value,
      DOM.passwordConfirmSignupEl.value,
    )
  ) {
    DOM.warningMessagePasswordSignupEl.innerHTML = "Password different";
    isValidate = false;
  }
  return isValidate;
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
 * Checks if the name input contains at least a first name and a last name by splitting the input string and checking the length of the resulting array.
 * @param {string} input - The name input string to be checked.
 * @returns {boolean} - Returns true if the input contains at least a first name and a last name, false otherwise.
 */
function checkName(input) {
  let check = input.split(" ");
  return check.length > 1;
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

/**
 * Checks if the password and password confirmation inputs match.
 * @param {string} password - The password input string to be checked.
 * @param {string} passwordConfirm - The password confirmation input string to be checked.
 * @returns {boolean} - Returns true if the password and confirmation match, false otherwise.
 */
function checkPassword(password, passwordConfirm) {
  if (password !== passwordConfirm) {
    return false;
  } else {
    return true;
  }
}

/**
 * Checks if any of the signup form input fields are empty and displays appropriate warning messages for each empty field. This function is called when the user submits the signup form to ensure that all required fields are filled out before proceeding with the signup process.
 * @returns {boolean} - Returns true if all input fields are filled, false if any field is empty.
 */
function isEmptyInputs() {
  let returnValue = true;
  if (DOM.nameSignupEl.value.length === 0) {
    DOM.warningMessageNameSignupEl.innerHTML = "Name required";
    returnValue = false;
  }
  if (DOM.emailSignupEl.value.length === 0) {
    DOM.warningMessageEmailSignupEl.innerHTML = "Email required";
    returnValue = false;
  }
  if (DOM.passwordSignupEl.value.length === 0) {
    DOM.warningMessagePasswordSignupEl.innerHTML = "Password required";
    returnValue = false;
  }
  if (DOM.passwordConfirmSignupEl.value.length === 0) {
    DOM.warningMessagePasswordConfirmSignupEl.innerHTML = "Password required";
    returnValue = false;
  }
  return returnValue;
}

/**
 * Clears the input fields in the signup form. This function is called after a successful signup or when the user cancels the signup operation to reset the form to its initial state.
 * @param {Event} event - The form submission event.
 * @returns {void}
 */
function clearInput(event) {
  event.value = "";
}
