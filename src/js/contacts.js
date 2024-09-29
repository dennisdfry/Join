/**
 * Initializes event listeners for the contact form.
 * - Adds a submit listener to process the form.
 * - Adds input listeners to validate form fields.
 */
function setupForm() {
  let form = document.getElementById("contact-form");
  if (!form) return;
  
  form.addEventListener("submit", handleFormSubmit);
  
  ["name", "mail", "phone"].forEach((id) => {
    let element = document.getElementById(id);
    if (element) {
      element.addEventListener("input", (event) => {
        validateField(event.target); 
        checkFormFields();
      });
      element.addEventListener("blur", () => validateField(element));
      element.addEventListener("keydown", handleEnterPress);
    }
  });
  checkFormFields();
}

/**
 * Handles the form submission to add a new contact.
 * @param {Event} event - The form submit event object.
 */
function handleFormSubmit(event) {
  event.preventDefault();
  
  let form = document.getElementById("contact-form");
  if (!form.checkValidity()) {
    checkFormFields();
    form.reportValidity();
    return;
  }
  let [name, mail, phone] = ["name", "mail", "phone"].map(id => document.getElementById(id).value.trim());
  addContact({ name: capitalizeFirstLetter(name), mail, phone, img: document.getElementById("prof-img").value });
  closeFormField();
}




/**
* Validates a single field and shows error messages if invalid, without blocking focus.
* @param {HTMLElement} field - The form field to validate.
*/
function validateField(field) {
  field.setCustomValidity("");

  if (field.id === "name") {
      if (!validateName(field.value)) {
          field.classList.add("input-error");
          field.setCustomValidity("The name must be at least 3 characters long and contain only letters.");
      } else {
          field.classList.remove("input-error");
          field.setCustomValidity(""); 
      }
  } else if (field.id === "phone") {
      if (!validatePhone(field.value)) {
          field.classList.add("input-error");
          field.setCustomValidity("Please enter a valid phone number that starts with '+' or '0'.");
      } else {
          field.classList.remove("input-error");
          field.setCustomValidity(""); 
      }
  } else {
      if (!field.checkValidity()) {
          field.classList.add("input-error");
          field.setCustomValidity("Please fill out this field correctly.");
      } else {
          field.classList.remove("input-error");
          field.setCustomValidity(""); 
      }
  }

  if (document.activeElement == field) {
      field.reportValidity();
  }
}

/**
 * Checks if all required fields are filled and enables or disables the submit button accordingly.
 */
function checkFormFields() {
  let form = document.getElementById("contact-form");
  let filledFields = form.checkValidity(); 
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
 * Displays the contact form with animation.
 * Shows the form and its overlay, applying animations and setting up event listeners for handling outside clicks.
 * 
 * @param {string} formId - The ID of the form to display.
 * @param {string} overlayId - The ID of the overlay to display.
 * @param {Function} outsideClickHandler - The function to handle clicks outside the form.
 */
function showFormField(formId = "add-form-section", overlayId = "add-overlay", outsideClickHandler = handleOutsideFormClick) {
  let formField = document.getElementById(formId);
  let overlay = document.getElementById(overlayId);
  

  overlay.classList.remove("d-none");
  formField.classList.remove("d-none", "hidden");
  formField.style.cssText = "visibility: visible; transform: translateX(100vw); animation: moveIn 200ms ease-in forwards";
  

  document.removeEventListener("click", handleOutsideFormClick);
  document.removeEventListener("click", handleOutsideEditFormClick);
  document.addEventListener("click", outsideClickHandler);

  setupForm();
}

/**
 * Closes the form for adding a contact.
 * Hides the form and overlay with animations and resets the input fields.
 * 
 * @param {string} formId - The ID of the form to close.
 * @param {string} overlayId - The ID of the overlay to hide.
 * @param {Array<string>} fieldIds - An array of field IDs to reset.
 */
function closeFormField(formId = "add-form-section", overlayId = "add-overlay", fieldIds = ["name", "mail", "phone"]) {
  let formField = document.getElementById(formId);

  document.getElementById(overlayId).classList.add("d-none");
  fieldIds.forEach((id) => (document.getElementById(id).value = ""));
  formField.style.animation = "moveOut 200ms ease-out forwards";
  
  setTimeout(() => {
    formField.classList.add("hidden", "d-none");
    formField.style.cssText = "visibility: hidden; transform: translateX(100vw)";
  }, 100);
  document.removeEventListener("click", handleOutsideFormClick);
}


/**
 * Initializes event listeners for the contact edit form.
 * - Adds a submit listener to process the edit form.
 * - Adds input listeners to validate form fields.
 */
function setupEditForm() {
  let form = document.getElementById("edit-contact-form");
  if (!form) return;
  
  form.addEventListener("submit", handleFormSubmit);
  
  ["edit-name", "edit-mail", "edit-phone"].forEach((id) => {
    let element = document.getElementById(id);
    if (element) {
      element.addEventListener("input", (event) => {
        validateEditField(event.target); 
        checkEditFormFields();
      });
      element.addEventListener("blur", () => validateEditField(element));
      element.addEventListener("keydown", handleEditEnterPress);
    }
  });
  checkEditFormFields();
}
/**
 * Handles the submission of the edit form for contacts.
 * @async
 * @param {Event} event - The event object representing the form submission.
 */
async function handleEditFormSubmit(event) {
  event.preventDefault();
  let form = document.getElementById("edit-contact-form");
  if (!form.checkValidity()) {
    checkEditFormFields();
    form.reportValidity();
    return;
  }
  const contactId = form.getAttribute("data-id");
  if (!contactId) return console.error("No contact ID found.");

  try {
    const updatedContact = await getUpdatedContact(contactId);
    await replaceContact(contactId, updatedContact);

  } catch (error) {
    console.error("Error updating contact:", error);
  }
  closeEditField();
  showUpdateBar();
}

/**
 * Checks if all required fields in the edit form are filled and enables or disables the submit button accordingly.
 */

function checkEditFormFields() {
  let form = document.getElementById("edit-contact-form");
  let filledFields = form.checkValidity(); 
  document.getElementById("editfield-create-btn").disabled = !filledFields;
}

/**
* Validates a single field and shows error messages if invalid, without blocking focus.
* @param {HTMLElement} field - The form field to validate.
*/
function validateEditField(field) {
  field.setCustomValidity("");

  if (field.id === "edit-name") {
      if (!validateName(field.value)) {
          field.classList.add("input-error");
          field.setCustomValidity("The name must be at least 3 characters long and contain only letters.");
      } else {
          field.classList.remove("input-error");
          field.setCustomValidity(""); 
      }
  } else if (field.id === "edit-phone") {
      if (!validatePhone(field.value)) {
          field.classList.add("input-error");
          field.setCustomValidity("Please enter a valid phone number that starts with '+' or '0'.");
      } else {
          field.classList.remove("input-error");
          field.setCustomValidity(""); 
      }
  } else {
      if (!field.checkValidity()) {
          field.classList.add("input-error");
          field.setCustomValidity("Please fill out this field correctly.");
      } else {
          field.classList.remove("input-error");
          field.setCustomValidity(""); 
      }
  }

  if (document.activeElement == field) {
      field.reportValidity();
  }
}

/**
 * Validates the name field.
 * @param {string} name - The name to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validateName(name) {
  const nameRegex = /^[A-Za-z\s]{3,}$/; 
  return nameRegex.test(name);
}

/**
* Validates the phone number field.
 * E.164 Validation with 0 and space allowance
* @param {string} phone - The phone number to validate.
* @returns {boolean} - True if valid, false otherwise.
*/
function validatePhone(phone) {
  const phoneRegex = /^(0\d{1,14}|\+[1-9]\d{0,14})(\s?\d+)*$/;
  return phoneRegex.test(phone.trim());
}
/**
 * Validates an email address using a regular expression.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
}


/**
 * Loads contact data into the edit form fields.
 * @async
 * @param {string} contactId - The unique identifier of the contact whose data should be loaded.
 */
async function loadEditFormData(contactId) {
  try {
    const contact = await getContact(contactId);
    document.getElementById("edit-name").value = capitalizeFirstLetter(contact.name);
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
 * Displays the edit form for an existing contact.
 * @param {string} contactId - The ID of the contact to edit.
 */
function showEditForm(contactId) {
  showFormField("edit-contact-section", "edit-overlay", handleOutsideEditFormClick);
  document.getElementById("edit-contact-form").setAttribute("data-id", contactId);
  setupEditForm();
  loadEditFormData(contactId);

}

/**
 * Closes the edit form.
 */
function closeEditField() {
  closeFormField("edit-contact-section", "edit-overlay", ["edit-name", "edit-mail", "edit-phone"]);
  document.removeEventListener("click", handleOutsideEditFormClick);
}

/**
 * Retrieves updated contact details from the form.
 * @param {string} contactId - The ID of the contact being updated.
 * @returns {object} - The updated contact details.
 */
async function getUpdatedContact(contactId) {
  const oldContact = await getContact(contactId);
  const newName = capitalizeFirstLetter(document.getElementById("edit-name").value.trim());
  
  return {
    name: newName,
    mail: document.getElementById("edit-mail").value.trim(),
    phone: document.getElementById("edit-phone").value.trim(),
    img: oldContact.name !== newName 
         ? generateProfileImage(newName) 
         : document.getElementById("prof2-img").querySelector("img")?.src || oldContact.img,
  };
}


/**
 * Closes the form when a click outside the form occurs.
 * @param {Event} event - The click event.
 */
function handleOutsideFormClick(event) {
  if (!document.getElementById("add-form-section").contains(event.target) && !event.target.closest("#add-contact-btn") && !event.target.closest(".add-contact-btn-responsive")) {
    closeFormField();
  }
}

/**
 * Closes the edit form when a click outside the form occurs.
 * @param {Event} event - The click event.
 */
function handleOutsideEditFormClick(event) {
  let section = document.getElementById("edit-contact-section");
  if (section && !section.contains(event.target) && !event.target.closest("#edit-btn")) {
    closeEditField();
  }
}

/**
 * Selects a contact and displays its details.
 * @async
 * @param {string} contactId - The ID of the contact to select.
 */
async function selectContact(contactId) {
  let contactSection = document.querySelector(".contactlist-section-responsive");
  let selectedContact = document.getElementById(`contactlist-item-${contactId}`);
  if (window.innerWidth < 810) {
    toggleElement('.contactlist-section-responsive', 'd-none');
  }
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
 * Shows the update bar with an animated transition.
 * and "moveOut" animations. The function manages event listeners for smooth transitions.
 */
function showUpdateBar() {
  let updateBar = document.getElementById("update-bar");
  updateBar.classList.remove("d-none");
  addMoveInListener(updateBar);
}

/**
 * Adds an animation end listener for the "moveIn" animation.
 * and adds an animation end listener for the "moveOut" animation.
 * 
 * @param {HTMLElement} updateBar - The update bar element to which the listener is added.
 */
function addMoveInListener(updateBar) {
  updateBar.addEventListener("animationend", function handleMoveIn(event) {
    if (event.animationName === "moveIn") {
      setTimeout(() => {
        addMoveOutListener(updateBar);
      }, 400);
      updateBar.removeEventListener("animationend", handleMoveIn);
    }
  });
}

/**
 * Adds an animationend listener for the "moveOut" animation.
 * re-adds the "moveIn" animation listener for future animations.
 * 
 * @param {HTMLElement} updateBar - The update bar element to which the listener is added.
 */
function addMoveOutListener(updateBar) {
  updateBar.classList.add("move-out");
  updateBar.addEventListener("animationend", function handleMoveOut(event) {
    if (event.animationName === "moveOut") {
      setTimeout(() => {
        finalizeUpdateBar(updateBar);
      }, 100);
      updateBar.removeEventListener("animationend", handleMoveOut);
    }
  });
}

/**
 * Finalizes the update bar by hiding it and resetting event listeners.
 * Adds the "d-none" class to hide the update bar and re-adds the "moveIn" animation listener 
 * @param {HTMLElement} updateBar - The update bar element to be finalized.
 */
function finalizeUpdateBar(updateBar) {
  updateBar.classList.add("d-none");
  addMoveInListener(updateBar);
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

