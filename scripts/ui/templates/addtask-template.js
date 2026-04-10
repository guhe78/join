/**
 * Builds the HTML for a normal subtask item.
 * @param {number} index The index of the subtask in the subtasks array.
 * @returns {string} The HTML string for a normal subtask item.
 */
function buildNormalSubtaskHTML(index) {
  return `
    <div class="subtask-item">
        <div class="subtask-left">
            <span class="subtask-dot">•</span>
            <span class="subtask-text">${subtasks[index]}</span>
        </div>
        <div class="subtask-item-actions">
      <button type="button" class="subtask-btn subtask-edit-btn">
            <img class="subtask-action-icon" src="../assets/imgs/edit-black.svg" alt="edit">
            </button>
            <div class="subtask-item-divider"></div>
      <button type="button" class="subtask-btn subtask-delete-btn">
            <img class="subtask-action-icon" src="../assets/imgs/delete-black.svg" alt="delete">
            </button>
        </div>
    </div>
    `;
}

/**
 * Builds the HTML for a subtask item in edit mode.
 * @param {number} index The index of the subtask in the subtasks array.
 * @returns {string} The HTML string for a subtask item in edit mode.
 */
function buildEditSubtaskHTML(index) {
  return `
    <div class="subtask-item edit-mode">
        <div class="subtask-left">
            <input class="subtask-edit-input" id="editSubtaskInput" type="text" value="${subtasks[index]}" maxlength="60">
        </div>
        <div class="subtask-item-actions">
      <button type="button" class="subtask-btn subtask-delete-edit-btn">
            <img class="subtask-action-icon" src="../assets/imgs/delete-black.svg" alt="delete">
            </button>
            <div class="subtask-item-divider"></div>
      <button type="button" class="subtask-btn subtask-save-btn">
            <img class="subtask-action-icon" src="../assets/imgs/check.png" alt="save">
            </button>
        </div>
    </div>
    `;
}

/**
 * Builds the HTML template for the add task modal.
 * @returns {string} The complete HTML string for the add task modal.
 */
function addTaskTemplate() {
  return `
      <div class="add-task-modal" onclick="closeAllSelects(); event.stopPropagation()">
        <button
          class="add-task-close-btn"
          type="button"
          onclick="closeAddTaskModalDirect()"
        >
          <img src="../assets/imgs/close.png" alt="Close" />
        </button>

        <section class="addtask template-container">
        <h1 class="addtask-title">Add Task</h1>
        <form class="addtask-form">
          <div class="addtask-col">
            <div class="field">
              <label class="label" for="title">
                Title<span class="req">*</span>
              </label>

              <input
                id="title"
                class="input addtask-input"
                type="text"
                placeholder="Enter a title"
                maxlength="40"
                onkeyup="validateTitleField()"
              />
              <p class="error-msg" id="titleError">This field is required</p>
            </div>

            <div class="field">
              <label class="label" for="desc">Description</label>
              <textarea
                id="desc"
                class="textarea"
                rows="5"
                placeholder=" Enter a Description"
                maxlength="250"
              ></textarea>
            </div>

            <div class="field">
              <label class="label" for="due-date">
                Due date<span class="req">*</span>
              </label>
              <div class="addtask-due-date-container">
                <div class="addtask-due-input-wrapper">
                  <input
                    type="text"
                    id="due-date"
                    class="input addtask-due-input addtask-input"
                    placeholder="dd/mm/yyyy"
                    maxlength="10"
                    oninput="syncPickerFromInput()"
                    onkeyup="validateDueDateField()"
                  />
                  <input
                    type="date"
                    id="due-date-picker"
                    class="addtask-due-picker"
                    onchange="syncDateFromPicker()"
                    tabindex="-1"
                  />
                  <button
                    type="button"
                    class="addtask-due-picker-btn"
                    onclick="openEditDatePicker()"
                  >
                    <img
                      src="../assets/imgs/event.png"
                      alt="date picker icon"
                    />
                  </button>
                </div>
                <p class="addtask-due-feedback" id="dueDateFeedback">
                  this field is required
                </p>
              </div>
            </div>
          </div>

          <div class="addtask-divider"></div>

          <div class="addtask-col">
            <div class="prio-row">
              <label class="label" for="assignedSelect">Priority</label>
              <div class="prio-buttons">
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

              <p class="error-msg" id="categoryError">This field is required</p>
            </div>

            <div class="field">
              <label class="label" for="subtask">Subtasks</label>

              <div class="subtask-input">
                <input
                  id="subtask"
                  type="text"
                  placeholder="Add new subtask"
                  class="input"
                  text
                  maxlength="60"
                />

                <div class="subtask-actions">
                  <button type="button" class="subtask-btn">
                    <img
                      src="../assets/imgs/close-subtask.svg"
                      alt="Close Subtask"
                    />
                  </button>

                  <div class="divider"></div>
                  <button type="button" class="subtask-btn">
                    <img
                      src="../assets/imgs/check-subtask.svg"
                      alt="Check Subtask"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div class="subtasks-list" id="subtasksList"></div>
          </div>
        </form>

        <div class="addtask-foot template-foot">
          <p class="required-hint">
            <span class="req">*</span> This field is required
          </p>

          <div class="addtask-actions template-actions">
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
      </section>

        <div id="taskAddedToast" class="task-toast">
          <span>Task added to board</span>
          <img src="../assets/imgs/board.png" alt="board" />
        </div>
      </div>
    `;
}
