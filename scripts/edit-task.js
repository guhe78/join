/**
 * Opens the edit view for a task within the existing dialog. --->von renato geändert
 */
async function editTask(id, createHandler = createTaskClicked) {
  const task = findTaskById(currentTasks, id);
  if (!task) return;
  const content = document.getElementById("dialogContent");
  if (!content) return;
  content.innerHTML = editTaskTemplate(task);
  setMinDueDate();
  setEditAssignedContacts(task.assigned_to);
  selectFocus(task);
  await getContacts();
  renderAssignedContacts(buildEditAssignedContactOptionHTML);
  initPriorityButtons();
  initAssignedSelect();
  subtasks = task.subtasks
    ? Object.values(task.subtasks).map(function (s) {
        return s.title;
      })
    : [];
  editSubtaskIndex = -1;
  initSubtaskSection();
}

function setEditAssignedContacts(assignedContacts) {
  let assignedSelect = document.getElementById("assignedSelect");
  if (assignedSelect === null) {
    return;
  }
  assignedSelect.dataset.selectedContacts =
    getAssignedContactIds(assignedContacts).join(",");
}

function getAssignedContactIds(assignedContacts) {
  if (!assignedContacts) {
    return [];
  }
  return Object.values(assignedContacts);
}

function isAssignedContactSelected(contactId) {
  let selectedContacts = getAssignedSelectionValues();
  return selectedContacts.includes(contactId);
}

function getAssignedSelectionValues() {
  let assignedSelect = document.getElementById("assignedSelect");
  if (assignedSelect === null || !assignedSelect.dataset.selectedContacts) {
    return [];
  }
  return assignedSelect.dataset.selectedContacts.split(",").filter(Boolean);
}

function getAssignedOptionClass(isSelected) {
  if (isSelected) {
    return " active";
  }
  return "";
}

function getAssignedCheckboxState(isSelected) {
  if (isSelected) {
    return " checked";
  }
  return "";
}

async function saveEditedTask(taskId) {
  let task;
  let updatedTask;
  if (validateEditForm() !== true) {
    return;
  }
  task = findTaskById(currentTasks, taskId);
  if (!task) {
    return;
  }
  updatedTask = buildEditedTaskObject(task);
  await updateData("tasks", taskId, updatedTask);
  await getTasks();
  currentTasks = tasks;
  closeTaskDialog();
  updateBoard();
}

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

function getEditTitleValue() {
  let input = document.getElementById("task-title");
  if (input === null) {
    return "";
  }
  return input.value.trim();
}

function getEditDescriptionValue() {
  let input = document.getElementById("task-desc");
  if (input === null) {
    return "";
  }
  return input.value.trim();
}

function validateEditForm() {
  let isValid = true;
  let titleInput = document.getElementById("task-title");
  let descInput = document.getElementById("task-desc");
  let titleFeedback = document.getElementById("titleFeedback");
  let descriptionFeedback = document.getElementById("descriptionFeedback");
  if (titleInput !== null && titleFeedback !== null) {
    if (titleInput.value.trim() === "") {
      titleInput.classList.add("input-error");
      titleFeedback.style.visibility = "visible";
      isValid = false;
    } else {
      titleInput.classList.remove("input-error");
      titleFeedback.style.visibility = "hidden";
    }
  }
  if (descInput !== null && descriptionFeedback !== null) {
    if (descInput.value.trim() === "") {
      descInput.classList.add("input-error");
      descriptionFeedback.style.visibility = "visible";
      isValid = false;
    } else {
      descInput.classList.remove("input-error");
      descriptionFeedback.style.visibility = "hidden";
    }
  }
  if (!validateDueDateField()) {
    isValid = false;
  }
  return isValid;
}

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

function buildEditedSubtasks(oldSubtasks) {
  let updatedSubtasks = {};
  let keys = [];
  let oldKey;
  let subtaskKey;
  let doneValue;
  if (oldSubtasks) {
    keys = Object.keys(oldSubtasks);
  }
  for (let i = 0; i < subtasks.length; i++) {
    oldKey = keys[i];
    subtaskKey = oldKey !== undefined ? oldKey : "subtask_" + i;
    doneValue = false;
    if (oldKey !== undefined && oldSubtasks[oldKey]) {
      doneValue = oldSubtasks[oldKey].is_done;
    }
    updatedSubtasks[subtaskKey] = {
      title: subtasks[i],
      is_done: doneValue,
    };
  }
  return updatedSubtasks;
}

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
