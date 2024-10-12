
let currentDraggedElement;
/**
 * Clears and updates the HTML content of task categories on the board.
 * The function clears the content of predefined task categories and then
 * reloads the board data and updates the HTML content.
 *
 * @async
 */
async function updateHTML() {
  const categories = ["todo", "progress", "feedback", "done"];
  for (const category of categories) {
    const container = document.getElementById(category);
    container.innerHTML = "";
  }
  try {
    await initDataBoard();
  } catch (error) {
    console.error("Error updating HTML content:", error);
  }
}

/**
 * Filters tasks based on the search input.
 * Displays tasks that match the search query (starting from 3 characters).
 * If the input is cleared, all tasks are shown again.
 */
function searchTasks() {
  const searchInputElement = document.querySelector(".search-task-web");
  const searchInput = searchInputElement.value.toLowerCase();
  let allTasks = document.getElementsByTagName("div");
  for (let i = 0; i < allTasks.length; i++) {
    let task = allTasks[i];
    if (task.id.startsWith("parentContainer")) {
      let title = task.getElementsByTagName("h2")[0].innerHTML.toLowerCase();
      let discript = task.getElementsByTagName("p")[0].innerHTML.toLowerCase();
      if (searchInput.length < 3 || title.includes(searchInput) || discript.includes(searchInput)) {
        task.style.display = "block";
      } else {
        task.style.display = "none";
      }
    }
  }
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
  const formField = document.getElementById("add-task-form");
  const isClickInsideForm = formField.contains(event.target);

  if (!isClickInsideForm) {
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
    let subtaskInput = document.getElementById("subtasks2");
    if (activeElement === subtaskInput) {
      addSubtask2();
    }
  }
}


/**
 * Sets the background color of a category element based on the specified category.
 *
 * @param {number} index - The index of the category element to update.
 * @param {string} category - The category type (e.g., "TechnicalTask").
 */
function CategoryColor(index, category) {
  let position = document.getElementById(`categoryColor${index}`);
  if (category == TechnicalTask) {
    position.style.backgroundColor = "#1fd7c1";
  } else {
    position.style.backgroundColor = "#0038ff";
  }
}

/**
 * Updates the progress bar and displayed count of completed subtasks for a specific task.
 *
 * @param {number} index - The index of the task for which to update the progress bar.
 * @param {Array} subtasks - An array of subtasks associated with the task.
 * @param {Array} subtaskStatus - An array representing the completion status of each subtask.
 */
function progressBar(index, subtasks, subtaskStatus) {
  let progressBar = document.getElementById(`progressBar${index}`);
  let positionOfTrueAmount = document.getElementById(`subtasksAmountTrue${index}`);
  if (!subtasks || subtasks.length === 0) {
    positionOfTrueAmount.innerHTML = "0/0";
    progressBar.style.width = "0%";
    return;
  }
  let { trueCount, totalCount } = calculateProgress(index, subtasks, subtaskStatus);
  positionOfTrueAmount.innerHTML = `${trueCount}/${totalCount}`;
  let progressPercentage = (trueCount / totalCount) * 100;
  updateProgressBar(index, progressPercentage);
}

/**
 * Updates the progress bar width and color based on the percentage of completed subtasks.
 *
 * @param {number} indexHtml - The index of the task in the HTML structure.
 * @param {number} progressPercentage - The calculated percentage of completed subtasks.
 */
function updateProgressBar(index, progressPercentage) {
  let progressBar = document.getElementById(`progressBar${index}`);
  if (!progressBar) {
    console.error(`Element nicht gefunden: progressBar${index}`);
    return;
  }
  progressBar.style.width = `${progressPercentage}%`;
  if (progressPercentage === 100) {
    progressBar.style.backgroundColor = "#095a1b";
  } else {
    progressBar.style.backgroundColor = "";
  }
}

/**
 * Calculates the count of completed subtasks and the total number of subtasks for a given task.
 *
 * @param {number} index - The index of the task for which to calculate progress.
 * @param {Array} subtasks - An array of subtasks associated with the task.
 * @param {Array} subtaskStatus - An array representing the completion status of each subtask.
 * @returns {{ trueCount: number, totalCount: number }} - An object containing the counts of completed and total subtasks.
 */
function calculateProgress(index, subtasks, subtaskStatus) {
  let trueCount = 0;
  if (!Array.isArray(subtasks)) {
    console.warn(`Subtasks ist kein gültiges Array für Task ${index}`);
    return { trueCount: 0, totalCount: 0 };
  }
  let totalCount = subtasks.length;
  for (let i = 0; i < totalCount; i++) {
    if (subtaskStatus[i] === true || 0) {
      trueCount++;
    }
  }
  return { trueCount, totalCount };
}


