/**
 * Toggles a CSS class on an HTML element.
 * If the element has the specified class, it removes it; otherwise, it adds it.
 *
 * @param {string} elementClass - The CSS selector of the element to toggle.
 * @param {string} className - The class name to be toggled on the element.
 */
function toggleElement(elementClass, className) {
  const element = document.querySelector(elementClass);
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
}

/**
 * Updates the visibility of status messages based on the number of tasks in each container.
 * If a container has tasks, the corresponding status message is hidden;
 * if it has no tasks, the status message is shown.
 */
function updateStatusMessages() {
  const containers = document.querySelectorAll(".board-render-status-container");

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

/**
 * Hides the user icon dropdown menu by adding the "d-none" class.
 * This function checks if the dropdown is currently visible, and if so, hides it.
 */
function hideDropdown() {
  const element = document.querySelector(".user-icon-dropdown");
  if (!element.classList.contains("d-none")) {
    element.classList.add("d-none");
  }
}
