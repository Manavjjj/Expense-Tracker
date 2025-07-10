// DOM Elements
const transactionForm = document.getElementById('transaction-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const transactionList = document.getElementById('transaction-list');
const balanceElement = document.getElementById('balance');
const incomeElement = document.getElementById('money-plus');
const expenseElement = document.getElementById('money-minus');

// Transactions array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Initialize app
function init() {
    transactionList.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    if (textInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('Please add a text and amount');
        return;
    }

    const transaction = {
        id: generateID(),
        text: textInput.value,
        amount: +amountInput.value
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    
    textInput.value = '';
    amountInput.value = '';
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        <span class="transaction-text">${transaction.text}</span>
        <span class="transaction-amount">${sign}$${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
            <i class="fas fa-trash"></i>
        </button>
    `;

    transactionList.appendChild(item);
}

// Update balance, income and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => acc + item, 0)
        .toFixed(2);
    const expense = (
        amounts
            .filter(item => item < 0)
            .reduce((acc, item) => acc + item, 0) * -1
    ).toFixed(2);

    balanceElement.innerText = `$${total}`;
    incomeElement.innerText = `+$${income}`;
    expenseElement.innerText = `-$${expense}`;
}

// Remove transaction
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

// Update local storage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Event listeners
transactionForm.addEventListener('submit', addTransaction);

// Initialize
init();
