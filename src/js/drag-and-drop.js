let cachedElement = null;


function startUp () {  
document.addEventListener("mousedown", handleRotateStart);
document.addEventListener("mouseup", handleRotateEnd);
document.addEventListener("mouseleave", handleRotateEnd);
document.addEventListener("dragend", handleRotateEnd);
document.addEventListener("touchstart", handleTouchStart, { passive: false });
document.addEventListener("touchmove", handleTouchMove, { passive: false });
document.addEventListener("touchend", handleTouchEnd);
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
 * Adds the "rotate" class to the closest ".board-task-container" element when touch starts.
 * 
 * @param {TouchEvent} event - The touch event object from the event listener.
 */
function handleTouchStart(event) {

  const targetElement = event.target.closest(".board-task-container");
  if (targetElement) {
    cachedElement = targetElement;
    cachedElement.classList.add("rotate");
    const taskkey = targetElement.getAttribute("data-taskkey");
    startDragging(taskkey);
  }
}

function handleTouchMove(event) {
  event.preventDefault();
}

function handleTouchEnd(event) {
  if (cachedElement) {
    cachedElement.classList.remove("rotate");
    cachedElement = null;
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

/**
 * Handles the touch end event.
 *
 * @param {TouchEvent} event - The touch event object from the event listener.
 */
function handleTouchEnd(event) {
  if (cachedElement) {
    cachedElement.classList.remove("rotate");
    cachedElement = null;
  }
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

document.addEventListener("DOMContentLoaded", startUp);