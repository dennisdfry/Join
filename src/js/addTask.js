let BASE_URL = "https://join-19628-default-rtdb.firebaseio.com";
let subtasksArray = [];
let prioArray = [];
let addTaskArray = [];
let expanded = false;

async function init() {
    try {
        let fireBaseData = await onloadData("/");
        let contacts = await fetchContacts(fireBaseData);
        let imageUrls = await fetchImages(); // Hier holen wir die Bilder
        console.log(contacts);
        await assignedTo(contacts, imageUrls); // Übergeben Sie die Bild-URLs
        showCheckboxes();
    } catch (error) {
        console.error("Fehler bei der Initialisierung:", error);
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

async function fetchImages() {
    try {
        let fireBaseData = await onloadData("/");
        let contacts = fireBaseData.contacts;
        let imageUrls = Object.values(contacts).map(contact => contact.img);
        return imageUrls;
    } catch (error) {
        console.error("Fehler beim Abrufen der Bilder:", error);
    }
}

async function assignedTo(contacts, image) {
    const extractNames = (contacts) => {
        return Object.values(contacts).map(entry => ({ name: entry.name }));
    };
    const names = extractNames(contacts);
    console.log(names);

    let position = document.getElementById('checkboxes');
    position.innerHTML = '';

    let list = ''; // Initialisierung des Strings

    for (let index = 0; index < names.length; index++) {
        const element = names[index];
        const imgSrc = image[index]; // Bild-URL holen
        list += `
            <label class="checkBoxFlex" for="checkbox-${index}">
                <div>
                    <img src="${imgSrc}" alt="${element.name}" />
                    ${element.name}
                </div>
                <input type="checkbox" id="checkbox-${index}" value="${element.name}" onclick="assignedToUser('${element.name}')" />
            </label>`;
    }

    position.innerHTML = list; // HTML-Inhalt setzen
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

function createTask() {
    let taskTitle = document.getElementById('title');
    let taskDescription = document.getElementById('description');
    let assignedToTask = document.getElementById('assignedTo');
    let dueDateTask = document.getElementById('dueDate');
    let taskCategory = document.getElementById('taskCategory');
    let lastString = prioArray.pop();

    addTaskArray.push({
        title: taskTitle.value,
        description: taskDescription.value,
        assignedTo: assignedToTask.value,
        dueDate: dueDateTask.value,
        prio: lastString,
        category: taskCategory.value,
        subtasks: subtasksArray
    });

    console.log(addTaskArray);
}

function prio(id) {
    if (id == 1) {
        prioArray.push('Urgent');
    } else if (id == 2) {
        prioArray.push('Medium');
    } else if (id == 3) {
        prioArray.push('Low');
    }
}

function addSubtasks() {
    let positionOfSubtasksControl = document.getElementById('subtasksControl');
    positionOfSubtasksControl.classList.remove('d-none');
    let positionOfSubtasksPlus = document.getElementById('subtasksPlus');
    positionOfSubtasksPlus.classList.add('d-none');
    let input = document.getElementById('subtasks');
    subtasksArray.push(input.value);
    let subtasksPosition = document.getElementById('subtasksPosition');
    subtasksPosition.innerHTML = '';
    for (let index = 0; index < subtasksArray.length; index++) {
        const element = subtasksArray[index];
        subtasksPosition.innerHTML += `
            <ul>
            <li>${element}</li>
            </ul>`;
    }
    input.value = '';
    console.log(subtasksArray);
}

function cancelTask() {
    // Implementieren Sie hier die Logik zum Abbrechen oder Zurücksetzen eines Tasks
}
