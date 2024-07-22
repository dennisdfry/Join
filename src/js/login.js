const firebaseConfig = {
  apiKey: FB_API_KEY,
  authDomain: FB_AUTH_DOMAIN,
  databaseURL: FB_DATABASE_URL,
  projectId: FB_PROJECT_ID,
  storageBucket: FB_STORAGE_BUCKET,
  messagingSenderId: FB_MESSAGING_SENDER_ID,
  appId: FB_APP_ID,
};

firebase.initializeApp(firebaseConfig);

function goToPrivacy() {
  window.location.replace("/public/datenschutz.html");
}

function goToLegalNotice() {
  window.location.replace("/public/impressum.html");
}

function goToSignUp() {
  location.replace("/public/signup.html");
}
