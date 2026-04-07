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

function updateTask(task, summary) {
  if (task.status === "todo") summary.todo++;
  if (task.status === "done") summary.done++;
  if (task.status === "inProgress") summary.inProgress++;
  if (task.status === "review") summary.review++;
  if (task.priority === "urgent") summary.urgent++;
}

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

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
