/**
 * Führt eine fetch-Anfrage aus und gibt die Antwort als JSON zurück.
 * Falls die Anfrage fehlschlägt, wird ein Fehler geworfen.
 * @async
 * @param {string} url - Die URL, von der die Daten abgerufen werden.
 * @param {object} [options={}] - Optional: Optionen für den fetch-Aufruf wie Methode, Header oder Body.
 * @returns {Promise<object>} - Ein Promise, das die JSON-Antwort der Anfrage zurückgibt.
 * @throws {Error} - Wirft einen Fehler, wenn die Anfrage nicht erfolgreich ist.
 */
async function fetchData(url, options = {}) {
    let response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Fehler! Status: ${response.status} (${response.statusText})`);
    }
    return response.json();
  }
  
  /**
   * Ruft die Daten eines spezifischen Kontakts von der Datenbank ab.
   * @async
   * @param {string} contactId - Die ID des spezifischen Kontakts, der abgerufen werden soll.
   * @returns {Promise<object>} - Ein Promise, das die JSON-Daten des Kontakts zurückgibt.
   */
  async function getContact(contactId) {
    return await fetchData(`${CONTACTS_URL}/${contactId}.json`);
  }
  
  /**
   * Löscht einen Kontakt aus der Datenbank und führt nach dem Löschvorgang weitere Operationen aus.
   * @async
   * @param {string} contactId - Die ID des zu löschenden Kontakts.
   */
  async function deleteContact(contactId) {
    try {
      await fetchData(`${CONTACTS_URL}/${contactId}.json`, { method: "DELETE" });
      console.log(`Kontakt ${contactId} erfolgreich gelöscht.`);
      await handlePostDeleteOperations(contactId);
    } catch (error) {
      console.error("Fehler während des Löschvorgangs:", error);
    }
  }
  
  /**
 * Verknüpft den Delete-Button im Bearbeitungsformular mit der deleteContact-Funktion.
 * @param {string} contactId - Die ID des Kontakts, der gelöscht werden soll.
 */
function setupDeleteButton(contactId) {
  const deleteButton = document.getElementById("editfield-cancel-btn");
  if (deleteButton) {
      deleteButton.onclick = function() {
          deleteContact(contactId);
      };
  }
}
  
  /**
   * Fügt einen neuen Kontakt der Datenbank hinzu.
   * @async
   * @param {object} contact - Das Kontaktobjekt, das zur Datenbank hinzugefügt werden soll.
   */
  async function postContact(contact) {
    let newContact = await fetchData(`${CONTACTS_URL}.json`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(contact),
    });
    console.log("Kontakt erfolgreich hochgeladen:", newContact);
  }
  
  
  /**
   * Ersetzt einen Kontakt durch Löschen des alten und Erstellen eines neuen Kontakts.
   *
   * Diese Funktion löscht den Kontakt mit der angegebenen ID und erstellt anschließend einen
   * neuen Kontakt mit den bereitgestellten aktualisierten Daten. Nach dem Ersetzen des Kontakts
   * wird die Kontaktliste aktualisiert. Tritt ein Fehler auf, wird dieser in der Konsole protokolliert.
   *
   * @async
   * @function replaceContact
   * @param {*} contactId - Die eindeutige Kennung des Kontakts, der ersetzt werden soll.
   * @param {*} updatedContact - Ein Objekt mit den neuen Kontaktdaten, die den alten Kontakt ersetzen sollen.
   * @returns {Promise<void>} Wird aufgelöst, wenn der Kontakt erfolgreich ersetzt und die Kontaktliste aktualisiert wurde.
   *
   * @throws {Error} Protokolliert einen Fehler, wenn die Kontakt-ID ungültig ist oder ein Problem beim Ersetzen des Kontakts auftritt.
   */
  async function replaceContact(contactId, updatedContact) {
    try {
      if (!contactId) {
        throw new Error("Ungültige Kontakt-ID. Kontakt kann nicht ersetzt werden.");
      }
      console.log(`Versuche Kontakt mit ID ${contactId} zu löschen.`);
      await postContact(updatedContact);
      console.log("Erstelle neuen Kontakt: ", updatedContact);
      await deleteContact(contactId);  
      await selectNextContact(contactId);
    } catch (error) {
      console.error("Fehler beim Ersetzen des Kontakts:", error);
    }
  }
  
  /**
   * Fügt einen neuen Kontakt hinzu, aktualisiert die Kontaktliste und zeigt die Details des neu erstellten Kontakts an.
   * Falls kein Profilbild vorhanden ist, wird eines generiert.
   * @async
   * @param {object} contact - Das Kontaktobjekt, das hinzugefügt werden soll.
   */
  async function addContact(contact) {
    try {
      contact.img = contact.img || generateProfileImage(contact.name);
      await postContact(contact);
      await updateContactList();
      let ContactId = await getContactId(contact);
      if (ContactId) {
        await initContactDetails(ContactId);
      }
      showUpdateBar();
  
    } catch (error) {
      console.error("Fehler beim Hochladen des Kontakes:", error);
    }
  }
  
  /**
   * Sucht nach der ID eines Kontakts basierend auf dem Namen und der E-Mail.
   * 
   * Diese Funktion durchsucht die Liste der Kontakte nach einem Kontakt,
   * dessen Name und E-Mail mit den angegebenen Werten übereinstimmen.
   * 
   * @async
   * @param {Object} contact - Das Kontaktobjekt mit den Eigenschaften `name` und `mail`.
   * @param {string} contact.name - Der Name des Kontakts.
   * @param {string} contact.mail - Die E-Mail des Kontakts.
   * @returns {Promise<string|undefined>} - Gibt die ID des Kontakts zurück, falls gefunden, andernfalls `undefined`.
   * 
   * @throws {Error} - Wenn ein Fehler bei der Datenabfrage auftritt.
   */
  async function getContactId(contact) {
    let contacts = await fetchData(`${CONTACTS_URL}.json`);
    return Object.keys(contacts).find(id => contacts[id].name === contact.name && contacts[id].mail === contact.mail);
  }


  /**
 * Wählt den nächsten Kontakt aus der Liste aus, nachdem ein Kontakt gelöscht wurde.
 * @async
 * @param {string} deletedContactId - Die ID des gelöschten Kontakts.
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