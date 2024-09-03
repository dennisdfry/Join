/**
 * Performs a fetch request and returns the response as JSON.
 * If the request fails, an error is thrown.
 *
 * @async
 * @param {string} url - The URL from which to fetch data.
 * @param {object} [options={}] - Optional: Options for the fetch call such as method, headers, or body.
 * @returns {Promise<object>} - A promise that resolves to the JSON response of the request.
 * @throws {Error} - Throws an error if the request is not successful.
 */
async function fetchData(url, options = {}) {
  let response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error! Status: ${response.status} (${response.statusText})`);
  }
  return response.json();
}

/**
 * Retrieves the data of a specific contact from the database.
 *
 * @async
 * @param {string} contactId - The ID of the specific contact to retrieve.
 * @returns {Promise<object>} - A promise that resolves to the JSON data of the contact.
 */
async function getContact(contactId) {
  return await fetchData(`${CONTACTS_URL}/${contactId}.json`);
}

/**
 * Deletes a contact from the database and performs additional operations after the deletion.
 *
 * @async
 * @param {string} contactId - The ID of the contact to be deleted.
 */
async function deleteContact(contactId) {
  try {
    await fetchData(`${CONTACTS_URL}/${contactId}.json`, { method: "DELETE" });
    console.log(`Contact ${contactId} successfully deleted.`);
    await handlePostDeleteOperations(contactId);
  } catch (error) {
    console.error("Error during deletion:", error);
  }
}

/**
 * Adds a new contact to the database.
 *
 * @async
 * @param {object} contact - The contact object to be added to the database.
 */
async function postContact(contact) {
  let newContact = await fetchData(`${CONTACTS_URL}.json`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(contact),
  });
  console.log("Contact successfully uploaded:", newContact);
}

/**
 * Replaces a contact by deleting the old one and creating a new contact.
 *
 * This function deletes the contact with the given ID and then creates a new contact with the provided updated data.
 * After replacing the contact, it updates the contact list. Errors are logged to the console.
 *
 * @async
 * @param {string} contactId - The unique identifier of the contact to be replaced.
 * @param {object} updatedContact - An object with the new contact data to replace the old contact.
 * @returns {Promise<void>} - Resolves when the contact has been successfully replaced and the contact list has been updated.
 * @throws {Error} - Logs an error if the contact ID is invalid or if there is an issue replacing the contact.
 */
async function replaceContact(contactId, updatedContact) {
  try {
    if (!contactId) {
      throw new Error("Invalid contact ID. Contact cannot be replaced.");
    }
    console.log(`Attempting to delete contact with ID ${contactId}.`);
    await postContact(updatedContact);
    console.log("Creating new contact: ", updatedContact);
    await deleteContact(contactId);
    await selectNextContact(contactId);
  } catch (error) {
    console.error("Error replacing contact:", error);
  }
}

/**
 * Adds a new contact, updates the contact list, and displays the details of the newly created contact.
 * If no profile image is provided, one is generated.
 *
 * @async
 * @param {object} contact - The contact object to be added.
 */
async function addContact(contact) {
  try {
    contact.img = contact.img || generateProfileImage(contact.name);
    await postContact(contact);
    await updateContactList();
    let contactId = await getContactId(contact);
    if (contactId) {
      await initContactDetails(contactId);
    }
    showUpdateBar();
  } catch (error) {
    console.error("Error uploading contact:", error);
  }
}

/**
 * Searches for the ID of a contact based on the name and email.
 *
 * This function searches the contact list for a contact whose name and email match the given values.
 *
 * @async
 * @param {Object} contact - The contact object with `name` and `mail` properties.
 * @param {string} contact.name - The name of the contact.
 * @param {string} contact.mail - The email of the contact.
 * @returns {Promise<string|undefined>} - Returns the ID of the contact if found, otherwise `undefined`.
 * @throws {Error} - Throws an error if there is a problem querying the data.
 */
async function getContactId(contact) {
  let contacts = await fetchData(`${CONTACTS_URL}.json`);
  return Object.keys(contacts).find((id) => contacts[id].name === contact.name && contacts[id].mail === contact.mail);
}

/**
 * Selects the next contact from the list after a contact has been deleted.
 *
 * @async
 * @param {string} deletedContactId - The ID of the deleted contact.
 * @returns {Promise<void>}
 */
async function selectNextContact(deletedContactId) {
  try {
    let contacts = await fetchData(`${CONTACTS_URL}.json`);
    let sortedContacts = sortContacts(contacts);
    let currentIndex = sortedContacts.findIndex(([id]) => id === deletedContactId);
    let nextContact = sortedContacts[currentIndex + 1];

    if (nextContact) {
      await selectContact(nextContact[0]);
    } else {
      document.getElementById("contact-section").innerHTML = "";
    }
  } catch (error) {
    console.error("Error selecting next contact:", error);
  }
}
