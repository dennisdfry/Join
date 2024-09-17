
let BASE_URL = "https://join-19628-default-rtdb.firebaseio.com";
let subtasksArray = [];
let subtasksStatusArray = [];
let prioArray = [];
let addTaskArray = [];
let expanded = false;
let isValid = true
let assignedToUserArray = [];
let assignedToUserArrayNamesGlobal = []; 
let imageUrlsGlobal = [];
let selectedPrio = null; 

/**
 * Initializes the task form by fetching data from Firebase and setting up the "Assigned To" dropdown.
 * @returns {Promise<void>}
 */
async function init() {
  try {
    let fireBaseData = await onloadData("/");
    let contacts = await fetchContacts(fireBaseData);
    let imageUrls = await fetchImages();
    await assignedTo(contacts, imageUrls);

  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

/**
 * Fetches contact images from Firebase and returns an array of image URLs.
 * @returns {Promise<string>} - A promise that resolves to an array of image URLs.
 */
async function fetchImages() {
  try {
    let fireBaseData = await onloadData("/");
    let contacts = fireBaseData.contacts;
    let imageUrls = Object.values(contacts).map((contact) => contact.img);
    return imageUrls;
  } catch (error) {
    console.error("Error fetching images", error);
  }
}

/**
 * Fetches JSON data from Firebase at the given path.
 * @param {string} [path=""] - The path to fetch data from.
 * @returns {Promise<object>} - A promise that resolves to the JSON response.
 */
async function onloadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}

/**
 * Extracts and returns the contacts object from the JSON response.
 * @param {object} responseToJson - The JSON response from Firebase.
 * @returns {object} - The contacts object extracted from the response.
 */
async function fetchContacts(responseToJson) {
  let contacts = responseToJson.contacts;
  return contacts;
}

/**
 * Extracts names from contacts and initializes the checkboxes for assigning users to tasks.
 * @param {object} contacts - The contacts object.
 * @param {string[]} imageUrls - An array of image URLs for the contacts.
 * @returns {Promise<void>}
 */
async function assignedTo(contacts, imageUrls) {
  try {
    const extractNames = (contacts) => {
      return Object.values(contacts).map((entry) => ({ name: entry.name }));
    };
    const names = extractNames(contacts);
    checkboxInit(names, imageUrls);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Renders checkboxes with contact images and names for assigning users to tasks.
 * @param {object[]} names - An array of contact names.
 * @param {string[]} imageUrls - An array of image URLs for the contacts.
 */
function checkboxInit(names, imageUrls) {
  let position = document.getElementById("checkboxes");
  position.innerHTML = "";

  const contacts = names.map((name, index) => ({ name: name.name, imgSrc: imageUrls[index] }));
  contacts.sort((a, b) => a.name.localeCompare(b.name));

  let list = "";
  contacts.forEach((contact, index) => {
    list += checkBoxRender(index, contact.imgSrc, contact.name);
  });

  position.innerHTML = list; 
}


/**
 * Returns a string of HTML to render a checkbox with an image and name.
 * @param {number} index - The index of the checkbox.
 * @param {string} imgSrc - The URL of the image.
 * @param {string} element - The name associated with the checkbox.
 * @returns {string} - The HTML string for the checkbox.
 */
function checkBoxRender(index, imgSrc, element) {
  return`
    <label class="checkBoxFlex" for="checkbox-${index}">
        <div class="checkBoxImg">
            <img src="${imgSrc}" alt="" />
            ${element}
        </div>
        <input type="checkbox" id="checkbox-${index}" value="${element}" onclick="assignedToUser('${index}','${element}')" />
    </label>`;
}

/**
 * Updates the arrays that store the indices and names of users assigned to the task.
 * @param {number} index - The index of the user.
 * @param {string} element - The name of the user.
 */
async function assignedToUser(index, element) {
  const image = imageUrlsGlobal[index];
  const arrayIndex = assignedToUserArray.indexOf(index);
  if (arrayIndex !== -1) {
    assignedToUserArray.splice(arrayIndex, 1);
    assignedToUserArrayNamesGlobal.splice(arrayIndex, 1);
  } else {
    assignedToUserArray.push(index);
    assignedToUserArrayNamesGlobal.push(element);
  }
}

/**
 * Toggles the visibility of the "Assigned To" dropdown.
 */
function showCheckboxes() {
  let checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
}

/**
 * Handles the submission of the task form, including validation and saving the task data to Firebase.
 * @param {Event} event - The form submit event.
 * @returns {Promise<void>}
 */
async function createTask(event) {
  event.preventDefault();

  let form = event.target;
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  if (!selectedPrio) {
    alert("Please select a priority before submitting the form.");
    return false;
  }
  defineTaskObjects(); 
  await saveToFirebase();
  form.reset();
  resetFormState();
  changeSite("board.html");
}

/**
 * Handles the "Enter" key press event to submit subtasks or a form.
 * @param {KeyboardEvent} event - The keyboard event object representing the "Enter" key press.
 */
function checkEnterSubtasks(event) {
  if (event.key === "Enter") {
    event.preventDefault(); 
    let activeElement = document.activeElement;
    let subtaskInput = document.getElementById('subtasks');

    if (activeElement === subtaskInput) {
      addSubtask();
    } else {
      let form = document.getElementById('createAdd');
      if (form) {
        form.submit();
      }
    }
  }
}


/**
 * Resets the internal state of the form and clears stored data.
 */
function resetFormState() {
  addTaskArray = [];
  subtasksArray = [];
  assignedToUserArray = [];
  assignedToUserArrayNamesGlobal = [];
  selectedPrio = null;
  clearSubtasks();
}

/**
 * Gathers data from the form fields and prepares the task object to be saved.
 */
function defineTaskObjects() {
  let taskTitle = document.getElementById("title").value;
  let taskDescription = document.getElementById("description").value;
  let dueDateTask = document.getElementById("dueDate").value;
  let taskCategory = document.getElementById("taskCategory").value;
  let lastString = prioArray.pop();
  pushTaskObjectsToArray(taskTitle, taskDescription, dueDateTask, taskCategory, lastString);
}

/**
 * Pushes the task object to the array that will be saved to Firebase.
 * @param {string} taskTitle - The title of the task.
 * @param {string} taskDescription - The description of the task.
 * @param {string} dueDateTask - The due date of the task.
 * @param {string} taskCategory - The category of the task.
 * @param {string} lastString - The priority of the task.
 */
function pushTaskObjectsToArray(taskTitle, taskDescription, dueDateTask, taskCategory, lastString) {
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

/**
 * Saves the task data to Firebase.
 * @param {string} [path="/tasks"] - The path where the data will be saved in Firebase.
 * @returns {Promise<void>}
 */
async function saveToFirebase(path = "/tasks") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addTaskArray),
  });
}

/**
 * Handles the selection of a priority level and updates the button styles.
 * @param {number} id - The ID of the selected priority button.
 */
function prio(id) {
  const buttons = document.querySelectorAll(".add-task-prio-button-container button");

  buttons.forEach((button) => {
    button.classList.remove("add-task-prio-button-urgent", "add-task-prio-button-medium", "add-task-prio-button-low");
    button.classList.add("add-task-prio-button");
  });
  let position = document.getElementById(`prioButton${id}`);
  prioIdCheck(id, position);
  selectedPrio = id;
}

/**
 * Updates the priority array and button styles based on the selected priority.
 * @param {number} id - The ID of the selected priority button.
 * @param {HTMLElement} position - The HTML element of the selected button.
 */
function prioIdCheck(id, position) {
  if (id == 1) {
    prioArray.push("Urgent");
    position.classList.add("add-task-prio-button-urgent");
  } else if (id == 2) {
    prioArray.push("Medium");
    position.classList.add("add-task-prio-button-medium");
  } else if (id == 3) {
    prioArray.push("Low");
    position.classList.add("add-task-prio-button-low");
  }
  position.classList.remove("add-task-prio-button");
}

/**
 * Shows the subtask input controls when adding a new subtask.
 */
function showSubtaskControls() {
  document.getElementById("subtasks").classList.remove("add-task-input");
  document.getElementById("subtasks").classList.add("subtasks-input");
  let position = document.getElementById("subtasksControl");
  position.innerHTML = 
        `<button onclick="resetSubtaskInput()" type="button" class="subtask-button">
            <img src="../public/img/closeAddTask.png" alt="Reset">
        </button>
        <div class="seperator-subtasks"></div>
        <button onclick="addSubtask()" type="button" class="subtask-button">
            <img src="../public/img/checkAddTask.png" alt="Add">
        </button>`;
}

/**
 * Adds a subtask to the subtask array and updates the displayed list.
 */
function addSubtask() {
  let input = document.getElementById("subtasks");
  if (input.value.trim() !== "") {
    subtasksArray.push(input.value.trim());
    input.value = "";
    subtasksStatusArray.push(false);
    updateSubtasksList();
    resetSubtaskInput();
  }
}

/**
 * Resets the subtask input field and returns it to its initial state.
 */
function resetSubtaskInput() {
  let input = document.getElementById("subtasks");
  input.value = "";
  document.getElementById("subtasks").classList.add("add-task-input");
  document.getElementById("subtasks").classList.remove("subtasks-input");
  let position = document.getElementById("subtasksControl");
  position.innerHTML = `<button onclick="showSubtaskControls()" type="button" id="subtasksPlus" class="add-task-button">
                                +
                            </button>`;
}

/**
 * Updates the displayed list of subtasks based on the current contents of the subtasksArray.
 */
function updateSubtasksList() {
  let subtasksPosition = document.getElementById("subtasksPosition");
  subtasksPosition.innerHTML = "";
  for (let index = 0; index < subtasksArray.length; index++) {
    const element = subtasksArray[index];
    subtasksPosition.innerHTML += `
            <ul>
                <li>${element}</li>
            </ul>`;
  }
}

/**
 * Clears the list of displayed subtasks by resetting the innerHTML of the subtasksPosition element.
 */
function clearSubtasks() {
  let position = document.getElementById("subtasksPosition");
  position.innerHTML = "";
}
