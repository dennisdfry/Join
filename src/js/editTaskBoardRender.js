/**
 * Generates the HTML for a checkbox element used to assign a user to a task during editing.
 * 
 * @param {number} index - The index of the contact.
 * @param {string} imgSrc - The image URL of the contact.
 * @param {string} element - The name of the contact.
 * @returns {string} - The HTML string for the checkbox.
 */
function checkBoxRenderEdit(index, imgSrc, element) {
    return `<label class="checkBoxFlex" for="checkbox-${index}">
                <div class="checkBoxImg">
                    <img src="${imgSrc}" alt="" />
                    ${element}
                </div>
                <input type="checkbox" id="checkbox-${index}" value="${element}" onclick="assignedToUserEdit('${index}','${element}')" />
            </label>`;
}

/**
 * Displays the controls for managing subtasks during task editing.
 * 
 * @param {number} index - The index of the task for which subtasks are being edited.
 */
function showSubtaskControlsEdit(index) {
    document.getElementById(`subtasksEdit${index}`).classList.remove('add-task-input-edit');
    document.getElementById(`subtasksEdit${index}`).classList.add('subtasks-input-edit');
    
    let position = document.getElementById(`subtasksControl${index}`);
    position.innerHTML = `<button onclick="resetSubtaskInputEdit(${index})" type="button" class="subtask-button-edit">
                                <img src="../public/img/closeAddTask.png" alt="Reset">
                            </button>
                            <div class="seperator-subtasks"></div>
                            <button onclick="addSubtaskEdit(${index})" type="button" class="subtask-button-edit">
                                <img src="../public/img/checkAddTask.png" alt="Add">
                            </button>`;
}

/**
 * Generates the HTML for a supplementary subtask item during task editing.
 * 
 * @param {string} updatesubtasks - The text of the supplementary subtask.
 * @param {number} i - The index of the supplementary subtask.
 * @param {string} indexHTML - The index or identifier used in the HTML structure.
 * @returns {string} - The HTML string for the supplementary subtask item.
 */
function supplementarySubtaskEditHTML(updatesubtasks, i, indexHTML) {
    return `
    <li id="supplementarySubtaskEdit${i}" class="d-flex-between subtasks-edit bradius8">
        <span>${updatesubtasks}</span>
        <div>
            <img class="pointer" onclick="deleteSubtaskEdit('${i}','${indexHTML}')" src="../public/img/delete.png">
            <img class="pointer" onclick="editSubtaskEdit('${i}','${indexHTML}')" src="../public/img/edit.png">
        </div>
    </li>`;
}

/**
 * Prepares an input field for editing a subtask, displaying controls to finish or delete the edit.
 * 
 * @param {number} i - The index of the subtask being edited.
 * @param {string} indexHTML - The index or identifier used in the HTML structure.
 */
function editSubtaskEdit(i, indexHTML) {
    let position = document.getElementById(`supplementarySubtaskEdit${i}`);
    let arrayPosition = subtasksArrayEdit[i];
    console.log(subtasksArrayEdit[i]);
    
    position.innerHTML = `
        <input id="inputEditSubtasks${i}" class="" value="${arrayPosition}">
        <div>
            <img class="img-24" onclick="deleteSubtaskEdit('${i}','${indexHTML}')" src="../public/img/delete.png">
            <img class="img-24" onclick="finishSubtaskEdit('${i}','${indexHTML}')" src="../public/img/checkAddTask.png" alt="Add">
        </div>`;
}

/**
 * Resets the subtask input field to its original state during task editing.
 * 
 * @param {number} index - The index of the task being edited.
 */
function resetSubtaskInputEdit(index) {
    let input = document.getElementById(`subtasksEdit${index}`);
    input.value = '';
    document.getElementById(`subtasksEdit${index}`).classList.add('add-task-input-edit');
    document.getElementById(`subtasksEdit${index}`).classList.remove('subtasks-input-edit');
    
    let position = document.getElementById(`subtasksControl${index}`);
    position.innerHTML = `<button onclick="showSubtaskControlsEdit(${index})" type="button" class="add-task-button-edit">
                                +
                            </button>`;
}

/**
 * Renders user images for editing based on the current list of users.
 * 
 * @param {number} index - The index of the user image board being updated.
 */
function userImageRenderEdit(index) {
    let position = document.getElementById(`userImageBoardOpenEdit${index}`);
    
    if (usersEdit == null) {
        return;
    } else {
        position.innerHTML = '';
        
        for (let i = 0; i < usersEdit.length; i++) {
            const usersAdd = usersEdit[i];
            const urls = fetchImagesEdit[usersAdd];
            position.innerHTML += `<img class="img-24" src="${urls}">`;
        }
    }
}
