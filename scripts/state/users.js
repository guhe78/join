function getUsers() {
  return getState().users;
}
async function addUser(user) {
  const state = getState();
  state.users.push(user);

  await postData("users", user);
}
