let BASE_URL1 = "https://join-19628-default-rtdb.firebaseio.com/contacts";

let allContacts = {
  names: [],
  mails: [],
  phones: [],
  images: [],
};

async function initContacts() {
  try {
    await getData("/");
    sortContacts();
    setupForm();
    renderContactList();
  } catch (error) {
    console.log("Error:", error);
  }
}

async function getData(path = "") {
  let response = await fetch(BASE_URL1 + path + ".json");
  let responseToJson = await response.json();
  updateContacts(responseToJson);
}

async function deleteData(index) {
  try {
    let contactId = await getContactId(index);
    if (contactId) {
      await fetch(`${BASE_URL1}/${contactId}.json`, {
        method: "DELETE",
      });
      console.log(`Kontakt ${allContacts.names[index]} erfolgreich gelöscht.`);

      allContacts.names.splice(index, 1);
      allContacts.mails.splice(index, 1);
      allContacts.phones.splice(index, 1);
      allContacts.images.splice(index, 1);

      renderContactList();
    } else {
      console.error("Kontakt-ID nicht gefunden.");
    }
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
  }
}

async function postData(contact) {
  try {
    let response = await fetch(BASE_URL1 + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

    let responseToJson = await response.json();
    console.log("Erfolgreich hochgeladen:", responseToJson);

    await getData("/");
  } catch (error) {
    console.error("Fehler beim Hochladen:", error);
  }
  renderContactList();
}

function updateContacts(responseToJson) {
  let keys = Object.keys(responseToJson);
  for (let i = 0; i < keys.length; i++) {
    let contact = responseToJson[keys[i]];
    if (!isContactExisting(contact)) {
      allContacts.names.push(contact.name);
      allContacts.mails.push(contact.mail);
      allContacts.phones.push(contact.phone);   
    }
    if (!contact.img) {         // wenn kein img hochgeladen wird wird das img aus der  generateProfileImage erstellt und als contact img gespeichert und ins array gepusht
      contact.img = generateProfileImage(contact.name); /// verur
    }
    allContacts.images.push(contact.img);
  }
}

async function getContactId(index) {
  // um eindeutige ID des Kontaktes der Firebase Datenbank zu identifizieren
  let response = await fetch(BASE_URL1 + ".json");
  let responseToJson = await response.json();
  let keys = Object.keys(responseToJson); // nimmt das Array und gibt dessen gesamte Schlüssel zurück

  for (let i = 0; i < keys.length; i++) {
    let contact = responseToJson[keys[i]];
    if (
      contact.name === allContacts.names[index] &&
      contact.mail === allContacts.mails[index] &&
      contact.phone === allContacts.phones[index] &&
      contact.img === allContacts.images[index]
    ) {
      return keys[i];
    }
  }
  return null;
}

function isContactExisting(contact) {
  // prüft ob ein Kontakt beim hochladen bereits exisistiert
  return (
    allContacts.names.includes(contact.name) &&
    allContacts.mails.includes(contact.mail) &&
    allContacts.phones.includes(contact.phone) &&
    allContacts.images.includes(contact.img)
  );
}

function generateProfileImage(name) { // generiert ein Profilfoto im vorgegebenen style, falls keines hochgeladen wird
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#F3FF33",
    "#33FFF3",
  ];
  let randomColor = colors[Math.floor(Math.random() * colors.length)]; // kreirt eine zufällige variable zwischen 0 und 1

  let initials = name
    .split(" ") 
    .map((word) => word[0].toUpperCase()) // schneidet die Worte an der ersten Stelle in Großbuchstaben ab
    .join(""); // fügt diese zusammen

  let newContactImg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="${randomColor}" />
      <text x="50%" y="50%" dy=".3em" text-anchor="middle" font-size="32" fill="#FFF" font-family="Inter, sans-serif">${initials}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(newContactImg)}`;

}

function sortContacts() {    // sortiert die kontakte anhand der Namen, muss leicht überarbeitet werden
  let sortedIndices = [...Array(allContacts.names.length).keys()].sort(
    (a, b) => {
      return allContacts.names[a].localeCompare(allContacts.names[b]);
    }
  );

  allContacts.names = sortedIndices.map((i) => allContacts.names[i]);
  allContacts.mails = sortedIndices.map((i) => allContacts.mails[i]);
  allContacts.phones = sortedIndices.map((i) => allContacts.phones[i]);
  allContacts.images = sortedIndices.map((i) => allContacts.images[i]);
}

function renderCurrentLetter(contactList, letter) {   // rendern zu der Kontaktliste einen Seperator
  contactList.innerHTML += `
    <div class="contactlist-order-letter">${letter}</div>
    <div class="contactlist-seperator"></div>
  `;
}

function processContacts(contactList) {      // sollte kontakte sortieren.. und diese nacheinander rendern // eigentliche renderfunktion der contaktliste
  let currentLetter = "";
  for (let i = 0; i < allContacts.names.length; i++) {
    let firstLetter = allContacts.names[i].charAt(0).toUpperCase();
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      renderCurrentLetter(contactList, currentLetter);
    }
    let imageSrc = allContacts.images[i]
      ? allContacts.images[i]
      : generateProfileImage(allContacts.names[i]);

    contactList.innerHTML += `
      <div id="contactlist-overlay(${i})" class="contactlist-overlay" onclick="openContact(${i})">
        <img class="pll-24" src="${imageSrc}" alt="Contact Image"/>
        <div class="contactlist-databox">
          <div class="contactlist-databox-name">${allContacts.names[i]}</div>
          <a class="contactlist-databox-mail" href="mailto:${allContacts.mails[i]}">${allContacts.mails[i]}</a>
        </div>
      </div>
    `;
  }
}

function renderContactList() {   // Hilfsfunktion, zum cleanen, updaten und rendern der Kontaktliste
  let contactList = document.getElementById("contactlist-content");
  contactList.innerHTML = "";
  processContacts(contactList);
  updateContacts(responseToJson);
}

function openContact(index) { // öffnet den Kontakt.. funktioniert noch nicht einwandfrei
  let contactSection = document.getElementById("contact-section");
  let contactList = document.getElementById(`contactlist-overlay(${index})`);

  if (contactList.classList.contains("bg-color-dg")) {
    // Rückgängig machen, falls bereits ausgeführt
    contactList.classList.remove("bg-color-dg");
    contactSection.classList.add("d-none");
  } else {
    // Klassen hinzufügen, falls noch nicht ausgeführt
    contactList.classList.add("bg-color-dg");
    contactSection.classList.remove("d-none");
    renderContactSection(index);
  }
}

function renderContactSection(index) {// renderfunktion der Kontaktinformationen nach Onclick
   // animation funktioniert noch nicht und nach erfolgreichem löschen bleibnt die betroffene sektion bis zum reload oder switch bestehen
  // cleancode: header und information-content seperat rendern  //renderContactInformation(index);
  let contactSection = document.getElementById("contact-section");
  contactSection.innerHTML = "";

  contactSection.innerHTML = `
    <div class="contact-section-content">
      <img src="${allContacts.images[index]}"/>
      <div class="contact-section-data">
        <p>${allContacts.names[index]}</p>
        <div class="contact-section-btn-box">
          <button onclick="openEditForm(${index})" id="edit-btn">Edit<img src="./img/edit.png"></button>
          <button onclick="deleteData(${index})" id="del-btn">Delete<img src="./img/delete.png"></button>
        </div>
      </div>
    </div>

    <div id="contact-information-content">
      <p>Contact Information</p>
      <div class="contact-information-data">
        <p><b>Email</b></p>
        <a href="mailto:${allContacts.mails[index]}">${allContacts.mails[index]}</a>
        <p><b>Phone</b></p>
        <p>${allContacts.phones[index]}</p>
      </div>
    </div>`;
}



function formSubmit(event) {  // verhindert das reloaden nacg sumit
  event.preventDefault();

  const newContact = { // erstellt neuen kontakt mit vorgegebenen keys
    name: document.getElementById("name").value,
    mail: document.getElementById("mail").value,
    phone: document.getElementById("phone").value,
    img: document.getElementById("prof-img").value,
  };

  postData(newContact); // postet diesen neuen kontakt
  closeFormfield(); 
}

function setupForm() {  // aktiviert das submitform
  const form = document.getElementById("contact-form");
  form.addEventListener("submit", formSubmit);
}

function showFormField() { // zeigt das sumbmitform an 
  document.getElementById("add-contact-section").classList.remove("d-none");
  document.addEventListener("click", outsideForm);
}

function outsideForm(event) { // schließen des Form bei klick außerhalb
  let section = document.getElementById("add-contact-section");
  if (
    !section.contains(event.target) &&
    !event.target.closest("#add-contact-btn")
  ) {
    closeFormfield();
  }
}

function closeFormfield() { // schließt das formfield
  document.getElementById("name").value = "";
  document.getElementById("mail").value = "";
  document.getElementById("phone").value = "";

  document.getElementById("contact-form").classList.add("d-none");
  document.getElementById("add-contact-section").classList.add("d-none");
}

function openEditForm(index){
  document.getElementById('edit-contact-section').classList.remove("d-none");
}