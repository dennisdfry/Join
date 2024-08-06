let subtasksLengthArray = [];

async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let element of includeElements) {
    const file = element.getAttribute("w3-include-html");
    try {
      let sanitizedUrl = new URL(file, window.location.href);
      sanitizedUrl.username = '';
      sanitizedUrl.password = '';
      let resp = await fetch(sanitizedUrl);
      if (resp.ok) {
        element.innerHTML = await resp.text();
        if (file.includes('addTask.html'))  {
          init();
        }
        if (file.includes('contacts.html')) {
          initContacts();
        }
        if (file.includes('board.html')) {
          loadingBoard();
        }
        if (file.includes('summary.html')) {
          initSmry();
        }
      } else {
        element.innerHTML = 'Page not found';
      }
    } catch (error) {
      console.error('Error fetching file:', file, error);
      element.innerHTML = 'Error loading page';
    }
  }
}

function changeSite(page) {
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
      for (let index = 0; index < taskkeys.length; index++) {
          const element = taskkeys[index];
          const taskArray = task[element];
          let category = taskArray[0].category;
          let description = taskArray[0].description;
          let date = taskArray[0].dueDate;
          let prio = taskArray[0].prio;
          let title = taskArray[0].title;
          let users = taskArray[0].assignedTo;
          let subtasks = taskArray[0].subtasks;
          let position = document.getElementById('todo');

          position.innerHTML += await htmlboard(index, category, title, description, subtasks, users, date, prio);
      }

      for (let index = 0; index < taskkeys.length; index++) {
          const element = taskkeys[index];
          const taskArray = task[element];
          let users = taskArray[0].assignedTo;
          let prio = taskArray[0].prio;
          let subtasks = taskArray[0].subtasks;

          await Promise.all([
              searchIndexUrl(index, users, fetchImage),
              subtasksRender(index, subtasks),
              searchprio(index, prio)
          ]);
      }

  } catch (error) {
      console.error('Error loading tasks:', error);
  }
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

function openTaskToBoard(index) {
  let position = document.getElementById(`parentContainer${index}`); 
  let positionOfDate = document.getElementById(`dateTask${index}`);
  let positionOfPrio = document.getElementById(`prioTask${index}`);
  positionOfDate.classList.remove('d-none');
  positionOfPrio.classList.remove('d-none');
  position.classList.remove('board-task-container');
  let parentDiv = document.createElement('div');
  parentDiv.id = `parent-container`;
  parentDiv.className = 'modal';
  position.parentNode.insertBefore(parentDiv, position);
  parentDiv.appendChild(position);
  let overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  document.body.appendChild(overlay);
}



async function htmlboard(index, category, title, description, subtasks, users, date, prio) {
    return `
    <div draggable="true" ondragstart="startDragging(${index})" onclick="openTaskToBoard(${index})" class="board-task-container" id="parentContainer${index}">
        <div class="d-flex-start">
            <h1 class="txt-center">${category}</h1>
        </div>
        <div>
            <h2>${title}</h2> 
        </div>
        <div>  
            <p>${description}</p>
        </div> 
        <div class="d-none" id="dateTask${index}">
            <time>${date}</time>
        </div>
        <div class="d-none" id="prioTask${index}">
            <p></p><span>${prio}</span>
        </div>
        <div class="progress-container d-flex-between">
            <div class="progress-bar" style="width: 50%;"></div><div id="subtasksLength${index}"></div>
        </div>
        <div class="d-flex-between">
            <div class="user-image-bord-container" id="userImageBoard${index}">
            </div>
            <div class="d-none" id="subtasksBoard${index}">
            </div>
            <div class="prio-board-image-container d-flex-center" id="prioPosition${index}">
            </div>
        </div>  
    </div>`;  
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
  // prüft, ob die Variable subtasks tatsächlich ein Array ist
    if (Array.isArray(subtasks)) {
        for (let index = 0; index < subtasks.length; index++) {
            const element = subtasks[index];
            position.innerHTML += `<p>${element}</p>`;
        }

        positionOfSubtasksLength.innerHTML = `<p class="subtasks-board-task-text">${subtasks.length} Subtasks</p>`;
    } else {
        // console.error(`subtasks for index ${indexHtml} is not an array:`, subtasks);
        positionOfSubtasksLength.innerHTML = `<p class="subtasks-board-task-text">0 Subtasks</p>`;
    }
}
