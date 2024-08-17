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
      // let contacts =await onloadDataBoard("/contacts")
      let taskkeys = Object.keys(task);
      let fetchImage = await fetchImagesBoard("/");
      // await assignedToBoard(contacts,fetchImage);
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
    const { category, description, dueDate, prio, title } = task[taskkeys[index]][0];
    await positionOfHTMLBlock(index, category, title, description, dueDate, prio);
  }
}

async function generateHTMLObjectsForUserPrioSubtasks(taskkeys, task, fetchImage) {
  for (let index = 0; index < taskkeys.length; index++) {
    const { assignedTo: users, assignedToNames: userNames, prio, subtasks } = task[taskkeys[index]][0];
    taskData[index] = { users, userNames, prio, subtasks, fetchImage };
    await Promise.all([
      searchIndexUrl(index, users, fetchImage),
      searchprio(index, prio),
      subtasksRender(index, subtasks)
    ]);
    
  }
}
function limitTextTo50Chars(id) {
  const element = document.getElementById(id);
  const text = element.innerText;

  if (text.length > 50) {
      element.innerText = text.substring(0, 50) + '...';
  }
}

async function positionOfHTMLBlock(index, category, title, description, date, prio){
  let position = document.getElementById('todo');
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
promiseSecondInfoOpenTask(index)

}

async function promiseSecondInfoOpenTask(index){
  let taskInfo = taskData[index];
  if (taskInfo) {
      let { users, userNames, prio, subtasks, fetchImage } = taskInfo;
      console.log(prio)
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
  setTimeout(() => tileUserImage(index), 50);

}
function tileUserImage(index){
  const container = document.getElementById(`userImageBoard${index}`);
  const images = container.getElementsByClassName('image-div'); 
  const containerWidth = 80; 
  const imageWidth = 32;
  const totalImages = images.length; 
  const maxOverlap = (totalImages * imageWidth - containerWidth) / (totalImages - 1);
  for (let i = 0; i < totalImages; i++) {
      images[i].style.transform = `translateX(${i * maxOverlap}px)`;
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
    console.log(subtasks)
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

async function editOpenTask(index, category, title, description, date, prio){
  let position = document.getElementById('openTask');
  position.innerHTML = '';
  position.innerHTML = await window.editTaskHtml(index, category, title, description, date, prio);
  promiseSecondInfoOpenTask(index);
  dueDateEditTask(index, date);
}

function dueDateEditTask(index, date){
  let position = document.getElementById(`dueDate${index}`);
  position.value = date;
}

// async function assignedToBoard(contacts, imageUrls) {
//   try {
//       const extractNames = (contacts) => {
//           return Object.values(contacts).map(entry => ({ name: entry.name }));
//       };
//       const names = extractNames(contacts);
//       checkboxInitBoard(names,imageUrls)
//   } catch (error) {
//       console.error(error);
//   }
// }

// function checkboxInitBoard(names,imageUrls){
//   let position = document.getElementById('checkboxesBoard');
//       position.innerHTML = '';
//       let list = ''; // Initialisierung des Strings
//       for (let index = 0; index < names.length; index++) {
//           const element = names[index].name;
//           const imgSrc = imageUrls[index]; // Bild-URL holen
//           list += checkBoxRenderBoard(index, imgSrc,element )
             
//       }
//       position.innerHTML = list; // HTML-Inhalt setzen
// }

// function checkBoxRenderBoard(index, imgSrc,element ){
//   return  `<label class="checkBoxFlex" for="checkbox-${index}">
//                   <div>
//                       <img src="${imgSrc}" alt="" />
//                       ${element}
//                   </div>
//                   <input type="checkbox" id="checkbox-board${index}" value="${element}" onclick="assignedToUserBoard('${index}','${element}')" />
//               </label>`;
// }

// async function assignedToUserBoard(index, element) {
//   const image = imageUrlsGlobal[index];
//   const arrayIndex = assignedToUserArray.indexOf(index);
//   if (arrayIndex !== -1) {
//       assignedToUserArray.splice(arrayIndex, 1);
//       assignedToUserArrayNamesGlobal.splice(arrayIndex, 1);
//   } else {
//       assignedToUserArray.push(index);
//       assignedToUserArrayNamesGlobal.push(element);
//   }
// }

// function showCheckboxesBoard() {
//   let checkboxes = document.getElementById("checkboxes");
//   if (!expanded) {
//       checkboxes.style.display = "block";
//       expanded = true;
//   } else {
//       checkboxes.style.display = "none";
//       expanded = false;
//   }
// }