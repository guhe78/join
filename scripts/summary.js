let isMobile = window.innerWidth <= 1000;
let splashRunning = false;

async function initSummary() {
  checkAuth();
  await getTasks();
  updateSummary();
  initWelcome();
  updateUserUI();
  initCardLinks();
}

function initWelcome() {
  if (isMobile) {
    startSplash();
  }

  window.addEventListener("resize", handleResize);
}

function getWelcomeElements() {
  return {
    welcome: document.querySelector(".welcome-section"),
    summary: document.querySelector(".summary-section"),
  };
}
