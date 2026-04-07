/**
 * Converts the category value into a readable label.
 * @param {string} categoryValue The raw category value.
 * @returns {string} The formatted category label.
 */
function getCategoryLabel(categoryValue) {
  if (categoryValue === "technical") return "Technical Task";
  if (categoryValue === "userstory") return "User Story";
  return categoryValue;
}

/**
 * Generates initials from a contact object.
 * @param {Object} contact The contact object.
 * @param {string} contact.firstName The contacts first name.
 * @param {string} contact.lastName The contacts last name.
 * @returns {string} The initials of the contact.
 */
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

/**
 * Converts the subtasks array into Firebase compatible objects.
 * @returns {Array<Object>} Array of subtask objects.
 */
function getSubtasksForFirebase() {
  let subtasksForFirebase = [];
  for (let i = 0; i < subtasks.length; i++) {
    subtasksForFirebase.push({
      title: subtasks[i],
      is_done: false,
    });
  }
  return subtasksForFirebase;
}
