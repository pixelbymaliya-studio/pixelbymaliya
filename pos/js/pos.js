// =====================================================================
// PIXEL BY MALIYA POS — INDUSTRY-AWARE POS TERMINAL
// =====================================================================
let cart = [];
let currentPaymentMethod = 'CASH';
let availableProducts = [];
let activeCategoryFilter = '';
let currentOrderType = '';
let currentTable = '';

async function initPosTerminal() {
  const biz = getBusiness();
  currentOrderType = (biz && (biz.id === 'restaurant')) ? 'Dine-in' : '';
  currentTable = '';
  await loadPosProducts();
  renderCategoryPills();
  renderOrderTypePills();
  renderPosTablePills();
  renderCart();
}

async function loadPosProducts() {
  const searchVal = document.getElementById('pos-search-input')?.value || '';
  availableProducts = await api.getProducts(activeCategoryFilter, searchVal);
  renderPosProductsGrid(availableProducts);
}

function getBizCategories() {
  const biz = getBusiness();
  return (biz && biz.categories) ? biz.categories : ['All'];
}

function renderCategoryPills() {
  const container = document.getElementById('category-pills');
  if (!container) return;
  container.innerHTML = getBizCategories().map(cat => {
    const catVal = cat === 'All' ? '' : cat;
    const isActive = activeCategoryFilter === catVal;
    return `
      <button onclick="setCategoryFilter('${catVal.replace(/'/g, "\\'")}')" class="px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
        isActive ? 'btn-primary' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
      }">${cat}</button>`;
  }).join('');
}

function setCategoryFilter(cat) {
  activeCategoryFilter = cat;
  renderCategoryPills();
  loadPosProducts();
}

function renderOrderTypePills() {
  const container = document.getElementById('pos-order-type');
  const biz = getBusiness();
  if (!container || !biz) return;
  let types = [];
  if (biz.id === 'restaurant') types = ['Dine-in', 'Takeaway', 'Delivery'];
  else if (biz.id === 'salon') types = ['Walk-in', 'Appointment'];
  if (types.length === 0) { container.innerHTML = ''; return; }
  container.innerHTML = types.map(t => `
    <button onclick="setOrderType('${t}')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
      currentOrderType === t ? 'btn-primary' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
    }">${t}</button>`).join('');
}

function setOrderType(t) {
  currentOrderType = t;
  renderOrderTypePills();
  const wrap = document.getElementById('pos-table-wrap');
  if (wrap) wrap.classList.toggle('hidden', t === 'Takeaway' || t === 'Delivery');
}

function renderPosTablePills() {
  const container = document.getElementById('pos-table-pills');
  const biz = getBusiness();
  if (!container || !biz || !biz.tables) return;
  container.innerHTML = biz.tables.map(tb => {
    const color = tb.status === 'VACANT' ? 'border-emerald-500/40 text-emerald-300'
      : tb.status === 'RESERVED' ? 'border-amber-500/40 text-amber-300'
      : 'border-rose-500/40 text-rose-300';
    const active = currentTable === tb.no;
    return `<button onclick="setTable('${tb.no}')" class="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${color} ${active ? 'btn-primary border-transparent' : 'bg-white/5'}">${tb.no}</button>`;
  }).join('');
}

function setTable(no) {
  currentTable = no;
  renderPosTablePills();
  const custInput = document.getElementById('cart-customer-name');
  const biz = getBusiness();
  if (custInput && !custInput.value) {
    custInput.value = biz && biz.id === 'salon' ? `Client - ${no}` : `Table ${no}`;
  }
}

function renderPosProductsGrid(products) {
  const grid = document.getElementById('pos-products-grid');
  if (!grid) return;
  if (!products || products.length === 0) {
    grid.innerHTML = `<div class="col-span-full text-center py-12 text-slate-500 text-sm">No items found.</div>`;
    return;
  }
  const biz = getBusiness();

  grid.innerHTML = products.map((p, i) => {
    const priceVal = Number(p.price || 0);
    const a = p.attributes || {};
    let metaRight = '';
    if (p.product_type === 'SERVICE') {
      metaRight = `<span class="text-[10px] text-pink-400 font-bold"><i class="fa-solid fa-sparkles mr-1"></i>${a.duration_minutes || 30} min</span>`;
    } else {
      metaRight = `<span class="text-[10px] ${Number(p.stock_quantity) < 10 ? 'text-amber-400 font-bold' : 'text-slate-500'}">Stock: ${p.stock_quantity ?? 0} ${p.unit || 'pcs'}</span>`;
    }

    let subLine = '';
    if (a.expiry_date) {
      const days = Math.ceil((new Date(a.expiry_date) - new Date()) / 86400000);
      subLine = `<p class="text-[10px] mt-0.5 ${days < 30 ? 'text-rose-400 font-bold' : 'text-slate-500'}"><i class="fa-solid fa-calendar-xmark mr-1"></i>Exp: ${a.expiry_date}</p>`;
    } else if (a.imei) {
      subLine = `<p class="text-[10px] text-slate-500 font-mono mt-0.5">IMEI: ${a.imei}</p>`;
    } else if (a.isbn) {
      subLine = `<p class="text-[10px] text-slate-500 font-mono mt-0.5">ISBN: ${a.isbn}</p>`;
    } else if (a.serial) {
      subLine = `<p class="text-[10px] text-slate-500 font-mono mt-0.5">SN: ${a.serial}</p>`;
    } else if (p.barcode) {
      subLine = `<p class="text-[10px] text-slate-500 font-mono mt-0.5"><i class="fa-solid fa-barcode mr-1"></i>${p.barcode}</p>`;
    }

    return `
      <div onclick="addToCart('${p.id}')" class="glass-panel p-4 rounded-2xl cursor-pointer product-card flex flex-col justify-between group" style="animation: fadeUp 0.4s ${Math.min(i * 0.03, 0.4)}s both">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-slate-400 group-hover:bg-primary/20 group-hover:text-primary">${p.category || 'General'}</span>
            ${metaRight}
          </div>
          <div class="flex items-start gap-2">
            <span class="text-2xl leading-none">${p.emoji || '📦'}</span>
            <h4 class="font-bold text-slate-200 text-sm leading-snug group-hover:text-white">${p.name || 'Unnamed Item'}</h4>
          </div>
          ${subLine}
        </div>
        <div class="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
          <span class="font-extrabold text-base text-emerald-400">Rs. ${priceVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <button class="w-7 h-7 rounded-lg btn-primary text-white flex items-center justify-center text-xs shadow"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>`;
  }).join('');
}

function addToCart(productId) {
  const product = availableProducts.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.product_id === productId && !item.notes);
  if (existing) existing.quantity += 1;
  else cart.push({
    product_id: product.id,
    name: product.name || 'Item',
    emoji: product.emoji || '📦',
    unit_price: Number(product.price || 0),
    quantity: 1,
    discount: 0,
    notes: ''
  });
  renderCart();
  toast(`${product.name} added`, 'success');
}

function updateCartQty(index, delta) {
  if (!cart[index]) return;
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  renderCart();
}

function updateItemDiscount(index, value) {
  if (!cart[index]) return;
  const num = Math.min(100, Math.max(0, parseFloat(value) || 0));
  cart[index].discount = num;
  const el = document.getElementById(`cart-item-disc-${index}`);
  if (el) el.value = num || '';
  updateCartTotals();
  updateBulkDiscountStatus();
}

function updateItemNotes(index, notes) {
  if (cart[index]) cart[index].notes = notes;
}

function clearCart() {
  cart = [];
  const discInput = document.getElementById('cart-discount');
  if (discInput) discInput.value = '0.00';
  const bulkInput = document.getElementById('bulk-discount-pct');
  if (bulkInput) bulkInput.value = '';
  renderCart();
}

function clearAllDiscounts() {
  if (!cart || cart.length === 0) return;
  cart.forEach(item => { item.discount = 0; });
  const discInput = document.getElementById('cart-discount');
  if (discInput) discInput.value = '0.00';
  const bulkInput = document.getElementById('bulk-discount-pct');
  if (bulkInput) bulkInput.value = '';
  renderCart();
  if (typeof toast === 'function') toast('All discounts reset', 'info');
}

function applyBulkDiscountToRemaining() {
  if (!cart || cart.length === 0) {
    if (typeof toast === 'function') toast('Cart is empty. Add items first.', 'error');
    return;
  }
  const input = document.getElementById('bulk-discount-pct');
  const pct = Math.min(100, Math.max(0, parseFloat(input?.value) || 0));
  if (pct <= 0) {
    if (typeof toast === 'function') toast('Please enter a valid discount % greater than 0', 'error');
    return;
  }

  let appliedCount = 0;
  let skippedCount = 0;

  cart.forEach(item => {
    const existing = Number(item.discount || 0);
    if (existing > 0) {
      // PRESERVE EXISTING ITEM DISCOUNT — NEVER DOUBLE DISCOUNT!
      skippedCount++;
    } else {
      item.discount = pct;
      appliedCount++;
    }
  });

  if (appliedCount === 0) {
    if (typeof toast === 'function') {
      toast(`All ${skippedCount} item(s) already have individual discounts. Double discount is not allowed!`, 'warning');
    }
    return;
  }

  // If a bill discount was typed, clear it because items now have their own discounts
  const billDiscInput = document.getElementById('cart-discount');
  if (billDiscInput && parseFloat(billDiscInput.value) > 0) {
    billDiscInput.value = '0.00';
  }

  renderCart();
  if (input) input.value = '';

  if (typeof toast === 'function') {
    const skipMsg = skippedCount > 0 ? ` (${skippedCount} item(s) with existing discounts kept unchanged — no double discount)` : '';
    toast(`Applied ${pct}% discount to ${appliedCount} remaining item(s)${skipMsg}.`, 'success');
  }
}

function updateBulkDiscountStatus() {
  const statusEl = document.getElementById('bulk-status-text');
  if (!statusEl) return;
  if (!cart || cart.length === 0) {
    statusEl.innerText = 'Items: 0 total';
    return;
  }
  const discCount = cart.filter(i => Number(i.discount || 0) > 0).length;
  const remCount = cart.length - discCount;
  if (discCount > 0 && remCount > 0) {
    statusEl.innerHTML = `<span class="text-amber-300 font-semibold">${discCount} discounted</span> • <span class="text-emerald-400 font-semibold">${remCount} without discount</span>`;
  } else if (discCount === cart.length) {
    statusEl.innerHTML = `<span class="text-amber-300 font-semibold">All ${cart.length} item(s) have discounts</span>`;
  } else {
    statusEl.innerHTML = `<span>${cart.length} item(s) • None discounted</span>`;
  }
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = `<p class="text-center text-slate-500 text-sm py-8">Cart is empty. Click items to add.</p>`;
    ['cart-subtotal', 'cart-tax', 'cart-total'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = 'Rs. 0.00';
    });
    const hintEl = document.getElementById('cart-discount-hint');
    if (hintEl) hintEl.innerText = '';
    const totDiscWrap = document.getElementById('cart-discount-total-container');
    if (totDiscWrap) totDiscWrap.classList.add('hidden');
    updateChangeDisplay(0);
    updateBulkDiscountStatus();
    return;
  }
  container.innerHTML = cart.map((item, idx) => {
    const uPrice = Number(item.unit_price || 0);
    const qty = Number(item.quantity || 1);
    const discPct = Math.min(100, Math.max(0, Number(item.discount || 0)));
    const gross = uPrice * qty;
    const discAmt = gross * discPct / 100;
    const lineTotal = Math.max(0, gross - discAmt);
    const hasItemDisc = discPct > 0;
    return `
      <div class="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs cart-item-enter">
        <div class="flex items-center justify-between">
          <div class="flex-1 pr-2">
            <h5 class="font-bold text-slate-200">${item.emoji || ''} ${item.name}</h5>
            <span class="text-slate-400 font-mono">Rs. ${uPrice.toFixed(2)} each</span>
          </div>
          <div class="flex items-center space-x-2">
            <button onclick="updateCartQty(${idx}, -1)" class="w-6 h-6 rounded bg-white/10 text-slate-200 hover:bg-white/20 font-bold transition">-</button>
            <span class="font-bold text-slate-200 w-4 text-center">${qty}</span>
            <button onclick="updateCartQty(${idx}, 1)" class="w-6 h-6 rounded bg-white/10 text-slate-200 hover:bg-white/20 font-bold transition">+</button>
            <span class="font-bold text-emerald-400 w-24 text-right">${discAmt > 0 ? `<span class="line-through text-slate-500 font-normal mr-1">${gross.toFixed(2)}</span>` : ''}Rs. ${lineTotal.toFixed(2)}</span>
          </div>
        </div>
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-slate-400"><i class="fa-solid fa-tag mr-0.5"></i>Disc %</span>
            <input type="number" min="0" max="100" step="1" id="cart-item-disc-${idx}" value="${discPct || ''}" placeholder="0" oninput="updateItemDiscount(${idx}, this.value)" class="w-16 px-2 py-1 bg-black/20 border border-white/10 rounded text-[11px] text-amber-300 focus:outline-none focus:border-primary">
            ${discAmt > 0 ? `<span class="text-[10px] text-rose-400 font-bold">- Rs. ${discAmt.toFixed(2)}</span>` : ''}
          </div>
          <div>
            ${hasItemDisc
              ? `<span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold" title="Individual item discount applied"><i class="fa-solid fa-check mr-0.5"></i>Item Disc (${discPct}%)</span>`
              : `<span class="text-[9px] px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-400 border border-white/5" title="No item discount — eligible for bill discount">No Item Disc</span>`
            }
          </div>
        </div>
        <input type="text" onchange="updateItemNotes(${idx}, this.value)" value="${item.notes || ''}" placeholder="Add note / customization..." class="w-full px-2 py-1 bg-black/20 border border-white/10 rounded text-[11px] text-slate-300 focus:outline-none focus:border-primary">
      </div>`;
  }).join('');
  updateCartTotals();
}

function cartLineNet(item) {
  const uPrice = Number(item.unit_price || 0);
  const qty = Number(item.quantity || 1);
  const discPct = Math.min(100, Math.max(0, Number(item.discount || 0)));
  return Math.max(0, uPrice * qty * (1 - discPct / 100));
}

function updateCartTotals() {
  const discType = document.getElementById('cart-discount-type')?.value || 'rs';
  const prefixEl = document.getElementById('cart-discount-prefix');
  if (prefixEl) prefixEl.innerText = discType === 'pct' ? '-' : '- Rs.';

  // Separate items with item-level discount vs items without item discount
  const itemsWithItemDisc = cart.filter(i => Number(i.discount || 0) > 0);
  const itemsWithoutItemDisc = cart.filter(i => Number(i.discount || 0) === 0);

  // Gross total of all items in cart
  const grossTotal = cart.reduce((s, i) => s + (Number(i.unit_price || 0) * Number(i.quantity || 1)), 0);

  // Total amount saved via item-level discounts
  const itemDiscountsTotal = itemsWithItemDisc.reduce((s, i) => {
    const gross = Number(i.unit_price || 0) * Number(i.quantity || 1);
    const pct = Math.min(100, Math.max(0, Number(i.discount || 0)));
    return s + (gross * pct / 100);
  }, 0);

  // Gross value of only undiscounted items (the ONLY items eligible for bill discount!)
  const undiscountedGross = itemsWithoutItemDisc.reduce((s, i) => {
    return s + (Number(i.unit_price || 0) * Number(i.quantity || 1));
  }, 0);

  const rawDiscInput = parseFloat(document.getElementById('cart-discount')?.value || 0) || 0;
  let billDiscountAmount = 0;

  if (rawDiscInput > 0) {
    if (itemsWithoutItemDisc.length === 0) {
      // All items already have item discounts! Double discount strictly blocked!
      billDiscountAmount = 0;
    } else if (discType === 'pct') {
      // Bill % discount applies STRICTLY to undiscounted items!
      const pct = Math.min(100, Math.max(0, rawDiscInput));
      billDiscountAmount = undiscountedGross * (pct / 100);
    } else {
      // Fixed Rs bill discount cannot exceed the undiscounted items gross
      billDiscountAmount = Math.min(rawDiscInput, undiscountedGross);
    }
  }

  // Update helper text explaining single discount policy
  const hintEl = document.getElementById('cart-discount-hint');
  if (hintEl) {
    if (cart.length === 0) {
      hintEl.innerText = '';
    } else if (itemsWithItemDisc.length > 0 && itemsWithoutItemDisc.length === 0) {
      hintEl.innerHTML = `<span class="text-rose-400 font-semibold"><i class="fa-solid fa-ban mr-1"></i>All items have item discounts. Bill discount cannot be applied (No double discount).</span>`;
    } else if (itemsWithItemDisc.length > 0 && itemsWithoutItemDisc.length > 0) {
      hintEl.innerHTML = `<span class="text-amber-300"><i class="fa-solid fa-shield-halved mr-1"></i>Applies only to ${itemsWithoutItemDisc.length} undiscounted item(s). ${itemsWithItemDisc.length} item(s) with discounts are excluded.</span>`;
    } else if (rawDiscInput > 0) {
      hintEl.innerHTML = `<span class="text-slate-400">Applies to all ${cart.length} item(s)</span>`;
    } else {
      hintEl.innerText = '';
    }
  }

  const totalDiscount = itemDiscountsTotal + billDiscountAmount;
  const netSubtotal = Math.max(0, grossTotal - totalDiscount);
  const tax = netSubtotal * 0.08;
  const total = Math.max(0, netSubtotal + tax);

  const subEl = document.getElementById('cart-subtotal');
  if (subEl) subEl.innerText = `Rs. ${grossTotal.toFixed(2)}`;

  const totDiscWrap = document.getElementById('cart-discount-total-container');
  const totDiscEl = document.getElementById('cart-discount-total-row');
  if (totDiscWrap && totDiscEl) {
    if (totalDiscount > 0 && (itemsWithItemDisc.length > 0 && billDiscountAmount > 0)) {
      totDiscWrap.classList.remove('hidden');
      totDiscEl.innerText = `- Rs. ${totalDiscount.toFixed(2)}`;
    } else {
      totDiscWrap.classList.add('hidden');
    }
  }

  const taxEl = document.getElementById('cart-tax');
  if (taxEl) taxEl.innerText = `Rs. ${tax.toFixed(2)}`;
  const totEl = document.getElementById('cart-total');
  if (totEl) totEl.innerText = `Rs. ${total.toFixed(2)}`;
  updateChangeDisplay(total);
  updateBulkDiscountStatus();
}

function updateChangeDisplay(total) {
  const el = document.getElementById('cart-change');
  if (!el) return;
  const received = parseFloat(document.getElementById('cart-cash-received')?.value || 0) || 0;
  if (!received) {
    el.value = 'Rs. 0.00';
    el.className = 'w-full mt-1 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-300';
    return;
  }
  const change = received - Number(total || 0);
  if (change >= 0) {
    el.value = 'Rs. ' + change.toFixed(2);
    el.className = 'w-full mt-1 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-300';
  } else {
    el.value = 'Short Rs. ' + Math.abs(change).toFixed(2);
    el.className = 'w-full mt-1 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-bold text-rose-300';
  }
}

function setPaymentMethod(method) {
  currentPaymentMethod = method;
  ['CASH', 'CARD', 'UPI', 'CREDIT'].forEach(m => {
    const btn = document.getElementById(`pay-${m}`);
    if (!btn) return;
    if (m === method) btn.className = 'py-2 rounded-xl text-xs font-bold btn-primary';
    else btn.className = 'py-2 rounded-xl text-xs font-bold bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10';
  });
}

function filterPosProducts() { loadPosProducts(); }

function simulateBarcodeScan() {
  const product = availableProducts.find(p => p.barcode);
  if (product) {
    const input = document.getElementById('pos-search-input');
    if (input) input.value = product.barcode;
    addToCart(product.id);
  }
}

async function processCheckout() {
  if (cart.length === 0) { toast('Add items to cart first', 'error'); return; }
  const customerName = document.getElementById('cart-customer-name')?.value || 'Walk-in Customer';
  const customerPhone = document.getElementById('cart-customer-phone')?.value || '';
  const discType = document.getElementById('cart-discount-type')?.value || 'rs';
  const rawDiscInput = parseFloat(document.getElementById('cart-discount')?.value || 0) || 0;
  const cashReceived = parseFloat(document.getElementById('cart-cash-received')?.value || 0) || 0;

  // Separate items with item-level discount vs items without item discount
  const itemsWithItemDisc = cart.filter(i => Number(i.discount || 0) > 0);
  const itemsWithoutItemDisc = cart.filter(i => Number(i.discount || 0) === 0);

  const grossTotal = cart.reduce((s, i) => s + (Number(i.unit_price || 0) * Number(i.quantity || 1)), 0);

  const itemDiscountsTotal = itemsWithItemDisc.reduce((s, i) => {
    return s + (Number(i.unit_price || 0) * Number(i.quantity || 1) * Number(i.discount || 0) / 100);
  }, 0);

  const undiscountedGross = itemsWithoutItemDisc.reduce((s, i) => {
    return s + (Number(i.unit_price || 0) * Number(i.quantity || 1));
  }, 0);

  let billDiscountAmount = 0;
  if (rawDiscInput > 0 && itemsWithoutItemDisc.length > 0) {
    if (discType === 'pct') {
      billDiscountAmount = undiscountedGross * (Math.min(100, rawDiscInput) / 100);
    } else {
      billDiscountAmount = Math.min(rawDiscInput, undiscountedGross);
    }
  }

  const totalDiscount = itemDiscountsTotal + billDiscountAmount;
  const netSubtotal = Math.max(0, grossTotal - totalDiscount);
  const tax = Number((netSubtotal * 0.08).toFixed(2));
  const finalTotal = Number((netSubtotal + tax).toFixed(2));

  // Process items: assign single discount per item (ITEM, BILL or NONE)
  const processedItems = cart.map(i => {
    const qty = Number(i.quantity || 1);
    const gross = Number(i.unit_price || 0) * qty;
    const itemDiscPct = Number(i.discount || 0);

    if (itemDiscPct > 0) {
      // Individual item discount
      const discAmt = gross * itemDiscPct / 100;
      return Object.assign({}, i, {
        quantity: qty,
        discount: itemDiscPct,
        discount_amount: Number(discAmt.toFixed(2)),
        discount_type: 'ITEM',
        total: Number((gross - discAmt).toFixed(2))
      });
    } else if (billDiscountAmount > 0 && undiscountedGross > 0) {
      // Share of bill discount (only for items without item discount)
      const shareOfBillDisc = (gross / undiscountedGross) * billDiscountAmount;
      const effectivePct = gross > 0 ? (shareOfBillDisc / gross) * 100 : 0;
      return Object.assign({}, i, {
        quantity: qty,
        discount: Number(effectivePct.toFixed(1)),
        discount_amount: Number(shareOfBillDisc.toFixed(2)),
        discount_type: 'BILL',
        total: Number((gross - shareOfBillDisc).toFixed(2))
      });
    } else {
      return Object.assign({}, i, {
        quantity: qty,
        discount: 0,
        discount_amount: 0,
        discount_type: 'NONE',
        total: Number(gross.toFixed(2))
      });
    }
  });

  const orderPayload = {
    items: processedItems,
    payment_method: currentPaymentMethod,
    customer_name: customerName,
    customer_phone: customerPhone,
    subtotal: Number(grossTotal.toFixed(2)),
    net_subtotal: Number(netSubtotal.toFixed(2)),
    item_discount_amount: Number(itemDiscountsTotal.toFixed(2)),
    bill_discount_amount: Number(billDiscountAmount.toFixed(2)),
    discount_amount: Number(totalDiscount.toFixed(2)),
    discount: Number(totalDiscount.toFixed(2)),
    tax_amount: tax,
    tax: tax,
    total_amount: finalTotal,
    total: finalTotal,
    order_type: currentOrderType,
    table_number: currentTable,
    amount_tendered: currentPaymentMethod === 'CASH' ? cashReceived : 0
  };

  try {
    const completedOrder = await api.createOrder(orderPayload);
    completedOrder.customer_phone = customerPhone;
    if (currentPaymentMethod === 'CREDIT' && typeof api.addCredit === 'function') {
      await api.addCredit({
        customer: customerName, phone: customerPhone, invoice: completedOrder.id,
        total: completedOrder.total_amount, paid: 0, note: 'POS credit sale'
      });
      toast('Credit bill recorded for ' + customerName, 'info');
    }
    cart = [];
    const custInput = document.getElementById('cart-customer-name');
    if (custInput) custInput.value = '';
    const phoneInput = document.getElementById('cart-customer-phone');
    if (phoneInput) phoneInput.value = '';
    const discInput = document.getElementById('cart-discount');
    if (discInput) discInput.value = '0.00';
    const bulkInput = document.getElementById('bulk-discount-pct');
    if (bulkInput) bulkInput.value = '';
    const cashInput = document.getElementById('cart-cash-received');
    if (cashInput) cashInput.value = '';
    currentTable = '';
    renderCart();
    renderPosTablePills();
    await loadPosProducts();
    if (typeof sendBillSms === 'function') sendBillSms(completedOrder);
    showReceiptModal(completedOrder);
    toast('Sale completed', 'success');
  } catch (err) {
    toast('Failed to complete sale', 'error');
  }
}

function showReceiptModal(order) {
  if (!order) return;
  const biz = getBusiness();
  const orderNum = order.order_number || order.id || '2001';
  const custName = order.customer_name || 'Walk-in Customer';
  const orderDate = order.created_at ? new Date(order.created_at).toLocaleString() : new Date().toLocaleString();

  const storeName = document.getElementById('rec-store-name');
  if (storeName) storeName.innerText = 'Pixel POS';
  const storeType = document.getElementById('rec-store-type');
  if (storeType) storeType.innerText = (biz ? biz.name : 'Point of Sale') + ' Receipt';

  document.getElementById('rec-order-id').innerText = `#${orderNum}`;
  document.getElementById('rec-customer').innerText = custName;
  document.getElementById('rec-date').innerText = orderDate;

  const itemsArr = order.items || [];
  document.getElementById('rec-items-body').innerHTML = itemsArr.map(i => {
    const qty = Number(i.quantity || 1);
    const uPrice = Number(i.unit_price || i.price || 0);
    const itemTotal = Number(i.total || (uPrice * qty));
    const discPct = Number(i.discount || 0);
    const discLabel = i.discount_type === 'BILL' ? ' [Bill Disc]' : (discPct > 0 ? ' [Item Disc]' : '');
    const discNote = discPct > 0 ? `<div class="text-[9px] text-slate-500">Disc ${discPct}%${discLabel}${i.discount_amount ? ' (- Rs. ' + Number(i.discount_amount).toFixed(2) + ')' : ''}</div>` : '';
    return `<tr><td class="py-1">${qty}x ${i.name || 'Item'}${discNote}</td><td class="text-right py-1 font-mono align-top">Rs. ${itemTotal.toFixed(2)}</td></tr>`;
  }).join('');

  const subtotal = Number(order.subtotal ?? order.subtotal_amount ?? 0);
  const tax = Number(order.tax ?? order.tax_amount ?? 0);
  const discount = Number(order.discount ?? order.discount_amount ?? 0);
  const total = Number(order.total ?? order.total_amount ?? 0);
  document.getElementById('rec-subtotal').innerText = `Rs. ${subtotal.toFixed(2)}`;
  document.getElementById('rec-tax').innerText = `Rs. ${tax.toFixed(2)}`;
  document.getElementById('rec-discount').innerText = `- Rs. ${discount.toFixed(2)}`;
  document.getElementById('rec-total').innerText = `Rs. ${total.toFixed(2)}`;
  document.getElementById('rec-payment').innerText = order.payment_method || 'CASH';
  const tendered = Number(order.amount_tendered ?? 0);
  const change = Number(order.change_amount ?? Math.max(0, tendered - total));
  const tenderedRow = document.getElementById('rec-tendered-row');
  const changeRow = document.getElementById('rec-change-row');
  const showCash = tendered > 0;
  if (tenderedRow) tenderedRow.style.display = showCash ? '' : 'none';
  if (changeRow) changeRow.style.display = showCash ? '' : 'none';
  const tenderedEl = document.getElementById('rec-tendered');
  if (tenderedEl) tenderedEl.innerText = `Rs. ${tendered.toFixed(2)}`;
  const changeEl = document.getElementById('rec-change');
  if (changeEl) changeEl.innerText = `Rs. ${Math.max(0, change).toFixed(2)}`;
  document.getElementById('receipt-modal').classList.remove('hidden');
}

function showReceiptModalDirect(order) { showReceiptModal(order); }
function closeReceiptModal() { document.getElementById('receipt-modal').classList.add('hidden'); }
