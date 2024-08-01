let nameInput, mailInput, passwordInput, confirmPasswordInput, submitButton;

document.addEventListener('DOMContentLoaded', function () {
  nameInput = document.getElementById('name');
  mailInput = document.getElementById('mail');
  passwordInput = document.getElementById('password');
  confirmPasswordInput = document.getElementById('confirm-password');
  submitButton = document.getElementById('success');
});

export { nameInput, mailInput, passwordInput, confirmPasswordInput, submitButton };
