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
  /**
   * Displays the controls for managing subtasks, updating the input field styles and controls.
   */
  function showSubtaskControls2() {
    document.getElementById("subtasks-board").classList.remove("add-task-input");
    document.getElementById("subtasks-board").classList.add("subtasks-input");
    let position = document.getElementById("subtasksControl2");
    position.innerHTML = `<button onclick="resetSubtaskInput2()" type="button" class="subtask-button2">
              <img class="img-24 " src="../public/img/closeAddTask.png" alt="Reset">
          </button>
          <div class="seperator-subtasks"></div>
          <button onclick="addSubtask2()" type="button" class="subtask-button2">
              <img class="img-24 " src="../public/img/checkAddTask.png" alt="Add">
          </button>`;
  }
  
  /**
   * Resets the subtask input field and returns it to its initial state.
   */
  function resetSubtaskInput2() {
    let input = document.getElementById("subtasks-board");
    input.value = "";
    document.getElementById("subtasks-board").classList.add("add-task-input");
    document.getElementById("subtasks-board").classList.remove("subtasks-input");
    let position = document.getElementById("subtasksControl2");
    position.innerHTML = `<button onclick="showSubtaskControls2()" type="button" id="subtasksPlus2" class="subtask-button2">
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
  function editSubtaskHTML2(index, arrayPosition) {
    return `
    <input class="inputAddTaskSubtasks fs-16" id="inputAddTaskSubtasks2${index}" required minlength="2" class="" value="${arrayPosition}">
    <div class="d-flex item-center">
        <img class="img-24 pointer p-4" onclick="deleteSubtask2(${index})" src="../public/img/delete.png">
        <div class="seperator-subtasks"></div>
        <img class="img-24 pointer p-4" onclick="validateAndFinish2(${index})" src="../public/img/checkAddTask.png" alt="Add">
    </div> `;
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
    const dateInput = document.getElementById("dueDate2");
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const maxDate = nextYear.toISOString().split("T")[0];
    dateInput.setAttribute("max", maxDate);
    if (!dateInput.value) {
      dateInput.value = today;
    }
  }

  /**
 * Adds a new subtask to the subtasks array if the input is not empty, then updates the UI.
 */
function addSubtask2() {
  let input = document.getElementById("subtasks-board");
  let inputValue = input.value.trim();

  if (inputValue !== "") {
    subtasksArray.push(inputValue);
    input.value = "";
    subtasksStatusArray.push(false);
    updateSubtasksList2();
    resetSubtaskInput2();
 }
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
 * Enables editing mode for a specific subtask by updating its HTML content.
 *
 * @param {number} index - The index of the subtask to edit.
 */
function editSubtask2(index) {
  let position = document.getElementById(`supplementarySubtask2${index}`);
  position.classList.remove("subtasks-edit");
  position.classList.add("subtasks-edit-input");
  let arrayPosition = subtasksArray[index];
  position.innerHTML = editSubtaskHTML2(index, arrayPosition);
}