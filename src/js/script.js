let subtasksLengthArray = [];
const taskData = {};

async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let element of includeElements) {
    const file = element.getAttribute("w3-include-html");
    try {
      let sanitizedUrl = new URL(file, window.location.href);
      sanitizedUrl.username = '';
      sanitizedUrl.password = '';
      let resp = await fetch(sanitizedUrl);
      await whichChangeSite(resp, element, file);
    } catch (error) {
      console.error('Error fetching file:', file, error);
      element.innerHTML = 'Error loading page';
    }
  }
}

async function whichChangeSite(resp, element, file){
  if (resp.ok) {
    element.innerHTML = await resp.text();
    if (file.includes('addTask.html'))  {
      init();}
    if (file.includes('contacts.html')) {
      initContacts();}
    if (file.includes('board.html')) {
      loadingBoard();}
    if (file.includes('summary.html')) {
      initSmry();}
  } else {
    element.innerHTML = 'Page not found';
  }
}

async function changeSite(page) {
  document.querySelector('.main-content').setAttribute('w3-include-html', page);
  includeHTML();
}

document.addEventListener('DOMContentLoaded', () => {
  includeHTML();
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const mainContent = document.querySelector('.main-content');
    const currentPage = mainContent.getAttribute('w3-include-html');
    if (currentPage && currentPage.includes('summary.html')) {
      summaryGreeting();
    }
  }
});

function clearLocalStorage() {
  localStorage.removeItem('user');
}

function toggleElement(elementClass, className) {
  const element = document.querySelector(elementClass);
    if (element.classList.contains(className)) {
      element.classList.remove(className);
    } else {
      element.classList.add(className);
    }
  }

function hideDropdown() {
  const element = document.querySelector('.user-icon-dropdown');
  if(!element.classList.contains('d-none')) {
    element.classList.add('d-none')
  }
}

async function loadingBoard() {
  try {
      let task = await onloadDataBoard("/tasks");
      let taskkeys = Object.keys(task);
      let fetchImage = await fetchImagesBoard("/");
      await generateHTMLObjects(taskkeys, task);
      await generateHTMLObjectsForUserPrioSubtasks(taskkeys, task, fetchImage);
  } catch (error) {
      console.error('Error loading tasks:', error);
  }
}
async function onloadDataBoard(path="") {
  let response = await fetch(BASE_URL + path + '.json');
  let responseToJson = await response.json();
  return responseToJson;
}

async function fetchImagesBoard(path=""){
  let response = await fetch(BASE_URL + path + '.json');
    let responseToJson = await response.json();
    let contacts = responseToJson.contacts;
    let imageUrl = Object.values(contacts).map(contacts => contacts.img);
    return imageUrl;
}

async function generateHTMLObjects(taskkeys, task){
  for (let index = 0; index < taskkeys.length; index++) {
    const element = taskkeys[index];
    const taskArray = task[element];
    let category = taskArray[0].category;
    let description = taskArray[0].description;
    let date = taskArray[0].dueDate;
    let prio = taskArray[0].prio;
    let title = taskArray[0].title;
   await positionOfHTMLBlock(index, category, title, description, date, prio)
  }}

async function generateHTMLObjectsForUserPrioSubtasks(taskkeys, task, fetchImage){
  for (let index = 0; index < taskkeys.length; index++) {
    const element = taskkeys[index];
    const taskArray = task[element];
    let users = taskArray[0].assignedTo;
    let nameOfUsers = taskArray[0].assignedToNames
    let prio = taskArray[0].prio;
    let subtasks = taskArray[0].subtasks;
    taskData[index] = {
      users: users,
      userNames: nameOfUsers,
      prio: prio,
      subtasks: subtasks,
      fetchImage: fetchImage
  };
  await Promise.all([
    searchIndexUrl(index, users, fetchImage),
    searchprio(index, prio)
  ]);
}
}

async function positionOfHTMLBlock(index, category, title, description, date, prio){
  let position = document.getElementById('todo');
 position.innerHTML += await htmlboard(index, category, title, description, date, prio);     
}

async function searchprio(index, prio){
  let position = document.getElementById(`prioPosition${index}`);
  position.innerHTML = '';
  if(prio == 'Urgent'){
    position.innerHTML = `<img  src="../public/img/Prio alta.png" alt="">`;
  }else{
    if(prio == 'Medium'){
      position.innerHTML = `<img  src="../public/img/prioOrange.png" alt="">`;
    }else{
      if(prio == 'Low'){
        position.innerHTML = `<img src="../public/img/Prio baja.png" alt="">`;
      }
    }
  }
}

async function searchprioOpenTask(index, prio){
  let position = document.getElementById(`prioPositionOpenTask${index}`);
  position.innerHTML = '';
  if(prio == 'Urgent'){
    position.innerHTML = `<img  src="../public/img/Prio alta.png" alt="">`;
  }else{
    if(prio == 'Medium'){
      position.innerHTML = `<img  src="../public/img/prioOrange.png" alt="">`;
    }else{
      if(prio == 'Low'){
        position.innerHTML = `<img src="../public/img/Prio baja.png" alt="">`;
      }
    }
  }
}

async function openTaskToBoard(index, category, title, description, date, prio ) {
  let position = document.getElementById('openTask');
  if (position.classList.contains('modal-overlay')){
    return
  }else{
  position.classList.add('modal-overlay');
  position.classList.remove('d-none');
  position.innerHTML = `
  <div draggable="true" ondragstart="startDragging(${index})" class="board-task-container-open" id="parentContainer${index}">
        <div class="d-flex-between">
            <h1 class="txt-center">${category}</h1>
            <img onclick="closeOpenTask(event, ${index})" id="closeOpenTask${index}" class="close-open-task-img" src="../public/img/Close.png">
        </div>
        <div>
            <h2>${title}</h2> 
        </div>
        <div>  
            <p class="description-open-task">${description}</p>
        </div> 
        <div class="d-flex item-center mg-btt25" id="dateTask${index}">
            <p class="d-flex item-center fs-20 fw-400 mg-block-none color-dg">Due date:</p>
            <p class="d-flex item-center  fs-20 fw-400 mg-block-none margin-left-open-task">${date}</p>
        </div>
        <div class="d-flex item-center mg-btt25" id="prioTask${index}">
            <p class="d-flex item-center fs-20 fw-400 color-dg mg-block-none">Priority:</p>
            <span class="d-flex item-center  fs-20 fw-400 margin-left-open-task">${prio}</span>
            <div class="prio-board-image-container d-flex-center" id="prioPositionOpenTask${index}">
            </div>
        </div>
        <div class="mg-btt25">
        <p class="d-flex item-center fs-20 fw-400 color-dg mg-block-none">Assigned To:</p>
        </div>
        <div class="user-open-Container d-flex mg-btt25">
            <div class="user-image-bord-container-open" id="userImageBoardOpen${index}">
            </div>
        </div>
        <p class="d-flex item-center fs-20 fw-400 color-dg mg-block-inline">Subtasks:</p>    
            <div class="" id="subtasksBoardOpen${index}"></div>
        <div class="d-flex-end">
          <div>
          <button class="open-task-delete-edit "><img src="../public/img/deleteOpenTask.png"><span class="">Delete</span></button>
          <button class="open-task-delete-edit"><img src="../public/img/editOpenTask.png"><span>Edit</span></button>
          </div>
        </div>
  </div>`;  
}

let taskInfo = taskData[index];
    if (taskInfo) {
        let users = taskInfo.users;
        let userNames = taskInfo.userNames
        let prio = taskInfo.prio;
        let subtasks = taskInfo.subtasks;
        let fetchImage = taskInfo.fetchImage; // Abrufen von fetchImage
        await Promise.all([
          searchIndexUrlOpen(index, users, fetchImage, userNames),
          subtasksRenderOpen(index, subtasks),
          searchprio(index, prio),
          searchprioOpenTask(index, prio)
      ]);
}else {
  console.error("Keine Daten für den angegebenen Index gefunden.");
}
}

async function htmlboard(index, category, title, description, date, prio) {
    return `
    <div draggable="true" ondragstart="startDragging(${index})" onclick="openTaskToBoard(${index}, '${category}', '${title}', '${description}', '${date}', '${prio}')" class="board-task-container" id="parentContainer${index}">
        <div class="d-flex-between">
            <h1 class="txt-center">${category}</h1>
            <img onclick="closeOpenTask(${index})" id="closeOpenTask${index}" class="d-none" src="../public/img/Close.png">
        </div>
        <div>
            <h2>${title}</h2> 
        </div>
        <div>  
            <p>${description}</p>
        </div> 
        <div class="progress-container d-flex-between">
            <div class="progress-bar" style="width: 50%;"></div><div id="subtasksLength${index}"></div>
        </div>
        <div class="d-flex-between">
            <div class="user-image-bord-container" id="userImageBoard${index}">
            </div>
            <div class="prio-board-image-container d-flex-center" id="prioPosition${index}">
            </div>
        </div>  
    </div>`;  
}

function closeOpenTask(event, index) {
  event.stopPropagation(); 
  let openPosition = document.getElementById('openTask');
  openPosition.classList.remove('modal-overlay');
  openPosition.classList.add('d-none');
  openPosition.innerHTML = '';
}

async function searchIndexUrl(index, users, fetchImage){
  let position = document.getElementById(`userImageBoard${index}`);
  position.innerHTML = '';
  
  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    let imageUrl = fetchImage[element];
    position.innerHTML += await htmlBoardImage(imageUrl, index);
  }
}

async function userNamesRender(index){
  let position = document.getElementById(`userNames${index}`)
  for (let index = 0; index < userNames.length; index++) {
    const element = userNames[index];
    position.innerHTML += `<p class="d-flex item-center  fs-20 fw-400">${element}</p>`;
  }
}

async function searchIndexUrlOpen(index, users, fetchImage, userNames){
  let position = document.getElementById(`userImageBoardOpen${index}`);
  position.innerHTML = '';
  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    const names = userNames[index];
    let imageUrl = fetchImage[element];
    position.innerHTML += await htmlBoardImageOpen(imageUrl, index, names);
  }
}

async function htmlBoardImage(imageUrl){
  return `
  <div>
    <img class="user-image-board" src="${imageUrl}">
  </div>  `;
}

async function htmlBoardImageOpen(imageUrl, index, names){
  return `
  <div class="d-flex pa-7-16">
    <img class="user-image-task-open" src="${imageUrl}">
    <div class="d-flex item-center font-sf fs-19 fw-400" >${names}</div>
  </div>  `;
}

async function subtasksRender(indexHtml, subtasks) {
    let position = document.getElementById(`subtasksBoard${indexHtml}`);
    position.innerHTML = '';
    subtasksLengthArray.push({
        position: indexHtml,
        subs: subtasks
    });

    let positionOfSubtasksLength = document.getElementById(`subtasksLength${indexHtml}`);
    if (Array.isArray(subtasks)) {
        for (let index = 0; index < subtasks.length; index++) {
            const element = subtasks[index];
            position.innerHTML += `<p>${element}</p>`;
        }
        positionOfSubtasksLength.innerHTML = `<p class="subtasks-board-task-text">${subtasks.length} Subtasks</p>`;
    } else {
        positionOfSubtasksLength.innerHTML = `<p class="subtasks-board-task-text">0 Subtasks</p>`;
    }
}

async function subtasksRenderOpen(indexHtml, subtasks) {
  let position = document.getElementById(`subtasksBoardOpen${indexHtml}`);
  position.innerHTML = '';
  subtasksLengthArray.push({
      position: indexHtml,
      subs: subtasks
  });
  if (Array.isArray(subtasks)) {
    for (let index = 0; index < subtasks.length; index++) {
        const element = subtasks[index];
        position.innerHTML += `
            <div class="d-flex item-center pa-7-16">
                <input class="checkbox-open-Task" type="checkbox" id="subtask-${indexHtml}-${index}">
                <label class="" for="subtask-${indexHtml}-${index}">${element}</label>
            </div>`;
    }
}
}
