/**
 * Updates the user interface with the user's profile information and a greeting message. This function retrieves the user data using the `getUserData` function, which likely returns an object containing the user's name and initials. It then updates the DOM elements with the user's initials, name, and a greeting message based on the current time of day. The greeting message is generated using the `getGreeting` function, which returns a different message depending on whether it's morning, afternoon, or evening. This function ensures that the summary page displays personalized information for the user.
 * @returns {void}
 */
function updateUserUI() {
  const user = getUserData();

  document.getElementById("profile-button").innerHTML = user.initials;
  document.getElementById("user-name").innerHTML = user.name;
  document.querySelector(".welcome-section h2").textContent = getGreeting();
}

/**
 * Updates the DOM elements with the provided summary statistics.
 * @param {Object} summary - The summary object containing task statistics.
 */
function updateDOM(summary) {
  document.getElementById("todo-count").textContent = summary.todo;
  document.getElementById("done-count").textContent = summary.done;
  document.getElementById("progress-count").textContent = summary.inProgress;
  document.getElementById("feedback-count").textContent = summary.review;
  document.getElementById("board-count").textContent = summary.total;
  document.getElementById("urgent-count").textContent = summary.urgent;
}

/**
 * Updates the summary section of the page by calculating task statistics and displaying the most urgent task. This function retrieves the summary elements from the DOM, calculates the summary statistics using the `calculateSummary` function, and updates the corresponding elements with the calculated values. It also determines the most urgent task and displays its due date in a human-readable format. If there are no urgent tasks, it displays a message indicating that there are no urgent tasks.
 * @returns {void}
 */
function updateSummary() {
  if (!tasks || tasks.length === 0) return;

  const summary = calculateSummary(tasks);

  updateDOM(summary);
  updateUrgentDeadline();
}

/**
 * Updates the urgent deadline section of the summary.
 * @returns {void}
 */
function updateUrgentDeadline() {
  const urgentDateEl = document.getElementById("urgent-date");
  if (!urgentDateEl) return;

  const mostUrgent = getMostUrgentTask(tasks);

  if (!mostUrgent) {
    urgentDateEl.textContent = "No urgent tasks";
    return;
  }

  urgentDateEl.textContent = formatDate(mostUrgent.due_date);
}

/**
 * Starts the splash animation by showing the welcome section and then hiding it after a delay.
 * @returns {void}
 */
function startSplash() {
  const { welcome, summary } = getWelcomeElements();

  if (!welcome || !summary) return;
  if (splashRunning) return;

  splashRunning = true;

  document.body.classList.add("mobile-welcome-active");

  runSplashAnimation(welcome, summary);
}

/**
 * Runs the splash animation by showing the welcome section and then hiding it after a delay.
 * @param {HTMLElement} welcome - The welcome section element.
 * @param {HTMLElement} summary - The summary section element.
 */
function runSplashAnimation(welcome, summary) {
  showWelcome(welcome, summary);

  setTimeout(() => {
    hideWelcome(welcome, summary);
  }, 1500);
}

/**
 * Initializes the welcome screen by hiding the welcome section and showing the summary section. This function is called on page load to ensure that the summary screen is displayed by default, and the welcome screen is only shown during the splash animation on mobile devices.
 * @returns {void}
 */
function initWelcome() {
  if (isMobile) {
    startSplash();
  }

  window.addEventListener("resize", handleResize);
}

/**
 * Shows the welcome section and hides the summary section. This function is called at the start of the splash animation to display the welcome screen.
 * @param {HTMLElement} welcome - The welcome section element.
 * @param {HTMLElement} summary - The summary section element.
 */
function showWelcome(welcome, summary) {
  summary.style.opacity = "0";
  welcome.style.display = "flex";
  welcome.style.opacity = "1";
}

/**
 * Hides the welcome section and shows the summary section. This function is called after the splash animation completes to transition from the welcome screen to the summary screen.
 * @param {HTMLElement} welcome - The welcome section element.
 * @param {HTMLElement} summary - The summary section element.
 */
function hideWelcome(welcome, summary) {
  welcome.style.opacity = "0";

  setTimeout(() => {
    welcome.style.display = "none";
    summary.style.opacity = "1";
    splashRunning = false;
  }, 500);
}

/**
 * Resets the welcome screen by hiding the welcome section and showing the summary section. This function is called when the user resizes the window from mobile to desktop view to ensure that the appropriate UI is displayed for the current screen size.
 * @returns {void}
 */
function resetWelcome() {
  const { welcome, summary } = getWelcomeElements();

  if (!welcome || !summary) return;

  welcome.style.display = "";
  welcome.style.opacity = "";

  summary.style.opacity = "";

  document.body.classList.remove("mobile-welcome-active");
}

/**
 * Handles the window resize event to determine if the view has switched between mobile and desktop. If the view has switched to mobile, it starts the splash animation. If it has switched to desktop, it resets the welcome screen. This function ensures that the appropriate UI is displayed based on the current screen size.
 * @returns {void}
 */
function handleResize() {
  const nowMobile = window.innerWidth <= 1000;

  if (!isMobile && nowMobile) {
    startSplash();
  }

  if (isMobile && !nowMobile) {
    resetWelcome();
  }

  isMobile = nowMobile;
}

/**
 * Returns a greeting message based on the current time of day.
 * @returns {string} The greeting message.
 */
function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning,";
  if (hour < 18) return "Good afternoon,";
  return "Good evening,";
}

/**
 * Initializes the card links on the summary page by adding click event listeners to each card element. When a card is clicked, it navigates the user to the corresponding section of the board page based on the card's status (e.g., todo, done, in progress, review). This function enhances the interactivity of the summary page by allowing users to quickly access specific task categories directly from the summary cards.
 * @returns {void}
 */
function initCardLinks() {
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => handleCardClick(card));
  });
}

/**
 * Handles the click event for a card element and navigates to the corresponding section of the board page.
 * @param {HTMLElement} card - The card element that was clicked.
 */
function handleCardClick(card) {
  let url = "board.html";

  if (card.classList.contains("todo")) {
    url += "#todo";
  } else if (card.classList.contains("done")) {
    url += "#done";
  } else if (card.classList.contains("progress")) {
    url += "#inProgress";
  } else if (card.classList.contains("feedback")) {
    url += "#review";
  }

  window.location.href = url;
}
