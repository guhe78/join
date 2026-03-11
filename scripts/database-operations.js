async function uploadContactsJSON() {
  const response = await fetch("../scripts/contacts.json");
  const contacts = await response.json();
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    postData("contacts/", contact);
  }
}

async function uploadTasksJSON() {
  const response = await fetch("../scripts/tasks.json");
  const tasks = await response.json();
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    postData("tasks", task);
  }
}
