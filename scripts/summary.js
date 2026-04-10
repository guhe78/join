let isMobile = window.innerWidth <= 1100;
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
  if (!tasks || tasks.length === 0) return;

  const summary = calculateSummary(tasks);
  updateDOM(summary);
  updateUrgentDeadline();
}

/**
 * Retrieves the welcome and summary elements from the DOM.
 * @returns {Object} An object containing the welcome and summary elements.
 */
function getWelcomeElements() {
  return {
    welcome: document.querySelector(".welcome-section"),
    summary: document.querySelector(".summary-container"),
  };
}

/**
 * Initializes the welcome animation by showing the welcome section and then hiding it after a delay.
 * This function checks if the device is mobile and if the splash animation is not already running before starting the animation.
 * It adds a class to the body to activate the mobile welcome styles and then removes the class after a set timeout to hide the welcome section.
 * @returns {void}
 */
function initWelcome() {
  startSplash();
  window.addEventListener("resize", handleResize);
}
