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
      subtasksRender(index, subtasks),
    ]);
    await progressBar(index);
  }
}

/**
 * Loads and updates the status of subtasks.
 *
 * Retrieves subtask statuses from Firebase and updates the corresponding checkboxes.
 *
 * @param {number} indexHtml - The index of the task in the HTML structure.
 */
// async function loadSubtaskStatus(indexHtml) {
//   for (let index = 0; index < taskkeysGlobal.length; index++) {
//     const element = taskkeysGlobal[index];
//     const taskKeyId = element[indexHtml];
//     let data = await onloadDataBoard(`/tasks/${taskKeyId}/0/subtaskStatus/`);
//     if (data == null) {
//       return;
//     }
//     for (let i = 0; i < data.length; i++) {
//       const element = data[i];
//       subtasksStatusArrayEdit.push(element);
//       try {
//         let checkbox = document.getElementById(`subtask-${indexHtml}-${i}`);
//         if (element === true && checkbox) {
//           checkbox.checked = element;
//         }
//       } catch (error) {
//         console.error(`Error loading status for subtask checkbox ${index}: `, error);
//       }
//     }
//   }
// }

/**
 * Updates the status of a subtask based on the checkbox state.
 *
 * Saves the checked status of the subtask to Firebase.
 *
 * @param {number} indexHtml - The index of the task in the HTML structure.
 * @param {number} index - The index of the subtask.
 */
// async function subtaskStatus(indexHtml, index) {
//   const checkbox = document.getElementById(`subtask-${indexHtml}-${index}`);
//   const isChecked = checkbox.checked;
//   await statusSubtaskSaveToFirebase(isChecked, indexHtml, index);
// }

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