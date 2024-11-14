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

    const daysToShow = [14, 15, 26]; // The days we want to show
    const lastSelectableDate = new Date(currentYear, currentMonth + 2, 0); // Two months after the current date

    // Define the date after which no further dates can be selected (January 14, 2025)
    const maxSelectableDate = new Date(2025, 0, 14); // January 14, 2025

    // Loop through each desired day (14, 15, 26)
    daysToShow.forEach(day => {
        const targetDate = new Date(currentYear, currentMonth, day);

        // Check if the target date is within the valid range
        if (targetDate <= lastSelectableDate) {
            const dateButton = document.createElement('button');
            dateButton.classList.add('button');
            dateButton.textContent = `${monthName} ${day}`;

            // Disable and grey out dates beyond January 14, 2025
            if (targetDate > maxSelectableDate) {
                dateButton.disabled = true;
                dateButton.classList.add('is-light');  // Use the Bulma class to grey out the button
            } else if (targetDate < currentDate) {
                // Disable and grey out dates in the past
                dateButton.disabled = true;
                dateButton.classList.add('is-light');
            } else {
                // Otherwise, allow selection
                dateButton.onclick = function() { selectDate(day); };
            }

            dateList.appendChild(dateButton);
        } else {
            // If the date is outside the allowed range, disable the button
            const dateButton = document.createElement('button');
            dateButton.classList.add('button');
            dateButton.textContent = `${monthName} ${day}`;
            dateButton.disabled = true; // Disable the button
            dateButton.classList.add('is-light'); // Grey out the button
            dateList.appendChild(dateButton);
        }
    });
}

function selectDate(day) {
    // Get the full month name and day in the desired format: "day, month"
    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
    selectedDate = `${day} ${monthName}`;  // Day first, then month
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
    triggerConfetti();  // Trigger the confetti animation when the summary is shown
}

function triggerConfetti() {
    const container = document.getElementById('fireworks-container');
    container.style.opacity = 1; // Show the container

    // Voeg confetti toe
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`; // Randomize speed
        container.appendChild(confetti);
    }

    // Optioneel: Na 5 seconden de confetti animatie stoppen
    setTimeout(() => {
        container.style.opacity = 0;
        container.innerHTML = '';  // Verwijder de confetti
    }, 5000);
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
    const body = `Beste, mentor\n\nHierbij de bevestiging van de afspraak:\n\n`
        + `Student: ${studentName}\n`
        + `Ouder(s): ${parentName}\n`
        + `Datum: ${date}\n`
        + `Begintijd: ${startTime}\n`
        + `Eindtijd: ${endTime}\n\n`
        + `Met vriendelijke groet,\n${studentName}`;

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
