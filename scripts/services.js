let contacts = [];

let tasks = [];

let users = [];

const BASE_URL =
  "https://join-ce6f3-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Fetches data from the Firebase database using the specified path.
 * @param {string} path - The path to the desired resource in the database.
 * @returns {Promise<Object|null>} The fetched data or null if an error occurs.
 */
async function fetchData(path) {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    let data = await response.json();
    if (!response.ok) throw new Error("Failed to fetch data");
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

/**
 * Loads data from the specified path and converts it to an array.
 * @param {string} path - The database path (e.g., "contacts" or "tasks").
 * @returns {Promise<Array|null>} An array containing the data or null if an error occurs.
 */
async function getData(path) {
  try {
    const response = await fetchData(path);
    return response
      ? Object.values(response).filter((item) => item !== null)
      : console.error(`Failed to load ${path}`);
  } catch (error) {
    console.error(`Error getting data from ${path}:`, error);
    return null;
  }
}

/**
 * Updates data in the Firebase database using a PUT request.
 * @param {string} path - The path to the resource to be updated.
 * @param {Array|Object} updatedArray - The new data to be saved.
 * @returns {Promise<Object>} The server response as a JSON object.
 * @throws {Error} Throws an error if the update fails.
 */
async function updateData(path, updatedArray) {
  try {
    const response = await fetch(BASE_URL + path + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedArray),
    });
    if (!response.ok) {
      throw new Error(`Update failed! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Sends new data to the Firebase database using a POST request.
 * @param {string} url - The URL path for the POST request.
 * @param {Object} data - The data to be sent.
 * @returns {Promise<Object>} The server response as a JSON object.
 * @throws {Error} Throws an error if HTTP errors occur.
 */
async function postData(url, data) {
  try {
    const response = await fetch(BASE_URL + url + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
