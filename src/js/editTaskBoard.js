let addTaskArrayEdit = [];
let expandedEdit = false;
let selectedPrioEdit = null; // Tracks the selected priority of the task
let subtasksArrayEdit = [];
// let taskInfoEdit;
let usersEdit = [];
let fetchImagesEdit = [];
/**
 * Clears the placeholder of the task title input field during editing.
 *
 * @param {number} index - The index of the task being edited.
 */
function editTitle(index) {
  let position = document.getElementById(`inputEditTitle${index}`);
  position.value = "";
}

/**
 * Clears the placeholder of the task description input field during editing.
 *
 * @param {number} index - The index of the task being edited.
 */
function editDescription(index) {
  let position = document.getElementById(`descriptionEdit${index}`);
  position.value = "";
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
  enableEnterKeyEdit();
  userImageRenderEdit(index);
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
    }}

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
        let imageUrls = Object.values(contacts).map(contact => contact.img);
        return imageUrls;
    } catch (error) {
        console.error("Error fetching images", error);
    }}

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
    position.innerHTML = '';
    let list = '';
    for (let index = 0; index < names.length; index++) {
        const element = names[index].name;
        const imgSrc = imageUrls[index];
        list += checkBoxRenderEdit(index, imgSrc, element);
    }
    position.innerHTML = list;}

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
    }}

/**
 * Sets the priority of the task during editing based on the selected priority button.
 *
 * @param {number} id - The ID of the priority button clicked.
 */
function prioEdit(id) {
    const buttons = document.querySelectorAll('.add-task-prio-button-container button');
    buttons.forEach(button => {
        button.classList.remove('add-task-prio-button-urgent', 'add-task-prio-button-medium', 'add-task-prio-button-low');
        button.classList.add('add-task-prio-button');
    });
    let position = document.getElementById(`prioButtonEdit${id}`);
    prioIdCheck(id, position);
    selectedPrioEdit = true; // Set priority status
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

function addSubtaskEdit(index) {
  let input = document.getElementById(`subtasksEdit${index}`);
  if (input.value.trim() !== "") {
    subtasksArrayEdit.push(input.value.trim());
    input.value = "";
    subtasksStatusArray.push(false);
    resetSubtaskInputEdit(index);
    subtasksRenderEdit(index);
  }
}

/**
 * Updates the task data on the board after editing and saves it to Firebase.
 *
 * @param {number} index - The index of the task being edited.
 * @param {string} category - The category of the task.
 * @async
 */

function handleFormSubmitEdit(event, index, category) {
    event.preventDefault(); 
    let form = event.target; 
    if (!form.checkValidity()) {
        form.reportValidity(); 
        return; }
    if (!selectedPrioEdit) {
        alert("Please select a priority before submitting the form.");
        return;}
    updateTaskBoard(index, category);
}

async function updateTaskBoard(index, category) {
  defineTaskObjectsEdit(index, category);
  let positionTask = `/tasks/${taskkeys[index]}`;
  await saveToFirebaseEdit(positionTask);
  resetFormStateEdit();
  changeSite("board.html");
}

function resetFormStateEdit() {
  addTaskArrayEdit = [];
  selectedPrioEdit = null;
  assignedToUserArrayNamesGlobal = [];
  assignedToUserArray = [];
  subtasksArray = [];
  subtasksStatusArray = [];
  subtasksArrayEdit = [];
  usersEdit = [];
  fetchImagesEdit = [];
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
  let taskDescription = document.getElementById(
    `descriptionEdit${index}`
  ).value;
  let dueDateTask = document.getElementById(`dueDateEdit${index}`).value;
  let lastString = prioArray.pop();
  let taskCategory = category;
  pushTaskObjectsToArrayEdit(
    taskTitle,
    taskDescription,
    dueDateTask,
    taskCategory,
    lastString
  );
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
function pushTaskObjectsToArrayEdit(
  taskTitle,
  taskDescription,
  dueDateTask,
  taskCategory,
  lastString
) {
  addTaskArrayEdit.push({
    title: taskTitle,
    description: taskDescription,
    assignedTo: assignedToUserArray,
    assignedToNames: assignedToUserArrayNamesGlobal,
    dueDate: dueDateTask,
    prio: lastString,
    category: taskCategory,
    subtasks: subtasksArrayEdit,
    subtaskStatus: subtasksStatusArray,
    boardCategory: "todo",
  });
}

function deleteSubtaskEdit(indexHTML){
    let position = document.getElementById(`supplementarySubtaskEdit${indexHTML}`);
    position.innerHTML = '';
    subtasksArrayEdit.splice([indexHTML], 1);
    subtasksRenderEdit(indexHTML);
}

function subtasksRenderEdit(indexHTML) {
  let subtasksedit = subtasksLengthArray[0];
  let position = document.getElementById(`subtasksPosition${indexHTML}`);
  position.innerHTML = "";
  if (subtasksedit) {
    for (let index = 0; index < subtasksedit.length; index++) {
        const element = subtasksedit[index];
        if(element){
        subtasksArrayEdit.push(element)
        }}
        subtasksLengthArray = [];}
 for (let i = 0; i < subtasksArrayEdit.length; i++) {
            const updatesubtasks = subtasksArrayEdit[i];
        position.innerHTML += supplementarySubtaskEditHTML(updatesubtasks, i, indexHTML);
    }} 

function finishSubtaskEdit(i, indexHTML){
    let input = document.getElementById(`inputEditSubtasks${i}`);
    subtasksArrayEdit[i] = input.value;
    console.log(subtasksArrayEdit);
    subtasksRenderEdit(indexHTML);
}

function closeOpenTaskEdit(event, index) {
    event.stopPropagation();
    let openPosition = document.getElementById('openTask');
    openPosition.classList.remove('modal-overlay');
    openPosition.classList.add('d-none');
    openPosition.innerHTML = '';
    resetFormStateEdit();
  }

  function enableEnterKeyEdit() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            let editButton = document.querySelector('.edit-task-button');
            if (editButton) {
                editButton.click();
            }
        }
    });
}
