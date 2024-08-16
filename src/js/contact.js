const ACTIVE_CLASS = "active-contact";
const CONTACTS_URL = "https://join-19628-default-rtdb.firebaseio.com/contacts";
const HEADERS = { "Content-Type": "application/json" };

async function initContacts() {
  try {
    await updateContactList();
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchData(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Fehler! Status: ${response.status} (${response.statusText})`);
  }
  return response.json();
}

async function getContact(contactId) {
  return await fetchData(`${CONTACTS_URL}/${contactId}.json`);
}

async function deleteContact(contactId) {
  try {
    await fetchData(`${CONTACTS_URL}/${contactId}.json`, { method: "DELETE" });
    console.log(`Kontakt ${contactId} erfolgreich gelöscht.`);
    await handlePostDeleteOperations(contactId);
  } catch (error) {
    console.error("Fehler während des Löschvorgangs:", error);
  }
}

async function postContact(contact) {
  let newContact = await fetchData(`${CONTACTS_URL}.json`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(contact),
  });
  console.log("Kontakt erfolgreich hochgeladen:", newContact);
}

async function patchContact(contactId, updatedContact) {
  try {
    await fetchData(`${CONTACTS_URL}/${contactId}.json`, {
      method: "PATCH",
      headers: HEADERS,
      body: JSON.stringify(updatedContact),
    });
    await updateContactList();
    closeEditField();
  } catch (error) {
    console.error("Fehler beim Editiervorgang:", error);
  }
}

async function addContact(contact) {
  try {
    contact.img = contact.img || generateProfileImage(contact.name);
    await postContact(contact);
    await updateContactList();
    let newContactId = await getContactId(contact);
    if (newContactId) {
      await initContactDetails(newContactId);
    }
    showUpdateBar();
  } catch (error) {
    console.error("Fehler beim Hochladen des Kontakes:", error);
  }
}

async function getContactId(contact) {
  let contacts = await fetchData(`${CONTACTS_URL}.json`);
  return Object.keys(contacts).find(id => contacts[id].name === contact.name && contacts[id].mail === contact.mail);
}

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

function initLetterArea(contactList, sortedContacts) {
  let currentLetter = "";

  sortedContacts.forEach(([id, contact]) => {
    let letter = contact.name.charAt(0).toUpperCase();

    if (letter !== currentLetter) {
      currentLetter = letter;
      renderLetterArea(contactList, letter);
    }
    const imageSrc = getImageSrc(contact);
    renderContactItem(contactList, id, contact, imageSrc);
  });
}

function renderLetterArea(contactList, letter) {
  contactList.innerHTML += `
    <div class="contactlist-order-letter d-flex fw-400 fs-20 self-baseline">${letter}</div>
    <div class="contactlist-seperator"></div>
  `;
}

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

function checkFormFields() {
  let allFieldsFilled = ["name", "mail", "phone"].every(id => document.getElementById(id).value.trim());
  document.getElementById("formfield-create-btn").disabled = !allFieldsFilled;
}

function setupForms() {
  document.getElementById("contact-form").addEventListener("submit", handleFormSubmit);
  ["name", "mail", "phone"].forEach(id => document.getElementById(id).addEventListener("input", checkFormFields));
  checkFormFields();
}

document.addEventListener("DOMContentLoaded", setupForms);

function handleFormSubmit(event) {
  event.preventDefault();

  let name = document.getElementById("name").value.trim();
  let mail = document.getElementById("mail").value.trim();
  let phone = document.getElementById("phone").value.trim();

  if (![name, validateEmail(mail), validatePhone(phone)].every(Boolean)) {
    ["name", "mail", "phone"].forEach(id => {
      const input = document.getElementById(id);
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

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[0-9]{10,15}$/.test(phone);
}

function showFormField() {
  const formField = document.getElementById("add-form-section");
  document.getElementById("overlay").classList.remove("d-none");
  formField.classList.remove("d-none", "hidden");
  formField.style.cssText = "visibility: visible; transform: translateX(100vw); animation: moveIn 200ms ease-in forwards";
  document.addEventListener("click", handleOutsideFormClick);
}

function closeFormField() {
  document.getElementById("overlay").classList.add("d-none");

  const formField = document.getElementById("add-form-section");
  ["name", "mail", "phone"].forEach(id => document.getElementById(id).value = "");
  formField.style.animation = "moveOut 200ms ease-out forwards";
  
  setTimeout(() => {
    formField.classList.add("hidden", "d-none");
    formField.style.cssText = "visibility: hidden; transform: translateX(100vw)";
  }, 200);
}

function handleOutsideFormClick(event) {
  if (!document.getElementById("add-form-section").contains(event.target) && !event.target.closest("#add-contact-btn")) {
    closeFormField();
  }
}

function showEditForm(contactId) {
  const editField = document.getElementById("edit-contact-section");
  document.getElementById("edit-overlay").classList.remove("d-none");
  editField.classList.remove("d-none", "hidden");
  editField.style.cssText = "visibility: visible; transform: translateX(100vw); animation: moveIn 200ms ease-in forwards";
  document.addEventListener("click", handleOutsideEditFormClick);
  document.getElementById("edit-contact-form").setAttribute("data-id", contactId);
  loadEditFormData(contactId);
}

function closeEditField() {
  document.getElementById("edit-overlay").classList.add("d-none");

  const editField = document.getElementById("edit-contact-section");
  ["edit-name", "edit-mail", "edit-phone"].forEach(id => document.getElementById(id).value = "");
  editField.style.animation = "moveOut 200ms ease-out forwards";

  setTimeout(() => {
    editField.classList.add("hidden", "d-none");
    editField.style.cssText = "visibility: hidden; transform: translateX(100vw)";
  }, 200);
}

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

function handleEditFormSubmit(event) {
  event.preventDefault();

  let contactId = event.target.getAttribute("data-id");
  let updatedContact = {
    name: document.getElementById("edit-name").value.trim(),
    mail: document.getElementById("edit-mail").value.trim(),
    phone: document.getElementById("edit-phone").value.trim(),
    img: document.getElementById("prof2-img").querySelector("img")?.src || generateProfileImage(document.getElementById("edit-name").value),
  };

  if (!validateEmail(updatedContact.mail) || !validatePhone(updatedContact.phone)) {
    console.error("Invalid email or phone number.");
    return;
  }

  patchContact(contactId, updatedContact).then(() => {
    showUpdateBar();
    closeEditField();
  }).catch(error => {
    console.error("Error updating contact:", error);
  });
}

async function selectContact(contactId) {
  let contactSection = document.getElementById("contact-section");
  let selectedContact = document.getElementById(`contactlist-item-${contactId}`);

  deselectAllContacts();
  highlightContact(selectedContact);

  contactSection.classList.remove("d-none");
  await initContactDetails(contactId);
}

function deselectAllContacts() {
  document.querySelectorAll('[id^="contactlist-item"]').forEach(contact => {
    contact.classList.remove("bg-color-dg", ACTIVE_CLASS);
    contact.style.pointerEvents = "auto";
    contact.querySelector(".contactlist-databox .fw-400")?.classList.remove("selected-contact-name");
  });
}

function highlightContact(selectedContact) {
  if (!selectedContact.classList.contains("bg-color-dg")) {
    selectedContact.classList.add("bg-color-dg", ACTIVE_CLASS);
    selectedContact.style.pointerEvents = "none";
    selectedContact.querySelector(".contactlist-databox .fw-400")?.classList.add("selected-contact-name");
  }
}

function showUpdateBar() {
  const updateBar = document.getElementById("update-bar");
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

async function selectNextContact(deletedContactId) {
  try {
    let contacts = await fetchData(`${CONTACTS_URL}.json`);
    let sortedContacts = sortContacts(contacts);
    let currentIndex = sortedContacts.findIndex(([id]) => id === deletedContactId);
    let nextContact = sortedContacts[currentIndex + 1] || sortedContacts[currentIndex - 1];

    if (nextContact) {
      await selectContact(nextContact[0]);
    } else {
      document.getElementById("contact-section").innerHTML = "";
    }
  } catch (error) {
    console.error("Error selecting next contact:", error);
  }
}

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

function sortContacts(contacts) {
  return Object.entries(contacts).sort(([, a], [, b]) => a.name.localeCompare(b.name));
}

function getImageSrc(contact) {
  return contact.img || generateProfileImage(contact.name);
}

async function handlePostDeleteOperations(contactId) {
  await updateContactList();
  await selectNextContact(contactId);
  closeEditField();
}
