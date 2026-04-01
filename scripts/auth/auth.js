async function saveUserLogin(data) {
  const user = await findUser(data);
  localStorage.setItem(
    "joinUser",
    JSON.stringify({
      firstName: user.firstName,
      lastName: user.lastName,
      userEmail: user.userEmail,
    }),
  );
}

async function loadUsers() {
  const users = await getData("users");
  return makeArray(users);
}

function validateUser(users, loginData) {
  return users.find(
    (u) =>
      u.userEmail === loginData.userEmail &&
      u.userPassword === loginData.userPassword,
  );
}

function showLoginError() {
  DOM.warningMessageLoginEl.textContent = "Email or password wrong";
}

function persistUser(user) {
  localStorage.setItem(
    "joinUser",
    JSON.stringify({
      firstName: user.firstName,
      lastName: user.lastName,
      userEmail: user.userEmail,
    }),
  );
}
