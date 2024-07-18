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

document.addEventListener("DOMContentLoaded", init);
