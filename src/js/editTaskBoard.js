
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



function EditTaskToBoardRender(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus) {
    let position = document.getElementById("openTask");
    position.innerHTML = "";
    position.innerHTML = editTaskHtml(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus);
    CategoryColorOpenEdit(index, category);
    subtasksRenderOpenEdit(index, subtasks);
    checkboxIndexFalse(index);
    dueDateEditTask(index, dueDate); 
}

function deleteSubtaskEdit(i, indexHTML, subtask, subtasksEditArrayOrigin) {
  let subtasksEditArrayDelete = subtasksEditArrayOrigin.split(',').map(subtasksEditArrayOrigin => subtasksEditArrayOrigin.trim());
  console.log(subtasksEditArrayOrigin)
  let position = document.getElementById(`supplementarySubtaskEdit${i}`);
  position.innerHTML = "";
  subtasksEditArrayDelete.splice([i], 1);
  console.log(subtasksEditArrayDelete)
  subtasksStatusArrayEdit.splice([i], 1);
  subtasksRenderOpenEdit(indexHTML, subtasksEditArrayDelete);
  subtasksEditArrayDelete = [];
}

function addSubtaskEdit(index, subtasks) {
  let showSubtasksEdit = subtasks.split(',').map(subtasks => subtasks.trim());
    console.log(showSubtasksEdit);
  let input = document.getElementById(`subtasksEdit${index}`);
  if (input.value.trim() !== "") {
    showSubtasksEdit.push(input.value.trim());
    console.log(showSubtasksEdit);
    input.value = "";
    subtasksStatusArrayEdit.push(false);
    resetSubtaskInputEdit(index);
    subtasksRenderOpenEdit(index, showSubtasksEdit);
    console.log(showSubtasksEdit);
  }
 console.log(showSubtasksEdit);
}
function supplementarySubtaskEditHTML(subtask, index, indexHTML, subtasksEditArrayOrigin) {
  return `
  <li id="supplementarySubtaskEdit${index}" class="d-flex-between subtasksEdit bradius8">
      <span>${subtask}</span>
      <div>
          <img class="pointer" onclick="deleteSubtaskEdit('${index}','${indexHTML}','${subtask}', '${subtasksEditArrayOrigin}')" src="../public/img/delete.png">
          <img class="pointer" onclick="editSubtaskEdit('${index}','${indexHTML}','${subtask}', '${subtasksEditArrayOrigin}')" src="../public/img/edit.png">
      </div>
  </li>`;
}


function subtasksRenderOpenEdit(indexHtml, subtasks) {
  console.log(subtasks)
  let subtasksEditArrayOrigin;
  if (Array.isArray(subtasks)) {
    subtasksEditArrayOrigin = subtasks;
    console.log(subtasksEditArrayOrigin);
  } else {
    subtasksEditArrayOrigin = subtasks.split(',').map(subtask => subtask.trim());
    console.log(subtasksEditArrayOrigin);
  }
  let position = document.getElementById(`subtasksPosition${indexHtml}`);
  position.innerHTML = "";
  for (let index = 0; index < subtasksEditArrayOrigin.length; index++) {
    const element = subtasksEditArrayOrigin[index];
    console.log(element);
    position.innerHTML += supplementarySubtaskEditHTML(element, index, indexHtml, subtasksEditArrayOrigin);
    console.log(subtasksEditArrayOrigin);
  }
 
}


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


function assignedToUserEdit(index, url, name) {
  assignedToUserEditNull = true;
  const arrayIndex = assignedToEditName.indexOf(name);
  if (arrayIndex !== -1) {
    assignedToEditName.splice(arrayIndex, 1);
    asiignedToEditUrl.splice(arrayIndex, 1);
  } else {
    assignedToEditName.push(name);
    asiignedToEditUrl.push(url);
  }
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
 * Toggles the visibility of the checkboxes for assigning users during task editing.
 *
 * @param {number} index - The index of the task being edited.
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
 * Adds a new subtask to the list of subtasks during task editing.
 * @param {number} index - The index of the task being edited.
 */


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
  subtasksArrayEdit = [];
  subtasksedit = [];
  usersEdit = [];
  fetchImagesEdit = [];
  assignedToUserEditNull = null;
  assignedToUserArrayEdit = [];
  assignedToUserArrayNamesGlobalEdit = [];
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
  if (assignedToUserEditNull == null) {
    assignedToUserArray = [];
    assignedToUserArrayNamesGlobal = [];
    assignedToUserArray = assignedToUserArrayEdit;
    assignedToUserArrayNamesGlobal = assignedToUserArrayNamesGlobalEdit;
  }
  addTaskArrayEdit.push({title: taskTitle,
    description: taskDescription,
    assignedTo: assignedToUserArray,
    assignedToNames: assignedToUserArrayNamesGlobal,
    dueDate: dueDateTask,
    prio: lastString,
    category: taskCategory,
    subtasks: subtasksArrayEdit,
    subtaskStatus: subtasksStatusArrayEdit,
    boardCategory: "todo",});
}

