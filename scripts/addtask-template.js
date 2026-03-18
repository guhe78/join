
function buildNormalSubtaskHTML(index) {
    return `
    <div class="subtask-item">
        <div class="subtask-left">
            <span class="subtask-dot">•</span>
            <span class="subtask-text">${subtasks[index]}</span>
        </div>
        <div class="subtask-item-actions">
            <img class="subtask-action-icon subtask-edit-btn" src="../assets/imgs/edit-black.svg" alt="edit">
            <div class="subtask-item-divider"></div>
            <img class="subtask-action-icon subtask-delete-btn" src="../assets/imgs/delete-black.svg" alt="delete">
        </div>
    </div>
    `;
}

function buildEditSubtaskHTML(index) {
    return `
    <div class="subtask-item edit-mode">
        <div class="subtask-left">
            <input class="subtask-edit-input" id="editSubtaskInput" type="text" value="${subtasks[index]}">
        </div>
        <div class="subtask-item-actions">
            <img class="subtask-action-icon subtask-delete-edit-btn" src="../assets/imgs/delete-black.svg" alt="delete">
            <div class="subtask-item-divider"></div>
            <img class="subtask-action-icon subtask-save-btn" src="../assets/imgs/check.png" alt="save">
        </div>
    </div>
    `;
}

function buildAssignedContactOptionHTML(index) {
    let initials = getContactInitials(contacts[index]);
    let fullName = contacts[index].firstName + " " + contacts[index].lastName;
    let badgeColor = contacts[index].badgeColor;

    return `
    <div class="select-option">
        <div class="contact-info">
            <div class="avatar" style="background:${badgeColor}">${initials}</div>
            <span>${fullName}</span>
        </div>
        <input type="checkbox">
    </div>
    `;
}

function getContactInitials(contact) {
    let firstLetter = "";
    let lastLetter = "";

    if (contact.firstName.length > 0) {
        firstLetter = contact.firstName.charAt(0);
    }

    if (contact.lastName.length > 0) {
        lastLetter = contact.lastName.charAt(0);
    }

    return firstLetter + lastLetter;
}