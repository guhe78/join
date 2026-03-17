let currentBoardStatus = "todo";

async function openAddTaskModal(status) {
    if (status === undefined) {
        status = "todo";
    }
    currentBoardStatus = status;
    let dialog = document.getElementById("addTaskDialog");
    let template = document.getElementById("addTaskModalTemplate");
    if (dialog === null || template === null) {
        return;
    }
    prepareAddTaskDialog(dialog, template);
    await initAddTask(createTaskFromBoardModal);
    showAddTaskDialog(dialog);
}

function prepareAddTaskDialog(dialog, template) {
    clearAddTaskDialog(dialog);
    renderAddTaskDialog(dialog, template);
}

function clearAddTaskDialog(dialog) {
    dialog.innerHTML = "";
}

function renderAddTaskDialog(dialog, template) {
    dialog.appendChild(template.content.cloneNode(true));
}

function showAddTaskDialog(dialog) {
    dialog.showModal();
    document.body.classList.add("dialog-open");
    setTimeout(showAddTaskDialogAnimation, 10);
}

function showAddTaskDialogAnimation() {
    let dialog = document.getElementById("addTaskDialog");
    if (dialog === null) {
        return;
    }
    let modal = dialog.getElementsByClassName("add-task-modal")[0];
    if (modal === undefined) {
        return;
    }
    modal.classList.add("show");
}

function closeAddTaskModal(event) {
    if (event.target.id === "addTaskDialog") {
        closeAddTaskModalDirect();
    }
}

function closeAddTaskModalDirect() {
    startAddTaskDialogCloseAnimation();
    setTimeout(finishAddTaskDialogClose, 250);
}

function startAddTaskDialogCloseAnimation() {
    let dialog = document.getElementById("addTaskDialog");
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
    let dialog = document.getElementById("addTaskDialog");
    if (dialog === null) {
        return;
    }
    closeAddTaskDialogElement(dialog);
    clearAddTaskDialog(dialog);
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
    await renderBoardIfAvailable();
}

async function refreshBoardTasks() {
    if (typeof getTasks === "function") {
        await getTasks();
    }
}

async function renderBoardIfAvailable() {
    if (typeof renderBoard === "function") {
        await renderBoard();
    }
}

function handleAddTaskModalKey(event) {
    if (event.key === "Escape") {
        closeAddTaskModalDirect();
    }
}