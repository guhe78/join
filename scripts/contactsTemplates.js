function contactTemplate(index) {
  const contact = contacts[index];
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
          <h2 class="name">${contacts[index].firstName} ${contacts[index].lastName}</h2>
          <div class="contact-detail-buttons" id="contact-detail-buttons">${contactButtons(index)}</div>
        </div>
      </div>
      <p class="font-size-20">Contact Information</p>
      <div class="contact-detail-data">
        <p class="bold">Email</p>
        <a href="mailto:${contacts[index].email}" class="email">${contacts[index].email}</a>
        <p class="bold">Phone</p>
        <p>${contacts[index].phone}</p>
      </div>
    </div>
  `;
}

function contactMobileButton(index) {
  return `
    <div class="mobile-contact-menu">
      <div class="mobile-button-container" id="mobile-contact-menu-button">${moreVerticalIcon()}</div>
      <div class="mobile-menu" id="mobile-menu">${contactButtons(index)}</div>
    </div>
  `;
}

function contactButtons(index) {
  return `
    <button onclick="openEditContact(${index})">
      ${editIcon()}<span>Edit</span>
    </button>
    <button onclick="deleteContact(${index})">${deleteIcon()}<span>Delete</span></button>
  `;
}

function contactBadgeTemplate(index) {
  return `
    <div class="contact-detail-badge" style="background-color: ${contacts[index].badgeColor}">${contacts[index].firstName[0].toUpperCase()}${contacts[index].lastName[0].toUpperCase()}</div>
  `;
}

function contactBadgeDummyTemplate() {
  return `
    <img src="../assets/imgs/person.svg" alt="" />
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
    <section class="toast-section" id="toast-section">
      <p id="toast-message"></p>
    </section>
  `;
}

function mobileContactButton(index) {
  return `

  `;
}
