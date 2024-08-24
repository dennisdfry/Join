const ACTIVE_CLASS = "active-contact";
const CONTACTS_URL = "https://join-19628-default-rtdb.firebaseio.com/contacts";
const HEADERS = { "Content-Type": "application/json" };


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

/**
 * Fügt einen Buchstabenbereich (A, B, C) und einen Separator in die Kontaktliste ein.
 * @param {HTMLElement} contactList - Das Element, in welches Separator und Buchstabe eingefügt werden.
 * @param {string} letter - Der anzuzeigende Buchstabe.
 */
function renderLetterArea(contactList, letter) {
  contactList.innerHTML += `
    <div class="contactlist-order-letter d-flex fw-400 fs-20 self-baseline">${letter}</div>
    <div class="contactlist-seperator"></div>
  `;
}

/**
 * Fügt einen einzelnen Kontakt in die Kontaktliste ein.
 * @param {HTMLElement} contactList - Das Element, in welches der Kontakt eingefügt werden soll.
 * @param {string} id - Die ID des Kontaktobjekts.
 * @param {Object} contact - Das Kontaktobjekt.
 * @param {string} imageSrc - Die Bildquelle des Kontakts.
 */
function renderContactItem(contactList, id, contact, imageSrc) {
  contactList.innerHTML += `
    <div id="contactlist-item-${id}" class="contactlist-content bradius10 d-flex-start flex-d-row" onclick="selectContact('${id}')">
      <img class="d-flex pointer" src="${imageSrc}"/>
      <div class="contactlist-databox flex-d-col">
        <div class="pointer no-wrap-text fw-400 fs-20">${contact.name}</div>
        <a class="pointer color-lb fs-16 text-deco-n" href="mailto:${contact.mail}">${contact.mail}</a>
      </div>
    </div>
  `;
}

/**
 * Rendert den Kopfbereich eines Kontakts in der Detailansicht.
 * @param {HTMLElement} contactSection - Das Element, in welches der Kontaktkopf eingefügt werden soll.
 * @param {Object} contact - Das Kontaktobjekt.
 * @param {string} contactId - Die ID des Kontaktobjekts.
 */
function renderContactHead(contactSection, contact, contactId) {
  contactSection.innerHTML += `
    <div class="animation-100">
      <div class="contact-information item-center d-flex">
        <img src="${contact.img || generateProfileImage(contact.name)}" class="d-flex gap-10 obj-cover bradius70"/>
        <div class="d-flex flex-d-col gap-8 item-start flex-grow">
          <p class="mg-block-inline fw-500 no-wrap-text fs-47">${contact.name}</p>
          <div class="contact-section-btn-box fw-400 d-flex-between l-height-19">
            <button class="bg-color-tr txt-center gap-8 b-unset pointer d-flex-center flex-d-row fs-16" onclick="showEditForm('${contactId}')" id="edit-btn">
              <img class="obj-cover img-24" src="./img/edit.png">Edit
            </button>
            <button class="bg-color-tr txt-center gap-8 b-unset pointer d-flex-center flex-d-row fs-16" onclick="deleteContact('${contactId}')" id="del-btn">
              <img class="obj-cover img-24" src="./img/delete.png">Delete
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

/**
 * Rendert die detaillierten Informationen eines Kontakts.
 * @param {HTMLElement} contactSection - Das Element, in welches die Kontaktinformationen eingefügt werden sollen.
 * @param {Object} contact - Das Kontaktobjekt.
 */
function renderContactInfo(contactSection, contact) {
  contactSection.innerHTML += `
    <div class="animation-100">
      <div id="contact-information-content" class="d-flex flex-d-col no-wrap-text">
        <p class="fw-400 l-height-24 fs-20 mg-block-inline">Contact Information</p>
        <div class="contact-information-data d-flex flex-d-col gap-22">
          <div class="d-flex flex-d-col gap-15 text-left">
            <p class="fs-16 f-weight-700 no-wrap-text mg-block-inline l-height-19 txt-left"><b>Email</b></p>
            <a class="pointer color-lb text-deco-n" href="mailto:${contact.mail}">${contact.mail}</a>
          </div>
          <div class="d-flex flex-d-col gap-15 text-left">
            <p class="fs-16 f-weight-700 no-wrap-text mg-block-inline l-height-19 txt-left"><b>Phone</b></p>
            <p class="fs-16 fw-400 no-wrap-text mg-block-inline l-height-19 txt-left">${contact.phone}</p>
          </div>
        </div>
      </div>
    </div>`;
}


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
 * @param {string} phone - Die Telefonnummer, die Überprüft werden soll
 * @returns Boolean (True/False)
 */
function validatePhone(phone) {
  return /^[0-9]{10,15}$/.test(phone);
}

document.onkeydown=function(evt){
  var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
  if(keyCode == 13)
  {
      //your function call here
  }
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
  }, 200);
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
}

/**
 * Schließt das Bearbeitungsformular.
 */
function closeEditField() {
  closeForm("edit-contact-section", "edit-overlay", ["edit-name", "edit-mail", "edit-phone"]);
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
      }, 200);
    }
  });
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

/**
 * Generiert ein Profilbild mit Initialen basierend auf dem Namen des Kontakts.
 * @param {string} name - Der Name des Kontakts.
 * @returns {string} - Ein Base64-encoded SVG-Bild.
 */
function generateProfileImage(name) {
  let colors = ["#FF5733","#33FF57","#3357FF","#FF33A1","#F3FF33","#33FFF3"];
  let randomColor = colors[Math.floor(Math.random() * colors.length)];
  let initials = name.split(" ").map(word => word.charAt(0).toUpperCase()).join("");
  const svgImage = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="${randomColor}" />
    <text x="50%" y="50%" dy=".3em" text-anchor="middle" font-size="32" fill="#FFF" font-family="Inter, sans-serif">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svgImage)}`;
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

