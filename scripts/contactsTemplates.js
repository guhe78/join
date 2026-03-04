function contactTemplate(index) {
  const contact = contacts[index];
  return `
        <div class="contact" id="contact${index}" onclick="showContact(${index})" >
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
