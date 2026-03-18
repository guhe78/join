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
};

const state = {
  contacts: [],
  letterBefore: "",
};

const CONTACTS_URL = "../scripts/contacts.json";
const DEFAULT_BADGE_COLORS = [
  "#ff7a00",
  "#9327ff",
  "#6e52ff",
  "#fc71ff",
  "#ffbb2b",
  "#1fd7c1",
  "#462f8a",
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
}

async function getContacts() {
  let data = await fetchData("contacts");
  makeArray(data);
}

function renderContactsList() {
  state.contacts.sort((a, b) => a.firstName.localeCompare(b.firstName, "de"));
  DOM.contactsListEl.innerHTML = "";
  for (let i = 0; i < state.contacts.length; i++) {
    let contact = state.contacts[i];
    let letter = contact.firstName[0].toUpperCase();
    if (state.letterBefore != letter) {
      state.letterBefore = letter;
      DOM.contactsListEl.innerHTML += contactLetterTemplate(letter);
    }
    DOM.contactsListEl.innerHTML += contactTemplate(i);
  }
}

function renderContact(index) {
  DOM.contactOverviewEl.innerHTML = contactDetailTemplate(index);
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
    DOM.contactOverviewEl.classList.add("fade-in");
    renderContact(index);
  }
}

function openAddNewContact() {
  DOM.headlineEl.innerHTML = addContactHeadlineTemplate();
  DOM.noButtonEl.innerHTML = `Cancel&nbsp;${cancelIcon()}`;
  DOM.noButtonEl.onclick = cancelAddContact;
  DOM.okButtonEl.innerHTML = `Add contact&nbsp;${checkIcon()}`;
  DOM.personImageEl.innerHTML = contactBadgeDummyTemplate();
  DOM.okButtonEl.onclick = () =>
    addContact(
      DOM.contactNameEl.value,
      DOM.contactEmailEl.value,
      DOM.contactPhoneEl.value,
    );
  openDialog();
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
    state.contacts[index].firstName + " " + state.contacts[index].lastName;
  DOM.contactEmailEl.value = state.contacts[index].email;
  DOM.contactPhoneEl.value = state.contacts[index].phone;
  openDialog();
}

function saveEditedContact(index) {
  const contactNameArray = DOM.contactNameEl.value.split(" ");
  const contact = state.contacts[index];
  contact.firstName = contactNameArray[0];
  contact.lastName = contactNameArray[1];
  contact.email = DOM.contactEmailEl.value;
  contact.phone = DOM.contactPhoneEl.value;
  updateContact(contact);
  renderContactsList();
  renderContact(index);
  closeDialog();
}

function addContact(name, email, phone) {
  let nameParts = name.split(" ");
  let newContact = {
    firstName: nameParts[0],
    lastName: nameParts[nameParts.length - 1],
    email: email,
    phone: phone,
    badgeColor: getRandomColor(),
  };
  postData("contacts", newContact);
  state.contacts.push(newContact);
  clearInputs();
  renderContactsList();
  closeDialog();
}

function deleteContact(index) {
  deleteData("contacts", state.contacts[index].id);
  state.contacts.splice(index, 1);
  DOM.contactOverviewEl.innerHTML = "";
  renderContactsList();
  closeDialog();
}

async function updateContact(contact) {
  let updatedContact = {
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
  };
  updateData("contacts", contact.id, updatedContact);
}

function cancelAddContact() {
  clearInputs();
  closeDialog();
}

function clearInputs() {
  DOM.contactNameEl.value = "";
  DOM.contactEmailEl.value = "";
  DOM.contactPhoneEl.value = "";
  DOM.personImageEl.innerHTML = "";
}

function makeArray(data) {
  state.contacts = Object.entries(data).map(([id, value]) => ({
    id,
    ...value,
  }));
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
