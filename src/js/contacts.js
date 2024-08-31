const ACTIVE_CLASS = "active-contact";
const CONTACTS_URL = "https://join-19628-default-rtdb.firebaseio.com/contacts";
const HEADERS = { "Content-Type": "application/json" };

/**
 * Initialisiert die Event-Listener für das Kontaktformular.
 * - Fügt einen Submit-Listener hinzu, um das Formular zu verarbeiten.
 * - Fügt Input-Listener hinzu, um die Felder auf Vollständigkeit zu überprüfen.
 * - Überprüft, ob alle erforderlichen Felder ausgefüllt sind und aktiviert oder deaktiviert den Senden-Button.
 */
function setupForm() {
  document.getElementById("contact-form").addEventListener("submit", handleFormSubmit);
  ["name", "mail", "phone"].forEach(id => {
    document.getElementById(id).addEventListener("input", checkFormFields);
    document.getElementById(id).addEventListener("keydown", handleEnterPress);
  });
  checkFormFields();
}


/**
 * Überprüft ob alle erforderlichen Felder ausgefüllt wurden und aktiviert bzw. deaktiviert den Submit-Button
 */
function checkFormFields() {
  let filledFields = ["name", "mail", "phone"].every(id => document.getElementById(id).value.trim());
  document.getElementById("formfield-create-btn").disabled = !filledFields;
}

/**
 * Überprüft, ob die Entertaste gedrückt wurde und löst das Formular-Submit-Event aus
 * @param {KeyboardEvent} event - Das Eventobjekt der Tastatureingabe
 */
function handleEnterPress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    handleFormSubmit(event); 
  }
}


/**
 * Behandelt das Absenden eines Kontakes und fügt den neuen Kontakt hinzu
 * @param {Event} event - Das Eventobjekt des Formulares 
 * @returns 
 */
function handleFormSubmit(event) {
  event.preventDefault();

  let name = document.getElementById("name").value.trim();
  let mail = document.getElementById("mail").value.trim();
  let phone = document.getElementById("phone").value.trim();

  if (![name, validateEmail(mail), validatePhone(phone)].every(Boolean)) {
    ["name", "mail", "phone"].forEach(id => {
      let input = document.getElementById(id);
      input.classList.toggle("input-error", !input.value.trim());
    });
    return;
  }

  addContact({
    name: capitalizeFirstLetter(name),
    mail,
    phone,
    img: document.getElementById("prof-img").value,
  });

  closeFormField();
}

/**
 * Validiert eine E-Mail adresse
 * @param {string} email - Die E-Mail des zu Überprüfen ist
 * @returns Boolean (true/false)
 */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validiert eine Telefonnummer
 * @param {string} phone - Die Telefonnummer, die überprüft werden soll
 * @returns {boolean} - true, wenn die Telefonnummer gültig ist, andernfalls false
 */
function validatePhone(phone) {
  return /^\+?[0-9]{10,16}$/.test(phone);
}


/**
 * schreibt den ersten Buchstaben des Namen groß
 * @param {string} name - Der Name des Kontaktes
 * @returns Name in konsistenter Form als string
 */
function capitalizeFirstLetter(name) {
  let words = name.split(' ');
  if (words.length >= 2) {
    return capitalizeSecondLetter(words);
  }
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/**
 * schreibt bei mehr als einem Wort alle Wörter groß
 * @param {array} words - Ein Array aus Wörtern welches groß geschrieben werden soll
 * @returns großgeschriebene Wörter als string
 */
function capitalizeSecondLetter(words) {
  return words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Zeigt das Formular zum Hinzufügen eines Kontaktes an mit einer Animation
 */
/**
 * Zeigt ein Formular an, indem es das entsprechende Element sichtbar macht und eine Animation hinzufügt.
 * @param {string} formId - Die ID des Formulars, das angezeigt werden soll.
 * @param {string} overlayId - Die ID des Overlays, das angezeigt werden soll.
 * @param {Function} outsideClickHandler - Die Funktion, die auf Klicks außerhalb des Formulars reagiert.
 */
function showForm(formId, overlayId, outsideClickHandler) {
  const formField = document.getElementById(formId);
  document.getElementById(overlayId).classList.remove("d-none");
  formField.classList.remove("d-none", "hidden");
  formField.style.cssText = "visibility: visible; transform: translateX(100vw); animation: moveIn 200ms ease-in forwards";
  document.addEventListener("click", outsideClickHandler);
}

/**
 * Schließt ein Formular, indem es das entsprechende Element ausblendet und eine Animation hinzufügt.
 * @param {string} formId - Die ID des Formulars, das geschlossen werden soll.
 * @param {string} overlayId - Die ID des Overlays, das ausgeblendet werden soll.
 * @param {Array<string>} fieldIds - Ein Array der IDs der Formularfelder, die zurückgesetzt werden sollen.
 */
function closeForm(formId, overlayId, fieldIds) {
  document.getElementById(overlayId).classList.add("d-none");

  const formField = document.getElementById(formId);
  fieldIds.forEach(id => document.getElementById(id).value = "");
  formField.style.animation = "moveOut 200ms ease-out forwards";

  setTimeout(() => {
    formField.classList.add("hidden", "d-none");
    formField.style.cssText = "visibility: hidden; transform: translateX(100vw)";
  }, 100);
}

/**
 * Zeigt das Formular zum Hinzufügen eines Kontaktes an.
 */
function showFormField() {
  showForm("add-form-section", "overlay", handleOutsideFormClick);
  document.addEventListener("click", setupForm);
}

/**
 * Schließt das Formular zum Hinzufügen eines Kontaktes.
 */
 function closeFormField() {
  closeForm("add-form-section", "overlay", ["name", "mail", "phone"]);
}

/**
 * Zeigt das Bearbeitungsformular für einen bestehenden Kontakt an.
 * @param {string} contactId - Die ID des zu bearbeitenden Kontakts.
 */
function showEditForm(contactId) {
  showForm("edit-contact-section", "edit-overlay", handleOutsideEditFormClick);
  document.getElementById("edit-contact-form").setAttribute("data-id", contactId);
  loadEditFormData(contactId);

  // Füge den keydown Event-Handler für das Bearbeitungsformular hinzu
  document.getElementById("edit-contact-form").addEventListener("keydown", handleEditEnterPress);
}

/**
 * Schließt das Bearbeitungsformular.
 */
function closeEditField() {
  closeForm("edit-contact-section", "edit-overlay", ["edit-name", "edit-mail", "edit-phone"]);
  
  // Entferne den keydown Event-Handler, wenn das Formular geschlossen wird
  document.getElementById("edit-contact-form").removeEventListener("keydown", handleEditEnterPress);
}

/**
 * Überprüft, ob die Entertaste gedrückt wurde und löst das Formular-Submit-Event aus
 * @param {KeyboardEvent} event - Das Eventobjekt der Tastatureingabe
 */
function handleEditEnterPress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    handleEditFormSubmit(event); 
  }
}

/**
 * Behandelt das Absenden des Bearbeitungsformulars für Kontakte.
 *
 * Diese Funktion wird ausgelöst, wenn das Bearbeitungsformular für Kontakte abgesendet wird.
 * Sie verhindert das Standardverhalten beim Absenden des Formulars, ruft die Kontakt-ID aus den
 * Datenattributen des Formulars ab, validiert die Eingabefelder und versucht dann, den Kontakt
 * zu aktualisieren. Tritt ein Fehler während dieses Prozesses auf, wird der Fehler in der Konsole
 * protokolliert.
 *
 * @async
 * @function handleEditFormSubmit
 * @param {Event} event - Das Ereignisobjekt, das das Absenden des Formulars darstellt.
 * @returns {void}
 *
 * @throws {Error} Protokolliert einen Fehler, wenn die Kontakt-ID nicht gefunden wird oder ein Problem
 *                  beim Aktualisieren des Kontakts auftritt.
 */
async function handleEditFormSubmit(event) {
  event.preventDefault();
  let contactId = document.getElementById("edit-contact-form").getAttribute("data-id");
  if (!contactId) {
    console.error("Keine Kontakt-ID gefunden.");
    return;
  }

  let updatedContact = {
    name: document.getElementById("edit-name").value.trim(),
    mail: document.getElementById("edit-mail").value.trim(),
    phone: document.getElementById("edit-phone").value.trim(),
    img: document.getElementById("prof2-img").querySelector("img")?.src || generateProfileImage(document.getElementById("edit-name").value),
  };

  if (!validateEmail(updatedContact.mail) || !validatePhone(updatedContact.phone)) {
    console.error("Ungültige E-Mail oder Telefonnummer.");
    return;
  }

  try {
    await replaceContact(contactId, updatedContact);
    showUpdateBar();
    closeEditField();
  } catch (error) {
    console.error("Fehler beim Hochladen", error);
  }
}


/**
 * Lädt die Kontaktdaten in die Bearbeitungsformularfelder.
 *
 * Diese Funktion ruft die Kontaktdaten basierend auf der angegebenen Kontakt-ID ab
 * und füllt die Bearbeitungsformularfelder mit den Informationen des Kontakts aus. Falls
 * der Kontakt ein Bild hat, wird dieses im entsprechenden Container angezeigt; andernfalls
 * wird ein generiertes Profilbild basierend auf dem Namen des Kontakts verwendet.
 *
 * @async
 * @function loadEditFormData
 * @param {string} contactId - Die eindeutige Kennung des Kontakts, dessen Daten geladen werden sollen.
 * @returns {Promise<void>} Wird aufgelöst, wenn die Kontaktdaten erfolgreich in das Formular geladen wurden.
 *
 * @throws {Error} Protokolliert einen Fehler, wenn ein Problem beim Abrufen der Kontaktdaten auftritt.
 */
async function loadEditFormData(contactId) {
  try {
    let contact = await getContact(contactId);
    document.getElementById("edit-name").value = contact.name;
    document.getElementById("edit-mail").value = contact.mail;
    document.getElementById("edit-phone").value = contact.phone;
    let editImageContainer = document.getElementById("prof2-img");
    if (editImageContainer) {
      editImageContainer.innerHTML = `<img src="${contact.img || generateProfileImage(contact.name)}">`;
    }
  } catch (error) {
    console.error("Fehler beim Laden des Edit-Formulars:", error);
  }
}

/**
 * Schließt das Formular, wenn ausßerhalb des Formulars geklickt wird
 * @param {Event} event - Das Klick-Event
 */
function handleOutsideFormClick(event) {
  if (!document.getElementById("add-form-section").contains(event.target) && !event.target.closest("#add-contact-btn")) {
    closeFormField();
  }
}


/**
 * Schließt das Bearbeitungsformular wenn außerhalb geklickt wird
 * @param {Event} event - DaS Klickevent
 */
function handleOutsideEditFormClick(event) {
  let section = document.getElementById("edit-contact-section");
  if (!section.contains(event.target) && !event.target.closest("#edit-btn")) {
    closeEditField();
  }
}


/**
 * Wählt einen Kontakt aus und zeigt die Details des Kontakts an.
 * @async
 * @param {string} contactId - Die ID des auszuwählenden Kontakts.
 * @returns {Promise<void>}
 */
async function selectContact(contactId) {
  let contactSection = document.getElementById("contact-section");
  let selectedContact = document.getElementById(`contactlist-item-${contactId}`);

  deselectAllContacts();
  await highlightContact(selectedContact);

  contactSection.classList.remove("d-none");
  await initContactDetails(contactId);
}

/**
 * Wählt alle Kontakte in der Kontaktliste ab.
 */
function deselectAllContacts() {
  document.querySelectorAll('[id^="contactlist-item"]').forEach(contact => {
    contact.classList.remove("bg-color-dg", ACTIVE_CLASS);
    contact.style.pointerEvents = "auto";
    contact.querySelector(".contactlist-databox .fw-400")?.classList.remove("selected-contact-name");
  });
}

/**
 * Hebt den ausgewählten Kontakt in der Kontaktliste hervor.
 * @param {HTMLElement} selectedContact - Das HTML-Element des ausgewählten Kontakts.
 */
async function highlightContact(selectedContact) {
  if (!selectedContact.classList.contains("bg-color-dg")) {
    selectedContact.classList.add("bg-color-dg", ACTIVE_CLASS);
    selectedContact.style.pointerEvents = "none";
    selectedContact.querySelector(".contactlist-databox .fw-400")?.classList.add("selected-contact-name");
  }
}

/**
 * Zeigt die Bar an, nachdem ein Kontakt erstellt wurde durch Animation.
 */
function showUpdateBar() {
  let updateBar = document.getElementById("update-bar");
  updateBar.classList.remove("d-none");

  updateBar.addEventListener("animationend", function (event) {
    if (event.animationName === "moveIn") {
      setTimeout(() => {
        updateBar.classList.add("move-out");
        updateBar.addEventListener("animationend", function (event) {
          if (event.animationName === "moveOut") {
            updateBar.classList.add("d-none");
          }
        });
      }, 100);
    }
  });
}


/**
 * Sortiert die Kontakte alphabetisch basierend auf dem Namen.
 * @param {object} contacts - Ein Objekt, in dem jeder Schlüssel die ID und der Wert die Kontaktdaten enthält.
 * @returns {Array} - Ein Array von Arrays, die die ID und das Kontaktobjekt enthalten, sortiert nach Namen.
 */
function sortContacts(contacts) {
  return Object.entries(contacts).sort(([, a], [, b]) => a.name.localeCompare(b.name));
}

/**
 * Gibt die Bildquelle des Kontakts zurück. Wenn kein Bild vorhanden ist, wird ein Profilbild generiert.
 * @param {object} contact - Das Kontaktobjekt.
 * @returns {string} - Die Bildquelle des Kontakts.
 */
function getImageSrc(contact) {
  return contact.img || generateProfileImage(contact.name);
}

/**
 * Wird nach dem Löschen eines Kontakts ausgeführt, um die Liste zu aktualisieren und die Fortschrittsleiste anzuzeigen.
 * @async
 * @param {string} contactId - Die ID des gelöschten Kontakts.
 */
async function handlePostDeleteOperations(contactId) {
  await updateContactList();
  await selectNextContact(contactId);
  closeEditField();
}

