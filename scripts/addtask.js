let subtasks = [];
let editSubtaskIndex = -1;

function priorityButtonClicked(event) {
    let buttons = document.getElementsByClassName("prio-btn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("is-active");
    }
    let clickedButton = event.currentTarget;
    clickedButton.classList.add("is-active");
    event.stopPropagation();
}

function clearAddTaskForm() {
    clearTitleField();
    clearDescriptionField();
    clearDueDateField();
    clearPriorityButtons();
    clearAssignedSelect();
    clearCategorySelect();
    clearSubtasks();
    clearValidationState();
}

function clearAssignedSelect() {
    let assignedSelect = document.getElementById("assignedSelect");
    if (assignedSelect === null) {
        return;
    }
    let dropdown = assignedSelect.getElementsByClassName("select-dropdown")[0];
    let options = dropdown.getElementsByClassName("select-option");
    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove("active");

        let checkbox = options[i].getElementsByTagName("input")[0];
        checkbox.checked = false;
    }

    updateAssignedText();
    updateAssignedBadges();
    assignedSelect.classList.remove("open");
}

function createTaskClicked() {
    let isValid = validateAddTaskForm();
    if (isValid === true) {
        showTaskAddedToast();
    }
}

function validateAddTaskForm() {
    let titleIsValid = validateTitleField();
    let dueDateIsValid = validateDueDateField();
    let categoryIsValid = validateCategoryField();
    if (titleIsValid === true && dueDateIsValid === true && categoryIsValid === true) {
        return true;
    }
    return false;
}

function validateTitleField() {
    let titleInput = document.getElementById("title");
    let titleError = document.getElementById("titleError");
    if (titleInput === null) {
        return false;
    }
    if (titleError === null) {
        return false;
    }
    if (titleInput.value.trim() === "") {
        titleInput.classList.add("input-error");
        titleError.style.display = "block";
        return false;
    }
    titleInput.classList.remove("input-error");
    titleError.style.display = "none";
    return true;
}

function validateDueDateField() {
    let dueInput = document.getElementById("due");
    let dueError = document.getElementById("dueError");
    if (dueInput === null) {
        return false;
    }
    if (dueError === null) {
        return false;
    }
    if (dueInput.value.trim() === "") {
        dueInput.classList.add("input-error");
        dueError.style.display = "block";
        return false;
    }
    dueInput.classList.remove("input-error");
    dueError.style.display = "none";
    return true;
}

function validateCategoryField() {
    let catSelect = document.getElementById("catSelect");
    let catHidden = document.getElementById("catHidden");
    let categoryError = document.getElementById("categoryError");
    if (catSelect === null) {
        return false;
    }
    if (catHidden === null) {
        return false;
    }
    if (categoryError === null) {
        return false;
    }
    if (catHidden.value.trim() === "") {
        catSelect.classList.add("input-error");
        categoryError.style.display = "block";
        return false;
    }
    catSelect.classList.remove("input-error");
    categoryError.style.display = "none";
    return true;
}

function saveSubtaskFromInput() {
    let subtaskInput = document.getElementById("subtask");
    if (subtaskInput === null) {
        return;
    }
    let subtaskText = subtaskInput.value.trim();
    if (subtaskText === "") {
        return;
    }
    subtasks.push(subtaskText);
    subtaskInput.value = "";
    editSubtaskIndex = -1;
    renderSubtasks();
}

function deleteSubtaskInEditModeClicked() {
    if (editSubtaskIndex >= 0) {
        subtasks.splice(editSubtaskIndex, 1);
    }
    editSubtaskIndex = -1;
    renderSubtasks();
}

function redirectToBoard() {
    window.location.href = "board.html";
}

function initAddTask() {
    initPriorityButtons();
    initAssignedSelect();
    initCategorySelect();
    initSubtaskSection();
    initActionButtons();
    document.onclick = closeAllSelects;
}