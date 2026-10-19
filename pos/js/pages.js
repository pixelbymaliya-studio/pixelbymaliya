// =====================================================================
// PIXEL BY MALIYA POS — SECONDARY PAGES
// Tables, Categories, Customers, Suppliers, Stock, Expiry, Repairs,
// Invoices, Payments, Reports
// =====================================================================

// ---------- Tables & Floor ----------
function renderTables() {
  const grid = document.getElementById('tables-grid');
  const biz = getBusiness();
  if (!grid || !biz) return;
  const tables = biz.tables || [];
  const title = document.getElementById('tables-title');
  if (title) title.innerText = biz.id === 'salon' ? 'Styling Stations & Seats' : 'Floor & Table Layout';

  grid.innerHTML = tables.map((tb, i) => {
    const color = tb.status === 'VACANT' ? 'from-emerald-500/20 border-emerald-500/40'
      : tb.status === 'RESERVED' ? 'from-amber-500/20 border-amber-500/40'
      : 'from-rose-500/20 border-rose-500/40';
    const dot = tb.status === 'VACANT' ? 'bg-emerald-500' : tb.status === 'RESERVED' ? 'bg-amber-500' : 'bg-rose-500';
    return `
      <button onclick="startTableOrder('${tb.no}')" class="glass-panel p-5 rounded-2xl border text-left transition-all hover:-translate-y-1 hover:shadow-xl table-row-enter" style="animation-delay:${i * 0.04}s">
        <div class="flex items-center justify-between">
          <span class="w-3 h-3 rounded-full ${dot} animate-pulse"></span>
          <span class="text-[10px] font-bold text-slate-400 uppercase">${tb.zone}</span>
        </div>
        <h3 class="text-2xl font-black text-white mt-3">${tb.no}</h3>
        <p class="text-xs text-slate-400 mt-1">${tb.seats} ${tb.seats > 1 ? 'seats' : 'seat'}</p>
        <span class="inline-block mt-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${tb.status === 'VACANT' ? 'bg-emerald-500/20 text-emerald-300' : tb.status === 'RESERVED' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'}">${tb.status}</span>
      </button>`;
  }).join('');
}

function startTableOrder(no) {
  currentTable = no;
  switchTab('billing');
  const custInput = document.getElementById('cart-customer-name');
  const biz = getBusiness();
  setTimeout(() => {
    renderPosTablePills();
    if (custInput) custInput.value = biz && biz.id === 'salon' ? `Client - ${no}` : `Table ${no}`;
  }, 50);
  toast(`Started order for ${no}`, 'info');
}

// ---------- Categories ----------
async function renderCategories() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;
  const products = await api.getProducts();
  const counts = {};
  products.forEach(p => { counts[p.category || 'General'] = (counts[p.category || 'General'] || 0) + 1; });
  const palette = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#ef4444', '#84cc16'];
  const cats = Object.keys(counts);
  if (cats.length === 0) { grid.innerHTML = `<p class="text-slate-500 text-sm">No categories yet.</p>`; return; }

  grid.innerHTML = cats.map((cat, i) => {
    const c = palette[i % palette.length];
    return `
      <div class="glass-panel p-5 rounded-2xl border space-y-2 table-row-enter" style="animation-delay:${i * 0.05}s; border-color:${hexToRgba(c, 0.35)}">
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold" style="color:${c}"><i class="fa-solid fa-cubes mr-2"></i>${cat}</span>
          <span class="text-xs px-2 py-0.5 rounded font-bold" style="background:${hexToRgba(c, 0.15)}; color:${c}">${counts[cat]} items</span>
        </div>
        <p class="text-xs text-slate-400">Products grouped under the "${cat}" category.</p>
      </div>`;
  }).join('');
}

// ---------- Customers ----------
async function loadCustomers() {
  const tbody = document.getElementById('customers-table-body');
  if (!tbody) return;
  const customers = (typeof aggregateCustomers === 'function') ? await aggregateCustomers() : [];
  if (!customers || customers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-6 text-slate-500 text-sm">No customers yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = customers.map(p => {
    const status = p.orders > 3 ? 'VIP' : p.orders > 0 ? 'Returning' : 'New';
    const statusCls = p.orders > 3 ? 'bg-purple-500/20 text-purple-300' : p.orders > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-400';
    return `
      <tr class="border-b border-white/10 hover:bg-white/5 transition">
        <td class="px-4 py-3 font-semibold text-slate-200">${p.name}</td>
        <td class="px-4 py-3 text-slate-400 font-mono text-xs">${p.phone || '—'}</td>
        <td class="px-4 py-3 text-center text-slate-300">${p.orders}</td>
        <td class="px-4 py-3 text-center text-slate-400">${p.cancelled || 0}</td>
        <td class="px-4 py-3 text-center text-rose-300">${p.returned || 0}</td>
        <td class="px-4 py-3 text-right text-emerald-400 font-bold">Rs. ${Number(p.spent || 0).toFixed(2)}</td>
        <td class="px-4 py-3 text-right ${p.dues > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'}">Rs. ${Number(p.dues || 0).toFixed(2)}</td>
        <td class="px-4 py-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${statusCls}">${status}</span></td>
        <td class="px-4 py-3 text-right"><button onclick="openCustomerModal('${(p.name || '').replace(/'/g, "\\'")}')" class="text-primary hover:underline text-xs font-bold"><i class="fa-solid fa-eye mr-1"></i>View</button></td>
      </tr>`;
  }).join('');
}

// ---------- Suppliers ----------
function loadSuppliers() {
  const tbody = document.getElementById('suppliers-table-body');
  if (!tbody) return;
  const biz = getBusiness();
  const data = {
    restaurant: [['Ceylon Fresh Foods', 'Nuwan Perera', 'Meat & Seafood', 'sales@ceylonfresh.lk'], ['Lanka Beverages Co', 'Anjali Silva', 'Beverages', 'orders@lankabev.lk']],
    grocery: [['Keells Wholesale', 'Suresh Kumar', 'FMCG & Groceries', 'wholesale@keells.lk'], ['Cargills Distribution', 'Maya Perera', 'Dairy & Frozen', 'supply@cargills.lk']],
    phone: [['Singer Mobile Dist', 'Asela Fernando', 'Smartphones', 'dist@singer.lk'], ['GadgetHub Accessories', 'Ravi Raj', 'Accessories', 'b2b@gadgethub.lk']],
    computer: [['TechData Lanka', 'Kalana Perera', 'Components', 'orders@techdata.lk'], ['ASUS Sri Lanka', 'Dinesh Silva', 'Laptops', 'partner@asus.lk']],
    bookshop: [['Sarasavi Publishers', 'Rohan de Silva', 'Books', 'orders@sarasavi.lk'], ['Atlas Stationers', 'Nimali Perera', 'Stationery', 'supply@atlas.lk']],
    pharmacy: [['Ceylon Pharma Dist', 'Dr. Kumara', 'Pharmaceuticals', 'orders@cpharma.lk'], ['MedSupply Lanka', 'Iresha Silva', 'Medical Devices', 'sales@medsupply.lk']],
    salon: [['L\'Oreal Lanka', 'Hiruni Perera', 'Hair & Beauty', 'pro@loreal.lk'], ['Naturals Beauty', 'Tharindu Silva', 'Spa Products', 'orders@naturals.lk']],
    fashion: [['Vogue Textiles', 'Sanjaya Perera', 'Apparel', 'wholesale@vogue.lk'], ['Leather Craft Co', 'Amali Silva', 'Bags & Accessories', 'orders@leathercraft.lk']]
  };
  const list = data[biz?.id] || [];
  tbody.innerHTML = list.map((s, i) => `
    <tr class="border-b border-white/5 hover:bg-white/5 table-row-enter" style="animation-delay:${i * 0.05}s">
      <td class="px-4 py-3 font-bold text-white">${s[0]}</td>
      <td class="px-4 py-3 text-slate-300">${s[1]}</td>
      <td class="px-4 py-3 text-teal-300">${s[2]}</td>
      <td class="px-4 py-3 text-slate-400 text-xs">${s[3]}</td>
    </tr>`).join('');
}

// ---------- Stock ----------
async function loadStock() {
  const products = await api.getProducts();
  const list = document.getElementById('low-stock-list');
  const countEl = document.getElementById('low-stock-count');
  if (!list) return;

  // Full stock valuation (buying vs selling)
  let costTotal = 0, retailTotal = 0;
  products.forEach(p => {
    if (p.product_type === 'SERVICE') return;
    const qty = Number(p.stock_quantity || 0);
    costTotal += qty * Number(p.cost || 0);
    retailTotal += qty * Number(p.price || 0);
  });
  const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = Math.round(v).toLocaleString(); };
  setVal('stock-value-cost', costTotal);
  setVal('stock-value-retail', retailTotal);
  setVal('stock-value-profit', retailTotal - costTotal);

  const low = products.filter(p => p.product_type === 'PHYSICAL' && Number(p.stock_quantity) < 25)
    .sort((a, b) => Number(a.stock_quantity) - Number(b.stock_quantity));
  const lowCountEl = document.getElementById('stock-low-count');
  if (lowCountEl) lowCountEl.innerText = low.length;
  if (countEl) countEl.innerText = `${low.length} item(s) below reorder level`;
  if (low.length === 0) { list.innerHTML = `<p class="text-xs text-slate-500">All stock levels are healthy.</p>`; return; }
  list.innerHTML = low.map((p, i) => {
    const qty = Number(p.stock_quantity);
    return `
      <div class="p-3 bg-white/5 rounded-xl flex items-center justify-between border ${qty < 10 ? 'border-rose-500/40' : 'border-amber-500/30'} table-row-enter" style="animation-delay:${i * 0.04}s">
        <span class="text-slate-200">${p.emoji || ''} <strong>${p.name}</strong> (${qty} ${p.unit || 'pcs'} left)</span>
        <span class="${qty < 10 ? 'text-rose-400' : 'text-amber-400'} font-bold">${qty < 10 ? 'Critical' : 'Reorder'}</span>
      </div>`;
  }).join('');
}

// ---------- Expiry & Batches ----------
async function loadExpiryData() {
  const products = await api.getProducts();
  const tbody = document.getElementById('expiry-table-body');
  if (!tbody) return;
  const withExpiry = products.filter(p => p.attributes && p.attributes.expiry_date);
  let soon = 0, expired = 0, healthy = 0;
  const rows = withExpiry.map((p, i) => {
    const exp = new Date(p.attributes.expiry_date);
    const days = Math.ceil((exp - new Date()) / 86400000);
    let status, cls;
    if (days < 0) { status = `Expired ${Math.abs(days)}d ago`; cls = 'bg-rose-500/20 text-rose-300'; expired++; }
    else if (days <= 30) { status = `${days}d left`; cls = 'bg-amber-500/20 text-amber-300'; soon++; }
    else { status = `${days}d left`; cls = 'bg-emerald-500/20 text-emerald-300'; healthy++; }
    return `
      <tr class="border-b border-white/5 hover:bg-white/5 table-row-enter" style="animation-delay:${i * 0.04}s">
        <td class="px-4 py-3 font-bold text-slate-200">${p.emoji || ''} ${p.name}</td>
        <td class="px-4 py-3 text-slate-400 font-mono text-xs">${p.attributes.batch_no || '-'}</td>
        <td class="px-4 py-3 text-slate-300 text-xs">${p.stock_quantity} ${p.unit || 'pcs'}</td>
        <td class="px-4 py-3 text-slate-300 font-mono text-xs">${p.attributes.expiry_date}</td>
        <td class="px-4 py-3"><span class="px-2 py-0.5 rounded text-[11px] font-bold ${cls}">${status}</span></td>
      </tr>`;
  });
  tbody.innerHTML = rows.join('') || `<tr><td colspan="5" class="text-center py-4 text-slate-500">No expiry-tracked items.</td></tr>`;
  const s = document.getElementById('exp-soon'), e = document.getElementById('exp-expired'), h = document.getElementById('exp-healthy');
  if (s) s.innerText = soon;
  if (e) e.innerText = expired;
  if (h) h.innerText = healthy;
}

// ---------- Repairs & Service ----------
function renderRepairs() {
  const grid = document.getElementById('repairs-grid');
  if (!grid) return;
  const biz = getBusiness();
  const isPhone = biz?.id === 'phone';
  const jobs = isPhone ? [
    ['iPhone 13', 'Screen Replacement', 'JC-4001', 'In Progress', 'Dilan M.', 'SN-IP13-88210'],
    ['Samsung A32', 'Battery Replacement', 'JC-4002', 'Ready', 'Dilan M.', 'SN-SA32-11920'],
    ['Xiaomi Redmi 9', 'Charging Port', 'JC-4003', 'Waiting Parts', 'Tharindu P.', 'SN-XR9-55230']
  ] : [
    ['Dell Inspiron 15', 'Keyboard Replacement', 'JC-5001', 'In Progress', 'Buddhika R.', 'SN-DE15-77120'],
    ['Custom Gaming PC', 'Thermal Paste & Cleaning', 'JC-5002', 'Ready', 'Isuru N.', 'SN-PC-99010'],
    ['HP Pavilion', 'SSD Upgrade + OS', 'JC-5003', 'Waiting Parts', 'Buddhika R.', 'SN-HP-44320']
  ];
  const statusColor = { 'In Progress': 'bg-blue-500/20 text-blue-300', 'Ready': 'bg-emerald-500/20 text-emerald-300', 'Waiting Parts': 'bg-amber-500/20 text-amber-300' };
  grid.innerHTML = jobs.map((j, i) => `
    <div class="glass-panel p-5 rounded-2xl space-y-3 table-row-enter" style="animation-delay:${i * 0.06}s">
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-mono text-slate-400">${j[2]}</span>
        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${statusColor[j[3]] || 'bg-white/10 text-slate-300'}">${j[3]}</span>
      </div>
      <h3 class="font-bold text-white">${j[0]}</h3>
      <p class="text-xs text-slate-400">${j[1]}</p>
      <div class="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <span><i class="fa-solid fa-user-gear mr-1"></i>${j[4]}</span>
        <span class="font-mono">${j[5]}</span>
      </div>
    </div>`).join('');
}

// ---------- Invoices ----------
async function loadInvoices() {
  const tbody = document.getElementById('invoices-table-body');
  if (!tbody) return;
  const orders = await api.getOrders();
  if (orders.length === 0) { tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-slate-500">No invoices yet.</td></tr>`; return; }
  tbody.innerHTML = orders.slice().reverse().map((o, i) => `
    <tr class="border-b border-white/5 hover:bg-white/5 table-row-enter" style="animation-delay:${i * 0.04}s">
      <td class="px-4 py-3 font-mono font-bold text-primary">${o.id || 'INV'}</td>
      <td class="px-4 py-3 text-slate-300 text-xs">${o.customer_name || 'Walk-in'}</td>
      <td class="px-4 py-3 text-slate-400">Rs. ${Number(o.subtotal || 0).toFixed(2)}</td>
      <td class="px-4 py-3 text-slate-400">Rs. ${Number(o.tax_amount || 0).toFixed(2)}</td>
      <td class="px-4 py-3 font-bold text-emerald-400">Rs. ${Number(o.total ?? o.total_amount ?? 0).toFixed(2)}</td>
    </tr>`).join('');
}

// ---------- Payments ----------
async function loadPayments() {
  const stats = await api.getDashboardStats();
  const b = stats.paymentBreakdown || {};
  const set = (id, v) => { const el = document.getElementById(id); if (el) animateCount(el, Number(v || 0)); };
  set('pay-cash', b.CASH || 0);
  set('pay-card', b.CARD || 0);
  set('pay-upi', b.UPI || 0);
}

// ---------- Reports ----------
async function loadReports() {
  const stats = await api.getDashboardStats();
  const rev = Number(stats.totalIncome || 0);
  const exp = Number(stats.totalExpenses || 0);
  const profit = Number(stats.netProfit || 0);
  const set = (id, v, prefix) => { const el = document.getElementById(id); if (el) el.innerText = prefix + v.toFixed(2); };
  set('rep-revenue', rev, 'Rs. ');
  set('rep-expenses', exp, '- Rs. ');
  set('rep-profit', profit, 'Rs. ');
}
