
async function initSummary() {
  await getTasks();
  updateSummary();
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
  if (task.priority === "high") summary.urgent++;
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
  const urgentTasks = tasks.filter(t => t.priority === "high");

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