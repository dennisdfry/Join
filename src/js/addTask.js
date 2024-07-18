let BASE_URL = "https://join-19628-default-rtdb.firebaseio.com";
let subtasksArray = [];
let prioArray = [];
let addTaskArray = [];
let expanded = false;

async function init() {
    try {
        let fireBaseData = await onloadData("/");
        let contacts = await fetchContacts(fireBaseData)
        console.log(contacts)
        await assignedTo(contacts);
        let contactImage = contacts.one.img;
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
async function assignedTo(contacts) {
    const extractNames = (contacts) => {
        return Object.values(contacts).map(entry => entry.name);
    };
    const names = extractNames(contacts);
    console.log(names);
    let position = document.getElementById('checkboxes');
    for (let index = 0; index < names.length; index++) {
        const element = names[index];
        position.innerHTML += `<label for="one">
                              <input type="checkbox" id="${index}" />${element}</label>`
    }
}

function createTask() {
    let taskTitle = document.getElementById('title');
    let taskDescription = document.getElementById('description');
    let assignedToTask = document.getElementById('assignedTo');
    let dueDateTask = document.getElementById('dueDate');
    let taskCategory = document.getElementById('taskCategory');
    let lastString = prioArray.pop();

    addTaskArray.push(
        {
            title: taskTitle.value,
            description: taskDescription.value,
            assignedTo: assignedToTask.value,
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
    let positionOfSubtasksControl = document.getElementById('subtasksControl');
    positionOfSubtasksControl.classList.remove('d-none')
    let positionOfSubtasksPlus = document.getElementById('subtasksPlus')
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

function cancelTask(){

}




