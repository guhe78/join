const DOM = {
  formSignupEl: document.getElementById("form-signup"),
  nameSignupEl: document.getElementById("name-signup"),
  emailSignupEl: document.getElementById("email-signup"),
  passwordSignupEl: document.getElementById("password-signup"),
  passwordConfirmSignupEl: document.getElementById("password-confirm-signup"),
  privacyAcceptEl: document.getElementById("privacy-accept"),
  buttonSignupEl: document.getElementById("signup-button"),
  warningMessageNameSignupEl: document.getElementById("warning-name-signup"),
  warningMessageEmailSignupEl: document.getElementById("warning-email-signup"),
  warningMessagePasswordSignupEl: document.getElementById(
    "warning-password-signup",
  ),
  warningMessagePasswordConfirmSignupEl: document.getElementById(
    "warning-password-confirm-signup",
  ),
  warningMessagePolicySignupEl: document.getElementById(
    "warning-policy-signup",
  ),
  toastSectionEl: document.getElementById("toast-section"),
};

DOM.formSignupEl.addEventListener("submit", getSignupData);
DOM.nameSignupEl.addEventListener("click", function () {
  DOM.warningMessageNameSignupEl.innerHTML = "";
});
DOM.emailSignupEl.addEventListener("click", function () {
  DOM.warningMessageEmailSignupEl.innerHTML = "";
  console.log();
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

async function setUser(user) {
  await postData("users", user);
}

function checkName(input) {
  let check = input.split(" ");
  return check.length > 1;
}

function checkEmail(input) {
  const pattern =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return pattern.test(input);
}

function checkPassword(password, passwordConfirm) {
  if (password !== passwordConfirm) {
    return false;
  } else {
    return true;
  }
}

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

function clearInput(event) {
  event.value = "";
}
