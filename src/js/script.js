let subtasksLengthArray = [];
const taskData = {};
let taskkeys = [];
const taskkeysGlobal = [];
let task = {};
let currentDraggedElement;
let progressStatusTrue = [];
let TechnicalTask = "Technical Task";
let UserStory = "User Story";

async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let element of includeElements) {
    const file = element.getAttribute("w3-include-html");
    try {
      let sanitizedUrl = new URL(file, window.location.href);
      sanitizedUrl.username = "";
      sanitizedUrl.password = "";
      let resp = await fetch(sanitizedUrl);
      await whichChangeSite(resp, element, file);
    } catch (error) {
      console.error("Error fetching file:", file, error);
      element.innerHTML = "Error loading page";
    }
  }
}

async function whichChangeSite(resp, element, file) {
  if (resp.ok) {
    element.innerHTML = await resp.text();
    if (file.includes("addTask.html")) {
      init();
    }
    if (file.includes("contacts.html")) {
      initContacts();
    }
    if (file.includes("board.html")) {
      loadingBoard();
    }
    if (file.includes("summary.html")) {
      initSmry();
    }
  } else {
    element.innerHTML = "Page not found";
  }
}

async function changeSite(page) {
  document.querySelector(".main-content").setAttribute("w3-include-html", page);
  includeHTML();
}

document.addEventListener("DOMContentLoaded", () => {
  includeHTML();
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const mainContent = document.querySelector(".main-content");
    const currentPage = mainContent.getAttribute("w3-include-html");
    if (currentPage && currentPage.includes("summary.html")) {
      summaryGreeting();
    }
  }
});

function clearLocalStorage() {
  localStorage.removeItem("user");
}

function toggleElement(elementClass, className) {
  const element = document.querySelector(elementClass);
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
}

document.addEventListener("mousedown", (event) => {
  if (event.target.closest(".board-task-container")) {
    event.target.closest(".board-task-container").classList.add("rotate");
  }
});

document.addEventListener("mouseup", (event) => {
  if (event.target.closest(".board-task-container")) {
    event.target.closest(".board-task-container").classList.remove("rotate");
  }
});

document.addEventListener("mouseleave", (event) => {
  if (event.target.closest(".board-task-container")) {
    event.target.closest(".board-task-container").classList.remove("rotate");
  }
});

document.addEventListener("dragend", (event) => {
  if (event.target.closest(".board-task-container")) {
    event.target.closest(".board-task-container").classList.remove("rotate");
  }
});

function updateStatusMessages() {
  const containers = document.querySelectorAll(
    ".board-render-status-container"
  );

  containers.forEach((container) => {
    const statusMessage = container.previousElementSibling;
    const taskCount = container.children.length;

    if (taskCount > 0) {
      statusMessage.classList.add("d-none");
    } else {
      statusMessage.classList.remove("d-none");
    }
  });
}

function hideDropdown() {
  const element = document.querySelector(".user-icon-dropdown");
  if (!element.classList.contains("d-none")) {
    element.classList.add("d-none");
  }
}

async function loadingBoard() {
  try {
    taskkeysGlobal.length = 0;
    task = await onloadDataBoard("/tasks");
    taskkeys = Object.keys(task);
    taskkeysGlobal.push(taskkeys);
    let fetchImage = await fetchImagesBoard("/");
    await generateHTMLObjects(taskkeys, task);
    await generateHTMLObjectsForUserPrioSubtasks(taskkeys, task, fetchImage);
    updateStatusMessages();
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

async function onloadDataBoard(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}

async function fetchImagesBoard(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  let contacts = responseToJson.contacts;
  let imageUrl = Object.values(contacts).map((contacts) => contacts.img);
  return imageUrl;
}

async function generateHTMLObjects(taskkeys, task) {
  for (let index = 0; index < taskkeys.length; index++) {
    const { category, description, dueDate, prio, title, boardCategory } =
      task[taskkeys[index]][0];
    await positionOfHTMLBlock(
      index,
      category,
      title,
      description,
      dueDate,
      prio,
      boardCategory
    );
  }
}

async function updateHTML() {
  const categories = ["todo", "progress", "feedback", "done"];

  for (const category of categories) {
    const container = document.getElementById(category);
    container.innerHTML = "";
  }

  try {
    await loadingBoard();
  } catch (error) {
    console.error("Fehler beim Aktualisieren der HTML-Inhalte:", error);
  }
}

function startDragging(taskkey) {
  currentDraggedElement = taskkey;
  console.log("Dragging element with taskkey:", currentDraggedElement);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function onDrop(event) {
  event.preventDefault();
  const newCategory = event.target.dataset.category;
  moveTo(newCategory);
}

async function moveTo(category) {
  if (currentDraggedElement) {
    task[currentDraggedElement]["boardCategory"] = category;

    await updateTaskInFirebase({
      id: currentDraggedElement,
      boardCategory: category,
    });

    await updateHTML();
  } else {
    console.error("No task is being dragged.");
  }
  updateStatusMessages();
}

async function updateTaskInFirebase(task) {
  try {
    await fetch(`${BASE_URL}/tasks/${task.id}/0.json`, {
      method: "PATCH",
      body: JSON.stringify({ boardCategory: task.boardCategory }),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating task in Firebase:", error);
  }
}

async function generateHTMLObjectsForUserPrioSubtasks(
  taskkeys,
  task,
  fetchImage
) {
  for (let index = 0; index < taskkeys.length; index++) {
    const tasksID = taskkeys[index];
    const taskFolder = task[tasksID];
    let users = taskFolder[0].assignedTo;
    let subtasks = taskFolder[0].subtasks;
    let prio = taskFolder[0].prio;
    let userNames = taskFolder[0].assignedToNames;
    taskData[index] = { users, userNames, prio, subtasks, fetchImage };
    await Promise.all([
      searchIndexUrl(index, users, fetchImage),
      searchprio(index, prio),
      subtasksRender(index, subtasks),
    ]);
    await progressBar(index);
  }
}

function limitTextTo50Chars(id) {
  const element = document.getElementById(id);
  const text = element.innerText;
  if (text.length > 50) {
    element.innerText = text.substring(0, 50) + "...";
  }
}

async function positionOfHTMLBlock(
  index,
  category,
  title,
  description,
  date,
  prio,
  boardCategory
) {
  setTaskColor(category);
  let position = document.getElementById(`${boardCategory}`);
  position.innerHTML += await window.htmlboard(
    index,
    category,
    title,
    description,
    date,
    prio
  );
  limitTextTo50Chars(`limitTextDesciption${index}`);
  CategoryColor(index, category);
}
function CategoryColor(index, category) {
  let position = document.getElementById(`categoryColor${index}`);
  if (category == TechnicalTask) {
    position.style.backgroundColor = "#1fd7c1";
  } else {
    position.style.backgroundColor = "#0038ff";
  }
}

async function searchprio(index, prio) {
  let position = document.getElementById(`prioPosition${index}`);
  position.innerHTML = "";
  if (prio == "Urgent") {
    position.innerHTML = `<img  src="../public/img/Prio alta.png" alt="">`;
  } else {
    if (prio == "Medium") {
      position.innerHTML = `<img  src="../public/img/prioOrange.png" alt="">`;
    } else {
      if (prio == "Low") {
        position.innerHTML = `<img src="../public/img/Prio baja.png" alt="">`;
      }
    }
  }
}

async function loadSubtaskStatus(indexHtml) {
  for (let index = 0; index < taskkeysGlobal.length; index++) {
    const element = taskkeysGlobal[index];
    const taskKeyId = element[indexHtml];
    let data = await onloadDataBoard(`/tasks/${taskKeyId}/0/subtaskStatus/`);
    if (data == null) {
      return;
    }
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      try {
        let checkbox = document.getElementById(`subtask-${indexHtml}-${i}`);
        if (element == true) {
          if (checkbox) {
            checkbox.checked = element;
          } else {
            console.error(
              `Checkbox mit ID subtask-${indexHtml}-${index} nicht gefunden.`
            );
          }
          checkbox.checked = data;
        }
      } catch (error) {
        console.error(
          `Fehler beim Laden des Status der Subtask-Checkbox ${index}: `,
          error
        );
      }
    }
  }
}

async function searchIndexUrl(index, users, fetchImage) {
  let position = document.getElementById(`userImageBoard${index}`);
  position.innerHTML = "";
  if (users == null) {
    return;
  }
  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    let imageUrl = fetchImage[element];
    position.innerHTML += await htmlBoardImage(imageUrl, index);
  }
  setTimeout(() => tileUserImage(index), 50);
}

function tileUserImage(index) {
  const container = document.getElementById(`userImageBoard${index}`);
  const images = container.getElementsByClassName("image-div");
  const containerWidth = 80;
  const imageWidth = 32;
  const imagelength = images.length;
  const totalImagesWidth = imageWidth * imagelength;
  const overlap =
    totalImagesWidth > containerWidth
      ? (totalImagesWidth - containerWidth) / (imagelength - 1)
      : 0;
  for (let i = 0; i < images.length; i++) {
    const imagePosition = images[i];
    imagePosition.style.position = "absolute";
    imagePosition.style.left = `${i * (imageWidth - overlap)}px`;
  }
}

async function subtaskStatus(indexHtml, index) {
  const checkbox = document.getElementById(`subtask-${indexHtml}-${index}`);
  const isChecked = checkbox.checked;
  await statusSubtaskSaveToFirebase(isChecked, indexHtml, index);
}

async function statusSubtaskSaveToFirebase(isChecked, indexHtml, index) {
  for (const taskKeyId of taskkeysGlobal.map((el) => el[indexHtml])) {
    const path = `/tasks/${taskKeyId}/0/subtaskStatus/${index}`;
    try {
      const response = await fetch(`${BASE_URL}${path}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isChecked),
      });
      if (!response.ok) {
        console.error(
          `Fehler beim Aktualisieren des Status der Subtask-Checkbox ${index}:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(
        `Fehler beim Speichern des Status der Subtask-Checkbox ${index}:`,
        error
      );
    }
  }
}

async function progressBar(indexHtml) {
  let progressBar = document.getElementById(`progressBar${indexHtml}`);
  let trueCount = 0;
  let totalCount = 0;
  for (let index = 0; index < taskkeysGlobal.length; index++) {
    const element = taskkeysGlobal[index];
    const taskKeyId = element[indexHtml];
    let data = await onloadDataBoard(`/tasks/${taskKeyId}/0/subtaskStatus/`);
    if (!data || data.length === 0) {
      continue;
    }
    totalCount += data.length;
    for (let i = 0; i < data.length; i++) {
      const statusID = data[i];
      if (statusID === true) {
        trueCount++;
        progressStatusTrue.push({ index: i, statusTrue: statusID });
      }
    }
  }
  if (totalCount > 0) {
    let progress = (trueCount / totalCount) * 100;
    progressBar.style.width = `${progress}%`;
  }
}

function openAddForm() {
  document.getElementById("add-task-form").classList.remove("vis-hidden");
  document.getElementById("add-task-form").classList.remove("d-none");
}

function closeAddForm() {
  let formField = document.getElementById("add-task-form");
  formField.classList.remove("d-none");
}

function prio2(id) {
  const buttons = document.querySelectorAll(
    ".add-task-prio-button-container button"
  );

  buttons.forEach((button) => {
    button.classList.remove(
      "add-task-prio-button-urgent",
      "add-task-prio-button-medium",
      "add-task-prio-button-low"
    );
    button.classList.add("add-task-prio-button");
  });
  let position = document.getElementById(`prio2Button${id}`);
  prioIdCheck(id, position);
}

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

function showSubtaskControls2() {
  document.getElementById("subtasks2").classList.remove("add-task-input");
  document.getElementById("subtask2").classList.add("subtasks-input");
  let position = document.getElementById("subtasksControl2");
  position.innerHTML = `<button onclick="resetSubtaskInput()" type="button" class="subtask-button">
                              <img src="../public/img/closeAddTask.png" alt="Reset">
                          </button>
                          <div class="seperator-subtasks"></div>
                          <button onclick="addSubtask()" type="button" class="subtask-button">
                              <img src="../public/img/checkAddTask.png" alt="Add">
                          </button>`;
}

function addSubtask2() {
  let input = document.getElementById("subtasks2");
  if (input.value.trim() !== "") {
    subtasksArray.push(input.value.trim());
    input.value = "";
    updateSubtasksList2();
    resetSubtaskInput2();
  }
}

async function saveToFirebase2(path = "/tasks") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addTaskArray),
  });
}

function clearSubtask2() {
  let position = document.getElementById("subtasksPosition");
  position.innerHTML = "";
}

async function createTask(event) {
  event.preventDefault();
  let form = event.target;
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  defineTaskObjects2();
  saveToFirebase2();
  form.reset();
  addTaskArray = [];
  clearSubtask2();
  await changeSite("board.html");
}

/**
 * Setzt die Hintergrundfarbe der Aufgaben basierend auf ihrer Kategorie.
 */
function setTaskColor() {
  const categoryColors = {
    "technical task": "#1FD7C1",
    "user story": "#0038FF",
  };
  let elements = document.querySelectorAll(".board-task-container h1");

  elements.forEach((element) => {
    let category = element.getAttribute("data-category")?.toLowerCase().trim();
    let taskColor = categoryColors[category];
    element.style.backgroundColor = taskColor;
  });
}

function searchTasks(query) {
  let lowerCaseQuery = query.toLowerCase();
  let minQueryLength = 3;

  if (lowerCaseQuery.length < minQueryLength) {
    resetTaskVisibility();
    return;
  }

  let taskContainers = document.querySelectorAll(
    ".board-render-status-container"
  );
  taskContainers.forEach((container) => {
    let tasks = container.querySelectorAll(".board-task-container");
    let taskFound = false;
    tasks.forEach((task) => {
      let taskTitleElement = task.querySelector(".task-title");
      if (taskTitleElement) {
        let taskTitle = taskTitleElement.textContent.toLowerCase();
        if (taskTitle.includes(lowerCaseQuery)) {
          task.style.display = "";
          taskFound = true;
        } else {
          task.style.display = "none";
        }
      } else {
        console.error("Element '.task-title' nicht gefunden.");
      }
    });
    container.style.display = taskFound ? "" : "none";
  });
}

function resetTaskVisibility() {
  let taskContainers = document.querySelectorAll(
    ".board-render-status-container"
  );
  taskContainers.forEach((container) => {
    let tasks = container.querySelectorAll(".board-task-container");
    tasks.forEach((task) => {
      task.style.display = "";
    });

    container.style.display = "";
  });
}
