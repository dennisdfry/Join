async function initBoard() {
  try {
    let fireBaseData = await onloadData("/");
    let contacts = await fetchContacts(fireBaseData);
    let imageUrls = await fetchImages();
    await assignedToBoard(contacts, imageUrls);
    prio2(2);
    setTodayDateAddTaskBoard()

  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

/**
 * Enables editing mode for a specific subtask by updating its HTML content.
 * 
 * @param {number} index - The index of the subtask to edit.
 */
function editSubtask2(index) {
  let position = document.getElementById(`supplementarySubtask2${index}`);
  position.classList.remove('subtasks-edit');
  position.classList.add('subtasks-edit-input');
  let arrayPosition = subtasksArray[index];
  position.innerHTML = editSubtaskHTML2(index, arrayPosition);
}

/**
 * Saves the task data to Firebase.
 * @param {string} [path="/tasks"] - The path where the data will be saved in Firebase.
 * @returns {Promise<void>}
 */
async function saveToFirebase2(path = "/tasks") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addTaskArray),
  });
}

/**
 * Deletes a subtask and updates the UI accordingly.
 * 
 * @param {number} index - The index of the subtask to delete.
 */  
function deleteSubtask2(index) {
  let position = document.getElementById(`supplementarySubtask2${index}`);
  position.innerHTML = "";
  subtasksArray.splice([index], 1);
  updateSubtasksList2();
}

/**
 * Handles the submission of the task form, including validation and saving the task data to Firebase.
 * @param {Event} event - The form submit event.
 * @returns {Promise<void>}
 */
async function createTask2(event) {
  event.preventDefault();
  if (!validateFormAddTask(event.target)) return;
  if (!validatePriorityAddTask()) return;
  await defineTaskObjects2();
  await saveToFirebase2();
  resetUIAddTask2(event.target);
  changeSite("board.html");
}


/**
 * Extracts names from contacts and initializes the checkboxes for assigning users to tasks.
 * @param {object} contacts - The contacts object.
 * @param {string[]} imageUrls - An array of image URLs for the contacts.
 * @returns {Promise<void>}
 */
async function assignedToBoard(contacts, imageUrls) {
  try {
    const extractNames = (contacts) => {
      return Object.values(contacts).map((entry) => ({ name: entry.name }));
    };
    const names = extractNames(contacts);
    await checkboxInit2(names, imageUrls);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Renders checkboxes with contact images and names for assigning users to tasks.
 * @param {object[]} names - An array of contact names.
 * @param {string[]} imageUrls - An array of image URLs for the contacts.
 */
async function checkboxInit2(names, imageUrls) {
  let position = document.getElementById("checkboxes2");
  position.innerHTML = "";

  let list = "";
  for (let index = 0; index < names.length; index++) {
    const element = names[index].name;
    const imgSrc = imageUrls[index];
    list += checkBoxRender2(index, imgSrc, element);
  }
  position.innerHTML = list;
}  

/**
 * Returns a string of HTML to render a checkbox with an image and name.
 * @param {number} index - The index of the checkbox.
 * @param {string} imgSrc - The URL of the image.
 * @param {string} element - The name associated with the checkbox.
 * @returns {string} - The HTML string for the checkbox.
 */
function checkBoxRender2(index, imgSrc, element) {
  return `
    <label class="checkBoxFlex" for="checkbox2-${index}" id="checkboxColor2${index}">
        <div class="checkBoxImg">
            <img id="assignedToUserImageBorde2${index}" src="${imgSrc}" alt="" />
            ${element}
        </div>
        <input class="assignedToUserCheckbox img-24" type="checkbox" id="checkbox2-${index}" value="${element}" onclick="assignedToUser2('${index}','${element}','${imgSrc}')" />
    </label>`;
}

  /**
 * Updates the arrays that store the indices and names of users assigned to the task.
 * @param {number} index - The index of the user.
 * @param {string} element - The name of the user.
 */
  async function assignedToUser2(index, element, imgSrc) {
    const image = imageUrlsGlobal[index];
    const arrayIndex = assignedToUserArray.indexOf(index);
    if (arrayIndex !== -1) {
      assignedToUserArray.splice(arrayIndex, 1);
      assignedToUserArrayNamesGlobal.splice(arrayIndex, 1);
      imageUrlsGlobal.splice(arrayIndex, 1);
      assignedtoUserHighlightRemove2(index);
    } else {
      assignedToUserArray.push(index);
      assignedToUserArrayNamesGlobal.push(element);
      imageUrlsGlobal.push(imgSrc);
      assignedtoUserHighlightAdd2(index);
    }
  }

/**
 * Adds highlight to the user's assigned checkbox and image.
 * 
 * @param {number} index - The index of the user element.
 */
function assignedtoUserHighlightAdd2(index) {
  let position = document.getElementById(`checkboxColor2${index}`);
  let positionOfImage = document.getElementById(`assignedToUserImageBorde2${index}`)
  positionOfImage.classList.add('assignedToUserImage');
  position.style.backgroundColor = '#2a3647';
  position.style.color = '#ffffff';
}

/**
 * Removes highlight from the user's assigned checkbox and image.
 * 
 * @param {number} index - The index of the user element.
 */
function assignedtoUserHighlightRemove2(index) {
  let position = document.getElementById(`checkboxColor2${index}`);
  let positionOfImage = document.getElementById(`assignedToUserImageBorde2${index}`)
  positionOfImage.classList.remove('assignedToUserImage');
  position.style.backgroundColor = '#ffffff';
  position.style.color = '#2a3647';
}




/**
 * Toggles the visibility of the checkbox dropdown.
 */
function showCheckboxes2(event) {
  let checkboxes = document.getElementById("checkboxes2");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
    checkbox2ClickHandler();
  }
  event.stopPropagation();
}
  
/**
 * Attaches the document click handler to handle clicks outside the checkboxes.
 */
function checkbox2ClickHandler() {
  document.onclick = handleAddTaskClick2;
}
  
/**
 * Handles document click events to toggle the visibility of the checkboxes.
 * 
 * @param {Event} event - The click event to handle.
 */
function handleAddTaskClick2(event) {
  let checkboxes = document.getElementById("checkboxes2");

  if (expanded && !document.querySelector('.multiselect2').contains(event.target)) {
    checkboxes.style.display = "none";
    expanded = false;
    showUserAdd2();
  }
}
  
  /**
 * Updates the user interface to show selected users in the dropdown.
 */
function showUserAdd2() {
  let position = document.getElementById('userImageShow2');
  position.innerHTML = '';
  for (let index = 0; index < imageUrlsGlobal.length; index++) {
    const element = imageUrlsGlobal[index];
    if (index > 3) {
      const remaining = imageUrlsGlobal.length - 4;
      position.innerHTML += `
        <div class="img-32 more-users">
          +${remaining}
        </div>`;
      break;
    }
    position.innerHTML += `<img class="img-32" src="${element}" alt="" />`;
  }
}


  
 /**
 * Resets the internal state of the form and clears stored data.
 */
function resetFormStateAddTask2() {
  addTaskArray = [];
  subtasksArray = [];
  assignedToUserArray = [];
  assignedToUserArrayNamesGlobal = [];
  selectedPrio = null;
  imageUrlsGlobal = [];
  subtasksArray = [];
  clearSubtasks2();
}



  /**
 * Resets the task form and UI elements.
 * 
 * @param {HTMLFormElement} form - The form element to reset.
 */
function resetUIAddTask2(form) {
  form.reset();
  resetFormStateAddTask2();
  let subtasksPosition = document.getElementById("subtasksPosition2");
  if (subtasksPosition) {
    subtasksPosition.innerHTML = "";
  }
}
  
/**
 * Gathers data from the form fields and prepares the task object to be saved.
 */
async function defineTaskObjects2() {
  let taskTitle = document.getElementById("title2").value;
  let taskDescription = document.getElementById("description2").value;
  let dueDateTask = document.getElementById("dueDate2").value;
  let taskCategory = document.getElementById("taskCategory2").value;
  let lastString = prioArray.pop();
  pushTaskObjectsToArray(taskTitle, taskDescription, dueDateTask, taskCategory, lastString);
}
  
  /**
   * Pushes task objects into the global task array.
   *
   * Creates a task object and adds it to addTaskArray.
   *
   * @param {string} taskTitle - The title of the task.
   * @param {string} taskDescription - The description of the task.
   * @param {string} dueDateTask - The due date of the task.
   * @param {string} taskCategory - The category of the task.
   * @param {string} lastString - The priority level of the task.
   */
  function pushTaskObjectsToArray2(
    taskTitle,
    taskDescription,
    dueDateTask,
    taskCategory,
    lastString
  ) {
    addTaskArray.push({
      title: taskTitle,
      description: taskDescription,
      assignedTo: assignedToUserArray,
      assignedToNames: assignedToUserArrayNamesGlobal,
      dueDate: dueDateTask,
      prio: lastString,
      category: taskCategory,
      subtasks: subtasksArray,
      subtaskStatus: subtasksStatusArray,
      boardCategory: "todo",
    });
  }
  

  
  /**
   * Updates the priority button styling.
   *
   * Applies and removes priority classes from buttons based on the provided ID.
   *
   * @param {string} id - The ID of the button to update.
   */
  function prio2(id) {
    const buttons = document.querySelectorAll(".add-task-prio-button-container button");

    buttons.forEach((button) => {
      button.classList.remove("add-task-prio-button-urgent", "add-task-prio-button-medium", "add-task-prio-button-low");
      button.classList.add("add-task-prio-button");
    });
  
    let position = document.getElementById(`prio2Button${id}`);
    prioIdCheck2(id, position);
    selectedPrio = id;
  }
  
  /**
   * Updates the priority array and button styles based on the selected priority.
   * @param {number} id - The ID of the selected priority button.
   * @param {HTMLElement} position - The HTML element of the selected button.
   */
  function prioIdCheck2(id, position) {
    if (id == 1) {
      prioArray.push("Urgent");
      position.classList.add("add-task-prio-button-urgent");
    } else if (id == 2) {
      prioArray.push("Medium");
      position.classList.add("add-task-prio-button-medium");
    } else if (id == 3) {
      prioArray.push("Low");
      position.classList.add("add-task-prio-button-low");
    }
    position.classList.remove("add-task-prio-button");
  }
  
/**
 * Displays the controls for managing subtasks, updating the input field styles and controls.
 */  
function showSubtaskControls2() {
  document.getElementById("subtasks2").classList.remove("add-task-input");
  document.getElementById("subtasks2").classList.add("subtasks-input");
  let position = document.getElementById("subtasksControl2");
  position.innerHTML = 
        `<button onclick="resetSubtaskInput2()" type="button" class="subtask-button">
            <img class="img-24 " src="../public/img/closeAddTask.png" alt="Reset">
        </button>
        <div class="seperator-subtasks"></div>
        <button onclick="addSubtask2()" type="button" class="subtask-button">
            <img class="img-24 " src="../public/img/checkAddTask.png" alt="Add">
        </button>`;
}

/**
 * Adds a new subtask to the subtasks array if the input is not empty, then updates the UI.
 */
function addSubtask2() {
  let input = document.getElementById("subtasks2");
  if (input.value.trim() !== "") {
    subtasksArray.push(input.value.trim());
    input.value = "";
    subtasksStatusArray.push(false);
    updateSubtasksList2();
    resetSubtaskInput2();
  }
}

  
  /**
   * Resets the subtask input field and returns it to its initial state.
   */
  function resetSubtaskInput2() {
    let input = document.getElementById("subtasks2");
    input.value = "";
    document.getElementById("subtasks2").classList.add("add-task-input");
    document.getElementById("subtasks2").classList.remove("subtasks-input");
    let position = document.getElementById("subtasksControl2");
    position.innerHTML = `<button onclick="showSubtaskControls2()" type="button" id="subtasksPlus2" class="subtask-button">
                                  +
                              </button>`;
  }
  

  /**
   * Updates the displayed list of subtasks based on the current contents of the subtasksArray.
   */
  function updateSubtasksList2() {
    let subtasksPosition = document.getElementById("subtasksPosition2");
    if (subtasksPosition) {
      subtasksPosition.innerHTML = "";
      for (let index = 0; index < subtasksArray.length; index++) {
        const element = subtasksArray[index];
        subtasksPosition.innerHTML += `
               <li id="supplementarySubtask2${index}" class="d-flex-between subtasks-edit bradius8">
          <span>${element}</span>
          <div class="d-flex item-center">
              <img class="pointer img-24 p-4 " onclick="deleteSubtask2(${index})" src="../public/img/delete.png">
              <div class="seperator-subtasks"></div>
              <img class="pointer img-24 p-4 " onclick="editSubtask2(${index})" src="../public/img/edit.png">
          </div>
      </li>`;
      }
    }
  }



/**
* Generates and returns the HTML for the subtask editing mode.
* 
* @param {number} index - The index of the subtask.
* @param {string} arrayPosition - The current value of the subtask.
* @returns {string} - The HTML string for editing the subtask.
*/
function editSubtaskHTML2(index, arrayPosition){
  return  `
  <input class="inputAddTaskSubtasks fs-16" id="inputAddTaskSubtasks2${index}" required minlength="2" class="" value="${arrayPosition}">
  <div class="d-flex item-center">
      <img class="img-24 pointer p-4" onclick="deleteSubtask2(${index})" src="../public/img/delete.png">
      <div class="seperator-subtasks"></div>
      <img class="img-24 pointer p-4" onclick="validateAndFinish2(${index})" src="../public/img/checkAddTask.png" alt="Add">
  </div> `
}

 
  /**
   * Clears the list of displayed subtasks by resetting the innerHTML of the subtasksPosition element.
   */
  function clearSubtasks2() {
    let position = document.getElementById("subtasksPosition2");
    position.innerHTML = "";
    subtasksStatusArray = [];
  }

  /**
 * Validates the input length for the subtask and finishes editing if valid.
 * 
 * @param {number} index - The index of the subtask being edited.
 */
  function validateAndFinish2(index) {
    const input = document.getElementById(`inputAddTaskSubtasks2${index}`);
    if (input.value.length >= 2) {
      finishSubtask2(index);
    } 
  }
  
/**
 * Finishes editing a subtask and updates its value in the subtasks array.
 * 
 * @param {number} index - The index of the subtask being finished.
 */  
  function finishSubtask2(index) {
    let input = document.getElementById(`inputAddTaskSubtasks2${index}`);
    subtasksArray[index] = input.value;
    updateSubtasksList2();
  }

 


/**
 * Sets the current date as the default value for the due date input if it's empty.
 */
function setTodayDateAddTaskBoard() {
  const dateInput = document.getElementById('dueDate2');
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const maxDate = nextYear.toISOString().split('T')[0];
  dateInput.setAttribute('max', maxDate);
  if (!dateInput.value) {
    dateInput.value = today;
  }
}