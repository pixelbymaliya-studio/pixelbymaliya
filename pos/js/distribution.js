// =====================================================================
// PIXEL BY MALIYA POS — DISTRIBUTION MANAGEMENT SYSTEM (DMS)
// Wholesale distribution to retailer shops (Kadawatha area).
// Sales recording: cash / credit / cheque / partial, with retailer
// ledgers, ageing, van routes, loads, returns & reports.
// =====================================================================

const DIST_LOCAL_KEY = 'pixel_distribution_v1';
let DIST = {
  initialized: false,
  routes: [], vans: [], reps: [], retailers: [], products: [],
  stock: {}, invoices: [], payments: [], returns: [], loads: [], view: 'overview'
};

let distInitializedData = false;
let distStockTab = 'main';
let distLorryVan = null;

// ---------- helpers ----------
const dMoney = (v) => 'Rs. ' + Number(v || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dEsc = (s) => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const dUid = (p) => p + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,6);
function distSave() { try { localStorage.setItem(DIST_LOCAL_KEY, JSON.stringify(DIST)); } catch(e){} }
function distLoad() { try { const raw = localStorage.getItem(DIST_LOCAL_KEY); if (raw) { const parsed = JSON.parse(raw); if (parsed && parsed.initialized) { Object.assign(DIST, parsed); distInitializedData = true; } } } catch(e){} }
function distDays(a, b) { return Math.floor((new Date(b) - new Date(a)) / 86400000); }
function distNowDate() { return new Date().toISOString().split('T')[0]; }
function distAddDays(d, n) { const x = new Date(d); x.setDate(x.getDate()+n); return x.toISOString().split('T')[0]; }

const LK_BANKS = [
  'Commercial Bank',
  'Bank of Ceylon (BOC)',
  'Sampath Bank',
  'People\'s Bank',
  'Hatton National Bank (HNB)',
  'Seylan Bank',
  'Nations Trust Bank (NTB)',
  'DFCC Bank',
  'National Development Bank (NDB)',
  'Union Bank of Colombo',
  'Pan Asia Bank',
  'Amana Bank',
  'Standard Chartered Bank',
  'HSBC Sri Lanka',
  'Cargills Bank'
];

function distNumToWords(num) {
  num = Math.round(Number(num) || 0);
  if (num === 0) return 'Zero Rupees Only';
  const a = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const b = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  function convert(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n/10)] + (n%10 ? ' ' + a[n%10] : '');
    if (n < 1000) return a[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' ' + convert(n%100) : '');
    if (n < 100000) return convert(Math.floor(n/1000)) + ' Thousand' + (n%1000 ? ' ' + convert(n%1000) : '');
    if (n < 10000000) return convert(Math.floor(n/100000)) + ' Lakh' + (n%100000 ? ' ' + convert(n%100000) : '');
    return convert(Math.floor(n/10000000)) + ' Crore' + (n%10000000 ? ' ' + convert(n%10000000) : '');
  }
  return convert(num) + ' Rupees Only';
}

function distChequeDueBadge(realizeDate, status) {
  if (status === 'Realized' || status === 'Cleared') {
    return '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap"><i class="fa-solid fa-circle-check mr-1"></i>Realized</span>';
  }
  if (status === 'Bounced') {
    return '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 whitespace-nowrap"><i class="fa-solid fa-triangle-exclamation mr-1"></i>Bounced</span>';
  }
  if (status === 'Deposited') {
    return '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 whitespace-nowrap"><i class="fa-solid fa-building-columns mr-1"></i>Deposited</span>';
  }
  const today = distNowDate();
  const diff = distDays(today, realizeDate);
  if (diff < 0) {
    return `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 whitespace-nowrap"><i class="fa-solid fa-clock-rotate-left mr-1"></i>Overdue ${Math.abs(diff)}d</span>`;
  } else if (diff === 0) {
    return `<span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-slate-950 animate-pulse shadow-sm whitespace-nowrap"><i class="fa-solid fa-bell mr-1"></i>Due Today!</span>`;
  } else if (diff <= 7) {
    return `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap"><i class="fa-solid fa-calendar-day mr-1"></i>In ${diff}d</span>`;
  } else {
    return `<span class="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-slate-400 border border-white/10 whitespace-nowrap"><i class="fa-regular fa-calendar mr-1"></i>In ${diff}d</span>`;
  }
}

// ---------- seed ----------
function distSeed() {
  if (distInitializedData) return;
  DIST.routes = [
    { id:'r1', name:'Kadawatha Town & Pattiya', color:'#4f46e5' },
    { id:'r2', name:'Kirillawala - Mahara', color:'#06b6d4' },
    { id:'r3', name:'Weliweriya - Divulapitiya', color:'#10b981' },
  ];
  DIST.vans = [
    { id:'v1', plate:'WP CAB-1234', route:'r1', capacity:2500 },
    { id:'v2', plate:'WP KDE-5678', route:'r2', capacity:2200 },
    { id:'v3', plate:'WP NP-9012', route:'r3', capacity:1800 },
  ];
  DIST.reps = [
    { id:'rep1', name:'Sunil Perera', route:'r1', phone:'+94 71 111 2222', van:'WP CAB-1234', creditLimit:150000, salary:62000, allowance:8000, status:'Active', joined: distAddDays(distNowDate(),-400), attendance:'Present', leaveBalance:14 },
    { id:'rep2', name:'Roshan Fernando', route:'r2', phone:'+94 76 333 4444', van:'WP KDE-5678', creditLimit:120000, salary:62000, allowance:8000, status:'Active', joined: distAddDays(distNowDate(),-320), attendance:'Present', leaveBalance:12 },
    { id:'rep3', name:'Amila Wickrama', route:'r3', phone:'+94 77 555 6666', van:'WP NP-9012', creditLimit:100000, salary:58000, allowance:6000, status:'Active', joined: distAddDays(distNowDate(),-260), attendance:'Leave', leaveBalance:9 },
  ];

  const retailerSeeds = [
    ['Kadawatha New Mart', 'Grocery & Kade', 'r1', 'Sunil Kade', '+94 71 200 1001', 'Kadawatha Town', 150000],
    ['City Computer World', 'Computer Shop', 'r1', 'Chamara Silva', '+94 77 200 1002', 'Kadawatha', 300000],
    ['MobileHub Kadawatha', 'Phone Shop', 'r1', 'Ashan Perera', '+94 76 200 1003', 'Kadawatha', 250000],
    ['Saman Hotel', 'Restaurant', 'r1', 'Saman Kumara', '+94 71 200 1004', 'Pattiya Road', 100000],
    ['Golden Star Restaurant', 'Restaurant', 'r1', 'Dilani Fernando', '+94 77 200 1005', 'Kadawatha', 120000],
    ['Apex Communications (Pvt) Ltd', 'Phone Shop', 'r1', 'Prasanga Jay', '+94 11 200 1006', 'Kadawatha', 350000],
    ['Mini Kade - Pattiya', 'Grocery & Kade', 'r1', 'Nuwan Bandara', '+94 76 200 1007', 'Pattiya', 80000],
    ['Lanka Tech Solutions', 'Computer Shop', 'r2', 'Isuru Nissanka', '+94 71 200 1008', 'Kirillawala', 280000],
    ['PhoneZone Kirillawala', 'Phone Shop', 'r2', 'Kavindi Silva', '+94 77 200 1009', 'Kirillawala', 220000],
    ['Sunil Grocery', 'Grocery & Kade', 'r2', 'Sunil Bandara', '+94 76 200 1010', 'Mahara', 90000],
    ['Mahara Mobile Care', 'Phone Shop', 'r2', 'Dilan Madushanka', '+94 70 200 1011', 'Mahara', 200000],
    ['Fresh Home Bakers', 'Restaurant', 'r2', 'Malini Jaywardena', '+94 77 200 1012', 'Kirillawala', 110000],
    ['Mahara Super Mart', 'Grocery & Kade', 'r2', 'Ranga Fernando', '+94 71 200 1013', 'Mahara', 130000],
    ['Kadawatha Super Electronics', 'Computer Shop', 'r3', 'Buddhika R.', '+94 76 200 1014', 'Weliweriya', 320000],
    ['Weliweriya Traders', 'Grocery & Kade', 'r3', 'Tharindu P.', '+94 70 200 1015', 'Weliweriya', 140000],
    ['Phone Palace Weliweriya', 'Phone Shop', 'r3', 'Hashini W.', '+94 77 200 1016', 'Weliweriya', 260000],
    ['Divulapitiya Kade', 'Grocery & Kade', 'r3', 'Nuwan Dias', '+94 71 200 1017', 'Divulapitiya', 75000],
    ['Rasika Restaurant', 'Restaurant', 'r3', 'Rasika Kumara', '+94 76 200 1018', 'Divulapitiya', 95000],
    ['Nimal\'s Communication', 'Phone Shop', 'r3', 'Nimal Silva', '+94 70 200 1019', 'Weliweriya', 180000],
    ['Kade 24/7 Kiribathgoda', 'Grocery & Kade', 'r3', 'Chathura W.', '+94 77 200 1020', 'Kiribathgoda', 160000],
  ];
  DIST.retailers = retailerSeeds.map((r,i) => ({
    id: 'ret-' + (i+1),
    name: r[0],
    type: r[1],
    route: r[2],
    owner: r[3],
    phone: r[4],
    address: r[5],
    creditLimit: r[6],
    outstanding: 0,
    status: 'Active',
    created: distAddDays(distNowDate(), -120),
  }));

  // products from current business catalog
  let cat = [];
  try {
    const biz = (typeof getBusiness === 'function') ? getBusiness() : null;
    if (biz && typeof buildCatalog === 'function') cat = buildCatalog(biz);
  } catch(e){}
  if (!cat || cat.length === 0) {
    cat = [
      { id:'d-p1', name:'Mineral Water 1L (Case 24)', emoji:'💧', price:2400, cost:1920, stock_quantity:200, unit:'case', category:'Beverages' },
    ];
  }
  DIST.products = cat.map(p => ({ ...p, caseSell: false, active:true }));
  DIST.stock = {};
  DIST.products.forEach(p => { DIST.stock[p.id] = Number(p.stock_quantity || 0); });

  // seed invoices
  const types = ['CASH','CREDIT','PARTIAL','CHEQUE'];
  const rand = (n) => Math.floor(Math.random() * n);
  let invNo = 5000;
  DIST.invoices = [];
  for (let i=0;i<48;i++) {
    const ret = DIST.retailers[rand(DIST.retailers.length)];
    const rep = DIST.reps.find(x=>x.route===ret.route) || DIST.reps[0];
    const van = DIST.vans.find(x=>x.route===ret.route) || DIST.vans[0];
    const lineCount = 1 + rand(4);
    const items = [];
    let subtotal = 0;
    const used = new Set();
    for (let l=0;l<lineCount;l++) {
      let p = DIST.products[rand(DIST.products.length)];
      if (used.has(p.id)) continue;
      used.add(p.id);
      const qty = 1 + rand(6);
      const lineTotal = Number((p.price * qty).toFixed(2));
      items.push({ product_id:p.id, name:p.name, emoji:p.emoji||'', quantity:qty, unit_price:p.price, total:lineTotal });
      subtotal += lineTotal;
    }
    if (items.length === 0) {
      const p = DIST.products[0];
      const qty = 1 + rand(6);
      items.push({ product_id:p.id, name:p.name, emoji:p.emoji||'', quantity:qty, unit_price:p.price, total:Number((p.price*qty).toFixed(2)) });
      subtotal = items[0].total;
    }
    subtotal = Number(subtotal.toFixed(2));
    const discount = i % 5 === 0 ? Number((subtotal * 0.05).toFixed(2)) : 0;
    const tax = Number((subtotal * 0.08).toFixed(2));
    const total = Number((subtotal + tax - discount).toFixed(2));
    const issuedDate = distAddDays(distNowDate(), -(rand(30)));
    let payType = types[i % types.length];
    let cashReceived = 0, paid = 0, chequeNo = '', chequeBank = '', chequeDate = '';
    if (payType === 'CASH') { cashReceived = total; paid = total; }
    else if (payType === 'CREDIT') { cashReceived = 0; paid = 0; }
    else if (payType === 'PARTIAL') { cashReceived = Number((total * 0.4).toFixed(2)); paid = cashReceived; payType = 'CASH'; }
    else if (payType === 'CHEQUE') { cashReceived = 0; paid = 0; chequeNo = 'CHQ-' + (100000 + rand(900000)); chequeBank = ['BOC','Peoples Bank','Commercial Bank','Sampath Bank'][rand(4)]; chequeDate = distAddDays(issuedDate, 14); }
    // remap PARTIAL kept as CREDIT with partial
    if (i % 7 === 0) { payType = 'CREDIT'; paid = Number((total*0.3).toFixed(2)); cashReceived = paid; }

    const dueDate = distAddDays(issuedDate, 30);
    const id = 'INV-' + (invNo++);
    DIST.invoices.push({
      id, invoice_no: id, issued_date: issuedDate, due_date: dueDate,
      retailer_id: ret.id, retailer_name: ret.name, route: ret.route,
      rep_id: rep.id, rep_name: rep.name, van_id: van.id, van_plate: van.plate,
      items, subtotal, discount, tax, total,
      payment_method: payType, cash_received: Number(cashReceived.toFixed(2)),
      paid: Number(paid.toFixed(2)), balance: Number((total - paid).toFixed(2)),
      cheque_no: chequeNo, cheque_bank: chequeBank, cheque_date: chequeDate,
      status: (payType === 'CREDIT' && paid < total) ? 'DELIVERED' : 'DELIVERED',
      note: ''
    });
  }

  // recompute retailer outstanding
  DIST.retailers.forEach(r => { r.outstanding = 0; });
  DIST.invoices.forEach(inv => {
    const r = DIST.retailers.find(x=>x.id===inv.retailer_id);
    if (r) r.outstanding += (inv.total - inv.paid);
  });
  DIST.retailers.forEach(r => { r.outstanding = Number(r.outstanding.toFixed(2)); });

  // seed collections from invoices paid partially auto already in paid field; add payment records
  DIST.payments = [];
  DIST.invoices.forEach(inv => {
    if (inv.paid > 0) {
      DIST.payments.push({
        id: dUid('PAY'), date: inv.issued_date, invoice_id: inv.id,
        retailer_id: inv.retailer_id, retailer_name: inv.retailer_name,
        amount: inv.paid,
        method: inv.payment_method === 'CHEQUE' ? 'CHEQUE' : 'CASH',
        ref: inv.cheque_no || '', note: 'Initial collection'
      });
    }
  });

  // seed returns (a few) with sellable + damaged mix
  DIST.returns = [];
  DIST.damagedStock = {};
  const r0 = DIST.invoices[0];
  const r1 = DIST.invoices[5];
  const r2 = DIST.invoices[10];
  if (r0 && r0.items.length) {
    DIST.returns.push({
      id: 'RET-1001', date: distAddDays(r0.issued_date, 3), invoice_id: r0.id,
      retailer_id: r0.retailer_id, retailer_name: r0.retailer_name,
      items: [ { ...r0.items[0], return_qty: 1, reason: 'Damaged in transport' } ],
      amount: r0.items[0].unit_price, status: 'Approved', note: 'Van return', disposition: 'sellable'
    });
    if (DIST.stock[r0.items[0].product_id] !== undefined) DIST.stock[r0.items[0].product_id] += 1;
  }
  if (r1 && r1.items.length) {
    const it = r1.items[r1.items.length-1];
    DIST.returns.push({
      id: 'RET-1002', date: distAddDays(r1.issued_date, 5), invoice_id: r1.id,
      retailer_id: r1.retailer_id, retailer_name: r1.retailer_name,
      items: [ { ...it, return_qty: 1, reason: 'Expired on shelf' } ],
      amount: it.unit_price, status: 'Approved', note: 'Retailer reported', disposition: 'damaged'
    });
    DIST.damagedStock[it.product_id] = (DIST.damagedStock[it.product_id] || 0) + 1;
  }
  if (r2 && r2.items.length) {
    const it = r2.items[0];
    const q = it.quantity > 2 ? 2 : 1;
    DIST.returns.push({
      id: 'RET-1003', date: distAddDays(r2.issued_date, 2), invoice_id: r2.id,
      retailer_id: r2.retailer_id, retailer_name: r2.retailer_name,
      items: [ { ...it, return_qty: q, reason: 'Wrong item shipped' } ],
      amount: (it.unit_price*q), status: 'Pending', note: 'Awaiting pickup', disposition: 'sellable'
    });
    if (DIST.stock[it.product_id] !== undefined) DIST.stock[it.product_id] += q;
  }

  // retail stock restock already done above; adjust retailer outstanding if credit
  DIST.returns.forEach(ret => {
    const r = DIST.retailers.find(x => x.id === ret.retailer_id);
    if (r) r.outstanding = Math.max(0, Number((r.outstanding - (ret.amount || 0)).toFixed(2)));
  });

  // seed loads
  DIST.loads = [];
  DIST.vans.forEach(v => {
    const items = DIST.products.slice(0,4).map(p => ({ product_id:p.id, name:p.name, qty: 20 + rand(40) }));
    DIST.loads.push({ id: dUid('LOAD'), date: distAddDays(distNowDate(),-1), van_id:v.id, van_plate:v.plate, route:v.route, rep_id: DIST.reps.find(r=>r.route===v.route)?.id, items, status:'Dispatched' });
  });

  // seed lorry/van stock from loads
  DIST.lorryStock = {};
  (DIST.vans || []).forEach(v => { DIST.lorryStock[v.id] = {}; });
  (DIST.loads || []).forEach(l => {
    const vs = DIST.lorryStock[l.van_id];
    if (!vs) return;
    (l.items || []).forEach(it => {
      vs[it.product_id] = (vs[it.product_id] || 0) + (it.qty || 0);
    });
  });

  // seed suppliers
  DIST.suppliers = [
    { id: 'sup-1', name: 'CBL Munchee (Pvt) Ltd', category: 'Biscuits & Confectionery', phone: '+94 11 285 5555', contact: 'Ruwan Fernando', address: 'Makumbura, Pannipitiya', creditTermDays: 30, outstandingPayable: 450000 },
    { id: 'sup-2', name: 'Ceylon Cold Stores PLC (Elephant House)', category: 'Beverages & Dairy', phone: '+94 11 244 1144', contact: 'Dhanushka Silva', address: 'Kaduwela Road, Ranala', creditTermDays: 21, outstandingPayable: 320000 },
    { id: 'sup-3', name: 'Keells Wholesale Dist.', category: 'FMCG & Groceries', phone: '+94 11 230 3500', contact: 'Suresh Kumar', address: 'Peliyagoda Central Market', creditTermDays: 14, outstandingPayable: 180000 },
    { id: 'sup-4', name: 'Unilever Sri Lanka Ltd', category: 'Personal & Home Care', phone: '+94 11 269 3411', contact: 'Chamari Perera', address: 'Commercial Zone, Horana', creditTermDays: 30, outstandingPayable: 520000 },
    { id: 'sup-5', name: 'Maliban Biscuit Manufactories', category: 'Bakery & Biscuits', phone: '+94 11 555 5000', contact: 'Sanjaya Rathnayake', address: 'Ratmalana', creditTermDays: 30, outstandingPayable: 210000 },
    { id: 'sup-6', name: 'Nestlé Lanka PLC', category: 'Dairy & Nutrition', phone: '+94 11 269 9999', contact: 'Iresha Wickrama', address: 'Pannala Road, Kurunegala', creditTermDays: 14, outstandingPayable: 290000 }
  ];

  // seed distributor bank accounts
  DIST.ourBankAccounts = [
    { id: 'bank-1', name: 'Commercial Bank - Kadawatha Br.', accNo: '8001 9283 7401', balance: 1450000 },
    { id: 'bank-2', name: 'Bank of Ceylon (BOC) - Kadawatha Town', accNo: '0072 8192 0184', balance: 820000 },
    { id: 'bank-3', name: 'Sampath Bank - Kiribathgoda Br.', accNo: '1092 0038 4719', balance: 1120000 },
    { id: 'bank-4', name: 'People\'s Bank - Mahara Br.', accNo: '0281 9928 3746', balance: 640000 }
  ];

  // seed cheque / PDC register (inward from retail shops + outward to FMCG suppliers)
  const today = distNowDate();
  DIST.cheques = [
    // Inward Cheques (Customer / Retailer)
    {
      id: dUid('CHQ'),
      type: 'INWARD',
      party_type: 'RETAILER',
      number: 'CHQ-482109',
      bank: 'Sampath Bank',
      branch: 'Kadawatha Br.',
      retailer_id: 'ret-2',
      retailer_name: 'City Computer World',
      drawer_name: 'Chamara Silva (Prop.)',
      payee_name: 'Pixel POS Distributor',
      invoice_id: 'INV-5001',
      cheque_date: distAddDays(today, -14),
      realize_date: today, // Due today!
      amount: 85000,
      rep_name: 'Sunil Perera',
      status: 'Pending',
      created_at: distAddDays(today, -14),
      note: 'Payment for computer accessories consignment'
    },
    {
      id: dUid('CHQ'),
      type: 'INWARD',
      party_type: 'RETAILER',
      number: 'CHQ-719302',
      bank: 'Commercial Bank',
      branch: 'Kadawatha Br.',
      retailer_id: 'ret-1',
      retailer_name: 'Kadawatha New Mart',
      drawer_name: 'Sunil Perera Kade A/C',
      payee_name: 'Pixel POS Distributor',
      invoice_id: 'INV-5003',
      cheque_date: distAddDays(today, -7),
      realize_date: distAddDays(today, 3), // Due in 3 days
      amount: 64500,
      rep_name: 'Sunil Perera',
      status: 'Pending',
      created_at: distAddDays(today, -7),
      note: 'Grocery & beverages batch PDC'
    },
    {
      id: dUid('CHQ'),
      type: 'INWARD',
      party_type: 'RETAILER',
      number: 'CHQ-830219',
      bank: 'Bank of Ceylon (BOC)',
      branch: 'Kiribathgoda',
      retailer_id: 'ret-3',
      retailer_name: 'MobileHub Kadawatha',
      drawer_name: 'Ashan Perera',
      payee_name: 'Pixel POS Distributor',
      invoice_id: 'INV-5006',
      cheque_date: distAddDays(today, -2),
      realize_date: distAddDays(today, 12),
      amount: 112000,
      rep_name: 'Roshan Fernando',
      status: 'Pending',
      created_at: distAddDays(today, -2),
      note: 'USB cables & tempered glass delivery'
    },
    {
      id: dUid('CHQ'),
      type: 'INWARD',
      party_type: 'RETAILER',
      number: 'CHQ-392014',
      bank: 'People\'s Bank',
      branch: 'Mahara Br.',
      retailer_id: 'ret-5',
      retailer_name: 'Golden Star Restaurant',
      drawer_name: 'Dilani Fernando',
      payee_name: 'Pixel POS Distributor',
      invoice_id: 'INV-5008',
      cheque_date: distAddDays(today, -10),
      realize_date: today,
      amount: 48000,
      rep_name: 'Sunil Perera',
      status: 'Deposited',
      deposited_date: distAddDays(today, -1),
      deposit_slip_ref: 'DEP-8841',
      deposit_bank_id: 'bank-1',
      created_at: distAddDays(today, -10),
      note: 'Deposited to Commercial Bank - awaiting clearing'
    },
    {
      id: dUid('CHQ'),
      type: 'INWARD',
      party_type: 'RETAILER',
      number: 'CHQ-109284',
      bank: 'Hatton National Bank (HNB)',
      branch: 'Kadawatha',
      retailer_id: 'ret-6',
      retailer_name: 'Apex Communications (Pvt) Ltd',
      drawer_name: 'Prasanga Jaywardena',
      payee_name: 'Pixel POS Distributor',
      invoice_id: 'INV-5002',
      cheque_date: distAddDays(today, -25),
      realize_date: distAddDays(today, -5),
      amount: 140000,
      rep_name: 'Sunil Perera',
      status: 'Realized',
      realized_date: distAddDays(today, -5),
      created_at: distAddDays(today, -25),
      note: 'Cleared successfully via LankaClear'
    },
    {
      id: dUid('CHQ'),
      type: 'INWARD',
      party_type: 'RETAILER',
      number: 'CHQ-559102',
      bank: 'Commercial Bank',
      branch: 'Kiribathgoda',
      retailer_id: 'ret-7',
      retailer_name: 'Mini Kade - Pattiya',
      drawer_name: 'Nuwan Bandara',
      payee_name: 'Pixel POS Distributor',
      invoice_id: 'INV-5011',
      cheque_date: distAddDays(today, -20),
      realize_date: distAddDays(today, -6),
      amount: 38500,
      rep_name: 'Sunil Perera',
      status: 'Bounced',
      bounce_date: distAddDays(today, -5),
      bounce_reason: '01 - Refer to Drawer (Insufficient Funds)',
      bounce_charge: 500,
      created_at: distAddDays(today, -20),
      note: 'Dishonoured - Retailer ledger balance auto-restored + Rs. 500 bank return fee'
    },
    // Outward Cheques (To Suppliers / Manufacturers)
    {
      id: dUid('CHQ'),
      type: 'OUTWARD',
      party_type: 'SUPPLIER',
      number: 'CHQ-890112',
      bank: 'Commercial Bank',
      branch: 'Kadawatha Br.',
      our_account_id: 'bank-1',
      our_account_name: 'Commercial Bank - Kadawatha Br.',
      supplier_id: 'sup-1',
      supplier_name: 'CBL Munchee (Pvt) Ltd',
      drawer_name: 'Pixel POS Distributor',
      payee_name: 'CBL Munchee (Pvt) Ltd',
      ref_doc: 'PO-2024-81',
      cheque_date: distAddDays(today, -3),
      realize_date: distAddDays(today, 4),
      amount: 245000,
      status: 'Pending',
      created_at: distAddDays(today, -3),
      note: 'Bulk biscuit supply payment (30-day PDC)'
    },
    {
      id: dUid('CHQ'),
      type: 'OUTWARD',
      party_type: 'SUPPLIER',
      number: 'CHQ-890113',
      bank: 'Bank of Ceylon (BOC)',
      branch: 'Kadawatha Town',
      our_account_id: 'bank-2',
      our_account_name: 'Bank of Ceylon (BOC) - Kadawatha Town',
      supplier_id: 'sup-2',
      supplier_name: 'Ceylon Cold Stores PLC (Elephant House)',
      drawer_name: 'Pixel POS Distributor',
      payee_name: 'Ceylon Cold Stores PLC',
      ref_doc: 'GRN-4412',
      cheque_date: distAddDays(today, -10),
      realize_date: distAddDays(today, -1),
      amount: 185000,
      status: 'Realized',
      realized_date: distAddDays(today, -1),
      created_at: distAddDays(today, -10),
      note: 'Beverages stock batch payment - Cleared'
    },
    {
      id: dUid('CHQ'),
      type: 'OUTWARD',
      party_type: 'SUPPLIER',
      number: 'CHQ-890114',
      bank: 'Sampath Bank',
      branch: 'Kiribathgoda Br.',
      our_account_id: 'bank-3',
      our_account_name: 'Sampath Bank - Kiribathgoda Br.',
      supplier_id: 'sup-3',
      supplier_name: 'Keells Wholesale Dist.',
      drawer_name: 'Pixel POS Distributor',
      payee_name: 'Keells Wholesale Dist.',
      ref_doc: 'BILL-908',
      cheque_date: today,
      realize_date: today, // Due today
      amount: 128000,
      status: 'Pending',
      created_at: today,
      note: 'Matures today for clearing'
    }
  ];

  // seed stock movement log
  DIST.stockMoves = [];
  DIST.invoices.forEach(inv => {
    (inv.items || []).forEach(it => {
      DIST.stockMoves.push({ id: dUid('MV'), date: inv.issued_date, type: 'OUT', product_id: it.product_id, name: it.name, qty: it.quantity, ref: inv.id, note: 'Sold to ' + inv.retailer_name, bucket: 'Warehouse' });
    });
  });
  (DIST.loads || []).forEach(l => {
    (l.items || []).forEach(it => {
      DIST.stockMoves.push({ id: dUid('MV'), date: l.date, type: 'OUT', product_id: it.product_id, name: it.name, qty: it.qty, ref: l.id, note: 'Dispatched to ' + l.van_plate, bucket: 'Warehouse → Van' });
    });
  });
  (DIST.returns || []).forEach(r => {
    (r.items || []).forEach(it => {
      DIST.stockMoves.push({ id: dUid('MV'), date: r.date, type: 'IN', product_id: it.product_id, name: it.name, qty: (it.return_qty || 0), ref: r.id, note: 'Return · ' + (r.disposition || 'sellable'), bucket: r.disposition === 'damaged' ? 'Quarantine' : 'Warehouse' });
    });
  });

  DIST.initialized = true;
  distSave();
}

// ---------- main render ----------
function loadDistributionData() {
  if (!DIST.initialized) {
    distLoad();
    if (!DIST.initialized) distSeed();
  }
  // migrate reps
  (DIST.reps||[]).forEach((r,i) => {
    if (r.creditLimit === undefined) r.creditLimit = 100000 + i*20000;
    if (r.salary === undefined) r.salary = 55000;
    if (r.allowance === undefined) r.allowance = 5000;
    if (r.status === undefined) r.status = 'Active';
    if (r.joined === undefined) r.joined = distAddDays(distNowDate(), -200);
    if (r.attendance === undefined) r.attendance = 'Present';
    if (r.leaveBalance === undefined) r.leaveBalance = 12;
    if (r.van === undefined) r.van = (DIST.vans.find(v=>v.route===r.route)?.plate) || '';
  });
  // migrate retailers (already added creditLimit, but ensure)
  (DIST.retailers||[]).forEach(r => { if (r.creditLimit === undefined) r.creditLimit = 100000; });
  if (!Array.isArray(DIST.stockMoves)) DIST.stockMoves = [];
  if (!DIST.damagedStock) DIST.damagedStock = {};
  if (!DIST.lorryStock) DIST.lorryStock = {};
  if (!Array.isArray(DIST.cheques)) DIST.cheques = [];
  if (!Array.isArray(DIST.suppliers) || DIST.suppliers.length === 0) {
    DIST.suppliers = [
      { id: 'sup-1', name: 'CBL Munchee (Pvt) Ltd', category: 'Biscuits & Confectionery', phone: '+94 11 285 5555', contact: 'Ruwan Fernando', address: 'Makumbura, Pannipitiya', creditTermDays: 30, outstandingPayable: 450000 },
      { id: 'sup-2', name: 'Ceylon Cold Stores PLC (Elephant House)', category: 'Beverages & Dairy', phone: '+94 11 244 1144', contact: 'Dhanushka Silva', address: 'Kaduwela Road, Ranala', creditTermDays: 21, outstandingPayable: 320000 },
      { id: 'sup-3', name: 'Keells Wholesale Dist.', category: 'FMCG & Groceries', phone: '+94 11 230 3500', contact: 'Suresh Kumar', address: 'Peliyagoda Central Market', creditTermDays: 14, outstandingPayable: 180000 },
      { id: 'sup-4', name: 'Unilever Sri Lanka Ltd', category: 'Personal & Home Care', phone: '+94 11 269 3411', contact: 'Chamari Perera', address: 'Commercial Zone, Horana', creditTermDays: 30, outstandingPayable: 520000 },
      { id: 'sup-5', name: 'Maliban Biscuit Manufactories', category: 'Bakery & Biscuits', phone: '+94 11 555 5000', contact: 'Sanjaya Rathnayake', address: 'Ratmalana', creditTermDays: 30, outstandingPayable: 210000 },
      { id: 'sup-6', name: 'Nestlé Lanka PLC', category: 'Dairy & Nutrition', phone: '+94 11 269 9999', contact: 'Iresha Wickrama', address: 'Pannala Road, Kurunegala', creditTermDays: 14, outstandingPayable: 290000 }
    ];
  }
  if (!Array.isArray(DIST.ourBankAccounts) || DIST.ourBankAccounts.length === 0) {
    DIST.ourBankAccounts = [
      { id: 'bank-1', name: 'Commercial Bank - Kadawatha Br.', accNo: '8001 9283 7401', balance: 1450000 },
      { id: 'bank-2', name: 'Bank of Ceylon (BOC) - Kadawatha Town', accNo: '0072 8192 0184', balance: 820000 },
      { id: 'bank-3', name: 'Sampath Bank - Kiribathgoda Br.', accNo: '1092 0038 4719', balance: 1120000 },
      { id: 'bank-4', name: 'People\'s Bank - Mahara Br.', accNo: '0281 9928 3746', balance: 640000 }
    ];
  }

  // Migrate existing cheques to ensure full data structure
  DIST.cheques.forEach(ch => {
    if (!ch.type) ch.type = 'INWARD';
    if (!ch.party_type) ch.party_type = ch.type === 'OUTWARD' ? 'SUPPLIER' : 'RETAILER';
    if (!ch.cheque_date) ch.cheque_date = ch.date || ch.issued_date || distNowDate();
    if (!ch.realize_date) ch.realize_date = ch.date || distAddDays(ch.cheque_date, 14);
    if (!ch.branch) ch.branch = 'Kadawatha Br.';
    if (!ch.drawer_name) ch.drawer_name = ch.retailer_name ? (ch.retailer_name + ' Prop.') : 'A/C Holder';
    if (!ch.payee_name) ch.payee_name = ch.type === 'OUTWARD' ? (ch.supplier_name || 'Supplier') : 'Pixel POS Distributor';
  });

  // Ensure at least one inward cheque has realize_date = today for demonstration
  const today = distNowDate();
  const hasDueToday = DIST.cheques.some(c => c.type === 'INWARD' && c.status === 'Pending' && c.realize_date === today);
  if (!hasDueToday && DIST.cheques.length > 0) {
    const firstPending = DIST.cheques.find(c => c.type === 'INWARD' && c.status === 'Pending');
    if (firstPending) firstPending.realize_date = today;
  }

  // Ensure we have some outward supplier cheques
  const hasOutward = DIST.cheques.some(c => c.type === 'OUTWARD');
  if (!hasOutward && DIST.suppliers.length > 0) {
    DIST.cheques.push(
      {
        id: dUid('CHQ'),
        type: 'OUTWARD',
        party_type: 'SUPPLIER',
        number: 'CHQ-890112',
        bank: 'Commercial Bank',
        branch: 'Kadawatha Br.',
        our_account_id: 'bank-1',
        our_account_name: 'Commercial Bank - Kadawatha Br.',
        supplier_id: 'sup-1',
        supplier_name: 'CBL Munchee (Pvt) Ltd',
        drawer_name: 'Pixel POS Distributor',
        payee_name: 'CBL Munchee (Pvt) Ltd',
        ref_doc: 'PO-2024-81',
        cheque_date: distAddDays(today, -3),
        realize_date: distAddDays(today, 4),
        amount: 245000,
        status: 'Pending',
        created_at: distAddDays(today, -3),
        note: 'Bulk biscuit supply payment (30-day PDC)'
      },
      {
        id: dUid('CHQ'),
        type: 'OUTWARD',
        party_type: 'SUPPLIER',
        number: 'CHQ-890113',
        bank: 'Bank of Ceylon (BOC)',
        branch: 'Kadawatha Town',
        our_account_id: 'bank-2',
        our_account_name: 'Bank of Ceylon (BOC) - Kadawatha Town',
        supplier_id: 'sup-2',
        supplier_name: 'Ceylon Cold Stores PLC (Elephant House)',
        drawer_name: 'Pixel POS Distributor',
        payee_name: 'Ceylon Cold Stores PLC',
        ref_doc: 'GRN-4412',
        cheque_date: distAddDays(today, -10),
        realize_date: distAddDays(today, -1),
        amount: 185000,
        status: 'Realized',
        realized_date: distAddDays(today, -1),
        created_at: distAddDays(today, -10),
        note: 'Beverages stock batch payment - Cleared'
      },
      {
        id: dUid('CHQ'),
        type: 'OUTWARD',
        party_type: 'SUPPLIER',
        number: 'CHQ-890114',
        bank: 'Sampath Bank',
        branch: 'Kiribathgoda Br.',
        our_account_id: 'bank-3',
        our_account_name: 'Sampath Bank - Kiribathgoda Br.',
        supplier_id: 'sup-3',
        supplier_name: 'Keells Wholesale Dist.',
        drawer_name: 'Pixel POS Distributor',
        payee_name: 'Keells Wholesale Dist.',
        ref_doc: 'BILL-908',
        cheque_date: today,
        realize_date: today,
        amount: 128000,
        status: 'Pending',
        created_at: today,
        note: 'Matures today for clearing'
      }
    );
  }

  DIST.vans.forEach(v => { if (!DIST.lorryStock[v.id]) DIST.lorryStock[v.id] = {}; });
  DIST.view = DIST.view || 'overview';
  distRenderShell();
  distRenderView();
}

function distRenderShell() {
  const root = document.getElementById('dist-root');
  if (!root) return;
  const today = distNowDate();
  const dueTodayInward = (DIST.cheques || []).filter(c => c.type === 'INWARD' && c.status === 'Pending' && c.realize_date === today).length;
  const views = [
    ['overview','Overview','fa-gauge-high'],
    ['invoices','Invoices / Sales','fa-file-invoice'],
    ['newsale','New Invoice','fa-plus-circle'],
    ['retailers','Retailers','fa-store'],
    ['reps','Team & Reps','fa-user-tie'],
    ['routes','Routes & Vans','fa-route'],
    ['stock','Stock & Loads','fa-boxes-stacked'],
    ['mainstock','Main Stock','fa-warehouse'],
    ['lorrystock','Lorry Stock','fa-truck'],
    ['collections','Collections & Credit','fa-hand-holding-dollar'],
    ['cheques','Cheques & PDCs','fa-money-check', dueTodayInward],
    ['returns','Returns','fa-rotate-left'],
    ['reports','Reports','fa-chart-column'],
  ];
  root.innerHTML = `
    <div class="flex flex-col gap-4">
      <!-- Dedicated Standalone Enterprise DMS Banner -->
      <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xl flex-shrink-0">
            <i class="fa-solid fa-truck-field"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase tracking-wider">New Enterprise Suite</span>
              <h3 class="text-sm sm:text-base font-extrabold text-white">Pixel Distribution Suite — Full Enterprise DMS</h3>
            </div>
            <p class="text-[11px] text-slate-300 mt-0.5">Looking for our standalone 14-module Enterprise DMS? Includes Route SFA, Cheque Maturity Radar, Van Loading Sheets &amp; Credit Control.</p>
          </div>
        </div>
        <a href="../distribution/index.html" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2 flex-shrink-0 transition-transform hover:scale-105 whitespace-nowrap">
          <span>Launch Enterprise Suite</span>
          <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
        </a>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-xl font-black text-white flex items-center gap-2"><i class="fa-solid fa-truck-field text-indigo-400"></i> Distribution Management (DMS)</h2>
          <p class="text-xs text-slate-400">Kadawatha region wholesale distribution · cash / credit / cheque · route vans</p>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button onclick="distView('newsale')" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-xs font-bold shadow-lg flex items-center gap-2"><i class="fa-solid fa-plus"></i> New Invoice</button>
          <button onclick="distView('collections')" class="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold border border-white/10 flex items-center gap-2"><i class="fa-solid fa-hand-holding-dollar"></i> Collect Payment</button>
          <button onclick="distView('cheques')" class="px-3.5 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-bold border border-sky-500/40 flex items-center gap-2"><i class="fa-solid fa-money-check"></i> Cheques & PDCs ${dueTodayInward ? `<span class="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] animate-pulse">${dueTodayInward}</span>` : ''}</button>
          <button onclick="distResetDemo()" class="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 text-xs font-bold border border-white/10" title="Reset Demo Data"><i class="fa-solid fa-rotate-left"></i></button>
        </div>
      </div>

      <div class="flex gap-2 overflow-x-auto pb-1">
        ${views.map(([id,label,icon,badge]) => `
          <button onclick="distView('${id}')" id="dist-tab-${id}"
            class="dist-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border border-white/10 transition-all flex items-center gap-1.5
            ${DIST.view===id ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' : 'bg-white/5 text-slate-400 hover:bg-white/10'}">
            <i class="fa-solid ${icon}"></i>${label}
            ${badge ? `<span class="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black animate-pulse">${badge}</span>` : ''}
          </button>`).join('')}
      </div>

      <div id="dist-view" class="space-y-4"></div>
    </div>
  `;
}

function distView(name) {
  DIST.view = name;
  distRenderShell();
  distRenderView();
}

function distResetDemo() {
  if (!confirm('Reset distribution demo data?')) return;
  localStorage.removeItem(DIST_LOCAL_KEY);
  DIST = { initialized:false, routes:[], vans:[], reps:[], retailers:[], products:[], stock:{}, invoices:[], payments:[], returns:[], loads:[], view:'overview' };
  distInitializedData = false;
  distSeed();
  toast('Distribution demo reset','success');
  loadDistributionData();
}

function distRenderView() {
  const c = document.getElementById('dist-view');
  if (!c) return;
  const fn = {
    overview: distRenderOverview,
    invoices: distRenderInvoices,
    newsale: distRenderNewSale,
    retailers: distRenderRetailers,
    reps: distRenderReps,
    routes: distRenderRoutes,
    stock: distRenderStock,
    mainstock: function(c){ distStockTab='main'; distRenderStock(c); },
    lorrystock: function(c){ distStockTab='lorry'; distRenderStock(c); },
    collections: distRenderCollections,
    cheques: distRenderCheques,
    returns: distRenderReturns,
    reports: distRenderReports,
  }[DIST.view] || distRenderOverview;
  fn(c);
}

// ---------- overview ----------
function distRenderOverview(c) {
  const today = distNowDate();
  const todayInv = DIST.invoices.filter(i => i.issued_date === today);
  const todaySales = todayInv.reduce((s,i)=>s+i.total,0);
  const todayCash = todayInv.filter(i=>i.payment_method!=='CREDIT').reduce((s,i)=>s+i.paid,0);
  const open = DIST.invoices.filter(i=>i.balance>0);
  const outstanding = open.reduce((s,i)=>s+i.balance,0);
  const overdue = open.filter(i=>i.due_date < today).reduce((s,i)=>s+i.balance,0);
  const vanStockVal = DIST.products.reduce((s,p)=> s + (DIST.stock[p.id]||0)*p.price, 0);
  const retailersActive = DIST.retailers.filter(r=>r.status==='Active').length;
  const deliveriesToday = todayInv.length;
  const overdueCount = open.filter(i=>i.due_date < today).length;

  // ageing buckets
  const buckets = { current:0, d30:0, d60:0, d90:0 };
  open.forEach(i => {
    const days = distDays(i.due_date, today);
    if (days <= 0) buckets.current += i.balance;
    else if (days <= 30) buckets.d30 += i.balance;
    else if (days <= 60) buckets.d60 += i.balance;
    else buckets.d90 += i.balance;
  });

  // top retailers by sales
  const byRetailer = {};
  DIST.invoices.forEach(i => { byRetailer[i.retailer_name] = (byRetailer[i.retailer_name]||0)+i.total; });
  const topRetailers = Object.entries(byRetailer).sort((a,b)=>b[1]-a[1]).slice(0,6);

  // top products
  const byProd = {};
  DIST.invoices.forEach(i => i.items.forEach(it => { byProd[it.name] = (byProd[it.name]||0)+ (it.total||0); }));
  const topProds = Object.entries(byProd).sort((a,b)=>b[1]-a[1]).slice(0,6);

  c.innerHTML = `
    <div class="flex flex-wrap gap-2 mb-3">
      <button onclick="distView('mainstock')" class="px-3 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold"><i class="fa-solid fa-warehouse mr-1"></i> Main Stock</button>
      <button onclick="distView('lorrystock')" class="px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold"><i class="fa-solid fa-truck mr-1"></i> Lorry Stock</button>
      <button onclick="distOpenTransferModal()" class="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold flex items-center gap-1"><i class="fa-solid fa-right-left"></i> Transfer</button>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      ${distKpi('Today Sales', dMoney(todaySales), 'fa-chart-line', 'indigo')}
      ${distKpi('Today Cash Collected', dMoney(todayCash), 'fa-money-bill-wave', 'emerald')}
      ${distKpi('Deliveries Today', deliveriesToday, 'fa-truck', 'cyan', true)}
      ${distKpi('Active Retailers', retailersActive, 'fa-store', 'blue', true)}
      ${distKpi('Total Outstanding', dMoney(outstanding), 'fa-file-invoice-dollar', 'amber')}
      ${distKpi('Overdue Amount', dMoney(overdue), 'fa-triangle-exclamation', 'rose')}
      ${distKpi('Overdue Invoices', overdueCount, 'fa-clock', 'rose', true)}
      ${distKpi('Warehouse Stock Value', dMoney(vanStockVal), 'fa-boxes-stacked', 'violet')}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="glass-panel p-5 rounded-2xl space-y-3">
        <h3 class="font-bold text-slate-200 text-sm flex items-center gap-2"><i class="fa-solid fa-hourglass-half text-amber-400"></i> Receivables Ageing</h3>
        ${distAgeRow('Current (not due)', buckets.current, 'emerald')}
        ${distAgeRow('1 - 30 days', buckets.d30, 'amber')}
        ${distAgeRow('31 - 60 days', buckets.d60, 'orange')}
        ${distAgeRow('60+ days', buckets.d90, 'rose')}
      </div>
      <div class="glass-panel p-5 rounded-2xl space-y-3">
        <h3 class="font-bold text-slate-200 text-sm flex items-center gap-2"><i class="fa-solid fa-crown text-indigo-400"></i> Top Retailers (Sales)</h3>
        ${topRetailers.map(([n,v]) => `
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-300 truncate max-w-[180px]">${dEsc(n)}</span>
            <span class="text-emerald-300 font-bold">${dMoney(v)}</span>
          </div>`).join('') || '<p class="text-xs text-slate-500">No data</p>'}
      </div>
      <div class="glass-panel p-5 rounded-2xl space-y-3">
        <h3 class="font-bold text-slate-200 text-sm flex items-center gap-2"><i class="fa-solid fa-box text-cyan-400"></i> Top SKUs (Sales)</h3>
        ${topProds.map(([n,v]) => `
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-300 truncate max-w-[180px]">${dEsc(n)}</span>
            <span class="text-cyan-300 font-bold">${dMoney(v)}</span>
          </div>`).join('') || '<p class="text-xs text-slate-500">No data</p>'}
      </div>
    </div>

    <div class="glass-panel p-5 rounded-2xl">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-bold text-slate-200 text-sm"><i class="fa-solid fa-clock-rotate-left mr-2 text-indigo-400"></i> Recent Invoices</h3>
        <button onclick="distView('invoices')" class="text-xs text-indigo-400 hover:text-indigo-300 font-bold">View all</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-300">
          <thead class="text-xs uppercase bg-white/5 text-slate-400 border-b border-white/10">
            <tr>
              <th class="px-3 py-2">Invoice</th><th class="px-3 py-2">Retailer</th><th class="px-3 py-2">Rep / Route</th>
              <th class="px-3 py-2">Payment</th><th class="px-3 py-2 text-right">Total</th><th class="px-3 py-2 text-right">Balance</th><th class="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            ${DIST.invoices.slice().sort((a,b)=>b.issued_date.localeCompare(a.issued_date)).slice(0,8).map(i => `
              <tr class="border-b border-white/5 hover:bg-white/5">
                <td class="px-3 py-2 font-mono text-xs">${i.invoice_no}</td>
                <td class="px-3 py-2 font-semibold text-white text-xs">${dEsc(i.retailer_name)}</td>
                <td class="px-3 py-2 text-xs text-slate-400">${dEsc(i.rep_name)}</td>
                <td class="px-3 py-2 text-xs">${distPayBadge(i.payment_method)}</td>
                <td class="px-3 py-2 text-right text-xs font-semibold">${dMoney(i.total)}</td>
                <td class="px-3 py-2 text-right text-xs font-bold ${i.balance>0?'text-amber-300':'text-slate-500'}">${dMoney(i.balance)}</td>
                <td class="px-3 py-2 text-xs">${i.balance>0 ? (i.due_date < today ? '<span class="text-rose-300 font-bold">Overdue</span>' : '<span class="text-amber-300">Open</span>') : '<span class="text-emerald-300">Paid</span>'}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function distKpi(label, val, icon, color, count) {
  const cls = { indigo:'text-indigo-400', emerald:'text-emerald-400', cyan:'text-cyan-400', blue:'text-blue-400', amber:'text-amber-400', rose:'text-rose-400', violet:'text-violet-400' }[color] || 'text-slate-300';
  return `<div class="glass-panel p-4 rounded-2xl border-l-4 border-l-${color=== 'indigo'?'indigo-500':color==='emerald'?'emerald-500':color==='cyan'?'cyan-500':color==='blue'?'blue-500':color==='amber'?'amber-500':color==='rose'?'rose-500':'violet-500'} kpi-card">
    <div class="flex items-center justify-between">
      <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">${label}</span>
      <i class="fa-solid ${icon} ${cls}"></i>
    </div>
    <p class="text-xl font-extrabold mt-2 ${cls}">${val}</p>
  </div>`;
}
function distAgeRow(label, val, color) {
  const cls = { emerald:'text-emerald-400', amber:'text-amber-400', orange:'text-orange-400', rose:'text-rose-400' }[color];
  return `<div class="flex items-center justify-between text-xs"><span class="text-slate-300">${label}</span><span class="${cls} font-bold">${dMoney(val)}</span></div>`;
}
function distPayBadge(m) {
  const map = { CASH:'bg-emerald-500/20 text-emerald-300', CREDIT:'bg-amber-500/20 text-amber-300', CHEQUE:'bg-sky-500/20 text-sky-300', PARTIAL:'bg-slate-500/20 text-slate-300' };
  return `<span class="px-2 py-0.5 rounded text-[10px] font-bold ${map[m]||map.CASH}">${m}</span>`;
}

// ---------- invoices list ----------
let distInvFilter = 'all';
function distRenderInvoices(c) {
  if (typeof c === 'string') c = document.getElementById(c);
  c = c || document.getElementById('dist-view');
  const q = (document.getElementById('dist-inv-search')?.value || '').toLowerCase();
  const f = distInvFilter;
  const today = distNowDate();
  let rows = DIST.invoices.slice().sort((a,b)=>b.issued_date.localeCompare(a.issued_date));
  if (q) rows = rows.filter(i => i.retailer_name.toLowerCase().includes(q) || i.invoice_no.toLowerCase().includes(q));
  if (f === 'open') rows = rows.filter(i=>i.balance>0);
  else if (f === 'overdue') rows = rows.filter(i=>i.balance>0 && i.due_date < today);
  else if (f === 'paid') rows = rows.filter(i=>i.balance<=0);
  else if (f === 'credit') rows = rows.filter(i=>i.payment_method==='CREDIT');

  c.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex gap-2 flex-wrap">
        <input id="dist-inv-search" oninput="distRenderInvoices()" placeholder="Search retailer / invoice…" class="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 w-56">
        <select onchange="distInvFilter=this.value; distRenderInvoices()" class="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200">
          <option value="all" ${f==='all'?'selected':''}>All invoices</option>
          <option value="open" ${f==='open'?'selected':''}>Open balance</option>
          <option value="overdue" ${f==='overdue'?'selected':''}>Overdue</option>
          <option value="paid" ${f==='paid'?'selected':''}>Paid</option>
          <option value="credit" ${f==='credit'?'selected':''}>Credit only</option>
        </select>
      </div>
      <div class="text-xs text-slate-400">${rows.length} invoices · Outstanding ${dMoney(rows.reduce((s,i)=>s+i.balance,0))}</div>
    </div>
    <div class="glass-panel rounded-2xl overflow-x-auto">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="text-xs uppercase bg-white/5 text-slate-400 border-b border-white/10">
          <tr>
            <th class="px-3 py-2.5">Invoice</th><th class="px-3 py-2.5">Date</th><th class="px-3 py-2.5">Retailer</th>
            <th class="px-3 py-2.5">Rep / Van</th><th class="px-3 py-2.5">Payment</th>
            <th class="px-3 py-2.5 text-right">Total</th><th class="px-3 py-2.5 text-right">Paid</th>
            <th class="px-3 py-2.5 text-right">Balance</th><th class="px-3 py-2.5">Due</th><th class="px-3 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(i => `
            <tr class="border-b border-white/5 hover:bg-white/5">
              <td class="px-3 py-2 font-mono text-xs text-indigo-300">${i.invoice_no}</td>
              <td class="px-3 py-2 text-xs">${i.issued_date}</td>
              <td class="px-3 py-2 font-semibold text-white text-xs">${dEsc(i.retailer_name)}</td>
              <td class="px-3 py-2 text-xs text-slate-400">${dEsc(i.rep_name)}<br><span class="text-[10px]">${i.van_plate}</span></td>
              <td class="px-3 py-2 text-xs">${distPayBadge(i.payment_method)}${i.cheque_no ? `<br><span class="text-[10px] text-sky-300">${i.cheque_no} (${i.cheque_bank})</span>` : ''}</td>
              <td class="px-3 py-2 text-right text-xs font-semibold">${dMoney(i.total)}</td>
              <td class="px-3 py-2 text-right text-xs text-emerald-300">${dMoney(i.paid)}</td>
              <td class="px-3 py-2 text-right text-xs font-bold ${i.balance>0?'text-amber-300':'text-slate-500'}">${dMoney(i.balance)}</td>
              <td class="px-3 py-2 text-xs ${i.due_date < today && i.balance>0 ? 'text-rose-300 font-bold' : 'text-slate-400'}">${i.due_date}</td>
              <td class="px-3 py-2 text-right whitespace-nowrap">
                ${i.balance>0 ? `<button onclick="distOpenCollect('${i.id}')" class="px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded" title="Collect"><i class="fa-solid fa-hand-holding-dollar"></i></button>` : ''}
                <button onclick="distViewInvoice('${i.id}')" class="px-2 py-1 text-xs text-indigo-400 hover:bg-indigo-500/10 rounded" title="View"><i class="fa-solid fa-eye"></i></button>
              </td>
            </tr>`).join('') || `<tr><td colspan="10" class="px-4 py-8 text-center text-slate-500 text-sm">No invoices found.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function distViewInvoice(id) {
  const inv = DIST.invoices.find(x=>x.id===id);
  if (!inv) return;
  const w = window.open('', '_blank', 'width=700,height=900');
  if (!w) { toast('Popup blocked','error'); return; }
  w.document.write(`<html><head><title>Invoice ${inv.invoice_no}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#111}table{width:100%;border-collapse:collapse}td,th{padding:6px;border-bottom:1px solid #ddd;font-size:13px}h1{font-size:20px} .right{text-align:right}</style></head><body>
    <h1>Distribution Invoice</h1>
    <p><strong>Invoice:</strong> ${inv.invoice_no} &nbsp; <strong>Date:</strong> ${inv.issued_date}</p>
    <p><strong>Retailer:</strong> ${dEsc(inv.retailer_name)} &nbsp; <strong>Route:</strong> ${distRouteName(inv.route)}</p>
    <p><strong>Rep:</strong> ${dEsc(inv.rep_name)} &nbsp; <strong>Van:</strong> ${inv.van_plate}</p>
    <table><thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th class="right">Total</th></tr></thead><tbody>
      ${inv.items.map(it=>`<tr><td>${dEsc(it.name)}</td><td>${it.quantity}</td><td>${dMoney(it.unit_price)}</td><td class="right">${dMoney(it.total)}</td></tr>`).join('')}
    </tbody></table>
    <p class="right"><strong>Subtotal:</strong> ${dMoney(inv.subtotal)}</p>
    <p class="right"><strong>Discount:</strong> ${dMoney(inv.discount)} &nbsp; <strong>Tax:</strong> ${dMoney(inv.tax)}</p>
    <p class="right"><strong>Total:</strong> ${dMoney(inv.total)}</p>
    <p><strong>Payment:</strong> ${inv.payment_method} · Paid ${dMoney(inv.paid)} · Balance ${dMoney(inv.balance)}</p>
    ${inv.cheque_no ? `<p><strong>Cheque:</strong> ${inv.cheque_no} (${inv.cheque_bank}) dated ${inv.cheque_date}</p>` : ''}
    <p><strong>Due date:</strong> ${inv.due_date}</p>
    <br><button onclick="window.print()">Print</button>
  </body></html>`);
  w.document.close();
}

// ---------- new invoice ----------
let distNewItems = [];
function distRenderNewSale(c) {
  c = c || document.getElementById('dist-view');
  if (distNewItems.length === 0) distNewItems = [ { product_id: DIST.products[0]?.id, qty: 1 } ];

  const retailersOpts = DIST.retailers.map(r => `<option value="${r.id}">${dEsc(r.name)} (${distRouteName(r.route)})</option>`).join('');
  const productOpts = (pid) => DIST.products.map(p => `<option value="${p.id}" ${p.id===pid?'selected':''}>${dEsc(p.name)} — ${dMoney(p.price)} / ${p.unit}</option>`).join('');
  const routesOpts = DIST.routes.map(r => `<option value="${r.id}">${dEsc(r.name)}</option>`).join('');

  c.innerHTML = `
    <div class="glass-panel p-5 rounded-2xl space-y-4">
      <h3 class="font-bold text-slate-100 text-base flex items-center gap-2"><i class="fa-solid fa-file-circle-plus text-indigo-400"></i> Create Distribution Invoice</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label class="text-xs text-slate-400 font-semibold">Retailer / Shop *</label>
          <div class="flex gap-2 mt-1">
            <select id="di-retailer" onchange="distOnRetailerChange()" class="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200">${retailersOpts}</select>
            <button type="button" onclick="distOpenRetailerModal(); setTimeout(()=>{const s=document.getElementById('di-retailer'); if(s){s.value=DIST.retailers[DIST.retailers.length-1].id; distOnRetailerChange();}},350);" class="px-3 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-xl flex items-center gap-1" title="Add new shop"><i class="fa-solid fa-plus"></i></button>
          </div>
        </div>
        <div>
          <label class="text-xs text-slate-400 font-semibold">Route</label>
          <select id="di-route" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200">${routesOpts}</select>
        </div>
        <div>
          <label class="text-xs text-slate-400 font-semibold">Rep</label>
          <select id="di-rep" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200">${DIST.reps.map(r=>`<option value="${r.id}">${dEsc(r.name)}</option>`).join('')}</select>
        </div>
        <div>
          <label class="text-xs text-slate-400 font-semibold">Van</label>
          <select id="di-van" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200">${DIST.vans.map(v=>`<option value="${v.id}">${v.plate}</option>`).join('')}</select>
        </div>
        <div>
          <label class="text-xs text-slate-400 font-semibold">Invoice Date</label>
          <input type="date" id="di-date" value="${distNowDate()}" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200">
        </div>
        <div>
          <label class="text-xs text-slate-400 font-semibold">Due Date (credit)</label>
          <input type="date" id="di-due" value="${distAddDays(distNowDate(),30)}" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200">
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">Line Items</span>
          <button onclick="distAddLine()" class="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200"><i class="fa-solid fa-plus mr-1"></i>Add line</button>
        </div>
        <div id="di-lines" class="space-y-2"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 border-t border-white/10">
        <div>
          <label class="text-xs text-slate-400 font-semibold">Payment Mode</label>
          <select id="di-paymode" onchange="distTogglePayExtra()" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200">
            <option value="CASH">Cash</option>
            <option value="CREDIT">Credit</option>
            <option value="PARTIAL">Partial Cash + Credit</option>
            <option value="CHEQUE">Cheque (PDC)</option>
          </select>
        </div>
        <div>
          <label class="text-xs text-slate-400 font-semibold">Discount (Rs.)</label>
          <input type="number" id="di-discount" value="0" oninput="distCalcTotals()" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200">
        </div>
        <div id="di-cash-wrap">
          <label class="text-xs text-slate-400 font-semibold">Cash Received (Rs.)</label>
          <input type="number" id="di-cash" value="0" oninput="distCalcTotals()" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200">
        </div>
        <div id="di-cheque-wrap" class="hidden col-span-1 md:col-span-4 bg-slate-900/60 p-4 rounded-2xl border border-sky-500/30 space-y-3">
          <div class="flex items-center justify-between border-b border-white/10 pb-2">
            <span class="text-xs font-bold text-sky-400 flex items-center gap-1.5"><i class="fa-solid fa-money-check"></i> Post-Dated Cheque (PDC) Details</span>
            <span class="text-[11px] text-slate-400">Will be recorded into Cheques & PDCs register</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="text-[11px] text-slate-400 font-semibold">Cheque No *</label>
              <input type="text" id="di-chq-no" placeholder="CHQ-704918" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 focus:border-sky-500 focus:outline-none">
            </div>
            <div>
              <label class="text-[11px] text-slate-400 font-semibold">Bank *</label>
              <select id="di-chq-bank" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 focus:border-sky-500 focus:outline-none">
                ${LK_BANKS.map(b => `<option value="${b}">${b}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="text-[11px] text-slate-400 font-semibold">Branch</label>
              <input type="text" id="di-chq-branch" value="Kadawatha" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 focus:border-sky-500 focus:outline-none">
            </div>
            <div>
              <label class="text-[11px] text-slate-400 font-semibold">Cheque Date (Issue Date)</label>
              <input type="date" id="di-chq-date" value="${distNowDate()}" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 focus:border-sky-500 focus:outline-none">
            </div>
            <div>
              <label class="text-[11px] text-amber-300 font-bold flex items-center gap-1"><i class="fa-solid fa-calendar-check"></i> Realize Date (Maturity Date) *</label>
              <input type="date" id="di-chq-realize" value="${distAddDays(distNowDate(), 14)}" class="w-full mt-1 px-3 py-2 bg-white/5 border border-amber-500/40 rounded-xl text-xs text-amber-300 font-semibold focus:border-amber-400 focus:outline-none">
            </div>
            <div>
              <label class="text-[11px] text-slate-400 font-semibold">Drawer / Account Holder Name</label>
              <input type="text" id="di-chq-drawer" placeholder="Retailer account name" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 focus:border-sky-500 focus:outline-none">
            </div>
          </div>
        </div>
      </div>

      <div id="di-totals" class="bg-slate-900/40 rounded-xl p-4 space-y-1 text-sm text-slate-300"></div>

      <div>
        <label class="text-xs text-slate-400 font-semibold">Notes</label>
        <textarea id="di-note" rows="2" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200"></textarea>
      </div>

      <div class="flex gap-2">
        <button onclick="distSubmitInvoice()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-sm shadow-lg flex items-center gap-2"><i class="fa-solid fa-check"></i> Save Invoice</button>
        <button onclick="distNewItems=[]; distRenderNewSale()" class="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-sm border border-white/10">Reset Lines</button>
      </div>
    </div>
  `;
  distRenderLines();
  distOnRetailerChange();
  distCalcTotals();
}

function distOnRetailerChange() {
  const rid = document.getElementById('di-retailer')?.value;
  const r = DIST.retailers.find(x=>x.id===rid);
  if (!r) return;
  const routeSel = document.getElementById('di-route'); if (routeSel) routeSel.value = r.route;
  const repSel = document.getElementById('di-rep');
  const rep = DIST.reps.find(x=>x.route===r.route);
  if (repSel && rep) repSel.value = rep.id;
  const vanSel = document.getElementById('di-van');
  const van = DIST.vans.find(x=>x.route===r.route);
  if (vanSel && van) vanSel.value = van.id;
}
function distTogglePayExtra() {
  const m = document.getElementById('di-paymode')?.value;
  const cw = document.getElementById('di-cash-wrap');
  const chq = document.getElementById('di-cheque-wrap');
  if (cw) cw.classList.toggle('hidden', m==='CHEQUE' || m==='CREDIT');
  if (chq) chq.classList.toggle('hidden', m!=='CHEQUE');
  distCalcTotals();
}
function distAddLine() {
  distNewItems.push({ product_id: DIST.products[0]?.id, qty: 1 });
  distRenderLines();
  distCalcTotals();
}
function distRemoveLine(i) {
  distNewItems.splice(i,1);
  if (distNewItems.length===0) distNewItems.push({ product_id: DIST.products[0]?.id, qty: 1 });
  distRenderLines();
  distCalcTotals();
}
function distRenderLines() {
  const c = document.getElementById('di-lines');
  if (!c) return;
  c.innerHTML = distNewItems.map((line,i) => `
    <div class="grid grid-cols-12 gap-2 items-center bg-slate-900/30 rounded-xl p-2">
      <div class="col-span-7">
        <select onchange="distNewItems[${i}].product_id=this.value; distCalcTotals()" class="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-200">
          ${DIST.products.map(p => `<option value="${p.id}" ${p.id===line.product_id?'selected':''}>${dEsc(p.name)} (${dMoney(p.price)}/${p.unit})</option>`).join('')}
        </select>
      </div>
      <div class="col-span-3">
        <input type="number" min="1" value="${line.qty}" onchange="distNewItems[${i}].qty=parseInt(this.value)||1; distCalcTotals()" class="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-200" placeholder="Qty">
      </div>
      <div class="col-span-1 text-right text-xs text-emerald-300 font-bold" id="di-line-${i}">0</div>
      <div class="col-span-1 text-right">
        <button onclick="distRemoveLine(${i})" class="text-rose-400 hover:text-rose-300 text-xs"><i class="fa-solid fa-xmark"></i></button>
      </div>
    </div>`).join('');
  distCalcTotals();
}
function distCalcTotals() {
  let subtotal = 0;
  distNewItems.forEach((line,i) => {
    const p = DIST.products.find(x=>x.id===line.product_id);
    const qty = Math.max(1, parseInt(line.qty)||1);
    const lt = p ? p.price*qty : 0;
    subtotal += lt;
    const el = document.getElementById('di-line-'+i);
    if (el) el.innerText = dMoney(lt).replace('Rs. ','');
  });
  const discount = parseFloat(document.getElementById('di-discount')?.value) || 0;
  const tax = subtotal * 0.08;
  const total = subtotal + tax - discount;
  const mode = document.getElementById('di-paymode')?.value;
  const cash = parseFloat(document.getElementById('di-cash')?.value) || 0;
  let paid = 0;
  if (mode === 'CASH') paid = total;
  else if (mode === 'PARTIAL') paid = cash;
  else if (mode === 'CHEQUE') paid = 0;
  else if (mode === 'CREDIT') paid = cash; // optional partial
  // if mode CREDIT with cash
  if (mode === 'CREDIT' && cash>0) paid = cash;
  if (mode === 'CASH') { const ci = document.getElementById('di-cash'); if (ci) ci.value = total.toFixed(2); paid = total; }
  const balance = total - paid;

  const t = document.getElementById('di-totals');
  if (t) t.innerHTML = `
    <div class="flex justify-between"><span>Subtotal</span><span class="font-medium">${dMoney(subtotal)}</span></div>
    <div class="flex justify-between"><span>Tax (8%)</span><span class="font-medium">${dMoney(tax)}</span></div>
    <div class="flex justify-between"><span>Discount</span><span class="font-medium text-amber-300">- ${dMoney(discount)}</span></div>
    <div class="flex justify-between border-t border-white/10 pt-2 text-base font-extrabold text-white"><span>Total Payable</span><span class="text-emerald-400 text-lg">${dMoney(total)}</span></div>
    <div class="flex justify-between text-xs"><span>Cash/Collected now</span><span class="text-emerald-300">${dMoney(paid)}</span></div>
    <div class="flex justify-between text-xs font-bold"><span>Outstanding Balance</span><span class="${balance>0?'text-amber-300':'text-slate-500'}">${dMoney(balance)}</span></div>
  `;
}
function distSubmitInvoice() {
  const retailerId = document.getElementById('di-retailer')?.value;
  const ret = DIST.retailers.find(x=>x.id===retailerId);
  if (!ret) { toast('Select retailer','error'); return; }
  const lines = distNewItems.filter(l=>l.product_id);
  if (lines.length===0) { toast('Add at least one line','error'); return; }
  const items = lines.map(l=>{
    const p = DIST.products.find(x=>x.id===l.product_id);
    const qty = Math.max(1, parseInt(l.qty)||1);
    return { product_id:p.id, name:p.name, emoji:p.emoji||'', quantity:qty, unit_price:p.price, total:Number((p.price*qty).toFixed(2)) };
  });
  const subtotal = Number(items.reduce((s,i)=>s+i.total,0).toFixed(2));
  const discount = parseFloat(document.getElementById('di-discount')?.value) || 0;
  const tax = Number((subtotal*0.08).toFixed(2));
  const total = Number((subtotal+tax-discount).toFixed(2));
  const mode = document.getElementById('di-paymode')?.value;
  const cash = parseFloat(document.getElementById('di-cash')?.value) || 0;
  let paid = 0;
  if (mode==='CASH') paid = total;
  else if (mode==='PARTIAL') paid = cash;
  else if (mode==='CHEQUE') paid = 0;
  else if (mode==='CREDIT') paid = cash; // optional partial
  paid = Number(paid.toFixed(2));
  const balance = Number((total-paid).toFixed(2));

  const vanId = document.getElementById('di-van')?.value;
  const van = DIST.vans.find(x=>x.id===vanId);
  const repId = document.getElementById('di-rep')?.value;
  const rep = DIST.reps.find(x=>x.id===repId);
  const routeId = document.getElementById('di-route')?.value;
  const issuedDate = document.getElementById('di-date')?.value || distNowDate();
  const dueDate = document.getElementById('di-due')?.value || distAddDays(issuedDate,30);
  const invNo = 'INV-' + (5000 + DIST.invoices.length + 1);
  const pm = mode==='PARTIAL' ? 'CASH' : mode;

  const chqNo = (document.getElementById('di-chq-no')?.value || '').trim() || ('CHQ-' + Math.floor(100000 + Math.random() * 900000));
  const chqBank = document.getElementById('di-chq-bank')?.value || 'Commercial Bank';
  const chqBranch = (document.getElementById('di-chq-branch')?.value || '').trim() || 'Kadawatha';
  const chqDate = document.getElementById('di-chq-date')?.value || issuedDate;
  const chqRealizeDate = document.getElementById('di-chq-realize')?.value || distAddDays(issuedDate, 14);
  const chqDrawer = (document.getElementById('di-chq-drawer')?.value || '').trim() || ret.owner || ret.name;

  let chqId = null;
  if (mode === 'CHEQUE') {
    chqId = dUid('CHQ');
    DIST.cheques = DIST.cheques || [];
    DIST.cheques.unshift({
      id: chqId,
      type: 'INWARD',
      party_type: 'RETAILER',
      number: chqNo,
      bank: chqBank,
      branch: chqBranch,
      cheque_date: chqDate,
      realize_date: chqRealizeDate,
      amount: total,
      retailer_id: ret.id,
      retailer_name: ret.name,
      invoice_id: invNo,
      drawer_name: chqDrawer,
      payee_name: 'Pixel POS Distributor',
      rep_name: rep?.name || '',
      van_plate: van?.plate || '',
      status: 'Pending',
      created_at: distNowDate(),
      note: 'Collected for Invoice ' + invNo + ' (PDC)'
    });
  }

  const inv = {
    id: invNo, invoice_no: invNo, issued_date: issuedDate, due_date: dueDate,
    retailer_id: ret.id, retailer_name: ret.name, route: routeId,
    rep_id: rep?.id, rep_name: rep?.name || '', van_id: van?.id, van_plate: van?.plate || '',
    items, subtotal, discount, tax, total,
    payment_method: pm, cash_received: paid, paid, balance,
    cheque_id: chqId,
    cheque_no: (mode==='CHEQUE' ? chqNo : ''),
    cheque_bank: (mode==='CHEQUE' ? chqBank : ''),
    cheque_branch: (mode==='CHEQUE' ? chqBranch : ''),
    cheque_date: (mode==='CHEQUE' ? chqDate : ''),
    cheque_realize_date: (mode==='CHEQUE' ? chqRealizeDate : ''),
    status: 'DELIVERED', note: document.getElementById('di-note')?.value || ''
  };
  DIST.invoices.unshift(inv);

  // update lorry/van stock (sales delivered from selected van)
  const vs = (DIST.lorryStock && DIST.lorryStock[vanId]) || null;
  items.forEach(it => {
    if (vs && vs[it.product_id] !== undefined) {
      vs[it.product_id] = Math.max(0, vs[it.product_id] - it.quantity);
    }
    DIST.stockMoves = DIST.stockMoves || [];
    DIST.stockMoves.unshift({
      id: dUid('MV'), date: issuedDate, type: 'OUT', product_id: it.product_id, name: it.name, qty: it.quantity,
      ref: invNo, note: 'Delivered to ' + ret.name + ' (' + (van?.plate || '') + ')',
      bucket: 'Lorry ' + (van?.plate || '') + ' → Shop'
    });
  });

  // update retailer outstanding
  ret.outstanding = Number((ret.outstanding + balance).toFixed(2));

  // payment record
  if (paid > 0) {
    DIST.payments.unshift({
      id: dUid('PAY'), date: issuedDate, invoice_id: inv.id,
      retailer_id: ret.id, retailer_name: ret.name, amount: paid,
      method: (mode==='CHEQUE'?'CHEQUE':'CASH'),
      ref: inv.cheque_no, note: mode
    });
  }

  distSave();
  distNewItems = [];
  if (mode === 'CHEQUE') {
    toast(`Invoice ${invNo} saved with Cheque ${chqNo} · Due for realization ${chqRealizeDate}`, 'success');
  } else {
    toast(`Invoice ${invNo} saved · Total ${dMoney(total)}`, 'success');
  }
  distView('invoices');
}

// ---------- retailers ----------
function distRenderRetailers(c) {
  c = c || document.getElementById('dist-view');
  c.innerHTML = `
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <h3 class="text-sm font-bold text-slate-200"><i class="fa-solid fa-store mr-2 text-indigo-400"></i>Retailer Accounts / Shops (${DIST.retailers.length})</h3>
      <button onclick="distOpenRetailerModal()" class="px-3 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold flex items-center gap-2"><i class="fa-solid fa-plus"></i> Add Shop</button>
    </div>
    <div class="glass-panel rounded-2xl overflow-x-auto">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="text-xs uppercase bg-white/5 text-slate-400 border-b border-white/10">
          <tr>
            <th class="px-3 py-2.5">Retailer / Shop</th><th class="px-3 py-2.5">Type</th><th class="px-3 py-2.5">Route</th>
            <th class="px-3 py-2.5">Owner / Contact</th><th class="px-3 py-2.5 text-right">Credit Limit</th>
            <th class="px-3 py-2.5 text-right">Outstanding</th><th class="px-3 py-2.5">Status</th>
            <th class="px-3 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${DIST.retailers.map(r => `
            <tr class="border-b border-white/5 hover:bg-white/5">
              <td class="px-3 py-2 font-semibold text-white text-xs">${dEsc(r.name)}<br><span class="text-[10px] text-slate-500">${dEsc(r.address)}</span></td>
              <td class="px-3 py-2 text-xs text-slate-400">${r.type}</td>
              <td class="px-3 py-2 text-xs text-slate-400">${distRouteName(r.route)}</td>
              <td class="px-3 py-2 text-xs text-slate-400">${dEsc(r.owner)}<br><span class="text-[10px]">${r.phone}</span></td>
              <td class="px-3 py-2 text-right text-xs">${dMoney(r.creditLimit)}</td>
              <td class="px-3 py-2 text-right text-xs font-bold ${r.outstanding>0?'text-amber-300':'text-emerald-300'}">${dMoney(r.outstanding)}</td>
              <td class="px-3 py-2 text-xs"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${r.status==='Active'?'bg-emerald-500/20 text-emerald-300':'bg-slate-500/20 text-slate-300'}">${r.status}</span></td>
              <td class="px-3 py-2 text-right whitespace-nowrap">
                <button onclick="distViewRetailer('${r.id}')" class="px-2 py-1 text-xs text-indigo-400 hover:bg-indigo-500/10 rounded" title="Statement"><i class="fa-solid fa-file-lines"></i></button>
                <button onclick="distOpenRetailerModal('${r.id}')" class="px-2 py-1 text-xs text-amber-400 hover:bg-amber-500/10 rounded" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button onclick="distOpenCollectRetailer('${r.id}')" class="px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded" title="Collect"><i class="fa-solid fa-hand-holding-dollar"></i></button>
                <button onclick="distDeleteRetailer('${r.id}')" class="px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded" title="Delete"><i class="fa-solid fa-trash"></i></button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div id="dist-retailer-detail"></div>
  `;
}

function distViewRetailer(id) {
  const r = DIST.retailers.find(x=>x.id===id); if (!r) return;
  const invs = DIST.invoices.filter(i=>i.retailer_id===id);
  const det = document.getElementById('dist-retailer-detail');
  if (!det) return;
  const totalSales = invs.reduce((s,i)=>s+i.total,0);
  const paid = invs.reduce((s,i)=>s+i.paid,0);
  det.innerHTML = `
    <div class="glass-panel p-5 rounded-2xl space-y-3 mt-3">
      <div class="flex items-center justify-between">
        <h4 class="font-bold text-white text-sm"><i class="fa-solid fa-file-lines mr-2 text-indigo-400"></i>Statement · ${dEsc(r.name)}</h4>
        <button onclick="document.getElementById('dist-retailer-detail').innerHTML=''" class="text-slate-400 hover:text-white text-xs"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div class="bg-slate-900/30 rounded-xl p-3"><span class="text-slate-400">Total Sales</span><p class="font-bold text-white">${dMoney(totalSales)}</p></div>
        <div class="bg-slate-900/30 rounded-xl p-3"><span class="text-slate-400">Paid</span><p class="font-bold text-emerald-300">${dMoney(paid)}</p></div>
        <div class="bg-slate-900/30 rounded-xl p-3"><span class="text-slate-400">Outstanding</span><p class="font-bold text-amber-300">${dMoney(r.outstanding)}</p></div>
        <div class="bg-slate-900/30 rounded-xl p-3"><span class="text-slate-400">Credit Limit</span><p class="font-bold text-white">${dMoney(r.creditLimit)}</p></div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="text-[10px] uppercase bg-white/5 text-slate-400 border-b border-white/10">
            <tr><th class="px-2 py-1.5">Invoice</th><th class="px-2 py-1.5">Date</th><th class="px-2 py-1.5">Payment</th><th class="px-2 py-1.5 text-right">Total</th><th class="px-2 py-1.5 text-right">Paid</th><th class="px-2 py-1.5 text-right">Balance</th><th class="px-2 py-1.5">Due</th></tr>
          </thead>
          <tbody>${invs.sort((a,b)=>b.issued_date.localeCompare(a.issued_date)).map(i=>`
            <tr class="border-b border-white/5">
              <td class="px-2 py-1.5 font-mono">${i.invoice_no}</td>
              <td class="px-2 py-1.5">${i.issued_date}</td>
              <td class="px-2 py-1.5">${distPayBadge(i.payment_method)}</td>
              <td class="px-2 py-1.5 text-right">${dMoney(i.total)}</td>
              <td class="px-2 py-1.5 text-right text-emerald-300">${dMoney(i.paid)}</td>
              <td class="px-2 py-1.5 text-right ${i.balance>0?'text-amber-300':'text-slate-500'}">${dMoney(i.balance)}</td>
              <td class="px-2 py-1.5 ${i.due_date < distNowDate() && i.balance>0?'text-rose-300':''}">${i.due_date}</td>
            </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
  `;
}
// ---------- retailer modal (add / edit shop) ----------
let distEditingRetailer = null;

function distOpenRetailerModal(id) {
  distEditingRetailer = id ? DIST.retailers.find(r => r.id === id) : null;
  const r = distEditingRetailer || {};
  // remove any existing
  const existing = document.getElementById('dist-retailer-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'dist-retailer-modal';
  modal.className = 'fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm';
  modal.innerHTML = `
    <div class="glass-panel w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl" style="animation: popIn 0.3s forwards">
      <div class="px-6 py-4 flex justify-between items-center border-b border-white/10 bg-slate-900/50">
        <h3 class="font-bold text-lg text-white"><i class="fa-solid fa-store mr-2 text-indigo-400"></i>${distEditingRetailer ? 'Edit Shop / Retailer' : 'Add New Shop / Retailer'}</h3>
        <button onclick="distCloseRetailerModal()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <form onsubmit="event.preventDefault(); distSubmitRetailerModal();" class="p-6 space-y-3">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Shop / Retailer Name *</label>
            <input type="text" id="drm-name" required value="${dEsc(r.name || '')}" placeholder="e.g. Kadawatha New Mart" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Type</label>
            <select id="drm-type" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
              ${['Grocery & Kade','Phone Shop','Computer Shop','Restaurant'].map(t => `<option ${r.type===t?'selected':''}>${t}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Route</label>
            <select id="drm-route" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
              ${DIST.routes.map(rt => `<option value="${rt.id}" ${r.route===rt.id?'selected':''}>${dEsc(rt.name)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Status</label>
            <select id="drm-status" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
              <option ${r.status==='Active'?'selected':''}>Active</option>
              <option ${r.status==='Inactive'?'selected':''}>Inactive</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Owner Contact</label>
            <input type="text" id="drm-owner" value="${dEsc(r.owner || '')}" placeholder="Owner name" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Phone</label>
            <input type="text" id="drm-phone" value="${dEsc(r.phone || '')}" placeholder="+94 7X XXX XXXX" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-slate-400 mb-1">Address</label>
            <input type="text" id="drm-addr" value="${dEsc(r.address || '')}" placeholder="Street / area" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Credit Limit (Rs.)</label>
            <input type="number" id="drm-limit" value="${r.creditLimit || 100000}" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
          </div>
          ${distEditingRetailer ? `<div><label class="block text-xs font-bold text-slate-400 mb-1">Outstanding (Rs.)</label><input type="text" disabled value="${r.outstanding || 0}" class="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-300"></div>` : ''}
        </div>
        <div class="flex gap-2 pt-2">
          <button type="submit" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-sm shadow-lg"><i class="fa-solid fa-check mr-1"></i>${distEditingRetailer ? 'Save Changes' : 'Add Shop'}</button>
          <button type="button" onclick="distCloseRetailerModal()" class="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-sm border border-white/10">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

function distCloseRetailerModal() {
  const modal = document.getElementById('dist-retailer-modal');
  if (modal) modal.remove();
  distEditingRetailer = null;
}

function distSubmitRetailerModal() {
  const get = (id) => (document.getElementById(id)?.value || '').trim();
  const name = get('drm-name');
  if (!name) { toast('Shop name required','error'); return; }
  const data = {
    name,
    type: get('drm-type') || 'Grocery & Kade',
    route: get('drm-route') || 'r1',
    status: get('drm-status') || 'Active',
    owner: get('drm-owner'),
    phone: get('drm-phone'),
    address: get('drm-addr'),
    creditLimit: parseFloat(get('drm-limit')) || 100000,
  };

  if (distEditingRetailer) {
    const r = DIST.retailers.find(x => x.id === distEditingRetailer);
    if (r) Object.assign(r, data);
    toast('Shop updated','success');
  } else {
    DIST.retailers.push({
      id: dUid('ret'), ...data, outstanding: 0, created: distNowDate()
    });
    toast('Shop added','success');
  }
  distSave();
  distCloseRetailerModal();
  if (DIST.view === 'retailers') distRenderRetailers();
  if (DIST.view === 'overview') distRenderView();
}

function distDeleteRetailer(id) {
  const r = DIST.retailers.find(x => x.id === id);
  if (!r) return;
  if (!confirm(`Delete shop "${r.name}"? Existing invoices will remain.`)) return;
  DIST.retailers = DIST.retailers.filter(x => x.id !== id);
  distSave();
  toast('Shop deleted','info');
  if (DIST.view === 'retailers') distRenderRetailers();
}

// ---------- routes & vans ----------
function distRenderRoutes(c) {
  c = c || document.getElementById('dist-view');
  c.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      ${DIST.routes.map(r => {
        const vans = DIST.vans.filter(v=>v.route===r.id);
        const reps = DIST.reps.filter(x=>x.route===r.id);
        const retailers = DIST.retailers.filter(x=>x.route===r.id);
        const invs = DIST.invoices.filter(i=>i.route===r.id);
        const sales = invs.reduce((s,i)=>s+i.total,0);
        const out = invs.reduce((s,i)=>s+i.balance,0);
        return `
        <div class="glass-panel p-5 rounded-2xl space-y-3 border-l-4" style="border-left-color:${r.color}">
          <h4 class="font-bold text-white text-sm flex items-center gap-2"><i class="fa-solid fa-route" style="color:${r.color}"></i>${dEsc(r.name)}</h4>
          <div class="text-xs text-slate-400 space-y-1">
            <div>Vans: ${vans.map(v=>v.plate).join(', ') || '—'}</div>
            <div>Rep: ${reps.map(x=>x.name).join(', ') || '—'}</div>
            <div>Retailers: ${retailers.length}</div>
            <div>Invoices: ${invs.length}</div>
            <div>Sales: <span class="text-emerald-300 font-bold">${dMoney(sales)}</span></div>
            <div>Outstanding: <span class="text-amber-300 font-bold">${dMoney(out)}</span></div>
          </div>
        </div>`;
      }).join('')}
    </div>

    <div class="glass-panel p-5 rounded-2xl space-y-2">
      <h4 class="font-bold text-slate-200 text-sm mb-2"><i class="fa-solid fa-truck mr-2 text-cyan-400"></i>Van Load Sheets (recent)</h4>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="text-[10px] uppercase bg-white/5 text-slate-400 border-b border-white/10">
            <tr><th class="px-2 py-1.5">Load ID</th><th class="px-2 py-1.5">Date</th><th class="px-2 py-1.5">Van</th><th class="px-2 py-1.5">Route</th><th class="px-2 py-1.5">Rep</th><th class="px-2 py-1.5">Status</th></tr>
          </thead>
          <tbody>
            ${DIST.loads.map(l => `
              <tr class="border-b border-white/5">
                <td class="px-2 py-1.5 font-mono">${l.id}</td>
                <td class="px-2 py-1.5">${l.date}</td>
                <td class="px-2 py-1.5">${l.van_plate}</td>
                <td class="px-2 py-1.5">${distRouteName(l.route)}</td>
                <td class="px-2 py-1.5">${DIST.reps.find(r=>r.id===l.rep_id)?.name || '—'}</td>
                <td class="px-2 py-1.5"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${l.status==='Dispatched'?'bg-cyan-500/20 text-cyan-300':'bg-emerald-500/20 text-emerald-300'}">${l.status}</span></td>
              </tr>`).join('') || `<tr><td colspan="6" class="px-4 py-6 text-center text-slate-500">No loads</td></tr>`}
          </tbody>
        </table>
      </div>
      <button onclick="distCreateLoad()" class="mt-2 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10"><i class="fa-solid fa-plus mr-1"></i>Create Load Sheet</button>
    </div>
  `;
}
function distCreateLoad() {
  const vanId = prompt('Van id (v1/v2/v3):','v1');
  const van = DIST.vans.find(v=>v.id===vanId);
  if (!van) { toast('Invalid van','error'); return; }
  const items = DIST.products.slice(0,4).map(p => ({ product_id:p.id, name:p.name, qty: parseInt(prompt(`Qty to load for ${p.name}:`, '20'))||0 })).filter(i=>i.qty>0);
  if (items.length===0) { toast('No items','error'); return; }
  DIST.loads.unshift({ id: dUid('LOAD'), date: distNowDate(), van_id:van.id, van_plate:van.plate, route:van.route, rep_id: DIST.reps.find(r=>r.route===van.route)?.id, items, status:'Dispatched' });
  // reduce warehouse stock
  items.forEach(i => { if (DIST.stock[i.product_id]!==undefined) DIST.stock[i.product_id] = Math.max(0, DIST.stock[i.product_id]-i.qty); });
  distSave();
  toast('Load sheet created','success');
  distRenderRoutes();
}

// ---------- stock ----------
function distRenderStock(c) {
  c = c || document.getElementById('dist-view');
  const lowThreshold = 30;
  const moves = (DIST.stockMoves || []).slice(0, 50);
  const lowItems = DIST.products.filter(p => (DIST.stock[p.id] || 0) <= (p.reorderQty || lowThreshold));
  const totalVal = DIST.products.reduce((s,p) => s + ((DIST.stock[p.id] || 0) * (p.price || 0)), 0);
  const totalCost = DIST.products.reduce((s,p) => s + ((DIST.stock[p.id] || 0) * (p.cost || 0)), 0);
  const damagedQty = DIST.damagedStock ? Object.values(DIST.damagedStock).reduce((a,b)=>a+b,0) : 0;

  c.innerHTML = `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      ${distKpi('Stock Value (Sell)', dMoney(totalVal), 'fa-boxes-stacked','indigo')}
      ${distKpi('Stock Value (Cost)', dMoney(totalCost), 'fa-coins','emerald')}
      ${distKpi('Low Stock SKUs', lowItems.length, 'fa-triangle-exclamation','rose', true)}
      ${distKpi('Damaged / Quarantined', damagedQty, 'fa-ban','amber', true)}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 glass-panel p-5 rounded-2xl overflow-x-auto">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-bold text-slate-200 text-sm"><i class="fa-solid fa-warehouse mr-2 text-violet-400"></i>Warehouse Stock</h4>
        </div>
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="text-[10px] uppercase bg-white/5 text-slate-400 border-b border-white/10">
            <tr><th class="px-2 py-1.5">SKU / Product</th><th class="px-2 py-1.5">Category</th><th class="px-2 py-1.5">Unit</th><th class="px-2 py-1.5 text-right">Stock</th><th class="px-2 py-1.5 text-right">Reorder</th><th class="px-2 py-1.5 text-right">Sell Price</th><th class="px-2 py-1.5 text-right">Value</th><th class="px-2 py-1.5 text-right">Actions</th></tr>
          </thead>
          <tbody>
            ${DIST.products.map(p => {
              const q = DIST.stock[p.id] || 0;
              const reorder = p.reorderQty || lowThreshold;
              const low = q <= lowThreshold ? 'text-rose-300 font-bold' : 'text-slate-300';
              const flag = q <= reorder ? ' <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300">REORDER</span>' : '';
              return `<tr class="border-b border-white/5">
                <td class="px-2 py-1.5 font-semibold text-white">${dEsc(p.name)}</td>
                <td class="px-2 py-1.5">${p.category||'-'}</td>
                <td class="px-2 py-1.5">${p.unit}</td>
                <td class="px-2 py-1.5 text-right ${low}">${q}${flag}</td>
                <td class="px-2 py-1.5 text-right text-slate-400">${reorder}</td>
                <td class="px-2 py-1.5 text-right">${dMoney(p.price)}</td>
                <td class="px-2 py-1.5 text-right text-emerald-300">${dMoney(q*p.price)}</td>
                <td class="px-2 py-1.5 text-right">
                  <button onclick="distAdjustStock('${p.id}')" class="px-2 py-1 text-xs text-indigo-400 hover:bg-indigo-500/10 rounded" title="Adjust"><i class="fa-solid fa-sliders"></i></button>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div class="glass-panel p-5 rounded-2xl space-y-2">
        <h4 class="font-bold text-slate-200 text-sm mb-2"><i class="fa-solid fa-triangle-exclamation mr-2 text-rose-400"></i>Low Stock &amp; Reorder Alerts</h4>
        ${DIST.products.filter(p => (DIST.stock[p.id] || 0) <= (p.reorderQty || lowThreshold)).map(p => `
          <div class="flex items-center justify-between text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
            <span class="text-slate-200">${dEsc(p.name)}</span>
            <span class="text-rose-300 font-bold">${DIST.stock[p.id] || 0} left · reorder @ ${p.reorderQty || lowThreshold}</span>
          </div>`).join('') || '<p class="text-xs text-emerald-300">All stock healthy.</p>'}
      </div>
    </div>

    <div class="glass-panel p-5 rounded-2xl overflow-x-auto">
      <div class="flex items-center justify-between mb-2">
        <h4 class="font-bold text-slate-200 text-sm"><i class="fa-solid fa-clock-rotate-left mr-2 text-primary"></i>Stock Movement Log (latest)</h4>
      </div>
      <table class="w-full text-left text-xs text-slate-300">
        <thead class="text-[10px] uppercase bg-white/5 text-slate-400 border-b border-white/10">
          <tr><th class="px-2 py-1.5">Date</th><th class="px-2 py-1.5">Type</th><th class="px-2 py-1.5">Product</th><th class="px-2 py-1.5 text-right">Qty</th><th class="px-2 py-1.5">Ref / Doc</th><th class="px-2 py-1.5">Movement</th><th class="px-2 py-1.5">Note</th></tr>
        </thead>
        <tbody>
          ${moves.map(m => `
            <tr class="border-b border-white/5">
              <td class="px-2 py-1.5">${m.date}</td>
              <td class="px-2 py-1.5"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${m.type==='IN'?'bg-emerald-500/20 text-emerald-300':m.type==='OUT'?'bg-rose-500/20 text-rose-300':'bg-amber-500/20 text-amber-300'}">${m.type}</span></td>
              <td class="px-2 py-1.5 font-semibold text-white">${dEsc(m.name)}</td>
              <td class="px-2 py-1.5 text-right font-bold ${m.type==='IN'?'text-emerald-300':'text-rose-300'}">${m.type==='IN'?'+':'-'}${m.qty}</td>
              <td class="px-2 py-1.5 font-mono text-slate-400">${m.ref}</td>
              <td class="px-2 py-1.5 text-slate-400">${m.bucket}</td>
              <td class="px-2 py-1.5 text-slate-500">${dEsc(m.note || '-')}</td>
            </tr>`).join('') || `<tr><td colspan="7" class="px-4 py-6 text-center text-slate-500">No movements recorded.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}
function distAdjustStock(pid) {
  const p = DIST.products.find(x => x.id === pid); if (!p) return;
  const existing = document.getElementById('dist-stock-modal');
  if (existing) existing.remove();
  const modal = document.createElement('div');
  modal.id = 'dist-stock-modal';
  modal.className = 'fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm';
  modal.innerHTML = `
    <div class="glass-panel w-full max-w-md rounded-3xl overflow-hidden shadow-2xl" style="animation: popIn 0.3s forwards">
      <div class="px-6 py-4 flex justify-between items-center border-b border-white/10 bg-slate-900/50">
        <h3 class="font-bold text-lg text-white"><i class="fa-solid fa-sliders mr-2 text-indigo-400"></i>Adjust Stock · ${dEsc(p.name)}</h3>
        <button onclick="distCloseStockModal()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <form onsubmit="event.preventDefault(); distSubmitStockAdjust('${pid}');" class="p-6 space-y-3">
        <div class="bg-slate-900/30 rounded-xl p-3 text-xs text-slate-300">
          Current stock: <span class="text-white font-bold">${DIST.stock[pid] || 0} ${p.unit}</span>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-400 mb-1">Type</label>
          <select id="dsm-type" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
            <option value="in">Stock In (increase)</option>
            <option value="out">Stock Out (decrease)</option>
            <option value="set">Set Absolute (override)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-400 mb-1">Quantity</label>
          <input type="number" id="dsm-qty" min="1" value="1" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-400 mb-1">Reason</label>
          <select id="dsm-reason" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
            <option>Purchase received</option>
            <option>Stock correction</option>
            <option>Damage write-off</option>
            <option>Expired write-off</option>
            <option>Found / cycle count</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-400 mb-1">Reference / Doc No</label>
          <input type="text" id="dsm-ref" placeholder="GRN-001" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-400 mb-1">Notes</label>
          <textarea id="dsm-note" rows="2" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"></textarea>
        </div>
        <div class="flex gap-2 pt-1">
          <button type="submit" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-sm shadow-lg"><i class="fa-solid fa-check mr-1"></i> Apply</button>
          <button type="button" onclick="distCloseStockModal()" class="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-sm border border-white/10">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

function distCloseStockModal() {
  const m = document.getElementById('dist-stock-modal');
  if (m) m.remove();
}

function distSubmitStockAdjust(pid) {
  const p = DIST.products.find(x => x.id === pid); if (!p) return;
  const type = document.getElementById('dsm-type')?.value || 'in';
  const qty = parseInt(document.getElementById('dsm-qty')?.value) || 0;
  if (qty <= 0) { toast('Qty must be > 0','error'); return; }
  const reason = document.getElementById('dsm-reason')?.value || 'Adjustment';
  const ref = document.getElementById('dsm-ref')?.value || '';
  const note = document.getElementById('dsm-note')?.value || '';
  const before = DIST.stock[pid] || 0;
  let after = before;
  let moveType = 'ADJ';
  let moveQty = qty;
  if (type === 'in') { after = before + qty; moveType = 'IN'; }
  else if (type === 'out') { after = Math.max(0, before - qty); moveType = 'OUT'; }
  else if (type === 'set') { after = Math.max(0, qty); moveType = 'ADJ'; moveQty = Math.abs(after - before); }
  if (moveQty === 0 && type !== 'set') { toast('No change','info'); return; }
  DIST.stock[pid] = after;
  DIST.stockMoves = DIST.stockMoves || [];
  DIST.stockMoves.unshift({
    id: dUid('MV'), date: distNowDate(), type: moveType, product_id: pid, name: p.name, qty: moveQty || qty,
    ref: ref || ('ADJ-' + Date.now().toString().slice(-4)), note: reason + (note ? ' · ' + note : ''),
    bucket: moveType === 'IN' ? 'Warehouse' : 'Adjustment'
  });
  distSave();
  toast(`Stock updated: ${before} → ${after} ${p.unit}`, 'success');
  distCloseStockModal();
  distRenderStock();
}

// ---------- collections & credit ----------
let distCollectId = null;
function distRenderCollections(c) {
  c = c || document.getElementById('dist-view');
  const today = distNowDate();
  const open = DIST.invoices.filter(i=>i.balance>0).sort((a,b)=>a.due_date.localeCompare(b.due_date));
  const outstanding = open.reduce((s,i)=>s+i.balance,0);
  const overdue = open.filter(i=>i.due_date<today).reduce((s,i)=>s+i.balance,0);
  const collected = DIST.payments.reduce((s,p)=>s+p.amount,0);
  c.innerHTML = `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      ${distKpi('Outstanding', dMoney(outstanding), 'fa-file-invoice-dollar','amber')}
      ${distKpi('Overdue', dMoney(overdue), 'fa-triangle-exclamation','rose')}
      ${distKpi('Collected (all)', dMoney(collected), 'fa-hand-holding-dollar','emerald')}
      ${distKpi('Open Invoices', open.length, 'fa-file-lines','cyan', true)}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="glass-panel p-5 rounded-2xl space-y-2">
        <h4 class="font-bold text-slate-200 text-sm mb-2"><i class="fa-solid fa-piggy-bank mr-2 text-emerald-400"></i>Record Collection</h4>
        <div id="dist-collect-form">
          <label class="text-xs text-slate-400 font-semibold">Invoice</label>
          <select id="dc-inv" onchange="distFillCollect()" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 mb-2">
            <option value="">— Select open invoice —</option>
            ${open.map(i=>`<option value="${i.id}">${i.invoice_no} · ${dEsc(i.retailer_name)} · Bal ${dMoney(i.balance)}</option>`).join('')}
          </select>
          <div id="dc-info" class="text-xs text-slate-400 mb-2"></div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-xs text-slate-400 font-semibold">Amount (Rs.)</label>
              <input type="number" id="dc-amount" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200">
            </div>
            <div>
              <label class="text-xs text-slate-400 font-semibold">Method</label>
              <select id="dc-method" onchange="distToggleCollectMethod()" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200">
                <option value="CASH">Cash</option>
                <option value="CHEQUE">Cheque (PDC)</option>
                <option value="BANK">Bank Transfer</option>
              </select>
            </div>
          </div>
          <div id="dc-cheque-fields" class="hidden bg-slate-900/60 p-3 rounded-xl border border-sky-500/30 space-y-2 mt-2">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[10px] text-slate-400 font-semibold">Cheque Number *</label>
                <input type="text" id="dc-chq-no" placeholder="CHQ-771201" class="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-slate-200">
              </div>
              <div>
                <label class="text-[10px] text-slate-400 font-semibold">Bank *</label>
                <select id="dc-chq-bank" class="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-slate-200">
                  ${LK_BANKS.map(b => `<option value="${b}">${b}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[10px] text-slate-400 font-semibold">Cheque Date</label>
                <input type="date" id="dc-chq-date" value="${today}" class="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-slate-200">
              </div>
              <div>
                <label class="text-[10px] text-amber-300 font-bold">Realize Date (Maturity) *</label>
                <input type="date" id="dc-chq-realize" value="${distAddDays(today, 14)}" class="w-full px-2 py-1.5 bg-white/5 border border-amber-500/40 rounded text-xs text-amber-300 font-semibold">
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[10px] text-slate-400 font-semibold">Branch</label>
                <input type="text" id="dc-chq-branch" value="Kadawatha" class="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-slate-200">
              </div>
              <div>
                <label class="text-[10px] text-slate-400 font-semibold">Drawer / A/C Name</label>
                <input type="text" id="dc-chq-drawer" placeholder="A/C Holder Name" class="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-slate-200">
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label class="text-xs text-slate-400 font-semibold">Reference / Receipt No</label>
              <input type="text" id="dc-ref" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200">
            </div>
            <div>
              <label class="text-xs text-slate-400 font-semibold">Payment Date</label>
              <input type="date" id="dc-date" value="${today}" class="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200">
            </div>
          </div>
          <button onclick="distSubmitCollection()" class="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-sm flex items-center justify-center gap-2"><i class="fa-solid fa-check"></i> Record Payment</button>
        </div>
      </div>

      <div class="glass-panel p-5 rounded-2xl">
        <h4 class="font-bold text-slate-200 text-sm mb-2"><i class="fa-solid fa-list mr-2 text-indigo-400"></i>Collections Calendar (overdue first)</h4>
        <div class="space-y-2 max-h-80 overflow-y-auto">
          ${open.map(i => `
            <div class="flex items-center justify-between bg-slate-900/30 rounded-lg px-3 py-2 text-xs">
              <div>
                <p class="font-semibold text-white">${dEsc(i.retailer_name)}</p>
                <p class="text-[10px] text-slate-500">${i.invoice_no} · due ${i.due_date}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-amber-300">${dMoney(i.balance)}</p>
                <p class="${i.due_date < today ? 'text-rose-300 font-bold' : 'text-slate-500'} text-[10px]">${i.due_date < today ? 'Overdue ' + distDays(i.due_date, today) + 'd' : 'Open'}</p>
              </div>
            </div>`).join('') || '<p class="text-xs text-slate-500">No open balances.</p>'}
        </div>
      </div>
    </div>

    <div class="glass-panel p-5 rounded-2xl overflow-x-auto">
      <h4 class="font-bold text-slate-200 text-sm mb-2"><i class="fa-solid fa-clock-rotate-left mr-2 text-primary"></i>Recent Collections</h4>
      <table class="w-full text-left text-xs text-slate-300">
        <thead class="text-[10px] uppercase bg-white/5 text-slate-400 border-b border-white/10">
          <tr><th class="px-2 py-1.5">Date</th><th class="px-2 py-1.5">Invoice</th><th class="px-2 py-1.5">Retailer</th><th class="px-2 py-1.5">Method</th><th class="px-2 py-1.5">Reference</th><th class="px-2 py-1.5 text-right">Amount</th></tr>
        </thead>
        <tbody>
          ${DIST.payments.slice(0,20).map(p=>`
            <tr class="border-b border-white/5">
              <td class="px-2 py-1.5">${p.date}</td>
              <td class="px-2 py-1.5 font-mono">${p.invoice_id}</td>
              <td class="px-2 py-1.5">${dEsc(p.retailer_name)}</td>
              <td class="px-2 py-1.5"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${p.method==='CHEQUE'?'bg-sky-500/20 text-sky-300':p.method==='BANK'?'bg-violet-500/20 text-violet-300':'bg-emerald-500/20 text-emerald-300'}">${p.method}</span></td>
              <td class="px-2 py-1.5 text-slate-400">${p.ref||'-'}</td>
              <td class="px-2 py-1.5 text-right font-bold text-emerald-300">${dMoney(p.amount)}</td>
            </tr>`).join('') || `<tr><td colspan="6" class="px-4 py-6 text-center text-slate-500">No collections yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}
function distToggleCollectMethod() {
  const m = document.getElementById('dc-method')?.value;
  const cf = document.getElementById('dc-cheque-fields');
  if (cf) cf.classList.toggle('hidden', m !== 'CHEQUE');
}
function distFillCollect() {
  const id = document.getElementById('dc-inv')?.value;
  const inv = DIST.invoices.find(x=>x.id===id);
  const info = document.getElementById('dc-info');
  const amt = document.getElementById('dc-amount');
  if (!inv) { if(info) info.innerText=''; return; }
  if (info) info.innerHTML = `<span class="font-semibold text-white">${dEsc(inv.retailer_name)}</span> · Total ${dMoney(inv.total)} · Paid ${dMoney(inv.paid)} · <span class="text-amber-300 font-bold">Balance ${dMoney(inv.balance)}</span> · due ${inv.due_date}`;
  if (amt) amt.value = inv.balance;
  const chqDrawer = document.getElementById('dc-chq-drawer');
  if (chqDrawer) chqDrawer.value = inv.retailer_name;
}
function distOpenCollect(id) {
  distView('collections');
  setTimeout(() => {
    const sel = document.getElementById('dc-inv');
    if (sel) { sel.value = id; distFillCollect(); }
  }, 50);
}
function distOpenCollectRetailer(id) {
  const inv = DIST.invoices.filter(i=>i.retailer_id===id && i.balance>0)[0];
  if (inv) distOpenCollect(inv.id);
  else { toast('No open balance for this retailer','info'); }
}
function distSubmitCollection() {
  const id = document.getElementById('dc-inv')?.value;
  const inv = DIST.invoices.find(x=>x.id===id);
  if (!inv) { toast('Select an invoice','error'); return; }
  const amount = parseFloat(document.getElementById('dc-amount')?.value) || 0;
  if (amount <= 0) { toast('Enter a valid amount','error'); return; }
  if (amount > inv.balance) { toast('Amount exceeds balance','error'); return; }
  const method = document.getElementById('dc-method')?.value || 'CASH';
  const ref = document.getElementById('dc-ref')?.value || '';
  const date = document.getElementById('dc-date')?.value || distNowDate();

  let chqNo = ref;
  let chqRealize = date;
  if (method === 'CHEQUE') {
    chqNo = (document.getElementById('dc-chq-no')?.value || '').trim() || ('CHQ-' + Math.floor(100000 + Math.random()*900000));
    const chqBank = document.getElementById('dc-chq-bank')?.value || 'Commercial Bank';
    const chqBranch = (document.getElementById('dc-chq-branch')?.value || '').trim() || 'Kadawatha';
    const chqDate = document.getElementById('dc-chq-date')?.value || date;
    chqRealize = document.getElementById('dc-chq-realize')?.value || distAddDays(date, 14);
    const chqDrawer = (document.getElementById('dc-chq-drawer')?.value || '').trim() || inv.retailer_name;

    DIST.cheques = DIST.cheques || [];
    DIST.cheques.unshift({
      id: dUid('CHQ'),
      type: 'INWARD',
      party_type: 'RETAILER',
      number: chqNo,
      bank: chqBank,
      branch: chqBranch,
      cheque_date: chqDate,
      realize_date: chqRealize,
      amount: amount,
      retailer_id: inv.retailer_id,
      retailer_name: inv.retailer_name,
      invoice_id: inv.id,
      drawer_name: chqDrawer,
      payee_name: 'Pixel POS Distributor',
      rep_name: inv.rep_name || '',
      status: 'Pending',
      created_at: distNowDate(),
      note: 'Collected for Invoice ' + inv.id + ' (PDC)'
    });
  }

  inv.paid = Number((inv.paid + amount).toFixed(2));
  inv.balance = Number((inv.total - inv.paid).toFixed(2));
  inv.cash_received = Number((inv.cash_received + amount).toFixed(2));
  if (method === 'CHEQUE') inv.payment_method = 'CHEQUE';
  const ret = DIST.retailers.find(x=>x.id===inv.retailer_id);
  if (ret) ret.outstanding = Math.max(0, Number((ret.outstanding - amount).toFixed(2)));
  DIST.payments.unshift({ id: dUid('PAY'), date, invoice_id: inv.id, retailer_id: inv.retailer_id, retailer_name: inv.retailer_name, amount, method, ref: chqNo || ref, note: method === 'CHEQUE' ? ('Cheque PDC collected (Realizes ' + chqRealize + ')') : 'Collection' });
  distSave();
  if (method === 'CHEQUE') {
    toast(`Cheque ${chqNo} saved (${dMoney(amount)}) · Realizes on ${chqRealize}`, 'success');
  } else {
    toast(`Collected ${dMoney(amount)}`, 'success');
  }
  distRenderCollections();
}

// ---------- returns ----------
function distRenderReturns(c) {
  c = c || document.getElementById('dist-view');
  c.innerHTML = `
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <h3 class="text-sm font-bold text-slate-200"><i class="fa-solid fa-rotate-left mr-2 text-rose-400"></i>Sales Returns (${DIST.returns.length})</h3>
      <div class="flex gap-2">
        <button onclick="distExportReturns()" class="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold border border-white/10"><i class="fa-solid fa-download mr-1"></i> Export</button>
        <button onclick="distOpenReturn()" class="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/30"><i class="fa-solid fa-plus"></i> New Return</button>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
      ${distKpi('Total Returns', DIST.returns.length, 'fa-rotate-left','rose', true)}
      ${distKpi('Units Returned', DIST.returns.reduce((s,r)=>s+r.items.reduce((x,it)=>x+(it.return_qty||0),0),0), 'fa-boxes-stacked','orange', true)}
      ${distKpi('Total Value', dMoney(DIST.returns.reduce((s,r)=>s+(r.amount||0),0)), 'fa-file-invoice-dollar','amber')}
      ${distKpi('Restocked', dMoney(DIST.returns.filter(r=>r.disposition!=='damaged').reduce((s,r)=>s+(r.amount||0),0)), 'fa-arrow-up','emerald')}
      ${distKpi('Quarantined', dMoney(DIST.returns.filter(r=>r.disposition==='damaged').reduce((s,r)=>s+(r.amount||0),0)), 'fa-ban','rose')}
    </div>
    <div class="glass-panel rounded-2xl overflow-x-auto">
      <table class="w-full text-left text-xs text-slate-300">
        <thead class="text-[10px] uppercase bg-white/5 text-slate-400 border-b border-white/10">
          <tr><th class="px-2 py-1.5">Return ID</th><th class="px-2 py-1.5">Date</th><th class="px-2 py-1.5">Invoice</th><th class="px-2 py-1.5">Retailer</th><th class="px-2 py-1.5">Item</th><th class="px-2 py-1.5 text-right">Qty</th><th class="px-2 py-1.5 text-right">Value</th><th class="px-2 py-1.5">Reason</th><th class="px-2 py-1.5">Disposition</th><th class="px-2 py-1.5">Status</th></tr>
        </thead>
        <tbody>
          ${DIST.returns.map(r => r.items.map(it => `
            <tr class="border-b border-white/5">
              <td class="px-2 py-1.5 font-mono">${r.id}</td>
              <td class="px-2 py-1.5">${r.date}</td>
              <td class="px-2 py-1.5 font-mono">${r.invoice_id}</td>
              <td class="px-2 py-1.5">${dEsc(r.retailer_name)}</td>
              <td class="px-2 py-1.5">${dEsc(it.name)}</td>
              <td class="px-2 py-1.5 text-right">${it.return_qty}</td>
              <td class="px-2 py-1.5 text-right text-rose-300">${dMoney(it.return_qty*it.unit_price)}</td>
              <td class="px-2 py-1.5 text-slate-400">${r.note || it.reason || '-'}</td>
              <td class="px-2 py-1.5"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${r.disposition==='damaged' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}">${r.disposition==='damaged' ? 'Quarantined' : 'Restocked'}</span></td>
              <td class="px-2 py-1.5"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-300">${r.status}</span></td>
            </tr>`).join('')).join('') || `<tr><td colspan="10" class="px-4 py-6 text-center text-slate-500">No returns recorded.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}
let distReturnLines = []; // {inv, items selected}
let distSelectedReturnInv = null;

function distOpenReturn() {
  if (DIST.invoices.length === 0) { toast('No invoices','error'); return; }
  distSelectedReturnInv = DIST.invoices[0].id;
  distReturnLines = [];
  distRenderReturnModal();
}

function distRenderReturnModal() {
  const existing = document.getElementById('dist-return-modal');
  if (existing) existing.remove();

  const inv = DIST.invoices.find(i => i.id === distSelectedReturnInv) || DIST.invoices[0];
  const modal = document.createElement('div');
  modal.id = 'dist-return-modal';
  modal.className = 'fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm';
  modal.innerHTML = `
    <div class="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl" style="animation: popIn 0.3s forwards">
      <div class="px-6 py-4 flex justify-between items-center border-b border-white/10 bg-slate-900/50">
        <h3 class="font-bold text-lg text-white"><i class="fa-solid fa-rotate-left mr-2 text-rose-400"></i>Record Sales Return</h3>
        <button onclick="distCloseReturnModal()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="p-6 space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-400 mb-1">Select Invoice *</label>
          <select id="drm-ret-inv" onchange="distSelectedReturnInv=this.value; distRefreshReturnItems();" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-rose-500 focus:outline-none">
            ${DIST.invoices.slice(0,40).map(i => `<option value="${i.id}" ${i.id===distSelectedReturnInv?'selected':''}>${i.invoice_no} · ${dEsc(i.retailer_name)} · ${i.issued_date} · ${dMoney(i.total)}</option>`).join('')}
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-400 mb-2">Items to return (tick + enter qty)</label>
          <div id="drm-ret-items" class="space-y-2"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Reason</label>
            <select id="drm-ret-reason" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-rose-500 focus:outline-none">
              <option>Damaged in transport</option>
              <option>Expired</option>
              <option>Wrong item sent</option>
              <option>Customer refused</option>
              <option>Quality issue</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Condition / Disposition</label>
            <select id="drm-ret-disp" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-rose-500 focus:outline-none">
              <option value="sellable">Sellable → restock warehouse</option>
              <option value="damaged">Damaged → write off / quarantine</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-400 mb-1">Notes</label>
          <textarea id="drm-ret-note" rows="2" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-rose-500 focus:outline-none"></textarea>
        </div>

        <div id="drm-ret-totals" class="bg-slate-900/40 rounded-xl p-3 text-xs text-slate-300"></div>

        <div class="flex gap-2 pt-1">
          <button onclick="distSubmitReturnModal()" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-sm shadow-lg"><i class="fa-solid fa-check mr-1"></i> Record Return</button>
          <button onclick="distCloseReturnModal()" class="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-sm border border-white/10">Cancel</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  distRefreshReturnItems();
}

function distRefreshReturnItems() {
  const inv = DIST.invoices.find(i => i.id === distSelectedReturnInv);
  const c = document.getElementById('drm-ret-items');
  if (!c || !inv) return;
  c.innerHTML = inv.items.map((it, idx) => `
    <div class="grid grid-cols-12 gap-2 items-center bg-slate-900/30 rounded-xl p-2">
      <div class="col-span-1">
        <input type="checkbox" id="ret-chk-${idx}" onchange="distUpdateReturnTotals()" class="w-4 h-4 accent-rose-500">
      </div>
      <div class="col-span-6 text-xs text-white">${dEsc(it.name)} <span class="text-slate-500">(sold ${it.quantity})</span></div>
      <div class="col-span-3">
        <input type="number" min="1" max="${it.quantity}" value="1" id="ret-qty-${idx}" oninput="distUpdateReturnTotals()" class="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-200" placeholder="Qty">
      </div>
      <div class="col-span-2 text-right text-xs text-rose-300 font-bold" id="ret-amt-${idx}">0</div>
    </div>`).join('');
  // store item refs globally
  window.__retInv = inv;
  distUpdateReturnTotals();
}

function distUpdateReturnTotals() {
  const inv = window.__retInv; if (!inv) return;
  let total = 0, totalQty = 0;
  inv.items.forEach((it, idx) => {
    const chk = document.getElementById('ret-chk-' + idx);
    const qtyInput = document.getElementById('ret-qty-' + idx);
    const amtEl = document.getElementById('ret-amt-' + idx);
    if (chk && chk.checked) {
      const q = Math.min(Math.max(1, parseInt(qtyInput?.value) || 1), it.quantity);
      const val = q * it.unit_price;
      total += val; totalQty += q;
      if (amtEl) amtEl.innerText = dMoney(val).replace('Rs. ','');
    } else {
      if (amtEl) amtEl.innerText = '0';
    }
  });
  const t = document.getElementById('drm-ret-totals');
  if (t) t.innerHTML = `<span class="font-semibold text-white">${totalQty} units</span> selected · Return value <span class="text-rose-300 font-bold">${dMoney(total)}</span>`;
}

function distCloseReturnModal() {
  const m = document.getElementById('dist-return-modal');
  if (m) m.remove();
  window.__retInv = null;
}

function distSubmitReturnModal() {
  const inv = DIST.invoices.find(i => i.id === distSelectedReturnInv);
  if (!inv) { toast('Select invoice','error'); return; }
  const retItems = [];
  let totalValue = 0;
  inv.items.forEach((it, idx) => {
    const chk = document.getElementById('ret-chk-' + idx);
    if (!chk || !chk.checked) return;
    const qInput = document.getElementById('ret-qty-' + idx);
    const q = Math.min(Math.max(1, parseInt(qInput?.value) || 1), it.quantity);
    retItems.push({ ...it, return_qty: q, unit_price: it.unit_price });
    totalValue += q * it.unit_price;
  });
  if (retItems.length === 0) { toast('Tick at least one item','error'); return; }
  const reason = document.getElementById('drm-ret-reason')?.value || 'Damaged';
  const disp = document.getElementById('drm-ret-disp')?.value || 'sellable';
  const note = document.getElementById('drm-ret-note')?.value || '';
  const value = Number(totalValue.toFixed(2));

  // attach reason to items
  retItems.forEach(it => { it.reason = reason; });

  DIST.returns.unshift({
    id: dUid('RET'), date: distNowDate(), invoice_id: inv.id,
    retailer_id: inv.retailer_id, retailer_name: inv.retailer_name,
    items: retItems, amount: value, status: 'Approved', note,
    disposition: disp
  });

  // stock handling
  retItems.forEach(it => {
    if (disp === 'sellable') {
      if (DIST.stock[it.product_id] !== undefined) DIST.stock[it.product_id] += it.return_qty;
    } else {
      if (!DIST.damagedStock) DIST.damagedStock = {};
      DIST.damagedStock[it.product_id] = (DIST.damagedStock[it.product_id] || 0) + it.return_qty;
    }
  });

  // reduce retailer outstanding (credit note)
  const ret = DIST.retailers.find(r => r.id === inv.retailer_id);
  if (ret) ret.outstanding = Math.max(0, Number((ret.outstanding - value).toFixed(2)));
  if (ret) ret.outstanding = Number(ret.outstanding.toFixed(2));

  distSave();
  toast(`Return recorded · ${disp === 'sellable' ? 'restocked' : 'quarantined'}`, 'success');
  distCloseReturnModal();
  distRenderReturns();
}

// ---------- reports ----------
function distRenderReports(c) {
  c = c || document.getElementById('dist-view');
  const today = distNowDate();
  const thisMonth = today.slice(0,7);
  const monthInvs = DIST.invoices.filter(i=>i.issued_date.startsWith(thisMonth));
  const totalSales = monthInvs.reduce((s,i)=>s+i.total,0);
  const cashSales = monthInvs.filter(i=>i.payment_method!=='CREDIT').reduce((s,i)=>s+i.paid,0);
  const creditSales = monthInvs.filter(i=>i.payment_method==='CREDIT').reduce((s,i)=>s+i.total,0);
  const outstanding = DIST.invoices.reduce((s,i)=>s+i.balance,0);
  // by route
  const byRoute = DIST.routes.map(r => {
    const invs = monthInvs.filter(i=>i.route===r.id);
    return { r, sales: invs.reduce((s,i)=>s+i.total,0), count: invs.length, out: invs.reduce((s,i)=>s+i.balance,0) };
  });
  // by payment method
  const byPay = {};
  monthInvs.forEach(i => { byPay[i.payment_method] = (byPay[i.payment_method]||0) + i.total; });
  // top SKUs
  const byProd = {};
  monthInvs.forEach(i => i.items.forEach(it => { byProd[it.name] = (byProd[it.name]||0) + (it.total||0); }));
  const topProds = Object.entries(byProd).sort((a,b)=>b[1]-a[1]).slice(0,10);
  // overdue retailers
  const overdueRets = DIST.retailers.filter(r=>r.outstanding>0).sort((a,b)=>b.outstanding-a.outstanding).slice(0,10);

  c.innerHTML = `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      ${distKpi('Month Sales', dMoney(totalSales), 'fa-chart-column','indigo')}
      ${distKpi('Cash / Collected', dMoney(cashSales), 'fa-money-bill-wave','emerald')}
      ${distKpi('Credit Sales', dMoney(creditSales), 'fa-file-invoice-dollar','amber')}
      ${distKpi('Total Outstanding', dMoney(outstanding), 'fa-triangle-exclamation','rose')}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="glass-panel p-5 rounded-2xl">
        <h4 class="font-bold text-slate-200 text-sm mb-3"><i class="fa-solid fa-route mr-2 text-indigo-400"></i>Sales by Route (this month)</h4>
        <div class="space-y-2">
          ${byRoute.map(x => {
            const pct = totalSales>0 ? (x.sales/totalSales*100) : 0;
            return `<div>
              <div class="flex items-center justify-between text-xs mb-1"><span class="text-slate-300">${dEsc(x.r.name)}</span><span class="text-emerald-300 font-bold">${dMoney(x.sales)} · ${x.count} inv</span></div>
              <div class="w-full h-2 bg-white/5 rounded-full overflow-hidden"><div class="h-2 rounded-full" style="width:${pct}%;background:${x.r.color}"></div></div>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="glass-panel p-5 rounded-2xl">
        <h4 class="font-bold text-slate-200 text-sm mb-3"><i class="fa-solid fa-chart-pie mr-2 text-cyan-400"></i>Sales by Payment Mode</h4>
        <div class="space-y-2">
          ${Object.entries(byPay).map(([k,v]) => {
            const pct = totalSales>0 ? (v/totalSales*100) : 0;
            return `<div class="flex items-center justify-between text-xs">
              <span class="text-slate-300">${distPayBadge(k)} ${k}</span>
              <span class="text-slate-300">${pct.toFixed(1)}% · <span class="text-emerald-300 font-bold">${dMoney(v)}</span></span>
            </div>
            <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2"><div class="h-1.5 rounded-full bg-indigo-500" style="width:${pct}%"></div></div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="glass-panel p-5 rounded-2xl overflow-x-auto">
        <h4 class="font-bold text-slate-200 text-sm mb-2"><i class="fa-solid fa-box mr-2 text-cyan-400"></i>Top SKUs (this month)</h4>
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="text-[10px] uppercase bg-white/5 text-slate-400 border-b border-white/10"><tr><th class="px-2 py-1.5">Product</th><th class="px-2 py-1.5 text-right">Sales</th></tr></thead>
          <tbody>${topProds.map(([n,v])=>`<tr class="border-b border-white/5"><td class="px-2 py-1.5 text-white">${dEsc(n)}</td><td class="px-2 py-1.5 text-right text-emerald-300 font-bold">${dMoney(v)}</td></tr>`).join('') || `<tr><td colspan="2" class="px-2 py-4 text-slate-500">No data</td></tr>`}</tbody>
        </table>
      </div>
      <div class="glass-panel p-5 rounded-2xl overflow-x-auto">
        <h4 class="font-bold text-slate-200 text-sm mb-2"><i class="fa-solid fa-triangle-exclamation mr-2 text-rose-400"></i>Top Outstanding Retailers</h4>
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="text-[10px] uppercase bg-white/5 text-slate-400 border-b border-white/10"><tr><th class="px-2 py-1.5">Retailer</th><th class="px-2 py-1.5 text-right">Outstanding</th></tr></thead>
          <tbody>${overdueRets.map(r=>`<tr class="border-b border-white/5"><td class="px-2 py-1.5 text-white">${dEsc(r.name)}</td><td class="px-2 py-1.5 text-right text-amber-300 font-bold">${dMoney(r.outstanding)}</td></tr>`).join('') || `<tr><td colspan="2" class="px-2 py-4 text-slate-500">None</td></tr>`}</tbody>
        </table>
      </div>
    </div>
  `;
}

// ---------- helpers ----------
function distExportReturns() {
  const rows = (DIST.returns || []).flatMap(r => r.items.map(it => ({
    'Return ID': r.id, 'Date': r.date, 'Invoice': r.invoice_id, 'Retailer': r.retailer_name,
    'Item': it.name, 'Qty': it.return_qty, 'Value': (it.return_qty * it.unit_price).toFixed(2),
    'Disposition': r.disposition || 'sellable', 'Reason': it.reason || '', 'Note': r.note || ''
  })));
  if (rows.length === 0) { toast('No returns to export', 'info'); return; }
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(','), ...rows.map(r => keys.map(k => `"${String(r[k]).replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'distribution-returns.csv'; a.click();
  URL.revokeObjectURL(url);
  toast('Returns exported', 'success');
}

function distClearDamaged() {
  if (!confirm('Clear all quarantined damaged stock (scrap)?')) return;
  DIST.damagedStock = {};
  distSave();
  toast('Damaged stock cleared', 'info');
  if (DIST.view === 'returns') distRenderReturns();
  if (DIST.view === 'stock') distRenderStock();
}

// ---------- main vs lorry stock ----------
function distSetStockTab(tab) {
  distStockTab = tab;
  distRenderStock();
}

function distSetLorryVan(id) {
  distLorryVan = id;
  distRenderStock();
}

function distOpenTransferModal() {
  const existing = document.getElementById('dist-transfer-modal');
  if (existing) existing.remove();
  const vanId = distLorryVan || DIST.vans[0]?.id;
  const modal = document.createElement('div');
  modal.id = 'dist-transfer-modal';
  modal.className = 'fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm';
  modal.innerHTML = `
    <div class="glass-panel w-full max-w-md rounded-3xl overflow-hidden shadow-2xl" style="animation: popIn 0.3s forwards">
      <div class="px-6 py-4 flex justify-between items-center border-b border-white/10 bg-slate-900/50">
        <h3 class="font-bold text-lg text-white"><i class="fa-solid fa-right-left mr-2 text-cyan-400"></i>Transfer Main → Lorry Stock</h3>
        <button onclick="distCloseTransferModal()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <form onsubmit="event.preventDefault(); distSubmitTransfer();" class="p-6 space-y-3">
        <div>
          <label class="block text-xs font-bold text-slate-400 mb-1">Product</label>
          <select id="dt-prod" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none">
            ${DIST.products.map(p => `<option value="${p.id}">${dEsc(p.name)} (main: ${DIST.stock[p.id]||0})</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-400 mb-1">Destination Van / Lorry</label>
          <select id="dt-van" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none">
            ${DIST.vans.map(v => `<option value="${v.id}" ${v.id===vanId?'selected':''}>${v.plate} · ${distRouteName(v.route)}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-400 mb-1">Quantity</label>
          <input type="number" id="dt-qty" min="1" value="10" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-400 mb-1">Reference / Doc No</label>
          <input type="text" id="dt-ref" placeholder="LOAD-001" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-400 mb-1">Notes</label>
          <textarea id="dt-note" rows="2" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"></textarea>
        </div>
        <div class="flex gap-2 pt-1">
          <button type="submit" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg"><i class="fa-solid fa-right-left mr-1"></i> Transfer</button>
          <button type="button" onclick="distCloseTransferModal()" class="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-sm border border-white/10">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

function distCloseTransferModal() {
  const m = document.getElementById('dist-transfer-modal');
  if (m) m.remove();
}

function distSubmitTransfer() {
  const pid = document.getElementById('dt-prod')?.value;
  const vanId = document.getElementById('dt-van')?.value;
  const p = DIST.products.find(x => x.id === pid);
  const van = DIST.vans.find(v => v.id === vanId);
  if (!p || !van) { toast('Invalid','error'); return; }
  const qty = parseInt(document.getElementById('dt-qty')?.value) || 0;
  if (qty <= 0) { toast('Qty must be > 0','error'); return; }
  const before = DIST.stock[pid] || 0;
  if (qty > before) { toast('Not enough in main stock (have ' + before + ')','error'); return; }
  const ref = document.getElementById('dt-ref')?.value || '';
  const note = document.getElementById('dt-note')?.value || '';
  DIST.stock[pid] = before - qty;
  DIST.lorryStock[vanId] = DIST.lorryStock[vanId] || {};
  DIST.lorryStock[vanId][pid] = (DIST.lorryStock[vanId][pid] || 0) + qty;
  DIST.stockMoves = DIST.stockMoves || [];
  DIST.stockMoves.unshift({
    id: dUid('MV'), date: distNowDate(), type: 'OUT', product_id: pid, name: p.name, qty: qty,
    ref: ref || ('TRF-' + Date.now().toString().slice(-4)), note: 'Transferred to ' + van.plate + (note ? ' · ' + note : ''),
    bucket: 'Main Warehouse → ' + van.plate
  });
  DIST.loads = DIST.loads || [];
  // record load sheet for van
  DIST.loads.unshift({ id: dUid('LOAD'), date: distNowDate(), van_id: van.id, van_plate: van.plate, route: van.route, rep_id: DIST.reps.find(r=>r.route===van.route)?.id, items: [{ product_id: pid, name: p.name, qty: qty }], status: 'Dispatched' });
  distSave();
  toast(`Transferred ${qty} ${p.unit} to ${van.plate}`, 'success');
  distCloseTransferModal();
  distRenderStock();
}

// override Stock renderer to include Main/Lorry tabs
function distRenderStock(c) {
  c = c || document.getElementById('dist-view');
  const tab = distStockTab || 'main';
  if (!distLorryVan) distLorryVan = (DIST.vans && DIST.vans[0] && DIST.vans[0].id) || null;
  const lowThreshold = 30;

  const mainView = () => {
    const lowItems = DIST.products.filter(p => (DIST.stock[p.id] || 0) <= (p.reorderQty || lowThreshold));
    const totalVal = DIST.products.reduce((s,p) => s + ((DIST.stock[p.id] || 0) * (p.price || 0)), 0);
    const totalCost = DIST.products.reduce((s,p) => s + ((DIST.stock[p.id] || 0) * (p.cost || 0)), 0);
    const damagedQty = DIST.damagedStock ? Object.values(DIST.damagedStock).reduce((a,b)=>a+b,0) : 0;
    return `
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        ${distKpi('Stock Value (Sell)', dMoney(totalVal), 'fa-boxes-stacked','indigo')}
        ${distKpi('Stock Value (Cost)', dMoney(totalCost), 'fa-coins','emerald')}
        ${distKpi('Low Stock SKUs', lowItems.length, 'fa-triangle-exclamation','rose', true)}
        ${distKpi('Damaged / Quarantined', damagedQty, 'fa-ban','amber', true)}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="lg:col-span-2 glass-panel p-5 rounded-2xl overflow-x-auto">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-slate-200 text-sm"><i class="fa-solid fa-warehouse mr-2 text-violet-400"></i>Main Warehouse Stock</h4>
          </div>
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="text-[10px] uppercase bg-white/5 text-slate-400 border-b border-white/10">
              <tr><th class="px-2 py-1.5">SKU / Product</th><th class="px-2 py-1.5">Category</th><th class="px-2 py-1.5">Unit</th><th class="px-2 py-1.5 text-right">Stock</th><th class="px-2 py-1.5 text-right">Reorder</th><th class="px-2 py-1.5 text-right">Sell Price</th><th class="px-2 py-1.5 text-right">Value</th><th class="px-2 py-1.5 text-right">Actions</th></tr>
            </thead>
            <tbody>
              ${DIST.products.map(p => {
                const q = DIST.stock[p.id] || 0;
                const reorder = p.reorderQty || lowThreshold;
                const low = q <= lowThreshold ? 'text-rose-300 font-bold' : 'text-slate-300';
                const flag = q <= reorder ? ' <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300">REORDER</span>' : '';
                return `<tr class="border-b border-white/5">
                  <td class="px-2 py-1.5 font-semibold text-white">${dEsc(p.name)}</td>
                  <td class="px-2 py-1.5">${p.category||'-'}</td>
                  <td class="px-2 py-1.5">${p.unit}</td>
                  <td class="px-2 py-1.5 text-right ${low}">${q}${flag}</td>
                  <td class="px-2 py-1.5 text-right text-slate-400">${reorder}</td>
                  <td class="px-2 py-1.5 text-right">${dMoney(p.price)}</td>
                  <td class="px-2 py-1.5 text-right text-emerald-300">${dMoney(q*p.price)}</td>
                  <td class="px-2 py-1.5 text-right">
                    <button onclick="distAdjustStock('${p.id}')" class="px-2 py-1 text-xs text-indigo-400 hover:bg-indigo-500/10 rounded" title="Adjust"><i class="fa-solid fa-sliders"></i></button>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="glass-panel p-5 rounded-2xl space-y-2">
          <h4 class="font-bold text-slate-200 text-sm mb-2"><i class="fa-solid fa-triangle-exclamation mr-2 text-rose-400"></i>Low Stock &amp; Reorder Alerts</h4>
          ${DIST.products.filter(p => (DIST.stock[p.id] || 0) <= (p.reorderQty || lowThreshold)).map(p => `
            <div class="flex items-center justify-between text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
              <span class="text-slate-200">${dEsc(p.name)}</span>
              <span class="text-rose-300 font-bold">${DIST.stock[p.id] || 0} left · reorder @ ${p.reorderQty || lowThreshold}</span>
            </div>`).join('') || '<p class="text-xs text-emerald-300">All stock healthy.</p>'}
        </div>
      </div>
    `;
  };

  const lorryView = () => {
    const van = DIST.vans.find(v => v.id === distLorryVan) || DIST.vans[0];
    const vs = DIST.lorryStock && DIST.lorryStock[van?.id] || {};
    const rows = (DIST.products || []).map(p => {
      const q = vs[p.id] || 0;
      return q > 0 ? `<tr class="border-b border-white/5">
        <td class="px-2 py-1.5 font-semibold text-white">${dEsc(p.name)}</td>
        <td class="px-2 py-1.5">${p.unit}</td>
        <td class="px-2 py-1.5 text-right text-cyan-300 font-bold">${q}</td>
        <td class="px-2 py-1.5 text-right">${dMoney(q * (p.price || 0))}</td>
        <td class="px-2 py-1.5 text-slate-400">${distRouteName(van.route)}</td>
      </tr>` : '';
    }).join('');
    const totalVal = DIST.products.reduce((s,p) => s + ((vs[p.id]||0) * (p.price||0)), 0);
    const totalUnits = Object.values(vs).reduce((a,b)=>a+b,0);
    return `
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
        ${distKpi('Lorry: ' + (van?.plate||''), totalUnits, 'fa-truck','cyan', true)}
        ${distKpi('Lorry Stock Value', dMoney(totalVal), 'fa-boxes-stacked','indigo')}
        ${distKpi('Vans on Route', (DIST.vans||[]).length, 'fa-truck-fast','blue', true)}
      </div>

      <div class="flex flex-wrap gap-2 mb-3">
        ${(DIST.vans || []).map(v => `
          <button onclick="distSetLorryVan('${v.id}')" class="px-3 py-2 rounded-xl text-xs font-bold ${v.id===distLorryVan?'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40':'bg-white/5 text-slate-400 border border-white/10'}">
            ${v.plate} (${distRouteName(v.route)})
          </button>`).join('')}
        <button onclick="distOpenTransferModal()" class="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold flex items-center gap-1 ml-auto"><i class="fa-solid fa-right-left"></i> Transfer Main → Lorry</button>
      </div>

      <div class="glass-panel rounded-2xl overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="text-[10px] uppercase bg-white/5 text-slate-400 border-b border-white/10">
            <tr><th class="px-2 py-1.5">Product on Lorry</th><th class="px-2 py-1.5">Unit</th><th class="px-2 py-1.5 text-right">Qty on Lorry</th><th class="px-2 py-1.5 text-right">Value</th><th class="px-2 py-1.5">Route</th></tr>
          </thead>
          <tbody>
            ${rows || `<tr><td colspan="5" class="px-4 py-8 text-center text-slate-500">No stock on this lorry. Transfer from main warehouse.</td></tr>`}
          </tbody>
        </table>
      </div>
    `;
  };

  const moves = (DIST.stockMoves || []).slice(0, 40);

  c.innerHTML = `
    <div class="flex items-center justify-between gap-3 flex-wrap mb-3">
      <h3 class="text-sm font-bold text-slate-200"><i class="fa-solid fa-boxes-stacked mr-2 text-violet-400"></i>Stock Management</h3>
      <div class="flex gap-2">
        <button onclick="distSetStockTab('main')" class="px-3 py-2 rounded-xl text-xs font-bold ${tab==='main'?'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40':'bg-white/5 text-slate-400 border border-white/10'}"><i class="fa-solid fa-warehouse mr-1"></i> Main Stock</button>
        <button onclick="distSetStockTab('lorry')" class="px-3 py-2 rounded-xl text-xs font-bold ${tab==='lorry'?'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40':'bg-white/5 text-slate-400 border border-white/10'}"><i class="fa-solid fa-truck mr-1"></i> Lorry Stock</button>
        <button onclick="distOpenTransferModal()" class="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold flex items-center gap-1"><i class="fa-solid fa-right-left"></i> Transfer</button>
      </div>
    </div>
    ${tab === 'main' ? mainView() : lorryView()}
    <div class="glass-panel p-5 rounded-2xl overflow-x-auto mt-4">
      <h4 class="font-bold text-slate-200 text-sm mb-2"><i class="fa-solid fa-clock-rotate-left mr-2 text-primary"></i>Stock Movement Log (latest)</h4>
      <table class="w-full text-left text-xs text-slate-300">
        <thead class="text-[10px] uppercase bg-white/5 text-slate-400 border-b border-white/10">
          <tr><th class="px-2 py-1.5">Date</th><th class="px-2 py-1.5">Type</th><th class="px-2 py-1.5">Product</th><th class="px-2 py-1.5 text-right">Qty</th><th class="px-2 py-1.5">Ref / Doc</th><th class="px-2 py-1.5">Movement</th><th class="px-2 py-1.5">Note</th></tr>
        </thead>
        <tbody>
          ${moves.map(m => `
            <tr class="border-b border-white/5">
              <td class="px-2 py-1.5">${m.date}</td>
              <td class="px-2 py-1.5"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${m.type==='IN'?'bg-emerald-500/20 text-emerald-300':m.type==='OUT'?'bg-rose-500/20 text-rose-300':'bg-amber-500/20 text-amber-300'}">${m.type}</span></td>
              <td class="px-2 py-1.5 font-semibold text-white">${dEsc(m.name)}</td>
              <td class="px-2 py-1.5 text-right font-bold ${m.type==='IN'?'text-emerald-300':'text-rose-300'}">${m.type==='IN'?'+':'-'}${m.qty}</td>
              <td class="px-2 py-1.5 font-mono text-slate-400">${m.ref}</td>
              <td class="px-2 py-1.5 text-slate-400">${m.bucket}</td>
              <td class="px-2 py-1.5 text-slate-500">${dEsc(m.note || '-')}</td>
            </tr>`).join('') || `<tr><td colspan="7" class="px-4 py-6 text-center text-slate-500">No movements recorded.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

// ---------- CHEQUES & PDC REGISTER (ENTERPRISE DISTRIBUTION DMS) ----------
let distChequeTab = 'inward'; // 'inward' | 'outward' | 'calendar' | 'depositslip' | 'bounced'
let distChequeFilter = 'all'; // 'all' | 'pending' | 'dueToday' | 'due7Days' | 'deposited' | 'realized' | 'bounced'
let distChequeSearch = '';
let distSelectedDepositCheques = new Set();
let distActionChequeId = null;

function distSetChequeTab(tab) {
  distChequeTab = tab;
  distRenderCheques();
}

function distSetChequeFilter(f) {
  distChequeFilter = f;
  distRenderCheques();
}

function distOnChequeSearch(val) {
  distChequeSearch = (val || '').toLowerCase().trim();
  distRenderCheques();
}

function distRenderCheques(c) {
  c = c || document.getElementById('dist-view');
  if (!c) return;

  const today = distNowDate();
  const allCheques = (DIST.cheques || []).slice();

  // Metrics calculation
  const inwardCheques = allCheques.filter(x => (x.type || 'INWARD') === 'INWARD');
  const outwardCheques = allCheques.filter(x => x.type === 'OUTWARD');

  const inwardPending = inwardCheques.filter(x => x.status === 'Pending');
  const inwardPendingVal = inwardPending.reduce((s, x) => s + Number(x.amount || 0), 0);

  const dueToday = inwardPending.filter(x => (x.realize_date || x.date) === today);
  const dueTodayVal = dueToday.reduce((s, x) => s + Number(x.amount || 0), 0);

  const next7DaysDate = distAddDays(today, 7);
  const due7Days = inwardPending.filter(x => {
    const rd = x.realize_date || x.date || '';
    return rd >= today && rd <= next7DaysDate;
  });
  const due7DaysVal = due7Days.reduce((s, x) => s + Number(x.amount || 0), 0);

  const realizedCheques = allCheques.filter(x => x.status === 'Realized' || x.status === 'Cleared');
  const realizedVal = realizedCheques.reduce((s, x) => s + Number(x.amount || 0), 0);

  const bouncedCheques = allCheques.filter(x => x.status === 'Bounced');
  const bouncedVal = bouncedCheques.reduce((s, x) => s + Number(x.amount || 0), 0);

  const outwardPending = outwardCheques.filter(x => x.status === 'Pending');
  const outwardPendingVal = outwardPending.reduce((s, x) => s + Number(x.amount || 0), 0);

  // Tab counts
  const tabCounts = {
    inward: inwardCheques.length,
    outward: outwardCheques.length,
    calendar: due7Days.length + dueToday.length,
    depositslip: inwardPending.length,
    bounced: bouncedCheques.length
  };

  // Render Subtab Content
  let tabContentHtml = '';
  if (distChequeTab === 'inward') {
    tabContentHtml = distRenderInwardTabHtml(inwardCheques, today);
  } else if (distChequeTab === 'outward') {
    tabContentHtml = distRenderOutwardTabHtml(outwardCheques, today);
  } else if (distChequeTab === 'calendar') {
    tabContentHtml = distRenderCalendarTabHtml(inwardCheques, outwardCheques, today);
  } else if (distChequeTab === 'depositslip') {
    tabContentHtml = distRenderDepositSlipTabHtml(inwardPending);
  } else if (distChequeTab === 'bounced') {
    tabContentHtml = distRenderBouncedTabHtml(bouncedCheques);
  }

  c.innerHTML = `
    <!-- Top Action Bar -->
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h3 class="text-base font-black text-white flex items-center gap-2">
          <i class="fa-solid fa-money-check text-sky-400"></i> Cheques &amp; PDC Management
          <span class="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-normal">චෙක්පත් කළමනාකරණය</span>
        </h3>
        <p class="text-xs text-slate-400">Post-Dated Cheques (PDCs) · Realization tracking · Retailer inward &amp; Supplier outward · Banking slips · Bounced recovery</p>
      </div>
      <div class="flex gap-2 flex-wrap">
        <button onclick="distOpenAddChequeModal('INWARD')" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 transition hover:scale-105">
          <i class="fa-solid fa-plus"></i> Add Retailer Cheque
        </button>
        <button onclick="distOpenAddChequeModal('OUTWARD')" class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold border border-indigo-400/30 flex items-center gap-1.5 transition hover:scale-105">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Issue Supplier Cheque
        </button>
        <button onclick="distSetChequeTab('depositslip')" class="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold border border-white/10 flex items-center gap-1.5">
          <i class="fa-solid fa-building-columns text-cyan-400"></i> Deposit Slip
        </button>
      </div>
    </div>

    <!-- KPI Metric Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-6 gap-3">
      <div class="glass-panel p-3.5 rounded-2xl border-l-4 border-l-amber-500">
        <div class="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
          <span>In-Hand PDCs</span>
          <i class="fa-solid fa-vault text-amber-400"></i>
        </div>
        <p class="text-lg font-extrabold text-amber-300 mt-1">${dMoney(inwardPendingVal)}</p>
        <span class="text-[10px] text-slate-500">${inwardPending.length} cheques pending</span>
      </div>

      <div class="glass-panel p-3.5 rounded-2xl border-l-4 border-l-orange-500 ${dueToday.length > 0 ? 'ring-2 ring-orange-500/50 bg-orange-500/10 animate-pulse' : ''}">
        <div class="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
          <span>⭐ Realizing Today</span>
          <i class="fa-solid fa-bell text-orange-400"></i>
        </div>
        <p class="text-lg font-black text-orange-300 mt-1">${dMoney(dueTodayVal)}</p>
        <span class="text-[10px] ${dueToday.length > 0 ? 'text-orange-300 font-bold' : 'text-slate-500'}">${dueToday.length} due for banking</span>
      </div>

      <div class="glass-panel p-3.5 rounded-2xl border-l-4 border-l-cyan-500">
        <div class="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
          <span>Due in 7 Days</span>
          <i class="fa-solid fa-calendar-week text-cyan-400"></i>
        </div>
        <p class="text-lg font-extrabold text-cyan-300 mt-1">${dMoney(due7DaysVal)}</p>
        <span class="text-[10px] text-slate-500">${due7Days.length} maturing soon</span>
      </div>

      <div class="glass-panel p-3.5 rounded-2xl border-l-4 border-l-emerald-500">
        <div class="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
          <span>Total Realized</span>
          <i class="fa-solid fa-circle-check text-emerald-400"></i>
        </div>
        <p class="text-lg font-extrabold text-emerald-300 mt-1">${dMoney(realizedVal)}</p>
        <span class="text-[10px] text-slate-500">${realizedCheques.length} cleared</span>
      </div>

      <div class="glass-panel p-3.5 rounded-2xl border-l-4 border-l-rose-500">
        <div class="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
          <span>⚠️ Bounced / Returned</span>
          <i class="fa-solid fa-triangle-exclamation text-rose-400"></i>
        </div>
        <p class="text-lg font-extrabold text-rose-400 mt-1">${dMoney(bouncedVal)}</p>
        <span class="text-[10px] text-slate-500">${bouncedCheques.length} returned</span>
      </div>

      <div class="glass-panel p-3.5 rounded-2xl border-l-4 border-l-indigo-500">
        <div class="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
          <span>Supplier PDCs</span>
          <i class="fa-solid fa-truck-field text-indigo-400"></i>
        </div>
        <p class="text-lg font-extrabold text-indigo-300 mt-1">${dMoney(outwardPendingVal)}</p>
        <span class="text-[10px] text-slate-500">${outwardPending.length} issued to vendors</span>
      </div>
    </div>

    <!-- Smart Realization Attention Banner -->
    ${dueToday.length > 0 ? `
      <div class="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 border border-amber-500/40 flex items-center justify-between gap-4 flex-wrap shadow-lg">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/30 flex items-center justify-center text-amber-300 text-lg">
            <i class="fa-solid fa-triangle-exclamation animate-bounce"></i>
          </div>
          <div>
            <h4 class="font-extrabold text-white text-sm">Realization Alert: ${dueToday.length} Cheque(s) worth ${dMoney(dueTodayVal)} Matured Today!</h4>
            <p class="text-xs text-amber-200/80">These cheques have reached their realization date (${today}) and are ready for bank deposit or clearing into account.</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="distOpenRealizeModal('${dueToday[0].id}')" class="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow flex items-center gap-1.5">
            <i class="fa-solid fa-circle-check"></i> Realize / Clear First (${dMoney(dueToday[0].amount)})
          </button>
          <button onclick="distSetChequeTab('depositslip')" class="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20">
            Generate Deposit Slip
          </button>
        </div>
      </div>
    ` : ''}

    <!-- Cheque Subtabs Navigation -->
    <div class="flex items-center justify-between gap-3 border-b border-white/10 pb-2 flex-wrap">
      <div class="flex gap-2 overflow-x-auto pb-1">
        <button onclick="distSetChequeTab('inward')" class="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${distChequeTab === 'inward' ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm' : 'bg-white/5 text-slate-400 hover:bg-white/10 border-white/10'}">
          <i class="fa-solid fa-arrow-down-left-and-up-right-to-center text-sky-400"></i> Retailer Cheques (Inward)
          <span class="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-mono">${tabCounts.inward}</span>
        </button>

        <button onclick="distSetChequeTab('outward')" class="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${distChequeTab === 'outward' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm' : 'bg-white/5 text-slate-400 hover:bg-white/10 border-white/10'}">
          <i class="fa-solid fa-arrow-up-from-bracket text-indigo-400"></i> Supplier Cheques (Outward)
          <span class="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-mono">${tabCounts.outward}</span>
        </button>

        <button onclick="distSetChequeTab('calendar')" class="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${distChequeTab === 'calendar' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm' : 'bg-white/5 text-slate-400 hover:bg-white/10 border-white/10'}">
          <i class="fa-solid fa-calendar-days text-cyan-400"></i> Realization Timeline
          <span class="px-1.5 py-0.2 rounded-full ${dueToday.length > 0 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-white/10'} text-[10px] font-mono">${dueToday.length ? dueToday.length + ' today!' : tabCounts.calendar}</span>
        </button>

        <button onclick="distSetChequeTab('depositslip')" class="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${distChequeTab === 'depositslip' ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm' : 'bg-white/5 text-slate-400 hover:bg-white/10 border-white/10'}">
          <i class="fa-solid fa-receipt text-teal-400"></i> Deposit Slip Generator
          <span class="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-mono">${tabCounts.depositslip}</span>
        </button>

        <button onclick="distSetChequeTab('bounced')" class="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${distChequeTab === 'bounced' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm' : 'bg-white/5 text-slate-400 hover:bg-white/10 border-white/10'}">
          <i class="fa-solid fa-triangle-exclamation text-rose-400"></i> Bounced Registry
          <span class="px-1.5 py-0.2 rounded-full ${tabCounts.bounced > 0 ? 'bg-rose-500/30 text-rose-300 font-bold' : 'bg-white/10'} text-[10px] font-mono">${tabCounts.bounced}</span>
        </button>
      </div>

      <div class="relative min-w-[200px]">
        <input type="text" value="${dEsc(distChequeSearch)}" oninput="distOnChequeSearch(this.value)" placeholder="Search cheque / bank / shop…" class="w-full bg-slate-900/70 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none">
        <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-slate-500 text-xs"></i>
      </div>
    </div>

    <!-- Active Tab Body -->
    <div id="dist-cheque-tab-body">
      ${tabContentHtml}
    </div>
  `;
}

// ---------- SUBTAB 1: INWARD CHEQUES (RETAILERS) ----------
function distRenderInwardTabHtml(list, today) {
  // Apply filter
  let filtered = list.slice();
  if (distChequeFilter === 'pending') {
    filtered = filtered.filter(x => x.status === 'Pending');
  } else if (distChequeFilter === 'dueToday') {
    filtered = filtered.filter(x => x.status === 'Pending' && (x.realize_date || x.date) === today);
  } else if (distChequeFilter === 'due7Days') {
    const next7DaysDate = distAddDays(today, 7);
    filtered = filtered.filter(x => x.status === 'Pending' && (x.realize_date || x.date) >= today && (x.realize_date || x.date) <= next7DaysDate);
  } else if (distChequeFilter === 'deposited') {
    filtered = filtered.filter(x => x.status === 'Deposited');
  } else if (distChequeFilter === 'realized') {
    filtered = filtered.filter(x => x.status === 'Realized' || x.status === 'Cleared');
  } else if (distChequeFilter === 'bounced') {
    filtered = filtered.filter(x => x.status === 'Bounced');
  }

  // Apply search
  if (distChequeSearch) {
    const q = distChequeSearch;
    filtered = filtered.filter(x =>
      (x.number && x.number.toLowerCase().includes(q)) ||
      (x.retailer_name && x.retailer_name.toLowerCase().includes(q)) ||
      (x.bank && x.bank.toLowerCase().includes(q)) ||
      (x.invoice_id && x.invoice_id.toLowerCase().includes(q)) ||
      (x.drawer_name && x.drawer_name.toLowerCase().includes(q))
    );
  }

  // Sort by realize date ascending (soonest first)
  filtered.sort((a, b) => (a.realize_date || a.date || '').localeCompare(b.realize_date || b.date || ''));

  return `
    <div class="space-y-3">
      <!-- Filter Chips -->
      <div class="flex gap-1.5 flex-wrap text-xs">
        ${[
          ['all', 'All (' + list.length + ')'],
          ['pending', 'In Hand / Pending (' + list.filter(x=>x.status==='Pending').length + ')'],
          ['dueToday', '⭐ Due Today (' + list.filter(x=>x.status==='Pending' && (x.realize_date||x.date)===today).length + ')'],
          ['due7Days', 'Due Next 7d (' + list.filter(x=>x.status==='Pending' && (x.realize_date||x.date)>=today && (x.realize_date||x.date)<=distAddDays(today,7)).length + ')'],
          ['deposited', 'Deposited (' + list.filter(x=>x.status==='Deposited').length + ')'],
          ['realized', 'Realized / Cleared (' + list.filter(x=>x.status==='Realized'||x.status==='Cleared').length + ')'],
          ['bounced', 'Bounced (' + list.filter(x=>x.status==='Bounced').length + ')']
        ].map(([f, label]) => `
          <button onclick="distSetChequeFilter('${f}')" class="px-2.5 py-1 rounded-lg font-medium transition ${distChequeFilter === f ? 'bg-sky-500 text-slate-950 font-bold shadow' : 'bg-white/5 text-slate-400 hover:bg-white/10'}">
            ${label}
          </button>
        `).join('')}
      </div>

      <!-- Cheques Table -->
      <div class="glass-panel rounded-2xl overflow-x-auto shadow-xl">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="text-[10px] uppercase bg-white/5 text-slate-400 border-b border-white/10 tracking-wider">
            <tr>
              <th class="px-3 py-2.5">Cheque No</th>
              <th class="px-3 py-2.5">Drawee Bank &amp; Branch</th>
              <th class="px-3 py-2.5">Retailer / Drawer</th>
              <th class="px-3 py-2.5">Cheque Date</th>
              <th class="px-3 py-2.5">Realize Date (කල්පිරෙන දිනය)</th>
              <th class="px-3 py-2.5">Invoice</th>
              <th class="px-3 py-2.5 text-right">Amount</th>
              <th class="px-3 py-2.5">Status</th>
              <th class="px-3 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(ch => {
              const rDate = ch.realize_date || ch.date || '-';
              const cDate = ch.cheque_date || ch.date || '-';
              return `
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td class="px-3 py-2">
                  <button onclick="distOpenViewChequeModal('${ch.id}')" title="Click to view visual cheque voucher" class="font-mono text-sky-400 font-bold hover:underline flex items-center gap-1.5">
                    <i class="fa-solid fa-money-check text-[11px]"></i> ${dEsc(ch.number)}
                  </button>
                  <span class="text-[10px] text-slate-500">${ch.rep_name ? 'Rep: ' + dEsc(ch.rep_name) : ''}</span>
                </td>
                <td class="px-3 py-2">
                  <p class="font-semibold text-white flex items-center gap-1.5"><i class="fa-solid fa-building-columns text-[10px] text-slate-400"></i>${dEsc(ch.bank)}</p>
                  <p class="text-[10px] text-slate-400">${dEsc(ch.branch || 'Kadawatha Br.')}</p>
                </td>
                <td class="px-3 py-2">
                  <p class="font-bold text-slate-100">${dEsc(ch.retailer_name || 'Retailer')}</p>
                  <p class="text-[10px] text-slate-400">${ch.drawer_name ? 'A/C: ' + dEsc(ch.drawer_name) : ''}</p>
                </td>
                <td class="px-3 py-2 text-slate-400 font-mono text-[11px]">${cDate}</td>
                <td class="px-3 py-2">
                  <span class="font-mono font-bold text-slate-200 block text-[11px]">${rDate}</span>
                  ${distChequeDueBadge(rDate, ch.status)}
                </td>
                <td class="px-3 py-2 font-mono text-slate-400">
                  ${ch.invoice_id ? `<span class="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-indigo-300 font-semibold">${dEsc(ch.invoice_id)}</span>` : '<span class="text-slate-600">—</span>'}
                </td>
                <td class="px-3 py-2 text-right">
                  <p class="text-emerald-400 font-extrabold text-xs">${dMoney(ch.amount)}</p>
                </td>
                <td class="px-3 py-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                    ch.status==='Realized'||ch.status==='Cleared' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    ch.status==='Deposited' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                    ch.status==='Bounced' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }">${ch.status}</span>
                </td>
                <td class="px-3 py-2 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1">
                    ${ch.status === 'Pending' ? `
                      <button onclick="distOpenDepositModal('${ch.id}')" title="Deposit in Bank" class="px-2 py-1 text-xs text-cyan-400 hover:bg-cyan-500/10 rounded-lg flex items-center gap-1 font-semibold">
                        <i class="fa-solid fa-building-columns"></i> Deposit
                      </button>
                      <button onclick="distOpenRealizeModal('${ch.id}')" title="Realize / Clear" class="px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded-lg flex items-center gap-1 font-semibold">
                        <i class="fa-solid fa-circle-check"></i> Realize
                      </button>
                      <button onclick="distOpenBounceModal('${ch.id}')" title="Mark Bounced" class="px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-1">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                      </button>
                    ` : ''}

                    ${ch.status === 'Deposited' ? `
                      <button onclick="distOpenRealizeModal('${ch.id}')" title="Realize / Clear" class="px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded-lg flex items-center gap-1 font-semibold">
                        <i class="fa-solid fa-circle-check"></i> Realize
                      </button>
                      <button onclick="distOpenBounceModal('${ch.id}')" title="Mark Bounced" class="px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-1">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                      </button>
                    ` : ''}

                    ${ch.status === 'Bounced' ? `
                      <button onclick="distOpenReplaceModal('${ch.id}')" title="Settle or Replace" class="px-2 py-1 text-xs text-amber-400 hover:bg-amber-500/10 rounded-lg flex items-center gap-1 font-semibold">
                        <i class="fa-solid fa-arrows-rotate"></i> Settle
                      </button>
                    ` : ''}

                    <button onclick="distOpenViewChequeModal('${ch.id}')" title="View Cheque Voucher" class="px-2 py-1 text-xs text-slate-300 hover:bg-white/10 rounded-lg">
                      <i class="fa-solid fa-eye"></i>
                    </button>
                    <button onclick="distDeleteCheque('${ch.id}')" title="Delete record" class="px-1.5 py-1 text-xs text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>`;
            }).join('') || `
              <tr>
                <td colspan="9" class="px-4 py-12 text-center text-slate-500">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <i class="fa-solid fa-money-check text-slate-600 text-3xl"></i>
                    <p class="text-sm font-semibold">No retailer cheques found matching criteria</p>
                    <button onclick="distOpenAddChequeModal('INWARD')" class="mt-2 px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/40">
                      + Add New Cheque
                    </button>
                  </div>
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ---------- SUBTAB 2: OUTWARD CHEQUES (SUPPLIERS) ----------
function distRenderOutwardTabHtml(list, today) {
  let filtered = list.slice();
  if (distChequeSearch) {
    const q = distChequeSearch;
    filtered = filtered.filter(x =>
      (x.number && x.number.toLowerCase().includes(q)) ||
      (x.supplier_name && x.supplier_name.toLowerCase().includes(q)) ||
      (x.bank && x.bank.toLowerCase().includes(q)) ||
      (x.ref_doc && x.ref_doc.toLowerCase().includes(q))
    );
  }
  filtered.sort((a,b) => (a.realize_date || a.date || '').localeCompare(b.realize_date || b.date || ''));

  return `
    <div class="space-y-3">
      <div class="flex items-center justify-between gap-3 flex-wrap bg-indigo-500/10 border border-indigo-500/20 p-3.5 rounded-2xl">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300">
            <i class="fa-solid fa-truck-field"></i>
          </div>
          <div>
            <h4 class="font-bold text-white text-xs">Supplier Payments Ledger (Outward Post-Dated Cheques)</h4>
            <p class="text-[11px] text-slate-400">Track cheques written to FMCG manufacturers for bulk warehouse replenishment stock</p>
          </div>
        </div>
        <button onclick="distOpenAddChequeModal('OUTWARD')" class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow flex items-center gap-1.5">
          <i class="fa-solid fa-plus"></i> Issue Cheque to Supplier
        </button>
      </div>

      <div class="glass-panel rounded-2xl overflow-x-auto shadow-xl">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="text-[10px] uppercase bg-white/5 text-slate-400 border-b border-white/10 tracking-wider">
            <tr>
              <th class="px-3 py-2.5">Cheque No</th>
              <th class="px-3 py-2.5">Our Bank Account</th>
              <th class="px-3 py-2.5">Supplier / Payee</th>
              <th class="px-3 py-2.5">Cheque Date</th>
              <th class="px-3 py-2.5">Realize Date (කල්පිරෙන දිනය)</th>
              <th class="px-3 py-2.5">PO / Bill Ref</th>
              <th class="px-3 py-2.5 text-right">Amount (Payable)</th>
              <th class="px-3 py-2.5">Status</th>
              <th class="px-3 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(ch => {
              const rDate = ch.realize_date || ch.date || '-';
              return `
              <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td class="px-3 py-2">
                  <button onclick="distOpenViewChequeModal('${ch.id}')" title="Click to view visual cheque voucher" class="font-mono text-indigo-400 font-bold hover:underline flex items-center gap-1.5">
                    <i class="fa-solid fa-money-check text-[11px]"></i> ${dEsc(ch.number)}
                  </button>
                </td>
                <td class="px-3 py-2">
                  <p class="font-semibold text-white flex items-center gap-1"><i class="fa-solid fa-building-columns text-[10px] text-indigo-400"></i> ${dEsc(ch.our_account_name || ch.bank)}</p>
                  <p class="text-[10px] text-slate-400">${dEsc(ch.branch || '')}</p>
                </td>
                <td class="px-3 py-2">
                  <p class="font-bold text-slate-100">${dEsc(ch.supplier_name || ch.payee_name)}</p>
                  <p class="text-[10px] text-slate-400">${dEsc(ch.note || 'Vendor stock settlement')}</p>
                </td>
                <td class="px-3 py-2 font-mono text-slate-400 text-[11px]">${ch.cheque_date || ch.date || '-'}</td>
                <td class="px-3 py-2">
                  <span class="font-mono font-bold text-slate-200 block text-[11px]">${rDate}</span>
                  ${distChequeDueBadge(rDate, ch.status)}
                </td>
                <td class="px-3 py-2 font-mono text-slate-400">
                  ${ch.ref_doc ? `<span class="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-cyan-300 font-semibold">${dEsc(ch.ref_doc)}</span>` : '—'}
                </td>
                <td class="px-3 py-2 text-right">
                  <p class="text-indigo-300 font-extrabold text-xs">${dMoney(ch.amount)}</p>
                </td>
                <td class="px-3 py-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                    ch.status === 'Realized' || ch.status === 'Cleared' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }">${ch.status}</span>
                </td>
                <td class="px-3 py-2 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1">
                    ${ch.status === 'Pending' ? `
                      <button onclick="distChequeRealize('${ch.id}')" title="Mark Cleared by Supplier" class="px-2.5 py-1 text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-lg flex items-center gap-1 font-bold">
                        <i class="fa-solid fa-check"></i> Cleared
                      </button>
                    ` : ''}
                    <button onclick="distOpenViewChequeModal('${ch.id}')" title="View Cheque Voucher" class="px-2 py-1 text-xs text-slate-300 hover:bg-white/10 rounded-lg">
                      <i class="fa-solid fa-eye"></i>
                    </button>
                    <button onclick="distDeleteCheque('${ch.id}')" title="Delete record" class="px-1.5 py-1 text-xs text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>`;
            }).join('') || `
              <tr>
                <td colspan="9" class="px-4 py-12 text-center text-slate-500">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <i class="fa-solid fa-truck-field text-slate-600 text-3xl"></i>
                    <p class="text-sm font-semibold">No outward supplier cheques recorded yet</p>
                    <button onclick="distOpenAddChequeModal('OUTWARD')" class="mt-2 px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/40">
                      + Issue Cheque to Supplier
                    </button>
                  </div>
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ---------- SUBTAB 3: PDC REALIZATION TIMELINE / CALENDAR ----------
function distRenderCalendarTabHtml(inward, outward, today) {
  const pendingInward = inward.filter(x => x.status === 'Pending');
  const overdueList = pendingInward.filter(x => (x.realize_date || x.date) < today);
  const dueTodayList = pendingInward.filter(x => (x.realize_date || x.date) === today);
  const next7DaysDate = distAddDays(today, 7);
  const next7DaysList = pendingInward.filter(x => {
    const rd = x.realize_date || x.date || '';
    return rd > today && rd <= next7DaysDate;
  });
  const futureList = pendingInward.filter(x => (x.realize_date || x.date) > next7DaysDate);
  const recentlyRealized = inward.filter(x => x.status === 'Realized').slice(0, 5);

  const renderGroup = (title, icon, color, list, isOverdue) => {
    const total = list.reduce((s, x) => s + Number(x.amount || 0), 0);
    return `
      <div class="glass-panel p-4 rounded-2xl space-y-3 border-l-4 border-l-${color}-500">
        <div class="flex items-center justify-between border-b border-white/10 pb-2">
          <div class="flex items-center gap-2">
            <i class="fa-solid ${icon} text-${color}-400"></i>
            <h4 class="font-bold text-white text-sm">${title}</h4>
            <span class="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-slate-300 font-mono">${list.length}</span>
          </div>
          <span class="font-extrabold text-${color}-400 text-sm">${dMoney(total)}</span>
        </div>

        <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
          ${list.map(ch => {
            const rd = ch.realize_date || ch.date;
            return `
            <div class="p-2.5 rounded-xl bg-slate-900/50 border border-white/5 hover:border-white/20 transition flex items-center justify-between gap-3 text-xs">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-sky-400 font-bold">${dEsc(ch.number)}</span>
                  <span class="text-slate-200 font-semibold">${dEsc(ch.retailer_name)}</span>
                </div>
                <div class="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                  <span>${dEsc(ch.bank)}</span>
                  <span>·</span>
                  <span class="font-mono ${isOverdue ? 'text-rose-400 font-bold' : 'text-slate-300'}">Due: ${rd}</span>
                  ${ch.invoice_id ? `<span>·</span><span>${ch.invoice_id}</span>` : ''}
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-emerald-400 font-extrabold text-xs">${dMoney(ch.amount)}</span>
                <button onclick="distOpenRealizeModal('${ch.id}')" title="Quick Realize / Clear" class="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px] border border-emerald-500/30">
                  <i class="fa-solid fa-check"></i>
                </button>
                <button onclick="distOpenViewChequeModal('${ch.id}')" title="View Voucher" class="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-[11px]">
                  <i class="fa-solid fa-eye"></i>
                </button>
              </div>
            </div>`;
          }).join('') || '<p class="text-slate-500 text-xs py-2 italic text-center">No cheques in this bucket.</p>'}
        </div>
      </div>
    `;
  };

  return `
    <div class="space-y-4">
      <div class="bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-xl text-xs text-cyan-200 flex items-center gap-2">
        <i class="fa-solid fa-circle-info text-cyan-400"></i>
        <span><strong>Realization Timeline (PDC Calendar):</strong> Shows upcoming cash-inflow by cheque maturity date. Check on cheques daily to bank on time.</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${renderGroup('🚨 Overdue for Realization', 'fa-clock-rotate-left', 'rose', overdueList, true)}
        ${renderGroup('⭐ Realizing Today (' + today + ')', 'fa-bell', 'amber', dueTodayList, false)}
        ${renderGroup('📅 Maturing Next 7 Days', 'fa-calendar-week', 'cyan', next7DaysList, false)}
        ${renderGroup('🗓️ Future Post-Dated Cheques (PDCs)', 'fa-calendar-days', 'indigo', futureList, false)}
      </div>
    </div>
  `;
}

// ---------- SUBTAB 4: BANK DEPOSIT SLIP GENERATOR ----------
function distRenderDepositSlipTabHtml(pendingList) {
  const bankAccounts = DIST.ourBankAccounts || [];
  const selectedCount = distSelectedDepositCheques.size;
  const selectedList = pendingList.filter(x => distSelectedDepositCheques.has(x.id));
  const selectedTotal = selectedList.reduce((s, x) => s + Number(x.amount || 0), 0);

  return `
    <div class="space-y-4">
      <div class="glass-panel p-5 rounded-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
          <div>
            <h4 class="font-extrabold text-white text-sm flex items-center gap-2">
              <i class="fa-solid fa-building-columns text-teal-400"></i> Bank Deposit Slip &amp; Batch Banking
            </h4>
            <p class="text-xs text-slate-400">Select cheques in hand, pick our company bank account, and generate a printable deposit slip</p>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400">Selected Batch Total:</span>
            <p class="text-lg font-black text-emerald-400">${dMoney(selectedTotal)} <span class="text-xs text-slate-400 font-normal">(${selectedCount} cheques)</span></p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/40 p-4 rounded-xl border border-white/5">
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Deposit To Our Bank Account *</label>
            <select id="dds-bank" class="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-teal-500 focus:outline-none">
              ${bankAccounts.map(b => `<option value="${b.id}">${dEsc(b.name)} · Acc: ${b.accNo}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Deposit Date</label>
            <input type="date" id="dds-date" value="${distNowDate()}" class="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-teal-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Deposit Slip / Batch Ref #</label>
            <input type="text" id="dds-ref" placeholder="DEP-${Math.floor(1000 + Math.random()*9000)}" value="DEP-${Math.floor(1000 + Math.random()*9000)}" class="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-teal-500 focus:outline-none">
          </div>
        </div>

        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <button onclick="distSelectAllDepositCheques(true)" class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10">Select All</button>
            <button onclick="distSelectAllDepositCheques(false)" class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-semibold border border-white/10">Deselect All</button>
          </div>
          <button onclick="distSubmitBatchDeposit()" ${selectedCount === 0 ? 'disabled' : ''} class="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
            <i class="fa-solid fa-receipt"></i> Generate &amp; Print Deposit Slip (${selectedCount})
          </button>
        </div>

        <!-- Cheque Selection Table -->
        <div class="rounded-xl overflow-x-auto border border-white/10">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="text-[10px] uppercase bg-white/5 text-slate-400 border-b border-white/10 tracking-wider">
              <tr>
                <th class="px-3 py-2 w-8"><input type="checkbox" onchange="distSelectAllDepositCheques(this.checked)" ${selectedCount > 0 && selectedCount === pendingList.length ? 'checked' : ''}></th>
                <th class="px-3 py-2">Cheque No</th>
                <th class="px-3 py-2">Bank &amp; Branch</th>
                <th class="px-3 py-2">Retailer / Drawer</th>
                <th class="px-3 py-2">Realize Date</th>
                <th class="px-3 py-2 text-right">Amount</th>
                <th class="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              ${pendingList.map(ch => {
                const isChecked = distSelectedDepositCheques.has(ch.id);
                return `
                <tr class="border-b border-white/5 hover:bg-white/5 ${isChecked ? 'bg-teal-500/10' : ''}">
                  <td class="px-3 py-2">
                    <input type="checkbox" onchange="distToggleDepositChequeSelect('${ch.id}')" ${isChecked ? 'checked' : ''}>
                  </td>
                  <td class="px-3 py-2 font-mono text-sky-400 font-bold">${dEsc(ch.number)}</td>
                  <td class="px-3 py-2">${dEsc(ch.bank)} <span class="text-[10px] text-slate-500">(${dEsc(ch.branch || '')})</span></td>
                  <td class="px-3 py-2 font-semibold text-white">${dEsc(ch.retailer_name)}</td>
                  <td class="px-3 py-2 font-mono">${ch.realize_date || ch.date}</td>
                  <td class="px-3 py-2 text-right text-emerald-400 font-bold">${dMoney(ch.amount)}</td>
                  <td class="px-3 py-2"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">${ch.status}</span></td>
                </tr>`;
              }).join('') || `<tr><td colspan="7" class="px-4 py-8 text-center text-slate-500">No pending cheques in hand to deposit.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ---------- SUBTAB 5: BOUNCED CHEQUES REGISTRY ----------
function distRenderBouncedTabHtml(bouncedList) {
  const totalBounced = bouncedList.reduce((s, x) => s + Number(x.amount || 0), 0);
  const totalCharges = bouncedList.reduce((s, x) => s + Number(x.bounce_charge || 0), 0);

  return `
    <div class="space-y-3">
      <div class="flex items-center justify-between gap-3 flex-wrap bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 text-lg">
            <i class="fa-solid fa-ban"></i>
          </div>
          <div>
            <h4 class="font-bold text-white text-sm">Bounced Cheque Recovery Register (රිලර්න් වූ චෙක්පත්)</h4>
            <p class="text-xs text-rose-200/80">When a cheque bounces, retailer ledger balance is automatically re-opened and bank return fee added.</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-lg font-black text-rose-400">${dMoney(totalBounced)}</p>
          <span class="text-[10px] text-slate-400">+ ${dMoney(totalCharges)} bank charges</span>
        </div>
      </div>

      <div class="glass-panel rounded-2xl overflow-x-auto shadow-xl">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="text-[10px] uppercase bg-white/5 text-slate-400 border-b border-white/10 tracking-wider">
            <tr>
              <th class="px-3 py-2.5">Cheque No</th>
              <th class="px-3 py-2.5">Retailer Shop</th>
              <th class="px-3 py-2.5">Bank</th>
              <th class="px-3 py-2.5">Return Date</th>
              <th class="px-3 py-2.5">Return Reason (LankaClear Code)</th>
              <th class="px-3 py-2.5 text-right">Cheque Amount</th>
              <th class="px-3 py-2.5 text-right">Return Fee</th>
              <th class="px-3 py-2.5 text-right">Total Re-opened</th>
              <th class="px-3 py-2.5 text-right">Recovery Actions</th>
            </tr>
          </thead>
          <tbody>
            ${bouncedList.map(ch => {
              const fee = Number(ch.bounce_charge || 500);
              const totalRestored = Number(ch.amount || 0) + fee;
              return `
              <tr class="border-b border-white/5 hover:bg-white/5">
                <td class="px-3 py-2 font-mono text-rose-400 font-bold">${dEsc(ch.number)}</td>
                <td class="px-3 py-2 font-bold text-white">${dEsc(ch.retailer_name)}</td>
                <td class="px-3 py-2 text-slate-400">${dEsc(ch.bank)}</td>
                <td class="px-3 py-2 font-mono text-slate-400">${ch.bounce_date || '-'}</td>
                <td class="px-3 py-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    ${dEsc(ch.bounce_reason || '01 - Refer to Drawer (Insufficient Funds)')}
                  </span>
                </td>
                <td class="px-3 py-2 text-right font-extrabold text-rose-400">${dMoney(ch.amount)}</td>
                <td class="px-3 py-2 text-right text-slate-400">${dMoney(fee)}</td>
                <td class="px-3 py-2 text-right font-black text-amber-300">${dMoney(totalRestored)}</td>
                <td class="px-3 py-2 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1">
                    <button onclick="distOpenReplaceModal('${ch.id}')" title="Settle or Replace" class="px-2.5 py-1 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg font-bold flex items-center gap-1">
                      <i class="fa-solid fa-arrows-rotate"></i> Settle
                    </button>
                    <button onclick="distOpenViewChequeModal('${ch.id}')" title="View Cheque Voucher" class="px-2 py-1 text-xs text-slate-300 hover:bg-white/10 rounded-lg">
                      <i class="fa-solid fa-eye"></i>
                    </button>
                  </div>
                </td>
              </tr>`;
            }).join('') || `<tr><td colspan="9" class="px-4 py-8 text-center text-slate-500">No bounced cheques. All cheques are clean!</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ---------- ACTIONS & HANDLERS ----------
function distToggleDepositChequeSelect(id) {
  if (distSelectedDepositCheques.has(id)) distSelectedDepositCheques.delete(id);
  else distSelectedDepositCheques.add(id);
  distRenderCheques();
}

function distSelectAllDepositCheques(selectAll) {
  distSelectedDepositCheques.clear();
  if (selectAll) {
    (DIST.cheques || []).filter(x => (x.type || 'INWARD') === 'INWARD' && x.status === 'Pending').forEach(c => distSelectedDepositCheques.add(c.id));
  }
  distRenderCheques();
}

function distSubmitBatchDeposit() {
  const bankId = document.getElementById('dds-bank')?.value || 'bank-1';
  const depDate = document.getElementById('dds-date')?.value || distNowDate();
  const slipRef = document.getElementById('dds-ref')?.value?.trim() || ('DEP-' + Math.floor(1000 + Math.random()*9000));
  const ids = Array.from(distSelectedDepositCheques);
  if (ids.length === 0) { toast('No cheques selected', 'error'); return; }

  const bank = (DIST.ourBankAccounts || []).find(b => b.id === bankId);
  ids.forEach(id => {
    const ch = (DIST.cheques || []).find(x => x.id === id);
    if (ch) {
      ch.status = 'Deposited';
      ch.deposited_date = depDate;
      ch.deposit_slip_ref = slipRef;
      ch.deposit_bank_id = bankId;
      ch.deposit_bank_name = bank?.name || '';
    }
  });
  distSave();
  distOpenDepositSlipModal(ids, bankId, slipRef, depDate);
  distSelectedDepositCheques.clear();
  toast(`Batch of ${ids.length} cheques deposited into ${bank?.name || 'bank'}`, 'success');
  distRenderCheques();
}

// ---------- MODAL: ADD CHEQUE (INWARD / OUTWARD) ----------
function distOpenAddChequeModal(type) {
  type = type || 'INWARD';
  const existing = document.getElementById('dist-add-cheque-modal');
  if (existing) existing.remove();

  const isOutward = type === 'OUTWARD';
  const today = distNowDate();
  const suppliers = DIST.suppliers || [];
  const retailers = DIST.retailers || [];
  const bankAccounts = DIST.ourBankAccounts || [];

  const modal = document.createElement('div');
  modal.id = 'dist-add-cheque-modal';
  modal.className = 'fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm';
  modal.innerHTML = `
    <div class="glass-panel w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl" style="animation: popIn 0.3s forwards">
      <div class="px-6 py-4 flex justify-between items-center border-b border-white/10 bg-slate-900/50">
        <div>
          <h3 class="font-bold text-lg text-white flex items-center gap-2">
            <i class="fa-solid fa-money-check ${isOutward ? 'text-indigo-400' : 'text-sky-400'}"></i>
            ${isOutward ? 'Issue Cheque to Supplier (Outward)' : 'Add Retailer Cheque (Inward PDC)'}
          </h3>
          <p class="text-xs text-slate-400">${isOutward ? 'Vendor inventory settlement check' : 'Customer check collected against invoice or credit'}</p>
        </div>
        <button onclick="distCloseAddChequeModal()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <form onsubmit="event.preventDefault(); distSubmitAddCheque('${type}');" class="p-6 space-y-3.5 max-h-[85vh] overflow-y-auto">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Cheque Number *</label>
            <input type="text" id="dac-no" placeholder="CHQ-123456" value="CHQ-${Math.floor(100000 + Math.random()*900000)}" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-sky-500 focus:outline-none" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Amount (Rs.) *</label>
            <input type="number" id="dac-amount" step="0.01" min="1" value="25000" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-emerald-300 font-extrabold focus:border-emerald-500 focus:outline-none" required>
          </div>
        </div>

        ${isOutward ? `
          <!-- Outward: Supplier Selector -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Supplier / Manufacturer *</label>
              <select id="dac-supplier" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none">
                ${suppliers.map(s => `<option value="${s.id}">${dEsc(s.name)}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Our Bank Account *</label>
              <select id="dac-our-bank" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none">
                ${bankAccounts.map(b => `<option value="${b.id}">${dEsc(b.name)} · Acc: ${b.accNo}</option>`).join('')}
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">PO / Bill Reference #</label>
            <input type="text" id="dac-refdoc" placeholder="PO-2024-99 or GRN-551" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none">
          </div>
        ` : `
          <!-- Inward: Retailer & Invoice -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Retailer / Shop *</label>
              <select id="dac-retailer" onchange="distOnAddChequeRetailerChange()" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-sky-500 focus:outline-none">
                ${retailers.map(r => `<option value="${r.id}">${dEsc(r.name)} (${dMoney(r.outstanding)} due)</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Linked Invoice (optional)</label>
              <input type="text" id="dac-invoice" placeholder="INV-5001" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-sky-500 focus:outline-none">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Retailer Bank *</label>
              <select id="dac-bank" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-sky-500 focus:outline-none">
                ${LK_BANKS.map(b => `<option value="${b}">${b}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Branch</label>
              <input type="text" id="dac-branch" value="Kadawatha" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-sky-500 focus:outline-none">
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Drawer / Account Holder Name</label>
            <input type="text" id="dac-drawer" placeholder="Retailer account name" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-sky-500 focus:outline-none">
          </div>
        `}

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Cheque Date (Issue Date)</label>
            <input type="date" id="dac-date" value="${today}" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-sky-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-amber-300 mb-1 flex items-center gap-1">
              <i class="fa-solid fa-calendar-check"></i> Realize Date (Maturity Date) *
            </label>
            <input type="date" id="dac-realize" value="${distAddDays(today, 14)}" class="w-full bg-slate-900/70 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:border-amber-400 focus:outline-none" required>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">Initial Status</label>
          <select id="dac-status" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-sky-500 focus:outline-none">
            <option value="Pending">Pending (In Hand / Awaiting Realization)</option>
            <option value="Deposited">Deposited into Bank</option>
            <option value="Realized">Realized / Cleared</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">Notes / Remarks</label>
          <textarea id="dac-note" rows="2" placeholder="Payment terms or consignment details…" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"></textarea>
        </div>

        <div class="flex gap-2 pt-2 border-t border-white/10">
          <button type="submit" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5">
            <i class="fa-solid fa-check"></i> ${isOutward ? 'Save & Issue Cheque' : 'Save Check Bill'}
          </button>
          <button type="button" onclick="distCloseAddChequeModal()" class="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  distOnAddChequeRetailerChange();
}

function distOnAddChequeRetailerChange() {
  const rid = document.getElementById('dac-retailer')?.value;
  const ret = (DIST.retailers || []).find(r => r.id === rid);
  if (!ret) return;
  const drawer = document.getElementById('dac-drawer');
  if (drawer && !drawer.value) drawer.value = ret.owner || ret.name;
  const inv = (DIST.invoices || []).find(i => i.retailer_id === rid && i.balance > 0);
  const invInput = document.getElementById('dac-invoice');
  const amtInput = document.getElementById('dac-amount');
  if (inv && invInput && !invInput.value) invInput.value = inv.id;
  if (inv && amtInput && amtInput.value === '25000') amtInput.value = inv.balance;
}

function distCloseAddChequeModal() {
  const modal = document.getElementById('dist-add-cheque-modal');
  if (modal) modal.remove();
}

function distSubmitAddCheque(type) {
  type = type || 'INWARD';
  const no = document.getElementById('dac-no')?.value?.trim();
  const amount = Number(document.getElementById('dac-amount')?.value) || 0;
  const date = document.getElementById('dac-date')?.value || distNowDate();
  const realizeDate = document.getElementById('dac-realize')?.value || date;
  const status = document.getElementById('dac-status')?.value || 'Pending';
  const note = document.getElementById('dac-note')?.value?.trim() || '';

  if (!no || amount <= 0) { toast('Cheque number and valid amount are required', 'error'); return; }

  DIST.cheques = DIST.cheques || [];

  if (type === 'OUTWARD') {
    const supId = document.getElementById('dac-supplier')?.value;
    const supplier = (DIST.suppliers || []).find(s => s.id === supId);
    const bankId = document.getElementById('dac-our-bank')?.value;
    const ourBank = (DIST.ourBankAccounts || []).find(b => b.id === bankId);
    const refDoc = document.getElementById('dac-refdoc')?.value?.trim() || '';

    DIST.cheques.unshift({
      id: dUid('CHQ'),
      type: 'OUTWARD',
      party_type: 'SUPPLIER',
      number: no,
      bank: ourBank?.name?.split('-')[0]?.trim() || 'Commercial Bank',
      branch: 'Kadawatha Br.',
      our_account_id: bankId,
      our_account_name: ourBank?.name || '',
      supplier_id: supId,
      supplier_name: supplier?.name || 'Supplier',
      drawer_name: 'Pixel POS Distributor',
      payee_name: supplier?.name || '',
      ref_doc: refDoc,
      cheque_date: date,
      realize_date: realizeDate,
      amount,
      status,
      created_at: distNowDate(),
      note
    });
    toast(`Supplier cheque ${no} (${dMoney(amount)}) recorded`, 'success');
  } else {
    const rid = document.getElementById('dac-retailer')?.value;
    const retailer = (DIST.retailers || []).find(r => r.id === rid);
    const invId = document.getElementById('dac-invoice')?.value?.trim() || '';
    const bank = document.getElementById('dac-bank')?.value || 'Commercial Bank';
    const branch = document.getElementById('dac-branch')?.value?.trim() || 'Kadawatha';
    const drawer = document.getElementById('dac-drawer')?.value?.trim() || retailer?.owner || retailer?.name || '';

    DIST.cheques.unshift({
      id: dUid('CHQ'),
      type: 'INWARD',
      party_type: 'RETAILER',
      number: no,
      bank,
      branch,
      retailer_id: rid,
      retailer_name: retailer?.name || '',
      drawer_name: drawer,
      payee_name: 'Pixel POS Distributor',
      invoice_id: invId,
      cheque_date: date,
      realize_date: realizeDate,
      amount,
      status,
      created_at: distNowDate(),
      note
    });
    toast(`Retailer cheque ${no} (${dMoney(amount)}) saved into PDC register`, 'success');
  }

  distSave();
  distCloseAddChequeModal();
  distRenderCheques();
}

// ---------- MODAL: DEPOSIT CHEQUE ----------
function distOpenDepositModal(id) {
  distActionChequeId = id;
  const ch = (DIST.cheques || []).find(x => x.id === id);
  if (!ch) return;
  const existing = document.getElementById('dist-deposit-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'dist-deposit-modal';
  modal.className = 'fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm';
  modal.innerHTML = `
    <div class="glass-panel w-full max-w-md rounded-3xl overflow-hidden shadow-2xl" style="animation: popIn 0.3s forwards">
      <div class="px-6 py-4 flex justify-between items-center border-b border-white/10 bg-slate-900/50">
        <h3 class="font-bold text-base text-white flex items-center gap-2">
          <i class="fa-solid fa-building-columns text-cyan-400"></i> Deposit Cheque into Bank
        </h3>
        <button onclick="distCloseDepositModal()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="p-6 space-y-3 text-xs">
        <div class="bg-slate-900/40 p-3 rounded-xl border border-white/5 space-y-1">
          <div class="flex justify-between"><span>Cheque No:</span><span class="font-mono text-sky-400 font-bold">${dEsc(ch.number)}</span></div>
          <div class="flex justify-between"><span>Retailer:</span><span class="font-bold text-white">${dEsc(ch.retailer_name)}</span></div>
          <div class="flex justify-between"><span>Amount:</span><span class="font-extrabold text-emerald-400 text-sm">${dMoney(ch.amount)}</span></div>
          <div class="flex justify-between"><span>Realize Date:</span><span class="font-mono text-amber-300 font-bold">${ch.realize_date || ch.date}</span></div>
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1">Deposit into Our Bank Account *</label>
          <select id="ddm-bank" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none">
            ${(DIST.ourBankAccounts || []).map(b => `<option value="${b.id}">${dEsc(b.name)} · Acc: ${b.accNo}</option>`).join('')}
          </select>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-300 mb-1">Deposit Date</label>
            <input type="date" id="ddm-date" value="${distNowDate()}" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none">
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1">Deposit Slip / Ref #</label>
            <input type="text" id="ddm-ref" placeholder="DEP-4491" value="DEP-${Math.floor(1000 + Math.random()*9000)}" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none">
          </div>
        </div>

        <div class="flex gap-2 pt-2 border-t border-white/10">
          <button onclick="distSubmitDepositModal()" class="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow flex items-center justify-center gap-1.5">
            <i class="fa-solid fa-check"></i> Confirm Bank Deposit
          </button>
          <button onclick="distCloseDepositModal()" class="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function distCloseDepositModal() {
  const m = document.getElementById('dist-deposit-modal');
  if (m) m.remove();
}

function distSubmitDepositModal() {
  const ch = (DIST.cheques || []).find(x => x.id === distActionChequeId);
  if (!ch) return;
  const bankId = document.getElementById('ddm-bank')?.value;
  const bank = (DIST.ourBankAccounts || []).find(b => b.id === bankId);
  ch.status = 'Deposited';
  ch.deposited_date = document.getElementById('ddm-date')?.value || distNowDate();
  ch.deposit_slip_ref = document.getElementById('ddm-ref')?.value || '';
  ch.deposit_bank_id = bankId;
  ch.deposit_bank_name = bank?.name || '';
  distSave();
  toast(`Cheque ${ch.number} marked Deposited to ${bank?.name || 'bank'}`, 'success');
  distCloseDepositModal();
  distRenderCheques();
}

// ---------- MODAL: REALIZE / CLEAR CHEQUE ----------
function distOpenRealizeModal(id) {
  distActionChequeId = id;
  const ch = (DIST.cheques || []).find(x => x.id === id);
  if (!ch) return;
  const existing = document.getElementById('dist-realize-modal');
  if (existing) existing.remove();

  const inv = (DIST.invoices || []).find(i => i.id === ch.invoice_id);

  const modal = document.createElement('div');
  modal.id = 'dist-realize-modal';
  modal.className = 'fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm';
  modal.innerHTML = `
    <div class="glass-panel w-full max-w-md rounded-3xl overflow-hidden shadow-2xl" style="animation: popIn 0.3s forwards">
      <div class="px-6 py-4 flex justify-between items-center border-b border-white/10 bg-slate-900/50">
        <h3 class="font-bold text-base text-white flex items-center gap-2">
          <i class="fa-solid fa-circle-check text-emerald-400"></i> Realize &amp; Clear Cheque (මුදල් බැර කිරීම)
        </h3>
        <button onclick="distCloseRealizeModal()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="p-6 space-y-3 text-xs">
        <div class="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20 space-y-1">
          <div class="flex justify-between"><span>Cheque No:</span><span class="font-mono text-sky-400 font-bold">${dEsc(ch.number)}</span></div>
          <div class="flex justify-between"><span>Retailer / Drawer:</span><span class="font-bold text-white">${dEsc(ch.retailer_name)}</span></div>
          <div class="flex justify-between"><span>Amount:</span><span class="font-black text-emerald-400 text-base">${dMoney(ch.amount)}</span></div>
          ${inv ? `<div class="flex justify-between text-slate-400"><span>Linked Invoice:</span><span class="font-mono">${inv.id} (Bal: ${dMoney(inv.balance)})</span></div>` : ''}
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1">Realization / Clearing Date</label>
          <input type="date" id="drm-date" value="${distNowDate()}" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none">
        </div>

        <div class="p-3 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
          <label class="flex items-center gap-2 font-bold text-slate-200 cursor-pointer">
            <input type="checkbox" id="drm-reconcile" checked class="rounded border-white/20 text-emerald-500 focus:ring-0">
            <span>Automatically Reconcile Invoice &amp; Customer Ledger</span>
          </label>
          <p class="text-[11px] text-slate-400 pl-5">Marks linked invoice paid, reduces retailer outstanding debt balance, and creates cashflow collection entry.</p>
        </div>

        <div class="flex gap-2 pt-2 border-t border-white/10">
          <button onclick="distSubmitRealizeModal()" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs shadow flex items-center justify-center gap-1.5">
            <i class="fa-solid fa-circle-check"></i> Confirm Realization
          </button>
          <button onclick="distCloseRealizeModal()" class="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function distCloseRealizeModal() {
  const m = document.getElementById('dist-realize-modal');
  if (m) m.remove();
}

function distSubmitRealizeModal() {
  distChequeRealize(distActionChequeId);
  distCloseRealizeModal();
}

function distChequeRealize(id, dateOverride) {
  const ch = (DIST.cheques || []).find(x => x.id === id);
  if (!ch) return;
  const realizeDate = dateOverride || document.getElementById('drm-date')?.value || distNowDate();
  const autoReconcile = document.getElementById('drm-reconcile') ? document.getElementById('drm-reconcile').checked : true;

  ch.status = 'Realized';
  ch.realized_date = realizeDate;

  if ((ch.type || 'INWARD') === 'INWARD') {
    if (autoReconcile) {
      const inv = (DIST.invoices || []).find(i => i.id === ch.invoice_id);
      if (inv && inv.balance > 0) {
        const amt = Math.min(ch.amount, inv.balance);
        inv.paid = Number((inv.paid + amt).toFixed(2));
        inv.balance = Number((inv.total - inv.paid).toFixed(2));
        inv.cash_received = Number((inv.cash_received + amt).toFixed(2));
        const ret = (DIST.retailers || []).find(r => r.id === inv.retailer_id);
        if (ret) ret.outstanding = Math.max(0, Number((ret.outstanding - amt).toFixed(2)));
        DIST.payments = DIST.payments || [];
        DIST.payments.unshift({
          id: dUid('PAY'),
          date: realizeDate,
          invoice_id: inv.id,
          retailer_id: inv.retailer_id,
          retailer_name: inv.retailer_name,
          amount: amt,
          method: 'CHEQUE',
          ref: ch.number,
          note: 'PDC Cheque cleared & realized'
        });
      }
    }
    toast(`Cheque ${ch.number} Realized! ${dMoney(ch.amount)} credited to company`, 'success');
  } else {
    // Outward supplier cheque cleared
    toast(`Supplier Cheque ${ch.number} Realized & debited (${dMoney(ch.amount)})`, 'success');
  }

  distSave();
  distRenderCheques();
}

// ---------- MODAL: BOUNCE / RETURN CHEQUE ----------
function distOpenBounceModal(id) {
  distActionChequeId = id;
  const ch = (DIST.cheques || []).find(x => x.id === id);
  if (!ch) return;
  const existing = document.getElementById('dist-bounce-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'dist-bounce-modal';
  modal.className = 'fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm';
  modal.innerHTML = `
    <div class="glass-panel w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-rose-500/30" style="animation: popIn 0.3s forwards">
      <div class="px-6 py-4 flex justify-between items-center border-b border-rose-500/20 bg-rose-950/40">
        <h3 class="font-bold text-base text-rose-300 flex items-center gap-2">
          <i class="fa-solid fa-triangle-exclamation text-rose-400"></i> Mark Cheque as Bounced (චෙක් රිටර්න්)
        </h3>
        <button onclick="distCloseBounceModal()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="p-6 space-y-3.5 text-xs">
        <div class="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 space-y-1 text-slate-300">
          <div class="flex justify-between"><span>Cheque No:</span><span class="font-mono text-rose-300 font-bold">${dEsc(ch.number)}</span></div>
          <div class="flex justify-between"><span>Retailer:</span><span class="font-bold text-white">${dEsc(ch.retailer_name)}</span></div>
          <div class="flex justify-between"><span>Amount:</span><span class="font-extrabold text-rose-400 text-sm">${dMoney(ch.amount)}</span></div>
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1">Return Reason (LankaClear Code) *</label>
          <select id="dbm-reason" class="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-rose-500 focus:outline-none">
            <option value="01 - Refer to Drawer (Insufficient Funds)">01 - Refer to Drawer (Insufficient Funds)</option>
            <option value="02 - Payment Stopped by Drawer">02 - Payment Stopped by Drawer</option>
            <option value="03 - Drawer's Signature Differs">03 - Drawer's Signature Differs</option>
            <option value="04 - Post-Dated / Stale Cheque">04 - Post-Dated / Stale Cheque</option>
            <option value="05 - Account Closed">05 - Account Closed</option>
            <option value="06 - Words &amp; Figures Differ">06 - Words &amp; Figures Differ</option>
            <option value="07 - Effects Not Cleared">07 - Effects Not Cleared</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-300 mb-1">Return Date</label>
            <input type="date" id="dbm-date" value="${distNowDate()}" class="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-rose-500 focus:outline-none">
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1">Bank Return Penalty Fee (Rs.)</label>
            <input type="number" id="dbm-charge" value="500" class="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-rose-300 font-bold focus:border-rose-500 focus:outline-none">
          </div>
        </div>

        <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 space-y-1">
          <p class="font-bold flex items-center gap-1.5"><i class="fa-solid fa-arrows-rotate"></i> Automatic Debt Reversal:</p>
          <p class="text-[11px] leading-relaxed">The retailer's ledger debt will be automatically RESTORED by <strong>${dMoney(ch.amount)}</strong> (+ Rs. 500 bank penalty), re-opening the outstanding balance.</p>
        </div>

        <div class="flex gap-2 pt-2 border-t border-white/10">
          <button onclick="distSubmitBounceModal()" class="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5">
            <i class="fa-solid fa-ban"></i> Confirm Cheque Return
          </button>
          <button onclick="distCloseBounceModal()" class="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function distCloseBounceModal() {
  const m = document.getElementById('dist-bounce-modal');
  if (m) m.remove();
}

function distSubmitBounceModal() {
  const ch = (DIST.cheques || []).find(x => x.id === distActionChequeId);
  if (!ch) return;
  const reason = document.getElementById('dbm-reason')?.value || '01 - Refer to Drawer';
  const returnDate = document.getElementById('dbm-date')?.value || distNowDate();
  const charge = parseFloat(document.getElementById('dbm-charge')?.value) || 0;

  ch.status = 'Bounced';
  ch.bounce_date = returnDate;
  ch.bounce_reason = reason;
  ch.bounce_charge = charge;

  // Restore retailer ledger outstanding balance
  const ret = (DIST.retailers || []).find(r => r.id === ch.retailer_id);
  const totalRestored = Number(ch.amount || 0) + charge;
  if (ret) {
    ret.outstanding = Number((ret.outstanding + totalRestored).toFixed(2));
  }

  // Restore invoice balance if linked
  const inv = (DIST.invoices || []).find(i => i.id === ch.invoice_id);
  if (inv) {
    inv.balance = Number((inv.balance + ch.amount).toFixed(2));
    inv.paid = Math.max(0, Number((inv.paid - ch.amount).toFixed(2)));
  }

  DIST.payments = DIST.payments || [];
  DIST.payments.unshift({
    id: dUid('PAY'),
    date: returnDate,
    invoice_id: ch.invoice_id || '',
    retailer_id: ch.retailer_id,
    retailer_name: ch.retailer_name,
    amount: -Number(ch.amount || 0),
    method: 'CHEQUE_RETURN',
    ref: ch.number,
    note: `Cheque Bounced (${reason}) · Re-opened debt + Rs. ${charge} bank charge`
  });

  distSave();
  toast(`Cheque ${ch.number} marked Bounced. Retailer debt restored (${dMoney(totalRestored)})`, 'warning');
  distCloseBounceModal();
  distRenderCheques();
}

// ---------- MODAL: SETTLE / REPLACE BOUNCED CHEQUE ----------
function distOpenReplaceModal(id) {
  distActionChequeId = id;
  const ch = (DIST.cheques || []).find(x => x.id === id);
  if (!ch) return;
  const existing = document.getElementById('dist-replace-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'dist-replace-modal';
  modal.className = 'fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm';
  modal.innerHTML = `
    <div class="glass-panel w-full max-w-md rounded-3xl overflow-hidden shadow-2xl" style="animation: popIn 0.3s forwards">
      <div class="px-6 py-4 flex justify-between items-center border-b border-white/10 bg-slate-900/50">
        <h3 class="font-bold text-base text-white flex items-center gap-2">
          <i class="fa-solid fa-arrows-rotate text-amber-400"></i> Settle / Replace Returned Cheque
        </h3>
        <button onclick="distCloseReplaceModal()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="p-6 space-y-3.5 text-xs">
        <div class="bg-slate-900/40 p-3 rounded-xl border border-white/5 space-y-1">
          <div class="flex justify-between"><span>Cheque:</span><span class="font-mono text-rose-400 font-bold">${dEsc(ch.number)}</span></div>
          <div class="flex justify-between"><span>Retailer:</span><span class="font-bold text-white">${dEsc(ch.retailer_name)}</span></div>
          <div class="flex justify-between"><span>Amount + Penalty:</span><span class="font-black text-amber-300">${dMoney(Number(ch.amount || 0) + Number(ch.bounce_charge || 0))}</span></div>
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1">Settlement Method *</label>
          <select id="drpm-method" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none">
            <option value="CASH">Settle with Cash Collection</option>
            <option value="NEW_CHEQUE">Replace with New Post-Dated Cheque</option>
            <option value="REPRESENT">Re-present Cheque to Bank (Second Clearing)</option>
          </select>
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1">Amount Collected (Rs.)</label>
          <input type="number" id="drpm-amt" value="${Number(ch.amount || 0) + Number(ch.bounce_charge || 0)}" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-emerald-300 font-bold focus:border-emerald-500 focus:outline-none">
        </div>

        <div>
          <label class="block font-bold text-slate-300 mb-1">Notes</label>
          <input type="text" id="drpm-note" placeholder="Cash collected or new cheque details…" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none">
        </div>

        <div class="flex gap-2 pt-2 border-t border-white/10">
          <button onclick="distSubmitReplaceModal()" class="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow flex items-center justify-center gap-1.5">
            <i class="fa-solid fa-check"></i> Complete Settlement
          </button>
          <button onclick="distCloseReplaceModal()" class="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function distCloseReplaceModal() {
  const m = document.getElementById('dist-replace-modal');
  if (m) m.remove();
}

function distSubmitReplaceModal() {
  const ch = (DIST.cheques || []).find(x => x.id === distActionChequeId);
  if (!ch) return;
  const method = document.getElementById('drpm-method')?.value || 'CASH';
  const amt = parseFloat(document.getElementById('drpm-amt')?.value) || (Number(ch.amount || 0) + Number(ch.bounce_charge || 0));
  const note = document.getElementById('drpm-note')?.value || '';

  if (method === 'REPRESENT') {
    ch.status = 'Deposited';
    ch.deposited_date = distNowDate();
    toast(`Cheque ${ch.number} re-presented for bank clearing`, 'info');
  } else {
    ch.status = 'Realized';
    ch.note = (ch.note ? ch.note + ' · ' : '') + `Settled via ${method}: ${note}`;
    // reduce retailer outstanding
    const ret = (DIST.retailers || []).find(r => r.id === ch.retailer_id);
    if (ret) ret.outstanding = Math.max(0, Number((ret.outstanding - amt).toFixed(2)));
    toast(`Bounced cheque settled via ${method} (${dMoney(amt)})`, 'success');
  }

  distSave();
  distCloseReplaceModal();
  distRenderCheques();
}

// ---------- MODAL: VISUAL CHEQUE VOUCHER (SRI LANKAN BANK CHEQUE DESIGN) ----------
function distOpenViewChequeModal(id) {
  const ch = (DIST.cheques || []).find(x => x.id === id);
  if (!ch) return;
  const existing = document.getElementById('dist-view-cheque-modal');
  if (existing) existing.remove();

  const cDate = ch.cheque_date || ch.date || distNowDate();
  const rDate = ch.realize_date || ch.date || distNowDate();
  const amtWords = distNumToWords(ch.amount || 0);

  const modal = document.createElement('div');
  modal.id = 'dist-view-cheque-modal';
  modal.className = 'fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4 backdrop-blur-md';
  modal.innerHTML = `
    <div class="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-sky-500/30" style="animation: popIn 0.3s forwards">
      <div class="px-6 py-4 flex justify-between items-center border-b border-white/10 bg-slate-900/60">
        <div>
          <h3 class="font-bold text-base text-white flex items-center gap-2">
            <i class="fa-solid fa-money-check text-sky-400"></i> Official Cheque Voucher (චෙක්පත් පෙරදසුන)
          </h3>
          <p class="text-[11px] text-slate-400">LankaClear Standard Formatted Cheque Slip</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="distPrintChequeVoucher()" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5">
            <i class="fa-solid fa-print"></i> Print
          </button>
          <button onclick="distCloseViewChequeModal()" class="text-slate-400 hover:text-white p-1"><i class="fa-solid fa-xmark text-lg"></i></button>
        </div>
      </div>

      <div class="p-6 space-y-5">
        <!-- Visual Physical Sri Lankan Bank Cheque Card -->
        <div id="printable-cheque-card" class="relative rounded-2xl p-6 bg-gradient-to-br from-amber-50/95 via-sky-50/95 to-slate-100 text-slate-900 shadow-2xl border-2 border-slate-300 font-sans overflow-hidden">
          <!-- A/C PAYEE ONLY Crossing -->
          <div class="absolute left-4 top-2 rotate-[-25deg] border-y-2 border-slate-800 px-3 py-0.5 text-[10px] font-black tracking-widest text-slate-800">
            A/C PAYEE ONLY
          </div>

          <!-- Status Watermark Stamp -->
          <div class="absolute right-12 top-14 rotate-[-18deg] border-4 ${
            ch.status === 'Realized' ? 'border-emerald-600 text-emerald-600' :
            ch.status === 'Deposited' ? 'border-cyan-600 text-cyan-600' :
            ch.status === 'Bounced' ? 'border-rose-600 text-rose-600' :
            'border-amber-600 text-amber-600'
          } px-4 py-1 text-sm font-black tracking-widest uppercase opacity-40 select-none pointer-events-none">
            ${ch.status}
          </div>

          <!-- Bank Header -->
          <div class="flex justify-between items-start mb-4">
            <div class="pl-14">
              <h2 class="text-base font-black tracking-wider uppercase text-slate-900 flex items-center gap-1.5">
                <i class="fa-solid fa-building-columns text-slate-700"></i> ${dEsc(ch.bank || 'COMMERCIAL BANK')}
              </h2>
              <p class="text-[11px] font-semibold text-slate-600 tracking-wide">${dEsc(ch.branch || 'Kadawatha Branch')} · SRI LANKA</p>
            </div>
            <div class="text-right">
              <span class="text-[9px] uppercase font-bold text-slate-500 block">Date / දිනය</span>
              <div class="inline-flex gap-1 mt-0.5 font-mono font-bold text-xs bg-white border border-slate-400 px-2 py-1 rounded">
                ${cDate.split('-').reverse().join(' / ')}
              </div>
            </div>
          </div>

          <!-- Pay Line -->
          <div class="space-y-3 text-xs mb-4">
            <div class="flex items-center gap-2 border-b border-dotted border-slate-400 pb-1">
              <span class="font-bold text-slate-700 min-w-[70px]">Pay කාටද:</span>
              <span class="font-extrabold text-sm text-slate-900 flex-1 tracking-wide">${dEsc(ch.payee_name || 'Pixel POS Distributor')}</span>
              <span class="text-[10px] text-slate-500 font-semibold">Or Bearer හෝ දරන්නා</span>
            </div>

            <div class="flex items-start gap-2 border-b border-dotted border-slate-400 pb-1">
              <span class="font-bold text-slate-700 min-w-[70px]">Rupees රුපියල්:</span>
              <span class="font-bold text-xs text-slate-800 flex-1 italic leading-snug">${amtWords}</span>
            </div>
          </div>

          <!-- Amount Box & Drawer Signatures -->
          <div class="flex justify-between items-end pt-2">
            <div>
              <div class="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                <i class="fa-solid fa-calendar-check text-sky-700"></i>
                <span>Realization Date (කල්පිරෙන දිනය):</span>
                <span class="font-mono text-slate-900 font-extrabold text-xs ml-1">${rDate}</span>
              </div>
              <div class="text-[9px] text-slate-500 mt-1">
                ${ch.invoice_id ? 'Ref: ' + ch.invoice_id : ''} · ${ch.rep_name ? 'Collected: ' + ch.rep_name : ''}
              </div>
            </div>

            <div class="flex items-center gap-6">
              <!-- Amount in Box -->
              <div class="bg-white border-2 border-slate-800 rounded-lg px-4 py-1.5 shadow-inner">
                <span class="text-xs font-bold text-slate-700 mr-1">Rs.</span>
                <span class="text-lg font-black text-slate-900 font-mono tracking-tight">${Number(ch.amount || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
              </div>

              <!-- Signature Area -->
              <div class="text-center min-w-[130px] border-t border-slate-800 pt-1">
                <p class="text-[10px] font-bold text-slate-800">${dEsc(ch.drawer_name || ch.retailer_name)}</p>
                <span class="text-[8px] uppercase tracking-wider text-slate-500 block">Authorized Signatory</span>
              </div>
            </div>
          </div>

          <!-- Bottom LankaClear MICR Code Bar -->
          <div class="mt-5 pt-3 border-t border-dashed border-slate-400 flex items-center justify-center font-mono text-xs font-bold tracking-[0.25em] text-slate-700 select-all">
            ⑈ ${ch.number ? ch.number.replace(/[^0-9]/g,'').slice(0,6).padStart(6,'0') : '749182'} ⑈ 7010 - 042 ⑈ 08192837401 ⑈ 10
          </div>
        </div>

        <!-- Audit Timeline & Metadata -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs bg-slate-900/40 p-3.5 rounded-xl border border-white/5">
          <div><span class="text-slate-400 block text-[10px]">Record ID:</span><span class="font-mono text-slate-200">${ch.id}</span></div>
          <div><span class="text-slate-400 block text-[10px]">Status:</span><span class="font-bold text-emerald-300">${ch.status}</span></div>
          <div><span class="text-slate-400 block text-[10px]">Date Recorded:</span><span class="font-mono text-slate-300">${ch.created_at || cDate}</span></div>
          <div><span class="text-slate-400 block text-[10px]">Realization Date:</span><span class="font-mono text-amber-300 font-bold">${rDate}</span></div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function distCloseViewChequeModal() {
  const m = document.getElementById('dist-view-cheque-modal');
  if (m) m.remove();
}

function distPrintChequeVoucher() {
  window.print();
}

// ---------- MODAL: DEPOSIT SLIP VOUCHER ----------
function distOpenDepositSlipModal(ids, bankId, slipRef, date) {
  const existing = document.getElementById('dist-deposit-slip-modal');
  if (existing) existing.remove();

  const cheques = (DIST.cheques || []).filter(c => ids.includes(c.id));
  const bank = (DIST.ourBankAccounts || []).find(b => b.id === bankId) || DIST.ourBankAccounts[0];
  const total = cheques.reduce((s, x) => s + Number(x.amount || 0), 0);

  const modal = document.createElement('div');
  modal.id = 'dist-deposit-slip-modal';
  modal.className = 'fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4 backdrop-blur-md';
  modal.innerHTML = `
    <div class="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-teal-500/30" style="animation: popIn 0.3s forwards">
      <div class="px-6 py-4 flex justify-between items-center border-b border-white/10 bg-slate-900/60">
        <div>
          <h3 class="font-bold text-base text-white flex items-center gap-2">
            <i class="fa-solid fa-receipt text-teal-400"></i> Bank Cheque Deposit Slip (බැංකු තැන්පතු පත්‍රිකාව)
          </h3>
          <p class="text-[11px] text-slate-400">LankaClear Compliant Cheque Deposit Summary</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="window.print()" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5">
            <i class="fa-solid fa-print"></i> Print Slip
          </button>
          <button onclick="distCloseDepositSlipModal()" class="text-slate-400 hover:text-white p-1"><i class="fa-solid fa-xmark text-lg"></i></button>
        </div>
      </div>

      <div class="p-6 space-y-4 text-xs">
        <div class="p-5 rounded-2xl bg-white text-slate-900 shadow font-sans space-y-4">
          <div class="flex justify-between items-start border-b border-slate-300 pb-3">
            <div>
              <h3 class="text-base font-black tracking-wider text-slate-950 uppercase">${dEsc(bank?.name || 'COMMERCIAL BANK OF CEYLON')}</h3>
              <p class="text-xs font-bold text-slate-700">Account Name: PIXEL POS DISTRIBUTOR (PVT) LTD</p>
              <p class="text-xs font-mono font-black text-slate-900">A/C No: ${bank?.accNo || '8001 9283 7401'}</p>
            </div>
            <div class="text-right">
              <span class="text-[10px] font-bold text-slate-500 uppercase block">Deposit Slip Ref</span>
              <span class="font-mono font-black text-sm text-slate-900">${dEsc(slipRef)}</span>
              <span class="text-[11px] font-mono block text-slate-600 mt-1">${date}</span>
            </div>
          </div>

          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b-2 border-slate-800 text-[10px] uppercase font-bold text-slate-600">
                <th class="py-1">#</th>
                <th class="py-1">Cheque No</th>
                <th class="py-1">Drawee Bank</th>
                <th class="py-1">Branch</th>
                <th class="py-1">Drawer / Shop</th>
                <th class="py-1 text-right">Amount (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              ${cheques.map((c, i) => `
                <tr class="border-b border-slate-200">
                  <td class="py-1.5 font-mono">${i + 1}</td>
                  <td class="py-1.5 font-mono font-bold">${dEsc(c.number)}</td>
                  <td class="py-1.5">${dEsc(c.bank)}</td>
                  <td class="py-1.5">${dEsc(c.branch || 'Kadawatha')}</td>
                  <td class="py-1.5">${dEsc(c.retailer_name)}</td>
                  <td class="py-1.5 text-right font-mono font-bold">${Number(c.amount || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr class="border-t-2 border-slate-900 font-bold text-sm">
                <td colspan="5" class="py-2 text-right">TOTAL DEPOSIT (මුළු එකතුව):</td>
                <td class="py-2 text-right font-mono font-black text-base text-slate-950">${Number(total).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>

          <div class="flex justify-between items-end pt-6 border-t border-slate-300 text-[10px]">
            <div class="text-slate-600">
              <p>Deposited By: Sunil Perera (Logistics Rep)</p>
              <p>Contact: +94 71 111 2222</p>
            </div>
            <div class="text-center border-t border-slate-800 pt-1 min-w-[140px]">
              <span class="font-bold text-slate-800">Depositor Signature</span>
            </div>
            <div class="text-center border-t border-slate-800 pt-1 min-w-[140px]">
              <span class="font-bold text-slate-800">Bank Receiving Officer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function distCloseDepositSlipModal() {
  const m = document.getElementById('dist-deposit-slip-modal');
  if (m) m.remove();
}

function distDeleteCheque(id) {
  if (!confirm('Are you sure you want to delete this cheque record?')) return;
  DIST.cheques = (DIST.cheques || []).filter(x => x.id !== id);
  distSave();
  toast('Cheque removed from register', 'info');
  distRenderCheques();
}

function distRouteName(id) {
  const r = DIST.routes.find(x=>x.id===id);
  return r ? r.name : (id||'—');
}

// ---------- team & reps management ----------
let distEditingRep = null;

function distRepStats(r) {
  const invs = DIST.invoices.filter(i => i.rep_id === r.id);
  const sales = invs.reduce((s,i) => s + (i.total || 0), 0);
  const collected = invs.reduce((s,i) => s + (i.paid || 0), 0);
  const open = invs.filter(i => i.balance > 0).reduce((s,i) => s + i.balance, 0);
  return { invs: invs.length, sales, collected, open };
}

function distRenderReps(c) {
  c = c || document.getElementById('dist-view');
  const reps = (DIST.reps || []).slice();
  const totalSalary = reps.reduce((s,r) => s + (r.salary||0) + (r.allowance||0), 0);
  const totalLimit = reps.reduce((s,r) => s + (r.creditLimit||0), 0);
  const totalUsed = reps.reduce((s,r) => s + distRepStats(r).open, 0);

  c.innerHTML = `
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <h3 class="text-sm font-bold text-slate-200"><i class="fa-solid fa-user-tie mr-2 text-indigo-400"></i>Sales Reps & Team (${reps.length})</h3>
      <button onclick="distOpenRepModal()" class="px-3 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold flex items-center gap-2"><i class="fa-solid fa-plus"></i> Add Rep</button>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      ${distKpi('Team Size', reps.length, 'fa-users','blue', true)}
      ${distKpi('Monthly Payroll', dMoney(totalSalary), 'fa-money-check-dollar','emerald')}
      ${distKpi('Credit Allocated', dMoney(totalLimit), 'fa-credit-card','indigo')}
      ${distKpi('Credit Used', dMoney(totalUsed), 'fa-file-invoice-dollar','amber')}
    </div>

    <div class="glass-panel rounded-2xl overflow-x-auto">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="text-xs uppercase bg-white/5 text-slate-400 border-b border-white/10">
          <tr>
            <th class="px-3 py-2.5">Rep</th><th class="px-3 py-2.5">Route & Van</th><th class="px-3 py-2.5">Phone</th>
            <th class="px-3 py-2.5 text-right">Salary + Allow.</th><th class="px-3 py-2.5 text-right">Credit Limit</th>
            <th class="px-3 py-2.5 text-right">Open Credit</th><th class="px-3 py-2.5 text-right">Sales / Invs</th>
            <th class="px-3 py-2.5">Attendance / Leave</th><th class="px-3 py-2.5">Status</th><th class="px-3 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${reps.map(r => {
            const st = distRepStats(r);
            const pct = r.creditLimit ? Math.min(100, (st.open / r.creditLimit) * 100) : 0;
            const barCls = pct >= 90 ? 'bg-rose-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500';
            return `
            <tr class="border-b border-white/5 hover:bg-white/5">
              <td class="px-3 py-2 font-semibold text-white text-xs">${dEsc(r.name)}<br><span class="text-[10px] text-slate-500">Joined ${r.joined || '-'}</span></td>
              <td class="px-3 py-2 text-xs text-slate-400">${distRouteName(r.route)}<br><span class="text-[10px]">${r.van||'-'}</span></td>
              <td class="px-3 py-2 text-xs font-mono text-slate-400">${r.phone||'-'}</td>
              <td class="px-3 py-2 text-right text-xs text-emerald-300">${dMoney(r.salary||0)}<br><span class="text-[10px] text-slate-500">+ ${dMoney(r.allowance||0)}</span></td>
              <td class="px-3 py-2 text-right text-xs text-indigo-300 font-bold">${dMoney(r.creditLimit||0)}</td>
              <td class="px-3 py-2 text-right text-xs">
                <p class="text-amber-300 font-bold">${dMoney(st.open)}</p>
                <div class="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden ml-auto mt-1"><div class="h-1.5 rounded-full ${barCls}" style="width:${pct}%"></div></div>
              </td>
              <td class="px-3 py-2 text-right text-xs text-slate-300">${st.invs} invs<br><span class="text-emerald-300 font-bold">${dMoney(st.sales)}</span></td>
              <td class="px-3 py-2 text-xs">
                <span class="${r.attendance==='Present'?'text-emerald-400':'text-rose-400'} font-bold">${r.attendance||'Present'}</span>
                <br><span class="text-[10px] text-slate-500">Leave: ${r.leaveBalance||0}d</span>
              </td>
              <td class="px-3 py-2 text-xs"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${r.status==='Active'?'bg-emerald-500/20 text-emerald-300':'bg-slate-500/20 text-slate-300'}">${r.status||'Active'}</span></td>
              <td class="px-3 py-2 text-right whitespace-nowrap">
                <button onclick="distToggleRepAttendance('${r.id}')" title="Toggle attendance" class="px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded-lg"><i class="fa-solid fa-calendar-check"></i></button>
                <button onclick="distOpenRepModal('${r.id}')" title="Edit" class="px-2 py-1 text-xs text-amber-400 hover:bg-amber-500/10 rounded-lg"><i class="fa-solid fa-pen"></i></button>
                <button onclick="distDeleteRep('${r.id}')" title="Delete" class="px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg"><i class="fa-solid fa-trash"></i></button>
              </td>
            </tr>`;
          }).join('') || `<tr><td colspan="10" class="px-4 py-8 text-center text-slate-500 text-sm">No reps added yet.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function distOpenRepModal(id) {
  distEditingRep = id ? DIST.reps.find(r => r.id === id) : null;
  const r = distEditingRep || {};
  const existing = document.getElementById('dist-rep-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'dist-rep-modal';
  modal.className = 'fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm';
  modal.innerHTML = `
    <div class="glass-panel w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl" style="animation: popIn 0.3s forwards">
      <div class="px-6 py-4 flex justify-between items-center border-b border-white/10 bg-slate-900/50">
        <h3 class="font-bold text-lg text-white"><i class="fa-solid fa-user-tie mr-2 text-indigo-400"></i>${distEditingRep ? 'Edit Rep' : 'Add Sales Rep'}</h3>
        <button onclick="distCloseRepModal()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <form onsubmit="event.preventDefault(); distSubmitRepModal();" class="p-6 space-y-3">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Full Name *</label>
            <input type="text" id="drp-name" required value="${dEsc(r.name || '')}" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Route</label>
            <select id="drp-route" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
              ${DIST.routes.map(rt => `<option value="${rt.id}" ${r.route===rt.id?'selected':''}>${dEsc(rt.name)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Phone</label>
            <input type="text" id="drp-phone" value="${dEsc(r.phone || '')}" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Van / Plate</label>
            <input type="text" id="drp-van" value="${dEsc(r.van || '')}" placeholder="WP CAB-1234" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Monthly Salary (Rs.)</label>
            <input type="number" id="drp-salary" value="${r.salary || 55000}" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Monthly Allowance (Rs.)</label>
            <input type="number" id="drp-allowance" value="${r.allowance || 5000}" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Credit Limit (Rs.)</label>
            <input type="number" id="drp-credit" value="${r.creditLimit || 100000}" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Leave Balance (days)</label>
            <input type="number" id="drp-leave" value="${r.leaveBalance || 12}" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Status</label>
            <select id="drp-status" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
              <option ${r.status==='Active'?'selected':''}>Active</option>
              <option ${r.status==='Inactive'?'selected':''}>Inactive</option>
              <option ${r.status==='On Leave'?'selected':''}>On Leave</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-400 mb-1">Joined Date</label>
            <input type="date" id="drp-joined" value="${r.joined || distNowDate()}" class="w-full bg-slate-900/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none">
          </div>
        </div>
        <div class="flex gap-2 pt-2">
          <button type="submit" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-sm shadow-lg"><i class="fa-solid fa-check mr-1"></i>${distEditingRep ? 'Save Changes' : 'Add Rep'}</button>
          <button type="button" onclick="distCloseRepModal()" class="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-sm border border-white/10">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

function distCloseRepModal() {
  const modal = document.getElementById('dist-rep-modal');
  if (modal) modal.remove();
  distEditingRep = null;
}

function distSubmitRepModal() {
  const get = (id) => (document.getElementById(id)?.value || '').trim();
  const name = get('drp-name');
  if (!name) { toast('Name required','error'); return; }
  const data = {
    name,
    route: get('drp-route') || 'r1',
    phone: get('drp-phone'),
    van: get('drp-van'),
    salary: parseFloat(get('drp-salary')) || 0,
    allowance: parseFloat(get('drp-allowance')) || 0,
    creditLimit: parseFloat(get('drp-credit')) || 0,
    leaveBalance: parseFloat(get('drp-leave')) || 0,
    status: get('drp-status') || 'Active',
    joined: get('drp-joined') || distNowDate(),
  };

  if (distEditingRep) {
    const r = DIST.reps.find(x => x.id === distEditingRep);
    if (r) Object.assign(r, data);
    toast('Rep updated','success');
  } else {
    DIST.reps.push({ id: dUid('rep'), ...data, attendance: 'Present' });
    toast('Rep added','success');
  }
  distSave();
  distCloseRepModal();
  if (DIST.view === 'reps') distRenderReps();
}

function distDeleteRep(id) {
  const r = DIST.reps.find(x => x.id === id);
  if (!r) return;
  if (!confirm(`Delete rep "${r.name}"?`)) return;
  DIST.reps = DIST.reps.filter(x => x.id !== id);
  distSave();
  toast('Rep removed','info');
  if (DIST.view === 'reps') distRenderReps();
}

function distToggleRepAttendance(id) {
  const r = DIST.reps.find(x => x.id === id);
  if (!r) return;
  r.attendance = r.attendance === 'Present' ? 'Leave' : 'Present';
  distSave();
  if (DIST.view === 'reps') distRenderReps();
}

// expose
window.loadDistributionData = loadDistributionData;
window.distView = distView;
window.distRenderInvoices = distRenderInvoices;
window.distInvFilter = distInvFilter;
window.distViewInvoice = distViewInvoice;
window.distRenderLines = distRenderLines;
window.distAddLine = distAddLine;
window.distRemoveLine = distRemoveLine;
window.distCalcTotals = distCalcTotals;
window.distSubmitInvoice = distSubmitInvoice;
window.distOnRetailerChange = distOnRetailerChange;
window.distTogglePayExtra = distTogglePayExtra;
window.distRenderRetailers = distRenderRetailers;
window.distViewRetailer = distViewRetailer;
window.distOpenAddRetailer = distOpenRetailerModal;
window.distOpenCollect = distOpenCollect;
window.distOpenCollectRetailer = distOpenCollectRetailer;
window.distFillCollect = distFillCollect;
window.distSubmitCollection = distSubmitCollection;
window.distRenderCollections = distRenderCollections;
window.distRenderRoutes = distRenderRoutes;
window.distCreateLoad = distCreateLoad;
window.distRenderStock = distRenderStock;
window.distAdjustStock = distAdjustStock;
window.distSetStockTab = distSetStockTab;
window.distSetLorryVan = distSetLorryVan;
window.distOpenTransferModal = distOpenTransferModal;
window.distCloseTransferModal = distCloseTransferModal;
window.distSubmitTransfer = distSubmitTransfer;
window.distRenderCheques = distRenderCheques;
window.distSetChequeTab = distSetChequeTab;
window.distSetChequeFilter = distSetChequeFilter;
window.distOnChequeSearch = distOnChequeSearch;
window.distOpenAddChequeModal = distOpenAddChequeModal;
window.distCloseAddChequeModal = distCloseAddChequeModal;
window.distOnAddChequeRetailerChange = distOnAddChequeRetailerChange;
window.distSubmitAddCheque = distSubmitAddCheque;
window.distDeleteCheque = distDeleteCheque;
window.distOpenDepositModal = distOpenDepositModal;
window.distCloseDepositModal = distCloseDepositModal;
window.distSubmitDepositModal = distSubmitDepositModal;
window.distOpenRealizeModal = distOpenRealizeModal;
window.distCloseRealizeModal = distCloseRealizeModal;
window.distSubmitRealizeModal = distSubmitRealizeModal;
window.distChequeRealize = distChequeRealize;
window.distOpenBounceModal = distOpenBounceModal;
window.distCloseBounceModal = distCloseBounceModal;
window.distSubmitBounceModal = distSubmitBounceModal;
window.distOpenReplaceModal = distOpenReplaceModal;
window.distCloseReplaceModal = distCloseReplaceModal;
window.distSubmitReplaceModal = distSubmitReplaceModal;
window.distOpenViewChequeModal = distOpenViewChequeModal;
window.distCloseViewChequeModal = distCloseViewChequeModal;
window.distPrintChequeVoucher = distPrintChequeVoucher;
window.distOpenDepositSlipModal = distOpenDepositSlipModal;
window.distCloseDepositSlipModal = distCloseDepositSlipModal;
window.distToggleDepositChequeSelect = distToggleDepositChequeSelect;
window.distSelectAllDepositCheques = distSelectAllDepositCheques;
window.distSubmitBatchDeposit = distSubmitBatchDeposit;
window.distToggleCollectMethod = distToggleCollectMethod;
window.distOpenReturn = distOpenReturn;
window.distRenderReports = distRenderReports;
window.distOpenRetailerModal = distOpenRetailerModal;
window.distCloseRetailerModal = distCloseRetailerModal;
window.distSubmitRetailerModal = distSubmitRetailerModal;
window.distOpenRepModal = distOpenRepModal;
window.distCloseRepModal = distCloseRepModal;
window.distSubmitRepModal = distSubmitRepModal;
window.distDeleteRep = distDeleteRep;
window.distToggleRepAttendance = distToggleRepAttendance;
window.distOpenReturnModal = distOpenReturn;
window.distCloseReturnModal = distCloseReturnModal;
window.distRefreshReturnItems = distRefreshReturnItems;
window.distUpdateReturnTotals = distUpdateReturnTotals;
window.distSubmitReturnModal = distSubmitReturnModal;
window.distExportReturns = distExportReturns;
window.distClearDamaged = distClearDamaged;