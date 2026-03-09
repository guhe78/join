function initAddTask() {
    initPriorityButtons();
    initAssignedSelect();
    initCategorySelect();
    initActionButtons();
    document.onclick = closeAllSelects;
}

function initPriorityButtons() {
    let buttons = document.getElementsByClassName("prio-btn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].onclick = priorityButtonClicked;
    }
}

function priorityButtonClicked(event) {
    let buttons = document.getElementsByClassName("prio-btn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("is-active");
    }
    let clickedButton = event.currentTarget;
    clickedButton.classList.add("is-active");
    event.stopPropagation();
}

function initAssignedSelect() {
    let assignedSelect = document.getElementById("assignedSelect");
    if (assignedSelect === null) {
        return;
    }
    let trigger = assignedSelect.getElementsByClassName("select-trigger")[0];
    let dropdown = assignedSelect.getElementsByClassName("select-dropdown")[0];
    let options = dropdown.getElementsByClassName("select-option");

    trigger.onclick = toggleAssignedDropdown;
    for (let i = 0; i < options.length; i++) {
        options[i].onclick = assignedOptionClicked;
    }
    updateAssignedText();
    updateAssignedBadges();
}

function toggleAssignedDropdown(event) {
    let assignedSelect = document.getElementById("assignedSelect");
    if (assignedSelect.classList.contains("open") === true) {
        assignedSelect.classList.remove("open");
    } else {
        closeAllSelects();
        assignedSelect.classList.add("open");
    }
    event.stopPropagation();
}

function assignedOptionClicked(event) {
    let option = event.currentTarget;
    let checkbox = option.getElementsByTagName("input")[0];
    if (event.target !== checkbox) {
        if (checkbox.checked === true) {
            checkbox.checked = false;
        } else {
            checkbox.checked = true;
        }
    }
    if (checkbox.checked === true) {
        option.classList.add("active");
    } else {
        option.classList.remove("active");
    }
    event.stopPropagation();
    updateAssignedText();
    updateAssignedBadges();
}

function updateAssignedText() {
    let assignedSelect = document.getElementById("assignedSelect");
    if (assignedSelect === null) {
        return;
    }
    let dropdown = assignedSelect.getElementsByClassName("select-dropdown")[0];
    let text = assignedSelect.getElementsByClassName("trigger-text")[0];
    let options = dropdown.getElementsByClassName("select-option");
    let checkedCount = 0;
    for (let i = 0; i < options.length; i++) {
        let checkbox = options[i].getElementsByTagName("input")[0];
        if (checkbox.checked === true) {
            checkedCount = checkedCount + 1;
        }
    }

    if (checkedCount === 0) {
        text.textContent = "Select contacts to assign";
    } else {
        text.textContent = checkedCount + " selected";
    }
}

function initCategorySelect() {
    let catSelect = document.getElementById("catSelect");
    if (catSelect === null) {
        return;
    }

    let trigger = catSelect.getElementsByClassName("select-trigger")[0];
    let dropdown = catSelect.getElementsByClassName("select-dropdown")[0];
    let options = dropdown.getElementsByClassName("select-option");
    trigger.onclick = toggleCategoryDropdown;

    for (let i = 0; i < options.length; i++) {
        options[i].onclick = categoryOptionClicked;
    }
}

function toggleCategoryDropdown(event) {
    let catSelect = document.getElementById("catSelect");
    if (catSelect.classList.contains("open") === true) {
        catSelect.classList.remove("open");
    } else {
        closeAllSelects();
        catSelect.classList.add("open");
    }
    event.stopPropagation();
}

function categoryOptionClicked(event) {
    let option = event.currentTarget;
    let catSelect = document.getElementById("catSelect");
    let dropdown = catSelect.getElementsByClassName("select-dropdown")[0];
    let text = catSelect.getElementsByClassName("trigger-text")[0];
    let hidden = document.getElementById("catHidden");
    let options = dropdown.getElementsByClassName("select-option");
    
    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove("active");
    }
    option.classList.add("active");
    text.textContent = option.textContent.trim();
    hidden.value = option.getAttribute("data-value");
    catSelect.classList.remove("open");

    event.stopPropagation();
}

function closeAllSelects() {
    let selects = document.getElementsByClassName("custom-select");

    for (let i = 0; i < selects.length; i++) {
        selects[i].classList.remove("open");
    }
}

function initActionButtons() {
    let actionArea = document.getElementsByClassName("addtask-actions")[0];
    if (actionArea === undefined) {
        return;
    }
    let buttons = actionArea.getElementsByTagName("button");

    if (buttons.length >= 2) {
        buttons[0].onclick = clearAddTaskForm;
        buttons[1].onclick = createTaskClicked;
    }
}

function clearAddTaskForm() {
    clearTitleField();
    clearDescriptionField();
    clearDueDateField();
    clearPriorityButtons();
    clearAssignedSelect();
    clearCategorySelect();
    clearValidationState();
}

function clearTitleField() {
    let titleInput = document.getElementById("title");
    if (titleInput !== null) {
        titleInput.value = "";
    }
}

function clearDescriptionField() {
    let descInput = document.getElementById("desc");
    if (descInput !== null) {
        descInput.value = "";
    }
}

function clearDueDateField() {
    let dueInput = document.getElementById("due");
    if (dueInput !== null) {
        dueInput.value = "";
    }
}

function clearPriorityButtons() {
    let buttons = document.getElementsByClassName("prio-btn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("is-active");
    }

    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].classList.contains("prio-low") === true) {
            buttons[i].classList.add("is-active");
        }
    }
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

function clearCategorySelect() {
    let catSelect = document.getElementById("catSelect");
    let hidden = document.getElementById("catHidden");

    if (catSelect === null || hidden === null) {
        return;
    }
    let text = catSelect.getElementsByClassName("trigger-text")[0];
    let dropdown = catSelect.getElementsByClassName("select-dropdown")[0];
    let options = dropdown.getElementsByClassName("select-option");
    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove("active");
    }
    text.textContent = "Select task category";
    hidden.value = "";
    catSelect.classList.remove("open");
}

function clearValidationState() {
    let titleInput = document.getElementById("title");
    let dueInput = document.getElementById("due");
    let catSelect = document.getElementById("catSelect");
    let titleError = document.getElementById("titleError");
    let dueError = document.getElementById("dueError");
    let categoryError = document.getElementById("categoryError");
    if (titleInput !== null) {
        titleInput.classList.remove("input-error");
    }
    if (dueInput !== null) {
        dueInput.classList.remove("input-error");
    }
    if (catSelect !== null) {
        catSelect.classList.remove("input-error");
    }
    if (titleError !== null) {
        titleError.style.display = "none";
    }
    if (dueError !== null) {
        dueError.style.display = "none";
    }
    if (categoryError !== null) {
        categoryError.style.display = "none";
    }
}

function createTaskClicked() {
    let isValid = validateAddTaskForm();
    if (isValid === true) {
        alert("Task created");
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

function updateAssignedBadges() {
    let assignedSelect = document.getElementById("assignedSelect");
    let badgesContainer = document.getElementById("assignedBadges");
    if (assignedSelect === null) {
        return;
    }
    if (badgesContainer === null) {
        return;
    }
    let dropdown = assignedSelect.getElementsByClassName("select-dropdown")[0];
    let options = dropdown.getElementsByClassName("select-option");
    let badgesHTML = "";
    for (let i = 0; i < options.length; i++) {
        let checkbox = options[i].getElementsByTagName("input")[0];
        if (checkbox.checked === true) {
            let contactInfo = options[i].getElementsByClassName("contact-info")[0];
            let avatar = contactInfo.getElementsByClassName("avatar")[0];
            let classes = avatar.className;
            let letters = avatar.textContent;
            badgesHTML = badgesHTML + 
                '<div class="' + classes.replace("avatar", "assigned-badge") + '">' +
                letters +
                '</div>';
        }
    }
    badgesContainer.innerHTML = badgesHTML;
}