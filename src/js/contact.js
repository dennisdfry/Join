let BASE_URL = "https://join-19628-default-rtdb.firebaseio.com/contacts";

let allContacts = {
  names: [],
  mails: [],
  phones: [],
  images: [],
};

async function init() {
  try {
    await getData("/");
    setupOverlay();
    setupForm();
 
  } catch (error) {
    console.log("Error:", error);
  }
}

async function getData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  updateContacts(responseToJson);
  console.log(responseToJson);
  setupContacts();
}

function setupContacts() {
  let contactList = document.getElementById("contactlist-content");
  contactList.innerHTML = "";

  for (let i = 0; i < allContacts.names.length; i++) {
    contactList.innerHTML += `
    <div class="contactlist-overlay">
      <img class="pll-24" src="${allContacts.images[i]}" alt="Contact Image"/>
      <div class="contactlist-data-box">
        <div class="contactlist-data-name">${allContacts.names[i]}</div>
        <a class="contactlist-data-mail" href="mailto:${allContacts.mails[i]}">${allContacts.mails[i]}</a>
      </div>
    </div>
    `;
  }
setupContactSection();
}

function setupContactSection() {
  let contactSection = document.getElementById("contact-section");

  for (let i = 0; i < allContacts.names.length; i++) {
    contactSection.innerHTML += `
      <div class="contact-section-content">
        <img src="${allContacts.images[i]}" alt="Profile Image" />
        <div class="contact-section-overlay">
          <p>${allContacts.names[i]}</p>
          <div class="contact-section-btn-box">
            <button onclick="editContact(${i})" id="edit-btn">Edit<img src="./img/edit.png"></button>
            <button onclick="deleteContact(${i})" id="del-btn">Delete<img src="./img/delete.png"></button>
          </div>
        </div>
      </div>

      <div id="contact-section-information">
        <p class="information-details-headline">Contact Information</p>
        <p class="contact-section-details"><b>Email</b></p>
        <a class="contact-section-link" href="mailto:${allContacts.mails[i]}">${allContacts.mails[i]}</a>
        <p class="contact-section-details"><b>Phone</b></p>
        <p class="contact-section-details">${allContacts.phones[i]}</p>
      </div>
    `;
  }
}


function updateContacts(responseToJson) {
  let keys = Object.keys(responseToJson);
  for (let i = 0; i < keys.length; i++) {
    let contact = responseToJson[keys[i]];
    if (!isContactExisting(contact)) {
      allContacts.names.push(contact.name);
      allContacts.mails.push(contact.mail);
      allContacts.phones.push(contact.phone);
      allContacts.images.push(contact.img);
    } else {
      console.log(
        `${contact.name}, mit der Nummer:${contact.phone}, ist bereits vorhanden.`
      );
    }
  }
  console.log(allContacts);
  
}

function isContactExisting(contact) {
  return (
    allContacts.names.includes(contact.name) &&
    allContacts.mails.includes(contact.mail) &&
    allContacts.phones.includes(contact.phone) &&
    allContacts.images.includes(contact.img)
  );
}

async function postData(contact) {
  try {
    let response = await fetch(BASE_URL + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

    let responseToJson = await response.json();
    console.log("Erfolgreich hochgeladen:", responseToJson);

    allContacts.names.push(contact.name);
    allContacts.mails.push(contact.mail);
    allContacts.phones.push(contact.phone);
    allContacts.images.push(contact.img);

    await getData("/");
  } catch (error) {
    console.error("Fehler beim Hochladen:", error);
  }
  setupContacts();
}

function addContact() {
  let overlay = document.getElementById("add-contact-overlay");
  let contactForm = document.getElementById("contact-form");
  let btn = document.getElementById("add-contact-section");

  overlay.classList.remove("d-none");
  contactForm.classList.remove("d-none");
  btn.classList.remove("d-none");
}

function handleFormSubmit(event) {
  event.preventDefault();

  const newContact = {
    name: document.getElementById("name").value,
    mail: document.getElementById("mail").value,
    phone: document.getElementById("phone").value,
    img: document.getElementById("img").value,
  };

  postData(newContact);
}

function setupForm() {
  const form = document.getElementById("contact-form");
  form.addEventListener("submit", handleFormSubmit);
}

function setupOverlay() {
  const overlay = document.getElementById("add-contact-overlay");
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      document.getElementById("contact-form").classList.add("d-none");
      document.getElementById("add-contact-section").classList.add("d-none");
      overlay.classList.add("d-none");
    }
  });
}

function closeOverlay() {
  document.getElementById('id="exitBtn');
  document.getElementById("formfield-cancel-btn");
  document.getElementById("contact-form").classList.add("d-none");
  document.getElementById("add-contact-section").classList.add("d-none");
  overlay.classList.add("d-none");
}

document.addEventListener("DOMContentLoaded", init);
