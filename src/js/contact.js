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
  } catch (error) {
    console.log("error");
  }
}
async function getData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  let keys = Object.keys(responseToJson);

  for (let i = 0; i < keys.length; i++) {
    let contact = responseToJson[keys[i]];
      allContacts.names.push(contact.name);
      allContacts.mails.push(contact.mail);
      allContacts.phones.push(contact.phone);
      allContacts.images.push(contact.img);  
    }

  console.log(allContacts);
}

