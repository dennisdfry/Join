
/**
 * Generates and populates HTML objects for tasks, including user images, priority, and subtasks.
 * 
 * Iterates through task keys, fetching necessary data, and updates the HTML content for each task.
 * 
 * @param {Array<string>} taskkeys - Array of task IDs.
 * @param {Object} task - An object containing task data indexed by task IDs.
 * @param {Object} fetchImage - An object mapping user IDs to image URLs.
 */
async function generateHTMLObjectsForUserPrioSubtasks(taskkeys, task, fetchImage) {
  for (let index = 0; index < taskkeys.length; index++) {
    const tasksID = taskkeys[index];
    const taskFolder = task[tasksID];
    let users = taskFolder[0].assignedTo;
    let subtasks = taskFolder[0].subtasks;
    let prio = taskFolder[0].prio;
    let userNames = taskFolder[0].assignedToNames;
    taskData[index] = { users, userNames, prio, subtasks, fetchImage };
    await Promise.all([
      searchIndexUrl(index, users, fetchImage),
      searchprio(index, prio),
      subtasksRender(index, subtasks)
    ]);
   await progressBar(index);
  }
}

/**
 * Positions and sets the HTML content for a task block.
 * 
 * Updates the color, HTML content, and applies category-specific styling for the task.
 * 
 * @param {number} index - The index of the task.
 * @param {string} category - The category of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} date - The due date of the task.
 * @param {string} prio - The priority level of the task.
 * @param {string} boardCategory - The category of the board.
 */
async function positionOfHTMLBlock(index, category, title, description, date, prio, boardCategory) {
  setTaskColor(category);
  let position = document.getElementById(`${boardCategory}`);
  position.innerHTML += await window.htmlboard(index, category, title, description, date, prio);
  limitTextTo50Chars(`limitTextDesciption${index}`);
  CategoryColor(index, category);
}

/**
 * Updates the priority display for a task.
 * 
 * Sets the HTML content to show the priority level using appropriate images.
 * 
 * @param {number} index - The index of the task.
 * @param {string} prio - The priority level of the task.
 */
function searchprio(index, prio) {
  let position = document.getElementById(`prioPosition${index}`);
  position.innerHTML = "";
  if (prio === "Urgent") {
    position.innerHTML = `<img src="../public/img/Prio alta.png" alt="">`;
  } else if (prio === "Medium") {
    position.innerHTML = `<img src="../public/img/prioOrange.png" alt="">`;
  } else if (prio === "Low") {
    position.innerHTML = `<img src="../public/img/Prio baja.png" alt="">`;
  }
}

/**
 * Loads and updates the status of subtasks.
 * 
 * Retrieves subtask statuses from Firebase and updates the corresponding checkboxes.
 * 
 * @param {number} indexHtml - The index of the task in the HTML structure.
 */
async function loadSubtaskStatus(indexHtml) {
  for (let index = 0; index < taskkeysGlobal.length; index++) {
    const element = taskkeysGlobal[index];
    const taskKeyId = element[indexHtml];
    let data = await onloadDataBoard(`/tasks/${taskKeyId}/0/subtaskStatus/`);
    if (data == null) {
      return;
    }
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      subtasksStatusArrayEdit.push(element);
      try {
        let checkbox = document.getElementById(`subtask-${indexHtml}-${i}`);
        if (element === true && checkbox) {
          checkbox.checked = element;
        }
      } catch (error) {
        console.error(`Error loading status for subtask checkbox ${index}: `, error);
      }
    }
  }
}

/**
 * Updates the HTML content with user images for a task.
 * 
 * Displays images of users assigned to the task based on the provided URLs.
 * 
 * @param {number} index - The index of the task.
 * @param {Array<string>} users - Array of user IDs assigned to the task.
 * @param {Object} fetchImage - Object mapping user IDs to image URLs.
 */
// async function searchIndexUrl(indexHTML, users, fetchImage) {
//   let position = document.getElementById(`userImageBoard${indexHTML}`);
//   position.innerHTML = "";
//   if (users == null) {
//     return;
//   }
//   const userArray = users[indexHTML];
//   for (let index = 0; index < users.length; index++) {
//     let imageUrlNumber = users[index];
//     console.log(users)
//     let imageUrlPositionFromArray = imageUrlBoard[imageUrlNumber];
//      if (users.length > 3) {
//             const remaining = users.length - 4;
//             console.log(remaining)
//             position.innerHTML += `
//               <div class="img-48 more-users">
//                 +${remaining}
//               </div>`;
//             break;
//           }
//           position.innerHTML += `<img class="img-24" src="${imageUrlPositionFromArray}" alt="" />`;
//   }
// }
async function searchIndexUrl(indexHTML, users, fetchImage) {
  let position = document.getElementById(`userImageBoard${indexHTML}`);
  position.innerHTML = "";
  if (users == null) {
    return;
  }

  const userArray = users[indexHTML];
  // Bestimme die Anzahl der Bilder, die angezeigt werden sollen
  const maxImages = Math.min(users.length, 4);

  for (let index = 0; index < maxImages; index++) {
    let imageUrlNumber = users[index];
    console.log(users);
    let imageUrlPositionFromArray = imageUrlBoard[imageUrlNumber];
    position.innerHTML += `<img class="img-24" src="${imageUrlPositionFromArray}" alt="" />`;
  }

  // Wenn es mehr als 4 Nutzer gibt, füge das "+x" Overlay hinzu
  if (users.length > 4) {
    const remaining = users.length - 4;
    position.innerHTML += `
      <div class="img-24 more-users-board">
        +${remaining}
      </div>`;
  }
}

/**
 * Updates the status of a subtask based on the checkbox state.
 * 
 * Saves the checked status of the subtask to Firebase.
 * 
 * @param {number} indexHtml - The index of the task in the HTML structure.
 * @param {number} index - The index of the subtask.
 */
async function subtaskStatus(indexHtml, index) {
  const checkbox = document.getElementById(`subtask-${indexHtml}-${index}`);
  const isChecked = checkbox.checked;
  await statusSubtaskSaveToFirebase(isChecked, indexHtml, index);
}

/**
 * Saves the subtask status to Firebase.
 * 
 * Sends a PUT request to update the subtask status in Firebase.
 * 
 * @param {boolean} isChecked - The checked status of the subtask.
 * @param {number} indexHtml - The index of the task in the HTML structure.
 * @param {number} index - The index of the subtask.
 */
async function statusSubtaskSaveToFirebase(isChecked, indexHtml, index) {
  for (const taskKeyId of taskkeysGlobal.map((el) => el[indexHtml])) {
    const path = `/tasks/${taskKeyId}/0/subtaskStatus/${index}`;
    try {
      const response = await fetch(`${BASE_URL}${path}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isChecked),
      });
      if (!response.ok) {
        console.error(`Error updating status of subtask checkbox ${index}:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error saving status of subtask checkbox ${index}:`, error);
    }
  }
}


/**
 * Calculates the number of completed subtasks and the total number of subtasks.
 * 
 * @param {number} index - The index of the task.
 * @returns {Promise<{trueCount: number, totalCount: number}>} - An object containing the number of completed and total subtasks.
 */
async function calculateProgress(index) {
  let trueCount = 0, totalCount = 0;
  for (let i = 0; i < taskkeysGlobal.length; i++) {
    let taskKeyId = taskkeysGlobal[i][index];
    let data = await onloadDataBoard(`/tasks/${taskKeyId}/0/subtaskStatus/`);
    if (data) {
      totalCount += data.length;
      for (let j = 0; j < data.length; j++) {
        if (data[j]) { 
          trueCount++; 
          progressStatusTrue.push({ index: j, statusTrue: data[j] }); 
        }
      }
    }
  }
  return { trueCount, totalCount };
}

/**
 * Updates the progress bar width and color based on the percentage of completed subtasks.
 * 
 * @param {number} indexHtml - The index of the task in the HTML structure.
 * @param {number} progressPercentage - The calculated percentage of completed subtasks.
 */
function updateProgressBar(index, progressPercentage) {
  let progressBar = document.getElementById(`progressBar${index}`);
  if (!progressBar) {
    console.error(`Element nicht gefunden: progressBar${index}`);
    return;
  }
  progressBar.style.width = `${progressPercentage}%`;
  if (progressPercentage === 100) {
    progressBar.style.backgroundColor = '#095a1b';
  } else {
    progressBar.style.backgroundColor = '';
  }
}

/**
 * Updates the progress bar width and color based on the percentage of completed subtasks.
 * 
 * @param {number} indexHtml - The index of the task in the HTML structure.
 */
async function progressBar(index) {
  let progressBar = document.getElementById(`progressBar${index}`);
  let positionOfTrueAmount = document.getElementById(`subtasksAmountTrue${index}`);
  let { trueCount, totalCount } = await calculateProgress(index);
  
  if(totalCount == 0){
    document.getElementById(`hideProgressBar${index}`).classList.add('d-none');
    document.getElementById(`hideProgressAmount${index}`).classList.add('d-none');
    return
  }else{
  positionOfTrueAmount.innerHTML = `<div>${trueCount}/</div>`;
  if (totalCount > 0) {
    let progressPercentage = (trueCount / totalCount) * 100;
    updateProgressBar(index, progressPercentage);
  } else {
    updateProgressBar(index, 0);
  }}}
