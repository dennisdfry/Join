async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let element of includeElements) {
    const file = element.getAttribute("w3-include-html");
    try {
      let sanitizedUrl = new URL(file, window.location.href);
      sanitizedUrl.username = '';
      sanitizedUrl.password = '';
      let resp = await fetch(sanitizedUrl);
      if (resp.ok) {
        element.innerHTML = await resp.text();
        if (file.includes('addTask.html') || file.includes('contacts.html'))  {
          init();
        }
      } else {
        element.innerHTML = 'Page not found';
      }
    } catch (error) {
      console.error('Error fetching file:', file, error);
      element.innerHTML = 'Error loading page';
    }
  }
}

function changeSite(page) {
  document.querySelector('.main-content').setAttribute('w3-include-html', page);
  includeHTML();
}

document.addEventListener('DOMContentLoaded', () => {
  includeHTML();
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const mainContent = document.querySelector('.main-content');
    const currentPage = mainContent.getAttribute('w3-include-html');
    if (currentPage && currentPage.includes('summary.html')) {
      summaryGreeting();
    }
  }
});

function toggleElement(elementClass, className) {
  const element = document.querySelector(elementClass);
  if (element) {
    if (element.classList.contains(className)) {
      element.classList.remove(className);
    } else {
      element.classList.add(className);
    }
  } else {
    console.error(`Element with id "${elementId}" not found.`);
  }
}

async function loadingBoard() {
  try {
      let task = await onloadDataBoard("/tasks");
      let taskkeys = Object.keys(task);

      for (let index = 0; index < taskkeys.length; index++) {
          const element = taskkeys[index];
          const taskArray = task[element];
          let category = taskArray[0].category;
          let description = taskArray[0].description;
          let date = taskArray[0].dueDate;
          let prio = taskArray[0].prio;
          let title = taskArray[0].title;
          let users = taskArray[0].assignedTo;
          let subtasks = taskArray[0].subtasks;

          let position = document.getElementById('todo');
          if (position) {
              position.innerHTML += `
                  <div class="board-task-container">
                      <h1>${category}</h1>
                      <p>${description}</p>
                      <p>${date}</p>
                      <p>${prio}</p>
                      <p>${title}</p>
                      <p>${users}</p>
                      <p>${subtasks}</p>
                  </div>
              `;
              console.log(element);
              console.log(taskArray);
          } else {
              console.log(`Element mit ID 'todo${index}' nicht gefunden.`);
          }
      }

  } catch (error) {
      console.log("Fehler beim Laden:", error);
  }
}
async function onloadDataBoard(path="") {
    let response = await fetch(BASE_URL + path + '.json');
    let responseToJson = await response.json();
    return responseToJson;
}

// async function showTaskContent(task, taskkeys){

// }
