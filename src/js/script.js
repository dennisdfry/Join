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

async function generateHTMLObjectsForUserPrioSubtasks(taskkeys, task, fetchImage){
  for (let index = 0; index < taskkeys.length; index++) {
    const element = taskkeys[index];
    const taskArray = task[element];
    let users = taskArray[0].assignedTo;
    let prio = taskArray[0].prio;
    let subtasks = taskArray[0].subtasks;
    taskData[index] = {
      users: users,
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



async function openTaskToBoard(index, category, title, description, date, prio ) {
  console.log(index)
  console.log(category)
  console.log(title)
  console.log(description)
  console.log(date)
  
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
            <img onclick="closeOpenTask(event, ${index})" id="closeOpenTask${index}" class="" src="../public/img/Close.png">
        </div>
        <div>
            <h2>${title}</h2> 
        </div>
        <div>  
            <p>${description}</p>
        </div> 
        <div class="" id="dateTask${index}">
            <time>${date}</time>
        </div>
        <div class="" id="prioTask${index}">
            <p></p><span>${prio}</span>
        </div>
        <div class="d-flex-between">
            <div class="user-image-bord-container" id="userImageBoardOpen${index}">
            </div>
            <div class="" id="subtasksBoardOpen${index}">
            </div>
            <div class="prio-board-image-container d-flex-center" id="prioPosition${index}">
            </div>
        </div>  
        <div class="">
          <div>
          <button><img src="../public/img/deleteOpenTask.png"><span>Delete</span></button>
          <button><img src="../public/img/editOpenTask.png"><span>Edit</span></button>
          </div>
        </div>
    </div>`;  

 
}
let taskInfo = taskData[index];

    if (taskInfo) {
        let users = taskInfo.users;
        let prio = taskInfo.prio;
        let subtasks = taskInfo.subtasks;
        let fetchImage = taskInfo.fetchImage; // Abrufen von fetchImage
        await Promise.all([
          searchIndexUrlOpen(index, users, fetchImage),
          subtasksRenderOpen(index, subtasks),
          searchprio(index, prio)
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
    position.innerHTML += await htmlBoardImage(imageUrl);
  }
}
async function searchIndexUrlOpen(index, users, fetchImage){
  let position = document.getElementById(`userImageBoardOpen${index}`);
  position.innerHTML = '';
  
  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    let imageUrl = fetchImage[element];
    position.innerHTML += await htmlBoardImage(imageUrl);
  }
}
async function htmlBoardImage(imageUrl){
  return `<img class="user-image-board" src="${imageUrl}">`;
}

async function fetchImagesBoard(path=""){
  let response = await fetch(BASE_URL + path + '.json');
    let responseToJson = await response.json();
    let contacts = responseToJson.contacts;
    let imageUrl = Object.values(contacts).map(contacts => contacts.img);
    return imageUrl;
}

async function onloadDataBoard(path="") {
    let response = await fetch(BASE_URL + path + '.json');
    let responseToJson = await response.json();
    return responseToJson;
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
          position.innerHTML += `<p>${element}</p>`;
      }
     
}
}
