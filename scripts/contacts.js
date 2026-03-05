const contactsList = document.getElementById("contacts-list");
let contacts = [];

async function init() {
  await fetchContacts();
  renderContactsList();
}

async function fetchContacts() {
  const response = await fetch("../scripts/contacts.json");
  contacts = await response.json();
}

function renderContactsList() {
  contactsList.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    contactsList.innerHTML += contactTemplate(i);
  }
}

function contactTemplate(index) {
  const contact = contacts[index];
  return `
        <div class="contact">
        <div class="contact-badge">${contact.firstName[0].toUpperCase()}${contact.lastName[0].toUpperCase()}</div>
          <div class="contact-data">
            <p class="name">${contact.firstName} ${contact.lastName}</p>
            <p class="email">${contact.email}</p>
          </div>
        </div>
    `;
}
