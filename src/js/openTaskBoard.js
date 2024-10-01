
/**
 * Closes the open task view and navigates back to the main board.
 *
 * @param {Event} event - The event object associated with the close action.
 * @param {number} index - The index of the task.
 */
function closeOpenTask(event, indexHTML) {
  event.stopPropagation();
  let openPosition = document.getElementById("openTask");
  openPosition.classList.remove("modal-overlay");
  openPosition.style.animation = "moveOut 200ms ease-out forwards";
  setTimeout(() => {
    openPosition.classList.add("hidden", "d-none");
    openPosition.style.cssText =
      "visibility: hidden; transform: translateX(100vw)";
  }, 100);
}




// /**
//  * Updates the background color of the task's category label in the open task view.
//  *
//  * @param {number} index - The index of the task.
//  * @param {string} category - The category of the task.
//  */
// function CategoryColorOpen(index, category) {
//   let position = document.getElementById(`categoryColorOpen${index}`);
//   if (category == "TechnicalTask") {
//     position.style.backgroundColor = "#1fd7c1";
//   } else {
//     position.style.backgroundColor = "#0038ff";
//   }
// }



/**
 * Deletes a specific task from Firebase and updates the board view.
 *
 * @param {number} indexHTML - The index of the task in the HTML.
 * @async
 */
async function deleteTask(indexHTML) {
  for (let i = 0; i < taskkeysGlobal.length; i++) {
    const element = taskkeysGlobal[i];
    let key = element[indexHTML];
    await deleteOnFirebase(key);
  }
  changeSite("board.html");
}

/**
 * Deletes a task from Firebase using its unique key.
 *
 * @param {string} taskkey - The unique key of the task to delete.
 * @async
 */
async function deleteOnFirebase(taskkey) {
  try {
    await fetch(`${BASE_URL}/tasks/${taskkey}.json`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
   // console.log("Task successfully deleted.");
  } catch (error) {
    console.error("Error deleting task in Firebase:", error);
  }
}


/**
 * Enables the Enter key to trigger the edit button click.
 */
function enableEnterKeyEdit(index) {
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      let activeElement = document.activeElement;
      let subtaskInputEdit = document.getElementById(`subtasksEdit${index}`);

      if (activeElement === subtaskInputEdit) {
        addSubtaskEdit(index);
      } else {
        let editButton = document.getElementById("edit-Add-Btn");
        if (editButton) {
          editButton.click();
        }
      }
    }
  });
}


/**
 * Verarbeitet das Absenden des Formulars, aktualisiert die Taskdaten und speichert sie in Firebase.
 *
 * @param {Event} event - Das Ereignis des Formularabsendens.
 * @param {number} index - Der Index der Aufgabe, die bearbeitet wird.
 * @param {string} category - Die Kategorie der Aufgabe.
 */
function handleFormSubmitEdit(event, index, category) {
  event.preventDefault();
  if (isSaving || !event.target.checkValidity() || !selectedPrioEdit) {
    if (!selectedPrioEdit) alert("Bitte wähle eine Priorität aus.");
    event.target.reportValidity();
    return;
  }
  isSaving = true;
  updateTaskBoard(index, category)
    //.then(() => console.log("Task erfolgreich aktualisiert."))//
    .catch(error => console.error("Fehler beim Speichern der Aufgabe:", error))
    .finally(() => isSaving = false);
}

/**
 * Opens the task in edit mode and renders the task details for editing.
 *
 * @param {number} index - The index of the task being edited.
 * @param {string} category - The category of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} date - The due date of the task.
 * @param {string} prio - The priority of the task.
 * @async
 */

// async function editOpenTask(index, category, title, description, date, prio) {
//   let position = document.getElementById("openTask");
//   position.innerHTML = "";
//   position.innerHTML = await window.editTaskHtml(index, category, title, description, date, prio);
//   dueDateEditTask(index, date);
//   initEdit(index);
//   checkboxIndexFalse(index);
//   subtasksRenderEdit(index);
//   CategoryColorEdit(index, category);
//   enableEnterKeyEdit(index);
//   userImageRenderEdit(index);
// }

/**
 * Closes the task edit modal and resets the form state.
 * 
 * @param {Event} event - The event object.
 * @param {number} index - The index of the task being edited.
 */
function closeOpenTaskEdit(event, index) {
  event.stopPropagation();
  let openPosition = document.getElementById("openTask");
  openPosition.classList.remove("modal-overlay");
  openPosition.classList.add("d-none");
  openPosition.innerHTML = "";
  resetFormStateEdit();
}


