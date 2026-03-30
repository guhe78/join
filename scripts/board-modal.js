let currentBoardStatus = "todo";

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

function showAddTaskDialog(dialog) {
    dialog.showModal();
    document.body.classList.add("dialog-open");
    setTimeout(showAddTaskDialogAnimation, 10);
}

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

function closeAddTaskModalDirect() {
    startAddTaskDialogCloseAnimation();
    setTimeout(finishAddTaskDialogClose, 250);
}

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

function closeAddTaskDialogElement(dialog) {
    if (dialog.open === true) {
        dialog.close();
    }
}

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

function showBoardTaskAddedToast() {
    let toast = document.getElementById("taskAddedToast");
    if (toast === null) {
        return;
    }
    toast.classList.add("show");
}

async function refreshBoardAfterTaskCreation() {
    await refreshBoardTasks();
    updateBoard();
}

async function refreshBoardTasks() {
    if (typeof getTasks === "function") {
        await getTasks();
        currentTasks = tasks;
    }
}

function handleAddTaskModalKey(event) {
    if (event.key === "Escape") {
        closeAddTaskModalDirect();
    }
}

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