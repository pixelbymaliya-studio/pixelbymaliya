// =====================================================================
// PIXEL BY MALIYA POS — CREDIT & DUES (all shops)
// Customer credit bills, outstanding balances, ageing and collection.
// =====================================================================

let creditList = [];

const DAY_MS = 86400000;

function creditBalance(r) {
  return Math.max(0, Number(r.total || 0) - Number(r.paid || 0));
}

function creditStatus(r) {
  const bal = creditBalance(r);
  if (bal <= 0) return { label: 'Paid', cls: 'bg-emerald-500/20 text-emerald-300', overdue: false, days: 0 };
  const due = r.due ? new Date(r.due) : null;
  const days = due ? Math.floor((Date.now() - due.getTime()) / DAY_MS) : 0;
  const paid = Number(r.paid || 0);
  if (days > 0) return { label: `Overdue ${days}d`, cls: 'bg-rose-500/20 text-rose-300', overdue: true, days };
  if (paid > 0) return { label: 'Partial', cls: 'bg-amber-500/20 text-amber-300', overdue: false, days };
  return { label: 'Unpaid', cls: 'bg-slate-500/20 text-slate-300', overdue: false, days };
}

function ageBucket(days) {
  if (days <= 0) return 'current';
  if (days <= 30) return '30';
  if (days <= 60) return '60';
  return '90';
}

async function loadCreditData() {
  creditList = await api.getCredit();
  renderCreditKpis();
  renderCreditTable();
}

function renderCreditKpis() {
  const open = creditList.filter(r => creditBalance(r) > 0);
  const outstanding = open.reduce((s, r) => s + creditBalance(r), 0);
  const overdue = open.filter(r => creditStatus(r).overdue).reduce((s, r) => s + creditBalance(r), 0);
  const collected = creditList.reduce((s, r) => s + Number(r.paid || 0), 0);
  const customers = new Set(open.map(r => (r.customer || '').toLowerCase())).size;

  const setMoney = (id, val) => {
    const el = document.getElementById(id);
    if (el) animateCount(el, Math.round(val), '', 0);
  };
  setMoney('credit-kpi-outstanding', outstanding);
  setMoney('credit-kpi-overdue', overdue);
  setMoney('credit-kpi-collected', collected);
  const custEl = document.getElementById('credit-kpi-customers');
  if (custEl) animateCount(custEl, customers, '', 0);

  const buckets = { current: 0, 30: 0, 60: 0, 90: 0 };
  open.forEach(r => {
    const st = creditStatus(r);
    buckets[ageBucket(st.days)] += creditBalance(r);
  });
  ['current', '30', '60', '90'].forEach(k => {
    const el = document.getElementById('credit-age-' + k);
    if (el) el.innerText = Math.round(buckets[k]).toLocaleString();
  });
}

function renderCreditTable() {
  const body = document.getElementById('credit-table-body');
  if (!body) return;
  const q = (document.getElementById('credit-search')?.value || '').toLowerCase();
  const filter = document.getElementById('credit-filter')?.value || 'all';

  let rows = creditList.slice();
  if (q) rows = rows.filter(r => (r.customer || '').toLowerCase().includes(q) || (r.invoice || '').toLowerCase().includes(q));
  if (filter === 'unpaid') rows = rows.filter(r => creditBalance(r) > 0);
  else if (filter === 'overdue') rows = rows.filter(r => creditStatus(r).overdue);
  else if (filter === 'paid') rows = rows.filter(r => creditBalance(r) <= 0);

  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="9" class="px-4 py-10 text-center text-slate-500 text-sm">No credit bills found.</td></tr>`;
    return;
  }

  const money = v => 'Rs. ' + Number(v || 0).toLocaleString();
  body.innerHTML = rows.map((r, i) => {
    const st = creditStatus(r);
    const bal = creditBalance(r);
    const canPay = bal > 0;
    return `
    <tr class="border-b border-white/5 hover:bg-white/5 transition-all table-row-enter" style="animation-delay:${i * 0.03}s">
      <td class="px-4 py-3 font-mono text-xs text-slate-300">${r.invoice || r.id}</td>
      <td class="px-4 py-3 font-semibold text-slate-100">${r.customer || '—'}
        ${r.phone ? `<p class="text-[10px] text-slate-500">${r.phone}</p>` : ''}</td>
      <td class="px-4 py-3 text-xs text-slate-400">${r.issued || '—'}</td>
      <td class="px-4 py-3 text-xs ${st.overdue ? 'text-rose-300 font-semibold' : 'text-slate-400'}">${r.due || '—'}</td>
      <td class="px-4 py-3 text-right text-xs font-semibold text-slate-300">${money(r.total)}</td>
      <td class="px-4 py-3 text-right text-xs text-emerald-300">${money(r.paid)}</td>
      <td class="px-4 py-3 text-right text-xs font-extrabold ${bal > 0 ? 'text-amber-300' : 'text-slate-500'}">${money(bal)}</td>
      <td class="px-4 py-3"><span class="px-2 py-0.5 rounded text-[11px] font-bold ${st.cls}">${st.label}</span></td>
      <td class="px-4 py-3 text-right whitespace-nowrap">
        ${canPay ? `<button onclick="openPaymentModal('${r.id}')" class="px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition" title="Record payment"><i class="fa-solid fa-hand-holding-dollar"></i></button>` : ''}
        <button onclick="deleteCreditRecord('${r.id}')" class="px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>`;
  }).join('');
}

// ---------- New credit bill ----------
function openCreditModal() {
  const due = document.getElementById('credit-due');
  if (due) due.value = new Date(Date.now() + 30 * DAY_MS).toISOString().split('T')[0];
  const inv = document.getElementById('credit-invoice');
  if (inv && !inv.value) inv.value = 'INV-' + Date.now().toString().slice(-6);
  document.getElementById('add-credit-modal').classList.remove('hidden');
}
function closeCreditModal() { document.getElementById('add-credit-modal').classList.add('hidden'); }

async function submitCredit(e) {
  e.preventDefault();
  const get = id => (document.getElementById(id)?.value || '').trim();
  try {
    await api.addCredit({
      customer: get('credit-customer'),
      phone: get('credit-phone'),
      invoice: get('credit-invoice'),
      total: parseFloat(get('credit-total')) || 0,
      paid: parseFloat(get('credit-paid')) || 0,
      due: get('credit-due'),
      terms: parseFloat(get('credit-terms')) || 30,
      note: get('credit-note')
    });
    closeCreditModal();
    e.target.reset();
    await loadCreditData();
    toast('Credit bill saved', 'success');
  } catch (err) {
    toast('Could not save credit bill', 'error');
  }
}

async function deleteCreditRecord(id) {
  await api.deleteCredit(id);
  await loadCreditData();
  toast('Credit bill deleted', 'info');
}

// ---------- Record payment ----------
function openPaymentModal(id) {
  const r = creditList.find(c => c.id === id);
  if (!r) return;
  document.getElementById('pay-credit-id').value = id;
  document.getElementById('pay-credit-name').innerText = r.customer || '—';
  document.getElementById('pay-credit-balance').innerText = 'Rs. ' + creditBalance(r).toLocaleString();
  document.getElementById('pay-amount').value = '';
  document.getElementById('payment-modal').classList.remove('hidden');
}
function closePaymentModal() { document.getElementById('payment-modal').classList.add('hidden'); }

function fillFullPayment() {
  const id = document.getElementById('pay-credit-id').value;
  const r = creditList.find(c => c.id === id);
  if (r) document.getElementById('pay-amount').value = creditBalance(r);
}

async function submitPayment(e) {
  e.preventDefault();
  const id = document.getElementById('pay-credit-id').value;
  const amount = parseFloat(document.getElementById('pay-amount').value) || 0;
  if (amount <= 0) { toast('Enter a valid amount', 'error'); return; }
  await api.recordCreditPayment(id, amount);
  closePaymentModal();
  await loadCreditData();
  toast('Payment recorded', 'success');
}
