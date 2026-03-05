function toDoTaskTemplate(task) {
  return `
        <div class="card" onclick="openTaskDetail('${task.id}')" draggable="true" ondragstart="startdragging('${task.id}')" data-id="${task.id}">
            <span class="badge ${task.categoryClass}">${task.category}</span>

            <h3 class="card-title">${task.title}</h3>
            <p class="card-description">${task.description}</p>

            ${
              task.hasSubtasks
                ? `
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${task.progressWidth}%"></div>
                    </div>
                    <span class="subtask-count">${task.subtaskInfo}</span>
                </div>
            `
                : ""
            }

            <div class="card-footer">
                <div class="avatars">${task.avatarsHtml}</div>
                <div class="priority-icon ${task.priority}">
                    <img src="../assets/imgs/prio-${task.priority}.png" alt="priority ${task.priority}">
                </div>
            </div>
        </div>`;
}

function avatarTemplate(color, initials) {
  return `
    <div class="avatar" style="background-color: ${color}">
      ${initials}
    </div>`;
}

function nothingToDoTemplate() {
  return `<div class="empty-state">No tasks To do</div>`;
}

function dialogTemplate(task, categoryClass) {
  return `<div class="task-card-detail" onclick="event.stopPropagation()">
          <div class="detail-header">
            <div class="category-badge ${categoryClass}">${task.category}</div>
            <button class="close-btn" onclick="closeTaskDialog()">
              <img src="../assets/imgs/close.png" alt="Close" />
            </button>
          </div>

          <h1 class="detail-title">${task.title}</h1>
          <p class="detail-description">${task.description}</p>

          <div class="detail-info-row">
            <span class="detail-label">Due date:</span>
            <span>${reformatDate(task)}</span>
          </div>

          <div class="detail-info-row">
            <span class="detail-label">Priority:</span>
            <div class="priority-badge-detail">
              ${formatPriority(task)}
              <img src="../assets/imgs/prio-${task.priority}.png" alt="" />
            </div>
          </div>

          <div class="detail-assigned-section">
            <span class="detail-label">Assigned To:</span>
            <div class="detail-contacts-list">
              ${generateDetailedContactsHtml(task.assigned_to)}
            </div>
          </div>

          <div class="detail-subtasks-section">
            <span class="detail-label">Subtasks</span>
            <div class="detail-subtasks-list">
              ${generateDetailedSubtasksHtml(task.taskId, task.subtasks)}
            </div>
          </div>

          <div class="detail-footer">
            <button onclick="deleteTask('${task.taskId}')" class="action-btn">
              <img src="../assets/imgs/delete.png" /> Delete
            </button>
            <div class="footer-divider"></div>
            <button onclick="editTask('${task.taskId}')" class="action-btn">
              <img src="../assets/imgs/edit.png" /> Edit
            </button>
          </div>
        </div>`;
}

function contactTemplate(contact, initials) {
  return `<div class="detail-contact-item">
                    <div class="avatar-circle" style="background-color: ${contact.color}">${initials}</div>
                    <span class="contact-name">${contact.firstName} ${contact.lastName}</span>
                </div>`;
}

function subtaskItemTemplate(taskId, subId, checkImg, sub) {
  return `
            <div class="detail-subtask-item">
                <button class="subtask-checkbox" onclick="toggleSubtask('${taskId}', '${subId}')">
                    <img src="${checkImg}">
                </button>
                <span>${sub.title}</span>
            </div>`;
}

function noSubtasksTemplate() {
  return `<p class="no-subtasks">No subtasks available</p>`;
}
