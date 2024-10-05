let taskArrayBoard = [];
let titleBoard = [];
let descriptionBoard =[];
let imageUrlBoard = [];
let userNamesBoard = [];
let ToDoBoard = [];
let subtasksOpenArray = [];
let subtasksEditArrayFinish = [];
let subtasksEditArrayOrigin = [];
let assignedToUserArrayOpen = [];
let subtaskStatusArray = [];
let assignedToEditName = []
let asiignedToEditUrl = [];
let showSubtasksEdit = [];
let subtasksStatusArrayEdit = [];
let subtasksEditArrayDelete = [];


async function initDataBoard(){
  taskArrayBoard = [];
    try {
        taskkeysGlobal.length = 0;
        task = await onloadDataBoard("/tasks");
        let fetchImageUrls = await fetchImagesUrlsBoardNew("/");
        let fetchUserNames = await fetchUserNamesBoardNew("/");
        for (let index = 0; index < fetchImageUrls.length; index++) {
            const elementUrl = fetchImageUrls[index];
            const elementNames = fetchUserNames[index].name;
            imageUrlBoard.push(elementUrl)
            userNamesBoard.push(elementNames)  
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
async function onloadDataBoard(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}

async function fetchImagesUrlsBoardNew(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  let contacts = responseToJson.contacts;
  let imageUrl = Object.values(contacts).map((contact) => contact.img);
  return imageUrl;
}

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
    const { category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus} = task[taskkeys[index]][0];
    taskArrayBoard.push({
      title: title,
      description: description,
      dueDate:dueDate,
      category:category,
      prio:prio,
      boardCategory:boardCategory,
      assignedTo: assignedTo,
      subtasks: subtasks,
      subtaskStatus: subtaskStatus
    })
  }
  upstreamHTMLrender();
}

  function upstreamHTMLrender(){
    for (let index = 0; index < taskArrayBoard.length; index++) {
      const element = taskArrayBoard[index];
      const { category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus} = element;
      positionOfHTMLBlockBoard(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus)
      searchIndexUrlBoard(index, assignedTo);
      searchprioBoard(index, prio);
      subtasksRenderBoard(index, subtasks);
      CategoryColor(index, category);
      progressBar(index, subtasks, subtaskStatus);
    }}
    
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
function positionOfHTMLBlockBoard(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks, subtaskStatus) {
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

function subtasksRenderBoard(indexHtml, subtasks) {
  subtasksLengthArray.push({
    position: indexHtml,
    subs: subtasks,
  });
  let positionOfSubtasksLength = document.querySelector(`.subtasksLength${indexHtml}`);
  if (positionOfSubtasksLength) {
    if (Array.isArray(subtasks)) {
      positionOfSubtasksLength.innerHTML = `<p class="subtasks-board-task-text">${subtasks.length} Subtasks</p>`;
    } else {
      positionOfSubtasksLength.innerHTML = `<p class="subtasks-board-task-text">0 Subtasks</p>`;
    }
  }
}

function CategoryColor(index, category) {
  let position = document.getElementById(`categoryColor${index}`);
  if (category == TechnicalTask) {
    position.style.backgroundColor = "#1fd7c1";
  } else {
    position.style.backgroundColor = "#0038ff";
  }
}


function progressBar(index, subtasks, subtaskStatus) {
  console.log(index)
  let progressBar = document.getElementById(`progressBar${index}`);
  let positionOfTrueAmount = document.getElementById(`subtasksAmountTrue${index}`);

  if (!subtasks || subtasks.length === 0) {
    positionOfTrueAmount.innerHTML = "0/0";
    progressBar.style.width = "0%";
    return;
  }

  let { trueCount, totalCount } = calculateProgress(index, subtasks, subtaskStatus);
  positionOfTrueAmount.innerHTML = `${trueCount}/${totalCount}`;
  
  let progressPercentage = (trueCount / totalCount) * 100;
  updateProgressBar(index, progressPercentage);
}

/**
 * Updates the progress bar width and color based on the percentage of completed subtasks.
 *
 * @param {number} indexHtml - The index of the task in the HTML structure.
 * @param {number} progressPercentage - The calculated percentage of completed subtasks.
 */
function updateProgressBar(index, progressPercentage, subtasks) {
  let progressBar = document.getElementById(`progressBar${index}`);
  if (!progressBar) {
    console.error(`Element nicht gefunden: progressBar${index}`);
    return;
  }
  progressBar.style.width = `${progressPercentage}%`;
  if (progressPercentage === 100) {
    progressBar.style.backgroundColor = "#095a1b";
  } else {
    progressBar.style.backgroundColor = "";
  }
}

function calculateProgress(index, subtasks, subtaskStatus) {
  let trueCount = 0;
  if (!Array.isArray(subtasks)) {
    console.warn(`Subtasks ist kein gültiges Array für Task ${index}`);
    return { trueCount: 0, totalCount: 0 };
  }

  let totalCount = subtasks.length;
  for (let i = 0; i < totalCount; i++) {
    if (subtaskStatus[i] === true) {
      trueCount++;
    }
  }
  return { trueCount, totalCount };
}


function openTaskToBoardRender(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus) {
  opentaskIndex = index;
  let position = document.getElementById("openTask");
  if (position.classList.contains("modal-overlay")) {
    return;
  } else {
    position.classList.add("modal-overlay");
    position.classList.remove("d-none", "hidden");
    position.style.cssText = "visibility: visible; transform: translateX(100vw); animation: moveIn 200ms ease-in forwards";
    position.innerHTML = openTaskToBoardHtml(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus);
    CategoryColorOpen(index, category);
    subtasksRenderOpen(index, subtasks);
    searchIndexUrlOpen(index, assignedTo);
    searchprioBoardOpen(index, prio);
    loadSubtaskStatus(index, subtaskStatus);
    console.log(subtaskStatus)
   
}}


function loadSubtaskStatus(indexHtml, subtaskStatus) {
  console.log(subtaskStatus)
  let subtaskStatusArrayDev = subtaskStatus.split(',').map(subtaskStatus => subtaskStatus.trim());
  subtaskStatusArray.push(subtaskStatusArrayDev);
  for (let index = 0; index < subtaskStatusArray.length; index++) {
    const element = subtaskStatusArray[index];
   console.log(element)
    if (element== null) {
      return;
    }
    for (let i = 0; i < element.length; i++) {
      const subStatus = element[i];
      console.log(subStatus)
      subtasksStatusArray.push(subStatus);
        let checkbox = document.getElementById(`subtask-${indexHtml}-${i}`);
        if (subStatus === 'true' && checkbox) {
          checkbox.checked = subStatus;
        }
    }
    subtaskStatusArray = [];
  }
}

async function subtaskStatus(indexHtml, index) {
  const checkbox = document.getElementById(`subtask-${indexHtml}-${index}`);
  const isChecked = checkbox.checked;
  await statusSubtaskSaveToFirebase(isChecked, indexHtml, index);
}

function searchprioBoardOpen(index, prio) {
  let position = document.getElementById(`prioPositionOpenTask${index}`);
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

function searchIndexUrlOpen(index, assignedTo) {
 console.log(assignedTo)
 if(assignedTo == 'undefined'){
  return
 }
  let assignedToArray = assignedTo.split(',').map(assignedTo => assignedTo.trim());
  assignedToUserArrayOpen.push(assignedToArray);
  let position = document.getElementById(`userImageBoardOpen${index}`);
  position.innerHTML = "";
  for (let i = 0; i < assignedToArray.length; i++) {
    const element = assignedToArray[i];
    const images = imageUrlBoard[element];
    const names = userNamesBoard[element]
    position.innerHTML +=  htmlBoardImageOpen(images,names, i);

  }
  assignedToArray = [];
  assignedToUserArrayOpen = [];
}

function htmlBoardImageOpen(images,names, i) {
  return `
    <div class="d-flex pa-7-16">
      <img class="user-image-task-open" src="${images}">
      <div class="d-flex item-center font-sf fs-19 fw-400">${names}</div>
    </div>`;
}

function subtasksRenderOpen(indexHtml, subtasks) {
 console.log(subtasks)
  if(subtasks == 'undefined'){
    return
  }
  let subtasksArray = subtasks.split(',').map(subtask => subtask.trim());
  subtasksOpenArray.push(subtasksArray);
  let position = document.getElementById(`subtasksBoardOpen${indexHtml}`);
  position.innerHTML = "";
  for (let i = 0; i < subtasksArray.length; i++) {
      const element = subtasksArray[i];
      position.innerHTML += subtasksRenderOpenHtml(indexHtml, i, element);
  }
  subtasksOpenArray = [];
}

function subtasksRenderOpenHtml(indexHtml, index, element) {
  return `
    <div class="d-flex item-center pa-7-16">
      <input onclick="subtaskStatus('${indexHtml}','${index}')" class="checkbox-open-Task pointer" type="checkbox" id="subtask-${indexHtml}-${index}">
      <label for="subtask-${indexHtml}-${index}">${element}</label>
    </div>`;
}

async function subtaskStatus(indexHtml, index) {
  const checkbox = document.getElementById(`subtask-${indexHtml}-${index}`);
  const isChecked = checkbox.checked;
  await statusSubtaskSaveToFirebase(isChecked, indexHtml, index);
}

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
  subtasksOpenArray = [];
}

function CategoryColorOpen(index, category) {
  let position = document.getElementById(`categoryColorOpen${index}`);
  if (category == "Technical Task") {
    position.style.backgroundColor = "#1fd7c1";
  } else {
    position.style.backgroundColor = "#0038ff";
  }
}


function oneClickClose(event) {
  let openPosition = document.getElementById("openTask");
  if (event.target.classList.contains("modal-overlay")) {
    openPosition.classList.remove("modal-overlay");
    openPosition.style.animation = "moveOut 200ms ease-out forwards";
    setTimeout(() => {
      openPosition.classList.add("hidden", "d-none");
      openPosition.style.cssText =
        "visibility: hidden; transform: translateX(100vw)";
    }, 100);
    progressBar(opentaskIndex);
   console.log(opentaskIndex)
    resetFormStateEdit();
  }
}
function openTaskToBoardHtml(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus) {
  return `
    <div class="board-task-container-open bradius24 bg-color-ww d-flex content-centr" id="parentContainer${index}">
        <div class="width445">  
          <div class="d-flex-between margin-bt8">
              <h1 id="categoryColorOpen${index}" class=" txt-center fs-16 mg-block-none bradius8 color-wh">${category}</h1>
              <img onclick="closeOpenTask(event, ${index})" id="closeOpenTask${index}" class="close-open-task-img" src="../public/img/Close.png">
          </div>
          <div class="margin-bt8">
                <h2 class="task-title mg-block-none fw-700 fs-61">${title}</h2>
          </div>
          <div class="margin-bt8">  
              <p class="description-open-task fs-20 fw-400 mg-block-none">${description}</p>
          </div> 
          <div class="d-flex item-center mg-btt25" id="dateTask${index}">
              <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Due date:</p>
              <p class="d-flex item-center fs-20 fw-400 mg-block-none margin-left-open-task">${dueDate}</p>
          </div>
          <div class="d-flex item-center mg-btt25" id="prioTask${index}">
              <p class="d-flex item-center fs-20 fw-700 color-dg mg-block-none">Priority:</p>
              <span class="d-flex item-center fs-16 fw-400 margin-left-open-task">${prio}</span>
              <div class="prio-board-image-container d-flex-center" id="prioPositionOpenTask${index}">
              </div>
          </div>
          <div class="mg-btt25">
              <p class="d-flex item-center fs-20 fw-700 color-dg mg-block-none">Assigned To:</p>
          </div>
          <div class="d-flex mg-btt25 assignedToScroll">
              <div class="user-image-bord-container-open" id="userImageBoardOpen${index}">
              </div>
          </div>
          <p class="d-flex item-center fs-20 fw-700 color-dg mg-block-inline">Subtasks:</p>    
              <div class="subtask-scrollbar" id="subtasksBoardOpen${index}"></div>
          <div class="d-flex-end">
            <div class="d-flex item-center">
              <div onclick="deleteTask(${index})" class="d-flex item-center pointer"><img class="open-task-delete-edit img" src="../public/img/deleteOpenTask.png"><p class="fs-16 mg-block-none">Delete</p></div>
              <div class="seperator-opentask"></div>
              <div onclick="EditTaskToBoardRender('${index}', '${category}', '${description}', '${dueDate}', '${prio}', '${title}', '${boardCategory}' , '${assignedTo}', '${subtasks}', '${subtaskStatus}')" class="d-flex item-center pointer"><img class="open-task-delete-edit img" src="../public/img/editOpenTask.png"><p class="fs-16 mg-block-none">Edit</p></div>
            </div>
          </div>
        </div>  
    </div>`;
};