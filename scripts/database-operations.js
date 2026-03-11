let kontakte;

async function uploadJSON() {
  const response = await fetch("../scripts/contacts.json");
  const contacts = await response.json();
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    postData("contacts/", contact);
  }
}

async function getData(path) {
  const data = await fetchData(path);

  if (!data) return [];
}

async function getDBData() {
  const response = await fetch(database_url + "contacts.json");
  let data = await response.json();

  console.log(data);
  return data;
}

function makeArray(data) {
  state.contacts = Object.entries(data).map(([id, value]) => ({
    id,
    ...value,
  }));
}

async function updateContact(contact) {
  try {
    const response = await fetch(
      BASE_URL + "contacts/" + contact.id + ".json",
      {
        method: "PATCH", // PATCH ändert nur einzelne Felder, nicht das ganze Objekt!
        headers: {
          "Content-Type": "aplication/json",
        },
        body: JSON.stringify({
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`Update failed! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function deleteIdFromArray(contact) {
  const newArray = array.splice("id", 1);
  return newArray;
}
