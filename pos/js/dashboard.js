// =====================================================================
// PIXEL BY MALIYA POS — ANIMATED DASHBOARD
// =====================================================================
let chartInstance = null;
let categoryChartInstance = null;
let trendChartInstance = null;

const donutCenterTextPlugin = {
  id: 'donutCenterText',
  afterDraw(chart) {
    if (chart.config.type !== 'doughnut') return;
    const cfg = chart.options.plugins?.donutCenterText;
    if (!cfg || cfg.display === false) return;
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const { top, left, width, height } = chartArea;
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    ctx.save();
    ctx.font = '600 12px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const label = cfg.label || 'Total';
    ctx.fillText(label, centerX, centerY - 12);
    const val = Number(cfg.value ?? cfg.profit ?? 0);
    const text = cfg.text || `Rs. ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    ctx.font = '800 18px Inter, system-ui, sans-serif';
    ctx.fillStyle = cfg.color || (val < 0 ? '#fb7185' : '#10b981');
    ctx.fillText(text, centerX, centerY + 12);
    ctx.restore();
  }
};

if (typeof Chart !== 'undefined' && !Chart.registry.plugins.get('donutCenterText')) {
  Chart.register(donutCenterTextPlugin);
}

function themeColor(varName, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v || fallback;
}

async function loadDashboardData() {
  try {
    const biz = getBusiness();
    const stats = await api.getDashboardStats();
    const catalog = await api.getProducts();
    const hrList = await api.getHR();
    const doctors = (typeof api.getDoctors === 'function') ? await api.getDoctors() : [];
    const appointments = (typeof api.getAppointments === 'function') ? await api.getAppointments() : [];

    const modules = {};
    const modNames = Object.keys((biz && biz.moduleData) || {});
    for (const m of modNames) modules[m] = await api.getModule(m);

    const credit = (typeof api.getCredit === 'function') ? await api.getCredit() : [];

    const ctx = { stats, catalog, hr: hrList, doctors, appointments, modules, credit, biz };
    const cfg = (biz && biz.dashboard) || {};

    setText('dash-trend-title', cfg.trendTitle || 'Sales Trend');
    setText('dash-category-title', cfg.categoryTitle || 'Category Sales');
    setText('dash-recent-title', cfg.recentTitle || 'Recent Transactions');

    renderKpiGrid(cfg.kpis, ctx);
    renderSignature(cfg.signature, ctx);

    const income = Number(stats?.totalIncome || 0);
    const expenses = Number(stats?.totalExpenses || 0);
    const profit = Number(stats?.netProfit ?? (income - expenses));

    try { renderTrendChart(stats?.recentTransactions || [], income); } catch (e) { console.warn(e.message); }
    try { renderCategorySales(stats?.categoryBreakdown || {}); } catch (e) { console.warn(e.message); }
    try { renderRecentOrdersTable(stats?.recentTransactions || []); } catch (e) { console.warn(e.message); }
    try { renderFinancialChart(income, expenses, profit); } catch (e) { console.warn(e.message); }
  } catch (err) {
    console.error('Failed to load dashboard data:', err);
  }
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerText = val;
}

function computeMetric(key, ctx) {
  const { stats, catalog, hr, doctors, appointments, modules, credit, biz } = ctx;
  const income = Number(stats.totalIncome || 0);
  const orders = Number(stats.totalOrdersCount || 0);
  const low = p => p.product_type === 'PHYSICAL' && Number(p.stock_quantity || 0) < 5;
  const expDays = p => {
    const d = p.attributes && p.attributes.expiry_date;
    if (!d) return null;
    return (new Date(d) - Date.now()) / 86400000;
  };
  const expSoon = p => { const d = expDays(p); return d !== null && d <= 30; };
  switch (key) {
    case 'income': return { money: true, value: income };
    case 'expenses': return { money: true, value: Number(stats.totalExpenses || 0) };
    case 'profit': return { money: true, value: Number(stats.netProfit || 0) };
    case 'orders': return { value: orders };
    case 'aov': return { money: true, value: orders ? income / orders : 0 };
    case 'products': return { value: catalog.length };
    case 'lowStock': return { value: catalog.filter(low).length };
    case 'expiring': return { value: catalog.filter(expSoon).length };
    case 'staff': return { value: hr.filter(s => s.status === 'Active').length };
    case 'doctors': return { value: doctors.length };
    case 'patients': return { value: appointments.length };
    case 'prescriptions': return { value: (modules.prescriptions || []).filter(r => r.status !== 'Dispensed').length };
    case 'bookings': return { value: (modules.bookings || []).length };
    case 'builds': return { value: (modules.builds || []).filter(b => b.status !== 'Delivered').length };
    case 'bulk': return { value: (modules.bulk || []).length };
    case 'variants': return { value: (modules.variants || []).length };
    case 'warranty': return { value: (modules.warranty || []).filter(r => r.status !== 'Expired').length };
    case 'repairs': return { value: catalog.filter(p => p.product_type === 'SERVICE').length };
    case 'tables': return { value: ((biz.tables) || []).filter(t => t.status === 'OCCUPIED').length };
    case 'cod': return { money: true, value: (modules.fulfillment || []).filter(r => ['Pending', 'Packed', 'Shipped'].includes(r.status)).reduce((s, r) => s + Number(r.cod || 0), 0) };
    case 'deliveries': return { value: (modules.fulfillment || []).filter(r => r.status === 'Delivered').length };
    case 'due': return { money: true, value: (credit || []).reduce((s, r) => s + Math.max(0, Number(r.total || 0) - Number(r.paid || 0)), 0) };
    case 'creditCustomers': return { value: (credit || []).filter(r => Number(r.paid || 0) < Number(r.total || 0)).length };
    default: return { value: 0 };
  }
}

function renderKpiGrid(kpis, ctx) {
  const host = document.getElementById('dash-kpi-grid');
  if (!host || !kpis || !kpis.length) return;
  const toneText = t => t === 'primary' ? 'text-primary' : `text-${t}-400`;
  const toneBorder = t => t === 'primary' ? 'border-l-primary' : `border-l-${t}-500`;
  host.innerHTML = kpis.map((k, i) => {
    const [key, label, icon, tone] = k;
    const m = computeMetric(key, ctx);
    return `
      <div class="glass-panel p-5 rounded-2xl border-l-4 ${toneBorder(tone)} shadow-lg kpi-card section-enter" style="animation-delay:${i * 0.06}s">
        <div class="flex items-center justify-between">
          <p class="text-xs font-medium text-slate-400">${label}</p>
          <span class="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center ${toneText(tone)}"><i class="fa-solid ${icon}"></i></span>
        </div>
        <h2 class="text-2xl font-extrabold mt-2 ${toneText(tone)}" id="kpi-${key}">${m.money ? 'Rs. 0' : '0'}</h2>
      </div>`;
  }).join('');
  kpis.forEach(k => {
    const [key] = k;
    const m = computeMetric(key, ctx);
    const el = document.getElementById(`kpi-${key}`);
    if (!el) return;
    if (m.money) animateCount(el, Math.abs(m.value), m.value < 0 ? '- Rs. ' : 'Rs. ', 0);
    else animateCount(el, m.value, '', 0);
  });
}

function signatureWrap(type, title, icon, inner) {
  return `
    <div class="glass-panel p-6 rounded-2xl space-y-4 kpi-card section-enter">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-slate-200 text-lg"><i class="fa-solid ${icon} mr-2 text-primary"></i>${title}</h3>
        <button onclick="switchTab('${type}')" class="text-xs text-primary font-bold hover:underline">View all <i class="fa-solid fa-arrow-right ml-1"></i></button>
      </div>
      ${inner}
    </div>`;
}

function miniRows(rows) {
  return `<div class="space-y-2">${rows.join('')}</div>`;
}
function miniRow(left, mid, right) {
  return `<div class="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
    <div class="min-w-0">${left}${mid ? `<p class="text-[10px] text-slate-500 truncate">${mid}</p>` : ''}</div>
    <div class="shrink-0">${right}</div>
  </div>`;
}

function renderSignature(type, ctx) {
  const host = document.getElementById('dash-signature');
  if (!host) return;
  if (!type) { host.innerHTML = ''; return; }
  const { catalog, modules, doctors, appointments, biz } = ctx;

  if (type === 'kitchen') {
    const list = modules.kitchen || [];
    const active = list.filter(r => r.status !== 'Served').slice(0, 4);
    const inner = miniRows(active.map(r => miniRow(
      `<p class="font-bold text-slate-100 text-sm">${r.table} <span class="text-slate-500 font-normal">• ${r.waiter || ''}</span></p>`,
      (r.items || []).map(i => `${i[0]} ×${i[1]}`).join(', '),
      `<span class="px-2 py-0.5 rounded text-[10px] font-bold ${statusClass(r.status)}">${r.status}</span>`
    )));
    host.innerHTML = signatureWrap('kitchen', 'Kitchen Display — Live Tickets', 'fa-fire-burner', active.length ? inner : emptySig('All tickets served.'));
    return;
  }

  if (type === 'expiry') {
    const items = (catalog || []).map(p => ({ p, days: p.attributes && p.attributes.expiry_date ? Math.round((new Date(p.attributes.expiry_date) - Date.now()) / 86400000) : null }))
      .filter(x => x.days !== null && x.days <= 60).sort((a, b) => a.days - b.days).slice(0, 5);
    const tone = d => d < 0 ? 'bg-rose-500/20 text-rose-300' : d <= 15 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300';
    const inner = miniRows(items.map(x => miniRow(
      `<p class="font-bold text-slate-100 text-sm">${x.p.name}</p>`,
      `Batch ${(x.p.attributes && x.p.attributes.batch_no) || '—'} • Stock ${x.p.stock_quantity}`,
      `<span class="px-2 py-0.5 rounded text-[10px] font-bold ${tone(x.days)}">${x.days < 0 ? 'Expired' : x.days + 'd left'}</span>`
    )));
    host.innerHTML = signatureWrap('expiry', 'Expiry Watch', 'fa-calendar-xmark', items.length ? inner : emptySig('No items expiring soon.'));
    return;
  }

  if (type === 'warranty') {
    const list = (modules.warranty || []).slice(0, 5);
    const inner = miniRows(list.map(r => miniRow(
      `<p class="font-bold text-slate-100 text-sm">${r.product}</p>`,
      `${r.imei || ''} • ${r.customer || ''}`,
      `<span class="px-2 py-0.5 rounded text-[10px] font-bold ${statusClass(r.status)}">${r.status}</span>`
    )));
    host.innerHTML = signatureWrap('warranty', 'Warranty Registry', 'fa-shield-halved', inner);
    return;
  }

  if (type === 'builds') {
    const list = (modules.builds || []).slice(0, 4);
    const tone = s => statusClass(s);
    const inner = miniRows(list.map(r => miniRow(
      `<p class="font-bold text-slate-100 text-sm">${r.name}</p>`,
      `${r.customer || ''} • ${r.cpu || ''}`,
      `<span class="px-2 py-0.5 rounded text-[10px] font-bold ${tone(r.status)}">${r.status}</span>`
    )));
    host.innerHTML = signatureWrap('builds', 'Custom Build Progress', 'fa-microchip', inner);
    return;
  }

  if (type === 'bulk') {
    const list = (modules.bulk || []).slice(0, 4);
    const inner = miniRows(list.map(r => miniRow(
      `<p class="font-bold text-slate-100 text-sm">${r.institution}</p>`,
      `${r.contact || ''}`,
      `<span class="px-2 py-0.5 rounded text-[10px] font-bold ${statusClass(r.status)}">${r.status}</span>`
    )));
    host.innerHTML = signatureWrap('bulk', 'Bulk & School Orders', 'fa-graduation-cap', inner);
    return;
  }

  if (type === 'clinic') {
    const todayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
    const onDuty = (doctors || []).filter(d => (d.days || []).includes(todayName));
    const queue = (appointments || []).slice(0, 4);
    const inner = miniRows(queue.map(r => miniRow(
      `<p class="font-bold text-slate-100 text-sm">${r.patient}</p>`,
      `${r.doctorName} • ${r.time}`,
      `<span class="px-2 py-0.5 rounded text-[10px] font-bold ${statusClass(r.status)}">${r.status}</span>`
    )));
    host.innerHTML = signatureWrap('clinic', `Clinic Today • ${onDuty.length} Doctor(s) On Duty`, 'fa-stethoscope', queue.length ? inner : emptySig('No patients in the clinic queue.'));
    return;
  }

  if (type === 'bookings') {
    const list = (modules.bookings || []).slice(0, 5);
    const inner = miniRows(list.map(r => miniRow(
      `<p class="font-bold text-slate-100 text-sm">${r.client}</p>`,
      `${r.service || ''} • ${r.stylist || ''}`,
      `<span class="text-xs font-mono text-slate-300 mr-2">${r.time || ''}</span><span class="px-2 py-0.5 rounded text-[10px] font-bold ${statusClass(r.status)}">${r.status}</span>`
    )));
    host.innerHTML = signatureWrap('appointments', "Today's Appointment Book", 'fa-calendar-check', inner);
    return;
  }

  if (type === 'variants') {
    const low = (modules.variants || []).filter(v => Number(v.stock) < 5).slice(0, 5);
    const inner = miniRows(low.map(v => miniRow(
      `<p class="font-bold text-slate-100 text-sm">${v.product}</p>`,
      `${v.color || ''} • ${v.size || ''} • ${v.sku || ''}`,
      `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">${v.stock} left</span>`
    )));
    host.innerHTML = signatureWrap('variants', 'Low Stock Variants', 'fa-shirt', low.length ? inner : emptySig('All variants well stocked.'));
    return;
  }

  if (type === 'fulfillment') {
    const list = (modules.fulfillment || []).filter(r => r.status !== 'Returned').slice(0, 4);
    const inner = miniRows(list.map(r => miniRow(
      `<p class="font-bold text-slate-100 text-sm">${r.customer} <span class="text-slate-500 font-normal">• ${r.city || ''}</span></p>`,
      `${r.courier || ''}${r.tracking ? ' • ' + r.tracking : ''} • ${r.items || 0} item(s)`,
      `<span class="px-2 py-0.5 rounded text-[10px] font-bold ${statusClass(r.status)}">${r.status}</span>`
    )));
    host.innerHTML = signatureWrap('fulfillment', 'Order Fulfilment — COD Pipeline', 'fa-truck-fast', list.length ? inner : emptySig('No active orders.'));
    return;
  }

  host.innerHTML = '';
}

function emptySig(msg) {
  return `<p class="text-sm text-slate-500 text-center py-6">${msg}</p>`;
}

function renderTrendChart(orders, income) {
  const canvas = document.getElementById('trendChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (trendChartInstance) trendChartInstance.destroy();

  const primary = themeColor('--primary', '#f97316');
  const accent = themeColor('--accent', '#fbbf24');

  // Build a smooth 7-day series scaled to the business income
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const base = Math.max(income / 7, 100);
  const seed = [0.7, 0.9, 0.8, 1.1, 1.35, 1.7, 1.25];
  const series = seed.map((s, i) => Math.round(base * s * (1 + (i % 2 ? 0.08 : -0.05))));

  const g = ctx.createLinearGradient(0, 0, 0, 260);
  g.addColorStop(0, hexToRgba(primary, 0.45));
  g.addColorStop(1, hexToRgba(primary, 0.02));

  trendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: days,
      datasets: [{
        label: 'Sales (Rs.)',
        data: series,
        borderColor: primary,
        backgroundColor: g,
        borderWidth: 3,
        fill: true,
        tension: 0.42,
        pointBackgroundColor: primary,
        pointBorderColor: '#0f172a',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1200, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a', borderColor: '#334155', borderWidth: 1, padding: 10,
          callbacks: { label: c => ` Rs. ${Number(c.raw).toLocaleString()}` }
        }
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#94a3b8' } },
        y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#94a3b8', callback: v => 'Rs.' + (v / 1000) + 'k' } }
      }
    }
  });
}

function renderCategorySales(breakdown) {
  const canvas = document.getElementById('categoryChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (categoryChartInstance) categoryChartInstance.destroy();
  const categories = Object.keys(breakdown || {});
  const values = Object.values(breakdown).map(v => Number(v || 0));
  if (categories.length === 0) return;

  const totalCategorySales = values.reduce((sum, v) => sum + v, 0);
  const palette = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#ef4444', '#84cc16'];

  categoryChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [{
        data: values,
        backgroundColor: palette.map(c => hexToRgba(c, 0.85)),
        borderColor: palette,
        borderWidth: 2,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '58%',
      animation: { animateRotate: true, animateScale: true, duration: 1100 },
      plugins: {
        legend: { position: 'bottom', labels: { color: '#cbd5e1', usePointStyle: true, padding: 12, boxWidth: 8, font: { size: 11 } } },
        donutCenterText: {
          display: true,
          label: 'Total Sales',
          value: totalCategorySales,
          color: '#10b981'
        }
      }
    }
  });
}

function renderRecentOrdersTable(orders) {
  const tbody = document.getElementById('dash-orders-table-body');
  if (!tbody) return;
  if (!orders || orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-slate-500">No transactions recorded yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = orders.map((ord, i) => {
    const ordTotal = Number(ord.total ?? ord.total_amount ?? 0);
    return `
      <tr class="border-b border-white/5 hover:bg-white/5 transition-all table-row-enter" style="animation-delay:${i * 0.05}s">
        <td class="px-4 py-3 font-mono font-bold text-primary">#${ord.order_number || ord.id}</td>
        <td class="px-4 py-3 text-slate-300 text-xs">${ord.customer_name || 'Walk-in Customer'}</td>
        <td class="px-4 py-3 text-xs font-semibold text-slate-400">${ord.payment_method || 'CASH'}</td>
        <td class="px-4 py-3 font-extrabold text-emerald-400">Rs. ${ordTotal.toFixed(2)}</td>
        <td class="px-4 py-3 text-right">
          <button onclick='showReceiptModalDirect(${JSON.stringify(ord).replace(/'/g, "&apos;")})' class="px-2.5 py-1 text-xs bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg border border-white/10">
            <i class="fa-solid fa-print mr-1"></i> Receipt
          </button>
        </td>
      </tr>`;
  }).join('');
}

function renderFinancialChart(income, expenses, profit) {
  const canvas = document.getElementById('financialChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (chartInstance) chartInstance.destroy();
  const inc = Math.max(0, Number(income || 0));
  const exp = Math.max(0, Number(expenses || 0));

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Revenue', 'Expenses'],
      datasets: [{
        data: [inc, exp],
        backgroundColor: ['rgba(52,211,153,0.85)', 'rgba(251,113,133,0.85)'],
        borderColor: ['#10b981', '#f43f5e'],
        borderWidth: 2,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      animation: { animateRotate: true, animateScale: true, duration: 1100 },
      plugins: {
        legend: { position: 'bottom', labels: { color: '#cbd5e1', usePointStyle: true, pointStyle: 'circle', padding: 14, font: { size: 11 } } },
        tooltip: { backgroundColor: '#0f172a', borderColor: '#334155', borderWidth: 1, padding: 10, callbacks: { label: c => ` ${c.label}: Rs. ${Number(c.raw).toFixed(2)}` } },
        donutCenterText: {
          display: true,
          label: 'Net Profit',
          value: profit,
          color: profit < 0 ? '#fb7185' : '#10b981'
        }
      }
    }
  });
}

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
