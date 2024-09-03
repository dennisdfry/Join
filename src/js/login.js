function goToPrivacy() {
  window.location.replace("/public/login-datenschutz.html");
}

function goToLegalNotice() {
  window.location.replace("/public/login-impressum.html");
}

function goToSignUp() {
  location.replace("/public/signup.html");
}

function goToSummary() {
  location.replace("/public/index.html");
}

/**
 * Handles the login form submission. Authenticates the user with Firebase based on email and password.
 * Sets persistence based on the "Remember Me" checkbox.
 * 
 * @param {Event} e - The submit event triggered by the login form.
 * @async
 */
document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password-login").value;
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
    toggleElement(".error-message", "d-none");
    toggleElement(".input-password", "input-invalid");
    toggleElement(".input-mail", "input-invalid");
  }
});

/**
 * Animates the login logo and handles the fadeout effect on page load.
 * 
 * @listens DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const animatedDiv = document.getElementById("login-logo");
    const animatedImg = document.getElementById("login-logo-animated");
    const fadeoutDiv = document.getElementById("fadeout");

    animatedDiv.style.position = "fixed";
    animatedDiv.style.top = "-0.4%";
    animatedDiv.style.left = "2%";

    animatedImg.classList.add("shrink");
    fadeoutDiv.classList.add("fadeout-animate");
    fadeoutDiv.addEventListener("animationend", function () {
      fadeoutDiv.classList.add("d-none");
    });
  }, 500);
});

/**
 * Handles guest login by setting a local storage item and navigating to the summary page.
 * 
 * @param {Event} e - The click event triggered by the guest login button.
 */
document.querySelector(".submit-guest-login-btn").addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.setItem("user", "Guest");
  goToSummary();
});

/**
 * Initializes event listeners for the password input field and toggle button on page load.
 * 
 * @listens DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password-login");
  const togglePassword = document.getElementById("toggle-password-login");

  updateIconVisibility();

  passwordInput.addEventListener("input", updateIconVisibility);

  togglePassword.addEventListener("click", function () {
    updatePasswordVisibility(passwordInput, togglePassword);
  });
});

/**
 * Toggles the visibility of the password input field between text and password.
 * 
 * @param {HTMLInputElement} input - The password input field.
 * @param {HTMLImageElement} toggle - The image element used to toggle visibility.
 */
function updatePasswordVisibility(input, toggle) {
  if (input.type === "password") {
    input.type = "text";
    toggle.src = "/public/img/password-show.png";
  } else {
    input.type = "password";
    toggle.src = "/public/img/password-hidden.png";
  }
}

/**
 * Updates the password toggle icon visibility based on the content of the password input field.
 */
function updateIconVisibility() {
  const passwordInput = document.getElementById("password-login");
  const togglePassword = document.getElementById("toggle-password-login");

  if (passwordInput.value.length > 0) {
    togglePassword.src = "/public/img/password-hidden.png";
  } else {
    togglePassword.src = "/public/img/lock.png";
  }
}
