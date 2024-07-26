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
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const userId = user.uid;
                    const userName = await fetchUserName(userId);
                    greetingElement.innerText = `${greetingMessage} ${userName}`;
                    resolve();
                } catch (error) {
                    reject(error);
                }
            } else {
                window.location.href = '/public/login.html';
                resolve();
            }
        });
    });
}

async function fetchUserName(userId) {
    try {
        const snapshot = await firebase.database().ref('users/' + userId).once('value');
        return snapshot.val().name || 'User';
    } catch (error) {
        console.error('Error fetching user data:', error);
        return 'User';
    }
}