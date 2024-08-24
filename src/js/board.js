let todos = [];
let currentDraggedElement;

async function loadTasksFromFirebase() {
  try {
      let tasks = await onloadDataBoard("/tasks");
      let taskKeys = Object.keys(tasks);
      
      todos = taskKeys.map(key => {
          let taskData = tasks[key][0];
          return {
              id: key,
              title: taskData.title,
              boardCategory: taskData.boardCategory || 'ToDo',
              description: taskData.description,
              dueDate: taskData.dueDate,
              prio: taskData.prio,
              category: taskData.category
          };
      });

      updateHTML();
  } catch (error) {
      console.error('Error loading tasks from Firebase:', error);
  }
}

function updateHTML() {
  ['todo', 'progress', 'feedback', 'done'].forEach(category => {
      document.getElementById(category).innerHTML = '';
      todos.filter(t => t.boardCategory.toLowerCase() === category).forEach(task => {
          document.getElementById(category).innerHTML += generateTodoHTML(task);
      });
  });
}

function generateTodoHTML(task) {
  return `
      <div draggable="true" ondragstart="startDragging(${task.id})" class="todo">
          ${task.title}
          <!-- Weitere Details, wie Beschreibung, DueDate, Prio etc. hier einfügen -->
      </div>`;
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function moveTo(category) {
  let task = todos.find(t => t.id == currentDraggedElement);
  if (task) {
      task.boardCategory = category.charAt(0).toUpperCase() + category.slice(1);
      await updateTaskInFirebase(task);
      updateHTML();
  }
}

async function updateTaskInFirebase(task) {
    try {
        await fetch(`${BASE_URL}/tasks/${task.id}/0.json`, {
            method: 'PATCH',
            body: JSON.stringify({ boardCategory: task.boardCategory }),
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating task in Firebase:', error);
    }
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}