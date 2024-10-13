let taskArrayBoard = [];
let titleBoard = [];
let descriptionBoard = [];
let imageUrlBoard = [];
let userNamesBoard = [];
let ToDoBoard = [];
let subtasksOpenArray = [];
let subtasksEditArrayFinish = [];
let subtasksEditArrayOrigin = [];
let assignedToUserArrayOpen = [];
let subtaskStatusArray = [];
let assignedToEditName = [];
let asiignedToEditUrl = [];
let showSubtasksEdit = [];
let subtasksStatusArrayEdit = [];
let subtasksEditArrayDelete = [];
let showSubtaskConrolFalse = false;
let subtasksControlGlobal = [];


async function generateHTMLObjectsBoard(taskkeys, task) {
  for (let index = 0; index < taskkeys.length; index++) {
    const { category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks, subtaskStatus } =
      task[taskkeys[index]][0];
    taskArrayBoard.push({
      title: title,
      description: description,
      dueDate: dueDate,
      category: category,
      prio: prio,
      boardCategory: boardCategory,
      assignedTo: assignedTo,
      subtasks: subtasks,
      subtaskStatus: subtaskStatus,
    });
  }
   upstreamHTMLrender();
}

/**
 * Generates HTML objects for the task board based on provided task keys and task data.
 *
 * @param {Array<string>} taskkeys - An array of keys representing tasks.
 * @param {Object} task - An object containing task details for each key.
 */
function upstreamHTMLrender() {
  document.getElementById("todo").innerHTML = "";
  document.getElementById("progress").innerHTML = "";
  document.getElementById("feedback").innerHTML = "";
  document.getElementById("done").innerHTML = "";

  for (let index = 0; index < taskArrayBoard.length; index++) {
      const element = taskArrayBoard[index];
      const { category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks, subtaskStatus } = element;

      positionOfHTMLBlockBoard(
          index,
          category,
          description,
          dueDate,
          prio,
          title,
          boardCategory,
          assignedTo,
          subtasks,
          subtaskStatus
      );
    searchIndexUrlBoard(index, assignedTo);
    searchprioBoard(index, prio);
    subtasksRenderBoard(index, subtasks);
    CategoryColor(index, category);
    progressBar(index, subtasks, subtaskStatus);
  }
}
  /**
 * Updates the user image display on the board for a specific task based on assigned users.
 *
 * @param {number} indexHTML - The index of the task in the HTML to display user images.
 * @param {Array<number>} assignedTo - An array of indices representing users assigned to the task.
 */
  function subtasksRenderBoard(indexHtml, subtasks) {
    let positionOfSubtasksLength = document.querySelector(`.subtasksLength${indexHtml}`);
    if (positionOfSubtasksLength) {
      if (Array.isArray(subtasks)) {
        positionOfSubtasksLength.innerHTML = `<p class="subtasks-board-task-text">${subtasks.length} Subtasks</p>`;
      } else {
        positionOfSubtasksLength.innerHTML = `<p class="subtasks-board-task-text">0 Subtasks</p>`;
      }
    }
  }
  
/**
 * Loads and updates the completion status of subtasks based on the provided status string.
 *
 * @param {number} indexHtml - The index of the HTML element associated with the subtasks.
 * @param {string} subtaskStatus - A comma-separated string representing the completion status of each subtask.
 */
function loadSubtaskStatus(indexHtml, subtaskStatus) {
  let subtaskStatusArrayDev = subtaskStatus.split(",").map((status) => status.trim());
  for (let i = 0; i < subtaskStatusArrayDev.length; i++) {
    let checkbox = document.getElementById(`subtask-${indexHtml}-${i}`);
    if (checkbox) {
      checkbox.checked = subtaskStatusArrayDev[i] === "true" || subtaskStatusArrayDev[i] === true;
    }
  }
}

/**
 * Saves the completion status of a subtask to Firebase based on the checkbox state.
 *
 * @param {number} indexHtml - The index of the HTML element associated with the subtask.
 * @param {number} index - The index of the subtask to update.
 * @returns {Promise<void>} - A promise that resolves when the status is saved.
 */
async function subtaskStatus(indexHtml, index) {
  let checkbox = document.getElementById(`subtask-${indexHtml}-${index}`);
  let isChecked = checkbox.checked;

  if (taskArrayBoard[indexHtml] && Array.isArray(taskArrayBoard[indexHtml].subtaskStatus)) {
    taskArrayBoard[indexHtml].subtaskStatus[index] = isChecked;
  }

 await statusSubtaskSaveToFirebase(isChecked, indexHtml, index).then(() => {
    let { subtasks, subtaskStatus } = taskArrayBoard[indexHtml];
    progressBar(indexHtml, subtasks, subtaskStatus);
  });
}