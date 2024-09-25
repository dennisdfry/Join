function addSubtask() {
    let input = document.getElementById("subtasks");
    if (input.value.trim() !== "") {
      subtasksArray.push(input.value.trim());
      input.value = "";
      subtasksStatusArray.push(false);
      updateSubtasksList();
      resetSubtaskInput();
    }
  }
  
  /**
   * Resets the subtask input field and returns it to its initial state.
   */
  function resetSubtaskInput() {
    let input = document.getElementById("subtasks");
    input.value = "";
    document.getElementById("subtasks").classList.add("add-task-input");
    document.getElementById("subtasks").classList.remove("subtasks-input");
    let position = document.getElementById("subtasksControl");
    position.innerHTML = `<button onclick="showSubtaskControls()" type="button" id="subtasksPlus" class="add-task-button">
                                  +
                              </button>`;
  }
  
  /**
   * Updates the displayed list of subtasks based on the current contents of the subtasksArray.
   */
  function updateSubtasksList() {
    let subtasksPosition = document.getElementById("subtasksPosition");
    if (subtasksPosition) {
      subtasksPosition.innerHTML = "";
      for (let index = 0; index < subtasksArray.length; index++) {
        const element = subtasksArray[index];
        subtasksPosition.innerHTML += `
               <li id="supplementarySubtask${index}" class="d-flex-between subtasks-edit bradius8">
          <span>${element}</span>
          <div>
              <img class="pointer" onclick="deleteSubtask(${index})" src="../public/img/delete.png">
              <img class="pointer" onclick="editSubtask(${index})" src="../public/img/edit.png">
          </div>
      </li>`;
      }
    }
  }
  function editSubtask(index) {
    let position = document.getElementById(`supplementarySubtask${index}`);
    let arrayPosition = subtasksArray[index];
    position.innerHTML = `
        <input id="inputAddTaskSubtasks${index}" class="" value="${arrayPosition}">
        <div>
            <img class="img-24" onclick="deleteSubtask(${index})" src="../public/img/delete.png">
            <img class="img-24" onclick="finishSubtask(${index})" src="../public/img/checkAddTask.png" alt="Add">
        </div>`;
  }
  
  /**
   * Clears the list of displayed subtasks by resetting the innerHTML of the subtasksPosition element.
   */
  function clearSubtasks() {
    let position = document.getElementById("subtasksPosition");
    position.innerHTML = "";
    subtasksStatusArray = [];
  }
  
  function deleteSubtask(index) {
    let position = document.getElementById(`supplementarySubtask${index}`);
    position.innerHTML = "";
    subtasksArray.splice([index], 1);
    updateSubtasksList();
  }
  
  function finishSubtask(index) {
    let input = document.getElementById(`inputAddTaskSubtasks${index}`);
    subtasksArray[index] = input.value;
    updateSubtasksList();
  }

  function showSubtaskControls() {
    document.getElementById("subtasks").classList.remove("add-task-input");
    document.getElementById("subtasks").classList.add("subtasks-input");
    let position = document.getElementById("subtasksControl");
    position.innerHTML = 
          `<button onclick="resetSubtaskInput()" type="button" class="subtask-button">
              <img src="../public/img/closeAddTask.png" alt="Reset">
          </button>
          <div class="seperator-subtasks"></div>
          <button onclick="addSubtask()" type="button" class="subtask-button">
              <img src="../public/img/checkAddTask.png" alt="Add">
          </button>`;
  }