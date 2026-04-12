/**
 * Returns today's date as an ISO string (YYYY-MM-DD).
 * @returns {string} Today's date in ISO format.
 */
function getTodayValue() {
  return new Date().toISOString().split("T")[0];
}

/**
 * Converts an ISO date string (YYYY-MM-DD) to display format (DD/MM/YYYY).
 * @param {string} value - ISO date string.
 * @returns {string} Formatted date string or empty string if no value given.
 */
function formatDateForDisplay(value) {
  if (!value) {
    return "";
  }
  return value.split("-").reverse().join("/");
}

/**
 * Parses a display-format date string (DD/MM/YYYY) into its components.
 * @param {string} value - Date string in DD/MM/YYYY format.
 * @returns {{day: string, month: string, year: string}|null} Parts object or null if format invalid.
 */
function getDueDateParts(value) {
  let match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match === null) {
    return null;
  }
  return {
    day: match[1].padStart(2, "0"),
    month: match[2].padStart(2, "0"),
    year: match[3],
  };
}

/**
 * Converts a display-format date string (DD/MM/YYYY) to ISO storage format (YYYY-MM-DD).
 * @param {string} value - Date string in DD/MM/YYYY format.
 * @returns {string} ISO date string or empty string if format invalid.
 */
function formatDueDateForStorage(value) {
  let parts = getDueDateParts(value);
  if (parts === null) {
    return "";
  }
  return [parts.year, parts.month, parts.day].join("-");
}

/**
 * Checks whether the given ISO date string represents a real calendar date.
 * @param {string} value - ISO date string (YYYY-MM-DD).
 * @returns {boolean} True if the date is valid.
 */
function isRealDueDate(value) {
  let date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  return date.toISOString().slice(0, 10) === value;
}

/**
 * Reads the due-date text input and returns its value in ISO storage format.
 * @returns {string} ISO date string or empty string if input is missing or empty.
 */
function getDueDateValue() {
  let input = document.getElementById("due-date");
  if (input === null) {
    return "";
  }
  return formatDueDateForStorage(input.value.trim());
}

/**
 * Checks whether the current due-date value is a real, non-past date.
 * @returns {boolean} True if the due date is valid and not in the past.
 */
function isDueDateValid() {
  let value = getDueDateValue();
  if (value === "") {
    return false;
  }
  return isRealDueDate(value) && value >= getTodayValue();
}

/**
 * Returns the appropriate user-facing feedback message for a given raw input value.
 * @param {string} value - Raw value from the due-date text input.
 * @returns {string} Feedback message string.
 */
function getDueDateFeedback(value) {
  if (value === "") {
    return "this field is required";
  }
  if (formatDueDateForStorage(value) === "") {
    return "use format dd/mm/yyyy";
  }
  return "choose today or a future date";
}

/**
 * Validates the due-date field and updates the input's error state and feedback message.
 * @returns {boolean} True if the due date is valid.
 */
function validateDueDateField() {
  let input = document.getElementById("due-date");
  let feedback = document.getElementById("dueDateFeedback");
  if (input === null || feedback === null) {
    return false;
  }
  if (isDueDateValid()) {
    input.classList.remove("input-error");
    feedback.style.visibility = "hidden";
    return true;
  }
  input.classList.add("input-error");
  feedback.textContent = getDueDateFeedback(input.value.trim());
  feedback.style.visibility = "visible";
  return false;
}

/**
 * Opens the native date picker for a given input element by its ID.
 * @param {string} inputId - The ID of the date input element to open.
 */
function openDatePicker(inputId) {
  let input = document.getElementById(inputId);
  if (input === null) {
    return;
  }
  if (input.showPicker) {
    input.showPicker();
    return;
  }
  input.focus();
}

/**
 * Opens the native date picker for the due-date-picker input.
 */
function openEditDatePicker() {
  openDatePicker("due-date-picker");
}

/**
 * Copies the selected value from the hidden date picker to the visible text input.
 */
function syncDateFromPicker() {
  let picker = document.getElementById("due-date-picker");
  let input = document.getElementById("due-date");
  if (picker === null || input === null || picker.value === "") {
    return;
  }
  input.value = formatDateForDisplay(picker.value);
  validateDueDateField();
}

/**
 * Copies the parsed ISO value from the text input back into the hidden date picker.
 */
function syncPickerFromInput() {
  let picker = document.getElementById("due-date-picker");
  if (picker === null) {
    return;
  }
  picker.value = getDueDateValue();
}

/**
 * Sets both the visible text input and the hidden date picker to the given ISO date.
 * @param {string} value - ISO date string (YYYY-MM-DD) to apply.
 */
function setDateValue(value) {
  let input = document.getElementById("due-date");
  let picker = document.getElementById("due-date-picker");
  if (input !== null) {
    input.value = formatDateForDisplay(value);
  }
  if (picker !== null) {
    picker.value = value;
  }
}

/**
 * Sets both due-date inputs to today's date.
 */
function setTodayDate() {
  setDateValue(getTodayValue());
}

/**
 * Sets the minimum selectable date on the due-date picker to today.
 */
function setMinDueDate() {
  let picker = document.getElementById("due-date-picker");
  if (picker === null) {
    return;
  }
  picker.min = getTodayValue();
}
