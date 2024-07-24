function init() {
    currentHour();
}

function currentDate() {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date().toLocaleDateString('de-DE', options);
    document.querySelector('.summary-tasks-mid-right-date').innerHTML = date;
}

function currentHour() {
    const hour = new Date().getHours();

    if(hour > 6 && hour < 12) {
    document.getElementById('greeting').innerHTML += `Good morgning,`
    } else if (hour > 12 && hour < 18) {
        document.getElementById('greeting').innerHTML += `Good afternoon,`
    } else {
        document.getElementById('greeting').innerHTML += `Good evening,`
    }
}