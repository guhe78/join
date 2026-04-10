let isMobile = window.innerWidth <= 1000;
let splashRunning = false;

/**
 * Initializes the summary page by checking user authentication, fetching tasks, updating the summary, and setting up the welcome animation and UI.
 */
async function initSummary() {
  checkAuth();
  await getTasks();
  updateSummary();
  initWelcome();
  updateUserUI();
  initCardLinks();
  setActiveLink();
}

/**
 * Updates the summary section of the page by calculating task statistics and displaying the most urgent task.
 * This function retrieves the summary elements from the DOM, calculates the summary statistics using the `calculateSummary` function, and updates the corresponding elements with the calculated values. It also determines the most urgent task and displays its due date in a human-readable format. If there are no urgent tasks, it displays a message indicating that there are no urgent tasks.
 */
function updateSummary() {
  function initWelcome() {
    if (isMobile) {
      startSplash();
    }

    window.addEventListener("resize", handleResize);
  }
}

/**
 * Retrieves the welcome and summary elements from the DOM.
 * @returns {Object} An object containing the welcome and summary elements.
 */
function getWelcomeElements() {
  return {
    welcome: document.querySelector(".welcome-section"),
    summary: document.querySelector(".summary-section"),
  };
}
