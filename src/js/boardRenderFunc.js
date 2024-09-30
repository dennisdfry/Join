
/**
 * Renders the user names associated with a task.
 * @param {number} index - The index of the task for which user names are being rendered.
 * @returns {Promise<void>}
 */
async function userNamesRender(index) {
  let position = document.getElementById(`userNames${index}`);
  for (let i = 0; i < userNames.length; i++) {
    const element = userNames[i];
    position.innerHTML += `<p class="d-flex item-center fs-20 fw-400">${element}</p>`;
  }
}



/**
 * Generates HTML for an open task view.
 * @param {number} index - The index of the task.
 * @param {string} category - The category of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} date - The due date of the task.
 * @param {string} prio - The priority of the task.
 * @returns {string} - The HTML string for the open task view.
 */
// window.openTaskToBoardHtml = function (index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus) {
//   return `
//     <div class="board-task-container-open bradius24 bg-color-ww d-flex content-centr" id="parentContainer${index}">
//         <div class="width445">  
//           <div class="d-flex-between margin-bt8">
//               <h1 id="categoryColorOpen${index}" class=" txt-center fs-16 mg-block-none bradius8 color-wh">${category}</h1>
//               <img onclick="closeOpenTask(event, ${index})" id="closeOpenTask${index}" class="close-open-task-img" src="../public/img/Close.png">
//           </div>
//           <div class="margin-bt8">
//                 <h2 class="task-title mg-block-none fw-700 fs-61">${title}</h2>
//           </div>
//           <div class="margin-bt8">  
//               <p class="description-open-task fs-20 fw-400 mg-block-none">${description}</p>
//           </div> 
//           <div class="d-flex item-center mg-btt25" id="dateTask${index}">
//               <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Due date:</p>
//               <p class="d-flex item-center fs-20 fw-400 mg-block-none margin-left-open-task">${dueDate}</p>
//           </div>
//           <div class="d-flex item-center mg-btt25" id="prioTask${index}">
//               <p class="d-flex item-center fs-20 fw-700 color-dg mg-block-none">Priority:</p>
//               <span class="d-flex item-center fs-16 fw-400 margin-left-open-task">${prio}</span>
//               <div class="prio-board-image-container d-flex-center" id="prioPositionOpenTask${index}">
//               </div>
//           </div>
//           <div class="mg-btt25">
//               <p class="d-flex item-center fs-20 fw-700 color-dg mg-block-none">Assigned To:</p>
//           </div>
//           <div class="d-flex mg-btt25 assignedToScroll">
//               <div class="user-image-bord-container-open" id="userImageBoardOpen${index}">
//               </div>
//           </div>
//           <p class="d-flex item-center fs-20 fw-700 color-dg mg-block-inline">Subtasks:</p>    
//               <div class="subtask-scrollbar" id="subtasksBoardOpen${index}"></div>
//           <div class="d-flex-end">
//             <div class="d-flex item-center">
//               <div onclick="deleteTask(${index})" class="d-flex item-center pointer"><img class="open-task-delete-edit img" src="../public/img/deleteOpenTask.png"><p class="fs-16 mg-block-none">Delete</p></div>
//               <div class="seperator-opentask"></div>
//               <div onclick="editOpenTask(${index}, '${category}', '${title}', '${description}', '${dueDate}', '${prio}' , '${assignedTo}', '${subtasks}', '${subtaskStatus}')" class="d-flex item-center pointer"><img class="open-task-delete-edit img" src="../public/img/editOpenTask.png"><p class="fs-16 mg-block-none">Edit</p></div>
//             </div>
//           </div>
//         </div>  
//     </div>`;
// };

/**
 * Generates HTML for an edit task view.
 * @param {number} index - The index of the task.
 * @param {string} category - The category of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} date - The due date of the task.
 * @param {string} prio - The priority of the task.
 * @returns {string} - The HTML string for the edit task view.
 */
window.editTaskHtml = function (index, category, title, description, date, prio) {
  return `
  <form onsubmit="handleFormSubmitEdit(event, ${index}, '${category}')">
    <div class="board-task-container-open edit-board-form bradius24 bg-color-ww d-flex content-centr" id="parentContainer${index}">
        <div class="edit-board-form2"> 
          <div class="d-flex-between margin-bt8">
              <h1 id="categoryColorEdit${index}" class=" txt-center fs-16 mg-block-none bradius8 color-wh">${category}</h1>
              <img onclick="closeOpenTaskEdit(event, ${index})" id="closeOpenTask${index}" class="close-open-task-img" src="../public/img/Close.png">
          </div>
          <div class="margin-bt8 full-width">
              <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Title:</p>
              <input required minlength="2" onclick="editTitle(${index})" id="inputEditTitle${index}"  class="title-edit-input full-width" type="text"
                        value="${title}" name="title">
          </div>
          <div class="margin-bt8 full-width">  
              <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Description:</p>
              <textarea required minlength="2" onclick="editDescription(${index})" id="descriptionEdit${index}"  class="edit-task-textarea full-width" 
                        name="description">${description}</textarea>
          </div> 
          <div class="d-flex full-width flex-d-col margin-bt8" id="dateTask${index}">
              <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Due date:</p>
                    <input required placeholder="${date}" class="edit-task-date pointer" type="date" id="dueDateEdit${index}" name="dueDate">
              <p class="d-flex item-center fs-20 fw-400 mg-block-none margin-left-open-task"></p>
          </div>
          <div class="d-flex flex-d-col margin-bt8" id="prioTask${index}">
              <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Priority:</p>
              <div class="add-task-prio-button-container">
                        <button onclick="prioEdit(1)" id="prioButtonEdit1" value="1" data-prio="urgent" type="button"
                            class="add-task-prio-button">
                            <span>Urgent</span>
                            <img src="../public/img/Prio alta.png" alt="">
                        </button>
                        <button onclick="prioEdit(2)" id="prioButtonEdit2" value="2" data-prio="medium" type="button"
                            class="add-task-prio-button">
                            <span>Medium =</span>
                        </button>
                        <button onclick="prioEdit(3)" id="prioButtonEdit3" value="3" data-prio="low" type="button"
                            class="add-task-prio-button">
                            <span>Low</span>
                            <img src="../public/img/Prio baja.png" alt="">
                        </button>
              </div>
          </div>
          <div class="margin-bt8">
              <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Assigned To:</p>
          </div>
          <div class="multiselect margin-bt8 pointer">
            <div class="selectBox" onclick="showCheckboxesEdit(${index})">
                <select required class="add-task-select">
                    <option>Select an option</option>
                </select>
                <div class="overSelect"></div>
            </div>
            <div id="checkboxesEdit${index}">
            </div>
          </div>
          <div class="user-image-bord-container-open" id="userImageBoardOpenEdit${index}">
          </div>
          <p class="d-flex item-center fs-20 fw-700 color-dg mg-block-inline">Subtasks:</p>  
                    <div class="input-with-button-edit bradius10">
                        <input type="text" minlength="2" class="add-task-input-edit" placeholder="Add item" id="subtasksEdit${index}"
                            name="subtasks">
                        <div id="subtasksControl${index}" class="subtasks-control-edit">
                            <button onclick="showSubtaskControlsEdit(${index})" type="button" id="subtasksPlus${index}"
                                class="add-task-button-edit">
                                +
                            </button>
                        </div>
                    </div>
                    <ul class="subtasksListEdit" id="subtasksPosition${index}"></ul> 
          
            <div class=" d-flex content-even edit-task-button-div">
             <button class="pointer edit-task-button" id="edit-Add-Btn">
                <span class="fs-16 mg-block-none fs-21 f-weight-700 img-24">Edit</span>
                <img class="open-task-delete-edit img" src="../public/img/check2.png">
             </button> 
            </div>
           
        </div>  
    </div>
    </form>
  `;
}
