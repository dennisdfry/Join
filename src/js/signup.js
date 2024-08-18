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
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(formData.mail, formData.password);
    const user = userCredential.user;
    const userId = user.uid;
    await saveUserData(userId, { name: formData.name, mail: formData.mail });
    try {
      await addContact({ name: nameInput.value, mail: mailInput.value, phone: '-'});
    } catch (error) {
      console.error("Error adding contact:", error);
      alert("There was an issue creating the contact.");
    }
    showSuccessMessage();
    clearInput();
  } catch (error) {
    alert("Error during sign up: " + error.message);
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

document.getElementById('confirm-password').addEventListener('input', validatePassword);

function validatePassword() {
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const errorMessage = document.getElementById('error-message');
  const confirmPasswordInput = document.getElementById('confirm-password');

  if (password !== confirmPassword) {
    confirmPasswordInput.classList.add('invalid');
    errorMessage.style.display = 'block';
  } else {
    confirmPasswordInput.classList.remove('invalid');
    errorMessage.style.display = 'none';
  }
}

function passwordValidation(password, confirm, checkbox) {
  return new Promise((resolve) => {
    if (password !== confirm) {
      resolve(false);
    } else if (!checkbox) {
      alert("Sie müssen die Privacy Policy akzeptieren.");
      resolve(false);
    } else {
      resolve(true);
    }
  });
}

async function saveUserData(userId, userData) {
  await firebase.database().ref('users/' + userId).set(userData);
}

function showSuccessMessage() {
  const successBody = document.querySelector('.successBody');
  const successSignup = document.getElementById('successSignup');
  successBody.classList.remove('d-none');  
  successBody.style.backgroundColor = 'rgba(0,0,0,0.2)';
  setTimeout(() => {
    successSignup.classList.add('show');
  }, 100);
  setTimeout(() => {
    home();
  }, 1000);
}

function clearInput() {
  document.getElementById("name").value = "";
  document.getElementById("mail").value = "";
  document.getElementById("password").value = "";
  document.getElementById("confirm-password").value = "";
  document.getElementById("checkbox").checked = false;
}

document.addEventListener('DOMContentLoaded', function () {
  function validateForm() {
    const isFormValid =
      nameInput.value.trim() !== '' &&
      mailInput.value.trim() !== '' &&
      passwordInput.value.trim() !== '' &&
      confirmPasswordInput.value.trim() !== '';

    submitButton.disabled = !isFormValid;
    if (isFormValid) {
      submitButton.classList.remove('disabled')
    } else {
      submitButton.classList.add('disabled');
    }
  }
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', validateForm);
  });
  validateForm();
});

/**
 * Initializes event listeners for password and confirm password input fields.
 * Utilizes global variables defined in `variables.js`.
 * 
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function() {
  updateIconVisibility();

  passwordInput.addEventListener('input', updateIconVisibility);
  confirmPasswordInput.addEventListener('input', updateIconVisibility);

  togglePassword.addEventListener('click', function() {
    updatePasswordVisibility(passwordInput, togglePassword);
  });

  toggleConfirmPassword.addEventListener('click', function() {
    updatePasswordVisibility(confirmPasswordInput, toggleConfirmPassword);
  });
});

/**
 * Toggles the visibility of a password input field between text and password.
 * 
 * @param {HTMLInputElement} input - The password input field.
 * @param {HTMLImageElement} toggle - The image element used to toggle visibility.
 * 
 * Variables `passwordInput`, `confirmPasswordInput`, `togglePassword`, 
 * and `toggleConfirmPassword` are defined globally in `variables.js`.
 */
function updatePasswordVisibility(input, toggle) {
  if (input.type === 'password') {
    input.type = 'text';
    toggle.src = '/public/img/password-show.png';
  } else {
    input.type = 'password';
    toggle.src = '/public/img/password-hidden.png';
  }
}

/**
 * Updates the icon visibility based on the content of the password input fields.
 * 
 * Variables `passwordInput`, `confirmPasswordInput`, `togglePassword`, 
 * and `toggleConfirmPassword` are defined globally in `variables.js`.
 */
function updateIconVisibility() {
  if (passwordInput.value.length > 0) {
    togglePassword.src = '/public/img/password-hidden.png';
  } else {
    togglePassword.src = '/public/img/lock.png';
  }

  if (confirmPasswordInput.value.length > 0) {
    toggleConfirmPassword.src = '/public/img/password-hidden.png';
  } else {
    toggleConfirmPassword.src = '/public/img/lock.png';
  }
}

