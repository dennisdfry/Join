

/**
 * Initialisiert die Kontaktliste, indem die Funktion `updateContactList` aufgerufen wird.
 * Diese Funktion ist der Startpunkt für das Laden und Anzeigen der Kontaktliste.
 * Fehler werden im Falle eines Fehlers in der Konsole protokolliert.
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
 * Aktualisiert die Kontaktliste im Benutzerinterface basierend auf den Daten aus der Datenbank.
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
      console.error("Fehler beim Updaten der Kontaktliste:", error);
    }
  }
  /**
   * Initialisiert die Details eines spezifischen Kontakts und rendert sie im Benutzerinterface.
   * @async
   * @param {string} contactId - Die ID des geladenen Kontakts.
   */
  async function initContactDetails(contactId) {
    let contactSection = document.getElementById("contact-section");
    contactSection.innerHTML = "";
  
    try {
      let contact = await getContact(contactId);
      renderContactHead(contactSection, contact, contactId);
      renderContactInfo(contactSection, contact);
    } catch (error) {
      console.error("Fehler beim Laden der Kontaktdetails:", error);
    }
    setupDeleteButton(contactId);
  }
  
  /**
   * Initialisiert die Anzeige der Kontakte in alphabetischer Reihenfolge und fügt Buchstabenverzeichnisse hinzu.
   * @param {HTMLElement} contactList - Das Element, in welches die Kontakte eingefügt werden.
   * @param {Array} sortedContacts - Ein Array der sortierten Kontakte.
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