
window.htmlboard = async function(index, category, title, description, date, prio) {
    return `
    <div id="parentContainer${index}" draggable="true" ondragstart="startDragging('${taskkeys[index]}')" onclick="openTaskToBoardRender(${index}, '${category}', '${title}', '${description}', '${date}', '${prio}')" class="board-task-container">
        <div class="d-flex-between">
            <h1 class="txt-center">${category}</h1>
            <img onclick="closeOpenTask(${index})" id="closeOpenid="parentContainer${index}"Task${index}" class="d-none" src="../public/img/Close.png">
        </div>
        <div>
            <h2>${title}</h2> 
        </div>
        <div>  
            <p id="limitTextDesciption${index}">${description}</p>
        </div> 
        <div class="progress-container d-flex-between">
            <div id="progressBar${index}" class="progress-bar" style="width: 50%;"></div><div id="subtasksLength${index}"></div>
        </div>
        <div class="d-flex-between">
            <div class="user-image-bord-container" id="userImageBoard${index}">
            </div>
            <div class="prio-board-image-container d-flex-center" id="prioPosition${index}">
            </div>
        </div>  
    </div>`;  
};

window.openTaskToBoardHtml = function (index, category, title, description, date, prio){
    return `
    <div class="board-task-container-open" id="parentContainer${index}">
          <div class="d-flex-between">
              <h1 class="txt-center">${category}</h1>
              <img onclick="closeOpenTask(event, ${index})" id="closeOpenTask${index}" class="close-open-task-img" src="../public/img/Close.png">
          </div>
          <div>
              <h2>${title}</h2> 
          </div>
          <div>  
              <p class="description-open-task">${description}</p>
          </div> 
          <div class="d-flex item-center mg-btt25" id="dateTask${index}">
              <p class="d-flex item-center fs-20 fw-400 mg-block-none color-dg">Due date:</p>
              <p class="d-flex item-center  fs-20 fw-400 mg-block-none margin-left-open-task">${date}</p>
          </div>
          <div class="d-flex item-center mg-btt25" id="prioTask${index}">
              <p class="d-flex item-center fs-20 fw-400 color-dg mg-block-none">Priority:</p>
              <span class="d-flex item-center  fs-20 fw-400 margin-left-open-task">${prio}</span>
              <div class="prio-board-image-container d-flex-center" id="prioPositionOpenTask${index}">
              </div>
          </div>
          <div class="mg-btt25">
          <p class="d-flex item-center fs-20 fw-400 color-dg mg-block-none">Assigned To:</p>
          </div>
          <div class="user-open-Container d-flex mg-btt25">
              <div class="user-image-bord-container-open" id="userImageBoardOpen${index}">
              </div>
          </div>
          <p class="d-flex item-center fs-20 fw-400 color-dg mg-block-inline">Subtasks:</p>    
              <div class="" id="subtasksBoardOpen${index}"></div>
          <div class="d-flex-end">
            <div class="d-flex item-center">
              <div class="d-flex item-center pointer"><img class="open-task-delete-edit img" src="../public/img/deleteOpenTask.png"><p class="fs-16 mg-block-none" >Delete</p></div>
              <div class="seperator-opentask"></div>
              <div onclick="editOpenTask(${index}, '${category}', '${title}', '${description}', '${date}', '${prio}')" class="d-flex item-center pointer"><img class="open-task-delete-edit img" src="../public/img/editOpenTask.png"><p class="fs-16 mg-block-none" >Edit</p></div>
            </div>
          </div>
    </div>`;  
}

 window.editTaskHtml = function(index, category, title, description, date, prio){
    return `
    <div class="board-task-container-open" id="parentContainer${index}">
          <div class="d-flex-between">
              <h1 class="txt-center">${category}</h1>
              <img onclick="closeOpenTask(event, ${index})" id="closeOpenTask${index}" class="close-open-task-img" src="../public/img/Close.png">
          </div>
          <div class="full-width">
              <p class="d-flex item-center fs-20 fw-400 mg-block-none color-dg">Title:</p>
              <input minlength="2" class="title-edit-input" type="text"
                        placeholder="${title}" name="title" id="title">
          </div>
          <div>  
              <p class="d-flex item-center fs-20 fw-400 mg-block-none color-dg">Description:</p>
              <textarea minlength="2" class="edit-task-textarea" placeholder="${description}"
                        name="description" id="description"></textarea>
          </div> 
          <div class="d-flex full-width flex-d-col mg-btt25" id="dateTask${index}">
              <p class="d-flex item-center fs-20 fw-400 mg-block-none color-dg">Due date:</p>
                    <input required placeholder="${date}" class="edit-task-date" type="date" id="dueDate${index}" name="dueDate">
              <p class="d-flex item-center  fs-20 fw-400 mg-block-none margin-left-open-task"></p>
          </div>
          <div class="d-flex item-center mg-btt25" id="prioTask${index}">
              <p class="d-flex item-center fs-20 fw-400 color-dg mg-block-none">Priority:</p>
              <div class="add-task-prio-button-container">
                        <button onclick="prio(1)" id="prioButton1" value="1" data-prio="urgent" type="button"
                            class="add-task-prio-button">
                            <span>Urgent</span>
                            <img src="../public/img/Prio alta.png" alt="">
                        </button>
                        <button onclick="prio(2)" id="prioButton2" value="2" data-prio="medium" type="button"
                            class="add-task-prio-button">
                            <span>Medium =</span>
                        </button>
                        <button onclick="prio(3)" id="prioButton3" value="3" data-prio="low" type="button"
                            class="add-task-prio-button">
                            <span>Low</span>
                            <img src="../public/img/Prio baja.png" alt="">
                        </button>
              </div>
          </div>
          <div class="mg-btt25">
          <p class="d-flex item-center fs-20 fw-400 color-dg mg-block-none">Assigned To:</p>
          </div>
          <div class="multiselect">
            <div class="selectBox" onclick="showCheckboxes()">
                <select required class="add-task-select">
                    <option>Select an option</option>
                </select>
                <div class="overSelect"></div>
            </div>
            <div id="checkboxesBoard">
            </div>
          </div>
          <p class="d-flex item-center fs-20 fw-400 color-dg mg-block-inline">Subtasks:</p>    
              <div class="" id="subtasksBoardOpen${index}"></div>
          <div class="d-flex-end">
            <div class="d-flex item-center">
              <div class="d-flex item-center pointer"><img class="open-task-delete-edit img" src="../public/img/deleteOpenTask.png"><p class="fs-16 mg-block-none" >Delete</p></div>
              <div class="seperator-opentask"></div>
              <div onclick="editTask()" class="d-flex item-center pointer"><img class="open-task-delete-edit img" src="../public/img/editOpenTask.png"><p class="fs-16 mg-block-none" >Edit</p></div>
            </div>
          </div> 
    </div>`; 
 }