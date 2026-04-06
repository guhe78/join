/**
 * Adds a new contact by collecting the input values from the form, validating the form, creating a new contact object, sending it to the backend, and updating the contacts list and overview. It also provides feedback to the user through a toast message and closes the dialog after the operation is completed.
 * @returns {Promise<void>}
 */
async function addContact() {
  let name = DOM.contactNameEl.value.trim();
  let email = DOM.contactEmailEl.value.trim();
  let phone = DOM.contactPhoneEl.value.trim();
  if (!validateForm()) return;
  const contactName = splitName(name);
  if (!contactName) return;
  let newContact = {
    firstName: contactName.firstName,
    lastName: contactName.lastName,
    email: email,
    phone: phone,
    badgeColor: getRandomColor(),
  };
  let result;
  try {
    result = await postData("contacts", newContact);
  } catch (error) {
    console.error("Error adding contact:", error);
    return;
  }
  newContact.firebaseKey = result.name;
  contacts.push(newContact);
  renderContactsList();
  renderContact(newContact.firebaseKey);
  clearInputs();
  closeDialog();
  renderToastMessage("created");
}

/**
 * Updates a contact by sending the updated contact data to the backend. It takes a contact object as a parameter and updates the corresponding contact in the backend using its firebaseKey.
 * @param {Object} contact - The contact object containing the updated contact information.
 * @returns {Promise<void>}
 */
async function updateContact(firebaseKey) {
  const contact = findContact(firebaseKey);
  const firstName = contact.firstName;
  const lastName = contact.lastName;
  const email = contact.email;
  const phone = contact.phone;
  if (!firstName || !lastName || !email || !phone) {
    return false;
  }
  let updatedContact = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
  };
  await updateData("contacts", contact.firebaseKey, updatedContact);
}

/**
 * Deletes a contact by removing it from the backend and updating the contacts list and overview. It also provides feedback to the user through a toast message and closes the dialog after the operation is completed.
 * @param {number} firebaseKey - The firebaseKey of the contact to delete.
 * @returns {Promise<void>}
 */
async function deleteContact(firebaseKey) {
  const contact = findContact(firebaseKey);
  try {
    await deleteData("contacts", contact.firebaseKey);
  } catch (error) {
    console.error("Error deleting contact:", error);
    return;
  }
  contacts.splice(findContactIndex(contact.firebaseKey), 1);
  DOM.contactOverviewEl.innerHTML = "";
  DOM.contactOverviewEl.classList.remove("fade-in");
  renderContactsList();
  closeDialog();
  closeContactDetailView();
  renderToastMessage("deleted");
}

/** Finds a contact by its firebaseKey by searching through the contacts array and returning the contact object that matches the provided firebaseKey. If no contact is found, it returns undefined.
 * @param {string} firebaseKey - The firebaseKey of the contact to find.
 * @returns {Object|undefined} - The contact object that matches the firebaseKey, or undefined if no contact is found.
 */
function findContact(firebaseKey) {
  return contacts.find((contact) => contact.firebaseKey === firebaseKey);
}

/** Finds the index of a contact in the contacts array by its firebaseKey. It searches through the contacts array and returns the index of the contact that matches the provided firebaseKey. If no contact is found, it returns -1.
 * @param {string} firebaseKey - The firebaseKey of the contact to find.
 * @returns {number} - The index of the contact that matches the firebaseKey, or -1 if no contact is found.
 */
function findContactIndex(firebaseKey) {
  return contacts.findIndex((contact) => contact.firebaseKey === firebaseKey);
}
