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
