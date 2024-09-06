let opentaskIndex;
/**
 * Updates the priority icon in the open task view based on the task's priority level.
 * 
 * @param {number} index - The index of the task.
 * @param {string} prio - The priority level of the task ('Urgent', 'Medium', 'Low').
 */
function searchprioOpenTask(index, prio) {
  let position = document.getElementById(`prioPositionOpenTask${index}`);
  position.innerHTML = '';
  // Set the appropriate image based on the priority level
  if (prio == 'Urgent') {
    position.innerHTML = `<img  src="../public/img/Prio alta.png" alt="">`;
  } else {
    if (prio == 'Medium') {
      position.innerHTML = `<img  src="../public/img/prioOrange.png" alt="">`;
    } else {
      if (prio == 'Low') {
        position.innerHTML = `<img src="../public/img/Prio baja.png" alt="">`;
      }
    }
  }
}

/**
 * Renders the user images for a specific task in the open task view.
 * 
 * @param {number} index - The index of the task.
 * @param {Array<string>} users - An array of user IDs associated with the task.
 * @param {Array<string>} fetchImage - An array of image URLs associated with the users.
 * @param {Array<string>} userNames - An array of user names associated with the task.
 * @async
 */
async function searchIndexUrlOpen(index, users, fetchImage, userNames) {
  let position = document.getElementById(`userImageBoardOpen${index}`);
  position.innerHTML = '';
  if (!users || users.length === 0) {
    return;
  }
  for (let i = 0; i < users.length; i++) {
    const element = users[i];
    const names = userNames[i];
    let imageUrl = fetchImage[element];
    position.innerHTML += await htmlBoardImageOpen(imageUrl, i, names);
  }
}

/**
 * Generates the HTML structure for displaying a user's image and name in the open task view.
 * 
 * @param {string} imageUrl - The URL of the user's image.
 * @param {number} index - The index of the user in the list.
 * @param {string} names - The name of the user.
 * @returns {string} The HTML string representing the user's image and name.
 */
function htmlBoardImageOpen(imageUrl, index, names) {
  return `
    <div class="d-flex pa-7-16">
      <img class="user-image-task-open" src="${imageUrl}">
      <div class="d-flex item-center font-sf fs-19 fw-400">${names}</div>
    </div>`;
}

/**
 * Closes the open task view and navigates back to the main board.
 * 
 * @param {Event} event - The event object associated with the close action.
 * @param {number} index - The index of the task.
 */
function closeOpenTask(event, indexHTML) {
  event.stopPropagation();
  let openPosition = document.getElementById('openTask');
  openPosition.classList.remove('modal-overlay');
  openPosition.classList.add('d-none');
  openPosition.innerHTML = '';
  progressBar(indexHTML);
}
function oneClickClose(event){
  let openPosition = document.getElementById('openTask');
      if (event.target.classList.contains('modal-overlay')) {
        openPosition.classList.remove('modal-overlay');
        openPosition.classList.add('d-none');
        openPosition.innerHTML = ''; 
        progressBar(opentaskIndex);  
      }
    }


/**
 * Renders the subtasks for a specific task in the open task view.
 * 
 * @param {number} indexHtml - The index of the task in the HTML.
 * @param {Array<string>} subtasks - An array of subtasks associated with the task.
 */
function subtasksRenderOpen(indexHtml, subtasks) {
  let position = document.getElementById(`subtasksBoardOpen${indexHtml}`);
  position.innerHTML = '';
  subtasksLengthArray =[];
  subtasksLengthArray.push(subtasks);
  if (Array.isArray(subtasks)) {
    for (let i = 0; i < subtasks.length; i++) {
      const element = subtasks[i];
      position.innerHTML += subtasksRenderOpenHtml(indexHtml, i, element);
    }
  }
}

/**
 * Generates the HTML structure for displaying a subtask in the open task view.
 * 
 * @param {number} indexHtml - The index of the task in the HTML.
 * @param {number} index - The index of the subtask in the list.
 * @param {string} element - The subtask description.
 * @returns {string} The HTML string representing the subtask.
 */
function subtasksRenderOpenHtml(indexHtml, index, element) {
  return `
    <div class="d-flex item-center pa-7-16">
      <input onclick="subtaskStatus('${indexHtml}','${index}')" class="checkbox-open-Task" type="checkbox" id="subtask-${indexHtml}-${index}">
      <label for="subtask-${indexHtml}-${index}">${element}</label>
    </div>`;
}

/**
 * Opens and renders the detailed view of a task on the board, including its category, title, description, date, and priority.
 * 
 * @param {number} index - The index of the task.
 * @param {string} category - The category of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} date - The due date of the task.
 * @param {string} prio - The priority level of the task.
 */
function openTaskToBoardRender(index, category, title, description, date, prio) {
  opentaskIndex = index;
  let position = document.getElementById('openTask');
  if (position.classList.contains('modal-overlay')) {
    return;
  } else {
    position.classList.add('modal-overlay');
    position.classList.remove('d-none');
    position.innerHTML = openTaskToBoardHtml(index, category, title, description, date, prio);
    CategoryColorOpen(index, category);
  }
  promiseSecondInfoOpenTask(index);
}

/**
 * Updates the background color of the task's category label in the open task view.
 * 
 * @param {number} index - The index of the task.
 * @param {string} category - The category of the task.
 */
function CategoryColorOpen(index, category) {
  let position = document.getElementById(`categoryColorOpen${index}`);
  if (category == 'TechnicalTask') {
    position.style.backgroundColor = "#1fd7c1";
  } else {
    position.style.backgroundColor = "#0038ff";
  }
}

/**
 * Fetches and renders additional task details (such as subtasks, users, priority) in the open task view.
 * 
 * @param {number} index - The index of the task.
 * @async
 */
async function promiseSecondInfoOpenTask(index) {
  let taskInfo = taskData[index];
  if (taskInfo) {
    let { users, userNames, prio, subtasks, fetchImage } = taskInfo;
    subtasksRenderOpen(index, subtasks);
    await Promise.all([
      searchIndexUrlOpen(index, users, fetchImage, userNames),
      searchprio(index, prio),
      searchprioOpenTask(index, prio),
    ]);
    await loadSubtaskStatus(index);
  } else {
    console.error("No data found for the specified index.");
  }
}

/**
 * Deletes a specific task from Firebase and updates the board view.
 * 
 * @param {number} indexHTML - The index of the task in the HTML.
 * @async
 */
async function deleteTask(indexHTML) {
  for (let i = 0; i < taskkeysGlobal.length; i++) {
    const element = taskkeysGlobal[i];
    let key = element[indexHTML];
    await deleteOnFirebase(key);
  }
  changeSite('board.html');
}

/**
 * Deletes a task from Firebase using its unique key.
 * 
 * @param {string} taskkey - The unique key of the task to delete.
 * @async
 */
async function deleteOnFirebase(taskkey) {
  try {
    await fetch(`${BASE_URL}/tasks/${taskkey}.json`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Task successfully deleted.');
  } catch (error) {
    console.error('Error deleting task in Firebase:', error);
  }
}
