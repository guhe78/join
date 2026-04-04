function badgeTemplate(color, initials) {
  return `
    <div class="badge" style="background-color: ${color}">
      ${initials}
    </div>`;
}

function nothingToDoTemplate() {
  return `<div class="empty-state">No tasks To do</div>`;
}

function contactTemplate(contact, initials) {
  return `<div class="detail-contact-item">
                    <div class="badge-circle" style="background-color: ${contact.badgeColor}">${initials}</div>
                    <span class="contact-name">${contact.firstName} ${contact.lastName}</span>
                </div>`;
}

function subtaskItemTemplate(firebaseKey, subId, checkImg, sub) {
  return `
            <div class="detail-subtask-item">
        <button class="subtask-checkbox" id="subtask-checkbox-${firebaseKey}-${subId}" onclick="toggleSubtask('${firebaseKey}', '${subId}')">
          <img id="subtask-checkbox-icon-${firebaseKey}-${subId}" src="${checkImg}" alt="Subtask status">
                </button>
                <span>${sub.title}</span>
            </div>`;
}

function noSubtasksTemplate() {
  return `<p class="no-subtasks">No subtasks available</p>`;
}
