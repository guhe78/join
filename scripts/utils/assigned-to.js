/**
 * Collects the data-id values of all checked option elements.
 * @param {HTMLCollectionOf<Element>} options - The dropdown option elements.
 * @returns {string[]} Array of contact IDs from checked options.
 */
function collectCheckedContactIds(options) {
  let assignedContacts = [];
  for (let i = 0; i < options.length; i++) {
    let checkbox = options[i].getElementsByTagName("input")[0];
    if (checkbox.checked === true) {
      let contactId = options[i].getAttribute("data-id");
      assignedContacts.push(contactId);
    }
  }
  return assignedContacts;
}

/**
 * Returns the IDs of all checked contacts in the assigned dropdown.
 * @returns {string[]} Array of contact IDs.
 */
function getAssignedContacts() {
  let assignedSelect = document.getElementById("assignedSelect");
  if (assignedSelect === null) {
    return [];
  }
  let dropdown = assignedSelect.getElementsByClassName("select-dropdown")[0];
  let options = dropdown.getElementsByClassName("select-option");
  return collectCheckedContactIds(options);
}

/**
 * Stores the assigned contact IDs in the dropdown's dataset.
 * @param {Object} assignedContacts - An object containing contact IDs as values.
 */
function setEditAssignedContacts(assignedContacts) {
  let assignedSelect = document.getElementById("assignedSelect");
  if (assignedSelect === null) {
    return;
  }
  assignedSelect.dataset.selectedContacts =
    getAssignedContactIds(assignedContacts).join(",");
}

/**
 * Extracts contact ID values from an assigned contacts object.
 * @param {Object|null} assignedContacts - The assigned contacts object.
 * @returns {string[]} Array of contact ID strings.
 */
function getAssignedContactIds(assignedContacts) {
  if (!assignedContacts) {
    return [];
  }
  return Object.values(assignedContacts);
}

/**
 * Checks whether a contact is currently selected in the dropdown.
 * @param {string} contactId - The Firebase key of the contact.
 * @returns {boolean} True if the contact is selected.
 */
function isAssignedContactSelected(contactId) {
  let selectedContacts = getAssignedSelectionValues();
  return selectedContacts.includes(contactId);
}

/**
 * Returns all currently selected contact IDs from the dropdown's dataset.
 * @returns {string[]} Array of selected contact IDs.
 */
function getAssignedSelectionValues() {
  let assignedSelect = document.getElementById("assignedSelect");
  if (assignedSelect === null || !assignedSelect.dataset.selectedContacts) {
    return [];
  }
  return assignedSelect.dataset.selectedContacts.split(",").filter(Boolean);
}

/**
 * Returns the CSS class string for a selected or unselected option.
 * @param {boolean} isSelected - Whether the option is selected.
 * @returns {string} Either " active" or an empty string.
 */
function getAssignedOptionClass(isSelected) {
  if (isSelected) {
    return " active";
  }
  return "";
}

/**
 * Returns the HTML checked attribute string for a checkbox.
 * @param {boolean} isSelected - Whether the checkbox should be checked.
 * @returns {string} Either " checked" or an empty string.
 */
function getAssignedCheckboxState(isSelected) {
  if (isSelected) {
    return " checked";
  }
  return "";
}

/**
 * Binds click event handlers to all option elements in the dropdown.
 * @param {HTMLCollectionOf<Element>} options - The dropdown option elements.
 */
function bindAssignedOptionEvents(options) {
  for (let i = 0; i < options.length; i++) {
    options[i].onclick = assignedOptionClicked;
  }
}

/**
 * Initializes the assigned-to dropdown by binding events and updating the UI.
 */
function initAssignedSelect() {
  let assignedSelect = document.getElementById("assignedSelect");
  if (assignedSelect === null) {
    return;
  }
  let trigger = assignedSelect.getElementsByClassName("select-trigger")[0];
  let dropdown = assignedSelect.getElementsByClassName("select-dropdown")[0];
  let options = dropdown.getElementsByClassName("select-option");
  trigger.onclick = toggleAssignedDropdown;
  bindAssignedOptionEvents(options);
  updateAssignedText();
  updateAssignedBadges();
}

/**
 * Toggles the open state of the assigned-to dropdown.
 * @param {Event} event - The click event from the trigger element.
 */
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

/**
 * Toggles the checkbox state when the click did not target the checkbox directly.
 * @param {Event} event - The click event.
 * @param {HTMLInputElement} checkbox - The checkbox element inside the option.
 */
function toggleCheckboxIfNotDirectClick(event, checkbox) {
  if (event.target !== checkbox) {
    if (checkbox.checked === true) {
      checkbox.checked = false;
    } else {
      checkbox.checked = true;
    }
  }
}

/**
 * Updates the active CSS class of an option to reflect its checkbox state.
 * @param {HTMLElement} option - The option container element.
 * @param {HTMLInputElement} checkbox - The checkbox inside the option.
 */
function updateOptionActiveClass(option, checkbox) {
  if (checkbox.checked === true) {
    option.classList.add("active");
  } else {
    option.classList.remove("active");
  }
}

/**
 * Handles a click on an assigned-to dropdown option.
 * @param {Event} event - The click event from the option element.
 */
function assignedOptionClicked(event) {
  let option = event.currentTarget;
  let checkbox = option.getElementsByTagName("input")[0];
  toggleCheckboxIfNotDirectClick(event, checkbox);
  updateOptionActiveClass(option, checkbox);
  event.stopPropagation();
  updateAssignedText();
  updateAssignedBadges();
}

/**
 * Counts the number of checked checkboxes within a list of option elements.
 * @param {HTMLCollectionOf<Element>} options - The dropdown option elements.
 * @returns {number} The count of checked options.
 */
function countCheckedOptions(options) {
  let checkedCount = 0;
  for (let i = 0; i < options.length; i++) {
    let checkbox = options[i].getElementsByTagName("input")[0];
    if (checkbox.checked === true) {
      checkedCount = checkedCount + 1;
    }
  }
  return checkedCount;
}

/**
 * Sets the trigger label text based on the number of selected contacts.
 * @param {HTMLElement} text - The trigger text element.
 * @param {number} count - The number of selected contacts.
 */
function setAssignedTriggerText(text, count) {
  if (count === 0) {
    text.textContent = "Select contacts to assign";
  } else {
    text.textContent = count + " selected";
  }
}

/**
 * Updates the trigger label of the assigned-to dropdown to reflect selections.
 */
function updateAssignedText() {
  let assignedSelect = document.getElementById("assignedSelect");
  if (assignedSelect === null) {
    return;
  }
  let dropdown = assignedSelect.getElementsByClassName("select-dropdown")[0];
  let text = assignedSelect.getElementsByClassName("trigger-text")[0];
  let options = dropdown.getElementsByClassName("select-option");
  let checkedCount = countCheckedOptions(options);
  setAssignedTriggerText(text, checkedCount);
}

/**
 * Rebuilds and renders the assigned contact badges below the dropdown.
 */
function updateAssignedBadges() {
  let contactsData = getSelectedAssignedContacts();
  let html = buildAssignedBadgesHTML(contactsData);
  renderAssignedBadges(html);
}

/**
 * Extracts the badge display data from a single option element.
 * @param {HTMLElement} option - The checked option element.
 * @returns {{letters: string, backgroundColor: string}} The badge data object.
 */
function extractBadgeDataFromOption(option) {
  let contactInfo = option.getElementsByClassName("contact-info")[0];
  let avatar = contactInfo.getElementsByClassName("avatar")[0];
  return {
    letters: avatar.textContent,
    backgroundColor: avatar.style.background,
  };
}

/**
 * Collects badge display data for all checked options in the dropdown.
 * @param {HTMLCollectionOf<Element>} options - The dropdown option elements.
 * @returns {{letters: string, backgroundColor: string}[]} Array of badge data objects.
 */
function collectSelectedBadgeData(options) {
  let selectedContacts = [];
  for (let i = 0; i < options.length; i++) {
    let checkbox = options[i].getElementsByTagName("input")[0];
    if (checkbox.checked === true) {
      selectedContacts.push(extractBadgeDataFromOption(options[i]));
    }
  }
  return selectedContacts;
}

/**
 * Returns badge display data for all currently checked contacts.
 * @returns {{letters: string, backgroundColor: string}[]} Array of badge data objects.
 */
function getSelectedAssignedContacts() {
  let assignedSelect = document.getElementById("assignedSelect");
  if (assignedSelect === null) {
    return [];
  }
  let dropdown = assignedSelect.getElementsByClassName("select-dropdown")[0];
  let options = dropdown.getElementsByClassName("select-option");
  return collectSelectedBadgeData(options);
}

/**
 * Builds the full HTML string for all assigned contact badges.
 * @param {{letters: string, backgroundColor: string}[]} contactsData - Array of badge data.
 * @returns {string} The combined badge HTML string.
 */
function buildAssignedBadgesHTML(contactsData) {
  let html = "";

  for (let i = 0; i < contactsData.length; i++) {
    html = html + buildSingleAssignedBadgeHTML(contactsData[i]);
  }

  return html;
}

/**
 * Builds the HTML for a single assigned contact badge.
 * @param {{letters: string, backgroundColor: string}} contact - The badge data.
 * @returns {string} The HTML string for one badge element.
 */
function buildSingleAssignedBadgeHTML(contact) {
  return `
    <div class="assigned-badge" style="background:${contact.backgroundColor}">
        ${contact.letters}
    </div>
    `;
}

/**
 * Renders the given HTML into the assigned badges container element.
 * @param {string} html - The HTML string to insert.
 */
function renderAssignedBadges(html) {
  let badgesContainer = document.getElementById("assignedBadges");

  if (badgesContainer === null) {
    return;
  }

  badgesContainer.innerHTML = html;
}

/**
 * Builds the HTML for an unselected assigned contact option.
 * @param {number} index - The index of the contact in the contacts array.
 * @returns {string} The HTML string for the option element.
 */
function buildAssignedContactOptionHTML(index) {
  return buildAssignedContactOptionTemplate(contacts[index], false);
}

/**
 * Builds the HTML for an assigned contact option with its current selection state.
 * @param {number} index - The index of the contact in the contacts array.
 * @returns {string} The HTML string for the option element.
 */
function buildEditAssignedContactOptionHTML(index) {
  let contact = contacts[index];
  let isSelected = isAssignedContactSelected(contact.firebaseKey);
  return buildAssignedContactOptionTemplate(contact, isSelected);
}
