function initNotRegistered() {
  const loginButton = document.getElementById("login-sidepages");

  loginButton.innerHTML = `<p class="login-btn-notregistered">${loginIcon()}&nbsp;Login</p>`;
}
