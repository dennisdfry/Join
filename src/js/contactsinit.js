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
 * 
 * @param {HTMLElement} contactList - The element where the contacts will be inserted.
 * @param {Array} sortedContacts - An array of sorted contacts.
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
 * Verknüpft den Delete-Button im Bearbeitungsformular mit der deleteContact-Funktion.
 * @param {string} contactId - Die ID des Kontakts, der gelöscht werden soll.
 */
  function setupDeleteButton(contactId) {
    let deleteButton = document.getElementById("editfield-cancel-btn");
    if (deleteButton) {
        deleteButton.onclick = function() {
            deleteContact(contactId);
        };
    }
  }

