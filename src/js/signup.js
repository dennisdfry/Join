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

function home() {
  window.location.replace("/public/login.html");
}

async function signUp(event) {
  event.preventDefault();
  const formData = getFormData();

  if (!(await passwordValidation(formData.password, formData.confirm, formData.checkbox))) {
    return false;
  }

  try {
    await handleUserSignUp(formData);
    showSuccessMessage("You Signed Up successfully");
    clearInput();
  } catch (error) {
    alert("Error saving data: " + error.message);
  }

  return true;
}

function getFormData() {
  return {
    name: document.getElementById("name").value,
    mail: document.getElementById("mail").value,
    password: document.getElementById("password").value,
    confirm: document.getElementById("confirm-password").value,
    checkbox: document.getElementById("checkbox").checked,
  };
}

function passwordValidation(password, confirm, checkbox) {
  return new Promise((resolve) => {
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

async function handleUserSignUp(formData) {
  const userId = await generateUniqueId();
  const userData = { id: userId, ...formData };
  await saveUserData(userId, userData);
}

function showSuccessMessage(message) {
  updateButtonText(message);
  setTimeout(() => {
    updateButtonText("Sign up");
  }, 2000);
}

function clearInput() {
  document.getElementById("name").value = "";
  document.getElementById("mail").value = "";
  document.getElementById("password").value = "";
  document.getElementById("confirm-password").value = "";
  document.getElementById("checkbox").checked = false;
}

function generateUniqueId() {
  return firebase.database().ref("users").push().key;
}

async function saveUserData(userId, userData) {
  await firebase
    .database()
    .ref("users/" + userId)
    .set(userData);
}

function updateButtonText(newText) {
  document.getElementById("success").textContent = newText;
}
