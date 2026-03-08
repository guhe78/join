function toDoTaskTemplate(task) {
    return `
        <div class="card" draggable="true" ondragstart="startdragging('${task.id}')" data-id="${task.id}">
            <span class="badge ${task.categoryClass}">${task.category}</span>

            <h3 class="card-title">${task.title}</h3>
            <p class="card-description">${task.description}</p>

            ${task.hasSubtasks ? `
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${task.progressWidth}%"></div>
                    </div>
                    <span class="subtask-count">${task.subtaskInfo}</span>
                </div>
            ` : ''}

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