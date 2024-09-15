/**
 * Initializes event listeners for the contact form.
 * - Adds a submit listener to process the form.
 * - Adds input listeners to validate form fields.
 * - Checks if all required fields are filled and enables or disables the submit button accordingly.
 */
function setupForm() {
  let form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", handleFormSubmit);
  console.log("Submit event listener added");

  ["name", "mail", "phone"].forEach((id) => {
    let element = document.getElementById(id);
    if (element) {
      element.addEventListener("input", checkFormFields);
      element.addEventListener("keydown", handleEnterPress);
    }
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
 * Validates a phone number based on custom rules.
 * - Must start with + and a valid country code (1-3 digits), or start with a 0.
 * - Can only contain digits after the country code or leading zero.
 * - Length must be between 10 and 16 digits.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} - Returns true if the phone number is valid, otherwise false.
 */
function validatePhone(phone) {
  let phoneReg = /^(?:\+?\d{1,3}|0)\d{7,14}$/;
  return phoneReg.test(phone);
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
 * Shows the form and its overlay, applying animations and setting up event listeners for handling outside clicks.
 * 
 * @param {string} formId - The ID of the form to display.
 * @param {string} overlayId - The ID of the overlay to display.
 * @param {Function} outsideClickHandler - The function to handle clicks outside the form.
 */
function showFormField(formId = "add-form-section", overlayId = "overlay", outsideClickHandler = handleOutsideFormClick) {
  let formField = document.getElementById(formId);
  let overlay = document.getElementById(overlayId);
  
  overlay.classList.remove("d-none");
  formField.classList.remove("d-none", "hidden");
  formField.style.cssText = "visibility: visible; transform: translateX(100vw); animation: moveIn 200ms ease-in forwards";
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
function closeFormField(formId = "add-form-section", overlayId = "overlay", fieldIds = ["name", "mail", "phone"]) {
  document.getElementById(overlayId).classList.add("d-none");
  let formField = document.getElementById(formId);
  fieldIds.forEach((id) => (document.getElementById(id).value = ""));
  formField.style.animation = "moveOut 200ms ease-out forwards";
  
  setTimeout(() => {
    formField.classList.add("hidden", "d-none");
    formField.style.cssText = "visibility: hidden; transform: translateX(100vw)";
  }, 100);
  
  document.removeEventListener("click", handleOutsideFormClick);
  document.querySelectorAll(["name", "mail", "phone"]).forEach(id => {
    let element = document.getElementById(id);
    element.removeEventListener("input", checkFormFields);
    element.removeEventListener("keydown", handleEnterPress);
  });
}

/**
 * Displays the edit form for an existing contact.
 * @param {string} contactId - The ID of the contact to edit.
 */
function showEditForm(contactId) {
  showFormField("edit-contact-section", "edit-overlay", handleOutsideEditFormClick);
  document.getElementById("edit-contact-form").setAttribute("data-id", contactId);
  loadEditFormData(contactId);
  document.getElementById("edit-contact-form").addEventListener("keydown", handleEditEnterPress);
}

/**
 * Closes the edit form.
 */
function closeEditField() {
  closeFormField("edit-contact-section", "edit-overlay", ["edit-name", "edit-mail", "edit-phone"]);
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
 * @async
 * @param {Event} event - The event object representing the form submission.
 */
async function handleEditFormSubmit(event) {
  event.preventDefault();

  const contactId = document.getElementById("edit-contact-form").getAttribute("data-id");
  if (!contactId) return console.error("No contact ID found.");

  let validationError = validateEditForm();
  if (validationError) return console.error(validationError);

  try {
    const updatedContact = await getUpdatedContact(contactId);
    await replaceContact(contactId, updatedContact);
    handleSuccess();
  } catch (error) {
    console.error("Error updating contact:", error);
  }
}

/**
 * Validates the email and phone number in the edit form.
 * @returns {string|null} - Returns an error message if validation fails, otherwise null.
 */
function validateEditForm() {
  let email = document.getElementById("edit-mail").value.trim();
  let phone = document.getElementById("edit-phone").value.trim();
  if (!validateEmail(email) || !validatePhone(phone)) {
    return "Invalid email or phone number.";
  }
  return null;
}

/**
 * Retrieves updated contact details from the form.
 * @param {string} contactId - The ID of the contact being updated.
 * @returns {object} - The updated contact details.
 */
async function getUpdatedContact(contactId) {
  const oldContact = await getContact(contactId);
  const newName = capitalizeFirstLetter(document.getElementById("edit-name").value.trim()); // Capitalize name
  
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
 * Handles successful contact update.
 */
function handleSuccess() {
  showUpdateBar();
  closeEditField();
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
  if (!section.contains(event.target) && !event.target.closest("#edit-btn")) {
    closeEditField();
  }
}

/**
 * Selects a contact and displays its details.
 * @async
 * @param {string} contactId - The ID of the contact to select.
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
      }, 100);
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
  addMoveInListener(updateBar); // Re-add listener for future animations
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
