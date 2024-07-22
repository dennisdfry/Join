const firebaseConfig = {
  apiKey: FB_API_KEY,
  authDomain: FB_AUTH_DOMAIN,
  databaseURL: FB_DATABASE_URL,
  projectId: FB_PROJECT_ID,
  storageBucket: FB_STORAGE_BUCKET,
  messagingSenderId: FB_MESSAGING_SENDER_ID,
  appId: FB_APP_ID,
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
