/**
 * Initializes the application by loading contacts and tasks.
 * Updates the board with the loaded data afterwards.
 */
async function init() {
  checkAuth();
  renderLoginInitials();
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
 * Renders task detail HTML into the dialog content container.
 * @param {HTMLElement} content - The detail dialog content element.
 * @param {Object} task - The task to render.
 */
function renderTaskDetailContent(content, task) {
  const categoryClass = task.category.toLowerCase().replace(/\s+/g, "-");
  content.innerHTML = dialogTemplate(task, categoryClass);
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

/**
 * Scrolls smoothly to the element referenced by the current URL hash.
 */
function scrollToHash() {
  const hash = window.location.hash;
  if (!hash) return;
  const el = document.querySelector(hash);
  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
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
