// =====================================================================
// PIXEL BY MALIYA POS — DEMO DATA LAYER
// Business-aware, persisted in the browser so the demo feels real.
// =====================================================================

const DEMO_MODE = true; // demo account: no cloud DB required

function _storeKey(bizId) {
  return `pixel_store_${bizId || 'default'}`;
}

function _seedModules(biz) {
  const seed = {};
  const src = (biz && biz.moduleData) || {};
  Object.keys(src).forEach(k => { seed[k] = JSON.parse(JSON.stringify(src[k])); });
  return seed;
}

function _seedStore() {
  const biz = getBusiness();
  const catalog = buildCatalog(biz);
  return {
    catalog,
    orders: buildOrders(biz, catalog),
    expenses: buildExpenses(biz),
    hr: buildHR(biz),
    doctors: buildDoctors(biz),
    appointments: buildAppointments(biz),
    modules: _seedModules(biz),
    ingredients: (typeof buildIngredients === 'function') ? buildIngredients(biz) : [],
    recipes: (biz && biz.recipes) ? JSON.parse(JSON.stringify(biz.recipes)) : {},
    credit: (typeof buildCredit === 'function') ? buildCredit(biz) : [],
    courierSettings: (typeof COURIERS !== 'undefined') ? Object.fromEntries(COURIERS.map(c => [c.id, !!c.connected])) : {},
    sms: [],
    smsSettings: { enabled: true, provider: 'Dialog eSMS', senderId: biz ? biz.short.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8) : 'MALIYA', mobile: '', credits: 1250 }
  };
}

function loadStore() {
  const key = _storeKey(getBusinessId());
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.catalog) {
        // migrate older stores that predate newer modules
        if (!Array.isArray(parsed.doctors)) parsed.doctors = buildDoctors(getBusiness());
        if (!Array.isArray(parsed.appointments)) parsed.appointments = buildAppointments(getBusiness());
        if (!parsed.modules) parsed.modules = _seedModules(getBusiness());
        if (!Array.isArray(parsed.ingredients)) parsed.ingredients = (typeof buildIngredients === 'function') ? buildIngredients(getBusiness()) : [];
        if (!parsed.recipes) parsed.recipes = (getBusiness() && getBusiness().recipes) ? JSON.parse(JSON.stringify(getBusiness().recipes)) : {};
        if (!Array.isArray(parsed.credit)) parsed.credit = (typeof buildCredit === 'function') ? buildCredit(getBusiness()) : [];
        if (!parsed.courierSettings) parsed.courierSettings = (typeof COURIERS !== 'undefined') ? Object.fromEntries(COURIERS.map(c => [c.id, !!c.connected])) : {};
        if (!Array.isArray(parsed.sms)) parsed.sms = [];
        if (!parsed.smsSettings) {
          const b = getBusiness();
          parsed.smsSettings = { enabled: true, provider: 'Dialog eSMS', senderId: b ? b.short.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8) : 'MALIYA', mobile: '', credits: 1250 };
        }
        return parsed;
      }
    } catch (e) { /* fall through to reseed */ }
  }
  const seeded = _seedStore();
  localStorage.setItem(key, JSON.stringify(seeded));
  return seeded;
}

function saveStore(store) {
  localStorage.setItem(_storeKey(getBusinessId()), JSON.stringify(store));
}

function resetDemoData() {
  const biz = getBusiness();
  if (biz) localStorage.removeItem(_storeKey(biz.id));
  localStorage.removeItem('pixel_distribution_v1');
  loadStore();
}

function _num(v) { return Number(v || 0); }

const api = {
  // ---------------- Dashboard ----------------
  async getDashboardStats() {
    const store = loadStore();
    const orders = store.orders || [];
    const expenses = store.expenses || [];
    const catalog = store.catalog || [];

    const totalIncome = orders.reduce((s, o) => s + _num(o.total ?? o.total_amount), 0);
    const totalExpenses = expenses.reduce((s, e) => s + _num(e.amount), 0);
    const netProfit = totalIncome - totalExpenses;

    const categoryBreakdown = {};
    orders.forEach(ord => {
      (ord.items || []).forEach(it => {
        const prd = catalog.find(p => p.id === it.product_id);
        const cat = prd ? prd.category : 'General';
        categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + _num(it.total || (it.unit_price * it.quantity));
      });
    });

    // Payment mix
    const paymentBreakdown = {};
    orders.forEach(o => {
      const m = o.payment_method || 'CASH';
      paymentBreakdown[m] = (paymentBreakdown[m] || 0) + _num(o.total ?? o.total_amount);
    });

    return {
      totalIncome: Number(totalIncome.toFixed(2)),
      totalExpenses: Number(totalExpenses.toFixed(2)),
      netProfit: Number(netProfit.toFixed(2)),
      totalOrdersCount: orders.length,
      categoryBreakdown,
      paymentBreakdown,
      recentTransactions: [...orders].reverse().slice(0, 7),
      expenseBreakdown: expenses
    };
  },

  // ---------------- Products ----------------
  async getProducts(category = '', search = '') {
    const store = loadStore();
    let list = [...(store.catalog || [])];
    if (category) list = list.filter(p => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.barcode || '').includes(q) ||
        (p.attributes && (p.attributes.isbn || '').toLowerCase().includes(q)) ||
        (p.attributes && (p.attributes.imei || '').includes(q)) ||
        (p.attributes && (p.attributes.serial || '').toLowerCase().includes(q))
      );
    }
    return list;
  },

  async addProduct(productData) {
    const store = loadStore();
    const biz = getBusiness();
    const newProduct = Object.assign({
      id: `${biz ? biz.id : 'x'}-p${Date.now()}`,
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: String(Math.floor(1000000 + Math.random() * 9000000)),
      category: 'General',
      product_type: 'PHYSICAL',
      emoji: '📦',
      price: 0,
      cost: 0,
      stock_quantity: 0,
      unit: 'pcs',
      attributes: {}
    }, productData);
    newProduct.price = _num(newProduct.price);
    newProduct.cost = _num(newProduct.cost);
    newProduct.stock_quantity = _num(newProduct.stock_quantity);
    store.catalog.unshift(newProduct);
    saveStore(store);
    return newProduct;
  },

  async updateProduct(id, patch) {
    const store = loadStore();
    const prd = (store.catalog || []).find(p => p.id === id);
    if (prd) {
      Object.assign(prd, patch);
      if ('price' in patch) prd.price = _num(prd.price);
      if ('cost' in patch) prd.cost = _num(prd.cost);
      if ('stock_quantity' in patch) prd.stock_quantity = _num(prd.stock_quantity);
      saveStore(store);
    }
    return prd;
  },

  async deleteProduct(id) {
    const store = loadStore();
    store.catalog = store.catalog.filter(p => p.id !== id);
    saveStore(store);
    return { ok: true };
  },

  // ---------------- Expenses ----------------
  async getExpenses() {
    return loadStore().expenses || [];
  },

  async addExpense(expenseData) {
    const store = loadStore();
    const newExpense = {
      id: `exp-${Date.now()}`,
      title: expenseData.title || 'Expense',
      category: expenseData.category || 'General',
      amount: _num(expenseData.amount),
      expense_date: expenseData.date || new Date().toISOString().split('T')[0],
      notes: expenseData.notes || ''
    };
    store.expenses.unshift(newExpense);
    saveStore(store);
    return newExpense;
  },

  // ---------------- Orders ----------------
  async getOrders() {
    return loadStore().orders || [];
  },

  async createOrder(orderData) {
    const store = loadStore();
    const items = (orderData.items || []).map(i => {
      const qty = _num(i.quantity) || 1;
      const gross = _num(i.unit_price) * qty;
      const discPct = Math.min(100, Math.max(0, _num(i.discount)));
      const discAmt = i.discount_amount != null ? Math.max(0, _num(i.discount_amount)) : gross * discPct / 100;
      const net = Math.max(0, gross - discAmt);
      return Object.assign({}, i, {
        quantity: qty,
        discount: discPct,
        discount_amount: Number(discAmt.toFixed(2)),
        total: Number(net.toFixed(2))
      });
    });
    const subtotal = items.reduce((s, i) => s + _num(i.total), 0);
    const tax = subtotal * 0.08;
    const discount = _num(orderData.discount_amount);
    const total = subtotal + tax - discount;
    const tendered = _num(orderData.amount_tendered);
    const change = tendered > 0 ? Math.max(0, Number((tendered - total).toFixed(2))) : 0;
    const nextNum = 2000 + (store.orders ? store.orders.length : 0) + 1;

    const newOrder = {
      id: `INV-${nextNum}`,
      order_number: nextNum,
      customer_name: orderData.customer_name || 'Walk-in Customer',
      table_number: orderData.table_number || '',
      order_type: orderData.order_type || '',
      notes: orderData.notes || '',
      items,
      subtotal: Number(subtotal.toFixed(2)),
      tax_amount: Number(tax.toFixed(2)),
      discount_amount: Number(discount.toFixed(2)),
      total_amount: Number(total.toFixed(2)),
      total: Number(total.toFixed(2)),
      amount_tendered: Number(tendered.toFixed(2)),
      change_amount: Number(change.toFixed(2)),
      payment_method: orderData.payment_method || 'CASH',
      status: 'COMPLETED',
      created_at: new Date().toISOString()
    };

    // decrement stock for physical items
    items.forEach(ci => {
      const prd = store.catalog.find(p => p.id === ci.product_id);
      if (prd && prd.product_type === 'PHYSICAL') {
        prd.stock_quantity = Math.max(0, _num(prd.stock_quantity) - _num(ci.quantity));
      }
    });

    // deduct recipe ingredients for made-to-order dishes
    if (store.recipes && Array.isArray(store.ingredients)) {
      items.forEach(ci => {
        const recipe = store.recipes[ci.product_id];
        if (!recipe) return;
        recipe.forEach(([ingId, qty]) => {
          const ing = store.ingredients.find(g => g.id === ingId);
          if (!ing) return;
          const use = _num(qty) * _num(ci.quantity || 1);
          ing.stock = Number(Math.max(0, _num(ing.stock) - use).toFixed(3));
        });
      });
    }

    store.orders.push(newOrder);
    saveStore(store);
    return newOrder;
  },

  // ---------------- Ingredients & Recipes ----------------
  async getIngredients() {
    return loadStore().ingredients || [];
  },

  async addIngredient(data) {
    const store = loadStore();
    if (!Array.isArray(store.ingredients)) store.ingredients = [];
    const ing = {
      id: `ing-${Date.now()}`,
      name: data.name || 'New Ingredient',
      emoji: data.emoji || '\u{1F4E6}',
      unit: data.unit || 'kg',
      stock: _num(data.stock),
      cost: _num(data.cost),
      reorder: _num(data.reorder)
    };
    store.ingredients.push(ing);
    saveStore(store);
    return ing;
  },

  async updateIngredient(id, patch) {
    const store = loadStore();
    const ing = (store.ingredients || []).find(g => g.id === id);
    if (ing) { Object.assign(ing, patch); saveStore(store); }
    return ing;
  },

  async deleteIngredient(id) {
    const store = loadStore();
    store.ingredients = (store.ingredients || []).filter(g => g.id !== id);
    Object.keys(store.recipes || {}).forEach(pid => {
      store.recipes[pid] = store.recipes[pid].filter(l => l[0] !== id);
    });
    saveStore(store);
  },

  async getRecipes() {
    return loadStore().recipes || {};
  },

  async getRecipe(productId) {
    const store = loadStore();
    const lines = (store.recipes && store.recipes[productId]) || [];
    const ings = store.ingredients || [];
    return lines.map(([ingId, qty]) => {
      const ing = ings.find(g => g.id === ingId);
      return { ingredientId: ingId, name: ing ? ing.name : 'Unknown', emoji: ing ? ing.emoji : '\u2753', unit: ing ? ing.unit : '', qty };
    });
  },

  async saveRecipe(productId, lines) {
    const store = loadStore();
    if (!store.recipes) store.recipes = {};
    const clean = (lines || []).filter(l => l.ingredientId && _num(l.qty) > 0)
      .map(l => [l.ingredientId, _num(l.qty)]);
    if (clean.length === 0) delete store.recipes[productId];
    else store.recipes[productId] = clean;
    saveStore(store);
    return store.recipes[productId] || [];
  },

  // ---------------- HR ----------------
  async getHR() {
    return loadStore().hr || [];
  },

  async addEmployee(emp) {
    const store = loadStore();
    const newEmp = {
      id: `emp-${Date.now()}`,
      name: emp.name || 'New Staff',
      role: emp.role || 'Staff',
      phone: emp.phone || '',
      salary: _num(emp.salary),
      status: 'Active',
      joined: new Date().toISOString().split('T')[0],
      attendance: 'Present'
    };
    store.hr.unshift(newEmp);
    saveStore(store);
    return newEmp;
  },

  async updateEmployee(id, patch) {
    const store = loadStore();
    const emp = store.hr.find(e => e.id === id);
    if (emp) Object.assign(emp, patch);
    saveStore(store);
    return emp;
  },

  async deleteEmployee(id) {
    const store = loadStore();
    store.hr = store.hr.filter(e => e.id !== id);
    saveStore(store);
    return { ok: true };
  },

  // ---------------- Clinic (doctors & appointments) ----------------
  async getDoctors() {
    return loadStore().doctors || [];
  },

  async addDoctor(doc) {
    const store = loadStore();
    if (!Array.isArray(store.doctors)) store.doctors = [];
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: doc.name || 'New Doctor',
      specialization: doc.specialization || 'General Physician',
      qualifications: doc.qualifications || '',
      phone: doc.phone || '',
      fee: _num(doc.fee),
      room: doc.room || '',
      days: Array.isArray(doc.days) ? doc.days : [],
      hours: doc.hours || '',
      status: 'Active',
      patientsToday: 0
    };
    store.doctors.unshift(newDoc);
    saveStore(store);
    return newDoc;
  },

  async updateDoctor(id, patch) {
    const store = loadStore();
    const doc = (store.doctors || []).find(d => d.id === id);
    if (doc) Object.assign(doc, patch);
    saveStore(store);
    return doc;
  },

  async deleteDoctor(id) {
    const store = loadStore();
    store.doctors = (store.doctors || []).filter(d => d.id !== id);
    saveStore(store);
    return { ok: true };
  },

  async getAppointments() {
    return loadStore().appointments || [];
  },

  async addAppointment(apt) {
    const store = loadStore();
    if (!Array.isArray(store.appointments)) store.appointments = [];
    const doc = (store.doctors || []).find(d => d.id === apt.doctorId);
    const newApt = {
      id: `apt-${Date.now()}`,
      patient: apt.patient || 'Walk-in Patient',
      doctorId: apt.doctorId || '',
      doctorName: doc ? doc.name : 'Unassigned',
      time: apt.time || '',
      status: 'Scheduled',
      date: apt.date || new Date().toISOString().split('T')[0],
      symptoms: apt.symptoms || ''
    };
    store.appointments.unshift(newApt);
    saveStore(store);
    return newApt;
  },

  async updateAppointment(id, patch) {
    const store = loadStore();
    const apt = (store.appointments || []).find(a => a.id === id);
    if (apt) Object.assign(apt, patch);
    saveStore(store);
    return apt;
  },

  async deleteAppointment(id) {
    const store = loadStore();
    store.appointments = (store.appointments || []).filter(a => a.id !== id);
    saveStore(store);
    return { ok: true };
  },

  // ---------------- Signature industry modules (kitchen, purchase, ...) ----------------
  async getModule(name) {
    const store = loadStore();
    store.modules = store.modules || {};
    if (!Array.isArray(store.modules[name])) store.modules[name] = [];
    return [...store.modules[name]];
  },

  async addModuleItem(name, item) {
    const store = loadStore();
    store.modules = store.modules || {};
    if (!Array.isArray(store.modules[name])) store.modules[name] = [];
    const rec = Object.assign({ id: `${name}-${Date.now()}` }, item);
    store.modules[name].unshift(rec);
    saveStore(store);
    return rec;
  },

  async updateModuleItem(name, id, patch) {
    const store = loadStore();
    const list = (store.modules && store.modules[name]) || [];
    const rec = list.find(r => r.id === id);
    if (rec) Object.assign(rec, patch);
    saveStore(store);
    return rec;
  },

  async deleteModuleItem(name, id) {
    const store = loadStore();
    if (store.modules && store.modules[name]) {
      store.modules[name] = store.modules[name].filter(r => r.id !== id);
    }
    saveStore(store);
    return { ok: true };
  },

  // ---------------- SMS centre ----------------
  async getSms() {
    const store = loadStore();
    return [...(store.sms || [])];
  },

  async getSmsSettings() {
    return loadStore().smsSettings || {};
  },

  async saveSmsSettings(patch) {
    const store = loadStore();
    store.smsSettings = Object.assign({}, store.smsSettings || {}, patch);
    saveStore(store);
    return store.smsSettings;
  },

  async sendSms({ to, message, type = 'Manual', customer = '' }) {
    const store = loadStore();
    if (!Array.isArray(store.sms)) store.sms = [];
    const settings = store.smsSettings || {};
    const enabled = settings.enabled !== false;
    const credit = _num(settings.credits);
    let status = 'Sent';
    if (!enabled) status = 'Blocked';
    else if (!to) status = 'Skipped';
    else if (credit <= 0) status = 'Failed';
    const rec = {
      id: `sms-${Date.now()}`,
      to: to || '—',
      customer: customer || '',
      message: message || '',
      type,
      status,
      provider: settings.provider || 'Dialog eSMS',
      senderId: settings.senderId || 'MALIYA',
      cost: status === 'Sent' ? 1 : 0,
      created_at: new Date().toISOString()
    };
    store.sms.unshift(rec);
    if (status === 'Sent') store.smsSettings.credits = Math.max(0, credit - 1);
    saveStore(store);
    return rec;
  },

  async deleteSms(id) {
    const store = loadStore();
    store.sms = (store.sms || []).filter(s => s.id !== id);
    saveStore(store);
    return { ok: true };
  },

  // ---------------- Credit & Dues ----------------
  async getCredit() {
    const store = loadStore();
    return [...(store.credit || [])];
  },

  async addCredit(data) {
    const store = loadStore();
    if (!Array.isArray(store.credit)) store.credit = [];
    const today = new Date().toISOString().split('T')[0];
    const terms = _num(data.terms) || 30;
    const total = _num(data.total);
    const paid = Math.min(_num(data.paid), total);
    const rec = {
      id: `cred-${Date.now()}`,
      customer: data.customer || 'Walk-in Customer',
      phone: data.phone || '',
      invoice: data.invoice || `INV-${Date.now().toString().slice(-6)}`,
      total,
      paid,
      issued: data.issued || today,
      due: data.due || new Date(Date.now() + terms * 86400000).toISOString().split('T')[0],
      note: data.note || ''
    };
    store.credit.unshift(rec);
    saveStore(store);
    return rec;
  },

  async recordCreditPayment(id, amount) {
    const store = loadStore();
    const rec = (store.credit || []).find(c => c.id === id);
    if (rec) {
      rec.paid = Math.min(_num(rec.paid) + _num(amount), _num(rec.total));
      saveStore(store);
    }
    return rec;
  },

  async deleteCredit(id) {
    const store = loadStore();
    store.credit = (store.credit || []).filter(c => c.id !== id);
    saveStore(store);
    return { ok: true };
  },

  // ---------------- Courier services ----------------
  async getCourierSettings() {
    return loadStore().courierSettings || {};
  },

  async toggleCourier(id) {
    const store = loadStore();
    if (!store.courierSettings) store.courierSettings = {};
    store.courierSettings[id] = !store.courierSettings[id];
    saveStore(store);
    return store.courierSettings;
  }
};
