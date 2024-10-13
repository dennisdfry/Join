let arrayForSubtasks = [];
let isEditingSubtask = false;
let deliveryImage = [];


/**
 * Clears the placeholder of the task title input field during editing.
 *
 * @param {number} index - The index of the task being edited.
 */
function editTitle(index) {
  let position = document.getElementById(`inputEditTitle${index}`);
  position.value = "";
}


/**
 * Clears the placeholder of the task description input field during editing.
 *
 * @param {number} index - The index of the task being edited.
 */
function editDescription(index) {
  let position = document.getElementById(`descriptionEdit${index}`);
  position.value = "";
}


/**
 * Sets the background color for the task category during editing.
 *
 * @param {number} index - The index of the task being edited.
 * @param {string} category - The category of the task.
 */
function CategoryColorOpenEdit(index, category) {
  let position = document.getElementById(`categoryColorEdit${index}`);
  if (category == TechnicalTask) {
    position.style.backgroundColor = "#1fd7c1";
  } else {
    position.style.backgroundColor = "#0038ff";
  }
}


/**
 * Sets the due date input value during task editing.
 *
 * @param {number} index - The index of the task being edited.
 * @param {string} date - The due date of the task.
 */

function dueDateEditTask(index, dueDate) {
  let position = document.getElementById(`dueDateEdit${index}`);
  position.value = dueDate;
}


/**
 * Updates the subtask status array by converting a string of statuses into booleans.
 * 
 * This function takes a string of subtask statuses (comma-separated), splits it into an array, 
 * and converts the string values of 'true' and 'false' into actual boolean `true` or `false` values. 
 * It then updates the global `subtasksStatusArrayEdit` array with these boolean values.
 * 
 * @param {number} indexHTML - The index used for referencing a particular subtask group (not used directly in this function).
 * @param {string} subtaskStatus - A comma-separated string of subtask statuses ('true' or 'false').
 */

function subtaskUpdateEdit(indexHTML, subtaskStatus){
  subtasksStatusArrayEdit = subtaskStatus.split(',').map(subtaskStatus => subtaskStatus.trim());
  for (let index = 0; index < subtasksStatusArrayEdit.length; index++) {
    let element = subtasksStatusArrayEdit[index];
    if (element === 'false') {
      subtasksStatusArrayEdit[index] = false;  
    }
    if (element === 'true') {
      subtasksStatusArrayEdit[index] = true;  
    }
  }
}


/**
 * Deletes a subtask from the edit view and updates the displayed subtasks.
 *
 * @param {number} i - The index of the subtask to be deleted.
 * @param {number} indexHTML - The index of the main task being edited.
 * @param {string} subtask - The subtask to be deleted (not used in the function body).
 * @param {string} subtasksEditArrayOrigin - The original comma-separated list of subtasks.
 * 
 * @returns {void} This function does not return a value.
 */
function deleteSubtaskEdit(i, indexHTML, subtasks,  subtasksEditArrayOrigin) {
  let subtasksEditArrayDelete = subtasksEditArrayOrigin.split(',').map(subtasksEditArrayOrigin => subtasksEditArrayOrigin.trim());
  let position = document.getElementById(`supplementarySubtaskEdit${i}`);
  position.innerHTML = "";
  subtasksEditArrayDelete.splice([i], 1);
  subtasksStatusArrayEdit.splice([i], 1);
  subtasksRenderOpenEdit(indexHTML, subtasksEditArrayDelete);
  subtasksEditArrayDelete = [];
}


/**
 * Adds a new subtask to the edit view and updates the displayed subtasks.
 *
 * @param {number} index - The index of the main task being edited.
 * @param {string} subtasks - A comma-separated list of existing subtasks.
 * 
 * @returns {void} This function does not return a value.
 */
function addSubtaskEdit(index, subtasks) {
  let showSubtasksEdit = subtasks.split(',')
    .map(subtask => subtask.trim())
    .filter(subtask => subtask !== 'undefined' && subtask !== "");;
  let input = document.getElementById(`subtasksEdit${index}`);
  let newValue = input.value.trim();
  if (newValue !== "") {
    showSubtasksEdit.push(newValue);
  }
  input.value = "";
  subtasksStatusArrayEdit.push(false);
  resetSubtaskInputEdit(index);
  subtasksRenderOpenEdit(index, showSubtasksEdit);
}


/**
 * Renders the subtasks for editing in the specified HTML element.
 *
 * @param {number} indexHtml - The index of the main task being edited, used for identifying the correct HTML element.
 * @param {(string|Array<string>)} subtasks - The subtasks to render, either as a string (comma-separated) or an array of subtasks.
 */
function subtasksRenderOpenEdit(indexHtml, subtasks) {
  if(subtasks == 'undefined') return ;
  arrayForSubtasks = [];
  let subtasksEditArrayOrigin;
  if (Array.isArray(subtasks)) {
    subtasksEditArrayOrigin = subtasks;
  } else {
    subtasksEditArrayOrigin = subtasks.split(',').map(subtask => subtask.trim());
  }
  let position = document.getElementById(`subtasksPosition${indexHtml}`);
  position.innerHTML = "";
  for (let index = 0; index < subtasksEditArrayOrigin.length; index++) {
    let element = subtasksEditArrayOrigin[index];
    position.innerHTML += supplementarySubtaskEditHTML(element, index, indexHtml, subtasksEditArrayOrigin);
    arrayForSubtasks.push(element);
  }
}


/**
 * Filters the priority level of a task and calls the corresponding edit function with the associated ID.
 *
 * After determining the ID, it calls the `prioEdit` function with the appropriate ID.
 *
 * @param {string} prio - The priority level of the task. It can be "Low", "Medium", or "Urgent".
 *
 * @returns {void} - This function does not return a value.
 */
function prioFilter(prio){
  if(prio =='Low'){
    id = 3
  }else{
    if(prio == 'Medium'){
      id = 2
    }else{
      if(prio == 'Urgent'){
        id = 1
      }
    }
  }
  prioEdit(id);
}


/**
 * Sets the priority of the task during editing based on the selected priority button.
 *
 * @param {number} id - The ID of the priority button clicked.
 */
function prioEdit(id) {
  const buttons = document.querySelectorAll(".add-task-prio-button-container button");
  buttons.forEach((button) => {
    button.classList.remove("add-task-prio-button-urgent", "add-task-prio-button-medium", "add-task-prio-button-low");
    button.classList.add("add-task-prio-button");
  });
  let position = document.getElementById(`prioButtonEdit${id}`);
  prioIdCheckEdit(id, position);
  selectedPrioEdit = true;
}


/**
 * Checks the priority ID and updates the button style accordingly.
 *
 * @param {number} id - The ID of the priority.
 * @param {HTMLElement} position - The DOM element of the priority button.
 */
function prioIdCheckEdit(id, position) {
  if (id == 1) {
    prioArray.push("Urgent");
    position.classList.add("add-task-prio-button-urgent");
  } else if (id == 2) {
    prioArray.push("Medium");
    position.classList.add("add-task-prio-button-medium");
  } else if (id ==3) {
    prioArray.push("Low");
    position.classList.add("add-task-prio-button-low");
  }
  position.classList.remove("add-task-prio-button");
}


/**
 * Handles the Enter key press event to add a subtask.
 *
 * @param {KeyboardEvent} event - The keyboard event triggered by pressing a key.
 *
 * @returns {void} - This function does not return a value.
 */
function handleEditEnterKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    let activeElement = document.activeElement;
    let subtaskInput = document.getElementById(`addSubtaskEdit`);

    if (activeElement === subtaskInput) {
      addSubtaskEdit();
    } 
  }
}


/**
 * Saves the edited task data to Firebase.
 *
 * @param {string} position - The path to save the task data.
 * @async
 */
async function saveToFirebaseEdit(position) {
  let response = await fetch(BASE_URL + position + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addTaskArrayEdit),
  });
}


/**
 * Defines the task objects during editing and pushes them to the array for saving.
 *
 * @param {number} index - The index of the task being edited.
 * @param {string} category - The category of the task.
 */
function defineTaskObjectsEdit(index, category) {
  let taskTitle = document.getElementById(`inputEditTitle${index}`).value;
  let taskDescription = document.getElementById(`descriptionEdit${index}`).value;
  let dueDateTask = document.getElementById(`dueDateEdit${index}`).value;
  let lastString = prioArray.pop();
  let taskCategory = category;
  pushTaskObjectsToArrayEdit(taskTitle, taskDescription, dueDateTask, taskCategory, lastString);
}


/**
 * Pushes the defined task objects into the array for saving during task editing.
 *
 * @param {string} taskTitle - The title of the task.
 * @param {string} taskDescription - The description of the task.
 * @param {string} dueDateTask - The due date of the task.
 * @param {string} taskCategory - The category of the task.
 * @param {string} lastString - The last priority string value.
 */
function pushTaskObjectsToArrayEdit(taskTitle, taskDescription, dueDateTask, taskCategory, lastString) {
  addTaskArrayEdit.push({title: taskTitle,
    description: taskDescription,
    assignedTo: assignedToUserArray,
    assignedToNames: imageUrlsGlobal,
    dueDate: dueDateTask,
    prio: lastString,
    category: taskCategory,
    subtasks: arrayForSubtasks,
    subtaskStatus: subtasksStatusArrayEdit,
    boardCategory: "todo",});
}
