/**
 * Saves the user login information by finding the user and persisting their data.
 * @param {Object} data - The login data containing user credentials.
 * @returns {Promise<void>}
 */
async function saveUserLogin(data) {
  const user = await findUser(data);
  persistUser(user, false);
}

/**
 * User login function that allows a guest user to log in without providing credentials.
 * This function is responsible for logging in a guest user by persisting an empty user object with a flag indicating that the user is a guest. It allows users to access the application without creating an account or providing login credentials, while still maintaining a session for the guest user.
 * @returns {void}
 */
function loginGuest() {
  persistUser({}, true);
}

/**
 * User logout function that removes the user's information from local storage and redirects to the login page.
 * This function is responsible for logging out the user by clearing their session data from local storage and redirecting them to the login page. It ensures that the user's authentication state is properly managed and that they are taken back to the appropriate page after logging out.
 * @returns {void}
 */
function logoutUser() {
  localStorage.removeItem("joinUser");
  window.location.href = "../index.html";
}

/**
 * Loads the list of users from the data source and returns them as an array.
 * @returns {Promise<Array>} - A promise that resolves to an array of user objects.
 */
async function loadUsers() {
  const users = await getData("users");
  return makeArray(users);
}

/**
 * Validates the user credentials against the list of users.
 * @param {Array} users - The array of user objects.
 * @param {Object} loginData - The login data containing user credentials.
 * @returns {Object|undefined} - The user object if validation is successful, otherwise undefined.
 */
function validateUser(users, loginData) {
  return users.find(
    (u) =>
      u.userEmail === loginData.userEmail &&
      u.userPassword === loginData.userPassword,
  );
}

/**
 * Shows a login error message to the user when the provided credentials are incorrect.
 * This function is responsible for displaying an error message to the user when their login attempt fails due to incorrect email or password. It updates the content of a warning message element in the DOM to inform the user about the issue with their login credentials.
 * @returns {void}
 */
function showLoginError() {
  DOM.warningMessageLoginEl.textContent = "Email or password wrong";
}

/**
 * Persists the user information in local storage.
 * @param {Object} user - The user object containing user details.
 * @param {boolean} isGuest - A flag indicating whether the user is a guest.
 * @returns {void}
 */
function persistUser(user, isGuest = false) {
  localStorage.setItem(
    "joinUser",
    JSON.stringify({
      firstName: user.firstName || "Guest",
      lastName: user.lastName || "",
      userEmail: user.userEmail || "",
      isGuest: isGuest,
    }),
  );
}
