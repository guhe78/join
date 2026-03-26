function buildNormalSubtaskHTML(index) {
  return `
    <div class="subtask-item">
        <div class="subtask-left">
            <span class="subtask-dot">•</span>
            <span class="subtask-text">${subtasks[index]}</span>
        </div>
        <div class="subtask-item-actions">
            <img class="subtask-action-icon subtask-edit-btn" src="../assets/imgs/edit-black.svg" alt="edit">
            <div class="subtask-item-divider"></div>
            <img class="subtask-action-icon subtask-delete-btn" src="../assets/imgs/delete-black.svg" alt="delete">
        </div>
    </div>
    `;
}

function buildEditSubtaskHTML(index) {
  return `
    <div class="subtask-item edit-mode">
        <div class="subtask-left">
            <input class="subtask-edit-input" id="editSubtaskInput" type="text" value="${subtasks[index]}">
        </div>
        <div class="subtask-item-actions">
            <img class="subtask-action-icon subtask-delete-edit-btn" src="../assets/imgs/delete-black.svg" alt="delete">
            <div class="subtask-item-divider"></div>
            <img class="subtask-action-icon subtask-save-btn" src="../assets/imgs/check.png" alt="save">
        </div>
    </div>
    `;
}

function buildAssignedContactOptionHTML(index) {
  let initials = getContactInitials(contacts[index]);
  let fullName = contacts[index].firstName + " " + contacts[index].lastName;
  let badgeColor = contacts[index].badgeColor;
  let contactId = contacts[index].id;

  return `
    <div class="select-option" data-id="${contactId}">
        <div class="contact-info">
            <div class="avatar" style="background:${badgeColor}">${initials}</div>
            <span>${fullName}</span>
        </div>
        <input type="checkbox">
    </div>
    `;
}

function getContactInitials(contact) {
  let firstLetter = "";
  let lastLetter = "";
  if (contact.firstName.length > 0) {
    firstLetter = contact.firstName.charAt(0);
  }
  if (contact.lastName.length > 0) {
    lastLetter = contact.lastName.charAt(0);
  }
  return firstLetter + lastLetter;
}

function addTaskTemplate() {
  return `
      <div class="add-task-modal" onclick="event.stopPropagation()">
        <button
          class="add-task-close-btn"
          type="button"
          onclick="closeTaskDialog()"
        >
          ✕
        </button>

        <section class="addtask">
          <h1 class="addtask-title">Add Task</h1>

          <form class="addtask-form">
            <div class="addtask-col">
              <div class="field">
                <label class="label" for="title">
                  Title<span class="req">*</span>
                </label>

                <input
                  id="title"
                  class="input"
                  type="text"
                  placeholder="Enter a title"
                  maxlength="20"
                />
                <p class="error-msg" id="titleError">This field is required</p>
              </div>

              <div class="field">
                <label class="label" for="desc">Description</label>
                <textarea
                  id="desc"
                  class="textarea"
                  rows="5"
                  placeholder="Create a contact form and imprint page !"
                  maxlength="250"
                ></textarea>
              </div>

              <div class="field">
                <label class="label" for="due">
                  Due date<span class="req">*</span>
                </label>

                <div class="date-input-wrapper">
                  <input
                    id="due"
                    class="input date-input"
                    type="date"
                    ondblclick="setTodayDate()"
                    onkeydown="return false"
                  />
                  <img src="../assets/imgs/event.png" onclick="openDatePicker('due')" />
                </div>

                <p class="error-msg" id="dueError">This field is required</p>
              </div>
            </div>

            <div class="addtask-divider"></div>

            <div class="addtask-col">
              <label class="label">Priority</label>

              <div class="prio-row">
                <button type="button" class="prio-btn prio-urgent">
                  Urgent
                  <svg class="prio-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 14l5-5 5 5" />
                    <path d="M7 19l5-5 5 5" />
                  </svg>
                </button>

                <button type="button" class="prio-btn prio-medium is-active">
                  Medium
                  <svg class="prio-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 10h10" />
                    <path d="M7 14h10" />
                  </svg>
                </button>

                <button type="button" class="prio-btn prio-low">
                  Low
                  <svg class="prio-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 10l5 5 5-5" />
                    <path d="M7 5l5 5 5-5" />
                  </svg>
                </button>
              </div>

              <div class="field">
                <label class="label" for="assignedSelect">Assigned to</label>

                <div class="custom-select" id="assignedSelect">
                  <div class="select-trigger">
                    <span class="trigger-text">Select contacts to assign</span>
                    <img
                      class="trigger-arrow"
                      src="../assets/imgs/arrow_drop_downaa.png"
                      alt=""
                    />
                  </div>

                  <div class="select-dropdown" id="assignedDropdown"></div>
                </div>

                <div class="assigned-badges" id="assignedBadges"></div>
              </div>

              <div class="field">
                <label class="label" for="catSelect">
                  Category<span class="req">*</span>
                </label>

                <div class="custom-select custom-select--single" id="catSelect">
                  <div class="select-trigger">
                    <span class="trigger-text">Select task category</span>
                    <img
                      class="trigger-arrow"
                      src="../assets/imgs/arrow_drop_downaa.png"
                      alt=""
                    />
                  </div>

                  <div class="select-dropdown">
                    <div class="select-option" data-value="technical">
                      Technical Task
                    </div>
                    <div class="select-option" data-value="userstory">
                      User Story
                    </div>
                  </div>
                </div>

                <input type="hidden" name="category" id="catHidden" value="" />
                <p class="error-msg" id="categoryError">
                  This field is required
                </p>
              </div>

              <div class="field">
                <label class="label" for="subtask">Subtasks</label>

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
              </div>

              <div class="subtasks-list" id="subtasksList"></div>
            </div>

            <div class="addtask-foot">
              <p class="required-hint">
                <span class="req">*</span> This field is required
              </p>

              <div class="addtask-actions">
                <button type="button" class="secondary-btn">
                  Clear
                  <svg
                    class="icon icon-cancel"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M12.0011 11.9998L17.2441 17.2428M6.75806 17.2428L12.0011 11.9998L6.75806 17.2428ZM17.2441 6.75684L12.0001 11.9998L17.2441 6.75684ZM12.0001 11.9998L6.75806 6.75684L12.0001 11.9998Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>

                <button type="button" class="primary-btn">
                  Create Task
                  <img src="../assets/imgs/check.svg" alt="create" />
                </button>
              </div>
            </div>
          </form>
        </section>

        <div id="taskAddedToast" class="task-toast">
          <span>Task added to board</span>
          <img src="../assets/imgs/board.png" alt="board" />
        </div>
      </div>
    `;
}