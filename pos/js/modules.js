// =====================================================================
// PIXEL BY MALIYA POS — SIGNATURE INDUSTRY MODULES
// Kitchen/KOT, Purchase Orders, Warranty, Builds, Bulk Orders,
// Prescriptions, Appointments and Size/Colour stock.
// =====================================================================

const TONE_TEXT = {
  rose: 'text-rose-400', emerald: 'text-emerald-400', sky: 'text-sky-400', cyan: 'text-cyan-400',
  indigo: 'text-indigo-400', teal: 'text-teal-400', pink: 'text-pink-400', primary: 'text-primary',
  amber: 'text-amber-400', violet: 'text-violet-400', purple: 'text-purple-400'
};

const MODULE_FLOW = {
  kitchen: ['Preparing', 'Ready', 'Served'],
  purchase: ['Pending', 'Ordered', 'Received'],
  builds: ['Quoted', 'In Build', 'Testing', 'Ready', 'Delivered'],
  bulk: ['Pending', 'Packing', 'Delivered'],
  prescriptions: ['Pending', 'Packed', 'Dispensed'],
  appointments: ['Confirmed', 'Checked-in', 'Completed'],
  fulfillment: ['Pending', 'Packed', 'Shipped', 'Delivered']
};

const MODULE_SCHEMA = {
  kitchen: [
    { k: 'table', l: 'Table / Seat', t: 'text', req: true },
    { k: 'waiter', l: 'Waiter', t: 'text' },
    { k: 'party', l: 'Party Size', t: 'number' },
    { k: 'status', l: 'Status', t: 'select', opts: ['Preparing', 'Ready', 'Served'] },
    { k: 'placed', l: 'Time (HH:MM)', t: 'text' },
    { k: 'items', l: 'Items (one per line: Name x Qty)', t: 'textarea', req: true }
  ],
  purchase: [
    { k: 'supplier', l: 'Supplier', t: 'text', req: true },
    { k: 'date', l: 'Order Date', t: 'text' },
    { k: 'expected', l: 'Expected Date', t: 'text' },
    { k: 'status', l: 'Status', t: 'select', opts: ['Pending', 'Ordered', 'Received'] },
    { k: 'total', l: 'Total (Rs.)', t: 'number' },
    { k: 'items', l: 'Items (one per line: Name x Qty)', t: 'textarea' }
  ],
  warranty: [
    { k: 'product', l: 'Product', t: 'text', req: true },
    { k: 'imei', l: 'IMEI / Serial', t: 'text', req: true },
    { k: 'customer', l: 'Customer', t: 'text' },
    { k: 'months', l: 'Warranty (months)', t: 'number' },
    { k: 'sold', l: 'Sold Date', t: 'text' },
    { k: 'expiry', l: 'Expiry Date', t: 'text' },
    { k: 'status', l: 'Status', t: 'select', opts: ['Active', 'Expiring', 'Expired'] }
  ],
  builds: [
    { k: 'name', l: 'Build Name', t: 'text', req: true },
    { k: 'customer', l: 'Customer', t: 'text' },
    { k: 'cpu', l: 'CPU', t: 'text' },
    { k: 'gpu', l: 'GPU', t: 'text' },
    { k: 'ram', l: 'RAM', t: 'text' },
    { k: 'ssd', l: 'Storage', t: 'text' },
    { k: 'total', l: 'Total (Rs.)', t: 'number' },
    { k: 'status', l: 'Status', t: 'select', opts: ['Quoted', 'In Build', 'Testing', 'Ready', 'Delivered'] },
    { k: 'due', l: 'Due Date', t: 'text' }
  ],
  bulk: [
    { k: 'institution', l: 'School / Institution', t: 'text', req: true },
    { k: 'contact', l: 'Contact Person', t: 'text' },
    { k: 'items', l: 'Items (one per line: Title x Qty)', t: 'textarea' },
    { k: 'total', l: 'Total (Rs.)', t: 'number' },
    { k: 'status', l: 'Status', t: 'select', opts: ['Pending', 'Packing', 'Delivered'] },
    { k: 'due', l: 'Due Date', t: 'text' }
  ],
  prescriptions: [
    { k: 'patient', l: 'Patient', t: 'text', req: true },
    { k: 'doctor', l: 'Prescribing Doctor', t: 'text' },
    { k: 'date', l: 'Date', t: 'text' },
    { k: 'status', l: 'Status', t: 'select', opts: ['Pending', 'Packed', 'Dispensed'] },
    { k: 'meds', l: 'Medicines (one per line: Name x Qty)', t: 'textarea' }
  ],
  appointments: [
    { k: 'client', l: 'Client', t: 'text', req: true },
    { k: 'service', l: 'Service', t: 'text' },
    { k: 'stylist', l: 'Stylist', t: 'text' },
    { k: 'time', l: 'Time', t: 'text' },
    { k: 'price', l: 'Price (Rs.)', t: 'number' },
    { k: 'status', l: 'Status', t: 'select', opts: ['Confirmed', 'Checked-in', 'Completed', 'No-show'] }
  ],
  variants: [
    { k: 'product', l: 'Product / Style', t: 'text', req: true },
    { k: 'color', l: 'Colour', t: 'text' },
    { k: 'size', l: 'Size', t: 'text' },
    { k: 'sku', l: 'SKU', t: 'text' },
    { k: 'stock', l: 'Stock Qty', t: 'number' },
    { k: 'price', l: 'Price (Rs.)', t: 'number' }
  ],
  fulfillment: [
    { k: 'order', l: 'Order Ref', t: 'text' },
    { k: 'customer', l: 'Customer', t: 'text', req: true },
    { k: 'phone', l: 'Phone', t: 'text' },
    { k: 'city', l: 'City', t: 'text' },
    { k: 'items', l: 'Item Count', t: 'number' },
    { k: 'cod', l: 'COD Amount (Rs.)', t: 'number' },
    { k: 'courier', l: 'Courier', t: 'select', opts: ['—'].concat(typeof COURIERS !== 'undefined' ? COURIERS.map(c => c.name) : []) },
    { k: 'tracking', l: 'Tracking No.', t: 'text' },
    { k: 'status', l: 'Status', t: 'select', opts: ['Pending', 'Packed', 'Shipped', 'Delivered'] }
  ]
};

let _activeModule = '';

function statusClass(s) {
  const map = {
    'Completed': 'bg-emerald-500/20 text-emerald-300', 'Served': 'bg-emerald-500/20 text-emerald-300',
    'Received': 'bg-emerald-500/20 text-emerald-300', 'Delivered': 'bg-emerald-500/20 text-emerald-300',
    'Dispensed': 'bg-emerald-500/20 text-emerald-300', 'Ready': 'bg-emerald-500/20 text-emerald-300',
    'Active': 'bg-emerald-500/20 text-emerald-300',
    'Preparing': 'bg-amber-500/20 text-amber-300', 'In Build': 'bg-amber-500/20 text-amber-300',
    'Packing': 'bg-amber-500/20 text-amber-300', 'Checked-in': 'bg-sky-500/20 text-sky-300',
    'Testing': 'bg-cyan-500/20 text-cyan-300', 'Ordered': 'bg-cyan-500/20 text-cyan-300',
    'Packed': 'bg-sky-500/20 text-sky-300', 'Expiring': 'bg-amber-500/20 text-amber-300',
    'Confirmed': 'bg-primary/20 text-primary',
    'Pending': 'bg-slate-500/20 text-slate-300', 'Quoted': 'bg-slate-500/20 text-slate-300',
    'Expired': 'bg-rose-500/20 text-rose-300', 'No-show': 'bg-rose-500/20 text-rose-300',
    'In Transit': 'bg-amber-500/20 text-amber-300', 'Returned': 'bg-rose-500/20 text-rose-300',
    'Cancelled': 'bg-slate-500/20 text-slate-400'
  };
  return map[s] || 'bg-slate-500/20 text-slate-300';
}

function parseItems(str) {
  if (!str) return [];
  return str.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
    const m = line.match(/^(.*?)\s*(?:x|×|,)\s*(\d+)\s*$/i);
    if (m) return [m[1].trim(), Number(m[2])];
    return [line, 1];
  });
}

function itemsSummary(items) {
  if (!items || !items.length) return '<span class="text-slate-500">No items</span>';
  return items.map(i => `<span class="inline-block px-2 py-0.5 rounded bg-white/5 text-slate-300 text-[11px] m-0.5">${i[0]} ×${i[1]}</span>`).join('');
}

function moduleStatsHtml(cards) {
  return cards.map(c => `
    <div class="glass-panel p-5 rounded-2xl border-l-4 border-l-${c.tone === 'primary' ? 'primary' : c.tone + '-500'} kpi-card">
      <p class="text-xs text-slate-400 font-medium">${c.label}</p>
      <h2 class="text-2xl font-extrabold mt-1 ${c.tone === 'primary' ? 'text-primary' : 'text-' + c.tone + '-400'}">${c.value}</h2>
    </div>`).join('');
}

async function renderModule(name) {
  const host = document.getElementById('module-' + name);
  if (!host) return;
  const meta = (typeof MODULE_META !== 'undefined' && MODULE_META[name]) || { title: name, sub: '', icon: 'fa-cube', tone: 'primary', addLabel: 'Add' };
  const records = await api.getModule(name);

  const header = `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-100"><i class="fa-solid ${meta.icon} mr-2 ${TONE_TEXT[meta.tone] || 'text-primary'}"></i>${meta.title}</h2>
        <p class="text-xs text-slate-400">${meta.sub}</p>
      </div>
      <button onclick="moduleAdd('${name}')" class="px-4 py-2.5 btn-primary text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2">
        <i class="fa-solid fa-plus"></i> ${meta.addLabel}
      </button>
    </div>`;

  let stats = '', body = '';

  if (name === 'kitchen') {
    const byStatus = s => records.filter(r => r.status === s).length;
    stats = `<div class="grid grid-cols-2 lg:grid-cols-4 gap-5">${moduleStatsHtml([
      { label: 'Preparing', value: byStatus('Preparing'), tone: 'amber' },
      { label: 'Ready to Serve', value: byStatus('Ready'), tone: 'emerald' },
      { label: 'Served Today', value: byStatus('Served'), tone: 'cyan' },
      { label: 'Total Tickets', value: records.length, tone: 'primary' }
    ])}</div>`;
    body = renderKitchen(records);
  } else if (name === 'warranty') {
    const c = s => records.filter(r => r.status === s).length;
    stats = `<div class="grid grid-cols-2 lg:grid-cols-4 gap-5">${moduleStatsHtml([
      { label: 'Active', value: c('Active'), tone: 'emerald' },
      { label: 'Expiring Soon', value: c('Expiring'), tone: 'amber' },
      { label: 'Expired', value: c('Expired'), tone: 'rose' },
      { label: 'Total Registered', value: records.length, tone: 'primary' }
    ])}</div>`;
    body = renderWarranty(records);
  } else if (name === 'variants') {
    const low = records.filter(r => Number(r.stock) < 5).length;
    const units = records.reduce((s, r) => s + Number(r.stock || 0), 0);
    stats = `<div class="grid grid-cols-2 lg:grid-cols-4 gap-5">${moduleStatsHtml([
      { label: 'Variants (SKUs)', value: records.length, tone: 'rose' },
      { label: 'Low Stock (<5)', value: low, tone: 'amber' },
      { label: 'Total Units', value: units, tone: 'cyan' },
      { label: 'Avg Price', value: 'Rs. ' + (records.length ? Math.round(records.reduce((s, r) => s + Number(r.price || 0), 0) / records.length).toLocaleString() : 0), tone: 'primary' }
    ])}</div>`;
    body = renderVariants(records);
  } else if (name === 'fulfillment') {
    const c = s => records.filter(r => r.status === s).length;
    const transit = records.filter(r => ['Packed', 'Shipped'].includes(r.status));
    const codTransit = transit.reduce((s, r) => s + Number(r.cod || 0), 0);
    stats = `<div class="grid grid-cols-2 lg:grid-cols-5 gap-5">${moduleStatsHtml([
      { label: 'Pending Dispatch', value: c('Pending'), tone: 'amber' },
      { label: 'In Transit', value: transit.length, tone: 'cyan' },
      { label: 'Delivered', value: c('Delivered'), tone: 'emerald' },
      { label: 'Cancelled', value: c('Cancelled'), tone: 'violet' },
      { label: 'Returned · COD ' + (codTransit > 0 ? 'in transit Rs. ' + codTransit.toLocaleString() : ''), value: c('Returned'), tone: 'rose' }
    ])}</div>`;
    body = renderFulfillment(records);
  } else {
    // purchase / builds / bulk / prescriptions / appointments → table
    const flow = MODULE_FLOW[name] || [];
    const counts = {};
    flow.forEach(s => counts[s] = records.filter(r => r.status === s).length);
    const toneSeq = ['amber', 'cyan', 'emerald', 'primary'];
    const cards = flow.slice(0, 3).map((s, i) => ({ label: s, value: counts[s], tone: toneSeq[i] }));
    cards.push({ label: 'Total', value: records.length, tone: 'primary' });
    const totalKey = (name === 'purchase' || name === 'builds' || name === 'bulk') ? 'total' : (name === 'appointments' ? 'price' : null);
    if (totalKey) {
      const sum = records.reduce((s, r) => s + Number(r[totalKey] || 0), 0);
      cards[3] = { label: 'Total Value', value: 'Rs. ' + sum.toLocaleString(), tone: 'primary' };
    }
    stats = `<div class="grid grid-cols-2 lg:grid-cols-4 gap-5">${moduleStatsHtml(cards)}</div>`;
    body = renderModuleTable(name, records);
  }

  host.innerHTML = header + stats + body;
}

// ---------- Kitchen kanban ----------
function renderKitchen(records) {
  const cols = ['Preparing', 'Ready', 'Served'];
  const colTone = { Preparing: 'border-amber-500/40', Ready: 'border-emerald-500/40', Served: 'border-slate-500/40' };
  return `<div class="grid grid-cols-1 md:grid-cols-3 gap-5">` + cols.map(col => {
    const list = records.filter(r => r.status === col);
    return `
      <div class="space-y-3">
        <div class="flex items-center justify-between border-b-2 ${colTone[col]} pb-2">
          <h3 class="font-bold text-slate-200 text-sm">${col}</h3>
          <span class="text-xs font-bold text-slate-400">${list.length}</span>
        </div>
        ${list.length ? list.map(r => `
          <div class="glass-panel p-4 rounded-xl space-y-2 section-enter">
            <div class="flex items-center justify-between">
              <span class="font-mono font-bold text-primary text-sm">${r.id}</span>
              <span class="text-[10px] text-slate-400"><i class="fa-regular fa-clock mr-1"></i>${r.placed || '—'}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-300">
              <span class="px-2 py-0.5 rounded bg-white/5 font-bold">${r.table || '-'}</span>
              <span><i class="fa-solid fa-user-group mr-1 text-slate-500"></i>${r.party || 1}</span>
              <span class="text-slate-400"><i class="fa-solid fa-user mr-1"></i>${r.waiter || '—'}</span>
            </div>
            <div class="text-[11px]">${itemsSummary(r.items)}</div>
            <div class="flex gap-1 pt-1">
              ${col !== 'Served' ? `<button onclick="advanceModule('kitchen','${r.id}')" class="flex-1 py-1.5 text-[11px] font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 rounded-lg transition">Move →</button>` : ''}
              <button onclick="deleteModule('kitchen','${r.id}')" class="px-2.5 py-1.5 text-[11px] text-rose-400 hover:bg-rose-500/10 rounded-lg transition"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>`).join('') : `<p class="text-xs text-slate-600 text-center py-6">Empty</p>`}
      </div>`;
  }).join('') + `</div>`;
}

// ---------- Warranty ----------
function renderWarranty(records) {
  if (!records.length) return emptyState('No warranty records yet.');
  return tableWrap(['Product', 'IMEI / Serial', 'Customer', 'Sold', 'Warranty', 'Expiry', 'Status', ''], records.map((r, i) => `
    <tr class="border-b border-white/5 hover:bg-white/5 transition-all table-row-enter" style="animation-delay:${i * 0.04}s">
      <td class="px-4 py-3 font-semibold text-slate-100">${r.product}</td>
      <td class="px-4 py-3 font-mono text-xs text-slate-400">${r.imei || '—'}</td>
      <td class="px-4 py-3 text-xs text-slate-300">${r.customer || '—'}</td>
      <td class="px-4 py-3 text-xs text-slate-400">${r.sold || '—'}</td>
      <td class="px-4 py-3 text-xs text-slate-300">${r.months ? r.months + ' mo' : '—'}</td>
      <td class="px-4 py-3 text-xs text-slate-300">${r.expiry || '—'}</td>
      <td class="px-4 py-3"><span class="px-2 py-0.5 rounded text-xs font-semibold ${statusClass(r.status)}">${r.status}</span></td>
      <td class="px-4 py-3 text-right"><button onclick="deleteModule('warranty','${r.id}')" class="px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition"><i class="fa-solid fa-trash"></i></button></td>
    </tr>`).join(''));
}

// ---------- Variants ----------
function renderVariants(records) {
  if (!records.length) return emptyState('No variants yet.');
  return tableWrap(['Style', 'Colour', 'Size', 'SKU', 'Stock', 'Price', ''], records.map((r, i) => {
    const low = Number(r.stock) < 5;
    return `
    <tr class="border-b border-white/5 hover:bg-white/5 transition-all table-row-enter" style="animation-delay:${i * 0.04}s">
      <td class="px-4 py-3 font-semibold text-slate-100">${r.product}</td>
      <td class="px-4 py-3 text-xs text-slate-300"><span class="inline-block w-3 h-3 rounded-full mr-2 align-middle" style="background:${colorSwatch(r.color)}"></span>${r.color || '—'}</td>
      <td class="px-4 py-3 text-xs font-bold text-slate-200">${r.size || '—'}</td>
      <td class="px-4 py-3 font-mono text-xs text-slate-400">${r.sku || '—'}</td>
      <td class="px-4 py-3 text-sm font-extrabold ${low ? 'text-rose-400' : 'text-emerald-400'}">${r.stock}${low ? ' <span class="text-[10px] text-rose-400">LOW</span>' : ''}</td>
      <td class="px-4 py-3 text-xs font-semibold text-slate-300">Rs. ${Number(r.price || 0).toLocaleString()}</td>
      <td class="px-4 py-3 text-right"><button onclick="deleteModule('variants','${r.id}')" class="px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition"><i class="fa-solid fa-trash"></i></button></td>
    </tr>`;
  }).join(''));
}

function colorSwatch(name) {
  const map = { black: '#111827', white: '#f8fafc', blue: '#3b82f6', sky: '#38bdf8', grey: '#94a3b8', gray: '#94a3b8', yellow: '#facc15', floral: '#f472b6', red: '#ef4444', green: '#22c55e', navy: '#1e3a8a', maroon: '#7f1d1d' };
  return map[String(name || '').toLowerCase()] || '#64748b';
}

// ---------- Fulfilment / COD kanban ----------
function renderFulfillment(records) {
  const cols = ['Pending', 'Packed', 'Shipped', 'Delivered'];
  const tone = { Pending: 'border-amber-500/40', Packed: 'border-cyan-500/40', Shipped: 'border-violet-500/40', Delivered: 'border-emerald-500/40' };
  const courierOpts = (cur) => ['—'].concat(typeof COURIERS !== 'undefined' ? COURIERS.map(c => c.name) : [])
    .map(n => `<option ${n === (cur || '—') ? 'selected' : ''}>${n}</option>`).join('');
  const board = `<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">` + cols.map(col => {
    const list = records.filter(r => r.status === col);
    const codSum = list.reduce((s, r) => s + Number(r.cod || 0), 0);
    return `
      <div class="space-y-3">
        <div class="flex items-center justify-between border-b-2 ${tone[col]} pb-2">
          <h3 class="font-bold text-slate-200 text-sm">${col}</h3>
          <span class="text-xs font-bold text-slate-400">${list.length} · Rs. ${codSum.toLocaleString()}</span>
        </div>
        ${list.length ? list.map(r => `
          <div class="glass-panel p-4 rounded-xl space-y-2 section-enter">
            <div class="flex items-center justify-between">
              <span class="font-mono font-bold text-primary text-xs">${r.order || r.id}</span>
              <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">COD Rs. ${Number(r.cod || 0).toLocaleString()}</span>
            </div>
            <p class="font-semibold text-slate-100 text-sm">${r.customer || '—'}</p>
            <div class="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <span><i class="fa-solid fa-location-dot mr-1"></i>${r.city || '—'}</span>
              <span><i class="fa-solid fa-box mr-1"></i>${r.items || 0} item(s)</span>
              ${r.placed ? `<span><i class="fa-regular fa-clock mr-1"></i>${r.placed}</span>` : ''}
            </div>
            <div class="flex items-center gap-2">
              <select onchange="assignCourier('${r.id}', this.value)" class="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] text-slate-200">
                ${courierOpts(r.courier)}
              </select>
              <span class="text-[10px] font-mono text-slate-500 truncate max-w-[90px]" title="${r.tracking || ''}">${r.tracking || 'no tracking'}</span>
            </div>
            <div class="flex gap-1 pt-1">
              ${col !== 'Delivered' ? `<button onclick="advanceModule('fulfillment','${r.id}')" class="flex-1 py-1.5 text-[11px] font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 rounded-lg transition">Move →</button>` : ''}
              ${col === 'Pending' || col === 'Packed' ? `<button onclick="cancelFulfillment('${r.id}')" class="py-1.5 px-2 text-[11px] font-bold bg-slate-500/15 hover:bg-slate-500/25 text-slate-300 rounded-lg transition" title="Cancel order"><i class="fa-solid fa-ban"></i></button>` : ''}
              ${col === 'Shipped' || col === 'Delivered' ? `<button onclick="markReturned('${r.id}')" class="py-1.5 px-2 text-[11px] font-bold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 rounded-lg transition" title="Mark Returned"><i class="fa-solid fa-rotate-left"></i></button>` : ''}
              <button onclick="deleteModule('fulfillment','${r.id}')" class="px-2.5 py-1.5 text-[11px] text-rose-400 hover:bg-rose-500/10 rounded-lg transition"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>`).join('') : `<p class="text-xs text-slate-600 text-center py-6">Empty</p>`}
      </div>`;
  }).join('') + `</div>`;

  const exceptions = records.filter(r => r.status === 'Cancelled' || r.status === 'Returned');
  if (!exceptions.length) return board;
  const exRow = r => `
    <div class="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white/5">
      <div class="min-w-0">
        <p class="font-semibold text-slate-100 text-sm">${r.customer || '—'} <span class="text-slate-500 font-normal">· ${r.city || ''}</span></p>
        <p class="text-[10px] text-slate-500 truncate">${r.order || r.id} · ${r.reason || 'No reason given'}</p>
      </div>
      <div class="text-right shrink-0">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${statusClass(r.status)}">${r.status}</span>
        <p class="text-xs font-bold text-rose-300 mt-1">Rs. ${Number(r.cod || 0).toLocaleString()}</p>
      </div>
    </div>`;
  const cancelled = exceptions.filter(r => r.status === 'Cancelled');
  const returned = exceptions.filter(r => r.status === 'Returned');
  return board + `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
      <div class="glass-panel p-5 rounded-2xl">
        <h3 class="font-bold text-slate-300 text-sm mb-3"><i class="fa-solid fa-ban mr-2 text-slate-400"></i>Cancelled Orders (${cancelled.length})</h3>
        <div class="space-y-2">${cancelled.length ? cancelled.map(exRow).join('') : emptySig('No cancelled orders.')}</div>
      </div>
      <div class="glass-panel p-5 rounded-2xl">
        <h3 class="font-bold text-rose-300 text-sm mb-3"><i class="fa-solid fa-rotate-left mr-2"></i>Returned Orders (${returned.length})</h3>
        <div class="space-y-2">${returned.length ? returned.map(exRow).join('') : emptySig('No returned orders.')}</div>
      </div>
    </div>`;
}

async function markReturned(id) {
  const reason = prompt('Reason for return?', 'Customer refused at door');
  if (reason === null) return;
  await api.updateModuleItem('fulfillment', id, { status: 'Returned', reason: reason || 'Returned' });
  await renderModule('fulfillment');
  toast('Marked as Returned', 'info');
}

async function cancelFulfillment(id) {
  const reason = prompt('Reason for cancellation?', 'Customer cancelled');
  if (reason === null) return;
  await api.updateModuleItem('fulfillment', id, { status: 'Cancelled', reason: reason || 'Cancelled' });
  await renderModule('fulfillment');
  toast('Order cancelled', 'info');
}

async function assignCourier(id, courier) {
  const c = (typeof courierByName === 'function') ? courierByName(courier) : null;
  const patch = { courier };
  const list = await api.getModule('fulfillment');
  const rec = list.find(r => r.id === id);
  if (c && rec && !rec.tracking) patch.tracking = c.prefix + Math.floor(1000000 + Math.random() * 8999999);
  await api.updateModuleItem('fulfillment', id, patch);
  await renderModule('fulfillment');
  toast(c ? 'Assigned to ' + courier : 'Courier updated', 'success');
}

// ---------- Courier services board ----------
async function renderCouriers() {
  const host = document.getElementById('module-couriers');
  if (!host) return;
  const meta = (typeof MODULE_META !== 'undefined' && MODULE_META.couriers) || { title: 'Courier Services', sub: '', icon: 'fa-truck-fast', tone: 'sky' };
  const settings = (typeof api.getCourierSettings === 'function') ? await api.getCourierSettings() : {};
  const ff = await api.getModule('fulfillment');
  const money = v => 'Rs. ' + Number(v || 0).toLocaleString();

  const statsFor = (name) => {
    const list = ff.filter(r => r.courier === name);
    const delivered = list.filter(r => r.status === 'Delivered');
    const returned = list.filter(r => r.status === 'Returned');
    const transit = list.filter(r => ['Pending', 'Packed', 'Shipped'].includes(r.status));
    const done = delivered.length + returned.length;
    const success = done ? Math.round((delivered.length / done) * 100) : 0;
    return {
      total: list.length, delivered: delivered.length, returned: returned.length,
      transit: transit.length, cod: delivered.reduce((s, r) => s + Number(r.cod || 0), 0), success
    };
  };

  const cards = COURIERS.map(c => {
    const on = settings[c.id] !== false;
    const s = statsFor(c.name);
    return `
      <div class="glass-panel p-5 rounded-2xl space-y-3 ${on ? '' : 'opacity-60'}">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <span class="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-sky-400 text-lg"><i class="fa-solid ${c.icon}"></i></span>
            <div>
              <p class="font-bold text-slate-100">${c.name}</p>
              <p class="text-[11px] text-slate-400">${c.zones} · base Rs. ${c.base}</p>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${on ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-400'}">${on ? 'Connected' : 'Disabled'}</span>
        </div>
        <div class="grid grid-cols-4 gap-2 text-center">
          <div class="p-2 rounded-lg bg-white/5"><p class="text-sm font-extrabold text-slate-100">${s.total}</p><p class="text-[10px] text-slate-500">Orders</p></div>
          <div class="p-2 rounded-lg bg-white/5"><p class="text-sm font-extrabold text-emerald-400">${s.delivered}</p><p class="text-[10px] text-slate-500">Delivered</p></div>
          <div class="p-2 rounded-lg bg-white/5"><p class="text-sm font-extrabold text-rose-400">${s.returned}</p><p class="text-[10px] text-slate-500">Returned</p></div>
          <div class="p-2 rounded-lg bg-white/5"><p class="text-sm font-extrabold text-amber-400">${s.transit}</p><p class="text-[10px] text-slate-500">Transit</p></div>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-400">COD collected <strong class="text-emerald-300">${money(s.cod)}</strong></span>
          <span class="text-slate-400">Success <strong class="${s.success >= 80 ? 'text-emerald-300' : s.success >= 50 ? 'text-amber-300' : 'text-rose-300'}">${s.success}%</strong></span>
        </div>
        <button onclick="toggleCourier('${c.id}')" class="w-full py-2 rounded-xl text-xs font-bold ${on ? 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25' : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'} transition">
          <i class="fa-solid ${on ? 'fa-plug-circle-xmark' : 'fa-plug'} mr-1"></i>${on ? 'Disconnect' : 'Connect'}
        </button>
      </div>`;
  }).join('');

  host.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-100"><i class="fa-solid ${meta.icon} mr-2 text-sky-400"></i>${meta.title}</h2>
        <p class="text-xs text-slate-400">${meta.sub}</p>
      </div>
      <span class="px-3 py-1.5 rounded-xl bg-sky-500/15 text-sky-300 text-xs font-bold border border-sky-500/30"><i class="fa-solid fa-plug mr-1"></i>${COURIERS.filter(c => settings[c.id] !== false).length} connected</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">${cards}</div>`;
}

async function toggleCourier(id) {
  await api.toggleCourier(id);
  await renderCouriers();
  toast('Courier updated', 'success');
}

// ---------- Generic tables per module ----------
function renderModuleTable(name, records) {
  if (!records.length) return emptyState('Nothing here yet. Click the button above to add.');
  const flow = MODULE_FLOW[name] || [];
  const actionCell = (r) => {
    const idx = flow.indexOf(r.status);
    const next = idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
    return `<div class="space-x-1 whitespace-nowrap text-right">
      ${next ? `<button onclick="advanceModule('${name}','${r.id}')" class="px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"><i class="fa-solid fa-forward"></i> ${next}</button>` : ''}
      <button onclick="deleteModule('${name}','${r.id}')" class="px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition"><i class="fa-solid fa-trash"></i></button>
    </div>`;
  };

  if (name === 'purchase' || name === 'bulk') {
    const titleCol = name === 'purchase' ? 'Supplier' : 'Institution';
    return tableWrap([titleCol, 'Items', 'Total', 'Status', 'Date', 'Expected', ''], records.map((r, i) => `
      <tr class="border-b border-white/5 hover:bg-white/5 transition-all table-row-enter" style="animation-delay:${i * 0.04}s">
        <td class="px-4 py-3 font-semibold text-slate-100">${r.supplier || r.institution || '—'}<p class="text-[10px] text-slate-500">${r.id}</p></td>
        <td class="px-4 py-3 max-w-[220px]">${itemsSummary(r.items)}</td>
        <td class="px-4 py-3 text-xs font-extrabold text-emerald-400">Rs. ${Number(r.total || 0).toLocaleString()}</td>
        <td class="px-4 py-3"><span class="px-2 py-0.5 rounded text-xs font-semibold ${statusClass(r.status)}">${r.status}</span></td>
        <td class="px-4 py-3 text-xs text-slate-400">${r.date || r.due || '—'}</td>
        <td class="px-4 py-3 text-xs text-slate-400">${r.expected || r.contact || '—'}</td>
        <td class="px-4 py-3">${actionCell(r)}</td>
      </tr>`).join(''));
  }

  if (name === 'prescriptions') {
    return tableWrap(['Patient', 'Doctor', 'Medicines', 'Date', 'Status', ''], records.map((r, i) => `
      <tr class="border-b border-white/5 hover:bg-white/5 transition-all table-row-enter" style="animation-delay:${i * 0.04}s">
        <td class="px-4 py-3 font-semibold text-slate-100">${r.patient}<p class="text-[10px] text-slate-500 font-mono">${r.id}</p></td>
        <td class="px-4 py-3 text-xs text-slate-300">${r.doctor || '—'}</td>
        <td class="px-4 py-3 max-w-[280px]">${itemsSummary(r.meds)}</td>
        <td class="px-4 py-3 text-xs text-slate-400">${r.date || '—'}</td>
        <td class="px-4 py-3"><span class="px-2 py-0.5 rounded text-xs font-semibold ${statusClass(r.status)}">${r.status}</span></td>
        <td class="px-4 py-3">${actionCell(r)}</td>
      </tr>`).join(''));
  }

  if (name === 'appointments') {
    return tableWrap(['Client', 'Service', 'Stylist', 'Time', 'Price', 'Status', ''], records.map((r, i) => `
      <tr class="border-b border-white/5 hover:bg-white/5 transition-all table-row-enter" style="animation-delay:${i * 0.04}s">
        <td class="px-4 py-3 font-semibold text-slate-100">${r.client}<p class="text-[10px] text-slate-500 font-mono">${r.id}</p></td>
        <td class="px-4 py-3 text-xs text-slate-300">${r.service || '—'}</td>
        <td class="px-4 py-3 text-xs text-slate-300"><i class="fa-solid fa-scissors mr-1 text-pink-400"></i>${r.stylist || '—'}</td>
        <td class="px-4 py-3 text-xs font-mono text-slate-400">${r.time || '—'}</td>
        <td class="px-4 py-3 text-xs font-extrabold text-emerald-400">Rs. ${Number(r.price || 0).toLocaleString()}</td>
        <td class="px-4 py-3"><span class="px-2 py-0.5 rounded text-xs font-semibold ${statusClass(r.status)}">${r.status}</span></td>
        <td class="px-4 py-3">${actionCell(r)}</td>
      </tr>`).join(''));
  }

  if (name === 'builds') {
    return tableWrap(['Build', 'Customer', 'Specs', 'Total', 'Status', 'Due', ''], records.map((r, i) => `
      <tr class="border-b border-white/5 hover:bg-white/5 transition-all table-row-enter" style="animation-delay:${i * 0.04}s">
        <td class="px-4 py-3 font-semibold text-slate-100">${r.name}<p class="text-[10px] text-slate-500 font-mono">${r.id}</p></td>
        <td class="px-4 py-3 text-xs text-slate-300">${r.customer || '—'}</td>
        <td class="px-4 py-3 text-[11px] text-slate-400">${[r.cpu, r.gpu, r.ram, r.ssd].filter(Boolean).map(x => `<span class="inline-block px-1.5 py-0.5 rounded bg-white/5 m-0.5">${x}</span>`).join('')}</td>
        <td class="px-4 py-3 text-xs font-extrabold text-emerald-400">Rs. ${Number(r.total || 0).toLocaleString()}</td>
        <td class="px-4 py-3"><span class="px-2 py-0.5 rounded text-xs font-semibold ${statusClass(r.status)}">${r.status}</span></td>
        <td class="px-4 py-3 text-xs text-slate-400">${r.due || '—'}</td>
        <td class="px-4 py-3">${actionCell(r)}</td>
      </tr>`).join(''));
  }

  return emptyState('Unknown module.');
}

function tableWrap(headers, rows) {
  return `
    <div class="glass-panel p-6 rounded-2xl overflow-x-auto">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="text-xs uppercase bg-white/5 text-slate-400 border-b border-white/10">
          <tr>${headers.map((h, i) => `<th class="px-4 py-3 ${i === headers.length - 1 ? 'text-right' : ''}">${h}</th>`).join('')}</tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function emptyState(msg) {
  return `<div class="glass-panel p-10 rounded-2xl text-center text-slate-500 text-sm">${msg}</div>`;
}

// ---------- Actions ----------
async function advanceModule(name, id) {
  const flow = MODULE_FLOW[name] || [];
  const list = await api.getModule(name);
  const rec = list.find(r => r.id === id);
  if (!rec) return;
  const idx = flow.indexOf(rec.status);
  const next = flow[Math.min(idx + 1, flow.length - 1)];
  await api.updateModuleItem(name, id, { status: next });
  await renderModule(name);
  toast(`Moved to "${next}"`, 'success');
}

async function deleteModule(name, id) {
  await api.deleteModuleItem(name, id);
  await renderModule(name);
  toast('Removed', 'info');
}

// ---------- Add modal ----------
function openModuleModal() { document.getElementById('module-modal').classList.remove('hidden'); }
function closeModuleModal() { document.getElementById('module-modal').classList.add('hidden'); }

function moduleAdd(name) {
  _activeModule = name;
  const meta = MODULE_META[name] || { addLabel: 'Add Item' };
  document.getElementById('module-modal-title').innerText = meta.addLabel;
  const fields = MODULE_SCHEMA[name] || [];
  document.getElementById('module-form-fields').innerHTML = fields.map(f => {
    const cls = 'w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200';
    if (f.t === 'select') {
      return `<div><label class="text-xs font-semibold text-slate-400">${f.l}</label>
        <select id="mf-${f.k}" class="${cls}">${f.opts.map(o => `<option>${o}</option>`).join('')}</select></div>`;
    }
    if (f.t === 'textarea') {
      return `<div><label class="text-xs font-semibold text-slate-400">${f.l}</label>
        <textarea id="mf-${f.k}" rows="3" class="${cls}" ${f.req ? 'required' : ''}></textarea></div>`;
    }
    return `<div class="${f.t === 'number' ? 'inline-block w-1/2 pr-1' : 'block'}"><label class="text-xs font-semibold text-slate-400">${f.l}</label>
      <input type="${f.t}" id="mf-${f.k}" class="${cls}" ${f.req ? 'required' : ''}></div>`;
  }).join('');
  openModuleModal();
}

async function submitModule(e) {
  e.preventDefault();
  const name = _activeModule;
  const fields = MODULE_SCHEMA[name] || [];
  const rec = {};
  fields.forEach(f => {
    const el = document.getElementById('mf-' + f.k);
    let v = el ? el.value : '';
    if (f.t === 'number') v = parseFloat(v || 0);
    if (f.k === 'items' || f.k === 'meds') v = parseItems(v);
    rec[f.k] = v;
  });
  try {
    await api.addModuleItem(name, rec);
    closeModuleModal();
    e.target.reset();
    await renderModule(name);
    toast('Saved', 'success');
  } catch (err) {
    toast('Error saving', 'error');
  }
}
