
async function initSummary() {
  await getTasks();
  updateSummary();
}

function updateSummary() {

  const todoTasks = tasks.filter(t => t.status === "todo").length;
  const doneTasks = tasks.filter(t => t.status === "done").length;
  const inProgressTasks = tasks.filter(t => t.status === "inProgress").length;
  const reviewTasks = tasks.filter(t => t.status === "review").length;
  const totalTasks = tasks.length;
  const urgentTasks = tasks.filter(t => t.priority === "high").length;

  document.getElementById("todo-count").textContent = todoTasks;
  document.getElementById("done-count").textContent = doneTasks;
  document.getElementById("progress-count").textContent = inProgressTasks;
  document.getElementById("feedback-count").textContent = reviewTasks;
  document.getElementById("board-count").textContent = totalTasks;
  document.getElementById("urgent-count").textContent = urgentTasks;

  updateUrgentDeadline();
}

function updateUrgentDeadline() {
  const urgentDateEl = document.getElementById("urgent-date");
  if (!urgentDateEl) {
    console.error('Element mit id="urgent-date" nicht gefunden');
    return;
  }

  const urgentTasks = tasks.filter((t) => t.priority === "high");

  if (urgentTasks.length === 0) {
    urgentDateEl.textContent = "No urgent tasks";
    return;
  }

  let mostUrgent = urgentTasks[0];

  for (let i = 1; i < urgentTasks.length; i++) {
    if (new Date(urgentTasks[i].due_date) < new Date(mostUrgent.due_date)) {
      mostUrgent = urgentTasks[i];
    }
  }

  urgentDateEl.textContent = formatDate(mostUrgent.due_date);
}

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}