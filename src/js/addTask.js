let BASE_URL = "https://join-19628-default-rtdb.firebaseio.com";
let subtasksArray = [];
let prioArray = [];
async function init(){
    try {
       let fireBaseData = await onloadData("/"); 
       let contacts = await fetchContacts(fireBaseData)
       console.log(contacts)
   await assignedTo(contacts);
       let contactImage = contacts.one.img;
    //    await showImage(contactImage);
    } catch (error) {
        console.log("error")
    }}

async function onloadData(path=""){
    let response = await fetch(BASE_URL + path + '.json');
    let responseToJson = await response.json();
    return responseToJson;
}

async function fetchContacts(responseToJson){
    let contacts = responseToJson.contacts;
    return contacts   
}

// async function showImage(contactImage){
//     let position = document.getElementById('contactImage');
//     console.log(contactImage)
//     position.innerHTML += `<img src="${contactImage}>`
// }

async function assignedTo(contacts){
    const extractNames = (contacts) => {
        return Object.values(contacts).map(entry => entry.name);
    };
    const names = extractNames(contacts);
    console.log(names);
    let position = document.getElementById('assignedTo');
    for (let index = 0; index < names.length; index++) {
        const element = names[index];
       position.innerHTML += `<option>${element}</option><input type="checkbox">` 
    }}

function createTask(){
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let assignedTo = document.getElementById('assignedTo');
    let dueDate = document.getElementById('dueDate');
    let taskCategory = document.getElementById('taskCategory');
    let lastString = prioArray.pop(); 
    console.log(lastString)
    console.log(taskCategory.value);
    console.log(dueDate.value);
    console.log(assignedTo.value);
    console.log(title.value);
    console.log(description.value);
 
}
function prio(id){
    if(id == 1){
        prioArray.push('Urgent')
    } else{
        if( id == 2){
            prioArray.push('Medium')
        }else{
            if(id = 3){
                prioArray.push('Low')
            }}}
}

function addSubtasks(){
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
