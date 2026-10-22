// =====================================================================
// PIXEL BY MALIYA POS — SPA CONTROLLER
// =====================================================================

let activeTab = 'dashboard';

const NAV_CATALOG = {
  dashboard:    { icon: 'fa-chart-pie',              label: 'Dashboard' },
  pos:          { icon: 'fa-cash-register',          label: 'POS Terminal', tab: 'billing' },
  tables:       { icon: 'fa-chair',                  label: 'Tables & Floor' },
  rooms:        { icon: 'fa-bed',                    label: 'Hotel Rooms' },
  products:     { icon: 'fa-boxes-stacked',           label: 'Products' },
  categories:   { icon: 'fa-tags',                    label: 'Categories' },
  customers:    { icon: 'fa-users',                   label: 'Customers' },
  clinic:       { icon: 'fa-stethoscope',             label: 'Clinic & Doctors' },
  kitchen:      { icon: 'fa-fire-burner',             label: 'Kitchen / KOT' },
  recipes:      { icon: 'fa-carrot',                  label: 'Recipes & Ingredients' },
  purchase:     { icon: 'fa-file-invoice',            label: 'Purchase Orders' },
  warranty:     { icon: 'fa-shield-halved',           label: 'Warranty & IMEI' },
  builds:       { icon: 'fa-microchip',               label: 'Custom Builds' },
  bulk:         { icon: 'fa-graduation-cap',          label: 'Bulk & School Orders' },
  prescriptions:{ icon: 'fa-file-prescription',       label: 'Prescriptions' },
  appointments: { icon: 'fa-calendar-check',          label: 'Appointments' },
  variants:     { icon: 'fa-shirt',                   label: 'Size & Colour' },
  fulfillment:  { icon: 'fa-truck-fast',              label: 'Order Fulfilment' },
  couriers:     { icon: 'fa-truck-fast',              label: 'Courier Services' },
  credit:       { icon: 'fa-file-invoice-dollar',     label: 'Credit & Dues' },
  hr:           { icon: 'fa-user-tie',                label: 'HR / Staff' },
  suppliers:    { icon: 'fa-truck-field',             label: 'Suppliers' },
  stock:        { icon: 'fa-cubes-stacked',           label: 'Stock' },
  expiry:       { icon: 'fa-calendar-xmark',          label: 'Expiry & Batches' },
  repairs:      { icon: 'fa-screwdriver-wrench',      label: 'Repairs & Service' },
  quotations:   { icon: 'fa-file-signature',          label: 'Quotations' },
  invoices:     { icon: 'fa-file-invoice-dollar',     label: 'Invoices' },
  distribution: { icon: 'fa-truck-field',            label: 'Distribution (DMS)' },
  payments:     { icon: 'fa-credit-card',             label: 'Payments' },
  reports:      { icon: 'fa-chart-column',            label: 'Reports' },
  users:        { icon: 'fa-user-gear',               label: 'Users' },
  sms:          { icon: 'fa-comment-sms',             label: 'SMS Centre' },
  settings:     { icon: 'fa-gear',                    label: 'Settings' },
  expenses:     { icon: 'fa-file-invoice-dollar',     label: 'Expenses' }
};

const NAV_ICON_COLORS = {
  dashboard: 'text-primary', pos: 'text-emerald-400', tables: 'text-amber-400', rooms: 'text-sky-400',
  products: 'text-blue-400', categories: 'text-purple-400',   customers: 'text-amber-400',
  clinic: 'text-teal-400', kitchen: 'text-rose-400', recipes: 'text-lime-400', purchase: 'text-emerald-400',
  warranty: 'text-sky-400', builds: 'text-cyan-400', bulk: 'text-indigo-400',
  prescriptions: 'text-teal-400', appointments: 'text-pink-400', variants: 'text-rose-400',
  fulfillment: 'text-violet-400', credit: 'text-amber-400',
  couriers: 'text-sky-400',
  hr: 'text-pink-400', suppliers: 'text-teal-400', stock: 'text-orange-400',
  expiry: 'text-rose-400', repairs: 'text-cyan-400', quotations: 'text-cyan-400',
  distribution: 'text-indigo-400',
  invoices: 'text-emerald-400', payments: 'text-pink-400', reports: 'text-primary',
  users: 'text-rose-400', settings: 'text-slate-400', expenses: 'text-rose-400',
  sms: 'text-emerald-400'
};

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const qBiz = urlParams.get('biz');
  if (qBiz === 'distribution') {
    window.location.replace('../distribution/index.html');
    return;
  }

  const currentBizId = getBusinessId();
  if (currentBizId === 'distribution' && urlParams.get('legacy') !== '1') {
    window.location.replace('../distribution/index.html');
    return;
  }

  renderLanding();
  renderBusinessSwitcher();
  const biz = getBusiness();
  if (biz) {
    onBusinessChanged(true);
  } else {
    showLanding();
  }
});

// Central hook called whenever the business context changes
function onBusinessChanged(isFirstLoad) {
  const biz = getBusiness();
  if (!biz) { showLanding(); return; }

  applyTheme(biz);
  resetBusinessSession();

  // Sidebar branding
  const nameEl = document.getElementById('sidebar-store-name');
  const typeEl = document.getElementById('sidebar-store-type');
  const logoIcon = document.getElementById('sidebar-logo-icon');
  const dashIcon = document.getElementById('dash-hero-icon');
  if (nameEl) nameEl.innerText = biz.storeName;
  if (typeEl) typeEl.innerText = biz.name;
  if (logoIcon) logoIcon.className = `fa-solid ${biz.icon}`;
  const dcfg = biz.dashboard || {};
  if (dashIcon) dashIcon.className = `fa-solid ${dcfg.icon || biz.icon}`;

  // Dashboard hero
  const heroTitle = document.getElementById('dash-hero-title');
  const heroSub = document.getElementById('dash-hero-sub');
  const heroEyebrow = document.getElementById('dash-hero-eyebrow');
  if (heroTitle) heroTitle.innerText = dcfg.title || biz.dashboardLabel || biz.name;
  if (heroSub) heroSub.innerText = dcfg.sub || `${biz.storeName} • ${biz.tagline}`;
  if (heroEyebrow) heroEyebrow.innerText = dcfg.eyebrow || (biz.emoji + ' ' + biz.short.toUpperCase());
  const today = document.getElementById('dash-today-date');
  if (today) today.innerText = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  // Dedicated banner for Enterprise Distribution Suite
  let distSuiteBanner = document.getElementById('dash-distribution-suite-banner');
  if (biz.id === 'distribution') {
    if (!distSuiteBanner) {
      distSuiteBanner = document.createElement('div');
      distSuiteBanner.id = 'dash-distribution-suite-banner';
      distSuiteBanner.className = 'p-5 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4';
      distSuiteBanner.innerHTML = `
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-2xl flex-shrink-0">
            <i class="fa-solid fa-truck-field"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase tracking-wider">Enterprise Software Available</span>
              <h3 class="text-base font-extrabold text-white">Pixel Distribution Suite — Full Enterprise DMS</h3>
            </div>
            <p class="text-xs text-slate-300 mt-1">Looking for our standalone Enterprise DMS? Open the full 14-module light-theme platform with Van Fleet SFA, Cheque Portfolio &amp; Route EOD Balancing.</p>
          </div>
        </div>
        <a href="../distribution/index.html" class="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2 flex-shrink-0 transition-transform hover:scale-105 whitespace-nowrap">
          <span>Launch Enterprise Suite</span>
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      `;
      const kpiGrid = document.getElementById('dash-kpi-grid');
      if (kpiGrid && kpiGrid.parentNode) {
        kpiGrid.parentNode.insertBefore(distSuiteBanner, kpiGrid);
      }
    }
  } else if (distSuiteBanner) {
    distSuiteBanner.remove();
  }

  // Settings
  const setStore = document.getElementById('set-store-name');
  const setType = document.getElementById('set-business-type');
  if (setStore) setStore.value = biz.storeName;
  if (setType) setType.value = biz.name;

  // Industry UI configuration
  configureIndustryUI(biz);

  // Nav + switcher
  renderNav(biz);
  renderBusinessSwitcher();

  // Navigate
  const startTab = isFirstLoad ? 'dashboard' : 'dashboard';
  switchTab(startTab);
}

function configureIndustryUI(biz) {
  const hasTables = (biz.id === 'restaurant' || biz.id === 'salon');
  const expiry = !!biz.expiryTracking;
  const serial = biz.serialTracking;

  const orderCtx = document.getElementById('pos-order-context');
  const tableWrap = document.getElementById('pos-table-wrap');
  if (orderCtx) orderCtx.classList.toggle('hidden', !hasTables);
  if (tableWrap) tableWrap.classList.toggle('hidden', biz.id !== 'restaurant' && biz.id !== 'salon');

  const custLabel = document.getElementById('cart-customer-label');
  if (custLabel) {
    if (biz.id === 'restaurant') custLabel.innerText = 'Guest Name / Table:';
    else if (biz.id === 'salon') custLabel.innerText = 'Client Name / Stylist:';
    else custLabel.innerText = 'Customer Name / Reference:';
  }

  const expFields = document.getElementById('new-prd-expiry-fields');
  if (expFields) expFields.classList.toggle('hidden', !expiry);

  const serialFields = document.getElementById('new-prd-serial-fields');
  if (serialFields) serialFields.classList.toggle('hidden', !serial);
  if (serial) {
    const lbl = document.getElementById('serial-field-label');
    const inp = document.getElementById('serial-input-label');
    if (lbl) lbl.innerText = serial === 'imei' ? 'IMEI Tracking' : 'Serial Number Tracking';
    if (inp) inp.innerText = serial === 'imei' ? 'IMEI Number' : 'Serial Number';
  }

  const addBtn = document.getElementById('add-product-btn-label');
  if (addBtn) addBtn.innerText = biz.terminology.addProduct || 'Add Product';
  const prdTitle = document.getElementById('products-title');
  if (prdTitle) prdTitle.innerText = biz.terminology.products + ' Catalog';
  const modalTitle = document.getElementById('add-product-modal-title');
  if (modalTitle) modalTitle.innerText = biz.terminology.addProduct || 'Add New Item';
}

// ---------- Dynamic sidebar nav ----------
function renderNav(biz) {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;
  const term = biz.terminology || {};

  nav.innerHTML = biz.nav.map(key => {
    const item = NAV_CATALOG[key];
    if (!item) return '';
    let label = item.label;
    if (key === 'products') label = term.products || 'Products';

    if (key === 'distribution') {
      return `
        <a href="../distribution/index.html" id="nav-distribution"
           class="nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 font-bold shadow-sm">
          <span class="flex items-center space-x-3">
            <i class="fa-solid fa-truck-field w-5 text-center text-emerald-400"></i>
            <span>Distribution Suite</span>
          </span>
          <span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200">14 MOD ↗</span>
        </a>
      `;
    }

    return `
      <button onclick="switchTab('${item.tab || key}')" id="nav-${item.tab || key}" data-navkey="${key}"
        class="nav-item w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all text-slate-400 hover:bg-white/5 hover:text-slate-200">
        <i class="fa-solid ${item.icon} w-5 text-center ${NAV_ICON_COLORS[key] || 'text-slate-400'}"></i>
        <span>${label}</span>
      </button>`;
  }).join('');
}

// ---------- Tab routing ----------
const ALL_TABS = ['dashboard', 'billing', 'tables', 'rooms', 'products', 'categories', 'customers', 'clinic', 'kitchen', 'recipes', 'purchase', 'warranty', 'builds', 'bulk', 'prescriptions', 'appointments', 'variants', 'fulfillment', 'couriers', 'credit', 'hr', 'suppliers', 'stock', 'expiry', 'repairs', 'quotations', 'invoices', 'distribution', 'payments', 'reports', 'users', 'sms', 'settings', 'expenses'];

const TAB_TITLES = {
  dashboard: 'Dashboard', billing: 'POS Terminal', tables: 'Tables & Floor', rooms: 'Hotel Rooms', products: 'Catalog',
  categories: 'Categories', customers: 'Customers', clinic: 'Clinic & Doctors', hr: 'HR & Staff', suppliers: 'Suppliers',
  kitchen: 'Kitchen / KOT', recipes: 'Recipes & Ingredients', purchase: 'Purchase Orders', warranty: 'Warranty & IMEI', builds: 'Custom Builds',
  bulk: 'Bulk & School Orders', prescriptions: 'Prescriptions', appointments: 'Appointments', variants: 'Size & Colour Stock',
  fulfillment: 'Order Fulfilment (COD)', couriers: 'Courier Services', credit: 'Credit & Dues',  stock: 'Stock', expiry: 'Expiry & Batches', repairs: 'Repairs & Service', quotations: 'Quotations',
  invoices: 'Invoices', distribution: 'Distribution (DMS)', payments: 'Payments', reports: 'Reports', users: 'Users', sms: 'SMS Centre',
  settings: 'Settings', expenses: 'Expenses'
};

async function switchTab(tabName) {
  if (tabName === 'distribution') {
    window.location.href = '../distribution/index.html';
    return;
  }
  activeTab = tabName;

  const pageTitleElem = document.getElementById('page-title');
  if (pageTitleElem) pageTitleElem.innerText = TAB_TITLES[tabName] || 'Dashboard';

  ALL_TABS.forEach(t => {
    const navBtn = document.getElementById(`nav-${t}`);
    const tabSec = document.getElementById(`tab-${t}`);
    if (navBtn) {
      if (t === tabName) navBtn.classList.add('nav-active');
      else navBtn.classList.remove('nav-active');
    }
    if (tabSec) tabSec.classList.toggle('hidden', t !== tabName);
  });

  // Animate the active section in
  const activeSec = document.getElementById(`tab-${tabName}`);
  if (activeSec) {
    activeSec.classList.remove('section-enter');
    void activeSec.offsetWidth;
    activeSec.classList.add('section-enter');
  }

  try {
    if (tabName === 'dashboard') await loadDashboardData();
    else if (tabName === 'billing') await initPosTerminal();
    else if (tabName === 'tables') renderTables();
    else if (tabName === 'rooms') renderRooms();
    else if (tabName === 'products') await loadInventoryData();
    else if (tabName === 'categories') await renderCategories();
    else if (tabName === 'customers') await loadCustomers();
    else if (tabName === 'clinic') await loadClinicData();
    else if (tabName === 'recipes') await loadRecipesData();
    else if (['kitchen', 'purchase', 'warranty', 'builds', 'bulk', 'prescriptions', 'appointments', 'variants', 'fulfillment'].includes(tabName)) await renderModule(tabName);
    else if (tabName === 'couriers') await renderCouriers();
    else if (tabName === 'credit') await loadCreditData();
    else if (tabName === 'sms') await loadSmsData();
    else if (tabName === 'hr') await loadHRData();
    else if (tabName === 'suppliers') loadSuppliers();
    else if (tabName === 'stock') await loadStock();
    else if (tabName === 'expiry') await loadExpiryData();
    else if (tabName === 'repairs') renderRepairs();
    else if (tabName === 'invoices') await loadInvoices();
    else if (tabName === 'distribution') await loadDistributionData();
    else if (tabName === 'payments') await loadPayments();
    else if (tabName === 'reports') await loadReports();
    else if (tabName === 'expenses') await loadExpensesData();
  } catch (err) {
    console.warn(`Tab "${tabName}" failed to load:`, err.message);
  }

  const sidebar = document.getElementById('mobile-sidebar');
  if (sidebar && window.innerWidth < 768 && !sidebar.classList.contains('-translate-x-full')) {
    toggleSidebar();
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('mobile-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar && overlay) {
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
  }
}

// ---------- Toast notifications ----------
function toast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const colors = {
    success: 'from-emerald-500 to-teal-600 text-slate-950',
    info: 'from-primary to-primary text-white',
    error: 'from-rose-500 to-red-600 text-white'
  };
  const icons = { success: 'fa-circle-check', info: 'fa-circle-info', error: 'fa-triangle-exclamation' };
  const el = document.createElement('div');
  el.className = `px-4 py-3 rounded-xl bg-gradient-to-r ${colors[type] || colors.info} font-bold text-sm shadow-2xl flex items-center gap-2.5`;
  el.style.animation = 'slideInRight 0.35s both';
  el.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i> <span>${message}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.style.animation = 'fadeOut 0.35s both';
    setTimeout(() => el.remove(), 350);
  }, 2600);
}

// simple count-up animation for KPI values
function animateCount(element, endValue, prefix = 'Rs. ', decimals = 2, duration = 900) {
  if (!element) return;
  const start = performance.now();
  const from = 0;
  function frame(now) {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = from + (endValue - from) * eased;
    element.innerText = `${prefix}${val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}


