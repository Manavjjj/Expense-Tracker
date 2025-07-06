// DOM Elements
const transactionForm = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const transactionList = document.getElementById('transaction-list');
const balanceElement = document.getElementById('balance');
const incomeElement = document.getElementById('income');
const expenseElement = document.getElementById('expense');

// Initialize transactions array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    description: descriptionInput.value,
    amount: +amountInput.value,
    category: categoryInput.value
  };

  transactions.push(transaction);
  updateLocalStorage();
  updateUI();
  transactionForm.reset();
}

// Update UI
function updateUI() {
  // Clear transaction list
  transactionList.innerHTML = '';

  // Calculate totals
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

  // Update summary
  balanceElement.textContent = `$${total}`;
  incomeElement.textContent = `+$${income}`;
  expenseElement.textContent = `-$${expense}`;

  // Render transactions
  transactions.forEach(transaction => {
    const li = document.createElement('li');
    li.className = `transaction ${transaction.amount > 0 ? 'income' : 'expense'}`;
    li.innerHTML = `
      <span>${transaction.description} (${transaction.category})</span>
      <span>${transaction.amount > 0 ? '+' : ''}${transaction.amount.toFixed(2)}</span>
      <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">×</button>
    `;
    transactionList.appendChild(li);
  });
}

// Delete transaction
function deleteTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  updateUI();
}

// Update localStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Event listeners
transactionForm.addEventListener('submit', addTransaction);

// Initialize UI
updateUI();