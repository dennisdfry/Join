

function checkBoxRenderEdit(index, names, urls) {
    return `<label class="checkBoxFlex" for="checkbox-${index}" id="checkboxColor${index}">
                <div class="checkBoxImg">
                     <img id="assignedToUserImageBorder${index}" src="${urls}" alt="" />
                    ${names}
                </div>
                <input class="assignedToUserCheckbox img-24" type="checkbox" id="checkbox-${index}" value="${names}" onclick="assignedToUserEdit('${index}','${urls}','${names}')" />
            </label>`;
}


function showSubtaskControlsEdit(index, subtasks) {
    console.log(index)
    document.getElementById(`subtasksEdit${index}`).classList.remove('add-task-input-edit');
    document.getElementById(`subtasksEdit${index}`).classList.add('subtasks-input-edit');
    
    let position = document.getElementById(`subtasksControl${index}`);
    position.innerHTML = `<button onclick="resetSubtaskInputEdit('${index}','${subtasks}')" type="button" class="subtask-button-edit">
                                <img src="../public/img/closeAddTask.png" alt="Reset">
                            </button>
                            <div class="seperator-subtasks"></div>
                            <button onclick="addSubtaskEdit('${index}','${subtasks}')" type="button" class="subtask-button-edit">
                                <img src="../public/img/checkAddTask.png" alt="Add">
                            </button>`;
}


function editSubtaskEdit(i, indexHTML, subtask, subtasksEditArrayOrigin) {
    let position = document.getElementById(`supplementarySubtaskEdit${i}`);
    position.innerHTML = `
        <input id="inputEditSubtasks${i}" class="" value="${subtask}">
        <div>
            <img class="img-24" onclick="deleteSubtaskEdit('${i}','${indexHTML}', '${subtasksEditArrayOrigin}')" src="../public/img/delete.png">
            <img class="img-24" onclick="finishSubtaskEdit('${i}','${indexHTML}', '${subtasksEditArrayOrigin}')" src="../public/img/checkAddTask.png" alt="Add">
        </div>`;
}

function finishSubtaskEdit(i, indexHTML, subtasksEditArrayOrigin) {
   let subtasksEditArrayFinish = subtasksEditArrayOrigin.split(',').map(subtasksEditArrayOrigin => subtasksEditArrayOrigin.trim());
    let input = document.getElementById(`inputEditSubtasks${i}`);
    console.log(subtasksEditArrayFinish)
    subtasksEditArrayFinish[i] = input.value;

    console.log(subtasksEditArrayFinish)
    subtasksRenderOpenEdit(indexHTML, subtasksEditArrayFinish);
    subtasksEditArrayFinish =[];
  }


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

