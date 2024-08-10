let allContacts = {
  names: [],
  mails: [],
  phones: [],
  images: [],
};

async function initContacts() {
  try {
    await getData("/");
    updateContactList();
  } catch (error) {
    console.log("Error:", error);
  }
}

async function getData(path = "") {
  try {
    let response = await fetch(
      `https://join-19628-default-rtdb.firebaseio.com/contacts${path}.json`
    );
    let responseToJson = await response.json();
    updateContacts(responseToJson);
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
}

async function deleteData(index) {
  try {
    const contactId = await getContactId(index);
    if (!contactId) {
      console.error("Kontakt-ID nicht gefunden.");
      return;
    }

    await fetch(
      `https://join-19628-default-rtdb.firebaseio.com/contacts/${contactId}.json`,
      { method: "DELETE" }
    );

    ["names", "mails", "phones", "images"].forEach((field) =>
      allContacts[field].splice(index, 1)
    );

    console.log(`Kontakt ${allContacts.names[index]} erfolgreich gelöscht.`);

    updateContactList();
    renderContactSection(index);
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
      "https://join-19628-default-rtdb.firebaseio.com/contacts" + ".json",
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
    await getData("/");
    updateContactList();
    showUpdateBar();
    //renderContactSection(contact); damit der aktuell erstellte kontakt sofort angezeigt wird, parameter stimmt noch nicht
  } catch (error) {
    console.error("Fehler beim Hochladen:", error);
  }
}

function updateContacts(responseToJson) {
  Object.values(responseToJson).forEach((contact) => {
    if (!isContactExisting(contact)) {
      allContacts.names.push(contact.name);
      allContacts.mails.push(contact.mail);
      allContacts.phones.push(contact.phone);
      allContacts.images.push(contact.img);
    } // else für wenn der kontakt bereits so existiert
  });
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

async function getContactId(index) {
  let response = await fetch(
    "https://join-19628-default-rtdb.firebaseio.com/contacts" + ".json"
  );
  let responseToJson = await response.json();
  let keys = Object.keys(responseToJson);

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
  return ["name", "mail", "phone", "img"].every((field) => {
    const contactArray = allContacts[`${field}s`];
    return Array.isArray(contactArray) && contactArray.includes(contact[field]);
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

function sortContacts() {
  let sortedIndices = allContacts.names
    .map((name, index) => index)
    .sort((a, b) => allContacts.names[a].localeCompare(allContacts.names[b]));
  ["names", "mails", "phones", "images"].forEach((field) => {
    allContacts[field] = sortedIndices.map(
      (index) => allContacts[field][index]
    );
  });
}

function renderSeperator(contactList, letter) {
  contactList.innerHTML += `
    <div class="contactlist-order-letter d-flex fw-400 fs-20 self-baseline">${letter}</div>
    <div class="contactlist-seperator "></div>
  `;
}
function renderListItems(contactList) {
  let currentLetter = "";
  for (let i = 0; i < allContacts.names.length; i++) {
    let firstLetter = allContacts.names[i].charAt(0).toUpperCase();
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      renderSeperator(contactList, currentLetter);
    }
    let imageSrc = allContacts.images[i]
      ? allContacts.images[i]
      : generateProfileImage(allContacts.names[i]);
    contactList.innerHTML += `
      <div id="contactlist-content(${i})" class="contactlist-content bradius10 d-flex-start flex-d-row" onclick="openContact(${i})">
        <img class="pointer d-flex" src="${imageSrc}"/>
        <div class="contactlist-databox flex-d-col">
          <div class="no-wrap-text fw-400 fs-20 pointer">${allContacts.names[i]}</div>
          <a class="color-lb fs-16 text-deco-n" href="mailto:${allContacts.mails[i]}">${allContacts.mails[i]}</a>
        </div>
      </div>
    `;
  }
}
function updateContactList() {
  let contactList = document.getElementById("contactlist-content");
  contactList.innerHTML = "";
  sortContacts();
  renderListItems(contactList);
}

function openContact(index) {
  let contactSection = document.getElementById("contact-section");
  let selectedContact = document.getElementById(
    `contactlist-content(${index})`
  );

  let allContacts = document.querySelectorAll('[id^="contactlist-content"]');
  allContacts.forEach((contact) => {
    contact.classList.remove("bg-color-dg");
  });

  if (
    contactSection.classList.contains("d-none") ||
    !selectedContact.classList.contains("bg-color-dg")
  ) {
    selectedContact.classList.add("bg-color-dg");
    contactSection.classList.remove("d-none");
    renderContactSection(index);
  } else {
    contactSection.classList.add("animate__animated", "animate__fadeOut");
    contactSection.addEventListener(
      "animationend",
      function () {
        contactSection.classList.add("d-none");
        contactSection.classList.remove("animate__fadeOut");
      },
      { once: true }
    );
  }
}

function renderContactSection(index) {
  let contactSection = document.getElementById("contact-section");
  contactSection.innerHTML = "";
  contactSection.innerHTML = `
    <div class="contact-information item-center d-flex">
      <img src="${allContacts.images[index]}" class="d-flex gap-10 obj-cover bradius70"/>
      <div class="d-flex flex-d-col gap-8 item-start flex-grow">
        <p class="mg-block-inline fw-500 no-wrap-text fs-47">${allContacts.names[index]}</p>
        <div class="contact-section-btn-box fw-400 d-flex-between l-height-19">
          <button class="bg-color-tr txt-center gap-8 b-unset pointer d-flex-center flex-d-row fs-16" onclick="showEditForm(${index})" id="edit-btn"><img class="obj-cover img-24" src="./img/edit.png">Edit</button>
          <button class="bg-color-tr txt-center gap-8 b-unset pointer d-flex-center flex-d-row fs-16" onclick="deleteData(${index})" id="del-btn"><img class="obj-cover img-24" src="./img/delete.png">Delete</button>
        </div>
      </div>
    </div>
    <div id="contact-information-content" class="d-flex flex-d-col no-wrap-text">
      <p class="fw-400 l-height-24 fs-20 mg-block-inline">Contact Information</p>
      <div class="contact-information-data d-flex flex-d-col gap-22">
        <div class="d-flex flex-d-col gap-15 text-left">
          <p class="fs-16 f-weight-700 no-wrap-text mg-block-inline l-height-19 txt-left"><b>Email</b></p>
          <a class="pointer color-lb text-deco-n" href="mailto:${allContacts.mails[index]}">${allContacts.mails[index]}</a>
        </div>
        <div class="d-flex flex-d-col gap-15 text-left">
          <p class="fs-16 f-weight-700 no-wrap-text mg-block-inline l-height-19 txt-left"><b>Phone</b></p>
          <p class="fs-16 fw-400 no-wrap-text mg-block-inline l-height-19 txt-left">${allContacts.phones[index]}</p>
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

function showEditForm(index) {
  document.getElementById("edit-contact-section").classList.remove("d-none");
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
  ["name", "mail", "phone"].forEach(
    (id) => (document.getElementById(id).value = "")
  );
  let formField = document.getElementById("add-form-section");
  formField.classList.add("move-out");
  if(formField.classList.contains('move-out')){     // schauen wir  nochmal
    formField.classList.add('d-none');
  }

}

function closeEditfield() {
  ["edit-name", "edit-mail", "edit-phone"].forEach(
    (id) => (document.getElementById(id).value = "")
  );
  document.getElementById("edit-contact-section").classList.add("d-none");
}

function openEditForm(index) {
  document.getElementById("edit-contact-section").classList.remove("d-none");
}
