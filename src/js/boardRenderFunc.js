
window.htmlboard = async function(index, category, title, description, date, prio) {
    return `
    <div draggable="true" ondragstart="startDragging(${index})" onclick="openTaskToBoard(${index}, '${category}', '${title}', '${description}', '${date}', '${prio}')" class="board-task-container" id="parentContainer${index}">
        <div class="d-flex-between">
            <h1 class="txt-center">${category}</h1>
            <img onclick="closeOpenTask(${index})" id="closeOpenTask${index}" class="d-none" src="../public/img/Close.png">
        </div>
        <div>
            <h2>${title}</h2> 
        </div>
        <div>  
            <p>${description}</p>
        </div> 
        <div class="progress-container d-flex-between">
            <div class="progress-bar" style="width: 50%;"></div><div id="subtasksLength${index}"></div>
        </div>
        <div class="d-flex-between">
            <div class="user-image-bord-container" id="userImageBoard${index}">
            </div>
            <div class="prio-board-image-container d-flex-center" id="prioPosition${index}">
            </div>
        </div>  
    </div>`;  
};

window.openTaskToBoard = async function (index, category, title, description, date, prio ) {
    let position = document.getElementById('openTask');
    if (position.classList.contains('modal-overlay')){
      return
    }else{
    position.classList.add('modal-overlay');
    position.classList.remove('d-none');
    position.innerHTML = `
    <div draggable="true" ondragstart="startDragging(${index})" class="board-task-container-open" id="parentContainer${index}">
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
              <div class="d-flex item-center pointer"><img class="open-task-delete-edit img" src="../public/img/editOpenTask.png"><p class="fs-16 mg-block-none" >Edit</p></div>
            </div>
          </div>
    </div>`;  
  }
  let taskInfo = taskData[index];
    if (taskInfo) {
        let users = taskInfo.users;
        let userNames = taskInfo.userNames
        let prio = taskInfo.prio;
        let subtasks = taskInfo.subtasks;
        let fetchImage = taskInfo.fetchImage; // Abrufen von fetchImage
        await Promise.all([
          searchIndexUrlOpen(index, users, fetchImage, userNames),
          subtasksRenderOpen(index, subtasks),
          searchprio(index, prio),
          searchprioOpenTask(index, prio)
      ]);
}else {
  console.error("Keine Daten für den angegebenen Index gefunden.");
}
}