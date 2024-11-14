let selectedDate, selectedStartTime, selectedEndTime;
let currentDate = new Date();  // Huidige datum
let currentMonth = currentDate.getMonth();  // Huidige maand (0-11)
let currentYear = currentDate.getFullYear();  // Huidig jaar

document.getElementById('student-form').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('form-card').style.display = 'none';
    document.getElementById('date-card').style.display = 'block';
    generateMonthDates(); // Genereer de datums voor de geselecteerde maand
});

function generateMonthDates() {
    const dateList = document.getElementById('date-list');
    dateList.innerHTML = ''; // Clear any existing dates

    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
    document.getElementById('month-year').textContent = `${monthName} ${currentYear}`;

    const daysToShow = [14, 15, 26]; // De dagen die we willen tonen
    const lastSelectableDate = new Date(currentYear, currentMonth + 2, 0); // 2 maanden na de huidige datum

    // Voor elke gewenste dag (14, 15, 26)
    daysToShow.forEach(day => {
        const targetDate = new Date(currentYear, currentMonth, day);

        // Controleer of de dag binnen de geldige range valt voor de huidige maand en de komende twee maanden
        if (targetDate <= lastSelectableDate) {
            const dateButton = document.createElement('button');
            dateButton.classList.add('button');
            dateButton.textContent = `${monthName} ${day}`;

            // Grijs de datums die in het verleden liggen
            if (targetDate < currentDate) {
                dateButton.disabled = true;
                dateButton.classList.add('is-light');  // Gebruik de Bulma class om de knop te grijzen
            } else {
                dateButton.onclick = function() { selectDate(day); };
            }

            dateList.appendChild(dateButton);
        } else {
            // Als de datum buiten de toegestane range valt, disable de knop
            const dateButton = document.createElement('button');
            dateButton.classList.add('button');
            dateButton.textContent = `${monthName} ${day}`;
            dateButton.disabled = true; // Disable de knop
            dateButton.classList.add('is-light'); // Grijs de knop
            dateList.appendChild(dateButton);
        }
    });
}

function selectDate(day) {
    selectedDate = `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${day}`;
    document.getElementById('date-card').style.display = 'none';
    document.getElementById('start-time-card').style.display = 'block';
}

function selectStartTime(time) {
    selectedStartTime = time;
    document.getElementById('start-time-card').style.display = 'none';
    document.getElementById('end-time-card').style.display = 'block';

    // Disable all end time buttons initially
    const endTimeButtons = document.querySelectorAll('#end-time-list .button');
    endTimeButtons.forEach(button => button.disabled = true);

    // Enable only the valid end time (30 minutes after the start time)
    const validEndTime = calculateEndTime(time);
    endTimeButtons.forEach(button => {
        if (button.textContent === validEndTime) {
            button.disabled = false;
        }
    });
}

function selectEndTime(time) {
    selectedEndTime = time;
    document.getElementById('end-time-card').style.display = 'none';
    showSummary();
}

function calculateEndTime(startTime) {
    // Parse the start time (e.g., "09:00")
    const [hours, minutes] = startTime.split(':').map(Number);
    const endMinutes = (minutes + 30) % 60;
    const endHours = hours + Math.floor((minutes + 30) / 60);

    // Format end time as "HH:MM"
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

function showSummary() {
    // Fill in the summary details
    document.getElementById('summary-student-name').textContent = document.getElementById('student-name').value;
    document.getElementById('summary-parent-name').textContent = document.getElementById('parent-name').value;
    document.getElementById('summary-date').textContent = selectedDate;
    document.getElementById('summary-start-time').textContent = selectedStartTime;
    document.getElementById('summary-end-time').textContent = selectedEndTime;

    document.getElementById('summary-card').style.display = 'block';
}

function sendEmail() {
    // Retrieve values for email
    const studentName = document.getElementById('summary-student-name').textContent;
    const parentName = document.getElementById('summary-parent-name').textContent;
    const date = document.getElementById('summary-date').textContent;
    const startTime = document.getElementById('summary-start-time').textContent;
    const endTime = document.getElementById('summary-end-time').textContent;

    // Format email subject and body
    const subject = `${studentName} - Afspraak ${date} van ${startTime} tot ${endTime}`;
    const body = `Beste,\n\nHierbij de bevestiging van de afspraak:\n\n`
        + `Student: ${studentName}\n`
        + `Ouder(s): ${parentName}\n`
        + `Datum: ${date}\n`
        + `Begintijd: ${startTime}\n`
        + `Eindtijd: ${endTime}\n\n`
        + `Met vriendelijke groet,\nMentor Mireille`;

    // Open mailto link with specified recipient email
    const mailtoLink = `mailto:realmentor@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateMonthDates();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateMonthDates();
}
