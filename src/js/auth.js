function checkAuth() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            window.location.replace('/public/login.html');
        }
    });
}

checkAuth();