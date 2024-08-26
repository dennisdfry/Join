let addTaskArrayEdit = [];
let expandedEdit = false;

function editTitle(index){
    let position = document.getElementById(`inputEditTitle${index}`);
    position.placeholder = '';
}

function editDescription(index){
    let position = document.getElementById(`descriptionEdit${index}`);
    position.placeholder = '';
}

async function editOpenTask(index, category, title, description, date, prio){
    let position = document.getElementById('openTask');
    position.innerHTML = '';
    position.innerHTML = await window.editTaskHtml(index, category, title, description, date, prio);
    dueDateEditTask(index, date);
    initEdit(index);
    checkboxIndexFalse(index);
    promiseSecondInfoOpenTask(index);
    subtasksRenderEdit(index);
  }
  
  function dueDateEditTask(index, date){
    let position = document.getElementById(`dueDate${index}`);
    position.value = date;
  }

  async function initEdit(index) {
    try {
        let fireBaseData = await onloadData("/");
        let contacts = await fetchContacts(fireBaseData);
        let imageUrls = await fetchImages();
        await assignedToEdit(contacts, imageUrls, index);
    } catch (error) {
        console.error("Fehler bei der Initialisierung:", error);
    }
}

async function fetchImages() {
    try {
        let fireBaseData = await onloadData("/");
        let contacts = fireBaseData.contacts;
        let imageUrls = Object.values(contacts).map(contact => contact.img);
        return imageUrls;
    } catch (error) {
        console.error("Fehler beim Abrufen der Bilder", error);
    }
}

async function onloadData(path = "") {
    let response = await fetch(BASE_URL + path + '.json');
    let responseToJson = await response.json();
    return responseToJson;
}

async function fetchContacts(responseToJson) {
    let contacts = responseToJson.contacts;
    return contacts;
}

async function assignedToEdit(contacts, imageUrls, index) {
    try {
        const extractNames = (contacts) => {
            return Object.values(contacts).map(entry => ({ name: entry.name }));
        };
        const names = extractNames(contacts);
        checkboxInitEdit(names,imageUrls, index)
    } catch (error) {
        console.error(error);
    }
}

function checkboxInitEdit(names,imageUrls, indexHTML){
    let position = document.getElementById(`checkboxesEdit${indexHTML}`);
        position.innerHTML = '';
        let list = ''; // Initialisierung des Strings
        for (let index = 0; index < names.length; index++) {
            const element = names[index].name;
            const imgSrc = imageUrls[index]; // Bild-URL holen
            list += checkBoxRenderEdit(index, imgSrc,element )
               
        }
        position.innerHTML = list; // HTML-Inhalt setzen
}

function checkBoxRenderEdit(index, imgSrc,element ){
    return  `<label class="checkBoxFlex" for="checkbox-${index}">
                    <div class="checkBoxImg">
                        <img src="${imgSrc}" alt="" />
                        ${element}
                    </div>
                    <input type="checkbox" id="checkbox-${index}" value="${element}" onclick="assignedToUser('${index}','${element}')" />
                </label>`;
}

async function assignedToUserEdit(index, element) {
    const image = imageUrlsGlobal[index];
    const arrayIndex = assignedToUserArray.indexOf(index);
    if (arrayIndex !== -1) {
        assignedToUserArray.splice(arrayIndex, 1);
        assignedToUserArrayNamesGlobal.splice(arrayIndex, 1);
    } else {
        assignedToUserArray.push(index);
        assignedToUserArrayNamesGlobal.push(element);
    }
}
function checkboxIndexFalse(index){
    let checkboxes = document.getElementById(`checkboxesEdit${index}`);
    checkboxes.style.display = "none";
        expandedEdit = false;
}
function showCheckboxesEdit(index) {
    
    let checkboxes = document.getElementById(`checkboxesEdit${index}`);
    if (!expandedEdit) {
        checkboxes.style.display = "block";
        expandedEdit = true;
    } else {
        checkboxes.style.display = "none";
        expandedEdit = false;
    }
}
function defineTaskObjectsEdit(index){
    let taskTitle = document.getElementById(`inputEditTitle${index}`).value;
    let taskDescription = document.getElementById(`descriptionEdit${index}`).value;
    let dueDateTask = document.getElementById(`dueDate${index}`).value;
    let lastString = prioArray.pop();
    let taskCategory = 'todo';
    pushTaskObjectsToArrayEdit(taskTitle, taskDescription, dueDateTask, taskCategory, lastString)
}

function pushTaskObjectsToArrayEdit(taskTitle, taskDescription, dueDateTask, taskCategory, lastString){
    addTaskArrayEdit.push({
        title: taskTitle,
        description: taskDescription,
        assignedTo: assignedToUserArray,
        assignedToNames: assignedToUserArrayNamesGlobal,
        dueDate: dueDateTask,
        prio: lastString,
        category: taskCategory,
        subtasks: subtasksArray,
        subtaskStatus: subtasksStatusArray,
        boardCategory: 'todo'
    });
    console.log(addTaskArrayEdit);
}
function prioEdit(id) {
    const buttons = document.querySelectorAll('.add-task-prio-button-container button');
    
    buttons.forEach(button => {
        button.classList.remove('add-task-prio-button-urgent', 'add-task-prio-button-medium', 'add-task-prio-button-low');
        button.classList.add('add-task-prio-button');
    });
    let position = document.getElementById(`prioButton${id}`);
    prioIdCheck(id, position);  
}

function prioIdCheck(id, position){
    if (id == 1) {
        prioArray.push('Urgent');
        position.classList.add('add-task-prio-button-urgent');
    } else if (id == 2) {
        prioArray.push('Medium');
        position.classList.add('add-task-prio-button-medium');
    } else if (id == 3) {
        prioArray.push('Low');
        position.classList.add('add-task-prio-button-low');
    }
    position.classList.remove('add-task-prio-button');
}
function showSubtaskControlsEdit(index) {
    document.getElementById(`subtasks${index}`).classList.remove('add-task-input-edit');
    document.getElementById(`subtasks${index}`).classList.add('subtasks-input-edit');
   let position = document.getElementById(`subtasksControl${index}`);
   position.innerHTML = `<button onclick="resetSubtaskInputEdit(${index})" type="button" class="subtask-button-edit">
                                <img src="../public/img/closeAddTask.png" alt="Reset">
                            </button>
                            <div class="seperator-subtasks"></div>
                            <button onclick="addSubtaskEdit(${index})" type="button" class="subtask-button-edit">
                                <img src="../public/img/checkAddTask.png" alt="Add">
                            </button>`;
}

function addSubtaskEdit(index) {
    let input = document.getElementById(`subtasks${index}`);
    if (input.value.trim() !== "") {
        subtasksArray.push(input.value.trim());
        input.value = '';
        subtasksStatusArray.push(false)
        updateSubtasksListEdit(index);
        resetSubtaskInputEdit(index);
    }
}

function resetSubtaskInputEdit(index) {
    let input = document.getElementById(`subtasks${index}`);
    input.value = '';
    document.getElementById(`subtasks${index}`).classList.add('add-task-input-edit');
    document.getElementById(`subtasks${index}`).classList.remove('subtasks-input-edit');
    let position = document.getElementById(`subtasksControl${index}`);
    position.innerHTML =` <button onclick="showSubtaskControlsEdit(${index})" type="button"  class="add-task-button-edit">
                                +
                            </button>`;
}

function updateSubtasksListEdit(index) {
    let subtasksPosition = document.getElementById(`subtasksPosition${index}`);
    subtasksPosition.innerHTML = '';
    for (let index = 0; index < subtasksArray.length; index++) {
        const element = subtasksArray[index];
        subtasksPosition.innerHTML += `
            <ul>
                <li><span>${element}</span><div><img src="../public/img/delete.png"><img src="../public/img/edit.png"></div></li>
            </ul>`;
    }
}

function subtasksRenderEdit(indexHTML){
    let arrayPosition = subtasksLengthArray[indexHTML];
    let subs = arrayPosition.subs;
    let position = document.getElementById(`subtasksBoardEdit${indexHTML}`)
    for (let index = 0; index < subs.length; index++) {
        const element = subs[index];
        console.log(element);

        position.innerHTML += `
            <ul>
                <li><span>${element}</span><div><img src="../public/img/delete.png"><img src="../public/img/edit.png"></div></li>
            </ul>`
    }
    
}