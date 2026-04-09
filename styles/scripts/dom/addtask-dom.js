/**
 * Initializes all priority buttons and assigns the click handler.
 */
function initPriorityButtons() {
  let buttons = document.getElementsByClassName("prio-btn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].onclick = priorityButtonClicked;
  }
}

/**
 * Initializes the category select dropdown and binds all related click events.
 */
function initCategorySelect() {
  let catSelect = document.getElementById("catSelect");
  if (catSelect === null) {
    return;
  }

  let trigger = catSelect.getElementsByClassName("select-trigger")[0];
  let dropdown = catSelect.getElementsByClassName("select-dropdown")[0];
  let options = dropdown.getElementsByClassName("select-option");
  trigger.onclick = toggleCategoryDropdown;
  for (let i = 0; i < options.length; i++) {
    options[i].onclick = categoryOptionClicked;
  }
}

/**
 * Opens or closes the category dropdown.
 * @param {Event} event The click event triggered on the category select.
 */
function toggleCategoryDropdown(event) {
  let catSelect = document.getElementById("catSelect");
  if (catSelect.classList.contains("open") === true) {
    catSelect.classList.remove("open");
  } else {
    closeAllSelects();
    catSelect.classList.add("open");
  }
  event.stopPropagation();
}

/**
 * Handles the selection of a category option and updates the trigger text and hidden input.
 * @param {Event} event The click event triggered on a category option.
 */
function categoryOptionClicked(event) {
  let option = event.currentTarget;
  let catSelect = document.getElementById("catSelect");
  let dropdown = catSelect.getElementsByClassName("select-dropdown")[0];
  let text = catSelect.getElementsByClassName("trigger-text")[0];
  let hidden = document.getElementById("catHidden");
  let options = dropdown.getElementsByClassName("select-option");
  for (let i = 0; i < options.length; i++) {
    options[i].classList.remove("active");
  }
  option.classList.add("active");
  text.textContent = option.textContent.trim();
  hidden.value = option.getAttribute("data-value");
  catSelect.classList.remove("open");
  event.stopPropagation();
}

/**
 * Closes all open custom select dropdowns.
 */
function closeAllSelects() {
  let selects = document.getElementsByClassName("custom-select");
  for (let i = 0; i < selects.length; i++) {
    selects[i].classList.remove("open");
  }
}

/**
 * Initializes the clear and create task action buttons.
 * @param {Function} [createHandler=createTaskClicked] Function called when the create button is clicked.
 */
function initActionButtons(createHandler = createTaskClicked) {
  let actionArea = document.getElementsByClassName("addtask-actions")[0];
  if (actionArea === undefined) {
    return;
  }
  let buttons = actionArea.getElementsByTagName("button");
  if (buttons.length >= 2) {
    buttons[0].onclick = clearAddTaskForm;
    buttons[1].onclick = createHandler;
  }
}

/**
 * Clears the title input field.
 */
function clearTitleField() {
  let titleInput = document.getElementById("title");
  if (titleInput !== null) {
    titleInput.value = "";
  }
}

/**
 * Clears the description textarea field.
 */
function clearDescriptionField() {
  let descInput = document.getElementById("desc");
  if (descInput !== null) {
    descInput.value = "";
  }
}

/**
 * Clears the due date input and hidden date picker values.
 */
function clearDueDateField() {
  let dueInput = document.getElementById("due-date");
  let duePicker = document.getElementById("due-date-picker");
  if (dueInput !== null) {
    dueInput.value = "";
    dueInput.classList.remove("input-error");
  }
  if (duePicker !== null) {
    duePicker.value = "";
  }
}

/**
 * Resets all priority buttons and activates the medium priority by default.
 */
function clearPriorityButtons() {
  let buttons = document.getElementsByClassName("prio-btn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("is-active");
  }
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].classList.contains("prio-medium") === true) {
      buttons[i].classList.add("is-active");
    }
  }
}

/**
 * Clears the selected category and resets the category dropdown to its default state.
 */
function clearCategorySelect() {
  let catSelect = document.getElementById("catSelect");
  let hidden = document.getElementById("catHidden");
  if (catSelect === null || hidden === null) {
    return;
  }
  let text = catSelect.getElementsByClassName("trigger-text")[0];
  let dropdown = catSelect.getElementsByClassName("select-dropdown")[0];
  let options = dropdown.getElementsByClassName("select-option");
  for (let i = 0; i < options.length; i++) {
    options[i].classList.remove("active");
  }
  text.textContent = "Select task category";
  hidden.value = "";
  catSelect.classList.remove("open");
}

/**
 * Removes all validation error styles and hides all validation messages.
 */
function clearValidationState() {
  let titleInput = document.getElementById("title");
  let dueInput = document.getElementById("due-date");
  let catSelect = document.getElementById("catSelect");
  let titleError = document.getElementById("titleError");
  let dueError = document.getElementById("dueDateFeedback");
  let categoryError = document.getElementById("categoryError");
  if (titleInput !== null) {
    titleInput.classList.remove("input-error");
  }
  if (dueInput !== null) {
    dueInput.classList.remove("input-error");
  }
  if (catSelect !== null) {
    catSelect.classList.remove("input-error");
  }
  if (titleError !== null) {
    titleError.style.display = "none";
  }
  if (dueError !== null) {
    dueError.style.display = "none";
  }
  if (categoryError !== null) {
    categoryError.style.display = "none";
  }
}

/**
 * Initializes the subtask input section and binds the action buttons for clearing and saving subtasks.
 */
function initSubtaskSection() {
  let subtaskInput = document.getElementById("subtask");
  if (subtaskInput === null) {
    return;
  }
  subtaskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveSubtaskFromInput();
    }
  });
  let subtaskActions = document.getElementsByClassName("subtask-actions")[0];
  if (subtaskActions === undefined) {
    return;
  }
  let actionIcons = subtaskActions.getElementsByClassName("subtask-icon");
  if (actionIcons.length >= 2) {
    actionIcons[0].onclick = clearSubtaskInput;
    actionIcons[1].onclick = saveSubtaskFromInput;
  } else {
    let actionBtns = subtaskActions.getElementsByClassName("subtask-btn");
    if (actionBtns.length >= 2) {
      actionBtns[0].onclick = clearSubtaskInput;
      actionBtns[1].onclick = saveSubtaskFromInput;
    }
  }
  renderSubtasks();
}

/**
 * Clears the subtask input field and resets the current edit mode.
 */
function clearSubtaskInput() {
  let subtaskInput = document.getElementById("subtask");
  if (subtaskInput !== null) {
    subtaskInput.value = "";
  }
  editSubtaskIndex = -1;
}

/**
 * Clears all subtasks, resets edit mode, clears the subtask input field and re renders the subtask list.
 */
function clearSubtasks() {
  subtasks = [];
  editSubtaskIndex = -1;
  let input = document.getElementById("subtask");
  if (input) input.value = "";
  renderSubtasks();
}

/**
 * Renders the complete subtask list into the DOM and binds all subtask action buttons.
 */
function renderSubtasks() {
  let subtasksList = document.getElementById("subtasksList");
  if (subtasksList === null) {
    return;
  }
  let subtasksHTML = buildSubtasksHTML();
  subtasksList.innerHTML = subtasksHTML;
  bindSubtaskButtons();
}

/**
 * Builds the HTML string for the current subtask list.
 * @returns {string} The generated HTML string for all subtasks.
 */
function buildSubtasksHTML() {
  let html = "";
  for (let i = 0; i < subtasks.length; i++) {
    if (editSubtaskIndex === i) {
      html = html + buildEditSubtaskHTML(i);
    } else {
      html = html + buildNormalSubtaskHTML(i);
    }
  }
  return html;
}

/**
 * Binds all edit, delete, save and double click events for rendered subtasks.
 */
function bindSubtaskButtons() {
  bindEditButtons();
  bindDeleteButtons();
  bindEditDeleteButtons();
  bindSaveButtons();
  bindSubtaskItemDblClick();
}

/**
 * Binds the double click event to all non edit mode subtask items.
 */
function bindSubtaskItemDblClick() {
  let items = document.getElementsByClassName("subtask-item");
  for (let i = 0; i < items.length; i++) {
    if (items[i].classList.contains("edit-mode") === false) {
      items[i].ondblclick = subtaskItemDblClicked;
    }
  }
}

/**
 * Activates edit mode for the double clicked subtask item.
 * @param {Event} event The double click event triggered on a subtask item.
 */
function subtaskItemDblClicked(event) {
  let items = document.getElementsByClassName("subtask-item");
  for (let i = 0; i < items.length; i++) {
    if (items[i] === event.currentTarget) {
      editSubtaskIndex = i;
    }
  }
  renderSubtasks();
}

/**
 * Binds click events to all subtask edit buttons.
 */
function bindEditButtons() {
  let editButtons = document.getElementsByClassName("subtask-edit-btn");
  for (let i = 0; i < editButtons.length; i++) {
    editButtons[i].onclick = editSubtaskClicked;
  }
}

/**
 * Binds click events to all subtask delete buttons.
 */
function bindDeleteButtons() {
  let deleteButtons = document.getElementsByClassName("subtask-delete-btn");
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].onclick = deleteSubtaskClicked;
  }
}

/**
 * Binds click events to all delete buttons shown in subtask edit mode.
 */
function bindEditDeleteButtons() {
  let deleteButtons = document.getElementsByClassName(
    "subtask-delete-edit-btn",
  );
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].onclick = deleteSubtaskInEditModeClicked;
  }
}

/**
 * Binds click events to all subtask save buttons.
 */
function bindSaveButtons() {
  let saveButtons = document.getElementsByClassName("subtask-save-btn");
  for (let i = 0; i < saveButtons.length; i++) {
    saveButtons[i].onclick = saveEditedSubtask;
  }
}

/**
 * Activates edit mode for the clicked subtask edit button.
 * @param {Event} event The click event triggered on a subtask edit button.
 */
function editSubtaskClicked(event) {
  let editButtons = document.getElementsByClassName("subtask-edit-btn");
  for (let i = 0; i < editButtons.length; i++) {
    if (editButtons[i] === event.currentTarget) {
      editSubtaskIndex = i;
    }
  }
  renderSubtasks();
}

/**
 * Deletes the subtask that belongs to the clicked delete button and re renders the list.
 * @param {Event} event The click event triggered on a subtask delete button.
 */
function deleteSubtaskClicked(event) {
  let deleteButtons = document.getElementsByClassName("subtask-delete-btn");
  for (let i = 0; i < deleteButtons.length; i++) {
    if (deleteButtons[i] === event.currentTarget) {
      subtasks.splice(i, 1);
    }
  }
  renderSubtasks();
}

/**
 * Saves the edited subtask text and exits edit mode.
 */
function saveEditedSubtask() {
  let editInput = document.getElementById("editSubtaskInput");
  if (editInput === null) {
    return;
  }
  let newText = editInput.value.trim();
  if (newText === "") {
    return;
  }
  if (editSubtaskIndex >= 0) {
    subtasks[editSubtaskIndex] = newText;
  }
  editSubtaskIndex = -1;
  renderSubtasks();
}

/**
 * Shows the success toast after creating a task and redirects to the board page.
 */
function showTaskAddedToast() {
  let toast = document.getElementById("taskAddedToast");
  if (toast === null) {
    return;
  }
  toast.classList.add("show");
  setTimeout(redirectToBoard, 1000);
}

/**
 * Renders all available contacts into the assigned contacts dropdown.
 * @param {Function} [optionBuilder=buildAssignedContactOptionHTML] Function used to build the HTML for a single contact option.
 */
function renderAssignedContacts(
  optionBuilder = buildAssignedContactOptionHTML,
) {
  let dropdown = document.getElementById("assignedDropdown");
  if (dropdown === null) {
    return;
  }
  let html = "";
  for (let i = 0; i < contacts.length; i++) {
    html = html + optionBuilder(i);
  }
  dropdown.innerHTML = html;
}
