// =====================================================================
// PIXEL BY MALIYA POS — INVENTORY / CATALOG
// =====================================================================
async function loadInventoryData() {
  const products = await api.getProducts();
  renderInventoryTable(products);
}

function getExtraColumnConfig() {
  const biz = getBusiness();
  if (!biz) return { show: false, label: 'Extra' };
  if (biz.expiryTracking) return { show: true, label: 'Expiry / Batch' };
  if (biz.serialTracking === 'imei') return { show: true, label: 'IMEI / Warranty' };
  if (biz.serialTracking === 'serial') return { show: true, label: 'Serial / Warranty' };
  if (biz.id === 'bookshop') return { show: true, label: 'ISBN / Author' };
  if (biz.id === 'fashion') return { show: true, label: 'Sizes / Colors' };
  return { show: false, label: 'Extra' };
}

function renderInventoryTable(products) {
  const tbody = document.getElementById('inventory-table-body');
  if (!tbody) return;
  const cfg = getExtraColumnConfig();
  const thExtra = document.getElementById('th-extra');
  if (thExtra) {
    thExtra.classList.toggle('hidden', !cfg.show);
    thExtra.innerText = cfg.label;
  }
  if (!products || products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" class="text-center py-4 text-slate-500">No catalog items found.</td></tr>`;
    return;
  }
  const biz = getBusiness();

  tbody.innerHTML = products.map((p, i) => {
    const priceVal = Number(p.price || 0);
    const costVal = Number(p.cost || 0);
    const profit = priceVal - costVal;
    const margin = priceVal > 0 ? (profit / priceVal) * 100 : 0;
    const isPhysical = p.product_type !== 'SERVICE';
    const stockQty = Number(p.stock_quantity || 0);
    const stockValue = isPhysical ? costVal * stockQty : 0;
    const a = p.attributes || {};
    let extra = '—';
    if (biz && biz.expiryTracking && a.expiry_date) {
      const days = Math.ceil((new Date(a.expiry_date) - new Date()) / 86400000);
      const cls = days < 0 ? 'text-rose-400 font-bold' : days < 30 ? 'text-amber-400 font-bold' : 'text-slate-300';
      extra = `<span class="${cls}">${a.expiry_date}</span><br><span class="text-[10px] text-slate-500">Batch ${a.batch_no || '-'}</span>`;
    } else if (biz && biz.serialTracking === 'imei' && a.imei) {
      extra = `<span class="font-mono text-[10px] text-slate-300">${a.imei}</span><br><span class="text-[10px] text-slate-500">${a.warranty_months || 0} mo warranty</span>`;
    } else if (biz && biz.serialTracking === 'serial' && a.serial) {
      extra = `<span class="font-mono text-[10px] text-slate-300">${a.serial}</span><br><span class="text-[10px] text-slate-500">${a.warranty_months || 0} mo warranty</span>`;
    } else if (biz && biz.id === 'bookshop' && a.isbn) {
      extra = `<span class="font-mono text-[10px] text-slate-300">${a.isbn}</span><br><span class="text-[10px] text-slate-500">${a.author || '-'}</span>`;
    } else if (biz && biz.id === 'fashion' && (a.sizes || a.colors)) {
      extra = `<span class="text-[10px] text-slate-300">${(a.sizes || []).join(', ') || '-'}</span><br><span class="text-[10px] text-slate-500">${(a.colors || []).join(', ') || ''}</span>`;
    }

    const profitCls = profit > 0 ? 'text-lime-400' : profit < 0 ? 'text-rose-400' : 'text-slate-400';
    return `
      <tr class="border-b border-white/5 hover:bg-white/5 transition-all table-row-enter" style="animation-delay:${Math.min(i * 0.03, 0.4)}s">
        <td class="px-4 py-3 font-bold text-slate-200"><span class="text-lg mr-1">${p.emoji || '📦'}</span>${p.name || 'Item'}</td>
        <td class="px-4 py-3 font-mono text-xs text-slate-400">${p.barcode || p.sku || 'N/A'}</td>
        <td class="px-4 py-3"><span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/5 text-slate-300 border border-white/10">${p.category || 'General'}</span></td>
        <td class="px-4 py-3 text-xs"><span class="px-2 py-0.5 rounded text-[11px] font-bold ${p.product_type === 'SERVICE' ? 'bg-pink-500/20 text-pink-300' : 'bg-primary/20 text-primary'}">${p.product_type || 'PHYSICAL'}</span></td>
        <td class="px-4 py-3 text-amber-300">Rs. ${costVal.toFixed(2)}</td>
        <td class="px-4 py-3 font-extrabold text-emerald-400">Rs. ${priceVal.toFixed(2)}</td>
        <td class="px-4 py-3"><span class="font-bold ${profitCls}">Rs. ${profit.toFixed(2)}</span><br><span class="text-[10px] text-slate-500">${margin.toFixed(1)}% margin</span></td>
        <td class="px-4 py-3 text-xs">${isPhysical
          ? `<span class="${stockQty < 10 ? 'text-amber-400 font-bold' : 'text-slate-300'}">${stockQty} ${p.unit || 'pcs'}</span>`
          : `<span class="text-slate-500">Service (${a.duration_minutes || 30} min)</span>`}</td>
        <td class="px-4 py-3 text-xs font-bold text-slate-200">${isPhysical ? 'Rs. ' + stockValue.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '<span class="text-slate-500">—</span>'}</td>
        <td class="px-4 py-3 text-xs ${cfg.show ? '' : 'hidden'}">${extra}</td>
        <td class="px-4 py-3 text-right whitespace-nowrap">
          <button onclick="openBarcodeModal('${p.id}')" class="px-2 py-1 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition" title="Barcode / print"><i class="fa-solid fa-barcode"></i></button>
          <button onclick="openReceiveStockModal('${p.id}')" class="px-2 py-1 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition" title="Add stock"><i class="fa-solid fa-arrow-up"></i></button>
          <button onclick="editProduct('${p.id}')" class="px-2 py-1 text-xs text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 rounded-lg transition"><i class="fa-solid fa-pen"></i></button>
          <button onclick="deleteProduct('${p.id}')" class="px-2 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>`;
  }).join('');

  renderInventorySummary(products);
}

function renderInventorySummary(products) {
  let units = 0, costTotal = 0, retailTotal = 0;
  products.forEach(p => {
    if (p.product_type === 'SERVICE') return;
    const qty = Number(p.stock_quantity || 0);
    const cost = Number(p.cost || 0);
    const price = Number(p.price || 0);
    units += qty;
    costTotal += qty * cost;
    retailTotal += qty * price;
  });
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) animateCount(el, val, '', 0);
  };
  set('inv-total-units', units);
  set('inv-total-cost', Math.round(costTotal));
  set('inv-total-retail', Math.round(retailTotal));
  set('inv-total-profit', Math.round(retailTotal - costTotal));
}

async function editProduct(id) {
  const products = await api.getProducts();
  const p = products.find(x => x.id === id);
  if (!p) return;
  const modal = document.getElementById('add-product-modal');
  const title = document.getElementById('add-product-modal-title');
  const biz = getBusiness();
  if (title) title.innerText = 'Edit: ' + (p.name || 'Item');
  document.getElementById('new-prd-name').value = p.name || '';
  document.getElementById('new-prd-barcode').value = p.barcode || p.sku || '';
  document.getElementById('new-prd-type').value = p.product_type || 'PHYSICAL';
  document.getElementById('new-prd-price').value = Number(p.price || 0);
  document.getElementById('new-prd-cost').value = Number(p.cost || 0);
  document.getElementById('new-prd-stock').value = Number(p.stock_quantity || 0);
  document.getElementById('new-prd-unit').value = p.unit || 'pcs';
  document.getElementById('new-prd-category').value = p.category || 'General';
  const idField = document.getElementById('new-prd-id');
  if (idField) idField.value = p.id;
  if (modal) modal.classList.remove('hidden');
}

async function deleteProduct(id) {
  await api.deleteProduct(id);
  await loadInventoryData();
  toast('Item removed', 'success');
}

function openAddProductModal() {
  const biz = getBusiness();
  const title = document.getElementById('add-product-modal-title');
  if (title && biz) title.innerText = biz.terminology.addProduct || 'Add New Item';
  const idField = document.getElementById('new-prd-id');
  if (idField) idField.value = '';
  const form = document.querySelector('#add-product-modal form');
  if (form) form.reset();
  document.getElementById('add-product-modal').classList.remove('hidden');
}

function closeAddProductModal() {
  document.getElementById('add-product-modal').classList.add('hidden');
}

async function handleProductSubmit(e) {
  e.preventDefault();
  const biz = getBusiness();
  const name = document.getElementById('new-prd-name').value;
  const barcode = document.getElementById('new-prd-barcode').value;
  const product_type = document.getElementById('new-prd-type').value;
  const price = parseFloat(document.getElementById('new-prd-price').value || 0);
  const cost = parseFloat(document.getElementById('new-prd-cost').value || 0);
  const stock = parseFloat(document.getElementById('new-prd-stock').value || 0);
  const unit = document.getElementById('new-prd-unit').value || 'pcs';
  const category = document.getElementById('new-prd-category').value || 'General';

  const attributes = {};
  if (biz && biz.expiryTracking) {
    const batch = document.getElementById('new-prd-batch').value;
    const expiry = document.getElementById('new-prd-expiry').value;
    if (batch) attributes.batch_no = batch;
    if (expiry) attributes.expiry_date = expiry;
  }
  if (biz && biz.serialTracking) {
    const serial = document.getElementById('new-prd-serial').value;
    const warranty = document.getElementById('new-prd-warranty').value;
    if (biz.serialTracking === 'imei') attributes.imei = serial;
    else attributes.serial = serial;
    if (warranty) attributes.warranty_months = parseInt(warranty);
  }

  const EMOJI_BY_CAT = { Grocery: '🛒', Food: '🍽️', Beverages: '🥤', Electronics: '💻', Beauty: '💅' };

  const editId = document.getElementById('new-prd-id')?.value || '';
  try {
    if (editId) {
      await api.updateProduct(editId, { name, barcode, product_type, price, cost, stock_quantity: stock, unit, category, attributes });
      toast('Item updated', 'success');
    } else {
      await api.addProduct({ name, barcode, product_type, price, cost, stock_quantity: stock, unit, category, attributes, emoji: '📦' });
      toast('Item saved to catalog', 'success');
    }
    closeAddProductModal();
    e.target.reset();
    document.getElementById('new-prd-id').value = '';
    document.getElementById('new-prd-stock').value = '50';
    document.getElementById('new-prd-unit').value = 'pcs';
    await loadInventoryData();
  } catch (err) {
    toast('Error saving item', 'error');
  }
}

// =====================================================================
// RECEIVE STOCK (add quantity to existing items)
// =====================================================================
let stockCatalog = [];

async function openReceiveStockModal(productId) {
  stockCatalog = (await api.getProducts()).filter(p => p.product_type !== 'SERVICE');
  const sel = document.getElementById('rs-product');
  if (!sel) return;
  if (!stockCatalog.length) { toast('No stock items — add an item first', 'error'); return; }
  sel.innerHTML = stockCatalog.map(p => `<option value="${p.id}">${p.emoji || ''} ${p.name}</option>`).join('');
  if (productId) sel.value = productId;
  fillReceiveStockDefaults();
  const modal = document.getElementById('receive-stock-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeReceiveStockModal() {
  const modal = document.getElementById('receive-stock-modal');
  if (modal) modal.classList.add('hidden');
}

function fillReceiveStockDefaults() {
  const sel = document.getElementById('rs-product');
  if (!sel) return;
  const p = stockCatalog.find(x => x.id === sel.value);
  if (!p) return;
  document.getElementById('rs-current').value = `${Number(p.stock_quantity || 0)} ${p.unit || 'pcs'}`;
  document.getElementById('rs-qty').value = 10;
  document.getElementById('rs-cost').value = Number(p.cost || 0);
  document.getElementById('rs-price').value = Number(p.price || 0);
  updateReceivePreview();
}

function updateReceivePreview() {
  const sel = document.getElementById('rs-product');
  const p = stockCatalog.find(x => x.id === (sel ? sel.value : ''));
  if (!p) return;
  const add = parseFloat(document.getElementById('rs-qty').value) || 0;
  const cost = parseFloat(document.getElementById('rs-cost').value) || Number(p.cost || 0);
  const newStock = Number(p.stock_quantity || 0) + add;
  document.getElementById('rs-preview').innerText = `${newStock} ${p.unit || 'pcs'}`;
  document.getElementById('rs-preview-value').innerText = 'Rs. ' + (newStock * cost).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function submitReceiveStock(e) {
  e.preventDefault();
  const sel = document.getElementById('rs-product');
  const p = stockCatalog.find(x => x.id === (sel ? sel.value : ''));
  if (!p) return;
  const add = parseFloat(document.getElementById('rs-qty').value) || 0;
  const cost = parseFloat(document.getElementById('rs-cost').value) || 0;
  const price = parseFloat(document.getElementById('rs-price').value) || 0;
  if (add <= 0) { toast('Enter a quantity to add', 'error'); return; }
  await api.updateProduct(p.id, {
    stock_quantity: Number(p.stock_quantity || 0) + add,
    cost, price
  });
  closeReceiveStockModal();
  toast(`Added ${add} ${p.unit || 'pcs'} to ${p.name}`, 'success');
  await loadInventoryData();
}

document.addEventListener('input', (e) => {
  if (['rs-qty', 'rs-cost', 'rs-price'].includes(e.target.id)) updateReceivePreview();
});

// =====================================================================
// BARCODE — generate + print labels
// =====================================================================
let barcodeProduct = null;

function makeEAN13() {
  let base = '200' + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(base[i]) * (i % 2 === 0 ? 1 : 3);
  const check = (10 - (sum % 10)) % 10;
  return base + check;
}

function generateBarcodeNumber() {
  const field = document.getElementById('new-prd-barcode');
  if (field) { field.value = makeEAN13(); toast('Barcode generated', 'success'); }
}

function renderBarcodeInto(el, value) {
  if (!el) return;
  el.innerHTML = '';
  if (!value) { el.innerHTML = '<span style="color:#64748b;font-size:12px">No barcode</span>'; return; }
  const draw = (fmt) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    JsBarcode(svg, value, { format: fmt, displayValue: true, height: 64, margin: 6, fontSize: 15, width: 2 });
    return svg;
  };
  if (typeof JsBarcode !== 'function') {
    el.innerHTML = `<span style="font-family:monospace;color:#0f172a;font-weight:700">${value}</span>`;
    return;
  }
  try {
    el.appendChild(draw(/^\d{13}$/.test(value) ? 'EAN13' : 'CODE128'));
  } catch (e) {
    try { el.appendChild(draw('CODE128')); }
    catch (e2) { el.innerHTML = `<span style="font-family:monospace;color:#0f172a;font-weight:700">${value}</span>`; }
  }
}

async function openBarcodeModal(productId) {
  const p = (await api.getProducts()).find(x => x.id === productId);
  if (!p) return;
  if (!p.barcode) {
    p.barcode = makeEAN13();
    await api.updateProduct(p.id, { barcode: p.barcode });
  }
  barcodeProduct = p;
  document.getElementById('bc-name').innerText = (p.emoji ? p.emoji + ' ' : '') + p.name;
  document.getElementById('bc-price').innerText = 'Rs. ' + Number(p.price || 0).toFixed(2);
  renderBarcodeInto(document.getElementById('bc-barcode'), p.barcode);
  document.getElementById('bc-copies').value = 1;
  document.getElementById('barcode-modal').classList.remove('hidden');
}

function closeBarcodeModal() {
  document.getElementById('barcode-modal').classList.add('hidden');
}

async function regenerateBarcodeNumber() {
  if (!barcodeProduct) return;
  barcodeProduct.barcode = makeEAN13();
  await api.updateProduct(barcodeProduct.id, { barcode: barcodeProduct.barcode });
  renderBarcodeInto(document.getElementById('bc-barcode'), barcodeProduct.barcode);
  toast('New barcode number generated', 'success');
}

function printBarcodeLabels() {
  if (!barcodeProduct) return;
  const copies = Math.max(1, Math.min(100, parseInt(document.getElementById('bc-copies').value) || 1));
  const svg = document.getElementById('bc-barcode').innerHTML;
  const name = (barcodeProduct.name || 'Item').replace(/</g, '&lt;');
  const price = Number(barcodeProduct.price || 0).toFixed(2);
  const label = `<div class="label"><div class="bc">${svg}</div><div class="nm">${name}</div><div class="pr">Rs. ${price}</div></div>`;
  const doc = `<!doctype html><html><head><meta charset="utf-8"><title>Barcode Labels</title><style>
    *{box-sizing:border-box}
    body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:8px}
    .label{width:180px;display:inline-block;text-align:center;border:1px dashed #cbd5e1;border-radius:6px;padding:8px;margin:4px;page-break-inside:avoid}
    .bc svg{width:160px;height:auto}
    .nm{font-size:11px;font-weight:700;color:#0f172a;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .pr{font-size:11px;color:#059669;font-weight:700}
    @media print{.label{border:none}}
  </style></head><body>${label.repeat(copies)}
  <script>window.onload=function(){setTimeout(function(){window.print();},250);};<\/script>
  </body></html>`;
  const w = window.open('', '_blank', 'width=420,height=600');
  if (!w) { toast('Allow pop-ups to print barcode labels', 'error'); return; }
  w.document.open(); w.document.write(doc); w.document.close();
}
