function toDoTaskTemplate(task) {
  return `
        <div class="card" onclick="openTaskDetail('${task.id}')" draggable="true" ondragstart="startdragging('${task.id}')" ondragend="stopDragging('${task.id}')" data-id="${task.id}">
            <span class="task-badge ${task.categoryClass}">${task.category}</span>

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
                <div class="badges">${task.badgesHtml}</div>
                <div class="priority-icon ${task.priority}">
                    <img src="../assets/imgs/prio-${task.priority}.png" alt="priority ${task.priority}">
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
              ${generateDetailedSubtasksHtml(task.id, task.subtasks)}
            </div>
          </div>

          </div>

          <div class="detail-footer">
            <button onclick="deleteTask('tasks', '${task.id}'), closeTaskDialog()" class="action-btn">
              <img src="../assets/imgs/delete.png" /> Delete
            </button>
            <div class="footer-divider"></div>
            <button onclick="editTask('${task.id}')" class="action-btn">
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

function subtaskItemTemplate(id, subId, checkImg, sub) {
  return `
            <div class="detail-subtask-item">
        <button class="subtask-checkbox" id="subtask-checkbox-${id}-${subId}" onclick="toggleSubtask('${id}', '${subId}')">
          <img id="subtask-checkbox-icon-${id}-${subId}" src="${checkImg}" alt="Subtask status">
                </button>
                <span>${sub.title}</span>
            </div>`;
}

function noSubtasksTemplate() {
  return `<p class="no-subtasks">No subtasks available</p>`;
}

function editTaskTemplate(task) {
  return `<div
          class="task-card-detail edit-dialog"
          onclick="event.stopPropagation()"
        >
          <div class="detail-header edit-header">
            <button class="close-btn" onclick="closeTaskDialog()">
              <img src="../assets/imgs/close.png" alt="Close" />
            </button>
          </div>
          <div class="edit-scroll-content">
          <div class="edit-container title">
            <label class="detail-label" for="task-title">Title</label>
            <input id="task-title" class="edit-input" type="text" required />
          </div>

          <div class="edit-container description">
            <label class="detail-label" for="task-desc">Description</label>
            <div class="area-wrapper">
              <textarea
                id="task-desc"
                placeholder="Enter description..."
                class="edit-textarea"
                rows="4"
              ></textarea>
              <button><img src="../assets/imgs/recurso.svg" alt="recurso icon"></button>
            </div>
          </div>

          <div class="edit-container date">
            <label class="detail-label" for="due-date">Due date</label>
            <div class="input-wrapper">
              <input
                type="text"
                id="due-date"
                value="10/05/2023"
                placeholder="DD/MM/YYYY"
              />
              <button class="calendar-icon">
                <img src="../assets/imgs/event.png" alt="calender icon" />
              </button>
            </div>
          </div>

          <div class="edit-container priority">
            <span class="detail-label priority-label">Priority</span>
            <div class="priority-options"> 
              <button class="urgent-btn">
                Urgent
                <img src="../assets/imgs/prio-high.png" alt="Urgent icon" />
              </button>
              <button class="medium-btn">
                Medium
                <img src="../assets/imgs/prio-media.png" alt="Medium icon" />
              </button>
              <button class="low-btn">
                Low <img src="../assets/imgs/prio-low.png" alt="Low icon" />
              </button>
            </div>
          </div>

          <div class="edit-container date">
            <span class="detail-label">Assigned to</span>
            <div class="custom-select edit-assigned-select " id="editAssignedSelect">
              <div class="select-trigger" tabindex="0">
                <span class="trigger-text">Select contacts to assign</span>
                <img class="trigger-arrow" src="../assets/imgs/arrow_drop_downaa.png" alt="Toggle contacts" />
              </div>
              <div class="select-dropdown" id="editAssignedDropdown">
              </div>
            </div>
            <div class="assigned-preview" id="editAssignedPreview">
              <div class="assigned-preview-badge" style="background-color: #4589ff" title="Sofia Mueller">SM</div>
              <div class="assigned-preview-badge" style="background-color: #9b51e0" title="Anja Schulz">AS</div>
            </div>
          </div>

          <div class="edit-container date">
            <span class="detail-label">Subtasks</span>
            <input
              type="text"
              class="edit-subtask-input"
              placeholder="Add new subtask"
            />
            <div class="subtasks-container">
              <ul class="edit-subtasks-list">
                <li>Implement Recipe Recommendation</li>
                <li>Start Page Layout</li>
              </ul>
            </div>
          </div>
          </div>

          <div class="detail-footer">
            <button
              onclick="#"
              class="primary-btn edit-button"
            >
              Ok
              <img
                class="check-img"
                src="../assets/imgs/check-white.svg
              "
              />
            </button>
          </div>
        </div>`;
}