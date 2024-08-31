async function htmlBoardImage(imageUrl, index) {
    return `
    <div class="image-div">
      <img class="user-image-board img-32" src="${imageUrl}">
    </div>  `;
}

async function subtasksRender(indexHtml, subtasks) {
    subtasksLengthArray.push({
        position: indexHtml,
        subs: subtasks
    });
    let positionOfSubtasksLength = document.getElementById(`subtasksLength${indexHtml}`);
    if (Array.isArray(subtasks)) {
        for (let index = 0; index < subtasks.length; index++) {
            const element = subtasks[index];
        }
        positionOfSubtasksLength.innerHTML = `<p class="subtasks-board-task-text">${subtasks.length} Subtasks</p>`;
    } else {
        positionOfSubtasksLength.innerHTML = `<p class="subtasks-board-task-text">0 Subtasks</p>`;
    }
}

async function userNamesRender(index) {
    let position = document.getElementById(`userNames${index}`)
    for (let index = 0; index < userNames.length; index++) {
        const element = userNames[index];
        position.innerHTML += `<p class="d-flex item-center  fs-20 fw-400">${element}</p>`;
    }
}

window.htmlboard = async function (index, category, title, description, date, prio) {
    return `
    <div id="parentContainer${index}" draggable="true" ondragstart="startDragging('${taskkeys[index]}')" onclick="openTaskToBoardRender(${index}, '${category}', '${title}', '${description}', '${date}', '${prio}')" class="board-task-container bradius24 d-flex flex-d-col content-even mg-btt25"> 
        <div class="d-flex-between mg-btt25">
            <h1 id="categoryColor${index}" class=" txt-center fs-16 mg-block-none bradius8 color-wh">${category}</h1>
            <img onclick="closeOpenTask(${index})" id="closeOpenid="parentContainer${index}"Task${index}" class="d-none" src="../public/img/Close.png">
        </div>
        <div class="width220">
            <h2 class="mg-block-none fs-16 fw-700">${title}</h2> 
        </div>
        <div>  
            <p class="mg-block-none fs-16 fw-400 color-gr width220" id="limitTextDesciption${index}">${description}</p>
        </div> 
        <div class="progress-container d-flex-between width220">
            <div class="width128">
            <div id="progressBar${index}" class="progress-bar"></div>
            </div>
            <div id="subtasksLength${index}" class="subtasksLength fs-12 fw-400 color-bl"></div>
        </div>
        <div class="d-flex-between width220">
            <div class="user-image-bord-container " id="userImageBoard${index}">
            </div>
            <div class="img-32 d-flex-center" id="prioPosition${index}">
            </div>
        </div>  
    </div>`;
};

window.openTaskToBoardHtml = function (index, category, title, description, date, prio) {
    return `
    <div class="board-task-container-open bradius24 bg-color-ww d-flex content-centr" id="parentContainer${index}">
        <div class="width445">  
          <div class="d-flex-between margin-bt8">
              <h1 id="categoryColorOpen${index}" class=" txt-center fs-16 mg-block-none bradius8 color-wh">${category}</h1>
              <img onclick="closeOpenTask(event, ${index})" id="closeOpenTask${index}" class="close-open-task-img" src="../public/img/Close.png">
          </div>
          <div class="margin-bt8">
                <h2 class="task-title mg-block-none fw-700 fs-61">${title}</h2>
          </div>
          <div class="margin-bt8">  
              <p class="description-open-task fs-20 fw-400 mg-block-none">${description}</p>
          </div> 
          <div class="d-flex item-center mg-btt25" id="dateTask${index}">
              <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Due date:</p>
              <p class="d-flex item-center  fs-20 fw-400 mg-block-none margin-left-open-task">${date}</p>
          </div>
          <div class="d-flex item-center mg-btt25" id="prioTask${index}">
              <p class="d-flex item-center fs-20 fw-700 color-dg mg-block-none">Priority:</p>
              <span class="d-flex item-center  fs-16 fw-400 margin-left-open-task">${prio}</span>
              <div class="prio-board-image-container d-flex-center" id="prioPositionOpenTask${index}">
              </div>
          </div>
          <div class="mg-btt25">
          <p class="d-flex item-center fs-20 fw-700 color-dg mg-block-none">Assigned To:</p>
          </div>
          <div class="d-flex mg-btt25">
              <div class="user-image-bord-container-open" id="userImageBoardOpen${index}">
              </div>
          </div>
          <p class="d-flex item-center fs-20 fw-700 color-dg mg-block-inline">Subtasks:</p>    
              <div class="subtask-scrollbar" id="subtasksBoardOpen${index}"></div>
          <div class="d-flex-end">
            <div class="d-flex item-center">
              <div onclick="deleteTask(${index})" class="d-flex item-center pointer"><img class="open-task-delete-edit img" src="../public/img/deleteOpenTask.png"><p class="fs-16 mg-block-none" >Delete</p></div>
              <div class="seperator-opentask"></div>
              <div onclick="editOpenTask(${index}, '${category}', '${title}', '${description}', '${date}', '${prio}')" class="d-flex item-center pointer"><img class="open-task-delete-edit img" src="../public/img/editOpenTask.png"><p class="fs-16 mg-block-none" >Edit</p></div>
            </div>
          </div>
        </div>  
    </div>`;
}

window.editTaskHtml = function (index, category, title, description, date, prio) {
    return `
    <div class="board-task-container-open bradius24 bg-color-ww d-flex content-centr" id="parentContainer${index}">
        <div class="width445"> 
          <div class="d-flex-between margin-bt8"">
              <h1 id="categoryColorEdit${index}" class=" txt-center fs-16 mg-block-none bradius8 color-wh">${category}</h1>
              <img onclick="closeOpenTask(event, ${index})" id="closeOpenTask${index}" class="close-open-task-img" src="../public/img/Close.png">
          </div>
          <div class="margin-bt8 width445">
              <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Title:</p>
              <input onclick="editTitle(${index})" id="inputEditTitle${index}" minlength="2" class="title-edit-input width445" type="text"
                        placeholder="${title}" name="title">
          </div>
          <div class="margin-bt8 width445">  
              <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Description:</p>
              <textarea onclick="editDescription(${index})" id="descriptionEdit${index}" minlength="2" class="edit-task-textarea full-width" placeholder="${description}"
                        name="description" id="description"></textarea>
          </div> 
          <div class="d-flex full-width flex-d-col margin-bt8" id="dateTask${index}">
              <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Due date:</p>
                    <input required placeholder="${date}" class="edit-task-date" type="date" id="dueDateEdit${index}" name="dueDate">
              <p class="d-flex item-center  fs-20 fw-400 mg-block-none margin-left-open-task"></p>
          </div>
          <div class="d-flex flex-d-col  margin-bt8" id="prioTask${index}">
              <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Priority:</p>
              <div class="add-task-prio-button-container">
                        <button onclick="prioEdit(1)" id="prioButton1" value="1" data-prio="urgent" type="button"
                            class="add-task-prio-button">
                            <span>Urgent</span>
                            <img src="../public/img/Prio alta.png" alt="">
                        </button>
                        <button onclick="prioEdit(2)" id="prioButton2" value="2" data-prio="medium" type="button"
                            class="add-task-prio-button">
                            <span>Medium =</span>
                        </button>
                        <button onclick="prioEdit(3)" id="prioButton3" value="3" data-prio="low" type="button"
                            class="add-task-prio-button">
                            <span>Low</span>
                            <img src="../public/img/Prio baja.png" alt="">
                        </button>
              </div>
          </div>
          <div class="margin-bt8">
          <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Assigned To:</p>
          </div>
          <div class="multiselect margin-bt8">
            <div class="selectBox" onclick="showCheckboxesEdit(${index})">
                <select class="add-task-select">
                    <option>Select an option</option>
                </select>
                <div class="overSelect"></div>
            </div>
            <div id="checkboxesEdit${index}">
            </div>
          </div>
          <div class="user-image-bord-container-open" id="userImageBoardOpen${index}">
              </div>
          <p class="d-flex item-center fs-20 fw-700 color-dg mg-block-inline">Subtasks:</p>  
                    <div class="input-with-button-edit bradius10">
                        <input type="text" minlength="2" class="add-task-input-edit" placeholder="Add item" id="subtasks${index}"
                            name="subtasks">
                        <div id="subtasksControl${index}" class="subtasks-control-edit">
                            <button onclick="showSubtaskControlsEdit(${index})" type="button" id="subtasksPlus${index}"
                                class="add-task-button-edit">
                                +
                            </button>
                        </div>

                    </div>
                    <ul class="subtasksListEdit" id="subtasksPosition${index}"></ul> 
              <div class="" id="subtasksBoardEdit${index}"></div>
          <div class="d-flex-end">
            <div class="d-flex item-center">
              <div onclick="updateTaskBoard(${index}, '${category}')" class="d-flex item-center pointer d-flex-center edit-task-button">
                <p class="fs-16 mg-block-none fs-21 f-weight-700 img-24" >ok</p>
                <img class="open-task-delete-edit img" src="../public/img/check2.png">
              </div>
            </div>
          </div> 
        </div>  
    </div>`;
}