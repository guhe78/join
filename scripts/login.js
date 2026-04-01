const DOM = {
  formLoginEl: document.getElementById("login-form"),
  warningMessageLoginEl: document.getElementById("warning-login"),
  loginButtonEl: document.getElementById("login-button"),
  loginGuestButtonEl: document.getElementById("login-guest-button"),
  emailLoginEl: document.getElementById("email-login"),
  passwordLoginEl: document.getElementById("password-login"),
};

DOM.formLoginEl.addEventListener("submit", userLogin);
DOM.loginGuestButtonEl.onclick = () => {
  window.location.href = "./link/summary.html";
};

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

function getLoginInput() {
  return {
    userEmail: DOM.emailLoginEl.value,
    userPassword: DOM.passwordLoginEl.value,
  };
}

function clearInputs() {
  DOM.emailLoginEl.value = "";
  DOM.passwordLoginEl.value = "";
  DOM.warningMessageLoginEl.innerHTML = "";
}
