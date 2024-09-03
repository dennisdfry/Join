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
