let taskArrayBoard = [];
let titleBoard = [];
let descriptionBoard =[];
let imageUrlBoard = [];
let userNamesBoard = [];
let ToDoBoard = [];

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
      date:dueDate,
      category:category,
      prio:prio,
      boardCategory:boardCategory,
      assignedTo: assignedTo,
      subtasks: subtasks,
      subtaskStatus: subtaskStatus
    })
  }
  upstreamHTMLrender()}

  function upstreamHTMLrender(){
    console.log(taskArrayBoard);
    for (let index = 0; index < taskArrayBoard.length; index++) {
      const element = taskArrayBoard[index];
      const { category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus} = element;
      positionOfHTMLBlockBoard(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus)
      searchIndexUrlBoard(index, assignedTo);
      searchprioBoard(index, prio);
      subtasksRenderBoard(index, subtasks);
      
    }}

  function positionOfHTMLBlockBoard(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus){
    let position = document.getElementById(`${boardCategory}`);
    position.innerHTML += `
    <div id="parentContainer${index}" draggable="true" ondragstart="startDragging('${taskkeys[index]}')" onclick="openTaskToBoardRender(${index}, '${category}', '${title}', '${description}', '${dueDate}', '${prio}')" class="board-task-container pointer bradius24 d-flex flex-d-col content-even mg-btt25"> 
        <div class="d-flex-between">
            <h1 id="categoryColor${index}" class="txt-center fs-16 mg-block-none bradius8 color-wh">${category}</h1>
            <img src="/public/img/dots.png" id="dots-parent-container" class="d-none">
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
                <div id="subtasksLength${index}" class="subtasksLength fs-12 fw-400 color-bl"></div>
            </div>
        </div>
        <div class="d-flex-between width220">
            <div class="user-image-bord-container" id="userImageBoard${index}">
            </div>
            <div class="img-32 d-flex-center" id="prioPosition${index}">
            </div>
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

async function subtasksRenderBoard(indexHtml, subtasks) {
  subtasksLengthArray.push({
    position: indexHtml,
    subs: subtasks,
  });
  let positionOfSubtasksLength = document.getElementById(`subtasksLength${indexHtml}`);
  if (Array.isArray(subtasks)) {
    positionOfSubtasksLength.innerHTML = `<p class="subtasks-board-task-text">${subtasks.length} Subtasks</p>`;
  } else {
    positionOfSubtasksLength.innerHTML = `<p class="subtasks-board-task-text">0 Subtasks</p>`;
  }
}
