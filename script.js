const ledgerList = document.getElementById('ledgerList');
const summary = document.getElementById('summary');

document.getElementById('ledgerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const date = document.getElementById('date').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value;
    
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.push({ date, amount, description });
    localStorage.setItem('entries', JSON.stringify(entries));
    
    document.getElementById('ledgerForm').reset();
    displayEntries();
});

document.getElementById('clearButton').addEventListener('click', function() {
    const entries = localStorage.getItem('entries');
    localStorage.setItem('backupEntries', entries);
    localStorage.removeItem('entries');
    displayEntries();
});

document.getElementById('recoverButton').addEventListener('click', function() {
    const backupEntries = localStorage.getItem('backupEntries');
    if (backupEntries) {
        localStorage.setItem('entries', backupEntries);
        localStorage.removeItem('backupEntries');
        displayEntries();
    } else {
        alert('No backup found!');
    }
});

function displayEntries() {
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    ledgerList.innerHTML = '';
    let monthlyTotals = {};

    entries.forEach(entry => {
        const formattedDate = formatDate(entry.date);
        const date = new Date(entry.date);
        const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        
        if (!monthlyTotals[monthYear]) {
            monthlyTotals[monthYear] = 0;
        }
        monthlyTotals[monthYear] += entry.amount;

        const listItem = document.createElement('li');
        listItem.textContent = `${formattedDate} - ₹${entry.amount.toFixed(2)} - ${entry.description}`;
        ledgerList.appendChild(listItem);
    });

    summary.innerHTML = '<h3>Monthly Totals</h3><ul>';
    for (const [monthYear, total] of Object.entries(monthlyTotals)) {
        summary.innerHTML += `<li><strong>${monthYear}:</strong> ₹${total.toFixed(2)}</li>`;
    }
    summary.innerHTML += '</ul>';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    const daySuffix = getDaySuffix(day);
    return `${day}${daySuffix} ${month} ${year}`;
}

function getDaySuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

// Load entries on page load
displayEntries();
