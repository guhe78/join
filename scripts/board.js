/** @type {string|null} Stores the ID of the element currently being dragged */
let currentDraggedElement = null;

let currentTasks = [];
let tippTimer;

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
 * Filters currentTasks by status and prepares the column container for new content.
 * @param {string} status - The status category to filter for.
 * @param {HTMLElement} container - The DOM element representing the column.
 */
function processColumn(status, container) {
  let filtered = [];
  for (let i = 0; i < currentTasks.length; i++) {
    if (currentTasks[i].status === status) {
      filtered.push(currentTasks[i]);
    }
  }
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

function addBadgeCount(html, contactIds, limit) {
  if (contactIds.length > limit) {
    const remaining = contactIds.length - limit;
    html += `<div class="badge-count">+${remaining}</div>`;
  }
  return html;
}

/**
 * Opens the detail view for a specific task.
 * @param {string} id - The ID of the task to display.
 */
function openTaskDetail(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  const dialog = document.getElementById("taskDialog");
  const content = document.getElementById("dialogContent");
  const categoryClass = task.category.toLowerCase().replace(/\s+/g, "-");
  content.innerHTML = dialogTemplate(task, categoryClass);
  dialog.showModal();
}

/**
 * Closes the task detail dialog.
 */
function closeTaskDialog() {
  const dialog = document.getElementById("taskDialog");
  dialog.close();
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
  const task = currentTasks.find((t) => t.id === id);
  if (task) {
    const content = document.getElementById("dialogContent");
    const categoryClass = task.category.toLowerCase().replace(/\s+/g, "-");
    content.innerHTML = dialogTemplate(task, categoryClass);
  }
}

/**
 * Opens the edit view for a task within the existing dialog.
 */
function editTask(id) {
  const task = currentTasks.find((t) => t.id === id);
  if (!task) return;
  const content = document.getElementById("dialogContent");
  content.innerHTML = editTaskTemplate(task);
}

function searchFilter() {
  const input = document.getElementById("searchInput");
  const filter = input.value.toLowerCase();
  currentTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(filter) ||
      task.description.toLowerCase().includes(filter),
  );
  updateBoard();
  const emptyStates = document.querySelectorAll(".empty-state");
  if (emptyStates) {
    emptyStates.forEach((state) => {
      state.textContent = `No tasks found!"`;
    });
  }
}

function checkEnter(event, inputId) {
  clearTimeout(tippTimer);
  tippTimer = setTimeout(searchFilter, 400, inputId);
  if (event.key === "Enter") {
    searchFilter(inputId);
  }
}
