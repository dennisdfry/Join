

async function searchprioOpenTask(index, prio) {
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

//Renders the user images for a specific task in an open task view.
async function searchIndexUrlOpen(index, users, fetchImage, userNames) {
  let position = document.getElementById(`userImageBoardOpen${index}`);
  position.innerHTML = '';
  if (!users || users.length === 0) {
    return;
  }
  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    const names = userNames[index];
    let imageUrl = fetchImage[element];
    position.innerHTML += await htmlBoardImageOpen(imageUrl, index, names);
  }
}

// Generates the HTML structure for a user's image and name in an open task view.
async function htmlBoardImageOpen(imageUrl, index, names) {
  return `
    <div class="d-flex pa-7-16">
      <img class="user-image-task-open" src="${imageUrl}">
      <div class="d-flex item-center font-sf fs-19 fw-400" >${names}</div>
    </div>  `;
}

//Closes the open task view and returns to the main board
function closeOpenTask(event, index) {
  event.stopPropagation();
  let openPosition = document.getElementById('openTask');
  openPosition.classList.remove('modal-overlay');
  openPosition.classList.add('d-none');
  openPosition.innerHTML = '';
  changeSite('board.html');
}

//Renders the subtasks for a specific task in an open task view.
async function subtasksRenderOpen(indexHtml, subtasks) {
  let position = document.getElementById(`subtasksBoardOpen${indexHtml}`);
  position.innerHTML = '';
  subtasksLengthArray.push({
    position: indexHtml,
    subs: subtasks
  });
  if (Array.isArray(subtasks)) {
    for (let index = 0; index < subtasks.length; index++) {
      const element = subtasks[index];
      position.innerHTML += subtasksRenderOpenHtml(indexHtml, index, element);
    }
  }
}

//HTML block /Renders the subtasks for a specific task in an open task view.
function subtasksRenderOpenHtml(indexHtml, index, element){
  return `
              <div class="d-flex item-center pa-7-16">
                  <input onclick="subtaskStatus('${indexHtml}','${index}')" class="checkbox-open-Task" type="checkbox" id="subtask-${indexHtml}-${index}">
                  <label class="" for="subtask-${indexHtml}-${index}">${element}</label>
              </div>`;
}

//Opens and renders the detailed view of a task on the board.
async function openTaskToBoardRender(index, category, title, description, date, prio) {
  let position = document.getElementById('openTask');
  if (position.classList.contains('modal-overlay')) {
    return
  } else {
    position.classList.add('modal-overlay');
    position.classList.remove('d-none');
    position.innerHTML = openTaskToBoardHtml(index, category, title, description, date, prio);
  }
  promiseSecondInfoOpenTask(index);
}

//Fetches and renders additional task details (like subtasks, users, etc.) in the open task view.
async function promiseSecondInfoOpenTask(index) {
  let taskInfo = taskData[index];
  if (taskInfo) {
    let { users, userNames, prio, subtasks, fetchImage } = taskInfo;
    await subtasksRenderOpen(index, subtasks);
    await Promise.all([
      searchIndexUrlOpen(index, users, fetchImage, userNames),
      searchprio(index, prio),
      searchprioOpenTask(index, prio),
    ]);
    await loadSubtaskStatus(index);

  } else {
    console.error("Keine Daten für den angegebenen Index gefunden.");
  }
}

//Deletes a specific task from Firebase and updates the board.
async function deleteTask(indexHTML) {
  console.log(indexHTML);
  for (let index = 0; index < taskkeysGlobal.length; index++) {
    const element = taskkeysGlobal[index];
    console.log(element);
    let key = element[indexHTML];
    console.log(key);
    await deleteOnFirebase(key);
  }
  changeSite('board.html');

}

//Deletes a task from Firebase using its unique key.
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
