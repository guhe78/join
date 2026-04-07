const DOM = {
  formLoginEl: document.getElementById("login-form"),
  warningMessageLoginEl: document.getElementById("warning-login"),
  loginButtonEl: document.getElementById("login-button"),
  loginGuestButtonEl: document.getElementById("login-guest-button"),
  emailLoginEl: document.getElementById("email-login"),
  passwordLoginEl: document.getElementById("password-login"),
};

DOM.formLoginEl.addEventListener("submit", async (event) => {
  await userLogin(event);
});
DOM.loginGuestButtonEl.addEventListener("click", () => {
  window.location.href = "./pages/summary.html";
  loginGuest();
});

/**
 * Starts the splash screen animation by adding the appropriate CSS classes and setting timeouts for the animation sequence.
 * @returns {void}
 */
function startSplash() {
  let splash = document.getElementById("splash");
  if (!splash) return;
  let splashDelay = 800,
    animationDuration = 900,
    logoCornerDelay = 150;
  setTimeout(function () {
    splash.classList.add("animate");
    setTimeout(function () {
      document.body.classList.add("logo-early");
    }, logoCornerDelay);
    setTimeout(function () {
      splash.style.display = "none";
    }, animationDuration);
  }, splashDelay);
}

/**
 * Handles the user login process by validating the input, checking the user credentials, and redirecting to the summary page if successful.
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>}
 */
async function userLogin(event) {
  event.preventDefault();
  const loginData = getLoginInput();
  const users = await loadUsers();
  const user = validateUser(users, loginData);

  if (!user) {
    showLoginError();
    return;
  }
  persistUser(user);
  console.log("userLogin erfolgreich: ", user);
  window.location.href = "./link/summary.html";
}

/**
 * Retrieves the login input values from the form.
 * @returns {Object} - An object containing the user's email and password.
 */
function getLoginInput() {
  return {
    userEmail: DOM.emailLoginEl.value,
    userPassword: DOM.passwordLoginEl.value,
  };
}

/**
 * Clears the input fields and warning messages in the login form. This function is called after a successful login or when the user cancels the login operation to reset the form to its initial state.
 * @returns {void}
 */
function clearInputs() {
  DOM.emailLoginEl.value = "";
  DOM.passwordLoginEl.value = "";
  DOM.warningMessageLoginEl.innerHTML = "";
}
