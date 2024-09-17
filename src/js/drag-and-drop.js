document.addEventListener("mousedown", handleRotateStart);
document.addEventListener("mouseup", handleRotateEnd);
document.addEventListener("mouseleave", handleRotateEnd);
document.addEventListener("dragend", handleRotateEnd);

document.addEventListener("touchstart", handleRotateStart);
document.addEventListener("touchend", handleRotateEnd);
document.addEventListener("touchmove", handleTouchMove);

let cachedElement = null;
let isTouchDevice = false;
let touchOffsetX = 0;
let touchOffsetY = 0;

/**
 * Prevents the page from scrolling.
 * 
 * @param {Event} event - The touchmove event.
 */
function preventScroll(event) {
    event.preventDefault();
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
 * Starts the dragging process by setting the current dragged task's key.
 *
 * @param {string} taskkey - The unique key of the task being dragged.
 */
function startDragging(taskkey) {
  currentDraggedElement = taskkey;
  console.log("Dragging element with taskkey:", currentDraggedElement);
}

/**
 * Handles the start of a drag action, initializes the drag for both mouse and touch events.
 * 
 * @param {Event} event - The event object from the event listener.
 */
function handleRotateStart(event) {
    if (event.type === 'touchstart') {
      isTouchDevice = true;
      const touch = event.touches[0];
      cachedElement = event.target.closest(".board-task-container");
      
      if (cachedElement) {
        const rect = cachedElement.getBoundingClientRect();
        touchOffsetX = touch.clientX - rect.left;
        touchOffsetY = touch.clientY - rect.top;
        cachedElement.classList.add("rotate");
        currentDraggedElement = cachedElement;
        document.addEventListener("touchmove", preventScroll, { passive: false });
      }
    } else {
      cachedElement = event.target.closest(".board-task-container");
      if (cachedElement) {
        cachedElement.classList.add("rotate");
      }
    }
  }

/**
 * Ends the dragging action for both touch and mouse events.
 * 
 * @param {Event} event - The event object from the event listener.
 */
function handleRotateEnd(event) {
    if (currentDraggedElement) {
      currentDraggedElement.classList.remove("rotate");
      currentDraggedElement.style.position = '';
      currentDraggedElement = null;
    }
    cachedElement = null;
    document.removeEventListener("touchmove", preventScroll);
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
 * Handles the move during touch dragging, updates the element's position.
 * 
 * @param {TouchEvent} event - The touchmove event.
 */
function handleTouchMove(event) {
    if (currentDraggedElement && isTouchDevice) {
      const touch = event.touches[0];
      currentDraggedElement.style.position = 'absolute';
      currentDraggedElement.style.left = (touch.clientX - touchOffsetX) + 'px';
      currentDraggedElement.style.top = (touch.clientY - touchOffsetY) + 'px';
    }
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