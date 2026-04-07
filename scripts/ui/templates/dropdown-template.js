function getProfileDropdownTemplate() {
  return `
    <div id="profile-dropdown" class="profile-dropdown">

      <a href="./legal-notice.html">Legal Notice</a>
      <a href="./privacy-policy.html">Privacy Policy</a>
      
      <a href="./help-desk.html" class="mobile-only">Help</a>

      <a href="../index.html" onclick="logoutUser()">Log out</a>
    </div>
  `;
}