/**
 * Dynamically includes HTML content into elements with the `w3-include-html` attribute.
 * Fetches the content from the specified file and inserts it into the element.
 * Handles errors and displays an error message if the content cannot be loaded.
 * 
 * @async
 */
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

/**
 * Inserts the fetched HTML content into the element and initializes the page-specific logic.
 * Calls different initialization functions based on the file name.
 * 
 * @param {Response} resp - The response object returned by the fetch request.
 * @param {HTMLElement} element - The element where the fetched HTML content will be inserted.
 * @param {string} file - The name of the file being fetched.
 * @async
 */
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

/**
 * Changes the current page by dynamically loading a new HTML file into the main content area.
 * 
 * @param {string} page - The relative path to the new HTML file to be loaded.
 * @async
 */
async function changeSite(page) {
  document.querySelector(".main-content").setAttribute("w3-include-html", page);
  includeHTML();
}
  
  document.addEventListener("DOMContentLoaded", () => {
    includeHTML();
  });
  