
/**
 * Opens the form to add a new task.
 *
 * Removes the hidden and non-display classes from the add-task form to make it visible.
 */
function openAddForm() {
    document.getElementById("add-task-form").classList.remove("vis-hidden");
    document.getElementById("add-task-form").classList.remove("d-none");
    let overlay = document.getElementById("overlay-form");
    overlay.classList.remove("d-none");
    let formField = document.getElementById("add-task-form");
    formField.classList.remove("d-none", "hidden");
    formField.style.cssText =
      "visibility: visible; transform: translateX(100vw); animation: moveIn 200ms ease-in forwards";
    document.addEventListener("click", outsideClickHandler);
    document.addEventListener("keydown", handleEnterKey);
  }
  
  /**
   * Closes the form.
   *
   * Removes the non-display class from the add-task form, making it visible.
   */
  function closeAddForm() {
    document.getElementById("overlay-form").classList.add("d-none");
    let formField = document.getElementById("add-task-form");
    formField.classList.remove("d-none");
    formField.style.animation = "moveOut 200ms ease-out forwards";
  
    setTimeout(() => {
      formField.classList.add("hidden", "d-none");
      formField.style.cssText =
        "visibility: hidden; transform: translateX(100vw)";
    }, 100);
  
    document.removeEventListener("click", outsideClickHandler);
    document.removeEventListener("keydown", handleEnterKey);
  }
  
  
  /**
   * Handles outside click detection.
   *
   * This function listens for clicks outside the "add-task" form. If the click occurs
   * outside the form but within the overlay, it triggers the form to close.
   *
   * @param {Event} event - The click event.
   */
  function outsideClickHandler(event) {
    let formField = document.getElementById("add-task-form");
    let overlay = document.getElementById("overlay-form");
    if (!formField.contains(event.target) && overlay.contains(event.target)) {
      closeAddForm();
    }
  }
  
  /**
   * Handles the Enter key press event.
   *
   * This function listens for the Enter key being pressed. Depending on which element
   * is active (focused), it either adds a new subtask or submits the task by clicking
   * the corresponding button.
   *
   * @param {KeyboardEvent} event - The keyboard event for key press.
   */
  function handleEnterKey(event) {
    if (event.key === "Enter") {
      event.preventDefault(); 
      let activeElement = document.activeElement;
      let subtaskInput = document.getElementById('subtasks2');
  
      if (activeElement === subtaskInput) {
        addSubtask2();
      } else {
        let addButton = document.getElementById('add-task-button');
        if (addButton) {
          addButton.click();
        }
      }
    }
  }
  
  /**
   * Extracts names from contacts and initializes the checkboxes for assigning users to tasks.
   * @param {object} contacts - The contacts object.
   * @param {string[]} imageUrls - An array of image URLs for the contacts.
   * @returns {Promise<void>}
   */
  async function assignedTo2(contacts, imageUrls) {
    try {
      let names = Object.values(contacts).map(entry => ({ name: entry.name }));
      checkboxInit2(names, imageUrls);
    } catch (error) {
      console.error("Error assigning users:", error);
    }
  }
  
  /**
   * Renders checkboxes with contact images and names for assigning users to tasks.
   * @param {object[]} names - An array of contact names.
   * @param {string[]} imageUrls - An array of image URLs for the contacts.
   */
  function checkboxInit2(names, imageUrls) {
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
      <label class="checkBoxFlex" for="checkbox2-${index}">
          <div class="checkBoxImg">
              <img src="${imgSrc}" alt="" />
              ${element}
          </div>
          <input type="checkbox" id="checkbox2-${index}" value="${element}" onclick="assignedToUser2('${index}','${element}')" />
      </label>`;
  }
  
  /**
   * Updates the arrays that store the indices and names of users assigned to the task.
   * @param {number} index - The index of the user.
   * @param {string} element - The name of the user.
   */
  async function assignedToUser2(index, element) {
    const image = imageUrlsGlobal[index];
    const arrayIndex = assignedToUserArray.indexOf(index);
    if (arrayIndex !== -1) {
      assignedToUserArray.splice(arrayIndex, 1);
      assignedToUserArrayNamesGlobal.splice(arrayIndex, 1);
    } else {
      assignedToUserArray.push(index);
      assignedToUserArrayNamesGlobal.push(element);
    }
  }
  
  /**
   * Toggles the visibility of the "Assigned To" dropdown.
   */
  function showCheckboxes2() {
    let checkboxes = document.getElementById("checkboxes2");
    expanded = !expanded;
    checkboxes.style.display = expanded ? "block" : "none";
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
  
    buttons.forEach(button => button.className = "add-task-prio-button"); // Reset all buttons
  
    let position = document.getElementById(`prio2Button${id}`);
    const prioClasses = ["urgent", "medium", "low"];
    position.classList.add(`add-task-prio-button-${prioClasses[id - 1]}`);
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
          `<button onclick="resetSubtaskInput2()" type="button" class="subtask-button2">
              <img src="../public/img/closeAddTask.png" alt="Reset">
          </button>
          <div class="seperator-subtasks"></div>
          <button onclick="addSubtask2()" type="button" class="subtask-button2">
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
    document.getElementById("subtasks2").classList.remove("subtasks-input2");
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
    subtasksPosition.innerHTML = "";
    for (let index = 0; index < subtasksArray.length; index++) {
      const element = subtasksArray[index];
      subtasksPosition.innerHTML += `
              <ul>
                  <li>${element}</li>
              </ul>`;
    }
  }
  
  /**
   * Clears the subtasks display.
   *
   * Removes all HTML content from the subtasks position element.
   */
  function clearSubtask2() {
    let position = document.getElementById("subtasksPosition2");
    position.innerHTML = "";
  }