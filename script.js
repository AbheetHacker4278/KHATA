const ledgerList = document.getElementById('ledgerList');
const summary = document.getElementById('summary');
let lastDeletedEntry = null;

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

document.getElementById('deleteRecentButton').addEventListener('click', function() {
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    if (entries.length > 0) {
        lastDeletedEntry = entries.pop();
        localStorage.setItem('entries', JSON.stringify(entries));
        displayEntries();
    } else {
        alert('No entries to delete!');
    }
});

document.getElementById('recoverRecentButton').addEventListener('click', function() {
    if (lastDeletedEntry) {
        let entries = JSON.parse(localStorage.getItem('entries')) || [];
        entries.push(lastDeletedEntry);
        localStorage.setItem('entries', JSON.stringify(entries));
        lastDeletedEntry = null;
        displayEntries();
    } else {
        alert('No recent entry to recover!');
    }
});

document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
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

document.getElementById('ledgerForm').addEventListener('submit', function(event) {
    const date = document.getElementById('date').value;
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;

    if (!date || !amount || !description) {
        event.preventDefault();
        showWarning();
    } else {
        addEntry(date, amount, description);
        event.preventDefault();
    }
});

function addEntry(date, amount, description) {
    const ledgerList = document.getElementById('ledgerList');
    const li = document.createElement('li');
    li.textContent = `${new Date(date).toLocaleDateString('en-GB')} - ₹${amount} - ${description}`;
    ledgerList.appendChild(li);
}

function showWarning() {
    const warning = document.getElementById('warning');
    warning.classList.remove('hidden');
    setTimeout(() => {
        warning.classList.add('hidden');
    }, 2000);
}

document.getElementById('downloadPdfButton').addEventListener('click', async function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
    
    doc.text("Expenses Report", 10, y);
    y += 10;

    const items = document.querySelectorAll('#ledgerList li');
    items.forEach(item => {
        doc.text(item.textContent, 10, y);
        y += 10;
    });

    doc.save('ledger.pdf');
});
