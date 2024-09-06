/**
 * Generates the HTML for a checkbox to assign a user to the task during editing.
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
                <input type="checkbox" id="checkbox-${index}" value="${element}" onclick="assignedToUser('${index}','${element}')" />
            </label>`;
}

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

function supplementarySubtaskEditHTML(updatesubtasks, i, indexHTML){
    return  `
    <li id="supplementarySubtaskEdit${i}" class="d-flex-between subtasks-edit bradius8">
        <span>${updatesubtasks}</span>
            <div>
               <img class="pointer" onclick="deleteSubtaskEdit(${i})" src="../public/img/delete.png">
               <img class="pointer" onclick="editSubtaskEdit('${i}','${indexHTML}')" src="../public/img/edit.png">
            </div>
    </li>`;
} 

function editSubtaskEdit(i,indexHTML, )  {
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
    position.innerHTML = `<button onclick="showSubtaskControlsEdit(${index})" type="button"  class="add-task-button-edit">
                                +
                            </button>`;
}