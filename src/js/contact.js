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
    setupFormListener();
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
      console.log(`Kontakt ${contact.name} ist bereits vorhanden.`);
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


function handleFormSubmit(event) {
  event.preventDefault();

  const newContact = {
    name: document.getElementById("name").value,
    mail: document.getElementById("mail").value,
    phone: document.getElementById("phone").value,
    img: document.getElementById("img").value,
  };

  postData(newContact);
  document.getElementById("contactForm").innerHTML = "";
}

function setupFormListener() {
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", handleFormSubmit);
}
