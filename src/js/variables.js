const nameInput = document.getElementById('name');
const mailInput = document.getElementById('mail');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const submitButton = document.getElementById('success');
const togglePassword = document.getElementById('toggle-password');
const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
const ACTIVE_CLASS = "active-contact";
const CONTACTS_URL = "https://join-19628-default-rtdb.firebaseio.com/contacts";
const HEADERS = { "Content-Type": "application/json" };