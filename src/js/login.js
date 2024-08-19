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

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const animatedDiv = document.getElementById("login-logo");
    const animatedImg = document.getElementById("login-logo-animated");
    const fadeoutDiv = document.getElementById("fadeout");

    animatedDiv.style.position = "fixed";
    animatedDiv.style.top = "-6.4%";
    animatedDiv.style.left = "-1.1%";

    animatedImg.classList.add("shrink");
    fadeoutDiv.classList.add("fadeout-animate");
    fadeoutDiv.addEventListener("animationend", function () {
      fadeoutDiv.classList.add("d-none");
    });
  }, 500);
});

document.querySelector(".submit-guest-login-btn").addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.setItem("user", "Guest");
    goToSummary();
  });

document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password-login");
  const togglePassword = document.getElementById("toggle-password-login");

  updateIconVisibility();

  passwordInput.addEventListener("input", updateIconVisibility);

  togglePassword.addEventListener("click", function () {
    updatePasswordVisibility(passwordInput, togglePassword);
  });
});

function updatePasswordVisibility(input, toggle) {
  if (input.type === "password") {
    input.type = "text";
    toggle.src = "/public/img/password-show.png";
  } else {
    input.type = "password";
    toggle.src = "/public/img/password-hidden.png";
  }
}

function updateIconVisibility() {
  const passwordInput = document.getElementById("password-login");
  const togglePassword = document.getElementById("toggle-password-login");

  if (passwordInput.value.length > 0) {
    togglePassword.src = "/public/img/password-hidden.png";
  } else {
    togglePassword.src = "/public/img/lock.png";
  }
}
