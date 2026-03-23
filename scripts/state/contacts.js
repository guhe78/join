import { getState } from "./state";

export function getContacts() {
  return getState().contacts;
}

export async function addContact(contact) {
  const state = getState();
  state.contacts.push(contact);
  await postData("users", contact);
}
