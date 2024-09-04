const taskkeysGlobal = [];
let task = {};
let currentDraggedElement;

/**
 * Loads the task board data, fetches images, and generates HTML elements.
 * The function resets the global task keys array, loads task data, fetches images,
 * generates HTML objects for tasks, and updates status messages on the board.
 * 
 * @async
 */
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

/**
 * Fetches and loads task data from the specified path.
 * 
 * @param {string} [path=""] - The path to fetch the task data from.
 * @returns {Promise<Object>} A promise that resolves to the task data.
 * @async
 */
async function onloadDataBoard(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}

/**
 * Fetches and loads images for the board from the specified path.
 * 
 * @param {string} [path=""] - The path to fetch the images from.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of image URLs.
 * @async
 */
async function fetchImagesBoard(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  let contacts = responseToJson.contacts;
  let imageUrl = Object.values(contacts).map((contact) => contact.img);
  return imageUrl;
}

/**
 * Generates and positions HTML elements for each task on the board.
 * 
 * @param {Array<string>} taskkeys - Array of task keys to be processed.
 * @param {Object} task - The task data object containing details of each task.
 * @async
 */
async function generateHTMLObjects(taskkeys, task) {
  for (let index = 0; index < taskkeys.length; index++) {
    const { category, description, dueDate, prio, title, boardCategory } = task[taskkeys[index]][0];
    await positionOfHTMLBlock(index, category, title, description, dueDate, prio, boardCategory);
  }
}

/**
 * Clears and updates the HTML content of task categories on the board.
 * The function clears the content of predefined task categories and then
 * reloads the board data and updates the HTML content.
 * 
 * @async
 */
async function updateHTML() {
  const categories = ["todo", "progress", "feedback", "done"];

  for (const category of categories) {
    const container = document.getElementById(category);
    container.innerHTML = "";
  }

  try {
    await loadingBoard();
  } catch (error) {
    console.error("Error updating HTML content:", error);
  }
}

/**
 * Updates the priority button styling.
 * 
 * Applies and removes priority classes from buttons based on the provided ID.
 * 
 * @param {string} id - The ID of the button to update.
 */
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

/**
 * Opens the form to add a new task.
 * 
 * Removes the hidden and non-display classes from the add-task form to make it visible.
 */
function openAddForm() {
  document.getElementById("add-task-form").classList.remove("vis-hidden");
  document.getElementById("add-task-form").classList.remove("d-none");
  let overlay = document.getElementById('overlay-form');
  overlay.classList.remove("d-none");
  let formField = document.getElementById("add-task-form");
  formField.classList.remove("d-none", "hidden");
  formField.style.cssText = "visibility: visible; transform: translateX(100vw); animation: moveIn 200ms ease-in forwards";
  document.addEventListener("click", outsideClickHandler);

}

/**
 * Closes the form.
 * 
 * Removes the non-display class from the add-task form, making it visible.
 */
function closeAddForm() {
  document.getElementById('overlay-form').classList.add("d-none");
  let formField = document.getElementById("add-task-form");
  formField.classList.remove("d-none");
  formField.style.animation = "moveOut 200ms ease-out forwards";

  setTimeout(() => {
    formField.classList.add("hidden", "d-none");
    formField.style.cssText = "visibility: hidden; transform: translateX(100vw)";
  }, 100);


document.removeEventListener("click", outsideClickHandler);
}

function outsideClickHandler(event) {
  let formField = document.getElementById("add-task-form");
  let overlay = document.getElementById("overlay-form");

  if (!formField.contains(event.target) && overlay.contains(event.target)) {
    closeAddForm();
  }
}
