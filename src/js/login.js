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

document.addEventListener("DOMContentLoaded", function() {
  setTimeout(() => {
      const animatedDiv = document.getElementById('login-logo');
      const animatedImg = document.getElementById('login-logo-animated');
      const fadeoutDiv = document.getElementById('fadeout');
      
      animatedDiv.style.position = 'fixed';
      animatedDiv.style.top = '-6%';
      animatedDiv.style.left = '1%';

      animatedImg.classList.add('shrink');
      fadeoutDiv.classList.add('fadeout-animate');
      fadeoutDiv.addEventListener('animationend', function() {
        fadeoutDiv.classList.add('d-none');
      });
  }, 500);
});