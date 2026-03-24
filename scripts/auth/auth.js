async function saveLoginUser(user) {
  const users = await getData("users");
  console.log(users);
  localStorage.setItem(
    "user",
    JSON.stringify({
      id: user.key,
      email: user.email,
    }),
  );
}
