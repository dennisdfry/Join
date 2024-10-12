let taskArrayBoard = [];
let titleBoard = [];
let descriptionBoard = [];
let imageUrlBoard = [];
let userNamesBoard = [];
let ToDoBoard = [];
let subtasksOpenArray = [];
let subtasksEditArrayFinish = [];
let subtasksEditArrayOrigin = [];
let assignedToUserArrayOpen = [];
let subtaskStatusArray = [];
let assignedToEditName = [];
let asiignedToEditUrl = [];
let showSubtasksEdit = [];
let subtasksStatusArrayEdit = [];
let subtasksEditArrayDelete = [];
let showSubtaskConrolFalse = false;
let subtasksControlGlobal = [];

async function initDataBoard() {
  taskArrayBoard = [];
  try {
    taskkeysGlobal.length = 0;
    task = await onloadDataBoard("/tasks");
    let fetchImageUrls = await fetchImagesUrlsBoardNew("/");
    let fetchUserNames = await fetchUserNamesBoardNew("/");
    for (let index = 0; index < fetchImageUrls.length; index++) {
      const elementUrl = fetchImageUrls[index];
      const elementNames = fetchUserNames[index].name;
      imageUrlBoard.push(elementUrl);
      userNamesBoard.push(elementNames);
    }
    if (!task || typeof task !== "object") {
      console.warn("No valid task data available.");
      return;
    }
    taskkeys = Object.keys(task);
    if (taskkeys.length === 0) {
      console.warn("No tasks found.");
      return;
    }
    taskkeysGlobal.push(taskkeys);
    await generateHTMLObjectsBoard(taskkeys, task);
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

/**
 * Loads data from the specified path and returns the parsed JSON response.
 *
 * @param {string} [path=""] - The path to the JSON data.
 * @returns {Promise<Object>} - A promise that resolves to the parsed JSON data.
 */
async function onloadDataBoard(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}

/**
 * Fetches image URLs from the contacts in the JSON data at the specified path.
 *
 * @param {string} [path=""] - The path to the JSON data.
 * @returns {Promise<string[]>} - A promise that resolves to an array of image URLs.
 */
async function fetchImagesUrlsBoardNew(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  let contacts = responseToJson.contacts;
  let imageUrl = Object.values(contacts).map((contact) => contact.img);
  await assignedToBoard(contacts, imageUrl)
  return imageUrl;
}

/**
 * Fetches user names from the contacts in the JSON data at the specified path.
 *
 * @param {string} [path=""] - The path to the JSON data.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing user names.
 */
async function fetchUserNamesBoardNew(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  let contacts = responseToJson.contacts;
  try {
    const extractNamesBoard = (contacts) => {
      return Object.values(contacts).map((entry) => ({ name: entry.name }));
    };
    const names = extractNamesBoard(contacts);
    return names;
  } catch (error) {
    console.error(error);
  }
}

async function generateHTMLObjectsBoard(taskkeys, task) {
  for (let index = 0; index < taskkeys.length; index++) {
    const { category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks, subtaskStatus } =
      task[taskkeys[index]][0];
    taskArrayBoard.push({
      title: title,
      description: description,
      dueDate: dueDate,
      category: category,
      prio: prio,
      boardCategory: boardCategory,
      assignedTo: assignedTo,
      subtasks: subtasks,
      subtaskStatus: subtaskStatus,
    });
  }
   upstreamHTMLrender();
}

/**
 * Generates HTML objects for the task board based on provided task keys and task data.
 *
 * @param {Array<string>} taskkeys - An array of keys representing tasks.
 * @param {Object} task - An object containing task details for each key.
 */
function upstreamHTMLrender() {
  document.getElementById("todo").innerHTML = "";
  document.getElementById("progress").innerHTML = "";
  document.getElementById("feedback").innerHTML = "";
  document.getElementById("done").innerHTML = "";

  for (let index = 0; index < taskArrayBoard.length; index++) {
      const element = taskArrayBoard[index];
      const { category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks, subtaskStatus } = element;

      positionOfHTMLBlockBoard(
          index,
          category,
          description,
          dueDate,
          prio,
          title,
          boardCategory,
          assignedTo,
          subtasks,
          subtaskStatus
      );
    searchIndexUrlBoard(index, assignedTo);
    searchprioBoard(index, prio);
    subtasksRenderBoard(index, subtasks);
    CategoryColor(index, category);
    progressBar(index, subtasks, subtaskStatus);
  }
}

/**
 * Updates the priority display for a specific task on the board based on the given priority level.
 *
 * @param {number} index - The index of the task for which to display the priority.
 * @param {string} prio - The priority level of the task (e.g., "Urgent", "Medium", "Low").
 */
function searchprioBoard(index, prio) {
  let position = document.getElementById(`prioPosition${index}`);
  position.innerHTML = "";
  if (prio == "Urgent") {
    position.innerHTML = `<img  src="../public/img/Prio alta.png" alt="">`;
  } else {
    if (prio == "Medium") {
      position.innerHTML = `<img  src="../public/img/prioOrange.png" alt="">`;
    } else {
      if (prio == "Low") {
        position.innerHTML = `<img src="../public/img/Prio baja.png" alt="">`;
      }
    }
  }
}

/**
 * Positions an HTML block for the board.
 *
 * @param {number} index - The index of the task.
 * @param {string} category - The category of the task.
 * @param {string} description - The description of the task.
 * @param {string} dueDate - The due date of the task.
 * @param {string} prio - The priority of the task.
 * @param {string} title - The title of the task.
 * @param {string} boardCategory - The board category of the task.
 * @param {string} assignedTo - The user assigned to the task.
 * @param {string} subtasks - The subtasks associated with the task.
 * @param {string} subtaskStatus - The status of the subtasks.
 */
function positionOfHTMLBlockBoard(
  index,
  category,
  description,
  dueDate,
  prio,
  title,
  boardCategory,
  assignedTo,
  subtasks,
  subtaskStatus
) {
  let position = document.getElementById(`${boardCategory}`);
  position.innerHTML += `
    <div id="parentContainer${index}" draggable="true" ondragstart="startDragging('${taskkeys[index]}')" onclick="openTaskToBoardRender('${index}', '${category}', '${description}', '${dueDate}', '${prio}', '${title}', '${boardCategory}', '${assignedTo}', '${subtasks}', '${subtaskStatus}')" class="board-task-container pointer bradius24 d-flex flex-d-col content-even mg-btt25"> 
      <div class="d-flex-between" style="position: relative;">
        <h1 id="categoryColor${index}" class="txt-center fs-16 mg-block-none bradius8 color-wh">${category}</h1>
        <img src="/public/img/dots.png" id="dots-parent-container${index}" onclick="toggleElementDropDown(event, '#taskDropdown${index}', 'd-none')">
        <div id="taskDropdown${index}" class="task-dropdown d-flex-start flex-d-col p-10 d-none">
          <span>Move to:</span>
          <a href="#" onclick="moveTaskToCategory('${taskkeys[index]}', 'todo')">ToDo</a>
          <a href="#" onclick="moveTaskToCategory('${taskkeys[index]}', 'progress')">Progress</a>
          <a href="#" onclick="moveTaskToCategory('${taskkeys[index]}', 'feedback')">Feedback</a>
          <a href="#" onclick="moveTaskToCategory('${taskkeys[index]}', 'done')">Done</a>
        </div>
        <img onclick="closeOpenTask(${index})" id="closeOpenTask${index}" class="d-none" src="../public/img/Close.png">
      </div>
      <div class="width220 mg-top-4">
        <h2 class="mg-block-none fs-16 fw-700">${title}</h2> 
      </div>
      <div class="mg-bot-4 mg-top-4">  
        <p class="mg-block-none fs-16 fw-400 color-gr width220" id="limitTextDesciption${index}">${description}</p>
      </div> 
      <div class="progress-container d-flex-between width220">
        <div id="hideProgressBar${index}" class="width128">
          <div id="progressBar${index}" class="progress-bar pointer"></div>
        </div>
        <div id="hideProgressAmount${index}" class="d-flex">
          <div id="subtasksAmountTrue${index}" class="d-flex-center fs-12 fw-400 color-bl"></div>
          <div id="subtasks${index}" class="subtasksLength fs-12 fw-400 color-bl"></div>
        </div>
      </div>
      <div class="d-flex-between width220">
        <div class="user-image-bord-container" id="userImageBoard${index}"></div>
        <div class="img-32 d-flex-center" id="prioPosition${index}"></div>
      </div>  
    </div>`;
}

function searchIndexUrlBoard(indexHTML, assignedTo) {
  let position = document.getElementById(`userImageBoard${indexHTML}`);
  position.innerHTML = "";
  if (assignedTo == null) {
    return;
  }
  const maxImages = Math.min(assignedTo.length, 4);
  for (let index = 0; index < maxImages; index++) {
    let imageUrlNumber = assignedTo[index];
    let imageUrlPositionFromArray = imageUrlBoard[imageUrlNumber];
    position.innerHTML += `<img class="img-24" src="${imageUrlPositionFromArray}" alt="" />`;
  }
  if (assignedTo.length > 4) {
    const remaining = assignedTo.length - 4;
    position.innerHTML += `
      <div class="img-24 more-users-board">
        +${remaining}
      </div>`;
  }
}

/**
 * Updates the user image display on the board for a specific task based on assigned users.
 *
 * @param {number} indexHTML - The index of the task in the HTML to display user images.
 * @param {Array<number>} assignedTo - An array of indices representing users assigned to the task.
 */
function subtasksRenderBoard(indexHtml, subtasks) {
  let positionOfSubtasksLength = document.querySelector(`.subtasksLength${indexHtml}`);
  if (positionOfSubtasksLength) {
    if (Array.isArray(subtasks)) {
      positionOfSubtasksLength.innerHTML = `<p class="subtasks-board-task-text">${subtasks.length} Subtasks</p>`;
    } else {
      positionOfSubtasksLength.innerHTML = `<p class="subtasks-board-task-text">0 Subtasks</p>`;
    }
  }
}


/**
 * Loads and updates the completion status of subtasks based on the provided status string.
 *
 * @param {number} indexHtml - The index of the HTML element associated with the subtasks.
 * @param {string} subtaskStatus - A comma-separated string representing the completion status of each subtask.
 */
function loadSubtaskStatus(indexHtml, subtaskStatus) {
  let subtaskStatusArrayDev = subtaskStatus.split(",").map((status) => status.trim());
  for (let i = 0; i < subtaskStatusArrayDev.length; i++) {
    let checkbox = document.getElementById(`subtask-${indexHtml}-${i}`);
    if (checkbox) {
      checkbox.checked = subtaskStatusArrayDev[i] === "true" || subtaskStatusArrayDev[i] === true;
    }
  }
}

/**
 * Saves the completion status of a subtask to Firebase based on the checkbox state.
 *
 * @param {number} indexHtml - The index of the HTML element associated with the subtask.
 * @param {number} index - The index of the subtask to update.
 * @returns {Promise<void>} - A promise that resolves when the status is saved.
 */
async function subtaskStatus(indexHtml, index) {
  let checkbox = document.getElementById(`subtask-${indexHtml}-${index}`);
  let isChecked = checkbox.checked;

  if (taskArrayBoard[indexHtml] && Array.isArray(taskArrayBoard[indexHtml].subtaskStatus)) {
    taskArrayBoard[indexHtml].subtaskStatus[index] = isChecked;
  }

 await statusSubtaskSaveToFirebase(isChecked, indexHtml, index).then(() => {
    let { subtasks, subtaskStatus } = taskArrayBoard[indexHtml];
    progressBar(indexHtml, subtasks, subtaskStatus);
  });
}

/**
 * Sets the background color of the category element based on the category type.
 *
 * @param {number} index - The index of the task.
 * @param {string} category - The category of the task.
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
      } else {
        console.log(`Subtask ${index} updated successfully!`);
      }
    } catch (error) {
      console.error(`Error saving status of subtask checkbox ${index}:`, error);
    }
  }
}
