const firebaseConfig = {
    apiKey: "AIzaSyDZv_Y7rO7cD6zajbn8N2xjTCRXirodJ_w",
    authDomain: "join-19628.firebaseapp.com",
    databaseURL: "https://join-19628-default-rtdb.firebaseio.com/",
    projectId: "join-19628",
    storageBucket: "join-19628.appspot.com",
    messagingSenderId: "828382956671",
    appId: "1:828382956671:web:f180ef915a3607d86bc34a",
  };
  
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }