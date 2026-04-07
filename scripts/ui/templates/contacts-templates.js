function contactTemplate(contact) {
  return `
    <div class="contact" id="contact${contact.firebaseKey}" 
        onclick="toggleActiveContact('${contact.firebaseKey}')" tabindex="0">
      <div class="contact-badge" style="background-color: ${contact.badgeColor}">
        ${contact.firstName[0].toUpperCase()}${contact.lastName[0].toUpperCase()}
      </div>
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

function contactDetailTemplate(contact) {
  return `
    <div class="contact-detail-view">
      <div class="contact-detail-header">
        ${contactBadgeTemplate(contact)}
        <div class="contact-detail-headline">
          <h2 class="name">${contact.firstName} ${contact.lastName}</h2>
          <div class="contact-detail-buttons" id="contact-detail-buttons">
            ${contactButtons(contact)}
          </div>
        </div>
      </div>
      <p class="font-size-20">Contact Information</p>
      <div class="contact-detail-data">
        <p class="bold">Email</p>
        <a href="mailto:${contact.email}" class="email">${contact.email}</a>
        <p class="bold">Phone</p>
        <p>${contact.phone}</p>
      </div>
    </div>
  `;
}

function contactMobileButton(contact) {
  return `
    <div class="mobile-contact-menu">
      <div class="mobile-button-container" id="mobile-contact-menu-button">${moreVerticalIcon()}</div>
      <div class="mobile-menu" id="mobile-menu">${contactButtons(contact)}</div>
    </div>
  `;
}

function contactCloseDetailViewButton() {
  return `
    <button class="back-button" id="close-contact-detail">${arrowLeftIcon()}</button>
  `;
}

function contactButtons(contact) {
  return `
    <button onclick="openEditContact('${contact.firebaseKey}')">
      ${editIcon()}<span>Edit</span>
    </button>
    <button onclick="deleteContact('${contact.firebaseKey}')">
      ${deleteIcon()}<span>Delete</span>
    </button>
  `;
}

function contactBadgeTemplate(contact) {
  return `
    <div class="contact-detail-badge" style="background-color: ${contact.badgeColor}">
      ${contact.firstName[0].toUpperCase()}${contact.lastName[0].toUpperCase()}
    </div>
  `;
}

function contactBadgeDummyTemplate() {
  return `
    <div class="contact-detail-badge">
      <img src="../assets/imgs/person.svg" alt="Dummy of a person" />
    </div>
  `;
}

function contactMainTemplate() {
  return `
    <div class="contact-headline">
      <h1>Contacts</h1>
      <div class="headline-seperator"></div>
      <p>Better with a team</p>
      <div class="headline-seperator-mobile"></div>
    </div>
    <div class="contact-overview" id="contact-overview"></div>
  `;
}
