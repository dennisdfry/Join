const firebaseConfig = {
  apiKey: "AIzaSyDZv_Y7rO7cD6zajbn8N2xjTCRXirodJ_w",
  authDomain: "join-19628.firebaseapp.com",
  databaseURL: "https://join-19628-default-rtdb.firebaseio.com",
  projectId: "join-19628",
  storageBucket: "join-19628.appspot.com",
  messagingSenderId: "828382956671",
  appId: "1:828382956671:web:f180ef915a3607d86bc34a",
};

firebase.initializeApp(firebaseConfig);

function home(){
    window.location.replace('/public/login.html');
}
    
async function signUp(event) {
  event.preventDefault();
  let name = document.getElementById("name").value;
  let mail = document.getElementById("mail").value;
  let password = document.getElementById("password").value;
  let confirm = document.getElementById("confirm-password").value;
  let checkbox = document.getElementById("checkbox").checked;

  const isValid = await passwordValidation(password, confirm, checkbox);
  if (!isValid) {
    return false;
  }

  try {
    let userId = await generateUniqueId();
    let userData = {
      id: userId,
      name: name,
      email: mail,
      password: password,
    };

    await firebase.database().ref("users/" + userId).set(userData);
    document.getElementById('success').textContent = "You Signed Up successfully";
    clearInput();
  } catch (error) {
    alert("Error saving data: " + error.message);
  }

  return true;
}

function generateUniqueId() {
  return firebase.database().ref("users").push().key;
}

function clearInput() {
  document.getElementById("name").value = "";
  document.getElementById("mail").value = "";
  document.getElementById("password").value = "";
  document.getElementById("confirm-password").value = "";
  document.getElementById("checkbox").checked = false;
}

function passwordValidation(password, confirm, checkbox) {
  return new Promise((resolve, reject) => {
    if (password !== confirm) {
      alert("Passwörter stimmen nicht überein.");
      resolve(false);
    } else if (!checkbox) {
      alert("Sie müssen die Privacy Policy akzeptieren.");
      resolve(false);
    } else {
      resolve(true);
    }
  });
}
