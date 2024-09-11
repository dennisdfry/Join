/**
 * Initializes event listeners for the contact form.
 * - Adds a submit listener to process the form.
 * - Adds input listeners to validate form fields.
 * - Checks if all required fields are filled and enables or disables the submit button accordingly.
 */
function setupForm() {
  document.getElementById("contact-form").addEventListener("submit", handleFormSubmit);
  ["name", "mail", "phone"].forEach((id) => {
    document.getElementById(id).addEventListener("input", checkFormFields);
    document.getElementById(id).addEventListener("keydown", handleEnterPress);
  });
  checkFormFields();
}

/**
 * Checks if all required fields are filled and enables or disables the submit button accordingly.
 */
function checkFormFields() {
  let filledFields = ["name", "mail", "phone"].every((id) => document.getElementById(id).value.trim());
  document.getElementById("formfield-create-btn").disabled = !filledFields;
}

/**
 * Checks if the Enter key is pressed and triggers the form submit event.
 * @param {KeyboardEvent} event - The keyboard event object.
 */
function handleEnterPress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    handleFormSubmit(event);
  }
}

/**
 * Handles the form submission to add a new contact.
 * @param {Event} event - The form submit event object.
 */
function handleFormSubmit(event) {
  event.preventDefault();

  let [name, mail, phone] = ["name", "mail", "phone"].map(id => document.getElementById(id).value.trim());

  if (![name, validateEmail(mail), validatePhone(phone)].every(Boolean)) {
    ["name", "mail", "phone"].forEach(id => 
      document.getElementById(id).classList.toggle("input-error", !document.getElementById(id).value.trim())
    );
    return;
  }

  addContact({ name: capitalizeFirstLetter(name), mail, phone, img: document.getElementById("prof-img").value });
  closeFormField();
}


/**
 * Validates an email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates a phone number.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} - Returns true if the phone number is valid, otherwise false.
 */
function validatePhone(phone) {
  return /^\+?[0-9]{10,16}$/.test(phone);
}

/**
 * Capitalizes the first letter of a name.
 * @param {string} name - The contact's name.
 * @returns {string} - The name with the first letter capitalized.
 */
function capitalizeFirstLetter(name) {
  let words = name.split(" ");
  if (words.length >= 2) {
    return capitalizeSecondLetter(words);
  }
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/**
 * Capitalizes the first letter of each word in a name.
 * @param {Array<string>} words - An array of words to capitalize.
 * @returns {string} - The capitalized words as a single string.
 */
function capitalizeSecondLetter(words) {
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}

/**
 * Displays the contact form with animation.
 * @param {string} formId - The ID of the form to display.
 * @param {string} overlayId - The ID of the overlay to display.
 * @param {Function} outsideClickHandler - The function to handle clicks outside the form.
 */
function showForm(formId, overlayId, outsideClickHandler) {
  let formField = document.getElementById(formId);
  document.getElementById(overlayId).classList.remove("d-none");
  formField.classList.remove("d-none", "hidden");
  formField.style.cssText = "visibility: visible; transform: translateX(100vw); animation: moveIn 200ms ease-in forwards";
  document.addEventListener("click", outsideClickHandler);
}

/**
 * Closes a form by hiding the form element and applying an animation.
 * @param {string} formId - The ID of the form to close.
 * @param {string} overlayId - The ID of the overlay to hide.
 * @param {Array<string>} fieldIds - An array of field IDs to reset.
 */
function closeForm(formId, overlayId, fieldIds) {
  document.getElementById(overlayId).classList.add("d-none");

  let formField = document.getElementById(formId);
  fieldIds.forEach((id) => (document.getElementById(id).value = ""));
  formField.style.animation = "moveOut 200ms ease-out forwards";

  setTimeout(() => {
    formField.classList.add("hidden", "d-none");
    formField.style.cssText = "visibility: hidden; transform: translateX(100vw)";
  }, 100);
}

/**
 * Displays the form for adding a contact.
 */
function showFormField() {
  showForm("add-form-section", "overlay", handleOutsideFormClick);
  document.addEventListener("click", setupForm);
}

/**
 * Closes the form for adding a contact.
 */
function closeFormField() {
  closeForm("add-form-section", "overlay", ["name", "mail", "phone"]);
}

/**
 * Displays the edit form for an existing contact.
 * @param {string} contactId - The ID of the contact to edit.
 */
function showEditForm(contactId) {
  showForm("edit-contact-section", "edit-overlay", handleOutsideEditFormClick);
  document.getElementById("edit-contact-form").setAttribute("data-id", contactId);
  loadEditFormData(contactId);

  // Add keydown event handler for the edit form
  document.getElementById("edit-contact-form").addEventListener("keydown", handleEditEnterPress);
}

/**
 * Closes the edit form.
 */
function closeEditField() {
  closeForm("edit-contact-section", "edit-overlay", ["edit-name", "edit-mail", "edit-phone"]);

  // Remove keydown event handler when the form is closed
  document.getElementById("edit-contact-form").removeEventListener("keydown", handleEditEnterPress);
}

/**
 * Checks if the Enter key is pressed and triggers the form submit event.
 * @param {KeyboardEvent} event - The keyboard event object.
 */
function handleEditEnterPress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    handleEditFormSubmit(event);
  }
}

/**
 * Handles the submission of the edit form for contacts.
 *
 * This function is triggered when the edit form for contacts is submitted.
 * It prevents the default form submission behavior, retrieves the contact ID from
 * the form's data attributes, validates the input fields, and attempts to update the contact.
 * If an error occurs during this process, it logs the error to the console.
 *
 * @async
 * @param {Event} event - The event object representing the form submission.
 * @returns {void}
 * @throws {Error} - Logs an error if the contact ID is not found or if an issue occurs while updating the contact.
 */
async function handleEditFormSubmit(event) {
  event.preventDefault();
  let contactId = document.getElementById("edit-contact-form").getAttribute("data-id");
  if (!contactId) return console.error("No contact ID found.");

  let updatedContact = {
    name: document.getElementById("edit-name").value.trim(),
    mail: document.getElementById("edit-mail").value.trim(),
    phone: document.getElementById("edit-phone").value.trim(),
    img: document.getElementById("prof2-img").querySelector("img")?.src || generateProfileImage(document.getElementById("edit-name").value),
  };

  if (!validateEmail(updatedContact.mail) || !validatePhone(updatedContact.phone)) return console.error("Invalid email or phone number.");

  try {
    await replaceContact(contactId, updatedContact);
    showUpdateBar();
    closeEditField();
  } catch (error) {
    console.error("Error uploading contact:", error);
  }
}

/**
 * Loads contact data into the edit form fields.
 *
 * This function retrieves the contact data based on the provided contact ID
 * and populates the edit form fields with the contact's information. If the
 * contact has an image, it is displayed in the corresponding container; otherwise,
 * a generated profile image based on the contact's name is used.
 *
 * @async
 * @param {string} contactId - The unique identifier of the contact whose data should be loaded.
 * @returns {Promise<void>} - Resolves when the contact data has been successfully loaded into the form.
 * @throws {Error} - Logs an error if there is an issue retrieving the contact data.
 */
async function loadEditFormData(contactId) {
  try {
    let contact = await getContact(contactId);
    document.getElementById("edit-name").value = contact.name;
    document.getElementById("edit-mail").value = contact.mail;
    document.getElementById("edit-phone").value = contact.phone;
    let editImageContainer = document.getElementById("prof2-img");
    if (editImageContainer) {
      editImageContainer.innerHTML = `<img src="${contact.img || generateProfileImage(contact.name)}">`;
    }
  } catch (error) {
    console.error("Error loading edit form:", error);
  }
}

/**
 * Closes the form when a click outside the form occurs.
 * @param {Event} event - The click event.
 */
function handleOutsideFormClick(event) {
  if (!document.getElementById("add-form-section").contains(event.target) && !event.target.closest("#add-contact-btn")) {
    closeFormField();
  }
}

/**
 * Closes the edit form when a click outside the form occurs.
 * @param {Event} event - The click event.
 */
function handleOutsideEditFormClick(event) {
  let section = document.getElementById("edit-contact-section");
  if (!section.contains(event.target) && !event.target.closest("#edit-btn")) {
    closeEditField();
  }
}

/**
 * Selects a contact and displays its details.
 * @async
 * @param {string} contactId - The ID of the contact to select.
 * @returns {Promise<void>}
 */
async function selectContact(contactId) {
  let contactSection = document.getElementById("contact-section");
  let selectedContact = document.getElementById(`contactlist-item-${contactId}`);

  deselectAllContacts();
  await highlightContact(selectedContact);

  contactSection.classList.remove("d-none");
  await initContactDetails(contactId);
}

/**
 * Deselects all contacts in the contact list.
 */
function deselectAllContacts() {
  document.querySelectorAll('[id^="contactlist-item"]').forEach((contact) => {
    contact.classList.remove("bg-color-dg", ACTIVE_CLASS);
    contact.style.pointerEvents = "auto";
    contact.querySelector(".contactlist-databox .fw-400")?.classList.remove("selected-contact-name");
  });
}

/**
 * Highlights the selected contact in the contact list.
 * @param {HTMLElement} selectedContact - The HTML element of the selected contact.
 */
async function highlightContact(selectedContact) {
  if (!selectedContact.classList.contains("bg-color-dg")) {
    selectedContact.classList.add("bg-color-dg", ACTIVE_CLASS);
    selectedContact.style.pointerEvents = "none";
    selectedContact.querySelector(".contactlist-databox .fw-400")?.classList.add("selected-contact-name");
  }
}

/**
 * Displays the update bar after a contact has been created, with animation.
 */
function showUpdateBar() {
  let updateBar = document.getElementById("update-bar");
  updateBar.classList.remove("d-none");

  updateBar.addEventListener("animationend", function (event) {
    if (event.animationName === "moveIn") {
      setTimeout(() => {
        updateBar.classList.add("move-out");
        updateBar.addEventListener("animationend", function (event) {
          if (event.animationName === "moveOut") {
            updateBar.classList.add("d-none");
          }
        });
      }, 100);
    }
  });
}

/**
 * Sorts contacts alphabetically based on their names.
 * @param {object} contacts - An object where each key is the contact ID and each value is the contact data.
 * @returns {Array} - An array of arrays, each containing the ID and contact object, sorted by name.
 */
function sortContacts(contacts) {
  return Object.entries(contacts).sort(([, a], [, b]) => a.name.localeCompare(b.name));
}

/**
 * Returns the image source of the contact. If no image is present, a profile image is generated.
 * @param {object} contact - The contact object.
 * @returns {string} - The image source of the contact.
 */
function getImageSrc(contact) {
  return contact.img || generateProfileImage(contact.name);
}
