/**
 * Initializes the contact list by calling the `updateContactList` function.
 * This function serves as the entry point for loading and displaying the contact list.
 * Errors are logged to the console in case of a failure.
 * 
 * @async
 */
async function initContacts() {
  try {
      await updateContactList();
  } catch (error) {
      console.error("Error:", error);
  }
}

/**
* Updates the contact list in the user interface based on data from the database.
* This function fetches contact data, sorts it, and initializes the letter area for displaying contacts.
* 
* @async
*/
async function updateContactList() {
  let contactList = document.getElementById("contactlist-content");
  contactList.innerHTML = "";

  try {
      let contacts = await fetchData(`${CONTACTS_URL}.json`);
      let sortedContacts = sortContacts(contacts);
      initLetterArea(contactList, sortedContacts);
  } catch (error) {
      console.error("Error updating the contact list:", error);
  }
}

/**
* Initializes and renders the details of a specific contact in the user interface.
* This function fetches contact details and sets up the delete button for the contact.
* 
* @async
* @param {string} contactId - The ID of the contact to be loaded.
*/
async function initContactDetails(contactId) {
  let contactSection = document.getElementById("contact-section");
  contactSection.innerHTML = "";

  try {
      let contact = await getContact(contactId);
      renderContactHead(contactSection, contact, contactId);
      renderContactInfo(contactSection, contact);
  } catch (error) {
      console.error("Error loading contact details:", error);
  }
  setupDeleteButton(contactId);
}

/**
* Initializes the display of contacts in alphabetical order and adds letter directories.
* This function iterates over sorted contacts, creates letter directories as needed, and renders contact items.
* 
* @param {HTMLElement} contactList - The element where the contacts will be inserted.
* @param {Array} sortedContacts - An array of sorted contacts, where each entry is an array containing the contact ID and contact data.
*/
function initLetterArea(contactList, sortedContacts) {
  let currentLetter = "";

  sortedContacts.forEach(([id, contact]) => {
      let letter = contact.name.charAt(0).toUpperCase();

      if (letter !== currentLetter) {
          currentLetter = letter;
          renderLetterArea(contactList, letter);
      }
      let imageSrc = getImageSrc(contact);
      renderContactItem(contactList, id, contact, imageSrc);
  });
}

/**
* Sets up the delete button in the edit form and links it to the `deleteContact` function.
* 
* @param {string} contactId - The ID of the contact to be deleted.
*/
function setupDeleteButton(contactId) {
  let deleteButton = document.getElementById("editfield-cancel-btn");
  if (deleteButton) {
      deleteButton.onclick = function() {
          deleteContact(contactId);
      };
  }
}
