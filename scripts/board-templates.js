function toDoTaskTemplate(element) {
  return `<div class="card" draggable="true" ondragstart="startdragging(${element.id})" data-id="${element.id}">
                <span class="badge user-story">User Story</span>

                <h3 class="card-title">Kochwelt Page & Recipe Recommender</h3>
                <p class="card-description">
                  Build start page with recipe recommendation...
                </p>

                <div class="progress-container">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: 50%"></div>
                  </div>
                  <span class="subtask-count">1/2 Subtasks</span>
                </div>

                <div class="card-footer">
                  <div class="avatars">
                    <div class="avatar orange">AM</div>
                    <div class="avatar teal">EM</div>
                    <div class="avatar purple">MB</div>
                  </div>
                  <div class="priority-icon low"><img src="../assets/imgs/prio-media.png" alt="priority low icon"></div>
                </div>
              </div>`;
}

function nothingToDoTemplate() {
  return `<div class="empty-state">No tasks To do</div>`;
}