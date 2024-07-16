let BASE_URL = "https://join-19628-default-rtdb.firebaseio.com/contacts";

function init() {
  getDataJson();
}

async function getDataJson() {
  let response = await fetch(BASE_URL); // einträge ziehgen
  let responseToJson = await response.json();
  console.log(responseToJson);
}
//funtion addContact{}
//function editContact
//function deleteContact
//function getImages{}
