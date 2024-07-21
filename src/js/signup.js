let BASE_URL = "https://join-19628-default-rtdb.firebaseio.com/users/";

const firebaseConfig = {
    apiKey: "AIzaSyDZv_Y7rO7cD6zajbn8N2xjTCRXirodJ_w",
    authDomain: "join-19628.firebaseapp.com",
    databaseURL: "https://join-19628-default-rtdb.firebaseio.com",
    projectId: "join-19628",
    storageBucket: "join-19628.appspot.com",
    messagingSenderId: "828382956671",
    appId: "1:828382956671:web:f180ef915a3607d86bc34a"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  async function signUp(event) {
      event.preventDefault();
      let name = document.getElementById('name').value;
      let mail = document.getElementById('mail').value;
      let password = document.getElementById('password').value;
      let confirm = document.getElementById('confirm-password').value;
      let checkbox = document.getElementById('checkbox').checked;
  
      if (password !== confirm) {
          alert('Passwörter stimmen nicht überein.');
          return false;
      }
  
      if (!checkbox) {
          alert('Sie müssen die Privacy Policy akzeptieren.');
          return false;
      }
  
      try {
          let userId = await generateUniqueId();
          let userData = {
              id: userId,
              name: name,
              email: mail,
              password: password
          };
  
          await firebase.database().ref('users/' + userId).set(userData);
          alert("You Signed Up successfully");
      } catch (error) {
          alert("Error saving data: " + error.message);
      }
  
      return true;
  }
  
  async function generateUniqueId() {
      let snapshot = await firebase.database().ref('users').once('value');
      let userCount = snapshot.numChildren();
      let newId = (userCount + 1).toString().padStart(3, '0');
      return newId;
  }
  