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
        await assignedTo(contacts, imageUrls, index);
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

async function assignedTo(contacts, imageUrls, index) {
    try {
        const extractNames = (contacts) => {
            return Object.values(contacts).map(entry => ({ name: entry.name }));
        };
        const names = extractNames(contacts);
        checkboxInit(names,imageUrls, index)
    } catch (error) {
        console.error(error);
    }
}

function checkboxInit(names,imageUrls, indexHTML){
    let position = document.getElementById(`checkboxesEdit${indexHTML}`);
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

function showCheckboxesEdit(index) {
    let checkboxes = document.getElementById(`checkboxesEdit${index}`);
    if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
    } else {
        checkboxes.style.display = "none";
        expanded = false;
    }
}