let BASE_URL = "https://join-19628-default-rtdb.firebaseio.com";
let subtasksArray = [];
let prioArray = [];
let addTaskArray = [];
let expanded = false;
let isValid = true;
let assignedToUserArray = [];
let assignedToUserArrayNamesGlobal = [];
let imageUrlsGlobal = []; 

async function init() {
    try {
        let fireBaseData = await onloadData("/");
        let contacts = await fetchContacts(fireBaseData);
        let imageUrls = await fetchImages();
        await assignedTo(contacts, imageUrls);
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

async function assignedTo(contacts, imageUrls) {
    try {
        const extractNames = (contacts) => {
            return Object.values(contacts).map(entry => ({ name: entry.name }));
        };
        const names = extractNames(contacts);
        checkboxInit(names,imageUrls)
    } catch (error) {
        console.error(error);
    }
}

function checkboxInit(names,imageUrls){
    let position = document.getElementById('checkboxes');
        position.innerHTML = '';
        let list = ''; // Initialisierung des Strings
        for (let index = 0; index < names.length; index++) {
            const element = names[index].name;
            const imgSrc = imageUrls[index]; // Bild-URL holen
            list += checkBoxRender(index, imgSrc,element )
               
        }
        position.innerHTML = list; // HTML-Inhalt setzen
}

function checkBoxRender(index, imgSrc,element ){
    return  `<label class="checkBoxFlex" for="checkbox-${index}">
                    <div class=checkBoxImg>
                        <img src="${imgSrc}" alt="" />
                        ${element}
                    </div>
                    <input type="checkbox" id="checkbox-${index}" value="${element}" onclick="assignedToUser('${index}','${element}')" />
                </label>`;
}

async function assignedToUser(index, element) {
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

function showCheckboxes() {
    let checkboxes = document.getElementById("checkboxes");
    if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
    } else {
        checkboxes.style.display = "none";
        expanded = false;
    }
}

async function createTask(event) {
    event.preventDefault();
    let form = event.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }
    defineTaskObjects()
    saveToFirebase();
    form.reset();
    addTaskArray = [];
    clearSubtasks();
    await changeSite('board.html');
}

function defineTaskObjects(){
    let taskTitle = document.getElementById('title').value;
    let taskDescription = document.getElementById('description').value;
    let dueDateTask = document.getElementById('dueDate').value;
    let taskCategory = document.getElementById('taskCategory').value;
    let lastString = prioArray.pop();
    pushTaskObjectsToArray(taskTitle, taskDescription, dueDateTask, taskCategory, lastString)
}

function pushTaskObjectsToArray(taskTitle, taskDescription, dueDateTask, taskCategory, lastString){
    addTaskArray.push({
        title: taskTitle,
        description: taskDescription,
        assignedTo: assignedToUserArray,
        assignedToNames: assignedToUserArrayNamesGlobal,
        dueDate: dueDateTask,
        prio: lastString,
        category: taskCategory,
        subtasks: subtasksArray,
        boardCategory: 'todo'
    });
}

async function saveToFirebase(path="/tasks"){
        let response = await fetch(BASE_URL + path + ".json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addTaskArray),
        });
}

function prio(id) {
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

function showSubtaskControls() {
    document.getElementById('subtasks').classList.remove('add-task-input');
    document.getElementById('subtasks').classList.add('subtasks-input');
   let position = document.getElementById('subtasksControl');
   position.innerHTML = `<button onclick="resetSubtaskInput()" type="button" class="subtask-button">
                                <img src="../public/img/closeAddTask.png" alt="Reset">
                            </button>
                            <div class="seperator-subtasks"></div>
                            <button onclick="addSubtask()" type="button" class="subtask-button">
                                <img src="../public/img/checkAddTask.png" alt="Add">
                            </button>`;
}

function addSubtask() {
    let input = document.getElementById('subtasks');
    if (input.value.trim() !== "") {
        subtasksArray.push(input.value.trim());
        input.value = '';
        updateSubtasksList();
        resetSubtaskInput();
    }
}

function resetSubtaskInput() {
    let input = document.getElementById('subtasks');
    input.value = '';
    document.getElementById('subtasks').classList.add('add-task-input');
    document.getElementById('subtasks').classList.remove('subtasks-input');
    let position = document.getElementById('subtasksControl');
    position.innerHTML =` <button onclick="showSubtaskControls()" type="button" id="subtasksPlus" class="add-task-button">
                                +
                            </button>`;
}

function updateSubtasksList() {
    let subtasksPosition = document.getElementById('subtasksPosition');
    subtasksPosition.innerHTML = '';
    for (let index = 0; index < subtasksArray.length; index++) {
        const element = subtasksArray[index];
        subtasksPosition.innerHTML += `
            <ul>
                <li>${element}</li>
            </ul>`;
    }
}

function clearSubtasks(){
    let position = document.getElementById('subtasksPosition');
    position.innerHTML = '';
}