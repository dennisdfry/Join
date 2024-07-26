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

async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    let file = element.getAttribute("w3-include-html");
    
    try {
      let sanitizedUrl = new URL(file, window.location.href);
      sanitizedUrl.username = '';
      sanitizedUrl.password = '';

      let resp = await fetch(sanitizedUrl);
      if (resp.ok) {
        element.innerHTML = await resp.text();
        if (file.includes('addTask.html')) {
          init();
        }
        if (file.includes('summary.html')) {
          await summaryGreeting();
        }
      } else {
        element.innerHTML = 'Page not found';
      }
    } catch (error) {
      console.error('Error fetching file:', file, error);
      element.innerHTML = 'Error loading page';
    }
  }
}

function changeSite(page) {
  document.querySelector('.main-content').setAttribute('w3-include-html', page);
  includeHTML();
}

document.addEventListener('DOMContentLoaded', () => {
  includeHTML();
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const mainContent = document.querySelector('.main-content');
    const currentPage = mainContent.getAttribute('w3-include-html');
    if (currentPage && currentPage.includes('summary.html')) {
      summaryGreeting();
    }
  }
});
