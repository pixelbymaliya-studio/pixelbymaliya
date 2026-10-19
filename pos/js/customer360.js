// =====================================================================
// PIXEL BY MALIYA POS — CUSTOMER 360
// Returns, cancellations and repeat-order history per customer.
// =====================================================================

let _custProfiles = [];

function _digits(p) { return String(p || '').replace(/\D/g, ''); }

function _custKey(name, phone) {
  const d = _digits(phone);
  return d ? 'p:' + d : 'n:' + String(name || '').trim().toLowerCase();
}

async function aggregateCustomers() {
  const [orders, fulfillment, credit] = await Promise.all([
    (typeof api.getOrders === 'function') ? api.getOrders() : Promise.resolve([]),
    (typeof api.getModule === 'function') ? api.getModule('fulfillment').catch(() => []) : Promise.resolve([]),
    (typeof api.getCredit === 'function') ? api.getCredit() : Promise.resolve([])
  ]);

  const map = {};
  const ensure = (name, phone) => {
    const key = _custKey(name, phone);
    if (!map[key]) {
      map[key] = {
        key, name: name || 'Walk-in Customer', phone: phone || '',
        orders: 0, spent: 0, cancelled: 0, returned: 0, delivered: 0,
        inTransit: 0, dues: 0, creditCount: 0, lastOrder: null, recent: []
      };
    }
    const p = map[key];
    if (phone && !p.phone) p.phone = phone;
    if (name && p.name === 'Walk-in Customer') p.name = name;
    return p;
  };

  orders.forEach(o => {
    const p = ensure(o.customer_name, o.customer_phone);
    p.orders += 1;
    p.spent += Number(o.total ?? o.total_amount ?? 0);
    const d = o.created_at || '';
    if (d && (!p.lastOrder || d > p.lastOrder)) p.lastOrder = d;
    p.recent.push({ kind: 'order', id: o.id, total: Number(o.total ?? o.total_amount ?? 0), date: d, status: 'Completed' });
  });

  fulfillment.forEach(r => {
    const p = ensure(r.customer, r.phone);
    if (r.status === 'Cancelled') p.cancelled += 1;
    else if (r.status === 'Returned') p.returned += 1;
    else if (r.status === 'Delivered') p.delivered += 1;
    else p.inTransit += 1;
    p.recent.push({ kind: 'delivery', id: r.order || r.id, total: Number(r.cod || 0), date: '', status: r.status, reason: r.reason || '' });
  });

  credit.forEach(c => {
    const p = ensure(c.customer, c.phone);
    p.creditCount += 1;
    p.dues += Math.max(0, Number(c.total || 0) - Number(c.paid || 0));
  });

  return Object.values(map).sort((a, b) => b.spent - a.spent);
}

async function findCustomer(nameOrPhone) {
  const all = await aggregateCustomers();
  _custProfiles = all;
  const d = _digits(nameOrPhone);
  return all.find(x => x.phone && _digits(x.phone) === d && d) ||
    all.find(x => (x.name || '').toLowerCase() === String(nameOrPhone || '').toLowerCase()) ||
    all.find(x => x.name === nameOrPhone);
}

// ---------- POS inline insights ----------
async function refreshCustomerInsights() {
  const box = document.getElementById('customer-insights');
  if (!box) return;
  const name = (document.getElementById('cart-customer-name')?.value || '').trim();
  const phone = (document.getElementById('cart-customer-phone')?.value || '').trim();
  if (!name && !phone) { box.classList.add('hidden'); box.innerHTML = ''; return; }

  const all = await aggregateCustomers();
  _custProfiles = all;
  const key = _custKey(name, phone);
  let p = all.find(x => x.key === key);
  if (!p && name) p = all.find(x => x.name.toLowerCase() === name.toLowerCase());

  box.classList.remove('hidden');
  if (!p) {
    box.innerHTML = `<div class="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-400"><i class="fa-solid fa-user-plus mr-1 text-primary"></i>New customer — no previous orders on record.</div>`;
    return;
  }
  const returning = p.orders > 0;
  box.innerHTML = `<div class="p-3 rounded-xl bg-primary/10 border border-primary/30 space-y-1.5">
    <div class="flex items-center justify-between">
      <span class="text-[11px] font-bold ${returning ? 'text-primary' : 'text-slate-300'}">${returning ? '<i class="fa-solid fa-rotate-right mr-1"></i>Returning customer' : 'Past activity'}</span>
      <button onclick="openCustomerModalByIdx(${all.indexOf(p)})" class="text-[10px] text-primary hover:underline">View profile</button>
    </div>
    <div class="grid grid-cols-4 gap-1 text-center">
      <div><p class="text-sm font-extrabold text-slate-100">${p.orders}</p><p class="text-[9px] text-slate-400">Orders</p></div>
      <div><p class="text-sm font-extrabold text-slate-300">${p.cancelled}</p><p class="text-[9px] text-slate-400">Cancelled</p></div>
      <div><p class="text-sm font-extrabold text-rose-300">${p.returned}</p><p class="text-[9px] text-slate-400">Returned</p></div>
      <div><p class="text-sm font-extrabold text-amber-300">Rs.${Math.round(p.dues).toLocaleString()}</p><p class="text-[9px] text-slate-400">Dues</p></div>
    </div>
  </div>`;
}

// ---------- Customer 360 modal ----------
function closeCustomerModal() { document.getElementById('customer-modal').classList.add('hidden'); }

async function openCustomerModal(nameOrPhone) {
  const p = await findCustomer(nameOrPhone);
  if (!p) { toast('No records for this customer', 'info'); return; }
  renderCustomerModal(p);
}

function openCustomerModalByIdx(i) { if (_custProfiles[i]) renderCustomerModal(_custProfiles[i]); }

function renderCustomerModal(p) {
  const host = document.getElementById('customer-modal-body');
  if (!host) return;
  const money = v => 'Rs. ' + Number(v || 0).toLocaleString();
  const kpi = (label, val, tone) => `
    <div class="p-3 rounded-xl bg-white/5 text-center">
      <p class="text-lg font-extrabold text-${tone}-400">${val}</p>
      <p class="text-[10px] text-slate-400">${label}</p>
    </div>`;

  const recent = (p.recent || []).slice(-8).reverse();
  const recentRows = recent.length ? recent.map(r => {
    const cls = r.status === 'Delivered' || r.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300'
      : r.status === 'Returned' ? 'bg-rose-500/20 text-rose-300'
      : r.status === 'Cancelled' ? 'bg-slate-500/20 text-slate-400'
      : 'bg-amber-500/20 text-amber-300';
    const date = r.date ? new Date(r.date).toISOString().split('T')[0] : '';
    return `<div class="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white/5">
      <div class="min-w-0">
        <p class="text-xs font-semibold text-slate-200">${r.id} <span class="text-[10px] text-slate-500">· ${r.kind === 'delivery' ? 'Delivery' : 'Order'}</span></p>
        ${r.reason ? `<p class="text-[10px] text-rose-300/80 truncate">${r.reason}</p>` : date ? `<p class="text-[10px] text-slate-500">${date}</p>` : ''}
      </div>
      <div class="text-right shrink-0">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${cls}">${r.status}</span>
        <p class="text-[11px] font-bold text-slate-300 mt-1">${money(r.total)}</p>
      </div>
    </div>`;
  }).join('') : '<p class="text-xs text-slate-500 text-center py-4">No recent activity.</p>';

  host.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="w-12 h-12 rounded-2xl btn-primary flex items-center justify-center text-lg font-extrabold text-white">${(p.name || '?').charAt(0).toUpperCase()}</span>
      <div>
        <p class="font-bold text-slate-100 text-lg">${p.name}</p>
        <p class="text-xs text-slate-400">${p.phone || 'No phone on record'}</p>
      </div>
      <span class="ml-auto px-3 py-1 rounded-xl text-[11px] font-bold ${p.orders > 3 ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'}">${p.orders > 3 ? 'VIP' : p.orders > 0 ? 'Returning' : 'New'}</span>
    </div>

    <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
      ${kpi('Orders', p.orders, 'primary')}
      ${kpi('Delivered', p.delivered, 'emerald')}
      ${kpi('In Transit', p.inTransit, 'amber')}
      ${kpi('Returned', p.returned, 'rose')}
      ${kpi('Cancelled', p.cancelled, 'slate')}
      ${kpi('Dues', money(p.dues), 'amber')}
    </div>

    <div class="grid grid-cols-2 gap-3 text-xs">
      <div class="p-3 rounded-xl bg-white/5"><span class="text-slate-400">Lifetime spend</span><p class="font-extrabold text-emerald-300 text-base">${money(p.spent)}</p></div>
      <div class="p-3 rounded-xl bg-white/5"><span class="text-slate-400">Credit bills</span><p class="font-extrabold text-slate-200 text-base">${p.creditCount}</p></div>
    </div>

    <div>
      <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Recent activity</h4>
      <div class="space-y-2">${recentRows}</div>
    </div>`;

  document.getElementById('customer-modal').classList.remove('hidden');
}
