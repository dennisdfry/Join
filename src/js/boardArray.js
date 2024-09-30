let taskArrayBoard = [];
let titleBoard = [];
let descriptionBoard =[];
let imageUrlBoard = [];
let userNamesBoard = [];

async function initDataBoard(){
    try {
        taskkeysGlobal.length = 0;
        task = await onloadDataBoard("/tasks");
        let fetchImageUrls = await fetchImagesUrlsBoardNew("/");
        let fetchUserNames = await fetchUserNamesBoardNew("/");
        console.log(fetchUserNames)
        for (let index = 0; index < fetchImageUrls.length; index++) {
            const elementUrl = fetchImageUrls[index];
            const elementNames = fetchUserNames[index].name;
            imageUrlBoard.push(elementUrl)
            userNamesBoard.push(elementNames)  
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
} catch (error) {
    console.error("Error loading tasks:", error);
  }
}

async function fetchImagesUrlsBoardNew(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    let contacts = responseToJson.contacts;
    let imageUrl = Object.values(contacts).map((contact) => contact.img);
    return imageUrl;
  }

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
  