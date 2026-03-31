function makeArray(data) {
  let array = Object.entries(data).map(([key, value]) => ({
    firebaseKey: key,
    ...value,
  }));
  return array;
}

function getUserData() {
  const userData = localStorage.getItem("joinUser");

  if (userData) {
    const data = JSON.parse(userData);
    return {
      initials:
        data.firstName[0].toUpperCase() + data.lastName[0].toUpperCase(),
      name: data.firstName + " " + data.lastName,
    };
  } else {
    return { initials: "G", name: null };
  }
}
