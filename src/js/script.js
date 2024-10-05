
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