/**
 * Returns all tasks that belong to a specific status.
 * @param {Array} taskList - The source list of tasks.
 * @param {string} status - The status to match.
 * @returns {Array} A filtered task array.
 */
function filterTasksByStatus(taskList, status) {
  const filtered = [];
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].status === status) {
      filtered.push(taskList[i]);
    }
  }
  return filtered;
}

/**
 * Filters tasks by title or description using the provided query.
 * @param {Array} taskList - The source list of tasks.
 * @param {string} query - The lowercased search query.
 * @returns {Array} Matching tasks.
 */
function filterTasksByQuery(taskList, query) {
  return taskList.filter(
    (task) =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query),
  );
}

/**
 * Calculates progress and statistics for subtasks.
 * @param {Object} subtasks - The subtasks object from the task.
 * @returns {Object} Statistics including total count, completion percentage, and display text.
 */
function getSubtaskStats(subtasks) {
  const subtaskArray = subtasks ? Object.values(subtasks) : [];
  const total = subtaskArray.length;
  let doneCount = 0;
  for (let i = 0; i < total; i++) {
    if (subtaskArray[i].is_done) {
      doneCount++;
    }
  }
  return {
    total: total,
    hasSubtasks: total > 0,
    percent: total > 0 ? (doneCount / total) * 100 : 0,
    text: `${doneCount}/${total} Subtasks`,
  };
}

/**
 * Prepares and formats task data for use in the HTML template.
 * @param {Object} element - The raw task object.
 * @returns {Object} The formatted task data object.
 */
function prepareTaskData(element) {
  const stats = getSubtaskStats(element.subtasks);
  const categoryClass = element.category.toLowerCase().replace(/\s+/g, "-");
  const badges = generateBadgeHtml(element.assigned_to);
  return {
    firebaseKey: element.firebaseKey,
    status: element.status,
    title: element.title,
    description: element.description,
    category: element.category,
    categoryClass: categoryClass,
    priority: element.priority,
    hasSubtasks: stats.hasSubtasks,
    subtaskInfo: stats.text,
    progressWidth: stats.percent,
    badgesHtml: badges,
  };
}

/**
 * Finds a task by ID in a given task list.
 * @param {Array} taskList - The source list of tasks.
 * @param {string} firebaseKey - The ID of the task to find.
 * @returns {Object|undefined} The matched task or undefined.
 */
function findTaskById(taskList, firebaseKey) {
  return taskList.find((task) => task.firebaseKey === firebaseKey);
}

/**
 * Capitalizes the first letter of the task priority.
 * @param {Object} task - The task object.
 * @returns {string} The capitalized priority string.
 */
function formatPriority(task) {
  return task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
}

/**
 * Reformats the date from YYYY-MM-DD to DD/MM/YYYY.
 * @param {Object} task - The task object.
 * @returns {string} The reformatted date string.
 */
function reformatDate(task) {
  return task.due_date.split("-").reverse().join("/");
}

/**
 * Returns fallback content when a task is already in the target status.
 * @param {Object} task - The task to evaluate.
 * @param {string} newStatus - The target status to compare against.
 * @param {string} returnContent - The content to return when statuses match.
 * @returns {string} The fallback content or an empty string.
 */
function checkIsCurrentStatus(task, newStatus, returnContent) {
  return task.status === newStatus ? returnContent : "";
}

/**
 * Appends a counter badge when more contacts exist than are displayed.
 * @param {string} html - The existing badge HTML.
 * @param {Array} contactIds - All assigned contact IDs.
 * @param {number} limit - The number of visible badges.
 * @returns {string} Updated badge HTML with optional overflow count.
 */
function addBadgeCount(html, contactIds, limit) {
  if (contactIds.length > limit) {
    const remaining = contactIds.length - limit;
    html += `<div class="badge-count">+${remaining}</div>`;
  }
  return html;
}

/**
 * Generates the HTML for contact badges assigned to a task.
 * @param {Object} assignedTo - Object containing assigned contact IDs.
 * @returns {string} Combined HTML string for all badges.
 */
function generateBadgeHtml(assignedTo) {
  if (!assignedTo) return "";
  let html = "";
  const contactIds = Object.values(assignedTo);
  const limit = 3;
  const displayIds = contactIds.slice(0, limit);
  for (const firebaseKey of displayIds) {
    const contact = contacts.find((c) => c.firebaseKey === firebaseKey);
    if (contact) {
      const initials = (
        contact.firstName[0] + contact.lastName[0]
      ).toUpperCase();
      html += badgeTemplate(contact.badgeColor, initials);
    }
  }
  html = addBadgeCount(html, contactIds, limit);
  return html;
}

/**
 * Generates detailed contact list HTML for the task detail view.
 * @param {Object} assignedTo - Object containing assigned contact IDs.
 * @returns {string} Combined HTML string for detailed contacts.
 */
function generateDetailedContactsHtml(assignedTo) {
  if (!assignedTo) return "";
  let html = "";
  const contactIds = Object.values(assignedTo);
  for (const firebaseKey of contactIds) {
    const contact = contacts.find((c) => c.firebaseKey === firebaseKey);
    if (contact) {
      const initials = (
        contact.firstName[0] + contact.lastName[0]
      ).toUpperCase();
      html += contactTemplate(contact, initials);
    }
  }
  return html;
}

/**
 * Generates the HTML for subtasks in the task detail view.
 * @param {string} firebaseKey - The ID of the parent task.
 * @param {Object} subtasks - The subtasks object.
 * @returns {string} Combined HTML string for the subtask list.
 */
function generateDetailedSubtasksHtml(firebaseKey, subtasks) {
  const subtaskArray = subtasks ? Object.entries(subtasks) : [];
  if (subtaskArray.length === 0) {
    return noSubtasksTemplate();
  }
  let html = "";
  for (const [subId, sub] of subtaskArray) {
    const checkImg = sub.is_done
      ? "../assets/imgs/checkbox-checked.png"
      : "../assets/imgs/checkbox-empty.png";
    html += subtaskItemTemplate(firebaseKey, subId, checkImg, sub);
  }
  return html;
}
