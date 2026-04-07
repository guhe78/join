/**
 * Creates an assignee badge element.
 * @param {string} color - The badge background color.
 * @param {string} initials - The initials displayed inside the badge.
 * @returns {string} Badge HTML markup.
 */
function badgeTemplate(color, initials) {
  return `
    <div class="badge" style="background-color: ${color}">
      ${initials}
    </div>`;
}

/**
 * Creates the empty-state markup used for board columns without tasks.
 * @returns {string} Empty-state HTML markup.
 */
function nothingToDoTemplate() {
  return `<div class="empty-state">No tasks To do</div>`;
}

/**
 * Creates one contact row for the task detail dialog.
 * @param {Object} contact - The contact object.
 * @param {string} contact.badgeColor - Badge background color.
 * @param {string} contact.firstName - Contact first name.
 * @param {string} contact.lastName - Contact last name.
 * @param {string} initials - The initials displayed in the contact badge.
 * @returns {string} Contact row HTML markup.
 */
function contactTemplate(contact, initials) {
  return `<div class="detail-contact-item">
                    <div class="badge-circle" style="background-color: ${contact.badgeColor}">${initials}</div>
                    <span class="contact-name">${contact.firstName} ${contact.lastName}</span>
                </div>`;
}

/**
 * Creates one subtask row for the task detail dialog.
 * @param {string} firebaseKey - The parent task ID.
 * @param {string} subId - The subtask ID.
 * @param {string} checkImg - Path to the current checkbox icon.
 * @param {Object} sub - The subtask object.
 * @param {string} sub.title - Subtask title.
 * @returns {string} Subtask row HTML markup.
 */
function subtaskItemTemplate(firebaseKey, subId, checkImg, sub) {
  return `
            <div class="detail-subtask-item">
        <button class="subtask-checkbox" id="subtask-checkbox-${firebaseKey}-${subId}" onclick="toggleSubtask('${firebaseKey}', '${subId}')">
          <img id="subtask-checkbox-icon-${firebaseKey}-${subId}" src="${checkImg}" alt="Subtask status">
                </button>
                <span>${sub.title}</span>
            </div>`;
}

/**
 * Creates fallback markup when a task has no subtasks.
 * @returns {string} No-subtasks HTML markup.
 */
function noSubtasksTemplate() {
  return `<p class="no-subtasks">No subtasks available</p>`;
}
