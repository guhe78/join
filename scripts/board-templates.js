function toDoTaskTemplate(task) {
  return `
        <div class="card" onclick="openTaskDetail('${task.firebaseKey}')" draggable="true" ondragstart="startdragging('${task.firebaseKey}')" ondragend="stopDragging('${task.firebaseKey}')" data-id="${task.firebaseKey}">
            <div class="card-header"><span class="task-badge ${task.categoryClass}">${task.category}</span>
              <div class="task-move-wrapper" onclick="event.stopPropagation()">
                <button class="drag-and-drop-mobile-button" onclick="toggleTaskMoveMenu(event, '${task.firebaseKey}')" aria-label="Move task">
                  <img class="drag-and-drop-icon" src="../assets/imgs/arrow-mobile-drag-drop.png" alt="Move task" />
                </button>
                <div class="task-move-menu" role="menu" aria-label="Move task to section">
                  <button class="task-move-option ${checkIsCurrentStatus(task, "todo", "is-current")}" onclick="moveTaskFromMenu(event, '${task.firebaseKey}', 'todo')" ${checkIsCurrentStatus(task, "todo", "disabled")}>To do</button>
                  <button class="task-move-option ${checkIsCurrentStatus(task, "inProgress", "is-current")}" onclick="moveTaskFromMenu(event, '${task.firebaseKey}', 'inProgress')" ${checkIsCurrentStatus(task, "inProgress", "disabled")}>In progress</button>
                  <button class="task-move-option ${checkIsCurrentStatus(task, "review", "is-current")}" onclick="moveTaskFromMenu(event, '${task.firebaseKey}', 'review')" ${checkIsCurrentStatus(task, "review", "disabled")}>Await feedback</button>
                  <button class="task-move-option ${checkIsCurrentStatus(task, "done", "is-current")}" onclick="moveTaskFromMenu(event, '${task.firebaseKey}', 'done')" ${checkIsCurrentStatus(task, "done", "disabled")}>Done</button>
                </div>
              </div></div>
            <h3 class="card-title">${task.title}</h3>
            <p class="card-description">${task.description}</p>
            ${
              task.hasSubtasks
                ? `
                <div class="progress-container" title="${task.subtaskInfo}">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${task.progressWidth}%"></div>
                    </div>
                    <span class="subtask-count">${task.subtaskInfo}</span>
                </div>
            `
                : ""
            }
            <div class="card-footer">
                <div class="badges">${task.badgesHtml}</div>
                <div class="priority-icon ${task.priority}">
                        ${getPriorityIcon(task.priority)}
                    </div>
            </div>
        </div>`;
}

function badgeTemplate(color, initials) {
  return `
    <div class="badge" style="background-color: ${color}">
      ${initials}
    </div>`;
}

function nothingToDoTemplate() {
  return `<div class="empty-state">No tasks To do</div>`;
}

function dialogTemplate(task, categoryClass) {
  return `<div class="task-card-detail detail-dialog" onclick="event.stopPropagation()">
          <div class="detail-header">
            <div class="category-badge ${categoryClass}">${task.category}</div>
            <button class="close-btn" onclick="closeTaskDialog()">
              <img src="../assets/imgs/close.png" alt="Close" />
            </button>
          </div>
          <div class="detail-scroll-content">
          <h1 class="detail-title">${task.title}</h1>
          <p class="detail-description">${task.description}</p>
          <div class="detail-info-due-date">
            <span class="detail-label">Due date:</span>
            <span>${reformatDate(task)}</span>
          </div>
          <div class="detail-info-priority">
            <span class="detail-label">Priority:</span>
            <div class="priority-badge-detail">
              ${formatPriority(task)}
              <img src="../assets/imgs/prio-${task.priority}.svg" alt="Priority icon" />
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
              ${generateDetailedSubtasksHtml(task.firebaseKey, task.subtasks)}
            </div>
          </div>
          </div>
          <div class="detail-footer">
            <button onclick="deleteTask('tasks', '${task.firebaseKey}'), closeTaskDialog()" class="action-btn">
              <img src="../assets/imgs/delete.png" /> Delete
            </button>
            <div class="footer-divider"></div>
            <button onclick="editTask('${task.firebaseKey}')" class="action-btn">
              <img src="../assets/imgs/edit.png" /> Edit
            </button>
          </div>
        </div>`;
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

function getPriorityImage(priority) {
  if (priority === "urgent") {
    return "high";
  }
  return priority;
}