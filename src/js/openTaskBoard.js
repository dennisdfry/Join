async function searchprioOpenTask(index, prio){
    let position = document.getElementById(`prioPositionOpenTask${index}`);
    position.innerHTML = '';
    if(prio == 'Urgent'){
      position.innerHTML = `<img  src="../public/img/Prio alta.png" alt="">`;
    }else{
      if(prio == 'Medium'){
        position.innerHTML = `<img  src="../public/img/prioOrange.png" alt="">`;
      }else{
        if(prio == 'Low'){
          position.innerHTML = `<img src="../public/img/Prio baja.png" alt="">`;
        }
      }
    }
  }

 async function searchIndexUrlOpen(index, users, fetchImage, userNames){
    let position = document.getElementById(`userImageBoardOpen${index}`);
    position.innerHTML = '';
    if (!users || users.length === 0) {
      return;
    }
    for (let index = 0; index < users.length; index++) {
      const element = users[index];
      const names = userNames[index];
      let imageUrl = fetchImage[element];
      position.innerHTML += await htmlBoardImageOpen(imageUrl, index, names);
    }
  }

 async function htmlBoardImageOpen(imageUrl, index, names){
    return `
    <div class="d-flex pa-7-16">
      <img class="user-image-task-open" src="${imageUrl}">
      <div class="d-flex item-center font-sf fs-19 fw-400" >${names}</div>
    </div>  `;
  }

 function closeOpenTask(event, index) {
    event.stopPropagation();
    let openPosition = document.getElementById('openTask');
    openPosition.classList.remove('modal-overlay');
    openPosition.classList.add('d-none');
    openPosition.innerHTML = '';
  }

   async function subtasksRenderOpen (indexHtml, subtasks) {
    let position = document.getElementById(`subtasksBoardOpen${indexHtml}`);
    position.innerHTML = '';
    subtasksLengthArray.push({
        position: indexHtml,
        subs: subtasks});
    if (Array.isArray(subtasks)) {
      for (let index = 0; index < subtasks.length; index++) {
          const element = subtasks[index];
          position.innerHTML += `
              <div class="d-flex item-center pa-7-16">
                  <input onclick="subtaskStatus('${indexHtml}','${index}')" class="checkbox-open-Task" type="checkbox" id="subtask-${indexHtml}-${index}">
                  <label class="" for="subtask-${indexHtml}-${index}">${element}</label>
              </div>`;
      }}}

      async function openTaskToBoardRender(index, category, title, description, date, prio ) {
        let position = document.getElementById('openTask');
        if (position.classList.contains('modal-overlay')){
          return
        }else{
        position.classList.add('modal-overlay');
        position.classList.remove('d-none');
        position.innerHTML = openTaskToBoardHtml(index, category, title, description, date, prio);
      }
      promiseSecondInfoOpenTask(index);
      }
      
      async function promiseSecondInfoOpenTask  (index){
        let taskInfo = taskData[index];
        if (taskInfo) {
            let { users, userNames, prio, subtasks, fetchImage } = taskInfo;
            await subtasksRenderOpen(index, subtasks);
            await Promise.all([
              searchIndexUrlOpen(index, users, fetchImage, userNames),
              searchprio(index, prio),
              searchprioOpenTask(index, prio),
          ]);
          await loadSubtaskStatus(index);
          
      }else {
      console.error("Keine Daten für den angegebenen Index gefunden.");
      }}