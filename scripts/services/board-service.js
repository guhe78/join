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
