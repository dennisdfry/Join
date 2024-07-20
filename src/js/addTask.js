let BASE_URL = "https://join-19628-default-rtdb.firebaseio.com";

let subtasksArray = [];
let prioArray = [];
let addTaskArray = [];
let assignedToUserArray = [];

let expanded = false;
let isValid = true;
onload();
async function onload() {
    try {
        let fireBaseData = await onloadData("/");
        let contacts = await fetchContacts(fireBaseData);
        console.log(contacts)
        let images = await fetchImages(contacts);
        console.log(images)
        await assignedTo(contacts, images);
    } catch (error) {
        console.log("error")
    }
}

async function onloadData(path = "") {
    let response = await fetch(BASE_URL + path + '.json');
    let responseToJson = await response.json();
    return responseToJson;
}

async function fetchContacts(responseToJson) {
    let contacts = responseToJson.contacts;
    return contacts
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

async function showCheckboxes() {
    let checkboxes = document.getElementById("checkboxes");
    if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
    } else {
        checkboxes.style.display = "none";
        expanded = false;
    }
}

async function assignedTo(contacts, image) {
    const extractNames = (contacts) => {
        return Object.values(contacts).map(entry => ({ name: entry.name }));
    };
    const names = extractNames(contacts);
    let position = document.getElementById('checkboxes');
    position.innerHTML = '';

    for (let index = 0; index < names.length; index++) {
        const element = names[index];
        const images = image[index];
        let list = `<label class="checkBoxFlex" for="checkbox-${index}">
                        <div>
                            <img src="${images}" alt="${element.name}" >
                            ${element.name}
                        </div>
                        <input type="checkbox" id="checkbox-${index}" value="${element.name}" onclick="assignedToUser('${element.name}')">
                    </label>`;
        position.innerHTML += list;
    }
}

function assignedToUser(element) {
    assignedToUserArray.push(element);
    console.log(assignedToUserArray);
}

function createTask() {
        let lastString = prioArray.pop();
        let taskTitle = document.getElementById('title');
        let taskDescription = document.getElementById('description');
        let dueDateTask = document.getElementById('dueDate');
        let taskCategory = document.getElementById('taskCategory');
        addTaskArray.push(
            {
                title: taskTitle.value,
                description: taskDescription.value,
                assignedTo: assignedToUserArray,
                dueDate: dueDateTask.value,
                prio: lastString,
                category: taskCategory.value,
                subtasks: subtasksArray
            }
        );
        console.log(addTaskArray);
    }

function prio(id) {
    if (id == 1) {
        prioArray.push('Urgent')
    } else {
        if (id == 2) {
            prioArray.push('Medium')
        } else {
            if (id = 3) {
                prioArray.push('Low')
            }
        }
    }
}

function addSubtasks() {
    let input = document.getElementById('subtasks');
    if (!input.value) {
        isValid = false;
        alert('Due date is required.');
    } else {
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
    }
}

function closeSubtasksCheck() {
    
}
function openCheckSubtasks() {
    let positionOfSubtasksControl = document.getElementById('subtasksControl');
    let positionOfSubtasksPlus = document.getElementById('subtasksPlus');
    positionOfSubtasksControl.classList.remove('d-none');
    positionOfSubtasksControl.classList.add('subtasks-control');
    positionOfSubtasksPlus.classList.add('d-none');
}
function cancelTask() {
    window.location.href = 'index.html';
}




