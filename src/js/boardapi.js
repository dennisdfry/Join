async function initDataBoard() {
    taskArrayBoard = [];
    try {
      taskkeysGlobal.length = 0;
      task = await onloadDataBoard("/tasks");
      let fetchImageUrls = await fetchImagesUrlsBoardNew("/");
      let fetchUserNames = await fetchUserNamesBoardNew("/");
      for (let index = 0; index < fetchImageUrls.length; index++) {
        const elementUrl = fetchImageUrls[index];
        const elementNames = fetchUserNames[index].name;
        imageUrlBoard.push(elementUrl);
        userNamesBoard.push(elementNames);
      }
      if (!task || typeof task !== "object") {
        console.warn("No valid task data available.");
        return;
      }
      taskkeys = Object.keys(task);
      if (taskkeys.length === 0) {
        console.warn("No tasks found.");
        return;
      }
      taskkeysGlobal.push(taskkeys);
      await generateHTMLObjectsBoard(taskkeys, task);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  }
  
  /**
   * Loads data from the specified path and returns the parsed JSON response.
   *
   * @param {string} [path=""] - The path to the JSON data.
   * @returns {Promise<Object>} - A promise that resolves to the parsed JSON data.
   */
  async function onloadDataBoard(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    return responseToJson;
  }
  
  /**
   * Fetches image URLs from the contacts in the JSON data at the specified path.
   *
   * @param {string} [path=""] - The path to the JSON data.
   * @returns {Promise<string[]>} - A promise that resolves to an array of image URLs.
   */
  async function fetchImagesUrlsBoardNew(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    let contacts = responseToJson.contacts;
    let imageUrl = Object.values(contacts).map((contact) => contact.img);
    await assignedToBoard(contacts, imageUrl)
    return imageUrl;
  }
  
  /**
   * Fetches user names from the contacts in the JSON data at the specified path.
   *
   * @param {string} [path=""] - The path to the JSON data.
   * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing user names.
   */
  async function fetchUserNamesBoardNew(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    let contacts = responseToJson.contacts;
    try {
      const extractNamesBoard = (contacts) => {
        return Object.values(contacts).map((entry) => ({ name: entry.name }));
      };
      const names = extractNamesBoard(contacts);
      return names;
    } catch (error) {
      console.error(error);
    }
  }

  /**
 * Sets the background color of the category element based on the category type.
 *
 * @param {number} index - The index of the task.
 * @param {string} category - The category of the task.
 */
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
          console.error(`Error updating status of subtask checkbox ${index}:`, response.statusText);
        }
      } catch (error) {
        console.error(`Error saving status of subtask checkbox ${index}:`, error);
      }
    }
  }
  