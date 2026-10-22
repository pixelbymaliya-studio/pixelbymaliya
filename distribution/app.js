/**
 * PIXEL DISTRIBUTION SUITE — APPLICATION CONTROLLER & UI ENGINE
 * Developer: Pixel by Maliya
 * Product: Pixel Distribution Suite
 * Tagline: Smarter Distribution. Complete Business Control.
 */

document.addEventListener('DOMContentLoaded', () => {
  const DB = window.PixelDMS.DB;

  // State & Cache
  let currentTab = 'dashboard';
  let activeInvoicePrint = null;
  let activeCustomerStatement = null;

  // Currency Formatter
  function fmtLKR(val) {
    const num = Number(val) || 0;
    return 'LKR ' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function fmtNum(val) {
    return (Number(val) || 0).toLocaleString('en-US');
  }

  // Toast System
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `dms-toast ${type}`;
    let icon = '✓';
    if (type === 'warning') icon = '⚠️';
    if (type === 'error') icon = '✕';
    toast.innerHTML = `<span style="font-weight:700;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3800);
  }

  function openMobileSidebar() {
    const sidebar = document.querySelector('.dms-sidebar');
    const backdrop = document.getElementById('dms-sidebar-backdrop');
    if (sidebar) {
      sidebar.style.removeProperty('transform');
      sidebar.classList.add('open');
    }
    if (backdrop) backdrop.classList.add('active');
    if (window.innerWidth <= 1024) document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    const sidebar = document.querySelector('.dms-sidebar');
    const backdrop = document.getElementById('dms-sidebar-backdrop');
    if (sidebar) {
      sidebar.style.removeProperty('transform');
      sidebar.classList.remove('open');
    }
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Routing / Tab Switcher
  function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sidebar = document.querySelector('.dms-sidebar');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.getElementById('mobile-sidebar-close');
    const backdrop = document.getElementById('dms-sidebar-backdrop');

    if (mobileToggle) {
      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sidebar && sidebar.classList.contains('open')) {
          closeMobileSidebar();
        } else {
          openMobileSidebar();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMobileSidebar();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => {
        closeMobileSidebar();
      });
    }

    document.addEventListener('click', (e) => {
      if (sidebar && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && (!mobileToggle || !mobileToggle.contains(e.target))) {
          closeMobileSidebar();
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileSidebar();
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetTab = item.getAttribute('data-tab');
        if (targetTab) {
          switchTab(targetTab);
          closeMobileSidebar();
        }
      });
    });

    // Handle initial hash or default to dashboard
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(`view-${hash}`)) {
      switchTab(hash);
    } else {
      switchTab('dashboard');
    }
  }

  function switchTab(tabId) {
    currentTab = tabId;
    window.location.hash = tabId;

    closeMobileSidebar();

    // Update nav classes
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Toggle views
    document.querySelectorAll('.module-view').forEach(view => {
      view.classList.remove('active');
    });

    const activeView = document.getElementById(`view-${tabId}`);
    if (activeView) {
      activeView.classList.add('active');
    }

    // Render corresponding view
    renderCurrentView();
  }

  function renderCurrentView() {
    switch (currentTab) {
      case 'dashboard':
        renderDashboard();
        break;
      case 'customers':
        renderCustomers();
        break;
      case 'sales':
        renderSales();
        break;
      case 'cheques':
        renderCheques();
        break;
      case 'credit':
        renderCreditControl();
        break;
      case 'inventory':
        renderInventory();
        break;
      case 'routes':
        renderRoutes();
        break;
      case 'suppliers':
        renderSuppliers();
        break;
      case 'pricing':
        renderPricing();
        break;
      case 'sales-reps':
        renderSalesReps();
        break;
      case 'returns':
        renderReturns();
        break;
      case 'hr':
        renderHR();
        break;
      case 'reports':
        renderReports();
        break;
      case 'admin':
        renderAdmin();
        break;
      default:
        renderDashboard();
    }
    updateNavBadges();
  }

  function updateNavBadges() {
    const stats = DB.getDashboardStats();
    const cheques = DB.getCheques();
    const inHandCount = cheques.filter(c => c.status === 'IN_HAND' || c.status === 'DEPOSITED').length;
    
    const badgeCheques = document.getElementById('badge-cheques-count');
    if (badgeCheques) {
      badgeCheques.textContent = inHandCount;
      badgeCheques.style.display = inHandCount > 0 ? 'inline-block' : 'none';
    }

    const badgeCredit = document.getElementById('badge-credit-count');
    if (badgeCredit) {
      badgeCredit.textContent = stats.activeOutletsOnHold;
      badgeCredit.style.display = stats.activeOutletsOnHold > 0 ? 'inline-block' : 'none';
    }

    const badgeInventory = document.getElementById('badge-inventory-count');
    if (badgeInventory) {
      badgeInventory.textContent = stats.lowStockCount;
      badgeInventory.style.display = stats.lowStockCount > 0 ? 'inline-block' : 'none';
    }
  }

  // =========================================================================
  // 1. EXECUTIVE DASHBOARD RENDERER
  // =========================================================================
  function renderDashboard() {
    const stats = DB.getDashboardStats();

    // KPIs
    const elToday = document.getElementById('kpi-today-sales');
    if (elToday) elToday.textContent = fmtLKR(stats.todaySales);

    const elCol = document.getElementById('kpi-mtd-collections');
    if (elCol) elCol.textContent = fmtLKR(stats.collectionsMTD);

    const elCredit = document.getElementById('kpi-total-credit');
    if (elCredit) elCredit.textContent = fmtLKR(stats.totalOutstandingCredit);

    const elChqExp = document.getElementById('kpi-cheque-exposure');
    if (elChqExp) elChqExp.textContent = fmtLKR(stats.chequeExposureLKR);

    const elOverdue = document.getElementById('kpi-overdue-balance');
    if (elOverdue) elOverdue.textContent = fmtLKR(stats.overdueBalanceLKR);

    const elFleet = document.getElementById('kpi-fleet-status');
    if (elFleet) elFleet.textContent = `${stats.activeVansCount} Vans Active`;

    // Render Canvas Charts
    renderSalesTrendChart();
    renderRouteBarChart();

    // Recent Invoices Table
    const recentInvoices = DB.getInvoices().slice(0, 5);
    const tbody = document.getElementById('dash-recent-invoices-body');
    if (tbody) {
      tbody.innerHTML = recentInvoices.map(inv => `
        <tr>
          <td class="cell-bold">${inv.invoiceNo}</td>
          <td>${inv.customerName}</td>
          <td>${inv.date}</td>
          <td><span class="badge ${getPaymentBadgeClass(inv.paymentType)}">${inv.paymentType}</span></td>
          <td class="num cell-bold">${fmtLKR(inv.totalAmount)}</td>
          <td><span class="badge ${getStatusBadgeClass(inv.status)}">${inv.status}</span></td>
          <td>
            <button class="icon-btn btn-view-invoice" data-id="${inv.id}" title="View / Print Invoice">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
          </td>
        </tr>
      `).join('');

      tbody.querySelectorAll('.btn-view-invoice').forEach(btn => {
        btn.addEventListener('click', () => openInvoicePrintModal(btn.getAttribute('data-id')));
      });
    }
  }

  // Helper Badge Classes
  function getStatusBadgeClass(status) {
    switch (status) {
      case 'PAID':
      case 'ACTIVE':
      case 'CLEARED':
      case 'RECONCILED':
        return 'badge-paid';
      case 'PARTIAL':
      case 'IN_HAND':
      case 'ACTIVE_TRIP':
        return 'badge-partial';
      case 'OVERDUE':
      case 'ON_HOLD':
      case 'RETURNED':
      case 'BLOCKED':
        return 'badge-overdue';
      case 'UNPAID':
      case 'DEPOSITED':
        return 'badge-unpaid';
      default:
        return 'badge-neutral';
    }
  }

  function getPaymentBadgeClass(type) {
    if (type === 'CASH') return 'badge-paid';
    if (type === 'CHEQUE') return 'badge-partial';
    if (type === 'CREDIT') return 'badge-unpaid';
    return 'badge-neutral';
  }

  // Crisp Canvas Chart 1: 7-Day Sales vs Collections Trend
  function renderSalesTrendChart() {
    const canvas = document.getElementById('chart-sales-trend');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const days = ['16 Oct', '17 Oct', '18 Oct', '19 Oct', '20 Oct', '21 Oct', 'Today'];
    const salesData = [480000, 520000, 430360, 766674, 590000, 680000, 782000];
    const colData =   [320000, 410000, 450000, 300000, 520000, 640000, 485000];

    const padding = { top: 30, right: 30, bottom: 40, left: 65 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;
    const maxVal = 900000;

    // Grid Lines & Y-Axis Labels
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      const val = maxVal - (maxVal / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
      ctx.fillText((val / 1000) + 'k', padding.left - 8, y + 4);
    }

    // Draw Bars for Sales
    const barWidth = (chartW / days.length) * 0.35;
    const groupWidth = chartW / days.length;

    for (let i = 0; i < days.length; i++) {
      const xGroup = padding.left + i * groupWidth + groupWidth / 2;

      // Sales Bar (Sapphire)
      const salesH = (salesData[i] / maxVal) * chartH;
      const xSales = xGroup - barWidth - 2;
      const ySales = padding.top + chartH - salesH;

      ctx.fillStyle = '#2563eb';
      roundRect(ctx, xSales, ySales, barWidth, salesH, 3);
      ctx.fill();

      // Collection Bar (Emerald)
      const colH = (colData[i] / maxVal) * chartH;
      const xCol = xGroup + 2;
      const yCol = padding.top + chartH - colH;

      ctx.fillStyle = '#059669';
      roundRect(ctx, xCol, yCol, barWidth, colH, 3);
      ctx.fill();

      // X-Axis Date Label
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText(days[i], xGroup, h - 14);
    }
  }

  // Crisp Canvas Chart 2: Route Performance Horizontal Bars
  function renderRouteBarChart() {
    const canvas = document.getElementById('chart-route-performance');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const routes = DB.getRoutes();
    const padding = { top: 20, right: 30, bottom: 20, left: 110 };
    const chartW = w - padding.left - padding.right;
    const barSpacing = (h - padding.top - padding.bottom) / routes.length;
    const barH = 18;

    routes.forEach((rt, idx) => {
      const y = padding.top + idx * barSpacing + 10;
      const rep = DB.getSalesReps().find(r => r.id === rt.repId) || {};
      const salesAchieved = rep.mtdSales || 1100000;
      const target = rt.targetLKR || 1800000;
      const pct = Math.min(100, Math.round((salesAchieved / target) * 100));

      // Route Label
      ctx.fillStyle = '#0f172a';
      ctx.font = '600 11px Inter, sans-serif';
      ctx.textAlign = 'right';
      const shortName = rt.name.split(':')[0];
      ctx.fillText(shortName, padding.left - 10, y + 13);

      // Background Track
      ctx.fillStyle = '#f1f5f9';
      roundRect(ctx, padding.left, y, chartW, barH, 4);
      ctx.fill();

      // Progress Fill
      const fillW = (pct / 100) * chartW;
      ctx.fillStyle = idx === 0 ? '#1e40af' : idx === 1 ? '#059669' : idx === 2 ? '#d97706' : '#7c3aed';
      roundRect(ctx, padding.left, y, fillW, barH, 4);
      ctx.fill();

      // % Text inside or beside bar
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 10px Inter, sans-serif';
      ctx.textAlign = 'right';
      if (fillW > 40) {
        ctx.fillText(pct + '%', padding.left + fillW - 8, y + 13);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'left';
        ctx.fillText(pct + '%', padding.left + fillW + 6, y + 13);
      }
    });
  }

  function roundRect(ctx, x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }

  // =========================================================================
  // 2. CUSTOMERS & OUTLETS MODULE
  // =========================================================================
  function renderCustomers() {
    const customers = DB.getCustomers();
    const searchVal = (document.getElementById('cust-search-input')?.value || '').toLowerCase();
    const filterTerritory = document.getElementById('cust-filter-territory')?.value || 'ALL';

    const filtered = customers.filter(c => {
      const matchSearch = c.outletName.toLowerCase().includes(searchVal) ||
                          c.contactPerson.toLowerCase().includes(searchVal) ||
                          c.address.toLowerCase().includes(searchVal);
      const matchTerritory = filterTerritory === 'ALL' || c.territory === filterTerritory;
      return matchSearch && matchTerritory;
    });

    const tbody = document.getElementById('customers-table-body');
    if (!tbody) return;

    tbody.innerHTML = filtered.map(c => {
      const utilPct = Math.min(100, Math.round((c.currentBalance / c.creditLimit) * 100));
      const availCredit = Math.max(0, c.creditLimit - c.currentBalance);
      const barClass = utilPct > 85 ? 'util-danger' : utilPct > 60 ? 'util-warning' : 'util-safe';

      return `
        <tr>
          <td>
            <span class="cell-bold">${c.outletName}</span>
            <span class="cell-sub">${c.tradeName} • ${c.category}</span>
          </td>
          <td>
            <span>${c.contactPerson}</span>
            <span class="cell-sub">${c.phone}</span>
          </td>
          <td>
            <span>${c.territory}</span>
            <span class="cell-sub">${c.address.substring(0, 32)}...</span>
          </td>
          <td class="num">${fmtLKR(c.creditLimit)}</td>
          <td class="num cell-bold">${fmtLKR(c.currentBalance)}</td>
          <td class="num">${fmtLKR(availCredit)}</td>
          <td>
            <div style="display:flex; align-items:center; gap:8px;">
              <span>${utilPct}%</span>
              <div class="util-bar-wrap">
                <div class="util-bar-fill ${barClass}" style="width: ${utilPct}%;"></div>
              </div>
            </div>
          </td>
          <td>${c.creditPeriodDays} Days</td>
          <td><span class="badge ${getStatusBadgeClass(c.creditStatus)}">${c.creditStatus}</span></td>
          <td>
            <div class="action-btn-group">
              <button class="icon-btn btn-view-statement" data-id="${c.id}" title="Customer Account Ledger">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </button>
              <button class="icon-btn btn-toggle-hold" data-id="${c.id}" title="${c.creditStatus === 'ACTIVE' ? 'Place on Credit Hold' : 'Release Credit Hold'}">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach row events
    tbody.querySelectorAll('.btn-view-statement').forEach(btn => {
      btn.addEventListener('click', () => openCustomerStatementModal(btn.getAttribute('data-id')));
    });

    tbody.querySelectorAll('.btn-toggle-hold').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const cust = DB.toggleCreditHold(id, 'Credit Controller assessment');
        showToast(`Customer ${cust.outletName} status updated to ${cust.creditStatus}`);
      });
    });
  }

  // =========================================================================
  // 3. SALES & BILLING MODULE
  // =========================================================================
  function renderSales() {
    const invoices = DB.getInvoices();
    const searchVal = (document.getElementById('sales-search-input')?.value || '').toLowerCase();
    const filterStatus = document.getElementById('sales-filter-status')?.value || 'ALL';

    const filtered = invoices.filter(inv => {
      const matchSearch = inv.invoiceNo.toLowerCase().includes(searchVal) ||
                          inv.customerName.toLowerCase().includes(searchVal);
      const matchStatus = filterStatus === 'ALL' || inv.status === filterStatus;
      return matchSearch && matchStatus;
    });

    const tbody = document.getElementById('sales-table-body');
    if (!tbody) return;

    tbody.innerHTML = filtered.map(inv => `
      <tr>
        <td class="cell-bold">${inv.invoiceNo}</td>
        <td>
          <span class="cell-bold">${inv.customerName}</span>
          <span class="cell-sub">${inv.items.length} line items</span>
        </td>
        <td>${inv.date}</td>
        <td>${inv.dueDate}</td>
        <td>${inv.warehouseId}</td>
        <td><span class="badge ${getPaymentBadgeClass(inv.paymentType)}">${inv.paymentType}</span></td>
        <td class="num cell-bold">${fmtLKR(inv.totalAmount)}</td>
        <td class="num">${fmtLKR(inv.paidAmount)}</td>
        <td class="num ${inv.balanceDue > 0 ? 'cell-bold' : ''}" style="${inv.balanceDue > 0 ? 'color:var(--rose);' : ''}">${fmtLKR(inv.balanceDue)}</td>
        <td><span class="badge ${getStatusBadgeClass(inv.status)}">${inv.status}</span></td>
        <td>
          <div class="action-btn-group">
            <button class="icon-btn btn-view-invoice" data-id="${inv.id}" title="Print / View Invoice">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.btn-view-invoice').forEach(btn => {
      btn.addEventListener('click', () => openInvoicePrintModal(btn.getAttribute('data-id')));
    });
  }

  // =========================================================================
  // 4. CHEQUE & COLLECTION MANAGEMENT MODULE
  // =========================================================================
  function renderCheques() {
    const cheques = DB.getCheques();
    const searchVal = (document.getElementById('chq-search-input')?.value || '').toLowerCase();
    const filterStatus = document.getElementById('chq-filter-status')?.value || 'ALL';

    const filtered = cheques.filter(c => {
      const matchSearch = c.chequeNumber.toLowerCase().includes(searchVal) ||
                          c.customerName.toLowerCase().includes(searchVal) ||
                          c.bankName.toLowerCase().includes(searchVal);
      const matchStatus = filterStatus === 'ALL' || c.status === filterStatus;
      return matchSearch && matchStatus;
    });

    const tbody = document.getElementById('cheques-table-body');
    if (!tbody) return;

    tbody.innerHTML = filtered.map(c => `
      <tr>
        <td class="cell-bold font-mono">#${c.chequeNumber}</td>
        <td>
          <span class="cell-bold">${c.bankName}</span>
          <span class="cell-sub">${c.branch}</span>
        </td>
        <td>${c.customerName}</td>
        <td class="num cell-bold">${fmtLKR(c.amount)}</td>
        <td>${c.chequeDate}</td>
        <td>${c.depositDate || '—'}</td>
        <td><span class="badge ${getStatusBadgeClass(c.status)}">${c.status}</span></td>
        <td>
          <div class="action-btn-group">
            ${c.status === 'IN_HAND' ? `
              <button class="btn btn-sm btn-secondary btn-deposit-chq" data-id="${c.id}">Deposit</button>
            ` : ''}
            ${c.status === 'DEPOSITED' ? `
              <button class="btn btn-sm btn-emerald btn-clear-chq" data-id="${c.id}">Clear</button>
              <button class="btn btn-sm btn-danger btn-return-chq" data-id="${c.id}">Return</button>
            ` : ''}
            ${c.status === 'CLEARED' ? `
              <span style="font-size:11px; color:var(--emerald); font-weight:600;">✓ Realized</span>
            ` : ''}
            ${c.status === 'RETURNED' ? `
              <span style="font-size:11px; color:var(--rose); font-weight:600;">⚠️ ${c.returnReason || 'Bounced'}</span>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');

    // Attach actions
    tbody.querySelectorAll('.btn-deposit-chq').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        DB.updateChequeStatus(id, 'DEPOSITED');
        showToast('Cheque submitted for deposit & clearing.');
      });
    });

    tbody.querySelectorAll('.btn-clear-chq').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        DB.updateChequeStatus(id, 'CLEARED');
        showToast('Cheque cleared! Funds realized to corporate bank account.');
      });
    });

    tbody.querySelectorAll('.btn-return-chq').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const reason = prompt('Enter Cheque Return Reason:', 'Refer to Drawer (Insufficient Funds)');
        if (reason) {
          DB.updateChequeStatus(id, 'RETURNED', { returnReason: reason });
          showToast('Cheque marked as RETURNED. Customer ledger re-debited and credit put on hold.', 'error');
        }
      });
    });
  }

  // =========================================================================
  // 5. CREDIT CONTROL MODULE
  // =========================================================================
  function renderCreditControl() {
    const customers = DB.getCustomers();
    const stats = DB.getDashboardStats();

    // Summary aging indicators
    const elOverdueTotal = document.getElementById('credit-overdue-total');
    if (elOverdueTotal) elOverdueTotal.textContent = fmtLKR(stats.overdueBalanceLKR);

    const tbody = document.getElementById('credit-control-table-body');
    if (!tbody) return;

    tbody.innerHTML = customers.map(c => {
      const utilPct = Math.min(100, Math.round((c.currentBalance / c.creditLimit) * 100));
      const barClass = utilPct > 85 ? 'util-danger' : utilPct > 60 ? 'util-warning' : 'util-safe';
      const isOverdue = c.id === 'CUST-108'; // In our synthetic seed, CUST-108 has overdue debt
      const overdueAmt = isOverdue ? 308400 : 0;

      return `
        <tr>
          <td>
            <span class="cell-bold">${c.outletName}</span>
            <span class="cell-sub">${c.category} • ${c.territory}</span>
          </td>
          <td class="num">${fmtLKR(c.creditLimit)}</td>
          <td class="num cell-bold">${fmtLKR(c.currentBalance)}</td>
          <td>
            <div style="display:flex; align-items:center; gap:8px;">
              <span>${utilPct}%</span>
              <div class="util-bar-wrap">
                <div class="util-bar-fill ${barClass}" style="width: ${utilPct}%;"></div>
              </div>
            </div>
          </td>
          <td class="num" style="${overdueAmt > 0 ? 'color:var(--rose); font-weight:700;' : ''}">
            ${overdueAmt > 0 ? fmtLKR(overdueAmt) : 'LKR 0.00'}
          </td>
          <td>${c.creditPeriodDays} Days</td>
          <td><span class="badge ${getStatusBadgeClass(c.creditStatus)}">${c.creditStatus}</span></td>
          <td>
            <div class="action-btn-group">
              <button class="btn btn-sm ${c.creditStatus === 'ACTIVE' ? 'btn-danger' : 'btn-emerald'} btn-toggle-hold" data-id="${c.id}">
                ${c.creditStatus === 'ACTIVE' ? 'Hold' : 'Release'}
              </button>
              <button class="btn btn-sm btn-secondary btn-view-statement" data-id="${c.id}">Ledger</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-toggle-hold').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const cust = DB.toggleCreditHold(id, 'Credit Controller review');
        showToast(`Customer ${cust.outletName} credit status set to ${cust.creditStatus}`);
      });
    });

    tbody.querySelectorAll('.btn-view-statement').forEach(btn => {
      btn.addEventListener('click', () => openCustomerStatementModal(btn.getAttribute('data-id')));
    });
  }

  // =========================================================================
  // 6. INVENTORY & WAREHOUSING MODULE
  // =========================================================================
  function renderInventory() {
    const products = DB.getProducts();
    const searchVal = (document.getElementById('inv-search-input')?.value || '').toLowerCase();
    const filterCat = document.getElementById('inv-filter-cat')?.value || 'ALL';

    const filtered = products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchVal) ||
                          p.code.toLowerCase().includes(searchVal);
      const matchCat = filterCat === 'ALL' || p.category === filterCat;
      return matchSearch && matchCat;
    });

    const tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;

    tbody.innerHTML = filtered.map(p => {
      const centralHub = p.stock['WH-01'] || 0;
      const southDepot = p.stock['WH-02'] || 0;
      const van1 = p.stock['VAN-01'] || 0;
      const van2 = p.stock['VAN-02'] || 0;
      const van3 = p.stock['VAN-03'] || 0;
      const totalStock = centralHub + southDepot + van1 + van2 + van3;
      const isLow = totalStock <= p.reorderLevel;

      return `
        <tr>
          <td>
            <span class="cell-bold">${p.name}</span>
            <span class="cell-sub">${p.code} • ${p.packaging}</span>
          </td>
          <td>${p.category}</td>
          <td class="num">${fmtNum(centralHub)}</td>
          <td class="num">${fmtNum(southDepot)}</td>
          <td class="num">${fmtNum(van1)}</td>
          <td class="num">${fmtNum(van2)}</td>
          <td class="num">${fmtNum(van3)}</td>
          <td class="num cell-bold" style="${isLow ? 'color:var(--rose);' : ''}">${fmtNum(totalStock)}</td>
          <td class="num">${fmtLKR(p.caseWholesalePrice)}</td>
          <td>
            ${isLow 
              ? '<span class="badge badge-overdue">Low Stock</span>' 
              : '<span class="badge badge-paid">Optimal</span>'}
          </td>
          <td>
            <button class="btn btn-sm btn-secondary btn-open-transfer" data-id="${p.id}">Transfer to Van</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-open-transfer').forEach(btn => {
      btn.addEventListener('click', () => {
        openTransferStockModal(btn.getAttribute('data-id'));
      });
    });
  }

  // =========================================================================
  // 7. ROUTE & VAN SALES MANAGEMENT MODULE
  // =========================================================================
  function renderRoutes() {
    const routes = DB.getRoutes();
    const loadingSheets = DB.getLoadingSheets();

    // Render Routes Cards / Table
    const routeContainer = document.getElementById('routes-cards-grid');
    if (routeContainer) {
      routeContainer.innerHTML = routes.map(rt => {
        const van = DB.getWarehouses().find(w => w.id === rt.vehicleId);
        const rep = DB.getSalesReps().find(r => r.id === rt.repId) || {};
        return `
          <div class="card" style="padding:16px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
              <div>
                <span class="cell-bold" style="font-size:15px;">${rt.name}</span>
                <span class="cell-sub">${rt.coverage}</span>
              </div>
              <span class="badge badge-paid">${rt.frequency}</span>
            </div>
            <div style="margin:12px 0; font-size:12px; color:var(--text-secondary); display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <div><strong>Van:</strong> ${van ? van.vehicleNo : 'Direct Depot'}</div>
              <div><strong>Rep:</strong> ${rep.name || 'Unassigned'}</div>
              <div><strong>Outlets:</strong> ${rt.activeOutlets} stores</div>
              <div><strong>Target:</strong> ${fmtLKR(rt.targetLKR)}</div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Loading Sheets Table
    const tbody = document.getElementById('loading-sheets-table-body');
    if (tbody) {
      tbody.innerHTML = loadingSheets.map(s => `
        <tr>
          <td class="cell-bold">${s.sheetNo}</td>
          <td>${s.date}</td>
          <td>${s.vanId}</td>
          <td>${(DB.getSalesReps().find(r => r.id === s.repId) || {}).name || s.repId}</td>
          <td>${s.driver}</td>
          <td class="num">${s.loadedItems.reduce((acc, i) => acc + i.loadedCases, 0)} Cases</td>
          <td class="num cell-bold">${fmtLKR(s.cashCollected)}</td>
          <td class="num cell-bold">${fmtLKR(s.chequesCollected)}</td>
          <td><span class="badge ${getStatusBadgeClass(s.status)}">${s.status}</span></td>
          <td>
            ${s.status === 'ACTIVE_TRIP' ? `
              <button class="btn btn-sm btn-emerald btn-reconcile-van" data-id="${s.id}">EOD Reconcile</button>
            ` : `
              <span style="font-size:11px; color:var(--emerald); font-weight:600;">✓ Reconciled by ${s.reconciledBy || 'Supervisor'}</span>
            `}
          </td>
        </tr>
      `).join('');

      tbody.querySelectorAll('.btn-reconcile-van').forEach(btn => {
        btn.addEventListener('click', () => {
          openVanReconcileModal(btn.getAttribute('data-id'));
        });
      });
    }
  }

  // =========================================================================
  // 8. SUPPLIERS & PURCHASING MODULE
  // =========================================================================
  function renderSuppliers() {
    const suppliers = DB.getSuppliers();
    const tbody = document.getElementById('suppliers-table-body');
    if (!tbody) return;

    tbody.innerHTML = suppliers.map(s => `
      <tr>
        <td class="cell-bold">${s.name}</td>
        <td>${s.category}</td>
        <td>
          <span>${s.contact}</span>
          <span class="cell-sub">${s.phone} • ${s.email}</span>
        </td>
        <td>${s.address}</td>
        <td>${s.terms}</td>
        <td class="num cell-bold">${fmtLKR(s.balancePayable)}</td>
        <td>
          <button class="btn btn-sm btn-primary btn-receive-po" data-id="${s.id}">Receive Goods (GRN)</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.btn-receive-po').forEach(btn => {
      btn.addEventListener('click', () => {
        openReceivePOModal(btn.getAttribute('data-id'));
      });
    });
  }

  // =========================================================================
  // 9. PRICING & PROMOTIONS MODULE
  // =========================================================================
  function renderPricing() {
    const promos = DB.getPromotions();
    const tbody = document.getElementById('promotions-table-body');
    if (!tbody) return;

    tbody.innerHTML = promos.map(p => `
      <tr>
        <td class="cell-bold">${p.name}</td>
        <td>${p.code}</td>
        <td>${p.category}</td>
        <td><span class="badge badge-info">${p.type}</span></td>
        <td>${p.validTill}</td>
        <td><span class="badge badge-paid">${p.status}</span></td>
      </tr>
    `).join('');
  }

  // =========================================================================
  // 10. SALES REPRESENTATIVES MODULE
  // =========================================================================
  function renderSalesReps() {
    const reps = DB.getSalesReps();
    const tbody = document.getElementById('reps-table-body');
    if (!tbody) return;

    tbody.innerHTML = reps.map(r => {
      const pct = Math.min(100, Math.round((r.mtdSales / r.monthlyTarget) * 100));
      return `
        <tr>
          <td>
            <span class="cell-bold">${r.name}</span>
            <span class="cell-sub">${r.code} • ${r.phone}</span>
          </td>
          <td>${r.routeId}</td>
          <td>${r.vanId || 'Direct / Key Accounts'}</td>
          <td class="num">${fmtLKR(r.monthlyTarget)}</td>
          <td class="num cell-bold">${fmtLKR(r.mtdSales)}</td>
          <td>
            <div style="display:flex; align-items:center; gap:8px;">
              <span>${pct}%</span>
              <div class="util-bar-wrap">
                <div class="util-bar-fill ${pct >= 80 ? 'util-safe' : 'util-warning'}" style="width: ${pct}%;"></div>
              </div>
            </div>
          </td>
          <td class="num">${fmtLKR(r.mtdCollections)}</td>
          <td><span class="badge badge-paid">${r.status}</span></td>
        </tr>
      `;
    }).join('');
  }

  // =========================================================================
  // 11. RETURNS MANAGEMENT MODULE
  // =========================================================================
  function renderReturns() {
    const returns = DB.getReturns();
    const tbody = document.getElementById('returns-table-body');
    if (!tbody) return;

    tbody.innerHTML = returns.map(ret => `
      <tr>
        <td class="cell-bold font-mono">${ret.creditNoteNo}</td>
        <td>${ret.date}</td>
        <td>${ret.customerName}</td>
        <td>
          <span class="cell-bold">${ret.productName}</span>
          <span class="cell-sub">${ret.qty} cases returned</span>
        </td>
        <td>${ret.reason}</td>
        <td class="num cell-bold">${fmtLKR(ret.totalCredit)}</td>
        <td><span class="badge badge-paid">${ret.actionTaken}</span></td>
      </tr>
    `).join('');
  }

  // =========================================================================
  // 12. HR & PAYROLL MODULE
  // =========================================================================
  function renderHR() {
    const emps = DB.getEmployees();
    const tbody = document.getElementById('hr-table-body');
    if (!tbody) return;

    tbody.innerHTML = emps.map(e => `
      <tr>
        <td class="cell-bold">${e.name}</td>
        <td>${e.role}</td>
        <td>${e.department}</td>
        <td class="num">${fmtLKR(e.baseSalary)}</td>
        <td class="num" style="color:var(--emerald); font-weight:600;">+ ${fmtLKR(e.commissionEarned)}</td>
        <td class="num">+ ${fmtLKR(e.allowances)}</td>
        <td class="num" style="color:var(--rose);">- ${fmtLKR(e.epfDeduction)}</td>
        <td class="num cell-bold">${fmtLKR(e.netSalary)}</td>
      </tr>
    `).join('');
  }

  // =========================================================================
  // 13. REPORTS & BUSINESS INTELLIGENCE MODULE
  // =========================================================================
  function renderReports() {
    const reportType = document.getElementById('report-type-select')?.value || 'SALES_SUMMARY';
    const container = document.getElementById('report-output-container');
    if (!container) return;

    if (reportType === 'SALES_SUMMARY') {
      const invoices = DB.getInvoices();
      const totalRev = invoices.reduce((s, i) => s + i.totalAmount, 0);
      container.innerHTML = `
        <div style="margin-bottom:16px;">
          <h3 style="font-size:16px; font-weight:700;">Sales Summary by Invoice</h3>
          <p style="font-size:12px; color:var(--text-muted);">Period: October 2026 • Total Invoiced: <strong>${fmtLKR(totalRev)}</strong></p>
        </div>
        <table class="dms-table">
          <thead>
            <tr><th>Invoice #</th><th>Date</th><th>Customer</th><th>Payment</th><th class="num">Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${invoices.map(i => `
              <tr>
                <td class="cell-bold">${i.invoiceNo}</td>
                <td>${i.date}</td>
                <td>${i.customerName}</td>
                <td>${i.paymentType}</td>
                <td class="num cell-bold">${fmtLKR(i.totalAmount)}</td>
                <td><span class="badge ${getStatusBadgeClass(i.status)}">${i.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (reportType === 'DEBTORS_AGING') {
      const customers = DB.getCustomers();
      container.innerHTML = `
        <div style="margin-bottom:16px;">
          <h3 style="font-size:16px; font-weight:700;">Debtors Aging & Outstanding Credit Schedule</h3>
          <p style="font-size:12px; color:var(--text-muted);">Credit Exposure by Customer</p>
        </div>
        <table class="dms-table">
          <thead>
            <tr><th>Customer Name</th><th>Territory</th><th class="num">Credit Limit</th><th class="num">Balance Due</th><th>Terms</th><th>Credit Status</th></tr>
          </thead>
          <tbody>
            ${customers.map(c => `
              <tr>
                <td class="cell-bold">${c.outletName}</td>
                <td>${c.territory}</td>
                <td class="num">${fmtLKR(c.creditLimit)}</td>
                <td class="num cell-bold">${fmtLKR(c.currentBalance)}</td>
                <td>${c.creditPeriodDays} Days</td>
                <td><span class="badge ${getStatusBadgeClass(c.creditStatus)}">${c.creditStatus}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      const products = DB.getProducts();
      container.innerHTML = `
        <div style="margin-bottom:16px;">
          <h3 style="font-size:16px; font-weight:700;">Stock Valuation & Movements</h3>
          <p style="font-size:12px; color:var(--text-muted);">Wholesale Inventory Assets Valuation</p>
        </div>
        <table class="dms-table">
          <thead>
            <tr><th>Product</th><th>Category</th><th class="num">Central Hub</th><th class="num">Depot</th><th class="num">Wholesale Price</th><th class="num">Valuation</th></tr>
          </thead>
          <tbody>
            ${products.map(p => {
              const cases = (p.stock['WH-01'] || 0) + (p.stock['WH-02'] || 0);
              return `
                <tr>
                  <td class="cell-bold">${p.name}</td>
                  <td>${p.category}</td>
                  <td class="num">${p.stock['WH-01']}</td>
                  <td class="num">${p.stock['WH-02']}</td>
                  <td class="num">${fmtLKR(p.caseWholesalePrice)}</td>
                  <td class="num cell-bold">${fmtLKR(cases * p.caseWholesalePrice)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }
  }

  // =========================================================================
  // 14. ADMINISTRATION & AUDIT LOGS MODULE
  // =========================================================================
  function renderAdmin() {
    const logs = DB.getAuditLogs();
    const tbody = document.getElementById('audit-logs-table-body');
    if (!tbody) return;

    tbody.innerHTML = logs.map(l => `
      <tr>
        <td class="cell-sub font-mono">${l.timestamp}</td>
        <td class="cell-bold">${l.user}</td>
        <td><span class="badge badge-info">${l.action}</span></td>
        <td>${l.details}</td>
      </tr>
    `).join('');
  }

  // =========================================================================
  // MODAL WORKFLOWS
  // =========================================================================

  // Universal Modal Closer
  function setupModals() {
    document.querySelectorAll('.dms-modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
      const closeBtn = modal.querySelector('.modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('open'));
      }
    });

    // 1. "New Customer" Trigger
    document.getElementById('btn-open-new-customer')?.addEventListener('click', () => {
      document.getElementById('modal-new-customer')?.classList.add('open');
    });

    document.getElementById('form-new-customer')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const outletName = document.getElementById('nc-outlet-name').value;
      const tradeName = document.getElementById('nc-trade-name').value || outletName;
      const category = document.getElementById('nc-category').value;
      const contactPerson = document.getElementById('nc-contact').value;
      const phone = document.getElementById('nc-phone').value;
      const address = document.getElementById('nc-address').value;
      const territory = document.getElementById('nc-territory').value;
      const creditLimit = Number(document.getElementById('nc-credit-limit').value);
      const creditPeriodDays = Number(document.getElementById('nc-credit-period').value);

      DB.addCustomer({
        outletName, tradeName, category, contactPerson, phone, address, territory, creditLimit, creditPeriodDays
      });

      document.getElementById('modal-new-customer')?.classList.remove('open');
      e.target.reset();
      showToast(`Customer "${outletName}" created successfully!`);
    });

    // 2. "Create Invoice" Modal & Dynamic Line Items
    document.getElementById('btn-open-new-invoice')?.addEventListener('click', () => {
      openCreateInvoiceModal();
    });

    // 3. "Record Collection" Modal
    document.getElementById('btn-open-record-collection')?.addEventListener('click', () => {
      openRecordCollectionModal();
    });

    // 4. "Register Cheque" Modal
    document.getElementById('btn-open-register-cheque')?.addEventListener('click', () => {
      openRegisterChequeModal();
    });

    // 5. "New Sales Return" Modal
    document.getElementById('btn-open-new-return')?.addEventListener('click', () => {
      openNewReturnModal();
    });

    // 6. "Reset Demo Data" Trigger
    document.getElementById('btn-reset-demo-data')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset demo data? All modifications will revert to the original synthetic dataset.')) {
        DB.resetDemoData();
        showToast('Demo data reset to clean initial synthetic state.');
      }
    });

    // Table Filter Listeners
    document.getElementById('cust-search-input')?.addEventListener('input', renderCustomers);
    document.getElementById('cust-filter-territory')?.addEventListener('change', renderCustomers);
    
    document.getElementById('sales-search-input')?.addEventListener('input', renderSales);
    document.getElementById('sales-filter-status')?.addEventListener('change', renderSales);

    document.getElementById('chq-search-input')?.addEventListener('input', renderCheques);
    document.getElementById('chq-filter-status')?.addEventListener('change', renderCheques);

    document.getElementById('inv-search-input')?.addEventListener('input', renderInventory);
    document.getElementById('inv-filter-cat')?.addEventListener('change', renderInventory);

    document.getElementById('report-type-select')?.addEventListener('change', renderReports);
  }

  // --- Dynamic Invoice Creation Modal ---
  function openCreateInvoiceModal() {
    const modal = document.getElementById('modal-create-invoice');
    if (!modal) return;

    // Populate Customers
    const custSelect = document.getElementById('inv-select-customer');
    custSelect.innerHTML = DB.getCustomers().map(c => `
      <option value="${c.id}" ${c.creditStatus !== 'ACTIVE' ? 'disabled' : ''}>
        ${c.outletName} (${c.territory}) ${c.creditStatus !== 'ACTIVE' ? '[' + c.creditStatus + ']' : ''}
      </option>
    `).join('');

    // Populate Warehouses
    const whSelect = document.getElementById('inv-select-warehouse');
    whSelect.innerHTML = DB.getWarehouses().map(w => `
      <option value="${w.id}">${w.name} ${w.vehicleNo ? '(' + w.vehicleNo + ')' : ''}</option>
    `).join('');

    // Reset lines
    const lineItemsContainer = document.getElementById('invoice-lines-body');
    lineItemsContainer.innerHTML = '';
    addInvoiceLineItem();

    updateInvoiceCustomerCreditDisplay();
    custSelect.onchange = updateInvoiceCustomerCreditDisplay;
    whSelect.onchange = updateInvoiceLineStockDisplay;

    modal.classList.add('open');
  }

  function updateInvoiceCustomerCreditDisplay() {
    const custId = document.getElementById('inv-select-customer').value;
    const cust = DB.getCustomerById(custId);
    const box = document.getElementById('inv-customer-credit-pill');
    if (!cust || !box) return;

    const avail = Math.max(0, cust.creditLimit - cust.currentBalance);
    box.innerHTML = `
      <span>Credit Limit: <strong>${fmtLKR(cust.creditLimit)}</strong></span> |
      <span>Current Debt: <strong>${fmtLKR(cust.currentBalance)}</strong></span> |
      <span>Available Credit: <strong style="${avail < 50000 ? 'color:var(--rose);' : 'color:var(--emerald);'}">${fmtLKR(avail)}</strong></span>
    `;
  }

  function addInvoiceLineItem() {
    const tbody = document.getElementById('invoice-lines-body');
    const products = DB.getProducts();
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>
        <select class="line-product-select">
          ${products.map(p => `<option value="${p.id}" data-price="${p.caseWholesalePrice}">${p.name} (${fmtLKR(p.caseWholesalePrice)})</option>`).join('')}
        </select>
      </td>
      <td class="line-stock-indicator" style="font-size:11px; color:var(--text-muted); text-align:center;">—</td>
      <td>
        <input type="number" class="line-qty-input" min="1" value="1" style="width:70px; text-align:center;">
      </td>
      <td class="line-price-display num" style="padding-top:12px;">0.00</td>
      <td>
        <input type="number" class="line-disc-input" min="0" max="15" value="0" style="width:60px; text-align:center;">
      </td>
      <td class="line-total-display num cell-bold" style="padding-top:12px;">0.00</td>
      <td style="text-align:center;">
        <button type="button" class="btn-remove-line" style="background:none; border:none; color:var(--rose); cursor:pointer; font-size:16px;">✕</button>
      </td>
    `;

    tbody.appendChild(row);

    const prodSelect = row.querySelector('.line-product-select');
    const qtyInput = row.querySelector('.line-qty-input');
    const discInput = row.querySelector('.line-disc-input');
    const removeBtn = row.querySelector('.btn-remove-line');

    prodSelect.addEventListener('change', () => calculateInvoiceTotals());
    qtyInput.addEventListener('input', () => calculateInvoiceTotals());
    discInput.addEventListener('input', () => calculateInvoiceTotals());
    removeBtn.addEventListener('click', () => {
      if (tbody.querySelectorAll('tr').length > 1) {
        row.remove();
        calculateInvoiceTotals();
      } else {
        showToast('Invoice must have at least one line item', 'warning');
      }
    });

    calculateInvoiceTotals();
    updateInvoiceLineStockDisplay();
  }

  document.getElementById('btn-add-invoice-line')?.addEventListener('click', addInvoiceLineItem);

  function updateInvoiceLineStockDisplay() {
    const whId = document.getElementById('inv-select-warehouse').value;
    document.querySelectorAll('#invoice-lines-body tr').forEach(row => {
      const prodId = row.querySelector('.line-product-select').value;
      const prod = DB.getProductById(prodId);
      const stockCell = row.querySelector('.line-stock-indicator');
      if (prod && stockCell) {
        const available = prod.stock[whId] || 0;
        stockCell.innerHTML = `Avail: <strong>${available}</strong>`;
        if (available <= 0) {
          stockCell.style.color = 'var(--rose)';
        } else {
          stockCell.style.color = 'var(--text-muted)';
        }
      }
    });
  }

  function calculateInvoiceTotals() {
    let subtotal = 0;
    let totalDiscount = 0;

    document.querySelectorAll('#invoice-lines-body tr').forEach(row => {
      const prodSelect = row.querySelector('.line-product-select');
      const prod = DB.getProductById(prodSelect.value);
      const qty = Number(row.querySelector('.line-qty-input').value) || 0;
      const discPct = Number(row.querySelector('.line-disc-input').value) || 0;

      const price = prod ? prod.caseWholesalePrice : 0;
      const grossLine = qty * price;
      const discount = grossLine * (discPct / 100);
      const netLine = grossLine - discount;

      row.querySelector('.line-price-display').textContent = fmtLKR(price);
      row.querySelector('.line-total-display').textContent = fmtLKR(netLine);

      subtotal += grossLine;
      totalDiscount += discount;
    });

    const netPayable = subtotal - totalDiscount;

    document.getElementById('inv-subtotal-disp').textContent = fmtLKR(subtotal);
    document.getElementById('inv-discount-disp').textContent = fmtLKR(totalDiscount);
    document.getElementById('inv-net-disp').textContent = fmtLKR(netPayable);

    updateInvoiceLineStockDisplay();
  }

  // Handle Invoice Submission
  document.getElementById('form-create-invoice')?.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const customerId = document.getElementById('inv-select-customer').value;
      const warehouseId = document.getElementById('inv-select-warehouse').value;
      const paymentType = document.getElementById('inv-payment-type').value;

      const items = [];
      let subtotal = 0;
      let totalDiscount = 0;

      document.querySelectorAll('#invoice-lines-body tr').forEach(row => {
        const prodId = row.querySelector('.line-product-select').value;
        const prod = DB.getProductById(prodId);
        const qty = Number(row.querySelector('.line-qty-input').value) || 0;
        const discountPct = Number(row.querySelector('.line-disc-input').value) || 0;
        const unitPrice = prod.caseWholesalePrice;
        const gross = qty * unitPrice;
        const disc = gross * (discountPct / 100);

        items.push({
          productId: prodId,
          name: prod.name,
          packaging: prod.packaging,
          qty,
          unitPrice,
          discountPct,
          total: gross - disc
        });

        subtotal += gross;
        totalDiscount += disc;
      });

      const totalAmount = subtotal - totalDiscount;

      // Create invoice in DB
      const invoice = DB.createInvoice({
        customerId,
        warehouseId,
        paymentType,
        items,
        subtotal,
        discountAmount: totalDiscount,
        taxAmount: 0,
        totalAmount
      });

      document.getElementById('modal-create-invoice')?.classList.remove('open');
      showToast(`Invoice ${invoice.invoiceNo} successfully generated for ${fmtLKR(totalAmount)}!`);
      
      // Auto open print modal for preview
      openInvoicePrintModal(invoice.id);

    } catch (err) {
      alert(`Error creating invoice: ${err.message}`);
    }
  });

  // --- Invoice Printable Modal ---
  function openInvoicePrintModal(invoiceId) {
    const inv = DB.getInvoiceById(invoiceId);
    if (!inv) return;
    activeInvoicePrint = inv;

    const modal = document.getElementById('modal-print-invoice');
    if (!modal) return;

    const container = document.getElementById('invoice-print-content');
    container.innerHTML = `
      <div style="font-family: Inter, sans-serif; padding: 20px; color: #0f172a;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px;">
          <div>
            <h2 style="font-size:22px; font-weight:800; color:#1e40af; margin-bottom:4px;">PIXEL DISTRIBUTION SUITE</h2>
            <p style="font-size:12px; color:#475569; line-height:1.4;">
              Developed by Pixel by Maliya • Central Hub Kelaniya<br>
              VAT Reg: 100293847-7000 • Tel: +94 11 291 5000
            </p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:18px; font-weight:800; color:#0f172a;">TAX INVOICE</div>
            <div style="font-size:14px; font-weight:700; color:#1e40af;">${inv.invoiceNo}</div>
            <div style="font-size:12px; color:#64748b;">Date: ${inv.date}</div>
            <div style="font-size:12px; color:#64748b;">Due: ${inv.dueDate}</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom: 20px; font-size:12px;">
          <div style="background:#f8fafc; padding:12px; border-radius:6px; border:1px solid #e2e8f0;">
            <strong style="display:block; margin-bottom:4px; color:#475569; font-size:11px; text-transform:uppercase;">Billed To:</strong>
            <div style="font-size:14px; font-weight:700;">${inv.customerName}</div>
            <div>Source Warehouse: <strong>${inv.warehouseId}</strong></div>
            <div>Payment Term: <strong>${inv.paymentType}</strong></div>
          </div>
          <div style="background:#f8fafc; padding:12px; border-radius:6px; border:1px solid #e2e8f0;">
            <strong style="display:block; margin-bottom:4px; color:#475569; font-size:11px; text-transform:uppercase;">Sales Order Details:</strong>
            <div>Status: <span class="badge ${getStatusBadgeClass(inv.status)}">${inv.status}</span></div>
            <div>Rep: <strong>${(DB.getSalesReps().find(r => r.id === inv.repId) || {}).name || inv.repId}</strong></div>
            <div>Balance Due: <strong style="color:var(--rose);">${fmtLKR(inv.balanceDue)}</strong></div>
          </div>
        </div>

        <table style="width:100%; border-collapse:collapse; font-size:12px; margin-bottom:20px;">
          <thead>
            <tr style="background:#f1f5f9; border-bottom:1px solid #cbd5e1;">
              <th style="padding:8px 10px; text-align:left;">Item Description</th>
              <th style="padding:8px 10px; text-align:center;">Qty (Cases)</th>
              <th style="padding:8px 10px; text-align:right;">Wholesale Rate</th>
              <th style="padding:8px 10px; text-align:right;">Disc %</th>
              <th style="padding:8px 10px; text-align:right;">Net Total</th>
            </tr>
          </thead>
          <tbody>
            ${inv.items.map(it => `
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:8px 10px;">
                  <strong>${it.name}</strong><br>
                  <span style="font-size:10px; color:#64748b;">${it.packaging}</span>
                </td>
                <td style="padding:8px 10px; text-align:center;">${it.qty}</td>
                <td style="padding:8px 10px; text-align:right;">${fmtLKR(it.unitPrice)}</td>
                <td style="padding:8px 10px; text-align:right;">${it.discountPct}%</td>
                <td style="padding:8px 10px; text-align:right; font-weight:600;">${fmtLKR(it.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="display:flex; justify-content:flex-end;">
          <div style="width:280px; font-size:13px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span>Subtotal:</span>
              <span>${fmtLKR(inv.subtotal)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:4px; color:var(--emerald);">
              <span>Discounts:</span>
              <span>- ${fmtLKR(inv.discountAmount)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:16px; font-weight:800; border-top:2px solid #0f172a; padding-top:6px; margin-top:6px;">
              <span>Net Total:</span>
              <span>${fmtLKR(inv.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; margin-top:40px; padding-top:20px; border-top:1px dashed #cbd5e1; font-size:11px; text-align:center; color:#64748b;">
          <div>
            <div style="height:35px;"></div>
            <div style="border-top:1px solid #94a3b8; padding-top:4px;">Authorized Dispatch Officer</div>
          </div>
          <div>
            <div style="height:35px;"></div>
            <div style="border-top:1px solid #94a3b8; padding-top:4px;">Customer Outlet Acknowledgment & Stamp</div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('open');
  }

  document.getElementById('btn-trigger-print')?.addEventListener('click', () => {
    window.print();
  });

  // --- Customer Statement / Ledger Modal ---
  function openCustomerStatementModal(customerId) {
    const cust = DB.getCustomerById(customerId);
    if (!cust) return;

    const modal = document.getElementById('modal-customer-statement');
    if (!modal) return;

    const invoices = DB.getInvoices().filter(i => i.customerId === customerId);
    const collections = DB.getCollections().filter(c => c.customerId === customerId);
    const cheques = DB.getCheques().filter(c => c.customerId === customerId);

    const titleEl = document.getElementById('stmt-customer-title');
    titleEl.textContent = `${cust.outletName} — Account Ledger & Statement`;

    const summaryEl = document.getElementById('stmt-summary-strip');
    summaryEl.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px; margin-bottom:16px; background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #e2e8f0; font-size:12px;">
        <div>Credit Limit: <strong>${fmtLKR(cust.creditLimit)}</strong></div>
        <div>Current Debt: <strong style="color:var(--rose);">${fmtLKR(cust.currentBalance)}</strong></div>
        <div>Payment Term: <strong>${cust.creditPeriodDays} Days</strong></div>
        <div>Credit Status: <span class="badge ${getStatusBadgeClass(cust.creditStatus)}">${cust.creditStatus}</span></div>
      </div>
    `;

    const bodyEl = document.getElementById('stmt-transactions-body');
    bodyEl.innerHTML = `
      <h4 style="font-size:13px; font-weight:700; margin-bottom:8px;">Sales Invoices</h4>
      <table class="dms-table" style="margin-bottom:20px;">
        <thead>
          <tr><th>Invoice #</th><th>Date</th><th>Terms</th><th class="num">Amount</th><th class="num">Balance Due</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${invoices.map(i => `
            <tr>
              <td class="cell-bold">${i.invoiceNo}</td>
              <td>${i.date}</td>
              <td>${i.paymentType}</td>
              <td class="num cell-bold">${fmtLKR(i.totalAmount)}</td>
              <td class="num" style="color:var(--rose);">${fmtLKR(i.balanceDue)}</td>
              <td><span class="badge ${getStatusBadgeClass(i.status)}">${i.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h4 style="font-size:13px; font-weight:700; margin-bottom:8px;">Collections & Cheque Settlements</h4>
      <table class="dms-table">
        <thead>
          <tr><th>Ref / Cheque #</th><th>Date</th><th>Mode / Bank</th><th class="num">Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${collections.map(c => `
            <tr>
              <td class="cell-bold">${c.receiptNo}</td>
              <td>${c.date}</td>
              <td>${c.paymentMode}</td>
              <td class="num cell-bold" style="color:var(--emerald);">${fmtLKR(c.amount)}</td>
              <td><span class="badge badge-paid">Settled</span></td>
            </tr>
          `).join('')}
          ${cheques.map(ch => `
            <tr>
              <td class="cell-bold font-mono">#${ch.chequeNumber}</td>
              <td>${ch.chequeDate}</td>
              <td>${ch.bankName}</td>
              <td class="num cell-bold">${fmtLKR(ch.amount)}</td>
              <td><span class="badge ${getStatusBadgeClass(ch.status)}">${ch.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    modal.classList.add('open');
  }

  // --- Record Collection Modal ---
  function openRecordCollectionModal() {
    const modal = document.getElementById('modal-record-collection');
    if (!modal) return;

    const custSelect = document.getElementById('col-select-customer');
    custSelect.innerHTML = DB.getCustomers().map(c => `
      <option value="${c.id}">${c.outletName} (Debt: ${fmtLKR(c.currentBalance)})</option>
    `).join('');

    const repSelect = document.getElementById('col-select-rep');
    repSelect.innerHTML = DB.getSalesReps().map(r => `
      <option value="${r.id}">${r.name} (${r.routeId})</option>
    `).join('');

    modal.classList.add('open');
  }

  document.getElementById('form-record-collection')?.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const customerId = document.getElementById('col-select-customer').value;
      const repId = document.getElementById('col-select-rep').value;
      const amount = Number(document.getElementById('col-amount').value);
      const paymentMode = document.getElementById('col-mode').value;
      const notes = document.getElementById('col-notes').value;

      const rec = DB.recordCollection({
        customerId, repId, amount, paymentMode, notes
      });

      document.getElementById('modal-record-collection')?.classList.remove('open');
      e.target.reset();
      showToast(`Collection receipt ${rec.receiptNo} of ${fmtLKR(amount)} recorded! Customer balance updated.`);
    } catch (err) {
      alert(err.message);
    }
  });

  // --- Register Cheque Modal ---
  function openRegisterChequeModal() {
    const modal = document.getElementById('modal-register-cheque');
    if (!modal) return;

    const custSelect = document.getElementById('reg-chq-customer');
    custSelect.innerHTML = DB.getCustomers().map(c => `
      <option value="${c.id}">${c.outletName}</option>
    `).join('');

    const repSelect = document.getElementById('reg-chq-rep');
    repSelect.innerHTML = DB.getSalesReps().map(r => `
      <option value="${r.id}">${r.name}</option>
    `).join('');

    modal.classList.add('open');
  }

  document.getElementById('form-register-cheque')?.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const chequeNumber = document.getElementById('reg-chq-num').value;
      const bankName = document.getElementById('reg-chq-bank').value;
      const branch = document.getElementById('reg-chq-branch').value;
      const customerId = document.getElementById('reg-chq-customer').value;
      const repId = document.getElementById('reg-chq-rep').value;
      const amount = Number(document.getElementById('reg-chq-amount').value);
      const chequeDate = document.getElementById('reg-chq-date').value;
      const notes = document.getElementById('reg-chq-notes').value;

      DB.addCheque({
        chequeNumber, bankName, branch, customerId, repId, amount, chequeDate, notes
      });

      document.getElementById('modal-register-cheque')?.classList.remove('open');
      e.target.reset();
      showToast(`Cheque #${chequeNumber} registered in portfolio!`);
    } catch (err) {
      alert(err.message);
    }
  });

  // --- Stock Transfer to Van Modal ---
  function openTransferStockModal(productId) {
    const modal = document.getElementById('modal-transfer-stock');
    if (!modal) return;

    const prodSelect = document.getElementById('trf-select-product');
    prodSelect.innerHTML = DB.getProducts().map(p => `
      <option value="${p.id}" ${p.id === productId ? 'selected' : ''}>${p.name}</option>
    `).join('');

    const fromSelect = document.getElementById('trf-from-loc');
    fromSelect.innerHTML = DB.getWarehouses().filter(w => w.type !== 'MOBILE_VAN').map(w => `
      <option value="${w.id}">${w.name}</option>
    `).join('');

    const toSelect = document.getElementById('trf-to-loc');
    toSelect.innerHTML = DB.getWarehouses().filter(w => w.type === 'MOBILE_VAN').map(w => `
      <option value="${w.id}">${w.name} (${w.vehicleNo})</option>
    `).join('');

    modal.classList.add('open');
  }

  document.getElementById('form-transfer-stock')?.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const productId = document.getElementById('trf-select-product').value;
      const fromLoc = document.getElementById('trf-from-loc').value;
      const toLoc = document.getElementById('trf-to-loc').value;
      const qty = Number(document.getElementById('trf-qty').value);
      const notes = document.getElementById('trf-notes').value;

      DB.transferStock(productId, fromLoc, toLoc, qty, notes);

      document.getElementById('modal-transfer-stock')?.classList.remove('open');
      e.target.reset();
      showToast(`Transferred ${qty} cases successfully to ${toLoc}!`);
    } catch (err) {
      alert(err.message);
    }
  });

  // --- Van End-of-Day Reconciliation Modal ---
  function openVanReconcileModal(sheetId) {
    const sheet = DB.getLoadingSheets().find(s => s.id === sheetId);
    if (!sheet) return;

    const modal = document.getElementById('modal-van-reconcile');
    if (!modal) return;

    document.getElementById('eod-sheet-no').textContent = sheet.sheetNo;
    document.getElementById('eod-van-name').textContent = `${sheet.vanId} (${sheet.driver})`;
    document.getElementById('eod-expected-cash').textContent = fmtLKR(sheet.cashCollected);
    document.getElementById('eod-expected-cheques').textContent = fmtLKR(sheet.chequesCollected);

    document.getElementById('eod-actual-cash').value = sheet.cashCollected;
    document.getElementById('eod-actual-cheques').value = sheet.chequesCollected;

    document.getElementById('form-van-reconcile').onsubmit = (e) => {
      e.preventDefault();
      const actualCash = Number(document.getElementById('eod-actual-cash').value);
      const actualCheques = Number(document.getElementById('eod-actual-cheques').value);
      const supervisor = document.getElementById('eod-supervisor').value || 'Dispatch Supervisor';
      const variance = (actualCash + actualCheques) - (sheet.cashCollected + sheet.chequesCollected);

      DB.reconcileVanTrip(sheetId, {
        physicalCashHandover: actualCash,
        chequesHandover: actualCheques,
        supervisorName: supervisor,
        varianceLKR: variance
      });

      modal.classList.remove('open');
      showToast(`Loading sheet ${sheet.sheetNo} reconciled and closed successfully!`);
    };

    modal.classList.add('open');
  }

  // --- Sales Return & Credit Note Modal ---
  function openNewReturnModal() {
    const modal = document.getElementById('modal-new-return');
    if (!modal) return;

    const custSelect = document.getElementById('ret-customer');
    custSelect.innerHTML = DB.getCustomers().map(c => `
      <option value="${c.id}">${c.outletName}</option>
    `).join('');

    const prodSelect = document.getElementById('ret-product');
    prodSelect.innerHTML = DB.getProducts().map(p => `
      <option value="${p.id}">${p.name} (${fmtLKR(p.caseWholesalePrice)})</option>
    `).join('');

    modal.classList.add('open');
  }

  document.getElementById('form-new-return')?.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const customerId = document.getElementById('ret-customer').value;
      const productId = document.getElementById('ret-product').value;
      const qty = Number(document.getElementById('ret-qty').value);
      const reason = document.getElementById('ret-reason').value;

      const ret = DB.createReturn({
        customerId, productId, qty, reason
      });

      document.getElementById('modal-new-return')?.classList.remove('open');
      e.target.reset();
      showToast(`Credit Note ${ret.creditNoteNo} of ${fmtLKR(ret.totalCredit)} issued! Customer ledger credited.`);
    } catch (err) {
      alert(err.message);
    }
  });

  // --- Goods Received Note (GRN) / Receive PO Modal ---
  function openReceivePOModal(supplierId) {
    const sup = DB.getSuppliers().find(s => s.id === supplierId);
    if (!sup) return;

    const modal = document.getElementById('modal-receive-po');
    if (!modal) return;

    document.getElementById('grn-supplier-name').textContent = sup.name;
    document.getElementById('grn-supplier-id').value = sup.id;

    const prodSelect = document.getElementById('grn-product-select');
    prodSelect.innerHTML = DB.getProducts().map(p => `
      <option value="${p.id}">${p.name} (Cost: ${fmtLKR(p.caseCost)})</option>
    `).join('');

    modal.classList.add('open');
  }

  document.getElementById('form-receive-po')?.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const supplierId = document.getElementById('grn-supplier-id').value;
      const productId = document.getElementById('grn-product-select').value;
      const qtyCases = Number(document.getElementById('grn-qty-cases').value);

      DB.receivePurchaseOrder({ supplierId, productId, qtyCases });

      document.getElementById('modal-receive-po')?.classList.remove('open');
      e.target.reset();
      showToast(`Received ${qtyCases} cases into Central Logistics Hub! Stock and supplier payable updated.`);
    } catch (err) {
      alert(err.message);
    }
  });

  // Global search in Topbar
  const omniSearch = document.getElementById('omni-search-input');
  if (omniSearch) {
    omniSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = omniSearch.value.trim().toLowerCase();
        if (!query) return;

        // Try to find customer
        const cust = DB.getCustomers().find(c => c.outletName.toLowerCase().includes(query));
        if (cust) {
          switchTab('customers');
          document.getElementById('cust-search-input').value = query;
          renderCustomers();
          return;
        }

        // Try to find invoice
        const inv = DB.getInvoices().find(i => i.invoiceNo.toLowerCase().includes(query));
        if (inv) {
          switchTab('sales');
          document.getElementById('sales-search-input').value = query;
          renderSales();
          return;
        }

        // Try to find product
        const prod = DB.getProducts().find(p => p.name.toLowerCase().includes(query));
        if (prod) {
          switchTab('inventory');
          document.getElementById('inv-search-input').value = query;
          renderInventory();
          return;
        }

        // Default to sales search
        switchTab('sales');
      }
    });
  }

  // Subscribe to DB changes to automatically update active views
  DB.subscribe(() => {
    renderCurrentView();
  });

  // Start
  setupNavigation();
  setupModals();
  renderCurrentView();
});
