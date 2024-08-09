var database = firebase.database();
var tasksRef = database.ref("tasks");

function initSmry() {
  summaryGreeting();
  loadTasksAndCountCategories();
}

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
    await checkAuthAndGreet(greetingMessage, greetingElement, greetingElementName
    );
  } catch (error) {
    console.error("Error during authentication check and greeting:", error);
  }
}

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

async function loadTasks() {
  try {
    const taskSnapshot = await tasksRef.once("value");
    const taskData = taskSnapshot.val();

    return taskData;
  } catch (error) {
    console.error("Error loading task data", error);
  }
}

function countTasks(taskData) {
  const categoryCounts = {
    ToDo: 0,
    done: 0,
    progress: 0,
    feedback: 0,
  };

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

  return categoryCounts;
}

async function loadTasksAndCountCategories() {
  try {
    const taskData = await loadTasks();
    const categoryCounts = countTasks(taskData);

    updateCategoryCounts(categoryCounts);
  } catch (error) {
    console.error("Error loading tasks and counting categories:", error);
  }
}

function updateCategoryCounts(counts) {
  document.getElementById("smry-to-do-val").innerText = counts.ToDo || 0;
  document.getElementById("smry-done-val").innerText = counts.done || 0;
  document.getElementById("smry-progress-val").innerText = counts.progress || 0;
  document.getElementById("smry-feedback-val").innerText = counts.feedback || 0;
}

document.addEventListener("DOMContentLoaded", () => {
  initSmry();
});
