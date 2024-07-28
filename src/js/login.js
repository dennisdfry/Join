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
    console.log("Error during login", error.code, error.message);
    alert("Error: " + error.message);
  }
});