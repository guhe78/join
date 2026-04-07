/**
 * Calculates the summary statistics for a given list of tasks.
 * @param {Array} tasks - The list of tasks to summarize.
 * @returns {Object} An object containing the summary statistics.
 */
function calculateSummary(tasks) {
  const summary = {
    todo: 0,
    done: 0,
    inProgress: 0,
    review: 0,
    urgent: 0,
    total: tasks.length,
  };

  for (let task of tasks) {
    updateTask(task, summary);
  }
  return summary;
}

/**
 * Validates the due date field in the task form.
 * @returns {boolean} True if the due date is valid, false otherwise.
 * */
function updateTask(task, summary) {
  if (task.status === "todo") summary.todo++;
  if (task.status === "done") summary.done++;
  if (task.status === "inProgress") summary.inProgress++;
  if (task.status === "review") summary.review++;
  if (task.priority === "urgent") summary.urgent++;
}

/**
 * Retrieves the most urgent task from a list of tasks.
 * @param {Array} tasks - The list of tasks to search.
 * @returns {Object|null} The most urgent task or null if none exist.
 */
function getMostUrgentTask(tasks) {
  const urgentTasks = tasks.filter((t) => t.priority === "urgent");

  if (urgentTasks.length === 0) return null;

  let mostUrgent = urgentTasks[0];

  for (let i = 1; i < urgentTasks.length; i++) {
    if (new Date(urgentTasks[i].due_date) < new Date(mostUrgent.due_date)) {
      mostUrgent = urgentTasks[i];
    }
  }

  return mostUrgent;
}

/**
 * Validates the due date field in the task form.
 * @returns {boolean} True if the due date is valid, false otherwise.
 */
function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
