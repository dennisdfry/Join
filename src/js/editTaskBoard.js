let addTaskArrayEdit = [];
let expandedEdit = false;

/**
 * Clears the placeholder of the task title input field during editing.
 *
 * @param {number} index - The index of the task being edited.
 */
function editTitle(index) {
  let position = document.getElementById(`inputEditTitle${index}`);
  position.placeholder = "";
}

/**
 * Clears the placeholder of the task description input field during editing.
 *
 * @param {number} index - The index of the task being edited.
 */
function editDescription(index) {
  let position = document.getElementById(`descriptionEdit${index}`);
  position.placeholder = "";
}

/**
 * Opens the task in edit mode and renders the task details for editing.
 *
 * @param {number} index - The index of the task being edited.
 * @param {string} category - The category of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} date - The due date of the task.
 * @param {string} prio - The priority of the task.
 * @async
 */
async function editOpenTask(index, category, title, description, date, prio) {
  let position = document.getElementById("openTask");
  position.innerHTML = "";
  position.innerHTML = await window.editTaskHtml(index, category, title, description, date, prio);
  dueDateEditTask(index, date);
  initEdit(index);
  checkboxIndexFalse(index);
  subtasksRenderEdit(index);
  CategoryColorEdit(index, category);
  console.log(category);
}

/**
 * Sets the background color for the task category during editing.
 *
 * @param {number} index - The index of the task being edited.
 * @param {string} category - The category of the task.
 */
function CategoryColorEdit(index, category) {
  let position = document.getElementById(`categoryColorEdit${index}`);
  if (category == TechnicalTask) {
    position.style.backgroundColor = "#1fd7c1";
  } else {
    position.style.backgroundColor = "#0038ff";
  }
}

/**
 * Sets the due date input value during task editing.
 *
 * @param {number} index - The index of the task being edited.
 * @param {string} date - The due date of the task.
 */
function dueDateEditTask(index, date) {
  let position = document.getElementById(`dueDateEdit${index}`);
  position.value = date;
}

/**
 * Initializes the editing process by fetching and rendering relevant task data.
 *
 * @param {number} index - The index of the task being edited.
 * @async
 */
async function initEdit(index) {
  try {
    let fireBaseData = await onloadData("/");
    let contacts = fetchContacts(fireBaseData);
    let imageUrls = await fetchImages();
    await assignedToEdit(contacts, imageUrls, index);
  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

/**
 * Fetches images of contacts from Firebase.
 *
 * @returns {Promise<Array<string>>} - An array of image URLs.
 * @async
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
 * Fetches data from Firebase for the given path.
 *
 * @param {string} [path=""] - The path to fetch data from.
 * @returns {Promise<Object>} - The fetched data as a JSON object.
 * @async
 */
async function onloadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}

/**
 * Extracts and returns contacts from the given data.
 *
 * @param {Object} responseToJson - The JSON data containing contacts.
 * @returns {Object} - The contacts object.
 */
function fetchContacts(responseToJson) {
  let contacts = responseToJson.contacts;
  return contacts;
}

/**
 * Renders the contacts for assigning users during task editing.
 *
 * @param {Object} contacts - The contacts data.
 * @param {Array<string>} imageUrls - The image URLs of the contacts.
 * @param {number} index - The index of the task being edited.
 */
function assignedToEdit(contacts, imageUrls, index) {
  try {
    const extractNames = (contacts) => {
      return Object.values(contacts).map((entry) => ({ name: entry.name }));
    };
    const names = extractNames(contacts);
    checkboxInitEdit(names, imageUrls, index);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Initializes the checkboxes for assigning users to the task during editing.
 *
 * @param {Array<Object>} names - The names of the contacts.
 * @param {Array<string>} imageUrls - The image URLs of the contacts.
 * @param {number} indexHTML - The index of the task being edited.
 */
function checkboxInitEdit(names, imageUrls, indexHTML) {
  let position = document.getElementById(`checkboxesEdit${indexHTML}`);
  position.innerHTML = "";
  let list = "";
  for (let index = 0; index < names.length; index++) {
    const element = names[index].name;
    const imgSrc = imageUrls[index];
    list += checkBoxRenderEdit(index, imgSrc, element);
  }
  position.innerHTML = list;
}

/**
 * Generates the HTML for a checkbox to assign a user to the task during editing.
 *
 * @param {number} index - The index of the contact.
 * @param {string} imgSrc - The image URL of the contact.
 * @param {string} element - The name of the contact.
 * @returns {string} - The HTML string for the checkbox.
 */
function checkBoxRenderEdit(index, imgSrc, element) {
  return `<label class="checkBoxFlex" for="checkbox-${index}">
                <div class="checkBoxImg">
                    <img src="${imgSrc}" alt="" />
                    ${element}
                </div>
                <input type="checkbox" id="checkbox-${index}" value="${element}" onclick="assignedToUser('${index}','${element}')" />
            </label>`;
}

/**
 * Toggles the assignment of a user to the task during editing.
 *
 * @param {number} index - The index of the contact.
 * @param {string} element - The name of the contact.
 */
function assignedToUserEdit(index, element) {
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
 * Hides the checkboxes for assigning users to the task during editing.
 *
 * @param {number} index - The index of the task being edited.
 */
function checkboxIndexFalse(index) {
  let checkboxes = document.getElementById(`checkboxesEdit${index}`);
  checkboxes.style.display = "none";
  expandedEdit = false;
}

/**
 * Toggles the visibility of the checkboxes for assigning users during task editing.
 *
 * @param {number} index - The index of the task being edited.
 */
function showCheckboxesEdit(index) {
  let checkboxes = document.getElementById(`checkboxesEdit${index}`);
  if (!expandedEdit) {
    checkboxes.style.display = "block";
    expandedEdit = true;
  } else {
    checkboxes.style.display = "none";
    expandedEdit = false;
  }
}

/**
 * Sets the priority of the task during editing based on the selected priority button.
 *
 * @param {number} id - The ID of the priority button clicked.
 */
function prioEdit(id) {
  const buttons = document.querySelectorAll(".add-task-prio-button-container button");

  buttons.forEach((button) => {
    button.classList.remove("add-task-prio-button-urgent", "add-task-prio-button-medium", "add-task-prio-button-low");
    button.classList.add("add-task-prio-button");
  });
  let position = document.getElementById(`prioButton${id}`);
  prioIdCheck(id, position);
}

/**
 * Checks the priority ID and updates the button style accordingly.
 *
 * @param {number} id - The ID of the priority.
 * @param {HTMLElement} position - The DOM element of the priority button.
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
 * Shows the controls for adding a subtask during task editing.
 *
 * @param {number} index - The index of the task being edited.
 */
function showSubtaskControlsEdit(index) {
  document.getElementById(`subtasks${index}`).classList.remove("add-task-input-edit");
  document.getElementById(`subtasks${index}`).classList.add("subtasks-input-edit");
  let position = document.getElementById(`subtasksControl${index}`);
  position.innerHTML = `<button onclick="resetSubtaskInputEdit(${index})" type="button" class="subtask-button-edit">
                                <img src="../public/img/closeAddTask.png" alt="Reset">
                            </button>
                            <div class="seperator-subtasks"></div>
                            <button onclick="addSubtaskEdit(${index})" type="button" class="subtask-button-edit">
                                <img src="../public/img/checkAddTask.png" alt="Add">
                            </button>`;
}

/**
 * Adds a subtask to the task during editing.
 *
 * @param {number} index - The index of the task being edited.
 */
function addSubtaskEdit(index) {
  let input = document.getElementById(`subtasks${index}`);
  if (input.value.trim() !== "") {
    subtasksArray.push(input.value.trim());
    input.value = "";
    subtasksStatusArray.push(false);
    updateSubtasksListEdit(index);
    resetSubtaskInputEdit(index);
  }
}

/**
 * Resets the subtask input field to its original state during task editing.
 *
 * @param {number} index - The index of the task being edited.
 */
function resetSubtaskInputEdit(index) {
  let input = document.getElementById(`subtasks${index}`);
  input.value = "";
  document.getElementById(`subtasks${index}`).classList.add("add-task-input-edit");
  document.getElementById(`subtasks${index}`).classList.remove("subtasks-input-edit");
  let position = document.getElementById(`subtasksControl${index}`);
  position.innerHTML = `<button onclick="showSubtaskControlsEdit(${index})" type="button"  class="add-task-button-edit">
                                +
                            </button>`;
}

/**
 * Updates the list of subtasks displayed during task editing.
 *
 * @param {number} index - The index of the task being edited.
 */
function updateSubtasksListEdit(index) {
  let subtasksPosition = document.getElementById(`subtasksPosition${index}`);
  subtasksPosition.innerHTML = "";
  for (let i = 0; i < subtasksArray.length; i++) {
    const element = subtasksArray[i];
    subtasksPosition.innerHTML += `
                <li><span>${element}</span><div><img src="../public/img/delete.png"><img src="../public/img/edit.png"></div></li> `;
  }
}

/**
 * Renders the subtasks during task editing.
 *
 * @param {number} indexHTML - The index of the task being edited.
 */
function subtasksRenderEdit(indexHTML) {
  let arrayPosition = subtasksLengthArray[indexHTML];
  let subs = arrayPosition.subs;
  let position = document.getElementById(`subtasksBoardEdit${indexHTML}`);
  for (let i = 0; i < subs.length; i++) {
    const element = subs[i];
    console.log(element);
    position.innerHTML += `
            <ul class="subtasksopenedit">
                <li class="d-flex-between"><span>${element}</span><div><img src="../public/img/delete.png"><img src="../public/img/edit.png"></div></li>
            </ul>`;
  }
}

/**
 * Updates the task data on the board after editing and saves it to Firebase.
 *
 * @param {number} index - The index of the task being edited.
 * @param {string} category - The category of the task.
 * @async
 */
async function updateTaskBoard(index, category) {
  defineTaskObjectsEdit(index, category);
  let position = `/tasks/${taskkeys[index]}`;
  await saveToFirebaseEdit(position);
  changeSite("board.html");
  [addTaskArrayEdit, subtasksStatusArray, subtasksArray, assignedToUserArrayNamesGlobal, assignedToUserArray].forEach((arr) => (arr.length = 0));
}

/**
 * Saves the edited task data to Firebase.
 *
 * @param {string} position - The path to save the task data.
 * @async
 */
async function saveToFirebaseEdit(position) {
  let response = await fetch(BASE_URL + position + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addTaskArrayEdit),
  });
}

/**
 * Defines the task objects during editing and pushes them to the array for saving.
 *
 * @param {number} index - The index of the task being edited.
 * @param {string} category - The category of the task.
 */
function defineTaskObjectsEdit(index, category) {
  let taskTitle = document.getElementById(`inputEditTitle${index}`).value;
  let taskDescription = document.getElementById(`descriptionEdit${index}`).value;
  let dueDateTask = document.getElementById(`dueDateEdit${index}`).value;
  let lastString = prioArray.pop();
  let taskCategory = category;
  pushTaskObjectsToArrayEdit(taskTitle, taskDescription, dueDateTask, taskCategory, lastString);
}

/**
 * Pushes the defined task objects into the array for saving during task editing.
 *
 * @param {string} taskTitle - The title of the task.
 * @param {string} taskDescription - The description of the task.
 * @param {string} dueDateTask - The due date of the task.
 * @param {string} taskCategory - The category of the task.
 * @param {string} lastString - The last priority string value.
 */
function pushTaskObjectsToArrayEdit(taskTitle, taskDescription, dueDateTask, taskCategory, lastString) {
  addTaskArrayEdit.push({
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
  console.log(addTaskArrayEdit);
}
