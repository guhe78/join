const contactsList = document.getElementById("contacts-list");
let contacts = [];
let letterBefore = "Z";

async function init() {
  await fetchContacts();
  renderContactsList();
}

async function fetchContacts() {
  const response = await fetch("../scripts/contacts.json");
  contacts = await response.json();

  contacts.sort((a, b) => a.firstName.localeCompare(b.firstName, "de"));
}

function renderContactsList() {
  contactsList.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let letter = contact.firstName[0].toUpperCase();
    console.log(letter);
    if (letterBefore != letter) {
      letterBefore = letter;
      console.log("letterBefore: " + letterBefore);
      contactsList.innerHTML += contactLetterTemplate(letter);
    }
    contactsList.innerHTML += contactTemplate(i);
  }
}

function contactTemplate(index) {
  const contact = contacts[index];

  return `
        <div class="contact" onclick="toggleActiveContact(event)">
          <div class="contact-badge">${contact.firstName[0].toUpperCase()}${contact.lastName[0].toUpperCase()}</div>
          <div class="contact-data">
            <p class="name">${contact.firstName} ${contact.lastName}</p>
            <p class="email">${contact.email}</p>
          </div>
        </div>
    `;
}

function contactLetterTemplate(letter) {
  return `
    <div class="contact-letter">${letter}</div>
    <div class="contact-seperator"></div>
  `;
}

function toggleActiveContact(event) {
  const activeElement = document.querySelector(".active-contact");
  if (activeElement) {
    activeElement.classList.remove("active-contact");
  }

  if (activeElement === event.currentTarget) {
    event.currentTarget.classList.remove("active-contact");
  } else {
    event.currentTarget.classList.add("active-contact");
  }
}

function addNewContact() {}
