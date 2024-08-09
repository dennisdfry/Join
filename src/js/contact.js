async function initContacts() {
  try {
    await getData("/");
    renderContactList();
  } catch (error) {
    console.log("Error:", error);
  }
}

async function getData(path = "") {
  let response = await fetch("https://join-19628-default-rtdb.firebaseio.com/contacts" + path + ".json");
  let data = await response.json();
  return data;
}

async function deleteData(index) {
  try {
    const contactId = await getContactId(index);
    if (!contactId) {
      console.error("Kontakt-ID nicht gefunden.");
      return;
    }

    await fetch(`https://join-19628-default-rtdb.firebaseio.com/contacts/${contactId}.json`, { method: "DELETE" });
    console.log(`Kontakt erfolgreich gelöscht.`);
    renderContactList();
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
  }
}

async function postData(contact) {
  try {
    if (!contact.img) {
      contact.img = generateProfileImage(contact.name);
    }

    await fetch("https://join-19628-default-rtdb.firebaseio.com/contacts.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

    console.log("Erfolgreich hochgeladen.");
    renderContactList();
  } catch (error) {
    console.error("Fehler beim Hochladen:", error);
  }
}

async function getContactId(index) {
  let contacts = await getData("/");
  let contactKeys = Object.keys(contacts);
  return contactKeys[index];
}

function generateProfileImage(name) {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#F3FF33", "#33FFF3"];
  let randomColor = colors[Math.floor(Math.random() * colors.length)];
  let initials = name.split(" ").map(word => word[0].toUpperCase()).join("");

  let newContactImg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="${randomColor}" />
      <text x="50%" y="50%" dy=".3em" text-anchor="middle" font-size="32" fill="#FFF" font-family="Inter, sans-serif">${initials}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(newContactImg)}`;
}

function sortContacts(contacts) {
  return Object.keys(contacts).sort((a, b) => {
    return contacts[a].name.localeCompare(contacts[b].name);
  });
}

function renderCurrentLetter(contactList, letter) {
  contactList.innerHTML += `
    <div class="contactlist-order-letter d-flex fw-400 fs-20 self-baseline">${letter}</div>
    <div class="contactlist-seperator "></div>
  `;
}

async function processContacts(contactList) {
  let contacts = await getData("/");
  let sortedContactKeys = sortContacts(contacts);
  let currentLetter = "";

  sortedContactKeys.forEach(key => {
    let contact = contacts[key];
    let firstLetter = contact.name.charAt(0).toUpperCase();
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      renderCurrentLetter(contactList, currentLetter);
    }

    let imageSrc = contact.img ? contact.img : generateProfileImage(contact.name);

    contactList.innerHTML += `
      <div id="contactlist-content(${key})" class="contactlist-content bradius10 d-flex-start flex-d-row" onclick="openContact('${key}')">
        <img class="pointer d-flex" src="${imageSrc}"/>
        <div class="contactlist-databox flex-d-col">
          <div class="no-wrap-text fw-400 fs-20 pointer">${contact.name}</div>
          <a class="color-lb fs-16 text-deco-n" href="mailto:${contact.mail}">${contact.mail}</a>
        </div>
      </div>
    `;
  });
}

async function renderContactList() {
  let contactList = document.getElementById("contactlist-content");
  contactList.innerHTML = "";
  await processContacts(contactList);
  setupForm();
}

async function openContact(index) {
  let contactSection = document.getElementById("contact-section");
  let contactList = document.getElementById(`contactlist-content(${index})`);

  if (contactList.classList.contains("bg-color-dg")) {
    contactList.classList.remove("bg-color-dg");
    contactSection.classList.add("d-none");
  } else {
    contactList.classList.add("bg-color-dg");
    contactSection.classList.remove("d-none");
    renderContactSection(index);
  }
}

async function renderContactSection(index) { // ich denkke es liegt an erstellen  des images //
  let contactSection = document.getElementById("contact-section");
  contactSection.innerHTML = "";

  let contacts = await getData("/");
  let contactKeys = Object.keys(contacts);
  let contact = contacts[contactKeys[index]];

  contactSection.innerHTML = `
    <div class="contact-information item-center d-flex">
      <img src="${contact.img}" class="d-flex gap-10 obj-cover bradius70"/>
      <div class="d-flex flex-d-col gap-8 item-start flex-grow">
        <p class="mg-block-inline fw-500 no-wrap-text fs-47">${contact.name}</p>
        <div class="contact-section-btn-box fw-400 d-flex-between l-height-19">
          <button class="bg-color-tr txt-center gap-8 b-unset pointer d-flex-center flex-d-row fs-16" onclick="openEditForm('${index}')" id="edit-btn"><img class="obj-cover img-24" src="./img/edit.png">Edit</button>
          <button class="bg-color-tr txt-center gap-8 b-unset pointer d-flex-center flex-d-row fs-16" onclick="deleteData('${index}')" id="del-btn"><img class="obj-cover img-24" src="./img/delete.png">Delete</button>
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

function setupForm() {
  const form = document.getElementById("contact-form");
  form.addEventListener("submit", formSubmit);
}

function showFormField() {
  document.getElementById("add-form-section").classList.remove("d-none");
  document.addEventListener("click", outsideForm);
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
  ["add-form-name", "add-form-mail", "add-form-phone"].forEach(
    (id) => (document.getElementById(id).value = "")
  );
  document.getElementById("add-form-section").classList.add("d-none");
}

function openEditForm(index) {
  document.getElementById("edit-contact-section").classList.remove("d-none");
}