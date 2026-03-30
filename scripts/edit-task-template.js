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
        onkeydown="return false"
      />
      <img src="../assets/imgs/event.png" onclick="openDatePicker('due-date')" />
    </div>
    <p class="feedback-message" id="dueDateFeedback">this field is required</p>
  </div>
</div>
          </section>
<div class="edit-container priority">
  <span class="detail-label priority-label">Priority</span>
  <div class="priority-options">
    <button
      type="button"
      id="urgent-btn"
      class="prio-btn high-btn ${getEditPriorityActiveClass(task.priority, "urgent")}"
    >
      Urgent
      <svg class="prio-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 14l5-5 5 5" />
        <path d="M7 19l5-5 5 5" />
      </svg>
    </button>

    <button
      type="button"
      id="medium-btn"
      class="prio-btn medium-btn ${getEditPriorityActiveClass(task.priority, "medium")}"
    >
      Medium
      <img src="../assets/imgs/prio-medium.png" alt="Medium icon" />
    </button>

    <button
      type="button"
      id="low-btn"
      class="prio-btn low-btn ${getEditPriorityActiveClass(task.priority, "low")}"
    >
      Low
      <svg class="prio-icon" viewBox="0 0 24 24" aria-hidden="true">
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
              onclick="saveEditedTask('${task.firebaseKey}')"
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

function getEditPriorityActiveClass(taskPriority, buttonPriority) {
  if (taskPriority === buttonPriority) {
    return "is-active";
  }
  return "";
}
