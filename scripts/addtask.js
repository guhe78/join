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

function createTaskObject(status = "todo") {
    let titleInput = document.getElementById("title");
    let descInput = document.getElementById("desc");
    let dueInput = document.getElementById("due");
    let catHidden = document.getElementById("catHidden");
    let task = {
        assigned_to: getAssignedContacts(),
        author_id: "user_1",
        category: catHidden.value,
        created_at: new Date().toISOString(),
        description: descInput.value,
        due_date: dueInput.value,
        priority: getSelectedPriority(),
        status: status,
        subtasks: getSubtasksForFirebase(),
        title: titleInput.value
    };

    return task;
}

function getSelectedPriority() {
    let buttons = document.getElementsByClassName("prio-btn");
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].classList.contains("is-active") === true) {
            if (buttons[i].classList.contains("prio-urgent") === true) {
                return "urgent";
            }
            if (buttons[i].classList.contains("prio-medium") === true) {
                return "medium";
            }
            if (buttons[i].classList.contains("prio-low") === true) {
                return "low";
            }
        }
    }
}

function getAssignedContacts() {
    let assignedSelect = document.getElementById("assignedSelect");
    if (assignedSelect === null) {
        return [];
    }
    let dropdown = assignedSelect.getElementsByClassName("select-dropdown")[0];
    let options = dropdown.getElementsByClassName("select-option");
    let assignedContacts = [];
    for (let i = 0; i < options.length; i++) {
        let checkbox = options[i].getElementsByTagName("input")[0];
        if (checkbox.checked === true) {
            let contactInfo = options[i].getElementsByClassName("contact-info")[0];
            let nameText = contactInfo.getElementsByTagName("span")[0].textContent;
            assignedContacts.push(nameText);
        }
    }
    return assignedContacts;
}

function getSubtasksForFirebase() {
    let subtasksForFirebase = [];
    for (let i = 0; i < subtasks.length; i++) {
        subtasksForFirebase.push({
            title: subtasks[i],
            done: false
        });
    }
    return subtasksForFirebase;
}

async function createTaskClicked() {
    let isValid = validateAddTaskForm();
    if (isValid === true) {
        try {
            let task = createTaskObject();
            await postData("tasks", task);
            showTaskAddedToast();
        } catch (error) {
            console.error("Task could not be saved:", error);
        }
    }
}

async function initAddTask(createHandler = createTaskClicked) {
    await getContacts();
    renderAssignedContacts();
    initPriorityButtons();
    initAssignedSelect();
    initCategorySelect();
    initSubtaskSection();
    initActionButtons(createHandler);
    document.onclick = closeAllSelects;
}