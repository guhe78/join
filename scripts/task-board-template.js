function TaskBoardTemplate(task) {
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
