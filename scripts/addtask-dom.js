function initPriorityButtons() {
  let buttons = document.getElementsByClassName("prio-btn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].onclick = priorityButtonClicked;
  }
}

function initAssignedSelect() {
  let assignedSelect = document.getElementById("assignedSelect");
  if (assignedSelect === null) {
    return;
  }
  let trigger = assignedSelect.getElementsByClassName("select-trigger")[0];
  let dropdown = assignedSelect.getElementsByClassName("select-dropdown")[0];
  let options = dropdown.getElementsByClassName("select-option");

  trigger.onclick = toggleAssignedDropdown;
  for (let i = 0; i < options.length; i++) {
    options[i].onclick = assignedOptionClicked;
  }
  updateAssignedText();
  updateAssignedBadges();
}

function toggleAssignedDropdown(event) {
  let assignedSelect = document.getElementById("assignedSelect");
  if (assignedSelect.classList.contains("open") === true) {
    assignedSelect.classList.remove("open");
  } else {
    closeAllSelects();
    assignedSelect.classList.add("open");
  }
  event.stopPropagation();
}

function assignedOptionClicked(event) {
  let option = event.currentTarget;
  let checkbox = option.getElementsByTagName("input")[0];
  if (event.target !== checkbox) {
    if (checkbox.checked === true) {
      checkbox.checked = false;
    } else {
      checkbox.checked = true;
    }
  }
  if (checkbox.checked === true) {
    option.classList.add("active");
  } else {
    option.classList.remove("active");
  }
  event.stopPropagation();
  updateAssignedText();
  updateAssignedBadges();
}

function updateAssignedText() {
  let assignedSelect = document.getElementById("assignedSelect");
  if (assignedSelect === null) {
    return;
  }
  let dropdown = assignedSelect.getElementsByClassName("select-dropdown")[0];
  let text = assignedSelect.getElementsByClassName("trigger-text")[0];
  let options = dropdown.getElementsByClassName("select-option");
  let checkedCount = 0;
  for (let i = 0; i < options.length; i++) {
    let checkbox = options[i].getElementsByTagName("input")[0];
    if (checkbox.checked === true) {
      checkedCount = checkedCount + 1;
    }
  }
  if (checkedCount === 0) {
    text.textContent = "Select contacts to assign";
  } else {
    text.textContent = checkedCount + " selected";
  }
}

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

function closeAllSelects() {
  let selects = document.getElementsByClassName("custom-select");
  for (let i = 0; i < selects.length; i++) {
    selects[i].classList.remove("open");
  }
}

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

function clearTitleField() {
  let titleInput = document.getElementById("title");
  if (titleInput !== null) {
    titleInput.value = "";
  }
}

function clearDescriptionField() {
  let descInput = document.getElementById("desc");
  if (descInput !== null) {
    descInput.value = "";
  }
}

function clearDueDateField() {
  let dueInput = document.getElementById("due");
  if (dueInput === null) {
    return;
  }
  dueInput.value = getTodayDateValue();
}

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

function clearValidationState() {
  let titleInput = document.getElementById("title");
  let dueInput = document.getElementById("due");
  let catSelect = document.getElementById("catSelect");
  let titleError = document.getElementById("titleError");
  let dueError = document.getElementById("dueError");
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

function updateAssignedBadges() {
  let contactsData = getSelectedAssignedContacts();
  let html = buildAssignedBadgesHTML(contactsData);
  renderAssignedBadges(html);
}

function getSelectedAssignedContacts() {
  let assignedSelect = document.getElementById("assignedSelect");

  if (assignedSelect === null) {
    return [];
  }

  let dropdown = assignedSelect.getElementsByClassName("select-dropdown")[0];
  let options = dropdown.getElementsByClassName("select-option");
  let selectedContacts = [];

  for (let i = 0; i < options.length; i++) {
    let checkbox = options[i].getElementsByTagName("input")[0];

    if (checkbox.checked === true) {
      let contactInfo = options[i].getElementsByClassName("contact-info")[0];
      let avatar = contactInfo.getElementsByClassName("avatar")[0];

      selectedContacts.push({
        letters: avatar.textContent,
        backgroundColor: avatar.style.background,
      });
    }
  }

  return selectedContacts;
}

function buildAssignedBadgesHTML(contactsData) {
  let html = "";

  for (let i = 0; i < contactsData.length; i++) {
    html = html + buildSingleAssignedBadgeHTML(contactsData[i]);
  }

  return html;
}

function buildSingleAssignedBadgeHTML(contact) {
  return `
    <div class="assigned-badge" style="background:${contact.backgroundColor}">
        ${contact.letters}
    </div>
    `;
}

function renderAssignedBadges(html) {
  let badgesContainer = document.getElementById("assignedBadges");

  if (badgesContainer === null) {
    return;
  }

  badgesContainer.innerHTML = html;
}

function initSubtaskSection() {
  let subtaskInput = document.getElementById("subtask");
  if (subtaskInput === null) {
    return;
  }
  let subtaskActions = document.getElementsByClassName("subtask-actions")[0];
  if (subtaskActions === undefined) {
    return;
  }

  let actionIcons = subtaskActions.getElementsByClassName("subtask-icon");
  if (actionIcons.length >= 2) {
    actionIcons[0].onclick = clearSubtaskInput;
    actionIcons[1].onclick = saveSubtaskFromInput;
  }
  renderSubtasks();
}

function clearSubtaskInput() {
  let subtaskInput = document.getElementById("subtask");
  if (subtaskInput !== null) {
    subtaskInput.value = "";
  }
  editSubtaskIndex = -1;
}

function clearSubtasks() {
  subtasks = [];
  editSubtaskIndex = -1;
  let input = document.getElementById("subtask");
  if (input) input.value = "";
  renderSubtasks();
}

function renderSubtasks() {
  let subtasksList = document.getElementById("subtasksList");
  if (subtasksList === null) {
    return;
  }
  let subtasksHTML = buildSubtasksHTML();
  subtasksList.innerHTML = subtasksHTML;
  bindSubtaskButtons();
}

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

function bindSubtaskButtons() {
  bindEditButtons();
  bindDeleteButtons();
  bindEditDeleteButtons();
  bindSaveButtons();
}

function bindEditButtons() {
  let editButtons = document.getElementsByClassName("subtask-edit-btn");
  for (let i = 0; i < editButtons.length; i++) {
    editButtons[i].onclick = editSubtaskClicked;
  }
}

function bindDeleteButtons() {
  let deleteButtons = document.getElementsByClassName("subtask-delete-btn");
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].onclick = deleteSubtaskClicked;
  }
}

function bindEditDeleteButtons() {
  let deleteButtons = document.getElementsByClassName(
    "subtask-delete-edit-btn",
  );
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].onclick = deleteSubtaskInEditModeClicked;
  }
}

function bindSaveButtons() {
  let saveButtons = document.getElementsByClassName("subtask-save-btn");
  for (let i = 0; i < saveButtons.length; i++) {
    saveButtons[i].onclick = saveEditedSubtask;
  }
}

function editSubtaskClicked(event) {
  let editButtons = document.getElementsByClassName("subtask-edit-btn");
  for (let i = 0; i < editButtons.length; i++) {
    if (editButtons[i] === event.currentTarget) {
      editSubtaskIndex = i;
    }
  }
  renderSubtasks();
}

function deleteSubtaskClicked(event) {
  let deleteButtons = document.getElementsByClassName("subtask-delete-btn");
  for (let i = 0; i < deleteButtons.length; i++) {
    if (deleteButtons[i] === event.currentTarget) {
      subtasks.splice(i, 1);
    }
  }
  renderSubtasks();
}

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

function showTaskAddedToast() {
  let toast = document.getElementById("taskAddedToast");
  if (toast === null) {
    return;
  }
  toast.classList.add("show");
  setTimeout(redirectToBoard, 1000);
}

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
