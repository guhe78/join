/** @type {string|null} Stores the ID of the element currently being dragged */
let currentDraggedElement = null;

/**
 * Array of task objects for the current board view.
 * Stores all tasks that are displayed on the board.
 * @type {Object[]}
 */
let currentTasks = [];

/**
 * Timer ID for tooltip display timing.
 * Used to manage the delay before showing tooltips on hover.
 * @type {number|null}
 */
let tippTimer;

/**
 * Duration for the task dialog close animation in milliseconds.
 * @type {number}
 */
const TaskDialogCloseDuration = 200;
