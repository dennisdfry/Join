async function initBoard() {
  try {
    let fireBaseData = await onloadData("/");
    let contacts = await fetchContacts(fireBaseData);
    let imageUrls = await fetchImages();
    await assignedToBoard(contacts, imageUrls);
    prio(2);
    setTodayDateAddTask()

  } catch (error) {
    console.error("Error during initialization:", error);
  }
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
 * Toggles user assignment by adding or removing the user from the assigned list.
 * 
 * @param {number} index - The index of the user.
 * @param {string} element - The name of the user.
 * @param {string} imgSrc - The image URL of the user.
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
 * Adds a highlight to the assigned user's checkbox and image.
 * 
 * @param {number} index - The index of the user element.
 */
function assignedtoUserHighlightAdd2(index) {
  let position = document.getElementById(`checkboxColor${index}`);
  let positionOfImage = document.getElementById(`assignedToUserImageBorder${index}`)
  positionOfImage.classList.add('assignedToUserImage');
  position.style.backgroundColor = '#2a3647';
  position.style.color = '#ffffff';
}

/**
 * Removes the highlight from the assigned user's checkbox and image.
 * 
 * @param {number} index - The index of the user element.
 */
function assignedtoUserHighlightRemove2(index) {
  let position = document.getElementById(`checkboxColor${index}`);
  let positionOfImage = document.getElementById(`assignedToUserImageBorder${index}`)
  positionOfImage.classList.remove('assignedToUserImage');
  position.style.backgroundColor = '#ffffff';
  position.style.color = '#2a3647';
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
    return`
    <label class="checkBoxFlex" for="checkbox2-${index}" id="checkboxColor2${index}">
        <div class="checkBoxImg">
            <img id="assignedToUserImageBorder2${index}" src="${imgSrc}" alt="" />
            ${element}
        </div>
 <input class="assignedToUserCheckbox img-24" type="checkbox" id="checkbox2-${index}" value="${element}" onclick="assignedToUser2('${index}','${element}','${imgSrc}')" />      </label>`;
  }

  /**
   * Toggles the visibility of the "Assigned To" dropdown.
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
    document.onclick = handleDocumentClick;
  }
  
  /**
   * Handles document click events to toggle the visibility of the checkboxes.
   * 
   * @param {Event} event - The click event to handle.
   */
  function handleDocumentClick(event) {
    let checkboxes2 = document.getElementById("checkboxes2");
    let multiselect = document.getElementsByClassName('multiselect2');
  
    if (expanded && !Array.from(multiselect).some(element => element.contains(event.target))) {
      checkboxes2.style.display = "none";
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
      let element = imageUrlsGlobal[index];
      position.innerHTML += `<img class="img-32 p-4" src="${element}" alt="" />`;
    }
  }
  
  /**
   * Creates a new task based on form input.
   * 
   * Prevents default form submission, validates the form, and saves the task data.
   * 
   * @param {Event} event - The form submission event.
   */
  async function createTaskBoard(event) {
    event.preventDefault();
    let form = event.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return false;
    }
    defineTaskObjects2();
    await saveToFirebase2();
    form.reset();
    addTaskArray = [];
    clearSubtask2();
    imageUrlsGlobal = [];
    await changeSite("board.html");
  }
  
  /**
   * Resets the internal state of the form and clears stored data.
   */
  function resetFormState() {
    addTaskArray = [];
    subtasksArray = [];
    assignedToUserArray = [];
    assignedToUserArrayNamesGlobal = [];
    selectedPrio = null;
    clearSubtasks();
  }
  
  /**
   * Defines task objects for creation.
   *
   * Retrieves values from input fields and pushes them into the task array.
   */
  function defineTaskObjects2() {
    let taskTitle = document.getElementById("title2").value;
    let taskDescription = document.getElementById("description2").value;
    let dueDateTask = document.getElementById("dueDate2").value;
    let taskCategory = document.getElementById("taskCategory2").value;
    let lastString = prioArray.pop();
    pushTaskObjectsToArray2(
      taskTitle,
      taskDescription,
      dueDateTask,
      taskCategory,
      lastString
    );
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
   * Saves the current task data to Firebase.
   *
   * Sends a POST request to add tasks to the Firebase database.
   *
   * @param {string} [path="/tasks"] - The path to save the tasks.
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
   * Shows the subtask input controls when adding a new subtask.
   */
  function showSubtaskControls2() {
    document.getElementById("subtasks2").classList.remove("add-task-input");
    document.getElementById("subtasks2").classList.add("subtasks-input");
    let position = document.getElementById("subtasksControl2");
    position.innerHTML = 
          `<button onclick="resetSubtaskInput2()" type="button" class="subtask-button">
              <img src="../public/img/closeAddTask.png" alt="Reset">
          </button>
          <div class="seperator-subtasks"></div>
          <button onclick="addSubtask2()" type="button" class="subtask-button">
              <img src="../public/img/checkAddTask.png" alt="Add">
          </button>`;
  }
  
  /**
   * Adds a new subtask to the list.
   *
   * Retrieves the value from the input field and updates the subtasks list.
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
    position.innerHTML = `<button onclick="showSubtaskControls2()" type="button" id="subtasksPlus2" class="add-task-button-board">
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
        <div>
            <img class="pointer" onclick="deleteSubtask2(${index})" src="../public/img/delete.png">
            <img class="pointer" onclick="editSubtask2(${index})" src="../public/img/edit.png">
        </div>
    </li>`;
    }
  }
}

/**
 * Edits an existing subtask by replacing its content with an input field and action buttons.
 * 
 * @param {number} index - The index of the subtask to edit.
 */
function editSubtask2(index) {
  let position = document.getElementById(`supplementarySubtask2${index}`);
  let arrayPosition = subtasksArray[index];
  position.innerHTML = `
      <input id="inputAddTaskSubtasks2${index}" class="" value="${arrayPosition}">
      <div>
          <img class="img-24" onclick="deleteSubtask2(${index})" src="../public/img/delete.png">
          <img class="img-24" onclick="finishSubtask2(${index})" src="../public/img/checkAddTask.png" alt="Add">
      </div>`;
}
 
/**
 * Deletes a subtask and updates the UI by re-rendering the subtasks list.
 * 
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubtask2(index) {
  let position = document.getElementById(`supplementarySubtask2${index}`);
  position.innerHTML = "";
  subtasksArray.splice([index], 1);
  subtasksStatusArray.splice([index], 1);
  subtasksRender(index);
}
  
/**
  * Clears the subtasks display.
  *
  * Removes all HTML content from the subtasks position element.
  */
function clearSubtask2() {
  let position = document.getElementById("subtasksPosition2");
  position.innerHTML = "";
  subtasksStatusArray = [];
}

/**
 * Sets the current date as the default value for the due date input if it's empty.
 */
function setTodayDate() {
  const dateInput = document.getElementById('dueDate2');
  const today = new Date().toISOString().split('T')[0]; 
  if (!dateInput.value) { 
    dateInput.value = today;
  }
}