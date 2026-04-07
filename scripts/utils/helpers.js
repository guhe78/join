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
  } else if (data.isGuest === true) {
    return { initials: "G", name: "Guest" };
  } else {
    return { initials: "", name: "" };
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

/**
 * Generates a random integer between 0 (inclusive) and the specified maximum (exclusive).
 * @param {number} max - The maximum value (exclusive) for the random integer.
 * @returns {number} - A random integer between 0 and max - 1.
 */
function getRandom(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Generates a random color from the default badge colors.
 * @returns {string} - A random color from the default badge colors.
 */
function getRandomColor() {
  return DEFAULT_BADGE_COLORS[getRandom(DEFAULT_BADGE_COLORS.length)];
}

/**
 * Splits a full name into first name and last name by trimming the input, splitting it by whitespace, and returning an object containing the first name and last name. If the input does not contain at least two parts, it returns null.
 * @param {string} name - The full name to split.
 * @returns {Object|null} - An object containing the first name and last name, or null if the input is invalid.
 */
function splitName(name) {
  let nameArray = name.trim().split(/\s+/);

  if (nameArray.length < 2) return null;

  return {
    firstName: nameArray[0],
    lastName: nameArray.slice(1).join(" "),
  };
}

function setActiveLink() {
  const links = document.querySelectorAll(".page-link-button");
  const currentPage = window.location.pathname.split("/").pop();

  links.forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
}

setActiveLink();
