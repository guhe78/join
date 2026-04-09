/**
 * Returns the CSS active class for a priority button if it matches the task priority.
 * @param {string} taskPriority - The priority of the task being edited.
 * @param {string} buttonPriority - The priority this button represents.
 * @returns {string} The "is-active" class or an empty string.
 */
function getEditPriorityActiveClass(taskPriority, buttonPriority) {
  if (taskPriority === buttonPriority) {
    return "is-active";
  }
  return "";
}

/**
 * Converts existing subtasks into the Firebase compatible format.
 * @param {Object} oldSubtasks - The original subtasks object from the task.
 * @returns {Object} Updated subtasks object with preserved completion status.
 */
function buildEditedSubtasks(oldSubtasks) {
  let updatedSubtasks = {};
  let keys = [];
  let oldKey;
  let subtaskKey;
  let doneValue;
  if (oldSubtasks) {
    keys = Object.keys(oldSubtasks);
  }
  for (let i = 0; i < subtasks.length; i++) {
    oldKey = keys[i];
    subtaskKey = oldKey !== undefined ? oldKey : "subtask_" + i;
    doneValue = false;
    if (oldKey !== undefined && oldSubtasks[oldKey]) {
      doneValue = oldSubtasks[oldKey].is_done;
    }
    updatedSubtasks[subtaskKey] = {
      title: subtasks[i],
      is_done: doneValue,
    };
  }
  return updatedSubtasks;
}
