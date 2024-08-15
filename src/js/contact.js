async function initContacts() {
  try {
    await updateContactList();
  } catch (error) {
    console.log("Error:", error);
  }
}

async function updateContactList() {
  const contactList = document.getElementById("contactlist-content");
  contactList.innerHTML = "";

  try {
    const response = await fetch("https://join-19628-default-rtdb.firebaseio.com/contacts.json");
    const contacts = await response.json();
    const sortedContacts = sortContacts(contacts);
    await renderContactList(contactList, sortedContacts);
  } catch (error) {
    console.error("Error updating contact list:", error);
  }
}

async function fetchContact(contactId) {
  const response = await fetch(`https://join-19628-default-rtdb.firebaseio.com/contacts/${contactId}.json`);
  return await response.json();
}

async function deleteContact(contactId) {
  try {
    await fetch(`https://join-19628-default-rtdb.firebaseio.com/contacts/${contactId}.json`, { method: "DELETE" });
    console.log(`Contact with ID ${contactId} successfully deleted.`);
    await updateContactList();
    closeEditField();
    await renderContactDetails(contactId);
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}

async function addContact(contact) {
  try {
    contact.img = contact.img || generateProfileImage(contact.name);
    const response = await fetch("https://join-19628-default-rtdb.firebaseio.com/contacts.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });

    const newContact = await response.json();
    console.log("Contact uploaded successfully:", newContact);
    await updateContactList();
    showUpdateBar();
  } catch (error) {
    console.error("Error uploading contact:", error);
  }
}

function renderContactSeparator(contactList, letter) {
  contactList.innerHTML += `
    <div class="contactlist-order-letter d-flex fw-400 fs-20 self-baseline">${letter}</div>
    <div class="contactlist-seperator"></div>
  `;
}

async function renderContactList(contactList, sortedContacts) {
  let currentLetter = "";

  sortedContacts.forEach(([id, contact]) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      console.log(`Rendering separator for letter: ${currentLetter}`);
      renderContactSeparator(contactList, currentLetter);  // Füge den Separator hinzu
    }

    const imageSrc = contact.img || generateProfileImage(contact.name);
    contactList.innerHTML += `
      <div id="contactlist-item-${id}" class="contactlist-content bradius10 d-flex-start flex-d-row" onclick="selectContact('${id}')">
        <img class="d-flex pointer" src="${imageSrc}"/>
        <div class="contactlist-databox flex-d-col">
          <div class="pointer no-wrap-text fw-400 fs-20 pointer">${contact.name}</div>
          <a class="pointer color-lb fs-16 text-deco-n" href="mailto:${contact.mail}">${contact.mail}</a>
        </div>
      </div>
    `;
  });
}

async function renderContactDetails(contactId) {
  let contactSection = document.getElementById("contact-section");
  contactSection.innerHTML = "";

  try {
    const contact = await fetchContact(contactId);
    renderContactImageAndButtons(contactSection, contact, contactId);
    renderContactInfo(contactSection, contact);
  } catch (error) {
    console.error("Error loading contact details:", error);
  }
}


function renderContactImageAndButtons(contactSection, contact, contactId) {
  const contactImageHtml = `
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

  contactSection.innerHTML += contactImageHtml;
}

function renderContactInfo(contactSection, contact) {
  const contactInfoHtml = `
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

  contactSection.innerHTML += contactInfoHtml;
}

function setupForms() {
  document.getElementById("contact-form").addEventListener("submit", handleFormSubmit);
  document.getElementById("edit-contact-form").addEventListener("submit", handleEditFormSubmit);
}

function handleFormSubmit(event) {
  event.preventDefault();
  const newContact = {
    name: document.getElementById("name").value,
    mail: document.getElementById("mail").value,
    phone: document.getElementById("phone").value,
    img: document.getElementById("prof-img").value,
  };
  addContact(newContact);
  closeFormField();
}

function showFormField() {
  const formField = document.getElementById("add-form-section");
  formField.classList.remove("d-none", "hidden");
  formField.style.visibility = "visible";
  formField.style.transform = "translateX(100vw)";
  formField.style.animation = "moveIn 200ms ease-in forwards";
  document.addEventListener("click", handleOutsideFormClick);
}

function closeFormField() {
  const formField = document.getElementById("add-form-section");
  ["name", "mail", "phone"].forEach(id => document.getElementById(id).value = "");
  formField.style.animation = "moveOut 200ms ease-out forwards";

  setTimeout(() => {
    formField.classList.add("hidden", "d-none");
    formField.style.visibility = "hidden";
    formField.style.transform = "translateX(100vw)";
  }, 200);
}

async function selectContact(contactId) {
  const contactSection = document.getElementById("contact-section");
  const selectedContact = document.getElementById(`contactlist-item-${contactId}`);

  document.querySelectorAll('[id^="contactlist-item"]').forEach(contact => contact.classList.remove("bg-color-dg"));

  if (!selectedContact.classList.contains("bg-color-dg")) {
    selectedContact.classList.add("bg-color-dg");
    contactSection.classList.remove("d-none");
    await renderContactDetails(contactId);
  }
}

function showUpdateBar() {
  const updateBar = document.getElementById("update-bar");
  updateBar.classList.remove("d-none");

  updateBar.addEventListener("animationend", function(event) {
    if (event.animationName === "moveIn") {
      setTimeout(() => {
        updateBar.classList.add("move-out");
        updateBar.addEventListener("animationend", function(event) {
          if (event.animationName === "moveOut") {
            updateBar.classList.add("d-none");
          }
        });
      }, 200);
    }
  });
}

function generateProfileImage(name) {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#F3FF33", "#33FFF3"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const initials = name.split(" ").map(word => word.charAt(0).toUpperCase()).join("");
  
  const svgImage = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="${randomColor}" />
      <text x="50%" y="50%" dy=".3em" text-anchor="middle" font-size="32" fill="#FFF" font-family="Inter, sans-serif">${initials}</text>
    </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(svgImage)}`;
}

function sortContacts(contacts) {
  return Object.entries(contacts).sort(([, a], [, b]) => a.name.localeCompare(b.name));
}

function handleOutsideFormClick(event) {
  const section = document.getElementById("add-form-section");
  if (!section.contains(event.target) && !event.target.closest("#add-contact-btn")) {
    closeFormField();
  }
}
function handleOutsideEditFormClick(event) {
  const section = document.getElementById("edit-contact-section");
  if (!section.contains(event.target) && !event.target.closest("#edit-btn")) {
    closeEditField();
  }
}

function showEditForm(contactId) {
  const editField = document.getElementById("edit-contact-section");
  editField.classList.remove("d-none", "hidden");
  editField.style.visibility = "visible";
  editField.style.transform = "translateX(100vw)";
  editField.style.animation = "moveIn 200ms ease-in forwards";
  document.addEventListener("click", handleOutsideEditFormClick);

  const editForm = document.getElementById("edit-contact-form");
  editForm.setAttribute("data-id", contactId);
  loadEditFormData(contactId);
}

function closeEditField() {
  const editField = document.getElementById("edit-contact-section");
  ["edit-name", "edit-mail", "edit-phone"].forEach(id => document.getElementById(id).value = "");
  editField.style.animation = "moveOut 200ms ease-out forwards";
  
  setTimeout(() => {
    editField.classList.add("hidden", "d-none");
    editField.style.visibility = "hidden";
    editField.style.transform = "translateX(100vw)";
  }, 200);
}

async function loadEditFormData(contactId) {
  try {
    const response = await fetch(`https://join-19628-default-rtdb.firebaseio.com/contacts/${contactId}.json`);
    const contact = await response.json();
    
    document.getElementById("edit-name").value = contact.name;
    document.getElementById("edit-mail").value = contact.mail;
    document.getElementById("edit-phone").value = contact.phone;

    const editImageContainer = document.getElementById("prof2-img");
    if (editImageContainer) {
      editImageContainer.innerHTML = `<img src="${contact.img || generateProfileImage(contact.name)}" alt="Contact Image">`;
    }
  } catch (error) {
    console.error("Error loading edit form data:", error);
  }
}

async function updateContact(contactId, updatedContact) {
  try {
    const response = await fetch(`https://join-19628-default-rtdb.firebaseio.com/contacts/${contactId}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedContact),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    await updateContactList(); // Aktualisiere die Kontaktliste nach der Bearbeitung
    closeEditField();
  } catch (error) {
    console.error("Error updating contact:", error);
  }
}

function handleEditFormSubmit(event) {
  event.preventDefault();

  // Hole die ID des zu bearbeitenden Kontakts aus dem Datenattribut des Formulars
  const contactId = event.target.getAttribute("data-id");

  // Holt die aktualisierten Daten aus dem Formular
  const updatedContact = {
    name: document.getElementById("edit-name").value,
    mail: document.getElementById("edit-mail").value,
    phone: document.getElementById("edit-phone").value,
    img: document.getElementById("prof2-img").querySelector("img")?.src
  };

  // Aktualisiere den Kontakt mit der spezifischen ID
  updateContact(contactId, updatedContact);
}

