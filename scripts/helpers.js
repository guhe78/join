function makeArray(data) {
  let array = Object.entries(data).map(([key, value]) => ({
    firebaseKey: key,
    ...value,
  }));
  return array;
}

function getUserData() {
  const userData = localStorage.getItem("joinUser");
  const data = JSON.parse(userData);

  if (data.isGuest === false) {
    return {
      initials:
        data.firstName[0].toUpperCase() + data.lastName[0].toUpperCase(),
      name: data.firstName + " " + data.lastName,
    };
  } else {
    return { initials: "G", name: "Guest" };
  }
}

function checkAuth() {
  const user = JSON.parse(localStorage.getItem("joinUser"));

  if (!user) {
    window.location.href = "../index.html";
  }
}
