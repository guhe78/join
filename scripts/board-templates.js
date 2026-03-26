function toDoTaskTemplate(task) {
  return `
        <div class="card" onclick="openTaskDetail('${task.id}')" draggable="true" ondragstart="startdragging('${task.id}')" ondragend="stopDragging('${task.id}')" data-id="${task.id}">
            <span class="task-badge ${task.categoryClass}">${task.category}</span>

            <h3 class="card-title">${task.title}</h3>
            <p class="card-description">${task.description}</p>

            ${task.hasSubtasks
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
          <section class="edit-first-description">
          <div class="edit-container title">
            <label class="detail-label" for="task-title">Title</label>
            <div class="input-wrapper-title">
            <input value="${task.title}" id="task-title" class="edit-input" type="text" required />
            <p class="feedback-message" id="titleFeedback">this field is required</p>
            </div>
          </div>

          <div class="edit-container description">
            <label class="detail-label" for="task-desc">Description</label>
            <div class="textarea-container">
                <textarea
                  id="task-desc"
                  class="textarea edit-textarea"
                  rows="4"
                  placeholder="Enter description..."
                  maxlength="250"
                >${task.description}</textarea>
              <p class="feedback-message" id="descriptionFeedback">this field is required</p>
            </div>
          </div>

          <div class="edit-container date">
            <label class="detail-label" for="due-date">Due date</label>
            <div class="date-input-container">  
            <div class="date-input-wrapper">
                  <input
                  type="date"
                    id="due-date"
                    value="${task.due_date}" 
                    class="input date-input"
                    type="date"
                  
                    onkeydown="return false"
                  />
                </div>
            <p class="feedback-message" id="dueDateFeedback" >this field is required</p>
            </div>
          </div>
          </section>

          <div class="edit-container priority">
            <span class="detail-label priority-label">Priority</span>
            <div class="priority-options"> 
              <button id="urgent-btn" class="high-btn ${getEditPriorityActiveClass(task.priority, 'urgent')}">
                Urgent
                      <svg class="prio-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M7 14l5-5 5 5" />
                      <path d="M7 19l5-5 5 5" />
                      </svg>
              </button>
              <button id="medium-btn" class="medium-btn ${getEditPriorityActiveClass(task.priority, 'medium')}">
                Medium
                <img src="../assets/imgs/prio-medium.png" alt="Medium icon" />
              </button>
              <button id="low-btn" class="low-btn ${getEditPriorityActiveClass(task.priority, 'low')}">
                Low       <svg class="prio-icon" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M7 10l5 5 5-5" />
                          <path d="M7 5l5 5 5-5" />
                          </svg>
              </button>
            </div>
          </div>

          <div class="edit-container date">
            <label class="detail-label" for="assignedSelect">Assigned to</label>
            <div class="custom-select" id="assignedSelect">
                <div class="select-trigger">
                  <span class="trigger-text">Select contacts to assign</span>
                  <img class="trigger-arrow" src="../assets/imgs/arrow_drop_downaa.png" alt="">
                </div>

                <div class="select-dropdown" id="assignedDropdown"></div>
              </div>

              <div class="assigned-badges" id="assignedBadges"></div>
          </div>

          <div class="edit-container date">
            <label class="detail-label" for="subtask">Subtasks</label>
                <div class="subtask-input">
                  <input
                    id="subtask"
                    type="text"
                    placeholder="Add new subtask"
                    class="input"
                  />

                  <div class="subtask-actions">
                    <svg class="subtask-icon" viewBox="0 0 24 24">
                      <path d="M6 6L18 18M6 18L18 6" />
                    </svg>

                    <div class="divider"></div>

                    <svg class="subtask-icon" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div class="subtasks-list" id="subtasksList"></div>
          </div>
          
          </div>

          <div class="detail-footer">
            <button
              onclick="saveEditedTask('${task.id}')"
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

// function editTaskTemplate(task) {
//   return `<div
//           class="task-card-detail edit-dialog"
//           onclick="event.stopPropagation()"
//         >
//           <div class="detail-header edit-header">
//             <button class="close-btn" onclick="closeTaskDialog()">
//               <img src="../assets/imgs/close.png" alt="Close" />
//             </button>
//           </div>
//           <div class="edit-scroll-content">
//           <div class="edit-container title">
//             <label class="detail-label" for="task-title">Title</label>
//             <input value="${task.title}" id="task-title" class="edit-input" type="text" required />
//           </div>

//           <div class="edit-container description">
//             <label class="detail-label" for="task-desc">Description</label>
//             <div class="area-wrapper">
//               <textarea
//                 id="task-desc"
//                 placeholder="Enter description..."
//                 class="edit-textarea"
//                 rows="4"

//               >${task.description}</textarea>
//               <button><img src="../assets/imgs/recurso.svg" alt="recurso icon"></button>
//             </div>
//           </div>

//           <div class="edit-container date">
//             <label class="detail-label" for="due-date">Due date</label>
//             <div class="input-wrapper">
// <div class="date-input-wrapper">
//   <input
//     type="date"
//     id="due-date"
//     value="${task.due_date}"
//     ondblclick="setEditTodayDate()"
//     onkeydown="return false"
//   />
//   <img src="../assets/imgs/event.png" onclick="openDatePicker('due-date')" />
// </div>
//           </div>

//           <div class="field">
//   <label class="label">Priority</label>

//   <div class="prio-row">
//     <button id="urgent-btn" type="button" class="prio-btn prio-urgent ${getEditPriorityActiveClass(task.priority, 'urgent')}">
//       Urgent
//       <svg class="prio-icon" viewBox="0 0 24 24" aria-hidden="true">
//         <path d="M7 14l5-5 5 5" />
//         <path d="M7 19l5-5 5 5" />
//       </svg>
//     </button>

//     <button id="medium-btn" type="button" class="prio-btn prio-medium ${getEditPriorityActiveClass(task.priority, 'medium')}">
//       Medium
//       <svg class="prio-icon" viewBox="0 0 24 24" aria-hidden="true">
//         <path d="M7 10h10" />
//         <path d="M7 14h10" />
//       </svg>
//     </button>

//     <button id="low-btn" type="button" class="prio-btn prio-low ${getEditPriorityActiveClass(task.priority, 'low')}">
//       Low
//       <svg class="prio-icon" viewBox="0 0 24 24" aria-hidden="true">
//         <path d="M7 10l5 5 5-5" />
//         <path d="M7 5l5 5 5-5" />
//       </svg>
//     </button>
//   </div>
// </div>

//           <div class="edit-container date">
//             <label class="detail-label" for="assignedSelect">Assigned to</label>
//             <div class="custom-select" id="assignedSelect">
//                 <div class="select-trigger">
//                   <span class="trigger-text">Select contacts to assign</span>
//                   <img class="trigger-arrow" src="../assets/imgs/arrow_drop_downaa.png" alt="">
//                 </div>

//                 <div class="select-dropdown" id="assignedDropdown"></div>
//               </div>

//               <div class="assigned-badges" id="assignedBadges"></div>
//           </div>

//           <div class="edit-container date">
//             <label class="detail-label" for="subtask">Subtasks</label>
//                 <div class="subtask-input">
//                   <input
//                     id="subtask"
//                     type="text"
//                     placeholder="Add new subtask"
//                     class="input"
//                   />

//                   <div class="subtask-actions">
//                     <svg class="subtask-icon" viewBox="0 0 24 24">
//                       <path d="M6 6L18 18M6 18L18 6" />
//                     </svg>

//                     <div class="divider"></div>

//                     <svg class="subtask-icon" viewBox="0 0 24 24">
//                       <path d="M5 13l4 4L19 7" />
//                     </svg>
//                   </div>
//                 </div>
//                 <div class="subtasks-list" id="subtasksList"></div>
//           </div>
          
//           </div>

//           <div class="detail-footer">
//   <button
//   type="button"
//   onclick="saveEditedTask('${task.id}')"
//   class="primary-btn edit-button"
// >
//               Ok
//               <img
//                 class="check-img"
//                 src="../assets/imgs/check-white.svg
//               "
//               />
//             </button>
//           </div>
//         </div>`;
// }

function getEditPriorityActiveClass(taskPriority, buttonPriority) {
  if (taskPriority === buttonPriority) {
    return "is-active";
  }
  return "";
}