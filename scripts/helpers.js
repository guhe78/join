/**
 * Helper functions for the Join application.
 * These functions provide utility features such as data transformation, priority icon retrieval, user data management, and authentication checks.
 */

/**
 * Transforms an object of data into an array format by mapping the object's entries and adding a firebaseKey property to each entry.
 * @param {Object} data - The input data object to be transformed.
 * @returns {Array} - An array of objects with firebaseKey properties added.
 */
function makeArray(data) {
  let array = Object.entries(data).map(([key, value]) => ({
    firebaseKey: key,
    ...value,
  }));
  return array;
}

/**
 * Retrieves the appropriate priority icon based on the given priority level.
 * @param {string} priority - The priority level (e.g., "low", "medium", "urgent").
 * @returns {string} - The HTML string for the corresponding priority icon.
 */
function getPriorityIcon(priority) {
  switch (priority) {
    case "low":
      return priorityLowIcon();
    case "medium":
      return priorityMediumIcon();
    case "urgent":
      return priorityUrgentIcon();
    default:
      return "";
  }
}

/**
 * Retrieves the user data from localStorage and returns an object containing the user's initials and name. If the user is a guest, it returns default values for the initials and name.
 * @returns {Object} - An object containing the user's initials and name.
 */
function getUserData() {
  const userData = localStorage.getItem("joinUser");
  const data = JSON.parse(userData);

  if (data.isGuest === false) {
    return {
      initials:
        data.firstName[0].toUpperCase() + data.lastName[0].toUpperCase(),
      name: data.firstName + " " + data.lastName,
    };
  } else {
    return { initials: "G", name: "Guest" };
  }
}

/**
 * Checks if the user is authenticated by verifying the presence of user data in localStorage. If the user is not authenticated, they are redirected to the login page.
 * @returns {void}
 */
function checkAuth() {
  const user = JSON.parse(localStorage.getItem("joinUser"));

  if (!user) {
    window.location.href = "../index.html";
  }
}
