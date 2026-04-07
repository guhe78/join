let currentBoardStatus = "todo";

/**
 * Opens the Add Task modal and initializes it.
 * @param {string} [status="todo"] The board status where the task will be added.
 */
async function openAddTaskModal(status) {
    if (status === undefined) {
        status = "todo";
    }
    currentBoardStatus = status;

    let dialog = document.getElementById("dialog");
    let dialogContent = document.getElementById("dialogContent");
    if (dialog === null || dialogContent === null) {
        return;
    }

    dialog.classList.add("add-task-dialog");
    dialogContent.innerHTML = addTaskTemplate();

    await initAddTask(createTaskFromBoardModal);
    showAddTaskDialog(dialog);
}

/**
 * Displays the Add Task dialog and triggers the opening animation.
 * @param {HTMLDialogElement} dialog The dialog element.
 */
function showAddTaskDialog(dialog) {
    dialog.showModal();
    document.body.classList.add("dialog-open");
    setTimeout(showAddTaskDialogAnimation, 10);
}

/**
 * Adds the animation class to the modal for smooth appearance.
 */
function showAddTaskDialogAnimation() {
    let dialog = document.getElementById("dialog");
    if (dialog === null) {
        return;
    }

    let modal = dialog.getElementsByClassName("add-task-modal")[0];
    if (modal === undefined) {
        return;
    }

    modal.classList.add("show");
}

/**
 * Closes the Add Task modal with animation.
 */
function closeAddTaskModalDirect() {
    startAddTaskDialogCloseAnimation();
    setTimeout(finishAddTaskDialogClose, 250);
}

/**
 * Starts the closing animation of the Add Task modal.
 */
function startAddTaskDialogCloseAnimation() {
    let dialog = document.getElementById("dialog");
    if (dialog === null) {
        return;
    }

    let modal = dialog.getElementsByClassName("add-task-modal")[0];
    if (modal === undefined) {
        return;
    }

    modal.classList.remove("show");
    modal.classList.add("hide");
}

/**
 * Finishes closing the Add Task modal and cleans up DOM and classes.
 */
function finishAddTaskDialogClose() {
    let dialog = document.getElementById("dialog");
    let dialogContent = document.getElementById("dialogContent");

    if (dialog === null || dialogContent === null) {
        return;
    }

    closeAddTaskDialogElement(dialog);
    dialogContent.innerHTML = "";
    dialog.classList.remove("add-task-dialog");
    document.body.classList.remove("dialog-open");
}

/**
 * Safely closes the dialog element if it is open.
 * @param {HTMLDialogElement} dialog The dialog element.
 */
function closeAddTaskDialogElement(dialog) {
    if (dialog.open === true) {
        dialog.close();
    }
}

/**
 * Handles task creation from the board modal.
 * Validates input saves task updates board and closes modal.
 */
async function createTaskFromBoardModal() {
    let isValid = validateAddTaskForm();

    if (isValid !== true) {
        return;
    }

    try {
        let task = createTaskObject(currentBoardStatus);
        await postData("tasks", task);
        showBoardTaskAddedToast();
        await refreshBoardAfterTaskCreation();
        setTimeout(closeAddTaskModalDirect, 1000);
    } catch (error) {
        console.error("Task could not be saved:", error);
    }
}

/**
 * Displays the "task added" toast notification on the board.
 */
function showBoardTaskAddedToast() {
    let toast = document.getElementById("taskAddedToast");
    if (toast === null) {
        return;
    }
    toast.classList.add("show");
}

/**
 * Refreshes board data and re renders the board.
 */
async function refreshBoardAfterTaskCreation() {
    await refreshBoardTasks();
    updateBoard();
}

/**
 * Reloads tasks from the backend and updates the local task array.
 */
async function refreshBoardTasks() {
    if (typeof getTasks === "function") {
        await getTasks();
        currentTasks = tasks;
    }
}

/**
 * Handles keyboard interaction for the modal.
 * Closes the modal when Escape is pressed.
 * @param {KeyboardEvent} event The keyboard event.
 */
function handleAddTaskModalKey(event) {
    if (event.key === "Escape") {
        closeAddTaskModalDirect();
    }
}

/**
 * Opens the task detail modal for a specific task.
 * @param {string} firebaseKey The ID of the task.
 */
function openTaskDetail(firebaseKey) {
    let task = findTaskById(tasks, firebaseKey);
    let dialog = document.getElementById("dialog");
    let content = document.getElementById("dialogContent");

    if (!task || !dialog || !content) {
        return;
    }

    dialog.classList.add("task-modal");
    dialog.classList.remove("is-closing");

    renderTaskDetailContent(content, task);
    dialog.showModal();
}

/**
 * Closes any open task dialog with animation and cleanup.
 */
function closeTaskDialog() {
    let dialog = document.getElementById("dialog");
    let dialogContent = document.getElementById("dialogContent");

    if (!dialog || !dialog.open || dialog.classList.contains("is-closing")) {
        return;
    }

    dialog.classList.add("is-closing");

    setTimeout(function () {
        if (dialog.open) {
            dialog.close();
        }
        if (dialogContent) {
            dialogContent.innerHTML = "";
        }

        dialog.classList.remove("task-modal");
        dialog.classList.remove("add-task-dialog");
        dialog.classList.remove("is-closing");
    }, TaskDialogCloseDuration);
}