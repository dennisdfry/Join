/**
 * Saves the task data to Firebase.
 * @param {string} [path="/tasks"] - The path where the data will be saved in Firebase.
 * @returns {Promise<void>}
 */
async function saveToFirebase2(path = "/tasks") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addTaskArray),
  });
}

/**
 * Adds a new subtask to the subtasks array if the input is not empty, then updates the UI.
 */
function addSubtask2() {
  let input = document.getElementById("subtasks-board");
  let inputValue = input.value.trim();

  if (inputValue !== "") {
    subtasksArray.push(inputValue);
    input.value = "";
    subtasksStatusArray.push(false);
    updateSubtasksList2();
    resetSubtaskInput2();
 }
}

/**
 * Deletes a subtask and updates the UI accordingly.
 *
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubtask2(index) {
  let position = document.getElementById(`supplementarySubtask2${index}`);
  position.innerHTML = "";
  subtasksArray.splice([index], 1);
  updateSubtasksList2();
}

/**
 * Enables editing mode for a specific subtask by updating its HTML content.
 *
 * @param {number} index - The index of the subtask to edit.
 */
function editSubtask2(index) {
  let position = document.getElementById(`supplementarySubtask2${index}`);
  position.classList.remove("subtasks-edit");
  position.classList.add("subtasks-edit-input");
  let arrayPosition = subtasksArray[index];
  position.innerHTML = editSubtaskHTML2(index, arrayPosition);
}

/**
 * Handles the submission of the task form, including validation and saving the task data to Firebase.
 * @param {Event} event - The form submit event.
 * @returns {Promise<void>}
 */
async function createTask2(event) {
  event.preventDefault();
  if (!validateFormAddTask2(event.target)) return;
  if (!validatePriorityAddTask2()) return;
  await defineTaskObjects2();
  await saveToFirebase2();
  resetUIAddTask2(event.target);
  changeSite("board.html");
}

function validateFormAddTask2(form) {
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  return true;
}

/**
 * Checks if a priority has been selected before submitting the form.
 *
 * @returns {boolean} - Returns true if a priority is selected, false otherwise.
 */
function validatePriorityAddTask2() {
  if (!selectedPrio) {
    alert("Please select a priority before submitting the form.");
    return false;
  }
  return true;
}

/**
 * Opens the form to add a new task.
 *
 * Removes the hidden and non-display classes from the add-task form to make it visible.
 */
function openAddForm(event) {
  event.preventDefault();
  document.getElementById("add-task-form").classList.remove("vis-hidden");
  document.getElementById("add-task-form").classList.remove("d-none");
  let overlay = document.getElementById("overlay-form");
  overlay.classList.remove("d-none");
  let formField = document.getElementById("add-task-form");

  formField.classList.remove("d-none", "hidden");
  formField.style.cssText =
    "visibility: visible; transform: translateX(100vw); animation: moveIn 200ms ease-in forwards";
  document.addEventListener("click", outsideClickHandler, true);
  document.addEventListener("keydown", handleEnterKey);
  prio2(2);
}

/**
 * Closes the form.
 * Removes the non-display class from the add-task form, making it visible.
 */
function closeAddForm() {
  document.getElementById("overlay-form").classList.add("d-none");
  let formField = document.getElementById("add-task-form");

  formField.classList.remove("d-none");
  formField.style.animation = "moveOut 200ms ease-out forwards";
  setTimeout(() => {
    formField.classList.add("hidden", "d-none");
    formField.style.cssText = "visibility: hidden; transform: translateX(100vw)";
  }, 100);
  document.removeEventListener("click", outsideClickHandler, true);
  document.removeEventListener("keydown", handleEnterKey);
  resetUIAddTask2(formField);
}

/**
 * Handles outside click detection.
 *
 * This function listens for clicks outside the "add-task" form. If the click occurs
 * outside the form but within the overlay, it triggers the form to close.
 *
 * @param {Event} event - The click event.
 */
function outsideClickHandler(event) {
  const formField = document.getElementById("add-task-form");
  const isClickInsideForm = formField.contains(event.target);

  if (!isClickInsideForm) {
    closeAddForm();
  }
}
/**
 * Handles the Enter key press event.
 *
 * This function listens for the Enter key being pressed. Depending on which element
 * is active (focused), it either adds a new subtask or submits the task by clicking
 * the corresponding button.
 *
 * @param {KeyboardEvent} event - The keyboard event for key press.
 */
function handleEnterKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    let activeElement = document.activeElement;
    let subtaskInput = document.getElementById("subtasks-board");
    if (activeElement === subtaskInput) {
      addSubtask2();
    }
  }
}

/**
 * Resets the task form and UI elements.
 *
 * @param {HTMLFormElement} form - The form element to reset.
 */
function resetUIAddTask2(form) {
  form.reset();
  resetFormStateAddTask2();
  let subtasksPosition = document.getElementById("subtasksPosition2");
  if (subtasksPosition) {
    subtasksPosition.innerHTML = "";
  }
}

/**
 * Resets the internal state of the form and clears stored data.
 */
function resetFormStateAddTask2() {
  addTaskArray = [];
  subtasksArray = [];
  assignedToUserArray = [];
  assignedToUserArrayNamesGlobal = [];
  selectedPrio = null;
  imageUrlsGlobal = [];
  subtasksArray = [];
  clearSubtasks2();
}

/**
 * Extracts names from contacts and initializes the checkboxes for assigning users to tasks.
 * @param {object} contacts - The contacts object.
 * @param {string[]} imageUrls - An array of image URLs for the contacts.
 * @returns {Promise<void>}
 */
async function assignedToBoard(contacts, imageUrls) {
  try {
    const extractNames = (contacts) => {
      return Object.values(contacts).map((entry) => ({ name: entry.name }));
    };
    const names = extractNames(contacts);
    await checkboxInit2(names, imageUrls);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Renders checkboxes with contact images and names for assigning users to tasks.
 * @param {object[]} names - An array of contact names.
 * @param {string[]} imageUrls - An array of image URLs for the contacts.
 */
async function checkboxInit2(names, imageUrls) {
  let position = document.getElementById("checkboxes2");
  position.innerHTML = "";

  let list = "";
  for (let index = 0; index < names.length; index++) {
    const element = names[index].name;
    const imgSrc = imageUrls[index];
    list += checkBoxRender2(index, imgSrc, element);
  }
  position.innerHTML = list;
}

/**
 * Returns a string of HTML to render a checkbox with an image and name.
 * @param {number} index - The index of the checkbox.
 * @param {string} imgSrc - The URL of the image.
 * @param {string} element - The name associated with the checkbox.
 * @returns {string} - The HTML string for the checkbox.
 */
function checkBoxRender2(index, imgSrc, element) {
  return `
    <label class="checkBoxFlex" for="checkbox2-${index}" id="checkboxColor2${index}">
        <div class="checkBoxImg">
            <img id="assignedToUserImageBorde2${index}" src="${imgSrc}" alt="" />
            ${element}
        </div>
        <input class="assignedToUserCheckbox img-24" type="checkbox" id="checkbox2-${index}" value="${element}" onclick="assignedToUser2('${index}','${element}','${imgSrc}')" />
    </label>`;
}

/**
 * Updates the arrays that store the indices and names of users assigned to the task.
 * @param {number} index - The index of the user.
 * @param {string} element - The name of the user.
 */
async function assignedToUser2(index, element, imgSrc) {
  const image = imageUrlsGlobal[index];
  const arrayIndex = assignedToUserArray.indexOf(index);
  if (arrayIndex !== -1) {
    assignedToUserArray.splice(arrayIndex, 1);
    assignedToUserArrayNamesGlobal.splice(arrayIndex, 1);
    imageUrlsGlobal.splice(arrayIndex, 1);
    assignedtoUserHighlightRemove2(index);
  } else {
    assignedToUserArray.push(index);
    assignedToUserArrayNamesGlobal.push(element);
    imageUrlsGlobal.push(imgSrc);
    assignedtoUserHighlightAdd2(index);
  }
}

/**
 * Adds highlight to the user's assigned checkbox and image.
 *
 * @param {number} index - The index of the user element.
 */
function assignedtoUserHighlightAdd2(index) {
  let position = document.getElementById(`checkboxColor2${index}`);
  let positionOfImage = document.getElementById(`assignedToUserImageBorde2${index}`);
  positionOfImage.classList.add("assignedToUserImage");
  position.style.backgroundColor = "#2a3647";
  position.style.color = "#ffffff";
}

/**
 * Removes highlight from the user's assigned checkbox and image.
 *
 * @param {number} index - The index of the user element.
 */
function assignedtoUserHighlightRemove2(index) {
  let position = document.getElementById(`checkboxColor2${index}`);
  let positionOfImage = document.getElementById(`assignedToUserImageBorde2${index}`);
  positionOfImage.classList.remove("assignedToUserImage");
  position.style.backgroundColor = "#ffffff";
  position.style.color = "#2a3647";
}

/**
 * Toggles the visibility of the checkbox dropdown.
 */
function showCheckboxes2(event) {
  event.stopPropagation();
  let checkboxes = document.getElementById("checkboxes2");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
    showUserAdd2();
    checkbox2ClickHandler();
  }
}
/**
 * Attaches the document click handler to handle clicks outside the checkboxes.
 */
function checkbox2ClickHandler() {
  document.onclick = handleAddTaskClick2;
}

/**
 * Handles document click events to toggle the visibility of the checkboxes.
 *
 * @param {Event} event - The click event to handle.
 */
function handleAddTaskClick2(event) {
  let checkboxes = document.getElementById("checkboxes2");
  if (expanded && !document.querySelector(".multiselect2").contains(event.target)) {
    checkboxes.style.display = "none";
    expanded = false;
    showUserAdd2();
  }
}

/**
 * Updates the user interface to show selected users in the dropdown.
 */
function showUserAdd2() {
  let position = document.getElementById("userImageShow2");
  position.innerHTML = "";
  for (let index = 0; index < imageUrlsGlobal.length; index++) {
    const element = imageUrlsGlobal[index];
    if (index > 3) {
      const remaining = imageUrlsGlobal.length - 4;
      position.innerHTML += `
        <div class="img-32 more-users">
          +${remaining}
        </div>`;
      break;
    }
    position.innerHTML += `<img class="img-32" src="${element}" alt="" />`;
  }
}

/**
 * Gathers data from the form fields and prepares the task object to be saved.
 */
async function defineTaskObjects2() {
  let taskTitle = document.getElementById("title2").value;
  let taskDescription = document.getElementById("description2").value;
  let dueDateTask = document.getElementById("dueDate2").value;
  let taskCategory = document.getElementById("taskCategory2").value;
  let lastString = prioArray.pop();
  pushTaskObjectsToArray2(taskTitle, taskDescription, dueDateTask, taskCategory, lastString);
}

/**
 * Pushes task objects into the global task array.
 *
 * Creates a task object and adds it to addTaskArray.
 *
 * @param {string} taskTitle - The title of the task.
 * @param {string} taskDescription - The description of the task.
 * @param {string} dueDateTask - The due date of the task.
 * @param {string} taskCategory - The category of the task.
 * @param {string} lastString - The priority level of the task.
 */
function pushTaskObjectsToArray2(taskTitle, taskDescription, dueDateTask, taskCategory, lastString) {
  addTaskArray.push({
    title: taskTitle,
    description: taskDescription,
    assignedTo: assignedToUserArray,
    assignedToNames: assignedToUserArrayNamesGlobal,
    dueDate: dueDateTask,
    prio: lastString,
    category: taskCategory,
    subtasks: subtasksArray,
    subtaskStatus: subtasksStatusArray,
    boardCategory: "todo",
  });
}
