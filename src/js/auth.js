/**
 * Checks the authentication state of the user.
 * 
 * Redirects the user to the login page if they are not authenticated.
 * This function listens for authentication state changes using Firebase's `onAuthStateChanged` method.
 */
function checkAuth() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            window.location.replace('/public/login.html');
        }
    });
}

//checkAuth();

/**
 * Handles user authentication state changes and performs actions based on the current page.
 * 
 * If a user is authenticated and the current page is "summary.html", 
 * it calls the `summaryGreeting` function.
 * 
 * @param {firebase.User} user - The user object from Firebase authentication.
 */
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const mainContent = document.querySelector(".main-content");
      const currentPage = mainContent.getAttribute("w3-include-html");
      if (currentPage && currentPage.includes("summary.html")) {
        summaryGreeting();
      }
    }
  });

/**
 * Clears the "user" item from local storage.
 * 
 * This function removes the stored user data from the local storage, effectively logging out the user.
 */
function clearLocalStorage() {
    localStorage.removeItem("user");
    localStorage.removeItem("classAdded");
}