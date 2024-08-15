/**
 * Reference to the Firebase Realtime Database.
 * @type {firebase.database.Database}
 */
var database = firebase.database();

/**
 * Reference to the "tasks" collection in the Firebase Realtime Database.
 * @type {firebase.database.Reference}
 */
var tasksRef = database.ref("tasks");

/**
 * Initializes the summary by setting the greeting and loading tasks to count categories.
 * @function
 */
function initSmry() {
  summaryGreeting();
  loadTasksAndCountCategories();
}

/**
 * Displays a personalized greeting based on the time of day and the user's status.
 * @async
 * @function
 */
async function summaryGreeting() {
  const hour = new Date().getHours();
  const greetingElement = document.querySelector(".summary-user-greeting");
  const greetingElementName = document.querySelector(".summary-user-greeting-name");
  const user = localStorage.getItem('user');

  if (greetingElement) {
    if (user === 'Guest') {
      greetingGuest(hour, greetingElement);
    } else {
      await greetingUser(hour, greetingElement, greetingElementName);
    }
  }
}

/**
 * Generates a greeting for a logged-in user based on the time of day.
 * Handles errors during the authentication check and greeting process.
 * @async
 * @function
 * @param {number} hour - The current hour of the day.
 * @param {HTMLElement} greetingElement - The HTML element to display the greeting.
 * @param {HTMLElement} greetingElementName - The HTML element to display the user's name.
 * @throws {Error} Throws an error if there is an issue during the authentication check or greeting.
 */
async function greetingUser(hour, greetingElement, greetingElementName) {
  let greetingMessage = "";
  if (hour > 6 && hour < 12) {
    greetingMessage = "Good morning,";
  } else if (hour >= 12 && hour < 18) {
    greetingMessage = "Good afternoon,";
  } else {
    greetingMessage = "Good evening,";
  }

  try {
    await checkAuthAndGreet(greetingMessage, greetingElement, greetingElementName);
  } catch (error) {
    console.error("Error during authentication check and greeting:", error);
  }
}


/**
 * Generates a greeting for a guest user based on the time of day.
 * @function
 * @param {number} hour - The current hour of the day.
 * @param {HTMLElement} greetingElement - The HTML element to display the greeting.
 */
function greetingGuest(hour, greetingElement) {
  let greetingMessage = "";
  if (hour > 6 && hour < 12) {
    greetingMessage = "Good morning";
  } else if (hour >= 12 && hour < 18) {
    greetingMessage = "Good afternoon";
  } else {
    greetingMessage = "Good evening";
  }

  greetingElement.textContent = greetingMessage;
}

/**
 * Checks user authentication status and updates the greeting with the user's name.
 * @async
 * @function
 * @param {string} greetingMessage - The greeting message based on the time of day.
 * @param {HTMLElement} greetingElement - The HTML element to display the greeting.
 * @param {HTMLElement} greetingElementName - The HTML element to display the user's name.
 */
async function checkAuthAndGreet(greetingMessage, greetingElement, greetingElementName) {
  const user = firebase.auth().currentUser;
  if (user) {
    const userId = user.uid;
    const userSnapshot = await database.ref("users/" + userId).once("value");
    const userData = userSnapshot.val();
    if (userData && userData.name) {
      greetingElement.textContent = `${greetingMessage}`;
      greetingElementName.textContent = `${userData.name}`;
    } else {
      greetingElement.textContent = greetingMessage;
    }
  } else {
    greetingElement.textContent = greetingMessage;
  }
}

/**
 * Loads tasks from the database.
 * @async
 * @function
 * @returns {Promise<Object>} The task data.
 */
async function loadTasks() {
  try {
    const taskSnapshot = await tasksRef.once("value");
    const taskData = taskSnapshot.val();
    return taskData;
  } catch (error) {
    console.error("Error loading task data", error);
  }
}

/**
 * Counts tasks in different categories by utilizing a helper function to iterate through tasks.
 * @function
 * @param {Object} taskData - The task data loaded from the database.
 * @returns {Object} An object containing the count of tasks in each category.
 * @see iterateTasks
 */
function countTasks(taskData) {
  const categoryCounts = {
    ToDo: 0,
    done: 0,
    progress: 0,
    feedback: 0,
  };

  iterateTasks(taskData, categoryCounts);

  return categoryCounts;
}

/**
 * Iterates over tasks and updates the counts for each category.
 * This function is used as a helper for the `countTasks` function.
 * @function
 * @param {Object} taskData - The task data loaded from the database.
 * @param {Object} categoryCounts - An object to store the count of tasks in each category.
 */
function iterateTasks(taskData, categoryCounts) {
  for (const taskId in taskData) {
    if (taskData.hasOwnProperty(taskId)) {
      const tasks = taskData[taskId];

      tasks.forEach((task) => {
        if (
          task.boardCategory &&
          categoryCounts.hasOwnProperty(task.boardCategory)
        ) {
          categoryCounts[task.boardCategory]++;
        }
      });
    }
  }
}

/**
 * Loads tasks and counts the number of tasks in each category.
 * @async
 * @function
 */
async function loadTasksAndCountCategories() {
  try {
    const taskData = await loadTasks();
    const categoryCounts = countTasks(taskData);

    updateCategoryCounts(categoryCounts);
  } catch (error) {
    console.error("Error loading tasks and counting categories:", error);
  }
}

/**
 * Updates the UI with the counts of tasks in each category.
 * @function
 * @param {Object} counts - An object containing the count of tasks in each category.
 */
function updateCategoryCounts(counts) {
  document.getElementById("smry-to-do-val").innerText = counts.ToDo || 0;
  document.getElementById("smry-done-val").innerText = counts.done || 0;
  document.getElementById("smry-progress-val").innerText = counts.progress || 0;
  document.getElementById("smry-feedback-val").innerText = counts.feedback || 0;

  const totalTasks = (counts.ToDo || 0) + (counts.done || 0) + (counts.progress || 0) + (counts.feedback || 0);

  document.getElementById("smry-board-val").innerText = totalTasks;
}

/**
 * Formats a given date string (YYYY-MM-DD) into German date format (DD. Month YYYY).
 * @param {string} dateStr - The date string in YYYY-MM-DD format.
 * @returns {string} The formatted date string in DD. Month YYYY format.
 */
function formatDateGerman(dateStr) {
  const months = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];

  const [year, month, day] = dateStr.split('-');
  const monthIndex = parseInt(month, 10) - 1; // Months are 1-based
  return `${parseInt(day, 10)}. ${months[monthIndex]} ${year}`;
}

/**
 * Finds the closest dueDate to the current date.
 * @param {Object} taskData - The task data loaded from the database.
 * @returns {string} The dueDate that is closest to the current date.
 */
function findClosestDueDate(taskData) {
  const now = new Date();
  let closestDate = null;
  let minDiff = Infinity;

  for (const taskId in taskData) {
    if (taskData.hasOwnProperty(taskId)) {
      const tasks = taskData[taskId];

      tasks.forEach((task) => {
        if (task.dueDate) {
          const taskDate = new Date(task.dueDate);
          const diff = Math.abs(taskDate - now);

          if (diff < minDiff) {
            minDiff = diff;
            closestDate = task.dueDate;
          }
        }
      });
    }
  }

  return closestDate ? formatDateGerman(closestDate) : "No due date available";
}

/**
 * Loads tasks and finds the closest due date.
 * @async
 * @function
 */
async function loadTasksAndFindClosestDueDate() {
  try {
    const taskData = await loadTasks();
    const closestDueDate = findClosestDueDate(taskData);

    // Update the span element with the closest due date
    const dateSpan = document.querySelector('.summary-tasks-mid-right-date');
    if (dateSpan) {
      dateSpan.innerHTML = closestDueDate;
    } else {
      console.error("Date span element not found.");
    }
  } catch (error) {
    console.error("Error loading tasks and finding closest due date:", error);
  }
}


/**
 * Initializes the summary when the DOM content is loaded.
 * @event DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", () => {
  initSmry();
  loadTasksAndFindClosestDueDate();
});
