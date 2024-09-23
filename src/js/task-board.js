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
    let fetchImage = await fetchImagesBoard("/");
    if (!task || typeof task !== 'object') {
      console.warn("No valid task data available.");
      return; 
    }
    taskkeys = Object.keys(task);
    if (taskkeys.length === 0) {
      console.warn("No tasks found.");
      return;
    }

    taskkeysGlobal.push(taskkeys);
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
  assignedTo2(contacts, imageUrl);
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
  searchTasks();
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
 * Filters tasks based on the search input.
 * Displays tasks that match the search query (starting from 3 characters).
 * If the input is cleared, all tasks are shown again.
 */
function searchTasks() {
  const searchInputElement = document.querySelector('.search-task-web');
  const searchInput = searchInputElement.value.toLowerCase();
  let allTasks = document.getElementsByTagName('div');

  for (let i = 0; i < allTasks.length; i++) {
    let task = allTasks[i];
    
    if (task.id.startsWith('parentContainer')) {
      let title = task.getElementsByTagName('h2')[0].innerHTML.toLowerCase();
      if (searchInput.length < 3 || title.includes(searchInput)) {
        task.style.display = 'block';
      } else {
        task.style.display = 'none';
      }
    }
  }
}

/**
 * Opens the form to add a new task.
 *
 * Removes the hidden and non-display classes from the add-task form to make it visible.
 */
function openAddForm() {
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
   *
   * Removes the non-display class from the add-task form, making it visible.
   */
  function closeAddForm() {
    document.getElementById("overlay-form").classList.add("d-none");
    let formField = document.getElementById("add-task-form");
    formField.classList.remove("d-none");
    formField.style.animation = "moveOut 200ms ease-out forwards";
  
    setTimeout(() => {
      formField.classList.add("hidden", "d-none");
      formField.style.cssText =
        "visibility: hidden; transform: translateX(100vw)";
    }, 100);
  
    document.removeEventListener("click", outsideClickHandler, true);
    document.removeEventListener("keydown", handleEnterKey);
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
      let subtaskInput = document.getElementById('subtasks2');
  
      if (activeElement === subtaskInput) {
        addSubtask2();
      } else {
        let addButton = document.getElementById('add-task-button');
        if (addButton) {
          addButton.click();
        }
      }
    }
  }
  
/**
 * Extracts names from contacts and initializes the checkboxes for assigning users to tasks.
 * @param {object} contacts - The contacts object.
 * @param {string[]} imageUrls - An array of image URLs for the contacts.
 * @returns {Promise<void>}
 */
async function assignedTo2(contacts, imageUrls) {
  try {
    const extractNames2 = (contacts) => {
      return Object.values(contacts).map((entry) => ({ name: entry.name }));
    };
    const names = extractNames2(contacts);
    checkboxInit2(names, imageUrls);
  } catch (error) {
    console.error(error);
  }
}
  
  /**
   * Renders checkboxes with contact images and names for assigning users to tasks.
   * @param {object[]} names - An array of contact names.
   * @param {string[]} imageUrls - An array of image URLs for the contacts.
   */
  function checkboxInit2(names, imageUrls) {
    let position = document.getElementById("checkboxes2");
    position.innerHTML = "";
    let list = ""; 
    for (let index = 0; index < names.length; index++) {
      const element2 = names[index].name;
      const imgSrc2 = imageUrls[index];
      list += checkBoxRender2(index, imgSrc2, element2);
    }
    position.innerHTML = list; 
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
    } else {
      assignedToUserArray.push(index);
      assignedToUserArrayNamesGlobal.push(element);
      imageUrlsGlobal.push(imgSrc);
    }
  }