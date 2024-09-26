
let cachedElement = null;
let offsetX = 0;
let offsetY = 0;
let currentDraggedTaskKey = null;

function startUp() {
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchend', handleTouchEnd);
  document.addEventListener('touchleave', handleTouchEnd);
  document.addEventListener("mousedown", handleRotateStart);
  document.addEventListener("mouseup", handleRotateEnd);
  document.addEventListener("mouseleave", handleRotateEnd);
  document.addEventListener("dragend", handleRotateEnd);
}

/**
 * Starts the dragging process by setting the current dragged task's key.
 *
 * @param {string} taskkey - The unique key of the task being dragged.
 */
function startDragging(taskkey) {
  currentDraggedElement = taskkey;
}

/**
 * Adds the "rotate" class to the closest ".board-task-container" element when dragging starts.
 * 
 * @param {Event} event - The event object from the event listener.
 */
function handleRotateStart(event) {
  event.preventDefault;
  cachedElement = event.target.closest(".board-task-container");
  if (cachedElement) {
    cachedElement.classList.add("rotate");
  }
}

/**
 * Removes the "rotate" class from the previously cached ".board-task-container" element.
 * 
 * @param {Event} event - The event object from the event listener.
 */
function handleRotateEnd(event) {
  if (cachedElement) {
    cachedElement.classList.remove("rotate");
    cachedElement = null;
  }
}



function startDraggingTouch (taskkey) { 
  currentDraggedTaskKey = taskkey;
}

/**
 * Handles the touch start event, initializes dragging.
 * 
 * @param {TouchEvent} event - The touch event object from the event listener.
 */
function handleTouchStart(event) {
  cachedElement = event.target.closest(".board-task-container");
  if (cachedElement) {
    let taskKey = cachedElement.dataset.taskkey;

    let touch = event.touches[0];
    let rect = cachedElement.getBoundingClientRect();
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    cachedElement.classList.add("rotate");
    startDragging(taskKey);
  }
}

/**
 * Handles the touch move event and moves the task along with the finger.
 * 
 * @param {TouchEvent} event - The touch event object from the event listener.
 */
function handleTouchMove(event) {
  event.preventDefault();
  if (cachedElement) {
    let touch = event.touches[0];
    let draggedOverElement = document.elementFromPoint(touch.clientX, touch.clientY);

    if (draggedOverElement && draggedOverElement.classList.contains("board-column")) {
      draggedOverElement.classList.add("drag-over");
      const newCategory = draggedOverElement.dataset.category;
      cachedElement.dataset.newCategory = newCategory;
    } else {
      document.querySelectorAll(".board-column").forEach(column => column.classList.remove("drag-over"));
    }

    cachedElement.style.position = 'absolute';
    cachedElement.style.zIndex = '1000';
    cachedElement.style.left = `${touch.clientX - offsetX}px`;
    cachedElement.style.top = `${touch.clientY - offsetY}px`;
  }
}


/**
 * Handles the touch end event and stops the dragging process.
 *
 * @param {TouchEvent} event - The touch event object from the event listener.
 */
function handleTouchEnd(event) {
  if (cachedElement) {
    cachedElement.classList.remove("rotate");
    cachedElement.style.position = '';
    cachedElement.style.zIndex = '';
    cachedElement.style.left = '';
    cachedElement.style.top = '';

    const newCategory = cachedElement.dataset.newCategory;
    if (newCategory && currentDraggedTaskKey) {
      moveToTouch(newCategory); 
    }

    cachedElement = null;
  }
}

async function moveToTouch(category) {
  if (currentDraggedTaskKey) {
    task[currentDraggedTaskKey]["boardCategory"] = category;

    await updateTaskInFirebase({
      id: currentDraggedTaskKey,
      boardCategory: category,
    });

    await updateHTML();
  } else {
    console.error("No task is being dragged.");
  }

  updateStatusMessages();
}



/**
 * Allows the dragged item to be dropped on a valid target by preventing the default behavior.
 *
 * @param {DragEvent} ev - The drag event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Handles the drop event by retrieving the target category and initiating the move.
 *
 * @param {DragEvent} event - The drop event.
 */
function onDrop(event) {
  event.preventDefault();
  const newCategory = event.target.dataset.category;
  moveTo(newCategory);
  moveToTouch(newCategory);
}

/**
 * Moves the dragged task to a new category and updates the task in Firebase.
 *
 * @param {string} category - The new category to move the task to.
 * @async
 */
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

/**
 * Updates the task's category in Firebase.
 *
 * @param {Object} task - The task object containing the ID and new category.
 * @param {string} task.id - The unique key of the task being updated.
 * @param {string} task.boardCategory - The new board category of the task.
 * @async
 */
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

document.addEventListener("DOMContentLoaded",startUp());