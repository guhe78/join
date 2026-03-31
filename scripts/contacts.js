const DOM = {
  contactsListEl: document.getElementById("contacts-list"),
  dialogEl: document.getElementById("dialog"),
  headlineEl: document.getElementById("dialog-headline"),
  noButtonEl: document.getElementById("no-button"),
  okButtonEl: document.getElementById("ok-button"),
  badgeColorEl: document.getElementById("contact-badge"),
  contactMainEl: document.getElementById("contact-main"),
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
  userButtonEl: document.getElementById("profile-button"),
  screenDesktopEl: document.getElementById("screen-desktop"),
  fullscreenMobileEl: document.getElementById("fullscreen-mobile"),
  mobileContactMenuButtonEl: document.getElementById(
    "mobile-contact-menu-button",
  ),
  mobileMenuEl: document.getElementById("mobile-menu"),
};

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
DOM.contactNameEl.addEventListener("input", () => {
  DOM.warningMessageNameEl.innerHTML = "";
});

DOM.contactEmailEl.addEventListener("input", () => {
  DOM.warningMessageEmailEl.innerHTML = "";
});

DOM.contactPhoneEl.addEventListener("input", () => {
  DOM.warningMessagePhoneEl.innerHTML = "";
});

async function init() {
  checkAuth();
  await getContacts();
  renderContactsList();
  renderContactMain();

  DOM.userButtonEl.innerHTML = getUserData().initials;
  DOM.closeButtonEl.onclick = closeDialog;
  DOM.closeButtonEl.innerHTML = closeIcon();
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

function renderContactMain() {
  DOM.contactMainEl.innerHTML = contactMainTemplate();
  DOM.contactOverviewEl = document.getElementById("contact-overview");
}

function renderContact(index) {
  DOM.contactOverviewEl.innerHTML = contactDetailTemplate(index);
  DOM.contactOverviewEl.classList.add("fade-in");
  renderContactMobile(index);
}

function renderContactMobile(index) {
  DOM.fullscreenMobileEl.innerHTML =
    contactMainTemplate() +
    contactMobileButton(index) +
    contactCloseDetailViewButton();

  DOM.mobileMenuEl = document.getElementById("mobile-menu");
  const closeButton = document.getElementById("close-contact-detail");
  closeButton.onclick = (event) => {
    event.stopPropagation();
    closeContactDetailView();
  };
  const mobileContactMenuButtonEl = document.getElementById(
    "mobile-contact-menu-button",
  );
  mobileContactMenuButtonEl.onclick = (event) => {
    event.stopPropagation();
    openMobileContactMenu();
  };

  DOM.screenDesktopEl.classList.add("hide-mobile");

  const mobileOverviewEl =
    DOM.fullscreenMobileEl.querySelector("#contact-overview");

  mobileOverviewEl.innerHTML = contactDetailTemplate(index);
  mobileOverviewEl.classList.add("fade-in");

  DOM.contactsListEl.classList.add("hide-mobile");
  DOM.fullscreenMobileEl.classList.remove("hide-mobile");
}

function openMobileContactMenu() {
  const menu = document.getElementById("mobile-menu");
  const button = document.querySelector(".mobile-button-container");

  if (!menu) return;

  const isOpen = menu.classList.toggle("fade-in");

  if (isOpen) {
    button.style.display = "none";
    document.addEventListener("click", handleOutsideClick);
  }
}

function handleOutsideClick(event) {
  const menu = document.getElementById("mobile-menu");
  const button = document.querySelector(".mobile-button-container");

  if (!menu.contains(event.target)) {
    menu.classList.remove("fade-in");
    button.style.display = "flex";

    document.removeEventListener("click", handleOutsideClick);
  }
}

function renderToastMessage(type) {
  const toastMessageEl = document.getElementById("toast-message");
  const toastSectionEl = document.getElementById("toast-section");

  if (!toastMessageEl || !toastSectionEl) return;

  toastMessageEl.innerHTML = `Contact succesfully ${type}`;
  toastSectionEl.classList.add("fade-in");

  setTimeout(() => {
    toastSectionEl.classList.remove("fade-in");
  }, 2000);
}

function toggleActiveContact(index) {
  const currentActiveElement = document.querySelector(".active-contact");
  const newActiveElement = document.getElementById("contact" + index);
  const isMobile = window.innerWidth <= 850;
  if (DOM.contactOverviewEl) {
    DOM.contactOverviewEl.classList.remove("fade-in");
  }
  if (isMobile) {
    if (currentActiveElement) {
      currentActiveElement.classList.remove("active-contact");
    }
    newActiveElement.classList.add("active-contact");
    renderContact(index);
    return;
  }
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
  DOM.noButtonEl.classList.add("cancel-button");
  DOM.okButtonEl.innerHTML = `Create contact&nbsp;${checkIcon()}`;
  DOM.personImageEl.innerHTML = contactBadgeDummyTemplate();
  DOM.okButtonEl.onclick = () => addContact();
  openDialog();
}

function validateForm() {
  let isValid = true;

  const name = DOM.contactNameEl.value.trim();
  const email = DOM.contactEmailEl.value.trim();
  const phone = DOM.contactPhoneEl.value.trim();

  if (!name) {
    DOM.warningMessageNameEl.innerHTML = "This field is required";
    isValid = false;
  } else if (!checkName(name)) {
    DOM.warningMessageNameEl.innerHTML = "Firstname and Lastname required";
    isValid = false;
  } else {
    DOM.warningMessageNameEl.innerHTML = "";
  }

  if (!email) {
    DOM.warningMessageEmailEl.innerHTML = "This field is required";
    isValid = false;
  } else if (!checkEmail(email)) {
    DOM.warningMessageEmailEl.innerHTML = "Correct Email required";
    isValid = false;
  } else {
    DOM.warningMessageEmailEl.innerHTML = "";
  }

  if (!phone) {
    DOM.warningMessagePhoneEl.innerHTML = "This field is required";
    isValid = false;
  } else if (!checkPhone(phone)) {
    DOM.warningMessagePhoneEl.innerHTML = "Phone number required";
    isValid = false;
  } else {
    DOM.warningMessagePhoneEl.innerHTML = "";
  }

  return isValid;
}

async function addContact() {
  let name = DOM.contactNameEl.value.trim();
  let email = DOM.contactEmailEl.value.trim();
  let phone = DOM.contactPhoneEl.value.trim();
  if (!validateForm()) return;
  let nameArray = name.split(/\s+/);
  if (nameArray.length < 2) return;
  let firstName = nameArray[0];
  let lastName = nameArray[nameArray.length - 1];
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
  DOM.okButtonEl.innerHTML = `Save&nbsp;${checkIcon()}`;
  DOM.okButtonEl.onclick = () => saveEditedContact(index);
  DOM.personImageEl.innerHTML = contactBadgeTemplate(index);
  DOM.contactNameEl.value =
    contacts[index].firstName + " " + contacts[index].lastName;
  DOM.contactEmailEl.value = contacts[index].email;
  DOM.contactPhoneEl.value = contacts[index].phone;
  openDialog();
}

async function saveEditedContact(index) {
  if (!validateForm()) return;
  const contactName = splitName(DOM.contactNameEl.value);
  const contact = contacts[index];
  contact.firstName = contactName.firstName;
  contact.lastName = contactName.lastName;
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

function closeContactDetailView() {
  DOM.fullscreenMobileEl.classList.add("hide-mobile");
  DOM.contactsListEl.classList.remove("hide-mobile");
  DOM.screenDesktopEl.classList.remove("hide-mobile");
  DOM.fullscreenMobileEl.innerHTML = "";
}

function splitName(name) {
  let nameArray = name.trim().split(/\s+/);

  if (nameArray.length < 2) return null;

  return {
    firstName: nameArray[0],
    lastName: nameArray.slice(1).join(" "),
  };
}

function checkName(input) {
  return input.trim().split(/\s+/).length > 1;
}

function checkEmail(input) {
  const pattern =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return pattern.test(input);
}

function checkPhone(input) {
  return /^[0-9+\-\s()]+$/.test(input);
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
  DOM.noButtonEl.classList.remove("cancel-button");
}

function getRandom(max) {
  return Math.floor(Math.random() * max);
}

function getRandomColor() {
  return DEFAULT_BADGE_COLORS[getRandom(DEFAULT_BADGE_COLORS.length)];
}
