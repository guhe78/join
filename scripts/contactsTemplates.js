function contactTemplate(index) {
  const contact = state.contacts[index];
  return `
        <div class="contact" id="contact${index}" onclick="toggleActiveContact(${index})" >
          <div class="contact-badge" style="background-color: ${contact.badgeColor}">${contact.firstName[0].toUpperCase()}${contact.lastName[0].toUpperCase()}</div>
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

function addContactHeadlineTemplate() {
  return ` 
        <h1>Add contact</h1>
        <p>Tasks are better with a team!</p>
        <div class="contact-dialog-seperator"></div>
    `;
}

function editContactHeadlineTemplate() {
  return ` 
        <h1>Edit contact</h1>
    `;
}

function contactDetailTemplate(index) {
  return `
    <div class="contact-detail-view">
      <div class="contact-detail-header">
        <div class="badge">${contactBadgeTemplate(index)}</div>
        <div class="contact-detail-headline">
          <h2 class="name">${state.contacts[index].firstName} ${state.contacts[index].lastName}</h2>
          <div class="contact-detail-buttons">
            <button onclick="openEditContact(${index})">
              ${editIcon()}<span>Edit</span>
            </button>
            <button onclick="deleteContact(${index})">${deleteIcon()}<span>Delete</span></button>
          </div>
        </div>
      </div>
        <p class="font-size-20">Contact Information</p>
        <div class="contact-detail-data">
          <p class="bold">Email</p>
          <p class="email">${state.contacts[index].email}</p>
          <p class="bold">Phone</p>
          <p>${state.contacts[index].phone}</p>
        </div>
    </div>
  `;
}

function contactBadgeTemplate(index) {
  return `
  <div class="contact-detail-badge" style="background-color: ${state.contacts[index].badgeColor}">${state.contacts[index].firstName[0].toUpperCase()}${state.contacts[index].lastName[0].toUpperCase()}</div>
`;
}

function contactBadgeDummyTemplate() {
  return `
    <div class="person-img-container">
      <img src="../assets/imgs/person.svg" alt="" />
    </div>
  `;
}
