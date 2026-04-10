/**
 * Initializes the not-registered page by setting up the login button.
 * Renders the login button with icon on the side pages for unregistered users.
 */
function initNotRegistered() {
  const loginButton = document.getElementById("login-sidepages");

  loginButton.innerHTML = `<p class="login-btn-notregistered">${loginIcon()}&nbsp;Login</p>`;
}
