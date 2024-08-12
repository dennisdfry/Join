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
