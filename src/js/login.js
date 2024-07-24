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

function goToPrivacy() {
  window.location.replace("/public/datenschutz.html");
}

function goToLegalNotice() {
  window.location.replace("/public/impressum.html");
}

function goToSignUp() {
  location.replace("/public/signup.html");
}

function goToSummary() {
  location.replace("/public/index.html");
}

document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("remember-me").checked;

    try {
      if (rememberMe) {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      } else {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
      }
      await firebase.auth().signInWithEmailAndPassword(email, password);
      goToSummary();
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error during login", errorCode, errorMessage);
      alert("Error: " + errorMessage);
    }
  });
