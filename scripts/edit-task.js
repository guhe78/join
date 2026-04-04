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
      titleFeedback.classList.add("visibillity-visible");
      isValid = false;
    } else {
      titleInput.classList.remove("input-error");
      titleFeedback.classList.remove("visibillity-visible");
    }
  }
  if (descInput !== null && descriptionFeedback !== null) {
    if (descInput.value.trim() === "") {
      descInput.classList.add("input-error");
      descriptionFeedback.classList.add("visibillity-visible");
      isValid = false;
    } else {
      descInput.classList.remove("input-error");
      descriptionFeedback.classList.remove("visibillity-visible");
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

function getEditPriorityActiveClass(taskPriority, buttonPriority) {
  if (taskPriority === buttonPriority) {
    return "is-active";
  }
  return "";
}
