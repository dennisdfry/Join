var database = firebase.database();
var tasksRef = database.ref("tasks");

function initSmry() {
  summaryGreeting();
  updateTaskCounts();
}

async function summaryGreeting() {
  const hour = new Date().getHours();
  const greetingElement = document.querySelector(".summary-user-greeting");
  const greetingElementName = document.querySelector(
    ".summary-user-greeting-name"
  );
  if (greetingElement) {
    let greetingMessage = "";
    if (hour > 6 && hour < 12) {
      greetingMessage = "Good morning,";
    } else if (hour >= 12 && hour < 18) {
      greetingMessage = "Good afternoon,";
    } else {
      greetingMessage = "Good evening,";
    }
    try {
      await checkAuthAndGreet(
        greetingMessage,
        greetingElement,
        greetingElementName
      );
    } catch (error) {
      console.error("Error during authentication check and greeting:", error);
    }
  }
}

async function checkAuthAndGreet(
  greetingMessage,
  greetingElement,
  greetingElementName
) {
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

function updateTaskCounts() {
  tasksRef.on("value", function (snapshot) {
    var taskCount = snapshot.numChildren();
    var todoValElement = document.getElementById("smry-to-do-val");
    if (todoValElement) {
      todoValElement.innerText = taskCount;
    }
  });
}

async function loadTasks() {
  try {
    const taskSnapshot = await tasksRef.once("value");
    const taskData = taskSnapshot.val();

    console.log("Task data:", JSON.stringify(taskData));

    return taskData;
  } catch (error) {
    console.error("Error loading task data", error);
  }
}


function countTasks(taskData) {
  const categoryCounts = {
    ToDo: 0,
    Done: 0,
    Progress: 0,
    Feedback: 0
  };

  for (const taskId in taskData) {
    if (taskData.hasOwnProperty(taskId)) {
      const tasks = taskData[taskId];

      tasks.forEach(task => {
        if (task.boardCategory && categoryCounts.hasOwnProperty(task.boardCategory)) {
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

    console.log('Board Category Counts:', categoryCounts);

  } catch (error) {
    console.error('Error loading tasks and counting categories:', error);
  }
}

function updateCategoryCounts(counts) {
  document.getElementById('smry-to-do-val').innerText = counts.ToDo || 0;
  document.getElementById('smry-done-val').innerText = counts.Done || 0;
  document.getElementById('smry-progress-val').innerText = counts.Progress || 0;
  document.getElementById('smry-feedback-val').innerText = counts.Feedback || 0;
}

document.addEventListener("DOMContentLoaded", () => {
  initSmry();
});