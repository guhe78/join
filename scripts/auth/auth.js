async function saveUserLogin(data) {
  const user = await findUser(data);
  persistUser(data, false);
}

function loginGuest() {
  persistUser({}, true);
}

function logoutUser() {
  localStorage.removeItem("joinUser");
  window.location.href = "../index.html";
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

function persistUser(user, isGuest = false) {
  localStorage.setItem(
    "joinUser",
    JSON.stringify({
      firstName: user.firstName || "Guest",
      lastName: user.lastName || "",
      userEmail: user.userEmail || "",
      isGuest: isGuest || true,
    }),
  );
}
