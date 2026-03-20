/** @type {string|null} Stores the ID of the element currently being dragged */
let currentDraggedElement = null;

let currentTasks = [];
let tippTimer;
const TaskDialogCloseDuration = 200;

/**
 * Initializes the application by loading contacts and tasks.
 * Updates the board with the loaded data afterwards.
 */
async function init() {
  await getContacts();
  await getTasks();
  currentTasks = tasks;
  updateBoard();
}

/**
 * Iterates through all status types and updates the corresponding board columns.
 */
function updateBoard() {
  const statusTypes = ["todo", "inProgress", "review", "done"];
  for (let i = 0; i < statusTypes.length; i++) {
    const status = statusTypes[i];
    const container = document.getElementById(status);
    if (container) {
      processColumn(status, container);
    }
  }
}

/**
 * Filters tasks for a status and renders the matching column.
 * @param {string} status - The status category to filter for.
 * @param {HTMLElement} container - The DOM element representing the column.
 */
function processColumn(status, container) {
  const filtered = filterTasksByStatus(currentTasks, status);
  container.innerHTML = "";
  fillContainer(filtered, container);
}

/**
 * Returns all tasks that belong to a specific status.
 * @param {Array} taskList - The source list of tasks.
 * @param {string} status - The status to match.
 * @returns {Array} A filtered task array.
 */
function filterTasksByStatus(taskList, status) {
  const filtered = [];
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].status === status) {
      filtered.push(taskList[i]);
    }
  }
  return filtered;
}

/**
 * Fills the container with task templates or an "empty" template if no tasks exist.
 * @param {Array} subset - The array of tasks for this column.
 * @param {HTMLElement} container - The DOM element to fill.
 */
function fillContainer(subset, container) {
  if (subset.length === 0) {
    container.innerHTML = nothingToDoTemplate();
    return;
  }
  for (let i = 0; i < subset.length; i++) {
    const taskData = prepareTaskData(subset[i]);
    container.innerHTML += toDoTaskTemplate(taskData);
  }
}

/**
 * Prepares and formats task data for use in the HTML template.
 * @param {Object} element - The raw task object.
 * @returns {Object} The formatted task data object.
 */
function prepareTaskData(element) {
  const stats = getSubtaskStats(element.subtasks);
  const categoryClass = element.category.toLowerCase().replace(/\s+/g, "-");
  const badges = generateBadgeHtml(element.assigned_to);
  return {
    id: element.id,
    title: element.title,
    description: element.description,
    category: element.category,
    categoryClass: categoryClass,
    priority: element.priority,
    hasSubtasks: stats.hasSubtasks,
    subtaskInfo: stats.text,
    progressWidth: stats.percent,
    badgesHtml: badges,
  };
}

/**
 * Calculates progress and statistics for subtasks.
 * @param {Object} subtasks - The subtasks object from the task.
 * @returns {Object} Statistics including total count, completion percentage, and display text.
 */
function getSubtaskStats(subtasks) {
  const subtaskArray = subtasks ? Object.values(subtasks) : [];
  const total = subtaskArray.length;
  let doneCount = 0;
  for (let i = 0; i < total; i++) {
    if (subtaskArray[i].is_done) {
      doneCount++;
    }
  }
  return {
    total: total,
    hasSubtasks: total > 0,
    percent: total > 0 ? (doneCount / total) * 100 : 0,
    text: `${doneCount}/${total} Subtasks`,
  };
}

/**
 * Sets the current dragged element ID.
 * @param {string} id - The ID of the task being dragged.
 */
function startdragging(id) {
  currentDraggedElement = id;
  const card = document.querySelector(`.card[data-id="${id}"]`);
  if (card) {
    card.classList.add("is-dragging");
  }
}

/**
 * Removes drag styling from the currently dragged task card.
 */
function stopDragging(id) {
  const draggedCard = document.querySelector(`.card[data-id="${id}"]`);
  if (draggedCard) {
    draggedCard.classList.remove("is-dragging");
  }
}

/**
 * Prevents default behavior to allow a drop event.
 * @param {Event} ev - The dragover event.
 */
function dragover(ev) {
  ev.preventDefault();
}

/**
 * Shows or removes the drag placeholder in a board column.
 * @param {string} id - The ID of the target column element.
 * @param {boolean} show - Whether the placeholder should be visible.
 */
function highlight(id, show) {
  const container = document.getElementById(id);
  if (!container) return;
  if (show) {
    addDragPlaceholder(container);
    return;
  }
  removeDragPlaceholder(container);
}

/**
 * Adds a drag placeholder to the column and removes the empty-state element.
 * @param {HTMLElement} container - The target board column.
 */
function addDragPlaceholder(container) {
  const existingPlaceholder = container.querySelector(".drag-placeholder");
  if (existingPlaceholder) return;
  const emptyState = container.querySelector(".empty-state");
  if (emptyState) {
    emptyState.remove();
  }
  const placeholder = document.createElement("div");
  placeholder.classList.add("drag-placeholder");
  container.appendChild(placeholder);
}

/**
 * Removes the drag placeholder and restores the empty-state template if needed.
 * @param {HTMLElement} container - The target board column.
 */
function removeDragPlaceholder(container) {
  const existingPlaceholder = container.querySelector(".drag-placeholder");
  if (!existingPlaceholder) return;
  existingPlaceholder.remove();
  if (container.children.length === 0) {
    container.innerHTML = nothingToDoTemplate();
  }
}

/**
 * Updates the status of the dragged task and refreshes the board.
 * @param {string} newStatus - The new status to assign to the task.
 */
async function moveTo(newStatus) {
  const index = currentTasks.findIndex((t) => t.id === currentDraggedElement);
  if (index !== -1) {
    const movedTask = currentTasks.splice(index, 1)[0];
    movedTask.status = newStatus;
    currentTasks.push(movedTask);
    await updateData("tasks", movedTask.id, { status: newStatus });
    updateBoard();
  }
}

/**
 * Generates the HTML for contact badges assigned to a task.
 * @param {Object} assignedTo - Object containing assigned contact IDs.
 * @returns {string} Combined HTML string for all badges.
 */
function generateBadgeHtml(assignedTo) {
  if (!assignedTo) return "";
  let html = "";
  const contactIds = Object.values(assignedTo);
  const limit = 3;
  const displayIds = contactIds.slice(0, limit);
  for (const id of displayIds) {
    const contact = contacts.find((c) => c.id === id);
    if (contact) {
      const initials = (
        contact.firstName[0] + contact.lastName[0]
      ).toUpperCase();
      html += badgeTemplate(contact.badgeColor, initials);
    }
  }
  html = addBadgeCount(html, contactIds, limit);
  return html;
}

/**
 * Appends a counter badge when more contacts exist than are displayed.
 * @param {string} html - The existing badge HTML.
 * @param {Array} contactIds - All assigned contact IDs.
 * @param {number} limit - The number of visible badges.
 * @returns {string} Updated badge HTML with optional overflow count.
 */
function addBadgeCount(html, contactIds, limit) {
  if (contactIds.length > limit) {
    const remaining = contactIds.length - limit;
    html += `<div class="badge-count">+${remaining}</div>`;
  }
  return html;
}

/**
 * Finds a task by ID in a given task list.
 * @param {Array} taskList - The source list of tasks.
 * @param {string} id - The ID of the task to find.
 * @returns {Object|undefined} The matched task or undefined.
 */
function findTaskById(taskList, id) {
  return taskList.find((task) => task.id === id);
}

/**
 * Renders task detail HTML into the dialog content container.
 * @param {HTMLElement} content - The detail dialog content element.
 * @param {Object} task - The task to render.
 */
function renderTaskDetailContent(content, task) {
  const categoryClass = task.category.toLowerCase().replace(/\s+/g, "-");
  content.innerHTML = dialogTemplate(task, categoryClass);
}

/**
 * Generates detailed contact list HTML for the task detail view.
 * @param {Object} assignedTo - Object containing assigned contact IDs.
 * @returns {string} Combined HTML string for detailed contacts.
 */
function generateDetailedContactsHtml(assignedTo) {
  if (!assignedTo) return "";
  let html = "";
  const contactIds = Object.values(assignedTo);
  for (const id of contactIds) {
    const contact = contacts.find((c) => c.id === id);
    if (contact) {
      const initials = (
        contact.firstName[0] + contact.lastName[0]
      ).toUpperCase();
      html += contactTemplate(contact, initials);
    }
  }
  return html;
}

/**
 * Generates the HTML for subtasks in the task detail view.
 * @param {string} id - The ID of the parent task.
 * @param {Object} subtasks - The subtasks object.
 * @returns {string} Combined HTML string for the subtask list.
 */
function generateDetailedSubtasksHtml(id, subtasks) {
  const subtaskArray = subtasks ? Object.entries(subtasks) : [];
  if (subtaskArray.length === 0) {
    return noSubtasksTemplate();
  }
  let html = "";
  for (const [subId, sub] of subtaskArray) {
    const checkImg = sub.is_done
      ? "../assets/imgs/checkbox-checked.png"
      : "../assets/imgs/checkbox-empty.png";
    html += subtaskItemTemplate(id, subId, checkImg, sub);
  }
  return html;
}

/**
 * Capitalizes the first letter of the task priority.
 * @param {Object} task - The task object.
 * @returns {string} The capitalized priority string.
 */
function formatPriority(task) {
  return task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
}

/**
 * Reformats the date from YYYY-MM-DD to DD/MM/YYYY.
 * @param {Object} task - The task object.
 * @returns {string} The reformatted date string.
 */
function reformatDate(task) {
  return task.due_date.split("-").reverse().join("/");
}

/**
 * Deletes a task from the currentTasks array by its ID and updates the board.
 * @param {string} path - The collection path in Firebase.
 * @param {string} id - The ID of the task to be deleted.
 */
async function deleteTask(path, id) {
  const index = currentTasks.findIndex((t) => t.id === id);
  if (index !== -1) {
    await deleteData(path, id);
    currentTasks.splice(index, 1);
    closeTaskDialog();
    updateBoard();
  }
}

/**
 * Toggles the completion status of a subtask and updates the UI.
 * @param {string} id - The ID of the parent task.
 * @param {string} subId - The ID of the subtask to toggle.
 */
async function toggleSubtask(id, subId) {
  const task = currentTasks.find((t) => t.id === id);
  if (task && task.subtasks && task.subtasks[subId]) {
    task.subtasks[subId].is_done = !task.subtasks[subId].is_done;
    updateSubtaskCheckboxIcon(id, subId, task.subtasks[subId].is_done);
    await updateData("tasks", task.id, { subtasks: task.subtasks });
    updateBoard();
  }
}

/**
 * Updates only the subtask checkbox icon in the open detail dialog.
 * @param {string} id - The ID of the parent task.
 * @param {string} subId - The ID of the subtask.
 * @param {boolean} isDone - The completion status of the subtask.
 */
function updateSubtaskCheckboxIcon(id, subId, isDone) {
  const icon = document.getElementById(`subtask-checkbox-icon-${id}-${subId}`);
  if (!icon) return;
  icon.src = isDone
    ? "../assets/imgs/checkbox-checked.png"
    : "../assets/imgs/checkbox-empty.png";
}

/**
 * Helper function to re-render the detail view content without closing the dialog.
 * @param {string} id - The ID of the task.
 */
function refreshTaskDetail(id) {
  const task = findTaskById(currentTasks, id);
  if (task) {
    const content = document.getElementById("dialogContent");
    if (!content) return;
    renderTaskDetailContent(content, task);
  }
}

/**
 * Opens the edit view for a task within the existing dialog.
 */
async function editTask(id, createHandler = createTaskClicked) {
  const task = findTaskById(currentTasks, id);
  if (!task) return;
  const content = document.getElementById("dialogContent");
  if (!content) return;
  content.innerHTML = editTaskTemplate(task);
  await initEditTaskForm(task, createHandler);
}

/**
 * Reads edited values, patches task in Firebase, syncs arrays, rerenders board and closes dialog.
 * @param {string} id - The ID of the task being edited.
 */
async function saveEditedTask(id) {
  const task = findTaskById(currentTasks, id);
  if (!task) return;

  const payload = buildEditedTaskPayload(task);
  if (!payload) return;
  try {
    await updateData("tasks", id, payload);
    applyEditedTaskToLocalArrays(id, payload);
    updateBoard();
    closeTaskDialog();
  } catch (error) {
    console.error("Task could not be updated:", error);
  }
}

/**
 * Builds a Firebase patch payload from the current edit form values.
 * @param {Object} task - The task currently being edited.
 * @returns {Object|null} The patch payload or null when required fields are missing.
 */
function buildEditedTaskPayload(task) {
  const titleInput = document.getElementById("task-title");
  const descriptionInput = document.getElementById("desc");
  const dueDateInput = document.getElementById("due");
  if (!titleInput || !descriptionInput || !dueDateInput) {
    return null;
  }
  return {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    due_date: dueDateInput.value,
    priority: getSelectedEditPriority(),
    assigned_to: getSelectedAssignedContactIds(),
    subtasks: buildEditedSubtasksPayload(task),
  };
}

function buildEditedSubtasksPayload(task) {
  const previousSubtasks = task?.subtasks ? Object.values(task.subtasks) : [];
  const result = {};
  subtasks.forEach((subtaskTitle, index) => {
    const existingSubtask = previousSubtasks.find(s => s.title === subtaskTitle);
    const subtaskId = existingSubtask?.id || `s${Date.now()}_${index}`;
    result[subtaskId] = {
      title: subtaskTitle,
      is_done: existingSubtask ? existingSubtask.is_done : false
    };
  });
  return result;
}

/**
 * Returns the selected priority by reading the selected edit-button class.
 * @returns {string} Priority value (high, medium, or low).
 */
function getSelectedEditPriority() {
  const priorityButtons = ["high-btn", "medium-btn", "low-btn"];
  for (let i = 0; i < priorityButtons.length; i++) {
    const buttonId = priorityButtons[i];
    const button = document.getElementById(buttonId);
    if (button?.classList.contains(`${buttonId}-selected`)) {
      return buttonId.replace("-btn", "");
    }
  }
  return "medium";
}

/**
 * Reads selected contacts from edit assigned dropdown and returns IDs for database patching.
 * @returns {Object} Assigned contact IDs keyed numerically.
 */
function getSelectedAssignedContactIds() {
  const dropdown = getAssignedDropdown();
  if (!dropdown) return {};
  const options = dropdown.getElementsByClassName("select-option");
  const selectedIds = [];
  for (let i = 0; i < options.length; i++) {
    const checkbox = options[i].getElementsByTagName("input")[0];
    const contact = contacts[i];
    if (checkbox?.checked && contact?.id) {
      selectedIds.push(contact.id);
    }
  }
  const assignedTo = {};
  for (let i = 0; i < selectedIds.length; i++) {
    assignedTo[i] = selectedIds[i];
  }
  return assignedTo;
}

/**
 * Syncs the edited payload into both task arrays used in board state.
 * @param {string} id - The edited task ID.
 * @param {Object} payload - The updated task data.
 */
function applyEditedTaskToLocalArrays(id, payload) {
  applyTaskPatch(currentTasks, id, payload);
  applyTaskPatch(tasks, id, payload);
}

/**
 * Applies a partial patch to a task in the provided list.
 * @param {Array} taskList - The list containing tasks.
 * @param {string} id - The edited task ID.
 * @param {Object} payload - The partial task update.
 */
function applyTaskPatch(taskList, id, payload) {
  const taskIndex = taskList.findIndex((task) => task.id === id);
  if (taskIndex === -1) return;
  taskList[taskIndex] = {
    ...taskList[taskIndex],
    ...payload,
  };
}

/**
 * Initializes all edit form sections after the dialog markup is rendered.
 * @param {Object} task - The task currently being edited.
 * @param {Function} createHandler - The callback used for the submit action.
 */
async function initEditTaskForm(task, createHandler) {
  prioritySelected(task);
  initEditPriorityButtons();
  await getContacts();
  renderAssignedContacts();
  initAssignedSelect();
  preselectAssignedContacts(task);
  initEditSubtasks(task);
  initActionButtons(createHandler);
  document.onclick = closeAllSelects;
}

/**
 * Prepares and renders subtask data for edit mode.
 * @param {Object} task - The task currently being edited.
 */
function initEditSubtasks(task) {
  subtasks = task.subtasks ? Object.values(task.subtasks).map((s) => s.title) : [];
  editSubtaskIndex = -1;
  initSubtaskSection();
}

/**
 * Preselects assigned contacts in the edit dropdown based on the task values.
 * Supports both contact IDs and full names as persisted values.
 * @param {Object} task - The task currently being edited.
 */
function preselectAssignedContacts(task) {
  const dropdown = getAssignedDropdown();
  if (!dropdown) return;
  const assignedValues = getAssignedValues(task);
  const options = dropdown.getElementsByClassName("select-option");
  for (let i = 0; i < options.length; i++) {
    applyAssignedSelection(options[i], contacts[i], assignedValues);
  }
  syncAssignedSelectionUi();
}

/**
 * Returns the assigned contacts dropdown element from the edit form.
 * @returns {HTMLElement|null} The dropdown element or null if not found.
 */
function getAssignedDropdown() {
  const assignedSelect = document.getElementById("assignedSelect");
  if (!assignedSelect) return null;
  return assignedSelect.getElementsByClassName("select-dropdown")[0];
}

/**
 * Builds a set of assigned values from the task payload.
 * @param {Object} task - The task currently being edited.
 * @returns {Set<string>} A set of assigned contact IDs.
 */
function getAssignedValues(task) {
  const values = task.assigned_to ? Object.values(task.assigned_to) : [];
  return new Set(values);
}

/**
 * Applies selected state for a single assigned-contact option.
 * @param {HTMLElement} option - The contact option element.
 * @param {Object} contact - The contact mapped to the option.
 * @param {Set<string>} assignedValues - The set of assigned contact IDs.
 */
function applyAssignedSelection(option, contact, assignedValues) {
  const checkbox = option?.getElementsByTagName("input")[0];
  if (!checkbox || !contact) return;
  const isSelected = assignedValues.has(contact.id);
  checkbox.checked = isSelected;
  option.classList.toggle("active", isSelected);
}

/**
 * Refreshes assigned select text and badge preview after selection changes.
 */
function syncAssignedSelectionUi() {
  updateAssignedText();
  updateAssignedBadges();
}

/**
 * Moves focus to the priority button that matches the task priority.
 * @param {Object} task - The task currently being edited.
 */
function prioritySelected(task) {
  const focusTargets = {
    high: "high-btn",
    medium: "medium-btn",
    low: "low-btn",
  };
  const targetId = focusTargets[task.priority];
  Object.values(focusTargets).forEach((id) => {
    document.getElementById(id)?.classList.remove(`${id}-selected`);
  });
  if (!targetId) return;
  requestAnimationFrame(() => {
    document.getElementById(targetId)?.classList.add(`${targetId}-selected`);
  });
}

/**
 * Initializes priority button click behavior in the edit dialog.
 */
function initEditPriorityButtons() {
  const priorityButtons = ["high-btn", "medium-btn", "low-btn"];
  for (let i = 0; i < priorityButtons.length; i++) {
    const buttonId = priorityButtons[i];
    const button = document.getElementById(buttonId);
    if (!button) continue;
    button.onclick = (event) => {
      event.preventDefault();
      setEditPriority(buttonId);
    };
  }
}

/**
 * Sets selected priority class for edit mode buttons.
 * @param {string} selectedButtonId - The button ID that should be selected.
 */
function setEditPriority(selectedButtonId) {
  const priorityButtons = ["high-btn", "medium-btn", "low-btn"];
  for (let i = 0; i < priorityButtons.length; i++) {
    const buttonId = priorityButtons[i];
    document
      .getElementById(buttonId)
      ?.classList.remove(`${buttonId}-selected`);
  }
  document
    .getElementById(selectedButtonId)
    ?.classList.add(`${selectedButtonId}-selected`);
}

/**
 * Reads and normalizes the search text from the board input.
 * @returns {string} The lowercased search query.
 */
function getSearchQuery() {
  const input = document.getElementById("searchInput");
  if (!input) return "";
  return input.value.toLowerCase();
}

/**
 * Filters tasks by title or description using the provided query.
 * @param {Array} taskList - The source list of tasks.
 * @param {string} query - The lowercased search query.
 * @returns {Array} Matching tasks.
 */
function filterTasksByQuery(taskList, query) {
  return taskList.filter(
    (task) =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query),
  );
}

/**
 * Updates all rendered empty-state texts after a search.
 */
function updateSearchEmptyStateMessage() {
  const emptyStates = document.querySelectorAll(".empty-state");
  if (emptyStates.length === 0) return;
  emptyStates.forEach((state) => {
    state.textContent = "No tasks found!";
  });
}

/**
 * Applies the current search query to the board and updates empty-state text.
 */
function searchFilter() {
  const query = getSearchQuery();
  currentTasks = filterTasksByQuery(tasks, query);
  updateBoard();
  updateSearchEmptyStateMessage();
}

/**
 * Schedules the search filtering with a short debounce.
 */
function scheduleSearchFilter() {
  clearTimeout(tippTimer);
  tippTimer = setTimeout(searchFilter, 400);
}

/**
 * Handles keyboard interaction for board search.
 * @param {KeyboardEvent} event - The keyboard event from the input.
 */
function checkEnter(event, _inputId) {
  scheduleSearchFilter();
  if (event.key === "Enter") {
    searchFilter();
  }
}
