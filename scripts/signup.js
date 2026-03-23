const DOM = {
  formSignupEl: document.getElementById("form-signup"),
  nameSignupEl: document.getElementById("name-signup"),
  emailSignupEl: document.getElementById("email-signup"),
  passwordEl: document.getElementById("password-signup"),
  passwordConfirmEl: document.getElementById("password-confirm-signup"),
  privacyAcceptEl: document.getElementById("privacy-accept"),
  buttonSignupEl: document.getElementById("signup-button"),
};

DOM.formSignupEl.addEventListener("submit", getSignupData);

function initSignup() {}

async function getSignupData(event) {
  event.preventDefault();
  if (!checkName(DOM.nameSignupEl.value)) return;
  if (!checkEmail(DOM.emailSignupEl.value)) return;
  if (!checkPasswort(DOM.passwordEl.value, passwordConfirmEl.value)) return;
  const newUser = {
    userName: DOM.nameSignupEl.value,
    userEmail: DOM.emailSignupEl.value,
    userPassword: DOM.passwordEl.value,
  };
  await setUser(newUser);
  console.log(newUser);
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
  console.log(input);
  return pattern.test(input);
}

function checkPasswort(password, passwordConfirm) {
  if (password !== passwordConfirm) {
    return false;
  } else {
    return true;
  }
}
