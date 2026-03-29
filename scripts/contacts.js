const DOM = {
  contactsListEl: document.getElementById("contacts-list"),
  dialogEl: document.getElementById("dialog"),
  headlineEl: document.getElementById("dialog-headline"),
  noButtonEl: document.getElementById("no-button"),
  okButtonEl: document.getElementById("ok-button"),
  badgeColorEl: document.getElementById("contact-badge"),
  contactOverviewEl: document.getElementById("contact-overview"),
  contactNameEl: document.getElementById("contact-name-input"),
  contactEmailEl: document.getElementById("contact-email-input"),
  contactPhoneEl: document.getElementById("contact-phone-input"),
  closeButtonEl: document.getElementById("close-button"),
  personImageEl: document.getElementById("person-image"),
  toastSectionEl: document.getElementById("toast-section"),
  toastMessageEl: document.getElementById("toast-message"),
  warningMessageNameEl: document.getElementById("warning-name"),
  warningMessageEmailEl: document.getElementById("warning-email"),
  warningMessagePhoneEl: document.getElementById("warning-phone"),
  userButton: document.getElementById("user-button"),
};

const CONTACTS_URL = "../scripts/contacts.json";
const DEFAULT_BADGE_COLORS = [
  "#ff7a00",
  "#9327ff",
  "#6e52ff",
  "#fc71ff",
  "#1fd7c1",
  "#ff5eb3",
  "#00bee8",
  "#ff745e",
  "#ffc701",
  "#0038ff",
  "#c3ff2b",
  "#ffe62b",
  "#ff4646",
  "#ffbb2b",
  "#ffa35e",
];

DOM.dialogEl.onclick = (event) => {
  if (event.target === DOM.dialogEl) {
    closeDialog();
  }
};

DOM.closeButtonEl.onclick = closeDialog;

async function init() {
  await getContacts();
  renderContactsList();
  DOM.userButton.innerHTML = getUserData();
}

async function getContacts() {
  let data = await fetchData("contacts");
  makeArray(data);
}

function renderContactsList() {
  contacts.sort((a, b) => a.firstName.localeCompare(b.firstName, "de"));
  DOM.contactsListEl.innerHTML = "";
  let lastLetter = "";
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let letter = contact.firstName[0].toUpperCase();
    if (lastLetter != letter) {
      lastLetter = letter;
      DOM.contactsListEl.innerHTML += contactLetterTemplate(letter);
    }
    DOM.contactsListEl.innerHTML += contactTemplate(i);
  }
}

function renderContact(index) {
  DOM.contactOverviewEl.innerHTML = contactDetailTemplate(index);
  DOM.contactOverviewEl.classList.add("fade-in");
}

function renderToastMessage(type) {
  DOM.toastMessageEl.innerHTML = `Contact succesfully ${type}`;
  DOM.toastSectionEl.classList.add("fade-in");
  setTimeout(() => {
    DOM.toastSectionEl.classList.remove("fade-in");
  }, 2000);
}

function toggleActiveContact(index) {
  const currentActiveElement = document.querySelector(".active-contact");
  const newActiveElement = document.getElementById("contact" + index);
  DOM.contactOverviewEl.classList.remove("fade-in");
  if (currentActiveElement) {
    currentActiveElement.classList.remove("active-contact");
    DOM.contactOverviewEl.innerHTML = "";
  }
  if (currentActiveElement === newActiveElement) {
    newActiveElement.classList.remove("active-contact");
  } else {
    newActiveElement.classList.add("active-contact");
    renderContact(index);
  }
}

function openAddNewContact() {
  DOM.headlineEl.innerHTML = addContactHeadlineTemplate();
  DOM.noButtonEl.innerHTML = `Cancel&nbsp;${cancelIcon()}`;
  DOM.noButtonEl.onclick = cancelAddContact;
  DOM.okButtonEl.innerHTML = `Add contact&nbsp;${checkIcon()}`;
  DOM.personImageEl.innerHTML = contactBadgeDummyTemplate();
  DOM.okButtonEl.onclick = () => addContact();
  openDialog();
}

function checkInputFields() {
  let returnValue = true;
  let errorMessage = "This field is required";
  if (!DOM.contactNameEl.value) {
    DOM.warningMessageNameEl.innerHTML = errorMessage;
    returnValue = false;
  }
  if (!DOM.contactEmailEl.value) {
    DOM.warningMessageEmailEl.innerHTML = errorMessage;
    returnValue = false;
  }
  if (!DOM.contactPhoneEl.value) {
    DOM.warningMessagePhoneEl.innerHTML = errorMessage;
    returnValue = false;
  }
  return returnValue;
}

function validateInput() {
  if (!checkName(DOM.contactNameEl.value)) {
    DOM.warningMessageNameEl.innerHTML = "Firstname and Lastname required";
    return false;
  } else {
    DOM.warningMessageNameEl.innerHTML = "";
  }
  if (!checkEmail(DOM.contactEmailEl.value)) {
    DOM.warningMessageEmailEl.innerHTML = "Correct Email required";
    return false;
  } else {
    DOM.warningMessageEmailEl.innerHTML = "";
  }
  if (!checkPhone(DOM.contactPhoneEl.value)) {
    DOM.warningMessagePhoneEl.innerHTML = "Phone number required";
    return false;
  } else {
    DOM.warningMessagePhoneEl.innerHTML = "";
  }
  return true;
}

async function addContact() {
  let name = DOM.contactNameEl.value.trim();
  let email = DOM.contactEmailEl.value.trim();
  let phone = DOM.contactPhoneEl.value.trim();
  if (!checkInputFields()) return;
  if (!validateInput()) return;
  let nameArray = name.split(" ");
  let firstName = nameArray.at(0);
  let lastName = nameArray.at(-1);
  let newContact = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    badgeColor: getRandomColor(),
  };
  const result = await postData("contacts", newContact);
  newContact.firebaseKey = result.name;
  contacts.push(newContact);
  renderContactsList();
  renderContact(findContactIndex(newContact.firebaseKey));
  clearInputs();
  closeDialog();
  renderToastMessage("created");
}

function openEditContact(index) {
  clearInputs();
  DOM.headlineEl.innerHTML = editContactHeadlineTemplate();
  DOM.noButtonEl.innerHTML = "Delete";
  DOM.noButtonEl.onclick = () => deleteContact(index);
  DOM.okButtonEl.innerHTML = "Save";
  DOM.okButtonEl.onclick = () => saveEditedContact(index);
  DOM.personImageEl.innerHTML = contactBadgeTemplate(index);
  DOM.contactNameEl.value =
    contacts[index].firstName + " " + contacts[index].lastName;
  DOM.contactEmailEl.value = contacts[index].email;
  DOM.contactPhoneEl.value = contacts[index].phone;
  openDialog();
}

async function saveEditedContact(index) {
  const contactNameArray = DOM.contactNameEl.value.split(" ");
  checkInputFields();
  const contact = contacts[index];
  contact.firstName = contactNameArray.at(0);
  contact.lastName = contactNameArray.at(-1);
  contact.email = DOM.contactEmailEl.value;
  contact.phone = DOM.contactPhoneEl.value;
  const firebaseKey = contact.firebaseKey;
  await updateContact(contact);
  renderContactsList();
  renderContact(findContactIndex(firebaseKey));
  closeDialog();
  renderToastMessage("edited");
}

async function deleteContact(index) {
  const contact = contacts[index];
  await deleteData("contacts", contact.firebaseKey);
  contacts.splice(findContactIndex(contact.firebaseKey), 1);
  DOM.contactOverviewEl.innerHTML = "";
  DOM.contactOverviewEl.classList.remove("fade-in");
  renderContactsList();
  closeDialog();
  renderToastMessage("deleted");
}

async function updateContact(contact) {
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

function checkName(input) {
  let check = input.split(" ");
  return check.length > 1;
}

function checkEmail(input) {
  const pattern =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return pattern.test(input);
}

function checkPhone(input) {
  return input.length > 0;
}

function cancelAddContact() {
  clearInputs();
  closeDialog();
}

function clearInputs() {
  DOM.contactNameEl.value = "";
  DOM.warningMessageNameEl.innerHTML = "";
  DOM.contactEmailEl.value = "";
  DOM.warningMessageEmailEl.innerHTML = "";
  DOM.contactPhoneEl.value = "";
  DOM.warningMessagePhoneEl.innerHTML = "";
}

function findContactIndex(firebaseKey) {
  let index = contacts.findIndex(
    (contact) => contact.firebaseKey === firebaseKey,
  );
  return index;
}

function openDialog() {
  DOM.dialogEl.showModal();
}

function closeDialog() {
  DOM.dialogEl.close();
  clearInputs();
}

function getRandom(max) {
  return Math.floor(Math.random() * max);
}

function getRandomColor() {
  return DEFAULT_BADGE_COLORS[getRandom(DEFAULT_BADGE_COLORS.length)];
}

function getUserData() {
  const userData = localStorage.getItem("joinUser");

  if (userData) {
    const data = JSON.parse(userData);
    return data.firstName[0].toUpperCase() + data.lastName[0].toUpperCase();
  } else {
    return "G";
  }
}
