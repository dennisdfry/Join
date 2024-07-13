function init() {
    currentDate();
}

function currentDate() {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date().toLocaleDateString('de-DE', options);
    document.querySelector('.summary-tasks-mid-right-date').innerHTML = date;
}