const BASE_URL = database_url;

let contacts = [];
let tasks = [];
let users = [];

const BASE_URL = firebaseConfig.databaseURL;

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
 * Loads data from the specified path and returns the raw response object.
 * @param {string} path - The database path (e.g., "contacts" or "tasks").
 * @returns {Promise<Object|null>} The fetched object or null if an error occurs.
 */
async function getData(path) {
  try {
    const response = await fetchData(path);
    return response;
  } catch (error) {
    console.error(`Error getting data from ${path}:`, error);
    return null;
  }
}

/**
 * Loads contacts from Firebase and stores them in the global contacts array.
 * @returns {Promise<void>} Resolves when contacts have been loaded and mapped.
 */
async function getContacts() {
  const contactsResponse = await getData("contacts");
  if (contactsResponse) {
    contacts = Object.keys(contactsResponse).map((key) => ({
      id: key,
      badgeColor: contactsResponse[key].badgeColor,
      email: contactsResponse[key].email,
      firstName: contactsResponse[key].firstName,
      lastName: contactsResponse[key].lastName,
      phone: contactsResponse[key].phone,
    }));
  }
}

/**
 * Loads tasks from Firebase and stores them in the global tasks array.
 * @returns {Promise<void>} Resolves when tasks have been loaded and mapped.
 */
async function getTasks() {
  const tasksResponse = await getData("tasks");
  if (tasksResponse) {
    tasks = Object.keys(tasksResponse).map((key) => ({
      id: key,
      assigned_to: tasksResponse[key].assigned_to,
      author_id: tasksResponse[key].author_id,
      category: tasksResponse[key].category,
      created_at: tasksResponse[key].created_at,
      description: tasksResponse[key].description,
      due_date: tasksResponse[key].due_date,
      priority: tasksResponse[key].priority,
      status: tasksResponse[key].status,
      subtasks: tasksResponse[key].subtasks,
      title: tasksResponse[key].title,
    }));
  }
}

/**
 * Updates data in the Firebase database using a PATCH request.
 * @param {string} path - The path to the resource to be updated.
 * @param {string} id - The ID of the resource to update.
 * @param {Object} data - The partial data to be patched.
 * @returns {Promise<Object>} The server response as a JSON object.
 * @throws {Error} Throws an error if the update fails.
 */
async function updateData(path, id, data) {
  try {
    const response = await fetch(BASE_URL + path + "/" + id + ".json", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
 * @param {string} path - The URL path for the POST request.
 * @param {Object} data - The data to be sent.
 * @returns {Promise<Object>} The server response as a JSON object.
 * @throws {Error} Throws an error if HTTP errors occur.
 */
async function postData(path, data) {
  try {
    const response = await fetch(BASE_URL + path + ".json", {
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

/**
 * Deletes data from the Firebase database using a DELETE request.
 * @param {string} path - The path to the resource to be deleted.
 * @param {*} id - The ID of the resource to be deleted.
 * @returns {Promise<boolean|null>} True if the deletion was successful, null otherwise.
 */
async function deleteData(path, id) {
  try {
    const response = await fetch(BASE_URL + path + "/" + id + ".json", {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Delete failed! Status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting ${path}:`, error);
    return null;
  }
}

/**
 * Posts an array of objects and omits `id` in the Firebase payload.
 * @param {string} url - The URL path for the POST request.
 * @param {Array<Object>} data - Array of objects to be posted.
 * @returns {Promise<Array<Object>>} The original array after posting each item.
 */
async function postarrayData(url, data) {
  if (!Array.isArray(data)) return [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (!item || typeof item !== "object") continue;

    const { id, ...payloadWithoutId } = item;
    await postData(url, payloadWithoutId);
  }

  return data;
}
