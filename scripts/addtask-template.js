
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