/**
 * Array of subtasks for the current task being created or edited.
 * Each element is a string representing a subtask description.
 * @type {string[]}
 */
let subtasks = [];

/**
 * Index of the subtask currently being edited.
 * Set to -1 when no subtask is in edit mode.
 * @type {number}
 */
let editSubtaskIndex = -1;
