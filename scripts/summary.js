let isMobile = window.innerWidth <= 1000;
let splashRunning = false;

async function initSummary() {
  await getTasks();
  updateSummary();
  initWelcome();
}

function updateDOM(summary) {
  document.getElementById("todo-count").textContent = summary.todo;
  document.getElementById("done-count").textContent = summary.done;
  document.getElementById("progress-count").textContent = summary.inProgress;
  document.getElementById("feedback-count").textContent = summary.review;
  document.getElementById("board-count").textContent = summary.total;
  document.getElementById("urgent-count").textContent = summary.urgent;
}

function updateSummary() {
  if (!tasks || tasks.length === 0) return;

  const summary = calculateSummary(tasks);

  updateDOM(summary);
  updateUrgentDeadline();
}

function calculateSummary(tasks) {
  const summary = {
    todo: 0,
    done: 0,
    inProgress: 0,
    review: 0,
    urgent: 0,
    total: tasks.length
  };

  for (let task of tasks) {
    updateTask(task, summary);
  }
  return summary;
}

function updateTask(task, summary) {
  if (task.status === "todo") summary.todo++;
  if (task.status === "done") summary.done++;
  if (task.status === "inProgress") summary.inProgress++;
  if (task.status === "review") summary.review++;
  if (task.priority === "urgent") summary.urgent++;
}

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

function getMostUrgentTask(tasks) {
  const urgentTasks = tasks.filter(t => t.priority === "urgent");

  if (urgentTasks.length === 0) return null;

  let mostUrgent = urgentTasks[0];

  for (let i = 1; i < urgentTasks.length; i++) {
    if (new Date(urgentTasks[i].due_date) < new Date(mostUrgent.due_date)) {
      mostUrgent = urgentTasks[i];
    }
  }

  return mostUrgent;
}

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
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
    summary: document.querySelector(".summary-section")
  };
}

function startSplash() {
  const { welcome, summary } = getWelcomeElements();

  if (!welcome || !summary) return;
  if (splashRunning) return;

  splashRunning = true;

  document.body.classList.add("mobile-welcome-active");

  runSplashAnimation(welcome, summary);
}

function runSplashAnimation(welcome, summary) {
  showWelcome(welcome, summary);

  setTimeout(() => {
    hideWelcome(welcome, summary);
  }, 1500);
}

function showWelcome(welcome, summary) {
  summary.style.opacity = "0";
  welcome.style.display = "flex";
  welcome.style.opacity = "1";
}

function hideWelcome(welcome, summary) {
  welcome.style.opacity = "0";

  setTimeout(() => {
    welcome.style.display = "none";
    summary.style.opacity = "1";
    splashRunning = false;
  }, 500);
}

function resetWelcome() {
  const { welcome, summary } = getWelcomeElements();

  if (!welcome || !summary) return;

  welcome.style.display = "";
  welcome.style.opacity = "";

  summary.style.opacity = "";

  document.body.classList.remove("mobile-welcome-active");
}

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