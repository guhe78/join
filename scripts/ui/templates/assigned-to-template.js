/**
 * Builds the HTML for a contact option in the assigned-to dropdown.
 * @param {Object} contact - The contact with firstName, lastName, firebaseKey, and badgeColor.
 * @param {boolean} isSelected - Whether the contact is currently selected.
 * @returns {string} The HTML string for the option element.
 */
function buildAssignedContactOptionTemplate(contact, isSelected) {
  let fullName = contact.firstName + " " + contact.lastName;
  let contactId = contact.firebaseKey;
  return `
        <div class="select-option${getAssignedOptionClass(isSelected)}" data-id="${contactId}">
                <div class="contact-info">
                        <div class="avatar" style="background:${contact.badgeColor}">${getContactInitials(contact)}</div>
                        <span>${fullName}</span>
                </div>
                <input type="checkbox"${getAssignedCheckboxState(isSelected)}>
        </div>
        `;
}
