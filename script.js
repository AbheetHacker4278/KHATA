const entries = [];
const ledgerList = document.getElementById('ledgerList');
const summary = document.getElementById('summary');

document.getElementById('ledgerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const date = document.getElementById('date').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value;
    
    entries.push({ date, amount, description });
    
    const listItem = document.createElement('li');
    listItem.textContent = `${date} - ₹${amount.toFixed(2)} - ${description}`;
    ledgerList.appendChild(listItem);
    
    document.getElementById('ledgerForm').reset();
    
    updateSummary();
});

document.getElementById('clearButton').addEventListener('click', function() {
    ledgerList.innerHTML = '';
    summary.innerHTML = '';
    entries.length = 0;
});

function updateSummary() {
    const currentDate = new Date();
    const lastDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const today = currentDate.getDate();
    
    if (today === lastDateOfMonth) {
        const totalSpent = entries.reduce((acc, entry) => acc + entry.amount, 0);
        summary.innerHTML = `Total Spent This Month: ₹${totalSpent.toFixed(2)}`;
    } else {
        summary.innerHTML = '';
    }
}
