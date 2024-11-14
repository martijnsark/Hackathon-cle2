let selectedDate, selectedStartTime, selectedEndTime;
let currentMonth = 10;  // November (0-indexed: 0 = January, 10 = November)
let currentYear = 2024; // Initial year

document.getElementById('student-form').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('form-card').style.display = 'none';
    document.getElementById('date-card').style.display = 'block';
    generateMonthDates();
});

function generateMonthDates() {
    const dateList = document.getElementById('date-list');
    dateList.innerHTML = ''; // Clear any existing dates

    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
    document.getElementById('month-year').textContent = `${monthName} ${currentYear}`;

    const daysToShow = [14, 15, 26]; // De dagen die we willen tonen

    // Voor elke gewenste dag (14, 15, 26)
    daysToShow.forEach(day => {
        // Controleer of de dag binnen de geldige range valt voor de huidige maand
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        if (day <= lastDayOfMonth) {
            const dateButton = document.createElement('button');
            dateButton.classList.add('button');
            dateButton.textContent = `${monthName} ${day}`;
            dateButton.onclick = function() { selectDate(day); };
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
    // Format de datum zoals "14 november"
    const formattedDate = formatDate(selectedDate);

    // Vul de samenvatting in
    document.getElementById('summary-student-name').textContent = document.getElementById('student-name').value;
    document.getElementById('summary-parent-name').textContent = document.getElementById('parent-name').value;
    document.getElementById('summary-date').textContent = formattedDate;
    document.getElementById('summary-start-time').textContent = selectedStartTime;
    document.getElementById('summary-end-time').textContent = selectedEndTime;

    document.getElementById('summary-card').style.display = 'block';
}

// Functie om de datum te formatteren zoals "14 november"
function formatDate(date) {
    const [monthName, day] = date.split(' ');
    return `${day} ${monthName}`; // Formatteert als "14 november"
}


function sendEmail() {
    // Haal de waarden voor de e-mail op
    const studentName = document.getElementById('summary-student-name').textContent;
    const parentName = document.getElementById('summary-parent-name').textContent;
    const date = document.getElementById('summary-date').textContent;
    const startTime = document.getElementById('summary-start-time').textContent;
    const endTime = document.getElementById('summary-end-time').textContent;

    // Formatteer de datum zoals "14 november"
    const formattedDate = formatDate(date);

    // Format de e-mail onderwerp en body
    const subject = `${studentName} - Afspraak ${formattedDate} van ${startTime} tot ${endTime}`;
    const body = `Beste,\n\nHierbij de bevestiging van de afspraak:\n\n`
        + `Student: ${studentName}\n`
        + `Ouder(s): ${parentName}\n`
        + `Datum: ${formattedDate}\n`
        + `Begintijd: ${startTime}\n`
        + `Eindtijd: ${endTime}\n\n`
        + `Met vriendelijke groet,\nMentor Mireille`;

    // Open de mailto link met het opgegeven onderwerp en body
    const mailtoLink = `mailto:realmentor@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;  // December
        currentYear--;      // Previous year
    }
    generateMonthDates();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;   // January
        currentYear++;      // Next year
    }
    generateMonthDates();
}
