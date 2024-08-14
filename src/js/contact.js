async function initContacts() {
  try {
    await updateContactList();
  } catch (error) {
    console.log("Error:", error);
  }
}

async function deleteData(contactId) {
  try {
    await fetch(
      `https://join-19628-default-rtdb.firebaseio.com/contacts/${contactId}.json`,
      { method: "DELETE" }
    );

    console.log(`Kontakt mit ID ${contactId} erfolgreich gelöscht.`);

    await updateContactList();
    closeEditfield();
    await renderContactSection(contactId);
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
  }
}

async function postData(contact) {
  try {
    if (!contact.img) {
      contact.img = generateProfileImage(contact.name);
    }

    let response = await fetch(
      "https://join-19628-default-rtdb.firebaseio.com/contacts.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      }
    );

    let responseToJson = await response.json();
    console.log("Erfolgreich hochgeladen:", responseToJson);

    
    await renderContactSection(responseToJson.name); 
    updateContactList();
    showUpdateBar();
  } catch (error) {
    console.error("Fehler beim Hochladen:", error);
  }
}


function showUpdateBar() {
  let updateBar = document.getElementById("update-bar");
  updateBar.classList.remove("d-none");

  updateBar.addEventListener("animationend", function (event) {
    if (event.animationName === "moveIn") {
      setTimeout(function () {
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

function generateProfileImage(name) {
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#F3FF33",
    "#33FFF3",
  ];
  let randomColor = colors[Math.floor(Math.random() * colors.length)];
  let initials = name
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  let newContactImg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="${randomColor}" />
      <text x="50%" y="50%" dy=".3em" text-anchor="middle" font-size="32" fill="#FFF" font-family="Inter, sans-serif">${initials}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(newContactImg)}`;
}

function renderSeperator(contactList, letter) {
  contactList.innerHTML += `
    <div class="contactlist-order-letter d-flex fw-400 fs-20 self-baseline">${letter}</div>
    <div class="contactlist-seperator "></div>
  `;
}

async function renderListItems(contactList, sortedContacts) {
  contactList.innerHTML = "";
  let currentLetter = "";

  sortedContacts.forEach(([id, contact]) => {
    let firstLetter = contact.name.charAt(0).toUpperCase();
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      renderSeperator(contactList, currentLetter);
    }

    let imageSrc = contact.img || generateProfileImage(contact.name);
    contactList.innerHTML += `
      <div id="contactlist-content(${id})" class="contactlist-content bradius10 d-flex-start flex-d-row" onclick="openContact('${id}')">
        <img class="d-flex pointer" src="${imageSrc}"/>
        <div class="contactlist-databox flex-d-col">
          <div class="pointer no-wrap-text fw-400 fs-20 pointer">${contact.name}</div>
          <a class="pointer color-lb fs-16 text-deco-n" href="mailto:${contact.mail}">${contact.mail}</a>
        </div>
      </div>
    `;
  });
}

function sortContacts(contacts) {
  return Object.entries(contacts)
    .sort(([idA, contactA], [idB, contactB]) => contactA.name.localeCompare(contactB.name));
}

async function updateContactList() {
  let contactList = document.getElementById("contactlist-content");
  contactList.innerHTML = "";

  const response = await fetch(
    "https://join-19628-default-rtdb.firebaseio.com/contacts.json"
  );
  const contacts = await response.json();
  const sortedContacts = sortContacts(contacts);
  await renderListItems(contactList, sortedContacts);
}

async function openContact(contactId) {
  let contactSection = document.getElementById("contact-section");
  let selectedContact = document.getElementById(`contactlist-content(${contactId})`);

  document.querySelectorAll('[id^="contactlist-content"]').forEach((contact) => {
    contact.classList.remove("bg-color-dg");
  });

  if (
    contactSection.classList.contains("d-none") ||
    !selectedContact.classList.contains("bg-color-dg")
  ) {
    selectedContact.classList.add("bg-color-dg");
    contactSection.classList.remove("d-none");
    await renderContactSection(contactId);
  }
}

async function renderContactSection(contactId) {
  let contactSection = document.getElementById("contact-section");
  contactSection.innerHTML = "";

  const response = await fetch(
    `https://join-19628-default-rtdb.firebaseio.com/contacts/${contactId}.json`
  );
  const contact = await response.json();

  contactSection.innerHTML = `
  <div class="animation-100">
    <div class="contact-information item-center d-flex">
      <img src="${contact.img || generateProfileImage(contact.name)}" class="d-flex gap-10 obj-cover bradius70"/>
      <div class="d-flex flex-d-col gap-8 item-start flex-grow">
        <p class="mg-block-inline fw-500 no-wrap-text fs-47">${contact.name}</p>
        <div class="contact-section-btn-box fw-400 d-flex-between l-height-19">
          <button class="bg-color-tr txt-center gap-8 b-unset pointer d-flex-center flex-d-row fs-16" onclick="showEditForm('${contactId}')" id="edit-btn"><img class="obj-cover img-24" src="./img/edit.png">Edit</button>
          <button class="bg-color-tr txt-center gap-8 b-unset pointer d-flex-center flex-d-row fs-16" onclick="deleteData('${contactId}')" id="del-btn"><img class="obj-cover img-24" src="./img/delete.png">Delete</button>
        </div>
      </div>
    </div>
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

function formSubmit(event) {
  event.preventDefault();
  const fields = ["name", "mail", "phone", "prof-img"];
  const newContact = Object.fromEntries(
    fields.map((field) => [
      field === "prof-img" ? "img" : field,
      document.getElementById(field).value,
    ])
  );
  postData(newContact);
  closeFormfield();
}

function showFormField() {
  let formField = document.getElementById("add-form-section");
  formField.classList.remove("d-none");
  formField.classList.remove("hidden");
  formField.style.visibility = "visible";
  formField.style.transform = "translateX(100vw)";
  formField.style.animation = "moveIn 200ms ease-in forwards";
  document.addEventListener("click", outsideForm);
}

function setupForm() {
  const addForm = document.getElementById("contact-form");
  addForm.addEventListener("submit", formSubmit);
  const editForm = document.getElementById("edit-contact-form");
  editForm.addEventListener("submit", editFormSubmit);
}

function showEditForm(contactId) {
  let editField = document.getElementById("edit-contact-section");
  editField.classList.remove("d-none");
  editField.classList.remove("hidden");
  editField.style.visibility = "visible";
  editField.style.transform = "translateX(100vw)";
  editField.style.animation = "moveIn 200ms ease-in forwards";
  document.addEventListener("click", outsideForm);
  loadEditFormData(contactId);
}

function outsideForm(event) {
  let section = document.getElementById("add-form-section");
  if (
    !section.contains(event.target) &&
    !event.target.closest("#add-contact-btn")
  ) {
    closeFormfield();
  }
}

function closeFormfield() {
  let formField = document.getElementById("add-form-section");
  ["name", "mail", "phone"].forEach(
    (id) => (document.getElementById(id).value = "")
  );
  formField.style.animation = "moveOut 200ms ease-out forwards";

  setTimeout(() => {
    formField.classList.add("hidden");
    formField.style.visibility = "hidden";
    formField.style.transform = "translateX(100vw)";
    formField.classList.add("d-none");
  }, 200);
}

function closeEditfield() {
  let editField = document.getElementById("edit-contact-section");

  ["edit-name", "edit-mail", "edit-phone"].forEach(
    (id) => (document.getElementById(id).value = "")
  );
  editField.style.animation = "moveOut 200ms ease-out forwards";
  setTimeout(() => {
    editField.classList.add("hidden");
    editField.style.visibility = "hidden";
    editField.style.transform = "translateX(100vw)";
    editField.classList.add("d-none");
  }, 200);
}

async function loadEditFormData(contactId) {
  const response = await fetch(
    `https://join-19628-default-rtdb.firebaseio.com/contacts/${contactId}.json`
  );
  const contact = await response.json();

  document.getElementById("edit-name").value = contact.name;
  document.getElementById("edit-mail").value = contact.mail;
  document.getElementById("edit-phone").value = contact.phone;

  let editImage = document.getElementById("prof2-img");
  if (editImage) {
    editImage.innerHTML = `<img src="${contact.img || generateProfileImage(contact.name)}" alt="Contact Image">`;
  }
}

async function editFormSubmit(event) {
  event.preventDefault();

  const contactId = event.target.getAttribute("data-id");

  const fields = ["edit-name", "edit-mail", "edit-phone"];
  const updatedContact = Object.fromEntries(
    fields.map((field) => [
      field.replace("edit-", ""),
      document.getElementById(field).value,
    ])
  );

  await fetch(
    `https://join-19628-default-rtdb.firebaseio.com/contacts/${contactId}.json`,
    {
      method: "PATCH",
      body: JSON.stringify(updatedContact),
    }
  );

  await updateContactList();
  closeEditfield();
}