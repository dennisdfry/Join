let arrayForSubtasks = [];
let isEditingSubtask = false;
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
 * Renders the HTML for editing a task on the board.
 *
 * @param {number} index - The index of the task to be edited.
 * @param {string} category - The category of the task.
 * @param {string} description - The description of the task.
 * @param {string} dueDate - The due date of the task.
 * @param {string} prio - The priority level of the task.
 * @param {string} title - The title of the task.
 * @param {string} boardCategory - The category for the board.
 * @param {string} assignedTo - A comma-separated list of users assigned to the task.
 * @param {string} subtasks - A comma-separated list of subtasks.
 * @param {string} subtaskStatus - A comma-separated list of subtask statuses.
 * 
 * @returns {void} This function does not return a value.
 */
function EditTaskToBoardRender(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus) {
    let position = document.getElementById("openTask");
    position.innerHTML = "";
    position.innerHTML = editTaskHtml(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus);
    CategoryColorOpenEdit(index, category);
    subtasksRenderOpenEdit(index, subtasks);
    checkboxIndexFalse(index);
    dueDateEditTask(index, dueDate); 
    subtaskUpdateEdit(index, subtaskStatus)
    console.log(prio)
    prioFilter(prio);
}

function subtaskUpdateEdit(indexHTML, subtaskStatus){
  console.log(subtaskStatus);
  subtasksStatusArrayEdit = subtaskStatus.split(',').map(subtaskStatus => subtaskStatus.trim());
  console.log(subtasksStatusArrayEdit);
  for (let index = 0; index < subtasksStatusArrayEdit.length; index++) {
    let element = subtasksStatusArrayEdit[index];
    console.log(element)
    if (element === 'false') {
      subtasksStatusArrayEdit[index] = false;  
    }
    if (element === 'true') {
      subtasksStatusArrayEdit[index] = true;  
    }
    console.log(subtasksStatusArrayEdit)
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
function deleteSubtaskEdit(i, indexHTML, subtasksEditArrayOrigin) {
  console.log(subtasksEditArrayOrigin)
  let subtasksEditArrayDelete = subtasksEditArrayOrigin.split(',').map(subtasksEditArrayOrigin => subtasksEditArrayOrigin.trim());
  
  let position = document.getElementById(`supplementarySubtaskEdit${i}`);
  position.innerHTML = "";
  subtasksEditArrayDelete.splice([i], 1);
  console.log(subtasksEditArrayDelete)
  subtasksStatusArrayEdit.splice([i], 1);
  subtasksRenderOpenEdit(indexHTML, subtasksEditArrayDelete);
  console.log(subtasksStatusArrayEdit)
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
  console.log(subtasks);
  let showSubtasksEdit = subtasks.split(',')
    .map(subtask => subtask.trim())
    .filter(subtask => subtask !== 'undefined' && subtask !== "");
  console.log(showSubtasksEdit);
  let input = document.getElementById(`subtasksEdit${index}`);
  let newValue = input.value.trim();
  if (newValue !== "") {
    showSubtasksEdit.push(newValue);
  }
  console.log(showSubtasksEdit);
  input.value = "";
  subtasksStatusArrayEdit.push(false);
  resetSubtaskInputEdit(index);
  subtasksRenderOpenEdit(index, showSubtasksEdit);
  console.log(showSubtasksEdit);
  console.log(subtasksStatusArrayEdit);
}

/**
 * Generates the HTML for a supplementary subtask in the edit view.
 *
 * @param {string} subtask - The subtask to display.
 * @param {number} index - The index of the subtask in the list.
 * @param {number} indexHTML - The index of the main task being edited.
 * @param {string} subtasksEditArrayOrigin - The original array of subtasks in string format.
 * 
 * @returns {string} The generated HTML string for the subtask.
 */
function supplementarySubtaskEditHTML(subtask, index, indexHTML, subtasksEditArrayOrigin) {
  console.log(subtasksEditArrayOrigin);

  return `
  <li id="supplementarySubtaskEdit${index}" class="d-flex-between subtasks-edit bradius8">
      <span>
        ${subtask}
      </span>
      <div>
          <img class="pointer" onclick="deleteSubtaskEdit('${index}','${indexHTML}','${subtask}', '${subtasksEditArrayOrigin}')" src="../public/img/delete.png">
          <img class="pointer" onclick="editSubtaskEdit('${index}','${indexHTML}','${subtask}', '${subtasksEditArrayOrigin}')" src="../public/img/edit.png">
      </div>
  </li>`;
}


/**
 * Renders the subtasks for editing in the specified HTML element.
 *
 * @param {number} indexHtml - The index of the main task being edited, used for identifying the correct HTML element.
 * @param {(string|Array<string>)} subtasks - The subtasks to render, either as a string (comma-separated) or an array of subtasks.
 */
function subtasksRenderOpenEdit(indexHtml, subtasks) {
  console.log(subtasks);
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
    console.log(element);
    position.innerHTML += supplementarySubtaskEditHTML(element, index, indexHtml, subtasksEditArrayOrigin);
    arrayForSubtasks.push(element);
  }
  console.log(arrayForSubtasks);
}

/**
 * Initializes and renders a list of checkboxes for editing tasks.
 *
 * @param {Array<{name: string}>} names - An array of objects containing names for the checkboxes.
 * Each object should have a 'name' property that is a string.
 * @param {Array<string>} imageUrls - An array of image URLs corresponding to each checkbox.
 * @param {number} indexHTML - The index used to identify the target DOM element for rendering checkboxes.
 */
function checkboxInitEdit(names, imageUrls, indexHTML) {
  let position = document.getElementById(`checkboxesEdit${indexHTML}`);
  let list = "";
  for (let index = 0; index < names.length; index++) {
    const element = names[index].name;
    const imgSrc = imageUrls[index];
    list += checkBoxRenderEdit(index, imgSrc, element);
  }
  position.innerHTML = list;
}

/**
 * Toggles the assignment of a user to a task based on the provided index.
 *
 * @param {number} index - The index of the user in the global user list.
 * @param {string} element - The name of the user to be assigned or unassigned.
 * @param {string} imgSrc - The image source URL associated with the user.
 *
 * @async
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
async function assignedToUserEdit(index, element, imgSrc) {
  const image = imageUrlsGlobal[index];
  const arrayIndex = assignedToUserArray.indexOf(index);
  if (arrayIndex !== -1) {
    assignedToUserArray.splice(arrayIndex, 1);
    assignedToUserArrayNamesGlobal.splice(arrayIndex, 1);
    imageUrlsGlobal.splice(arrayIndex, 1);
    assignedtoUserHighlightRemoveEdit(index);
  } else {
    assignedToUserArray.push(index);
    assignedToUserArrayNamesGlobal.push(element);
    imageUrlsGlobal.push(imgSrc);
    assignedtoUserHighlightAddEdit(index);
  }
}

/**
 * Highlights the assigned user in the user interface by changing the styles of the associated elements.
 *
 * @param {number} index - The index of the user in the global user list, which is used to select 
 * the corresponding elements in the DOM.
 *
 * @returns {void} - This function does not return a value.
 */
function assignedtoUserHighlightAddEdit(index) {
  let position = document.getElementById(`checkboxColorEdit${index}`);
  let positionOfImage = document.getElementById(`assignedToUserImageBorderEdit${index}`)
  positionOfImage.classList.add('assignedToUserImage');
  position.style.backgroundColor = '#2a3647';
  position.style.color = '#ffffff';
}

/**
 * Removes the highlight effect from the assigned user in the user interface.
 *
 * @param {number} index - The index of the user in the global user list, which is used to select 
 * the corresponding elements in the DOM.
 *
 * @returns {void} - This function does not return a value.
 */
function assignedtoUserHighlightRemoveEdit(index) {
  let position = document.getElementById(`checkboxColor${index}`);
  let positionOfImage = document.getElementById(`assignedToUserImageBorderEdit${index}`)
  positionOfImage.classList.remove('assignedToUserImage');
  position.style.backgroundColor = '#ffffff';
  position.style.color = '#2a3647';
}

/**
 * Hides the checkboxes for assigning users to the task during editing.
 *
 * @param {number} index - The index of the task being edited.
 */
function checkboxIndexFalse(index) {
  let checkboxes = document.getElementById(`checkboxesEdit${index}`);
  checkboxes.style.display = "none";
  expandedEdit = false;
}

/**
 * Toggles the display of the user checkboxes for editing.
 * 
 * @param {number} indexHTML - The index used to identify the specific set of checkboxes to show or hide.
 *
 * @returns {void} - This function does not return a value.
 */
function showCheckboxesEdit(indexHTML) {
  let checkboxes = document.getElementById(`checkboxesEdit${indexHTML}`);
  if (!expandedEdit) {
    checkboxes.style.display = "block";
    expandedEdit = true;
    if (checkboxes.innerHTML.trim() === "") {
      for (let index = 0; index < userNamesBoard.length; index++) {
        const names = userNamesBoard[index];
        const urls = imageUrlBoard[index];
        checkboxes.innerHTML += checkBoxRenderEdit(index, names, urls);
      }
    }
  } else {
    checkboxes.style.display = "none";
    expandedEdit = false;
  }
}

function checkBoxRenderEdit(index, names, urls) {
  return `
    <label class="checkBoxFlex" for="checkbox-${index}" id="checkboxColorEdit${index}">
        <div class="checkBoxImg">
            <img id="assignedToUserImageBorderEdit${index}" src="${urls}" alt="" />
            ${names}
        </div>
        <input class="assignedToUserCheckbox img-24" type="checkbox" id="checkbox-${index}" value="${names}" onclick="assignedToUserEdit('${index}','${names}','${urls}')" />
    </label>`;
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
 * Updates the task board with edited task details and navigates to the board page.
 * 
 * @param {number} index - The index of the task being edited.
 * @param {string} category - The category of the task.
 * @async
 */
async function updateTaskBoard(index, category) {
  defineTaskObjectsEdit(index, category);
  let positionTask = `/tasks/${taskkeys[index]}`;
  await saveToFirebaseEdit(positionTask);
  resetFormStateEdit();
  changeSite("board.html");
}

/**
 * Resets the form state after editing a task.
 */
function resetFormStateEdit() {
  addTaskArrayEdit = [];
  selectedPrioEdit = null;
  assignedToUserArrayNamesGlobal = [];
  assignedToUserArray = [];
  subtasksArray = [];
  subtasksStatusArray = [];
  subtasksStatusArrayEdit = [];
  subtasksArrayEdit = [];
  subtasksedit = [];
  usersEdit = [];
  fetchImagesEdit = [];
  assignedToUserEditNull = null;
  assignedToUserArrayEdit = [];
  assignedToUserArrayNamesGlobalEdit = [];
  isEditingSubtask = false;
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
 console.log(taskTitle)
 console.log(taskDescription)
 console.log(dueDateTask)
 console.log(taskCategory)
 console.log(lastString)
 console.log(assignedToUserArray)
 console.log(assignedToUserArrayNamesGlobal)
 console.log(imageUrlsGlobal)
 console.log(arrayForSubtasks)
 console.log(subtasksStatusArrayEdit)
 console.log(arrayForSubtasks)
 
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
