// Expense Logging Module (Sri Lankan Rupees Rs.)
async function loadExpensesData() {
  const expensesList = await api.getExpenses();
  renderExpensesTable(expensesList);
}

function renderExpensesTable(expenses) {
  const tbody = document.getElementById('expenses-table-body');
  if (!expenses || expenses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-slate-500">No expenses logged.</td></tr>`;
    return;
  }

  tbody.innerHTML = expenses.map(e => {
    const amt = Number(e.amount || 0);
    return `
      <tr class="border-b border-slate-800 hover:bg-slate-800/40 transition-all">
        <td class="px-4 py-3 font-mono text-xs text-slate-400">${e.expense_date || e.date || 'Today'}</td>
        <td class="px-4 py-3 font-bold text-slate-200">${e.title}</td>
        <td class="px-4 py-3">
          <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/20 text-rose-300">${e.category || 'General'}</span>
        </td>
        <td class="px-4 py-3 font-extrabold text-rose-400">Rs. ${amt.toFixed(2)}</td>
        <td class="px-4 py-3 text-xs text-slate-400">${e.notes || '-'}</td>
      </tr>
    `;
  }).join('');
}

async function handleExpenseSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('exp-title').value;
  const category = document.getElementById('exp-category').value;
  const amount = document.getElementById('exp-amount').value;
  const notes = document.getElementById('exp-notes').value;

  try {
    await api.addExpense({ title, category, amount: parseFloat(amount || 0), notes });
    document.getElementById('exp-title').value = '';
    document.getElementById('exp-amount').value = '';
    document.getElementById('exp-notes').value = '';
    await loadExpensesData();
    if (activeTab === 'dashboard') {
      await loadDashboardData();
    }
  } catch (err) {
    alert('Failed to log expense: ' + err.message);
  }
}
