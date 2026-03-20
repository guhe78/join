/**
 * Converts a task due date to DD/MM/YYYY for display in edit mode.
 * @param {Object} task - The task object.
 * @returns {string} The formatted date string or an empty string.
 */
function transformDate(task) {
  const rawDate = task.due_date;
  if (!rawDate) return "";
  if (rawDate.includes("/")) return rawDate;
  const [year, month, day] = rawDate.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}