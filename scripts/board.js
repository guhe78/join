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
  checkAuth();
  document.getElementById("profile-button").innerHTML = getUserData().initials;

  await getContacts();
  await getTasks();
  currentTasks = tasks;
  updateBoard();
  scrollToHash();
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
    container.innerHTML += TaskBoardTemplate(taskData);
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
    firebaseKey: element.firebaseKey,
    status: element.status,
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
 * @param {string} firebaseKey - The ID of the task being dragged.
 */
function startdragging(firebaseKey) {
  currentDraggedElement = firebaseKey;
  const card = document.querySelector(`.card[data-id="${firebaseKey}"]`);
  if (card) {
    card.classList.add("is-dragging");
  }
}

/**
 * Removes drag styling from the currently dragged task card.
 * @param {string} firebaseKey - The ID of the task card that should lose drag styling.
 */
function stopDragging(firebaseKey) {
  const draggedCard = document.querySelector(`.card[data-id="${firebaseKey}"]`);
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
 * @param {string} firebaseKey - The ID of the target column element.
 * @param {boolean} show - Whether the placeholder should be visible.
 */
function highlight(firebaseKey, show) {
  const container = document.getElementById(firebaseKey);
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
  const index = currentTasks.findIndex(
    (t) => t.firebaseKey === currentDraggedElement,
  );
  if (index !== -1) {
    const movedTask = currentTasks.splice(index, 1)[0];
    movedTask.status = newStatus;
    currentTasks.push(movedTask);
    await updateData("tasks", movedTask.firebaseKey, { status: newStatus });
    updateBoard();
  }
}

/**
 * Opens or closes the move menu for a task card on mobile.
 * @param {Event} event - The click event from the move button.
 * @param {string} firebaseKey - The task ID.
 */
function toggleTaskMoveMenu(event, firebaseKey) {
  event.stopPropagation();
  const card = document.querySelector(`.card[data-id="${firebaseKey}"]`);
  if (!card) return;
  const menu = card.querySelector(".task-move-menu");
  if (!menu) return;
  const isOpen = menu.classList.contains("open");
  closeTaskMoveMenus();
  if (!isOpen) {
    menu.classList.add("open");
  }
}

/**
 * Closes all currently open task move menus.
 */
function closeTaskMoveMenus() {
  const menus = document.querySelectorAll(".task-move-menu.open");
  if (menus.length === 0) return;
  menus.forEach((menu) => menu.classList.remove("open"));
}

/**
 * Moves a task to a selected status from the mobile move menu.
 * @param {Event} event - The click event from the menu item.
 * @param {string} firebaseKey - The task ID.
 * @param {string} newStatus - The target status.
 */
async function moveTaskFromMenu(event, firebaseKey, newStatus) {
  event.stopPropagation();
  const task = currentTasks.find((item) => item.firebaseKey === firebaseKey);
  if (!task || task.status === newStatus) {
    closeTaskMoveMenus();
    return;
  }
  currentDraggedElement = firebaseKey;
  await moveTo(newStatus);
  closeTaskMoveMenus();
}

/**
 * Returns fallback content when a task is already in the target status.
 * @param {Object} task - The task to evaluate.
 * @param {string} newStatus - The target status to compare against.
 * @param {string} returnContent - The content to return when statuses match.
 * @returns {string} The fallback content or an empty string.
 */
function checkIsCurrentStatus(task, newStatus, returnContent) {
  return task.status === newStatus ? returnContent : "";
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
  for (const firebaseKey of displayIds) {
    const contact = contacts.find((c) => c.firebaseKey === firebaseKey);
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
 * @param {string} firebaseKey - The ID of the task to find.
 * @returns {Object|undefined} The matched task or undefined.
 */
function findTaskById(taskList, firebaseKey) {
  return taskList.find((task) => task.firebaseKey === firebaseKey);
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
  for (const firebaseKey of contactIds) {
    const contact = contacts.find((c) => c.firebaseKey === firebaseKey);
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
 * @param {string} firebaseKey - The ID of the parent task.
 * @param {Object} subtasks - The subtasks object.
 * @returns {string} Combined HTML string for the subtask list.
 */
function generateDetailedSubtasksHtml(firebaseKey, subtasks) {
  const subtaskArray = subtasks ? Object.entries(subtasks) : [];
  if (subtaskArray.length === 0) {
    return noSubtasksTemplate();
  }
  let html = "";
  for (const [subId, sub] of subtaskArray) {
    const checkImg = sub.is_done
      ? "../assets/imgs/checkbox-checked.png"
      : "../assets/imgs/checkbox-empty.png";
    html += subtaskItemTemplate(firebaseKey, subId, checkImg, sub);
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
 * @param {string} firebaseKey - The ID of the task to be deleted.
 */
async function deleteTask(path, firebaseKey) {
  const index = currentTasks.findIndex((t) => t.firebaseKey === firebaseKey);
  if (index !== -1) {
    await deleteData(path, firebaseKey);
    currentTasks.splice(index, 1);
    closeTaskDialog();
    updateBoard();
  }
}

/**
 * Toggles the completion status of a subtask and updates the UI.
 * @param {string} firebaseKey - The ID of the parent task.
 * @param {string} subId - The ID of the subtask to toggle.
 */
async function toggleSubtask(firebaseKey, subId) {
  const task = currentTasks.find((t) => t.firebaseKey === firebaseKey);
  if (task && task.subtasks && task.subtasks[subId]) {
    task.subtasks[subId].is_done = !task.subtasks[subId].is_done;
    updateSubtaskCheckboxIcon(firebaseKey, subId, task.subtasks[subId].is_done);
    await updateData("tasks", task.firebaseKey, { subtasks: task.subtasks });
    updateBoard();
  }
}

/**
 * Updates only the subtask checkbox icon in the open detail dialog.
 * @param {string} firebaseKey - The ID of the parent task.
 * @param {string} subId - The ID of the subtask.
 * @param {boolean} isDone - The completion status of the subtask.
 */
function updateSubtaskCheckboxIcon(firebaseKey, subId, isDone) {
  const icon = document.getElementById(
    `subtask-checkbox-icon-${firebaseKey}-${subId}`,
  );
  if (!icon) return;
  icon.src = isDone
    ? "../assets/imgs/checkbox-checked.png"
    : "../assets/imgs/checkbox-empty.png";
}

/**
 * Helper function to re-render the detail view content without closing the dialog.
 * @param {string} firebaseKey - The ID of the task.
 */
function refreshTaskDetail(firebaseKey) {
  const task = findTaskById(currentTasks, firebaseKey);
  if (task) {
    const content = document.getElementById("dialogContent");
    if (!content) return;
    renderTaskDetailContent(content, task);
  }
}

/**
 * Moves focus to the priority button that matches the task priority.
 * @param {Object} task - The task currently being edited.
 */
function selectFocus(task) {
  let focusTargets = {
    urgent: "urgent-btn",
    medium: "medium-btn",
    low: "low-btn",
  };
  let targetId = focusTargets[task.priority];
  if (!targetId) {
    return;
  }
  let targetButton = document.getElementById(targetId);
  if (!targetButton) {
    return;
  }
  targetButton.focus();
}

/**
 * Reads and normalizes the search text from the board input.
 * @returns {string} The lowercased search query.
 */
function getSearchQuery() {
  const input = document.getElementById("searchInput");
  const mobileInput = document.getElementById("searchInputMobile");
  if (input && input.offsetParent !== null) {
    return input.value.toLowerCase();
  }
  if (mobileInput && mobileInput.offsetParent !== null) {
    return mobileInput.value.toLowerCase();
  }
  return "";
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
 * @param {string} _inputId - Legacy input identifier (currently unused).
 */
function checkEnter(event, _inputId) {
  scheduleSearchFilter();
  if (event.key === "Enter") {
    searchFilter();
  }
}

function scrollToHash() {
  const hash = window.location.hash;
  if (!hash) return;

  const el = document.querySelector(hash);
  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}