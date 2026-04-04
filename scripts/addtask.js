let subtasks = [];
let editSubtaskIndex = -1;

/**
 * Handles priority button clicks and sets the active state.
 * @param {Event} event The click event triggered on a priority button.
 */
function priorityButtonClicked(event) {
  let buttons = document.getElementsByClassName("prio-btn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("is-active");
  }
  let clickedButton = event.currentTarget;
  clickedButton.classList.add("is-active");
  event.stopPropagation();
}

/**
 * Clears the entire add task form and resets all fields and states.
 */
function clearAddTaskForm() {
  clearTitleField();
  clearDescriptionField();
  clearDueDateField();
  clearPriorityButtons();
  clearAssignedSelect();
  clearCategorySelect();
  clearSubtasks();
  clearValidationState();
}

/**
 * Clears all selected assigned contacts and resets the dropdown state.
 */
function clearAssignedSelect() {
  let assignedSelect = document.getElementById("assignedSelect");
  if (assignedSelect === null) {
    return;
  }
  let dropdown = assignedSelect.getElementsByClassName("select-dropdown")[0];
  let options = dropdown.getElementsByClassName("select-option");
  for (let i = 0; i < options.length; i++) {
    options[i].classList.remove("active");

    let checkbox = options[i].getElementsByTagName("input")[0];
    checkbox.checked = false;
  }

  updateAssignedText();
  updateAssignedBadges();
  assignedSelect.classList.remove("open");
}

/**
 * Validates the entire add task form.
 * @returns {boolean} True if all required fields are valid otherwise false.
 */
function validateAddTaskForm() {
  let titleIsValid = validateTitleField();
  let dueDateIsValid = validateDueDateField();
  let categoryIsValid = validateCategoryField();
  return titleIsValid && dueDateIsValid && categoryIsValid;
}

/**
 * Validates the title input field.
 * @returns {boolean} True if valid otherwise false.
 */
function validateTitleField() {
  let titleInput = document.getElementById("title");
  let titleError = document.getElementById("titleError");
  if (titleInput === null || titleError === null) {
    return false;
  }
  if (titleInput.value.trim() === "") {
    titleInput.classList.add("input-error");
    titleError.style.display = "block";
    return false;
  }
  titleInput.classList.remove("input-error");
  titleError.style.display = "none";
  return true;
}

/**
 * Validates the due date input field.
 * @returns {boolean} True if valid otherwise false.
 */
function validateDueDateField() {
  let dueInput = document.getElementById("due");
  let dueError = document.getElementById("dueError");
  if (dueInput === null || dueError === null) {
    return false;
  }
  if (dueInput.value.trim() === "") {
    dueInput.classList.add("input-error");
    dueError.style.display = "block";
    return false;
  }
  dueInput.classList.remove("input-error");
  dueError.style.display = "none";
  return true;
}

/**
 * Validates the category selection.
 * @returns {boolean} True if valid otherwise false.
 */
function validateCategoryField() {
  let catSelect = document.getElementById("catSelect");
  let catHidden = document.getElementById("catHidden");
  let categoryError = document.getElementById("categoryError");
  if (catSelect === null || catHidden === null || categoryError === null) {
    return false;
  }
  if (catHidden.value.trim() === "") {
    catSelect.classList.add("input-error");
    categoryError.style.display = "block";
    return false;
  }
  catSelect.classList.remove("input-error");
  categoryError.style.display = "none";
  return true;
}

/**
 * Saves a new subtask from the input field and updates the list.
 */
function saveSubtaskFromInput() {
  let subtaskInput = document.getElementById("subtask");
  if (subtaskInput === null) {
    return;
  }
  let subtaskText = subtaskInput.value.trim();
  if (subtaskText === "") {
    return;
  }
  subtasks.push(subtaskText);
  subtaskInput.value = "";
  editSubtaskIndex = -1;
  renderSubtasks();
}

/**
 * Deletes the currently edited subtask.
 */
function deleteSubtaskInEditModeClicked() {
  if (editSubtaskIndex >= 0) {
    subtasks.splice(editSubtaskIndex, 1);
  }
  editSubtaskIndex = -1;
  renderSubtasks();
}

/**
 * Redirects the user to the board page.
 */
function redirectToBoard() {
  window.location.href = "board.html";
}

/**
 * Creates a task object based on the current form inputs.
 * @param {string} [status="todo"] The status of the task.
 * @returns {Object} The created task object.
 */
function createTaskObject(status = "todo") {
  let titleInput = document.getElementById("title");
  let descInput = document.getElementById("desc");
  let catHidden = document.getElementById("catHidden");
  let categoryValue = catHidden.value;
  let categoryLabel = getCategoryLabel(categoryValue);

  return {
    assigned_to: getAssignedContacts(),
    author_id: "user_1",
    category: categoryLabel,
    created_at: new Date().toISOString(),
    description: descInput.value,
    due_date: getDueDateValue(),
    priority: getSelectedPriority(),
    status: status,
    subtasks: getSubtasksForFirebase(),
    title: titleInput.value,
  };
}

/**
 * Converts the category value into a readable label.
 * @param {string} categoryValue The raw category value.
 * @returns {string} The formatted category label.
 */
function getCategoryLabel(categoryValue) {
  if (categoryValue === "technical") return "Technical Task";
  if (categoryValue === "userstory") return "User Story";
  return categoryValue;
}

/**
 * Returns the currently selected priority.
 * @returns {string|undefined} The selected priority (urgent, medium, low).
 */
function getSelectedPriority() {
  let buttons = document.getElementsByClassName("prio-btn");
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].classList.contains("is-active")) {
      if (buttons[i].classList.contains("prio-urgent")) return "urgent";
      if (buttons[i].classList.contains("prio-medium")) return "medium";
      if (buttons[i].classList.contains("prio-low")) return "low";
    }
  }
}

/**
 * Converts the subtasks array into Firebase compatible objects.
 * @returns {Array<Object>} Array of subtask objects.
 */
function getSubtasksForFirebase() {
  let subtasksForFirebase = [];
  for (let i = 0; i < subtasks.length; i++) {
    subtasksForFirebase.push({
      title: subtasks[i],
      done: false,
    });
  }
  return subtasksForFirebase;
}

/**
 * Handles the create task button click validates the form and saves the task.
 */
async function createTaskClicked() {
  let isValid = validateAddTaskForm();
  if (isValid === true) {
    try {
      let task = createTaskObject();
      await postData("tasks", task);
      showTaskAddedToast();
    } catch (error) {
      console.error("Task could not be saved:", error);
    }
  }
}

/**
 * Initializes the add task page with all required data and event bindings.
 * @param {Function} [createHandler=createTaskClicked] Handler for creating tasks.
 */
async function initAddTask(createHandler = createTaskClicked) {
  checkAuth();
  document.getElementById("profile-button").innerHTML = getUserData().initials;

  await getContacts();
  renderAssignedContacts();
  initPriorityButtons();
  initAssignedSelect();
  initCategorySelect();
  initSubtaskSection();
  initActionButtons(createHandler);
  setMinDueDate();
  document.onclick = closeAllSelects;
}

/**
 * Generates initials from a contact object.
 * @param {Object} contact The contact object.
 * @param {string} contact.firstName The contacts first name.
 * @param {string} contact.lastName The contacts last name.
 * @returns {string} The initials of the contact.
 */
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