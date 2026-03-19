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
    dialogContent.innerHTML = addTaskTemplate();
    let template = document.getElementById("addTaskModalTemplate");
    if (dialog === null || template === null) {
        return;
    }
    dialog.classList.add("add-task-dialog");
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

// function closeAddTaskModal(event) {
//     if (event.target.id === "dialog") {
//         const dialog = document.getElementById("dialog");
//         if (dialog === null) {
//             return;
//         }
//         dialog.classList.remove("add-task-dialog");
//         closeAddTaskModalDirect();
//     }
// }

// function closeAddTaskModalDirect() {
//     startAddTaskDialogCloseAnimation();
//     setTimeout(finishAddTaskDialogClose, 250);
// }

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

function openCalendar() {
    let picker = document.getElementById("duePicker");

    if (picker === null) {
        return;
    }

    if (typeof picker.showPicker === "function") {
        picker.showPicker();
    } else {
        picker.focus();
        picker.click();
    }
}

function applyPickedDate() {
    let dueInput = document.getElementById("due");
    let picker = document.getElementById("duePicker");

    if (dueInput === null || picker === null) {
        return;
    }

    if (picker.value === "") {
        return;
    }

    let parts = picker.value.split("-");
    let year = parts[0];
    let month = parts[1];
    let day = parts[2];

    dueInput.value = day + "/" + month + "/" + year;
}

/**
 * Closes the task detail dialog.
 */
function closeTaskDialog() {
  const dialog = document.getElementById("dialog");
  if (!dialog || !dialog.open || dialog.classList.contains("is-closing")) {
    return;
  }
  dialog.classList.add("is-closing");

  setTimeout(() => {
    if (dialog.open) {
      dialog.close();
    }
    dialog.classList.remove("task-modal");
    dialog.classList.remove("is-closing");
  }, TaskDialogCloseDuration);
}


/**
 * Opens the task detail dialog for a specific task.
 * @param {string} id - The ID of the task to display.
 */
function openTaskDetail(id) {
  const task = findTaskById(tasks, id);
  if (!task) return;
  const dialog = document.getElementById("dialog");
  const content = document.getElementById("dialogContent");
  if (!dialog || !content) return;
  dialog.classList.add("task-modal");
  dialog.classList.remove("is-closing");
  renderTaskDetailContent(content, task);
  dialog.showModal();
}