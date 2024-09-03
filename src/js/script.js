let subtasksLengthArray = [];
const taskData = {};
let taskkeys = [];
let progressStatusTrue = [];
let TechnicalTask = "Technical Task";
let UserStory = "User Story";

<<<<<<< HEAD
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let element of includeElements) {
    const file = element.getAttribute("w3-include-html");
    try {
      let sanitizedUrl = new URL(file, window.location.href);
      sanitizedUrl.username = "";
      sanitizedUrl.password = "";
      let resp = await fetch(sanitizedUrl);
      await whichChangeSite(resp, element, file);
    } catch (error) {
      console.error("Error fetching file:", file, error);
      element.innerHTML = "Error loading page";
    }
  }
}

async function whichChangeSite(resp, element, file) {
  if (resp.ok) {
    element.innerHTML = await resp.text();
    if (file.includes("addTask.html")) {
      init();
    }
    if (file.includes("contacts.html")) {
      initContacts();
    }
    if (file.includes("board.html")) {
      loadingBoard();
    }
    if (file.includes("summary.html")) {
      initSmry();
    }
  } else {
    element.innerHTML = "Page not found";
  }
}

async function changeSite(page) {
  document.querySelector(".main-content").setAttribute("w3-include-html", page);
  includeHTML();
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const mainContent = document.querySelector(".main-content");
    const currentPage = mainContent.getAttribute("w3-include-html");
    if (currentPage && currentPage.includes("summary.html")) {
      summaryGreeting();
    }
  }
});

function clearLocalStorage() {
  localStorage.removeItem("user");
}

function toggleElement(elementClass, className) {
  const element = document.querySelector(elementClass);
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
}

function toggleRotateClass(event) {
  const element = event.target.closest(".board-task-container");
  if (element) {
    if (event.type === "mousedown") {
      element.classList.add("rotate");
    } else {
      element.classList.remove("rotate");
    }
  }
}

document.addEventListener("mousedown", toggleRotateClass);
document.addEventListener("mouseup", toggleRotateClass);
document.addEventListener("mouseleave", toggleRotateClass);
document.addEventListener("dragend", toggleRotateClass);

function updateStatusMessages() {
  const containers = document.querySelectorAll(".board-render-status-container");

  containers.forEach((container) => {
    const statusMessage = container.previousElementSibling;
    const taskCount = container.children.length;

    if (taskCount > 0) {
      statusMessage.classList.add("d-none");
    } else {
      statusMessage.classList.remove("d-none");
    }
  });
}

function hideDropdown() {
  const element = document.querySelector(".user-icon-dropdown");
  if (!element.classList.contains("d-none")) {
    element.classList.add("d-none");
  }
}

async function loadingBoard() {
  try {
    taskkeysGlobal.length = 0;
    task = await onloadDataBoard("/tasks");
    taskkeys = Object.keys(task);
    taskkeysGlobal.push(taskkeys);
    let fetchImage = await fetchImagesBoard("/");
    await generateHTMLObjects(taskkeys, task);
    await generateHTMLObjectsForUserPrioSubtasks(taskkeys, task, fetchImage);
    updateStatusMessages();
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}


async function onloadDataBoard(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}

async function fetchImagesBoard(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  let contacts = responseToJson.contacts;
  let imageUrl = Object.values(contacts).map((contacts) => contacts.img);
  return imageUrl;
}

async function generateHTMLObjects(taskkeys, task) {
  for (let index = 0; index < taskkeys.length; index++) {
    const { category, description, dueDate, prio, title, boardCategory } = task[taskkeys[index]][0];
    await positionOfHTMLBlock(index, category, title, description, dueDate, prio, boardCategory);
  }
}

async function updateHTML() {
  const categories = ["todo", "progress", "feedback", "done"];

  for (const category of categories) {
    const container = document.getElementById(category);
    container.innerHTML = "";
  }

  try {
    await loadingBoard();
  } catch (error) {
    console.error("Fehler beim Aktualisieren der HTML-Inhalte:", error);
  }
}

function startDragging(taskkey) {
  currentDraggedElement = taskkey;
  console.log("Dragging element with taskkey:", currentDraggedElement);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function onDrop(event) {
  event.preventDefault();
  const newCategory = event.target.dataset.category;
  moveTo(newCategory);
}

async function moveTo(category) {
  if (currentDraggedElement) {
    task[currentDraggedElement]["boardCategory"] = category;

    await updateTaskInFirebase({
      id: currentDraggedElement,
      boardCategory: category,
    });

    await updateHTML();
  } else {
    console.error("No task is being dragged.");
  }
  updateStatusMessages();
}

async function updateTaskInFirebase(task) {
  try {
    await fetch(`${BASE_URL}/tasks/${task.id}/0.json`, {
      method: "PATCH",
      body: JSON.stringify({ boardCategory: task.boardCategory }),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating task in Firebase:", error);
  }
}

=======
/**
 * Generates and populates HTML objects for tasks, including user images, priority, and subtasks.
 * 
 * Iterates through task keys, fetching necessary data, and updates the HTML content for each task.
 * 
 * @param {Array<string>} taskkeys - Array of task IDs.
 * @param {Object} task - An object containing task data indexed by task IDs.
 * @param {Object} fetchImage - An object mapping user IDs to image URLs.
 */
>>>>>>> simplify
async function generateHTMLObjectsForUserPrioSubtasks(taskkeys, task, fetchImage) {
  for (let index = 0; index < taskkeys.length; index++) {
    const tasksID = taskkeys[index];
    const taskFolder = task[tasksID];
    let users = taskFolder[0].assignedTo;
    let subtasks = taskFolder[0].subtasks;
    let prio = taskFolder[0].prio;
    let userNames = taskFolder[0].assignedToNames;
    taskData[index] = { users, userNames, prio, subtasks, fetchImage };
    await Promise.all([
      searchIndexUrl(index, users, fetchImage),
      searchprio(index, prio),
      subtasksRender(index, subtasks)
    ]);
    await progressBar(index);
  }
}

/**
 * Positions and sets the HTML content for a task block.
 * 
 * Updates the color, HTML content, and applies category-specific styling for the task.
 * 
 * @param {number} index - The index of the task.
 * @param {string} category - The category of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} date - The due date of the task.
 * @param {string} prio - The priority level of the task.
 * @param {string} boardCategory - The category of the board.
 */
async function positionOfHTMLBlock(index, category, title, description, date, prio, boardCategory) {
  setTaskColor(category);
  let position = document.getElementById(`${boardCategory}`);
  position.innerHTML += await window.htmlboard(index, category, title, description, date, prio);
  limitTextTo50Chars(`limitTextDesciption${index}`);
  CategoryColor(index, category);
}

/**
 * Updates the priority display for a task.
 * 
 * Sets the HTML content to show the priority level using appropriate images.
 * 
 * @param {number} index - The index of the task.
 * @param {string} prio - The priority level of the task.
 */
function searchprio(index, prio) {
  let position = document.getElementById(`prioPosition${index}`);
  position.innerHTML = "";
  if (prio === "Urgent") {
    position.innerHTML = `<img src="../public/img/Prio alta.png" alt="">`;
  } else if (prio === "Medium") {
    position.innerHTML = `<img src="../public/img/prioOrange.png" alt="">`;
  } else if (prio === "Low") {
    position.innerHTML = `<img src="../public/img/Prio baja.png" alt="">`;
  }
}

/**
 * Loads and updates the status of subtasks.
 * 
 * Retrieves subtask statuses from Firebase and updates the corresponding checkboxes.
 * 
 * @param {number} indexHtml - The index of the task in the HTML structure.
 */
async function loadSubtaskStatus(indexHtml) {
  for (let index = 0; index < taskkeysGlobal.length; index++) {
    const element = taskkeysGlobal[index];
    const taskKeyId = element[indexHtml];
    let data = await onloadDataBoard(`/tasks/${taskKeyId}/0/subtaskStatus/`);
    if (data == null) {
      return;
    }
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      try {
        let checkbox = document.getElementById(`subtask-${indexHtml}-${i}`);
        if (element === true && checkbox) {
          checkbox.checked = element;
        }
      } catch (error) {
        console.error(`Error loading status for subtask checkbox ${index}: `, error);
      }
    }
  }
}

/**
 * Updates the HTML content with user images for a task.
 * 
 * Displays images of users assigned to the task based on the provided URLs.
 * 
 * @param {number} index - The index of the task.
 * @param {Array<string>} users - Array of user IDs assigned to the task.
 * @param {Object} fetchImage - Object mapping user IDs to image URLs.
 */
async function searchIndexUrl(index, users, fetchImage) {
  let position = document.getElementById(`userImageBoard${index}`);
  position.innerHTML = "";
  if (users == null) {
    return;
  }
  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    let imageUrl = fetchImage[element];
    position.innerHTML += await htmlBoardImage(imageUrl, index);
  }
  setTimeout(() => tileUserImage(index), 50);
}

/**
 * Tiles user images in the display container.
 * 
 * Adjusts the positioning of user images to fit within the container with possible overlapping.
 * 
 * @param {number} index - The index of the task.
 */
function tileUserImage(index) {
  const container = document.getElementById(`userImageBoard${index}`);
  const images = container.getElementsByClassName("image-div");
  const containerWidth = 80;
  const imageWidth = 32;
  const imagelength = images.length;
  const totalImagesWidth = imageWidth * imagelength;
  const overlap = totalImagesWidth > containerWidth ? (totalImagesWidth - containerWidth) / (imagelength - 1) : 0;
  for (let i = 0; i < images.length; i++) {
    const imagePosition = images[i];
    imagePosition.style.position = "absolute";
    imagePosition.style.left = `${i * (imageWidth - overlap)}px`;
  }
}

/**
 * Updates the status of a subtask based on the checkbox state.
 * 
 * Saves the checked status of the subtask to Firebase.
 * 
 * @param {number} indexHtml - The index of the task in the HTML structure.
 * @param {number} index - The index of the subtask.
 */
async function subtaskStatus(indexHtml, index) {
  const checkbox = document.getElementById(`subtask-${indexHtml}-${index}`);
  const isChecked = checkbox.checked;
  await statusSubtaskSaveToFirebase(isChecked, indexHtml, index);
}

/**
 * Saves the subtask status to Firebase.
 * 
 * Sends a PUT request to update the subtask status in Firebase.
 * 
 * @param {boolean} isChecked - The checked status of the subtask.
 * @param {number} indexHtml - The index of the task in the HTML structure.
 * @param {number} index - The index of the subtask.
 */
async function statusSubtaskSaveToFirebase(isChecked, indexHtml, index) {
  for (const taskKeyId of taskkeysGlobal.map((el) => el[indexHtml])) {
    const path = `/tasks/${taskKeyId}/0/subtaskStatus/${index}`;
    try {
      const response = await fetch(`${BASE_URL}${path}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isChecked),
      });
      if (!response.ok) {
        console.error(`Error updating status of subtask checkbox ${index}:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error saving status of subtask checkbox ${index}:`, error);
    }
  }
}

/**
 * Updates the progress bar based on the completion status of subtasks.
 * 
 * Calculates the percentage of completed subtasks and updates the progress bar width.
 * 
 * @param {number} indexHtml - The index of the task in the HTML structure.
 */
async function progressBar(indexHtml) {
  let progressBar = document.getElementById(`progressBar${indexHtml}`);
  let positionOfTrueAmount = document.getElementById(`subtasksAmountTrue${indexHtml}`)
  let trueCount = 0, totalCount = 0;
  for (let index = 0; index < taskkeysGlobal.length; index++) {
    let data = await onloadDataBoard(`/tasks/${taskkeysGlobal[index][indexHtml]}/0/subtaskStatus/`);
    if (!data || data.length === 0) continue;
    totalCount += data.length;
    data.forEach((statusID, i) => {
      if (statusID === true) {
        trueCount++;
        progressStatusTrue.push({ index: i, statusTrue: statusID });
      }
    });
  }
  positionOfTrueAmount.innerHTML = `<div>${trueCount}/</div>`;
  if (totalCount > 0) progressBar.style.width = `${(trueCount / totalCount) * 100}%`;
}

/**
 * Opens the form to add a new task.
 * 
 * Removes the hidden and non-display classes from the add-task form to make it visible.
 */
function openAddForm() {
  let overlay = document.getElementById('overlay');
  overlay.classList.remove("d-none");
  
  let formField = document.getElementById("add-task-form");
  formField.classList.remove("d-none", "hidden");
  formField.style.cssText = "visibility: visible; transform: translateX(100vw); animation: moveIn 200ms ease-in forwards";

  document.addEventListener("click", outsideClickHandler);
}

/**
 * Closes the form to add a new task.
 * 
 * Removes the non-display class from the add-task form, making it visible.
 */
function closeAddForm() {
  let overlay = document.getElementById('overlay');
  overlay.classList.add("d-none");

  let formField = document.getElementById("add-task-form");
  formField.style.animation = "moveOut 200ms ease-out forwards";

  setTimeout(() => {
    formField.classList.add("hidden", "d-none");
    formField.style.cssText = "visibility: hidden; transform: translateX(100vw)";
  }, 100);


  document.removeEventListener("click", outsideClickHandler);
}

<<<<<<< HEAD
function outsideClickHandler(event) {
  let formField = document.getElementById("add-task-form");
  let overlay = document.getElementById("overlay");

  if (!formField.contains(event.target) && overlay.contains(event.target)) {
    closeAddForm();
  }
}


=======
/**
 * Updates the priority button styling.
 * 
 * Applies and removes priority classes from buttons based on the provided ID.
 * 
 * @param {string} id - The ID of the button to update.
 */
>>>>>>> simplify
function prio2(id) {
  const buttons = document.querySelectorAll(".add-task-prio-button-container button");

  buttons.forEach((button) => {
    button.classList.remove("add-task-prio-button-urgent", "add-task-prio-button-medium", "add-task-prio-button-low");
    button.classList.add("add-task-prio-button");
  });
  let position = document.getElementById(`prio2Button${id}`);
  prioIdCheck(id, position);
}

/**
 * Defines task objects for creation.
 * 
 * Retrieves values from input fields and pushes them into the task array.
 */
function defineTaskObjects2() {
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
 * Creates a task object and adds it to `addTaskArray`.
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
    boardCategory: "todo",
  });
}

/**
 * Shows subtask controls for input and adding subtasks.
 * 
 * Updates the visibility and HTML content of subtask controls.
 */
function showSubtaskControls2() {
  document.getElementById("subtasks2").classList.remove("add-task-input");
  document.getElementById("subtask2").classList.add("subtasks-input");
  let position = document.getElementById("subtasksControl2");
  position.innerHTML = `<button onclick="resetSubtaskInput()" type="button" class="subtask-button">
                              <img src="../public/img/closeAddTask.png" alt="Reset">
                          </button>
                          <div class="seperator-subtasks"></div>
                          <button onclick="addSubtask()" type="button" class="subtask-button">
                              <img src="../public/img/checkAddTask.png" alt="Add">
                          </button>`;
}

/**
 * Adds a new subtask to the list.
 * 
 * Retrieves the value from the input field and updates the subtasks list.
 */
function addSubtask2() {
  let input = document.getElementById("subtasks2");
  if (input.value.trim() !== "") {
    subtasksArray.push(input.value.trim());
    input.value = "";
    updateSubtasksList2();
    resetSubtaskInput2();
  }
}

/**
 * Saves the current task data to Firebase.
 * 
 * Sends a POST request to add tasks to the Firebase database.
 * 
 * @param {string} [path="/tasks"] - The path to save the tasks.
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
 * Clears the subtasks display.
 * 
 * Removes all HTML content from the subtasks position element.
 */
function clearSubtask2() {
  let position = document.getElementById("subtasksPosition");
  position.innerHTML = "";
}

/**
 * Creates a new task based on form input.
 * 
 * Prevents default form submission, validates the form, and saves the task data.
 * 
 * @param {Event} event - The form submission event.
 */
async function createTask(event) {
  event.preventDefault();
  let form = event.target;
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  defineTaskObjects2();
  await saveToFirebase2();
  form.reset();
  addTaskArray = [];
  clearSubtask2();
  await changeSite("board.html");
}

/**
 * Searches and filters tasks based on the query string.
 * 
 * Hides or shows task containers based on whether the task title includes the query.
 * 
 * @param {string} query - The search query string.
 */
function searchTasks(query) {
  let lowerCaseQuery = query.toLowerCase();
  let minQueryLength = 3;

  if (lowerCaseQuery.length < minQueryLength) {
    resetTaskVisibility();
    return;
  }

  let taskContainers = document.querySelectorAll(".board-render-status-container");
  taskContainers.forEach((container) => {
    let tasks = container.querySelectorAll(".board-task-container");
    let taskFound = false;
    tasks.forEach((task) => {
      let taskTitleElement = task.querySelector(".task-title");
      if (taskTitleElement) {
        let taskTitle = taskTitleElement.textContent.toLowerCase();
        if (taskTitle.includes(lowerCaseQuery)) {
          task.style.display = "";
          taskFound = true;
        } else {
          task.style.display = "none";
        }
      } else {
        console.error("Element '.task-title' not found.");
      }
    });
    container.style.display = taskFound ? "" : "none";
  });
}

/**
 * Resets the visibility of all tasks.
 * 
 * Makes all task containers and tasks visible again.
 */
function resetTaskVisibility() {
  let taskContainers = document.querySelectorAll(".board-render-status-container");
  taskContainers.forEach((container) => {
    let tasks = container.querySelectorAll(".board-task-container");
    tasks.forEach((task) => {
      task.style.display = "";
    });

    container.style.display = "";
  });
}
