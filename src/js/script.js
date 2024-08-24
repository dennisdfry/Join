let subtasksLengthArray = [];
const taskData = {};
let taskkeys = [];
const taskkeysGlobal = [];
let task = {};
let currentDraggedElement;
let progressStatusTrue = [];

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
      task = await onloadDataBoard("/tasks");
      taskkeys = Object.keys(task);
      taskkeysGlobal.push(taskkeys);
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

async function generateHTMLObjects(taskkeys, task) {
  for (let index = 0; index < taskkeys.length; index++) {
    const { category, description, dueDate, prio, title, boardCategory } = task[taskkeys[index]][0];
    await positionOfHTMLBlock(index, category, title, description, dueDate, prio, boardCategory);
    
  }
}

// //

async function updateHTML() {
  const categories = ['todo', 'progress', 'feedback', 'done'];
  
  for (const category of categories) {
    const container = document.getElementById(category);
    container.innerHTML = '';
  }

  try {
    await loadingBoard();
  } catch (error) {
    console.error('Fehler beim Aktualisieren der HTML-Inhalte:', error);
  }
}


function startDragging(taskkey) {
  currentDraggedElement = taskkey;
  console.log('Dragging element with taskkey:', currentDraggedElement);
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
    task[currentDraggedElement]['boardCategory'] = category;

    await updateTaskInFirebase({
      id: currentDraggedElement,
      boardCategory: category
    });

    await updateHTML();
  } else {
    console.error('No task is being dragged.');
  }
}

async function updateTaskInFirebase(task) {
  try {
    await fetch(`${BASE_URL}/tasks/${task.id}/0.json`, {
      method: 'PATCH',
      body: JSON.stringify({ boardCategory: task.boardCategory }),
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating task in Firebase:', error);
  }
}

// //

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
      subtasksRender(index, subtasks),
    ]);
    await progressBar(index);
  }
}

function limitTextTo50Chars(id) {
  const element = document.getElementById(id);
  const text = element.innerText;
  if (text.length > 50) {
      element.innerText = text.substring(0, 50) + '...';
  }
}

async function positionOfHTMLBlock(index, category, title, description, date, prio, boardCategory){
  let position = document.getElementById(`${boardCategory}`);
 position.innerHTML += await window.htmlboard(index, category, title, description, date, prio);  
 limitTextTo50Chars(`limitTextDesciption${index}`)
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

async function openTaskToBoardRender(index, category, title, description, date, prio ) {
  let position = document.getElementById('openTask');
  if (position.classList.contains('modal-overlay')){
    return
  }else{
  position.classList.add('modal-overlay');
  position.classList.remove('d-none');
  position.innerHTML = window.openTaskToBoardHtml(index, category, title, description, date, prio);
  
}
promiseSecondInfoOpenTask(index);
}

async function promiseSecondInfoOpenTask(index){
  let taskInfo = taskData[index];
  if (taskInfo) {
      let { users, userNames, prio, subtasks, fetchImage } = taskInfo;
      await subtasksRenderOpen(index, subtasks);
      await Promise.all([
        searchIndexUrlOpen(index, users, fetchImage, userNames),
        searchprio(index, prio),
        searchprioOpenTask(index, prio),
    ]);
    await loadSubtaskStatus(index);
    
}else {
console.error("Keine Daten für den angegebenen Index gefunden.");
}}

async function loadSubtaskStatus(indexHtml) {
  for (let index = 0; index < taskkeysGlobal.length; index++) {
    const element = taskkeysGlobal[index];
    const taskKeyId = element[indexHtml];
    let data = await onloadDataBoard(`/tasks/${taskKeyId}/0/subtaskStatus/`);
    if(data == null){
      return
    }
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      try {
         let checkbox = document.getElementById(`subtask-${indexHtml}-${i}`);
      if (element == true) {
        if (checkbox) {
          checkbox.checked = element;
        } else {
          console.error(`Checkbox mit ID subtask-${indexHtml}-${index} nicht gefunden.`);
        }
        checkbox.checked = data;
      }
     
    } catch (error) {
      console.error(`Fehler beim Laden des Status der Subtask-Checkbox ${index}: `, error);
    }
  }
}
}

function closeOpenTask(event, index) {
  event.stopPropagation();
  let openPosition = document.getElementById('openTask');
  openPosition.classList.remove('modal-overlay');
  openPosition.classList.add('d-none');
  openPosition.innerHTML = '';
  // loadingBoard();
}

async function searchIndexUrl(index, users, fetchImage){
  let position = document.getElementById(`userImageBoard${index}`);
  position.innerHTML = '';
  if(users == null){
    return
  }
  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    let imageUrl = fetchImage[element];
    position.innerHTML += await htmlBoardImage(imageUrl, index);
  }
  setTimeout(() => tileUserImage(index), 50);
}

function tileUserImage(index) {
  const container = document.getElementById(`userImageBoard${index}`);
  const images = container.getElementsByClassName('image-div'); 
  const containerWidth = 80; 
  const imageWidth = 32; 
  const imagelength = images.length;
  const totalImagesWidth = imageWidth * imagelength;
  const overlap = (totalImagesWidth > containerWidth) ? (totalImagesWidth - containerWidth) / (imagelength - 1) : 0;
  for (let i = 0; i < images.length; i++) {
    const imagePosition = images[i];
    imagePosition.style.position = 'absolute';
    imagePosition.style.left = `${i * (imageWidth - overlap)}px`;
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
  if (!users || users.length === 0) {
    return;
  }
  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    const names = userNames[index];
    let imageUrl = fetchImage[element];
    position.innerHTML += await htmlBoardImageOpen(imageUrl, index, names);
  }
}

async function htmlBoardImage(imageUrl, index){
  return `
  <div class="image-div">
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
    subtasksLengthArray.push({
        position: indexHtml,
        subs: subtasks
    });
    let positionOfSubtasksLength = document.getElementById(`subtasksLength${indexHtml}`);
    if (Array.isArray(subtasks)) {
        for (let index = 0; index < subtasks.length; index++) {
            const element = subtasks[index];
        }
        positionOfSubtasksLength.innerHTML = `<p class="subtasks-board-task-text">${subtasks.length} Subtasks</p>`;
    } else {
        positionOfSubtasksLength.innerHTML = `<p class="subtasks-board-task-text">0 Subtasks</p>`;
    }}

async function subtasksRenderOpen(indexHtml, subtasks) {
  let position = document.getElementById(`subtasksBoardOpen${indexHtml}`);
  position.innerHTML = '';
  subtasksLengthArray.push({
      position: indexHtml,
      subs: subtasks});
  if (Array.isArray(subtasks)) {
    for (let index = 0; index < subtasks.length; index++) {
        const element = subtasks[index];
        position.innerHTML += `
            <div class="d-flex item-center pa-7-16">
                <input onclick="subtaskStatus('${indexHtml}','${index}')" class="checkbox-open-Task" type="checkbox" id="subtask-${indexHtml}-${index}">
                <label class="" for="subtask-${indexHtml}-${index}">${element}</label>
            </div>`;
    }}}

async function subtaskStatus(indexHtml, index){
  const checkbox = document.getElementById(`subtask-${indexHtml}-${index}`);
  const isChecked = checkbox.checked;
  await statusSubtaskSaveToFirebase(isChecked, indexHtml, index );
}

async function statusSubtaskSaveToFirebase(isChecked, indexHtml, index) {
  for (const taskKeyId of taskkeysGlobal.map(el => el[indexHtml])) {
    const path = `/tasks/${taskKeyId}/0/subtaskStatus/${index}`;
    try {
      const response = await fetch(`${BASE_URL}${path}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isChecked),
      });
      if (!response.ok) {
        console.error(`Fehler beim Aktualisieren des Status der Subtask-Checkbox ${index}:`, response.statusText);
      }
    } catch (error) {
      console.error(`Fehler beim Speichern des Status der Subtask-Checkbox ${index}:`, error);
    }
  }
}



async function progressBar(indexHtml) {
  let progressBar = document.getElementById(`progressBar${indexHtml}`);
  let trueCount = 0; 
  let totalCount = 0; 
  for (let index = 0; index < taskkeysGlobal.length; index++) {
    const element = taskkeysGlobal[index];
    const taskKeyId = element[indexHtml];
    let data = await onloadDataBoard(`/tasks/${taskKeyId}/0/subtaskStatus/`);
    if (!data || data.length === 0) {
      continue; 
    }
    totalCount += data.length;
    for (let i = 0; i < data.length; i++) {
      const statusID = data[i];
      if (statusID === true) {
        trueCount++; 
        progressStatusTrue.push({ index: i, statusTrue: statusID }); 
      }
    }
  }
  if (totalCount > 0) {
    let progress = (trueCount / totalCount) * 100;
    progressBar.style.width = `${progress}%`; 
  }
}