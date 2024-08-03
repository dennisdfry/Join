let BASE_URL = "https://join-19628-default-rtdb.firebaseio.com";
let subtasksArray = [];
let prioArray = [];
let addTaskArray = [];
let expanded = false;
let isValid = true;
let assignedToUserArray = []; // Globale Variable zur Speicherung der ausgewählten Indizes
let imageUrlsGlobal = []; // Globale Variable zur Speicherung der Bild-URLs

async function init() {
    try {
        let fireBaseData = await onloadData("/");
        let contacts = await fetchContacts(fireBaseData);
        let imageUrls = await fetchImages(); // Hier holen wir die Bilder
        await assignedTo(contacts, imageUrls); // Übergeben Sie die Bild-URLs
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
        let position = document.getElementById('checkboxes');
        position.innerHTML = '';
        let list = ''; // Initialisierung des Strings
        for (let index = 0; index < names.length; index++) {
            const element = names[index].name;
            const imgSrc = imageUrls[index]; // Bild-URL holen
            list += `
                <label class="checkBoxFlex" for="checkbox-${index}">
                    <div>
                        <img src="${imgSrc}" alt="" />
                        ${element}
                    </div>
                    <input type="checkbox" id="checkbox-${index}" value="${element}" onclick="assignedToUser(${index})" />
                </label>`;
        }
        position.innerHTML = list; // HTML-Inhalt setzen
    } catch (error) {
        console.error(error);
    }
}

async function assignedToUser(index, imageUrl) {
    const image = imageUrlsGlobal[index]; // Bild-URL holen
    const arrayIndex = assignedToUserArray.indexOf(index);
    if (arrayIndex !== -1) {
        assignedToUserArray.splice(arrayIndex, 1);
    } else {
        assignedToUserArray.push(index);
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

function createTask(event) {
    event.preventDefault();
    let form = event.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }
    let taskTitle = document.getElementById('title').value;
    let taskDescription = document.getElementById('description').value;
    let dueDateTask = document.getElementById('dueDate').value;
    let taskCategory = document.getElementById('taskCategory').value;
    let lastString = prioArray.pop();
    
    addTaskArray.push({
        title: taskTitle,
        description: taskDescription,
        assignedTo: assignedToUserArray,
        dueDate: dueDateTask,
        prio: lastString,
        category: taskCategory,
        subtasks: subtasksArray
    });
    saveToFirebase();
    form.reset();
    addTaskArray = [];
}

async function saveToFirebase(path="/tasks"){
    console.log(addTaskArray)
   
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

function cancelTask() {
    // Implementieren Sie hier die Logik zum Abbrechen oder Zurücksetzen eines Tasks
}
