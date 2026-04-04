/**
 * Generates the HTML markup for the task edit dialog.
 * @param {Object} task - The task being edited.
 * @param {string} task.firebaseKey - Unique task ID.
 * @param {string} task.title - Task title.
 * @param {string} task.description - Task description.
 * @param {string} task.due_date - Task due date in YYYY-MM-DD format.
 * @param {string} task.priority - Task priority key.
 * @returns {string} The edit dialog HTML string.
 */
function editTaskTemplate(task) {
  return `<div
          class="task-card-detail edit-dialog"
          onclick="closeAllSelects(); event.stopPropagation()"
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
                  class="edit-textarea"
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
    <div class="input-wrapper">
      <input
        type="text"
        id="due-date"
        value="${formatDateForDisplay(task.due_date)}"
        class="input edit-input"
        placeholder="dd/mm/yyyy"
        oninput="syncPickerFromInput()"
      />
      <input
        type="date"
        id="due-date-picker"
        class="edit-date-picker"
        value="${task.due_date}"
        onchange="syncDateFromPicker()"
        tabindex="-1"
      />
      <button type="button" class="date-picker-btn" onclick="openEditDatePicker()">
        <img src="../assets/imgs/event.png" alt="date picker icon" />
      </button>
    </div>
    <p class="feedback-message" id="dueDateFeedback">this field is required</p>
  </div>
</div>
          </section>
<div class="edit-container priority">
  <span class="detail-label">Priority</span>
  <div class="priority-options">
    <button
      type="button"
      id="urgent-btn"
      class="prio-btn high-btn ${getEditPriorityActiveClass(task.priority, "urgent")}"
    >
      <span>Urgent</span>
      ${getPriorityIcon("urgent")}
    </button>

    <button
      type="button"
      id="medium-btn"
      class="prio-btn medium-btn ${getEditPriorityActiveClass(task.priority, "medium")}"
    >
      <span>Medium</span>
      ${getPriorityIcon("medium")}
    </button>

    <button
      type="button"
      id="low-btn"
      class="prio-btn low-btn ${getEditPriorityActiveClass(task.priority, "low")}"
    >
      <span>Low</span>
      ${getPriorityIcon("low")}
    </button>
  </div>
</div>
          <div class="edit-container date">
            <label class="detail-label" for="assignedSelect">Assigned to</label>
            <div class="custom-select" id="assignedSelect">
                <div class="select-trigger edit-select-trigger">
                  <span class="trigger-text">Select contacts to assign</span>
                  <img class="trigger-arrow" src="../assets/imgs/arrow_drop_downaa.png" alt="Open assigned contacts dropdown">
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
                    <button type="button" class="subtask-btn">
                    ${cancelIcon()}
                    </button>

                    <div class="divider"></div>
                    <button type="button" class="subtask-btn">
                    ${checkIcon()}
                    </button>
                  </div>
                </div>
                <div class="subtasks-list" id="subtasksList"></div>
          </div>
          
          </div>

          <div class="detail-footer">
            <button
              onclick="saveEditedTask('${task.firebaseKey}')"
              class="primary-btn edit-button"
            >
              Ok
              ${editCheckIcon()}
            </button>
          </div>
        </div>`;
}
