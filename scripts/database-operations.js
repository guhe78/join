async function uploadJSON() {
  const response = await fetch("../scripts/contacts.json");
  const contacts = await response.json();
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    postData("contacts/", contact);
  }
}
