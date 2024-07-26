function currentDate() {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date().toLocaleDateString('de-DE', options);
    document.querySelector('.summary-tasks-mid-right-date').innerHTML = date;
  }
  
  async function summaryGreeting() {
    const hour = new Date().getHours();
    const greetingElement = document.querySelector('.summary-user-greeting');
    if (greetingElement) {
      let greetingMessage = '';
      if (hour > 6 && hour < 12) {
        greetingMessage = 'Good morning,';
      } else if (hour >= 12 && hour < 18) {
        greetingMessage = 'Good afternoon,';
      } else {
        greetingMessage = 'Good evening,';
      }
      try {
        await checkAuthAndGreet(greetingMessage, greetingElement);
      } catch (error) {
        console.error('Error during authentication check and greeting:', error);
      }
    }
  }
  
  async function checkAuthAndGreet(greetingMessage, greetingElement) {
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      const userSnapshot = await firebase.database().ref('users/' + userId).once('value');
      const userData = userSnapshot.val();
      if (userData && userData.name) {
        greetingElement.textContent = `${greetingMessage} ${userData.name}!`;
      } else {
        greetingElement.textContent = greetingMessage;
      }
    } else {
      greetingElement.textContent = greetingMessage;
    }
  }