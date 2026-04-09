/**
 * Opens the dialog for adding a new contact by setting up the dialog elements and event listeners.
 * @returns {void}
 */
function openAddNewContact() {
  DOM.headlineEl.innerHTML = addContactHeadlineTemplate();
  DOM.noButtonEl.innerHTML = `Cancel&nbsp;${cancelIcon()}`;
  DOM.noButtonEl.onclick = cancelAddContact;
  DOM.noButtonEl.classList.add("cancel-button");
  DOM.okButtonEl.innerHTML = `Create contact&nbsp;${checkIcon()}`;
  DOM.personImageEl.innerHTML = contactBadgeDummyTemplate();
  DOM.okButtonEl.onclick = () => addContact();
  openDialog();
}

/**
 * Opens the dialog for editing an existing contact by setting up the dialog elements and event listeners.
 * @param {number} firebaseKey - The index of the contact to edit.
 * @returns {void}
 */
function openEditContact(firebaseKey) {
  const contact = findContact(firebaseKey);
  if (!contact) return;
  clearInputs();
  DOM.headlineEl.innerHTML = editContactHeadlineTemplate();
  DOM.noButtonEl.innerHTML = "Delete";
  DOM.noButtonEl.onclick = () => deleteContact(firebaseKey);
  DOM.okButtonEl.innerHTML = `Save&nbsp;${checkIcon()}`;
  DOM.okButtonEl.onclick = () => saveEditedContact(firebaseKey);
  DOM.personImageEl.innerHTML = contactBadgeTemplate(contact);
  DOM.contactNameEl.value = contact.firstName + " " + contact.lastName;
  DOM.contactEmailEl.value = contact.email;
  DOM.contactPhoneEl.value = contact.phone;
  openDialog();
}

/**
 * Cancels the add contact operation by clearing the input fields and closing the dialog. This function is called when the user clicks the cancel button in the add contact dialog.
 * @returns {void}
 */
function cancelAddContact() {
  clearInputs();
  closeDialog();
}

/**
 * Clears the input fields and warning messages in the contact form. This function is called after adding a new contact or when canceling the add/edit contact operation to reset the form to its initial state.
 * @returns {void}
 */
function clearInputs() {
  DOM.contactNameEl.value = "";
  DOM.warningMessageNameEl.innerHTML = "";
  DOM.contactEmailEl.value = "";
  DOM.warningMessageEmailEl.innerHTML = "";
  DOM.contactPhoneEl.value = "";
  DOM.warningMessagePhoneEl.innerHTML = "";
}

/**
 * Opens the dialog for adding or editing a contact by displaying the dialog element. This function is called when the user clicks the button to add a new contact or edit an existing contact.
 * @returns {void}
 */
function openDialog() {
  DOM.dialogEl.showModal();
}

/**
 * Closes the dialog for adding or editing a contact by hiding the dialog element, clearing the input fields, and resetting the state of the cancel button. This function is called when the user clicks outside the dialog or clicks the close button in the dialog.
 * @returns {void}
 */
function closeDialog() {
  DOM.dialogEl.close();
  clearInputs();
  DOM.noButtonEl.classList.remove("cancel-button");
}
