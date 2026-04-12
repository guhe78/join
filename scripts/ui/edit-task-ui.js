/**
 * Reads the title value from the edit form input.
 * @returns {string} The trimmed title value.
 */
function getEditTitleValue() {
  let input = document.getElementById("task-title");
  if (input === null) {
    return "";
  }
  return input.value.trim();
}

/**
 * Reads the description value from the edit form input.
 * @returns {string} The trimmed description value.
 */
function getEditDescriptionValue() {
  let input = document.getElementById("task-desc");
  if (input === null) {
    return "";
  }
  return input.value.trim();
}

/**
 * Reads and returns the currently selected priority from the button states.
 * @returns {string} The selected priority (urgent, medium, low) or medium as default.
 */
function getEditSelectedPriority() {
  let urgentButton = document.getElementById("urgent-btn");
  let mediumButton = document.getElementById("medium-btn");
  let lowButton = document.getElementById("low-btn");
  if (urgentButton && urgentButton.classList.contains("is-active")) {
    return "urgent";
  }
  if (mediumButton && mediumButton.classList.contains("is-active")) {
    return "medium";
  }
  if (lowButton && lowButton.classList.contains("is-active")) {
    return "low";
  }
  return "medium";
}

/**
 * Validates the edit form title field and updates DOM error state.
 * @returns {boolean} True if title is valid, otherwise false.
 */
function validateEditTitleField() {
  let titleInput = document.getElementById("task-title");
  let titleFeedback = document.getElementById("titleFeedback");
  if (titleInput === null || titleFeedback === null) {
    return false;
  }
  if (titleInput.value.trim() === "") {
    titleInput.classList.add("input-error");
    titleFeedback.classList.add("visibillity-visible");
    return false;
  }
  titleInput.classList.remove("input-error");
  titleFeedback.classList.remove("visibillity-visible");
  return true;
}

/**
 * Validates the entire edit form including title, description, and due date.
 * @returns {boolean} True if all fields are valid, otherwise false.
 */
function validateEditForm() {
  let titleValid = validateEditTitleField();
  let dateValid = validateDueDateField();
  return titleValid && dateValid;
}

/**
 * Creates an updated task object from the current edit form values.
 * @param {Object} task - The original task object being edited.
 * @returns {Object} The updated task object with modified values.
 */
function buildEditedTaskObject(task) {
  return {
    title: getEditTitleValue(),
    description: getEditDescriptionValue(),
    due_date: getDueDateValue(),
    priority: getEditSelectedPriority(),
    assigned_to: getAssignedContacts(),
    subtasks: buildEditedSubtasks(task.subtasks),
  };
}

/**
 * Loads the edit task form template and sets the due date constraint.
 * @param {Object} task - The task object to load for editing.
 */
function loadEditTaskForm(task) {
  const content = document.getElementById("dialogContent");
  if (!content) return;
  content.innerHTML = editTaskTemplate(task);
  setMinDueDate();
}

/**
 * Initializes UI components for the edit form (buttons, selects, subtasks).
 * @param {Object} task - The task object being edited.
 */
async function initializeEditForm(task) {
  await getContacts();
  setEditAssignedContacts(task.assigned_to);
  renderAssignedContacts(buildEditAssignedContactOptionHTML);
  initPriorityButtons();
  initAssignedSelect();
  selectFocus(task);
  subtasks = task.subtasks
    ? Object.values(task.subtasks).map(function (s) {
        return s.title;
      })
    : [];
  editSubtaskIndex = -1;
  initSubtaskSection();
}

/**
 * Opens the edit view for a task within the existing dialog.
 * @param {string} id - The Firebase key of the task to edit.
 * @param {Function} [createHandler=createTaskClicked] - Handler for task operations.
 */
async function editTask(id, createHandler = createTaskClicked) {
  const task = findTaskById(currentTasks, id);
  if (!task) return;
  loadEditTaskForm(task);
  await initializeEditForm(task);
}

/**
 * Updates the task in memory with the edited values.
 * @param {string} taskId - The Firebase key of the task.
 * @param {Object} updatedTask - The updated task data.
 */
function updateEditedTaskInBoard(taskId, updatedTask) {
  let task = findTaskById(currentTasks, taskId);
  if (!task) {
    return;
  }
  task.title = updatedTask.title;
  task.description = updatedTask.description;
  task.due_date = updatedTask.due_date;
  task.priority = updatedTask.priority;
  task.subtasks = updatedTask.subtasks;
}

/**
 * Saves the edited task after validation and refreshes the board.
 * @param {string} taskId - The Firebase key of the task to save.
 */
async function saveEditedTask(taskId) {
  if (validateEditForm() !== true) {
    return;
  }
  let task = findTaskById(currentTasks, taskId);
  if (!task) {
    return;
  }
  let updatedTask = buildEditedTaskObject(task);
  await updateData("tasks", taskId, updatedTask);
  await getTasks();
  currentTasks = tasks;
  closeTaskDialog();
  updateBoard();
}
