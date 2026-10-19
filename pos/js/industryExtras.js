// =====================================================================
// PIXEL BY MALIYA POS — INDUSTRY EXTRAS
// Tailored menus, per-industry dashboards and signature-module seed data.
// Loaded right after businessTypes.js and merged onto each preset.
// =====================================================================

// KPI tone -> tailwind color used by the dashboard renderer
// (kept as a token so dashboard.js can map to classes)

const INDUSTRY_EXTRAS = {
  // ------------------------------------------------------------------
  restaurant: {
    nav: ['dashboard', 'pos', 'tables', 'kitchen', 'recipes', 'rooms', 'products', 'categories', 'customers', 'hr', 'stock', 'invoices', 'payments', 'reports', 'expenses', 'settings'],
    dashboard: {
      eyebrow: 'FRONT OF HOUSE',
      title: 'Restaurant Command Center',
      sub: 'Live covers, kitchen load and today\u2019s revenue at a glance.',
      icon: 'fa-utensils',
      trendTitle: 'Daily Covers Revenue',
      categoryTitle: 'Sales by Menu Section',
      recentTitle: 'Latest Orders',
      kpis: [
        ['income', 'Food Sales', 'fa-sack-dollar', 'emerald'],
        ['orders', 'Orders Today', 'fa-receipt', 'primary'],
        ['aov', 'Avg Bill Value', 'fa-calculator', 'cyan'],
        ['tables', 'Tables Occupied', 'fa-chair', 'amber']
      ],
      signature: 'kitchen'
    },
    data: {
      kitchen: [
        { id: 'KOT-118', table: 'T1', waiter: 'Ruwan', party: 2, status: 'Preparing', placed: '19:12', items: [['Chicken Cheese Kottu (Full)', 1], ['Iced Milo Dinosaur', 2]] },
        { id: 'KOT-117', table: 'T3', waiter: 'Sanduni', party: 4, status: 'Ready', placed: '19:04', items: [['Special Mixed Fried Rice', 2], ['Devilled Chicken', 1], ['Fresh Orange Juice', 4]] },
        { id: 'KOT-116', table: 'T7', waiter: 'Sanduni', party: 8, status: 'Preparing', placed: '18:58', items: [['Margherita Pizza (Large)', 2], ['Cheese Burger Deluxe', 3]] },
        { id: 'KOT-115', table: 'T5', waiter: 'Ruwan', party: 2, status: 'Served', placed: '18:44', items: [['Hot Butter Cuttlefish', 1], ['Seafood Noodles', 1]] },
        { id: 'KOT-114', table: 'T2', waiter: 'Ruwan', party: 3, status: 'Served', placed: '18:30', items: [['Chicken Biryani', 2], ['Watalappan', 3]] }
      ]
    },
    // Raw kitchen stock — [id, name, emoji, unit, stock, cost, reorderLevel]
    ingredients: [
      ['i1', 'Basmati Rice', 'rice', 'kg', 60, 240, 15],
      ['i2', 'Chicken', 'drumstick', 'kg', 35, 1200, 10],
      ['i3', 'Coconut Milk', 'coconut', 'l', 40, 520, 8],
      ['i4', 'Cooking Oil', 'oil', 'l', 30, 650, 8],
      ['i5', 'Onion', 'onion', 'kg', 25, 300, 8],
      ['i6', 'Tomato', 'tomato', 'kg', 18, 380, 6],
      ['i7', 'Green Chili', 'chili', 'kg', 9, 700, 3],
      ['i8', 'Curry Powder', 'spice', 'kg', 7, 900, 3],
      ['i9', 'Eggs', 'egg', 'pcs', 140, 45, 30],
      ['i10', 'Cheese', 'cheese', 'kg', 12, 1850, 4],
      ['i11', 'Flour', 'flour', 'kg', 28, 200, 8],
      ['i12', 'Butter', 'butter', 'kg', 9, 1600, 3],
      ['i13', 'Chocolate', 'chocolate', 'kg', 6, 2200, 2],
      ['i14', 'Orange', 'orange', 'kg', 22, 420, 6],
      ['i15', 'Milo Powder', 'milo', 'kg', 7, 1500, 3],
      ['i16', 'Sugar', 'sugar', 'kg', 32, 235, 10],
      ['i17', 'Cuttlefish', 'squid', 'kg', 9, 2200, 3],
      ['i18', 'Noodles', 'noodles', 'kg', 20, 350, 6],
      ['i19', 'Seafood Mix', 'shrimp', 'kg', 10, 2400, 3],
      ['i20', 'Mozzarella', 'cheese', 'kg', 8, 2600, 3],
      ['i21', 'Beef Patty', 'beef', 'kg', 10, 1500, 3],
      ['i22', 'Burger Bun', 'bun', 'pcs', 60, 120, 20],
      ['i23', 'Ice Cream', 'icecream', 'l', 12, 900, 4]
    ],
    // productId -> [[ingredientId, qtyPerServing], ...]
    recipes: {
      'restaurant-p1': [['i1', 0.35], ['i2', 0.2], ['i4', 0.05], ['i10', 0.05], ['i9', 1], ['i5', 0.05]],
      'restaurant-p2': [['i1', 0.35], ['i2', 0.15], ['i9', 2], ['i5', 0.06], ['i6', 0.05], ['i4', 0.04]],
      'restaurant-p3': [['i1', 0.4], ['i2', 0.25], ['i8', 0.03], ['i5', 0.08], ['i3', 0.1]],
      'restaurant-p4': [['i18', 0.25], ['i19', 0.2], ['i4', 0.05], ['i6', 0.05]],
      'restaurant-p5': [['i22', 1], ['i21', 0.18], ['i10', 0.04], ['i6', 0.03]],
      'restaurant-p6': [['i11', 0.3], ['i20', 0.15], ['i6', 0.1]],
      'restaurant-p7': [['i17', 0.25], ['i11', 0.08], ['i12', 0.03]],
      'restaurant-p8': [['i2', 0.3], ['i5', 0.08], ['i7', 0.03], ['i4', 0.05]],
      'restaurant-p9': [['i15', 0.05], ['i3', 0.05], ['i16', 0.03], ['i23', 0.08]],
      'restaurant-p10': [['i14', 0.5], ['i16', 0.02]],
      'restaurant-p11': [['i3', 0.1], ['i9', 2], ['i16', 0.08]],
      'restaurant-p12': [['i11', 0.1], ['i13', 0.06], ['i12', 0.04], ['i9', 1]]
    }
  },

  // ------------------------------------------------------------------
  grocery: {
    nav: ['dashboard', 'pos', 'products', 'categories', 'customers', 'suppliers', 'purchase', 'stock', 'expiry', 'hr', 'invoices', 'payments', 'reports', 'expenses', 'settings'],
    dashboard: {
      eyebrow: 'STORE OVERVIEW',
      title: 'Grocery Store Dashboard',
      sub: 'Fast-moving stock, shelf alerts and expiry watch in one view.',
      icon: 'fa-cart-flatbed',
      trendTitle: 'Daily Store Revenue',
      categoryTitle: 'Sales by Aisle',
      recentTitle: 'Recent Bills',
      kpis: [
        ['income', 'Total Sales', 'fa-sack-dollar', 'emerald'],
        ['lowStock', 'Low Stock Items', 'fa-triangle-exclamation', 'amber'],
        ['expiring', 'Expiring Soon', 'fa-calendar-xmark', 'rose'],
        ['products', 'Active Products', 'fa-boxes-stacked', 'primary']
      ],
      signature: 'expiry'
    },
    data: {
      purchase: [
        { id: 'PO-1001', supplier: 'Ceylon Agro Wholesale', items: [['Samba Rice 1Kg', 200], ['White Sugar 1Kg', 150]], total: 83250, status: 'Pending', date: '2026-10-07', expected: '2026-10-10' },
        { id: 'PO-1002', supplier: 'Highland Dairy Distributors', items: [['Highland Milk Powder 400g', 80], ['Anchor Butter 227g', 60]], total: 120600, status: 'Ordered', date: '2026-10-06', expected: '2026-10-09' },
        { id: 'PO-1003', supplier: 'Fresh Farm Veggies', items: [['Tomatoes 1Kg', 90], ['Coconut Oil 750ml', 40]], total: 73400, status: 'Received', date: '2026-10-04', expected: '2026-10-05' }
      ]
    }
  },

  // ------------------------------------------------------------------
  phone: {
    nav: ['dashboard', 'pos', 'products', 'categories', 'customers', 'repairs', 'warranty', 'suppliers', 'stock', 'hr', 'invoices', 'payments', 'reports', 'expenses', 'settings'],
    dashboard: {
      eyebrow: 'SHOWROOM',
      title: 'Mobile Shop Dashboard',
      sub: 'Device sales, warranty registry and repair jobs together.',
      icon: 'fa-mobile-screen-button',
      trendTitle: 'Daily Device Sales',
      categoryTitle: 'Sales by Product Line',
      recentTitle: 'Recent Invoices',
      kpis: [
        ['income', 'Total Sales', 'fa-sack-dollar', 'emerald'],
        ['orders', 'Devices Sold', 'fa-mobile-screen-button', 'primary'],
        ['repairs', 'Open Repairs', 'fa-screwdriver-wrench', 'cyan'],
        ['warranty', 'Warranty Active', 'fa-shield-halved', 'sky']
      ],
      signature: 'warranty'
    },
    data: {
      warranty: [
        { id: 'WR-2201', product: 'Apple iPhone 15 128GB', imei: '354812110998234', customer: 'Dinesh Weerasinghe', sold: '2026-01-15', months: 12, expiry: '2027-01-15', status: 'Active' },
        { id: 'WR-2202', product: 'Samsung Galaxy A55 5G', imei: '352907112334876', customer: 'Ishara Madushani', sold: '2025-11-02', months: 12, expiry: '2026-11-02', status: 'Expiring' },
        { id: 'WR-2203', product: 'Apple AirPods Pro 2', imei: '353998774512210', customer: 'Tharindu Silva', sold: '2025-08-20', months: 12, expiry: '2026-08-20', status: 'Expired' },
        { id: 'WR-2204', product: 'Anker 65W GaN Charger', imei: '351220998877001', customer: 'Nipuni Perera', sold: '2026-03-10', months: 18, expiry: '2027-09-10', status: 'Active' }
      ]
    }
  },

  // ------------------------------------------------------------------
  computer: {
    nav: ['dashboard', 'pos', 'products', 'categories', 'customers', 'repairs', 'builds', 'suppliers', 'stock', 'hr', 'invoices', 'payments', 'reports', 'expenses', 'settings'],
    dashboard: {
      eyebrow: 'WORKSHOP',
      title: 'Computer Store Dashboard',
      sub: 'Component sales, custom builds and service jobs in one place.',
      icon: 'fa-microchip',
      trendTitle: 'Daily Sales & Labour',
      categoryTitle: 'Sales by Component',
      recentTitle: 'Recent Invoices',
      kpis: [
        ['income', 'Total Sales', 'fa-sack-dollar', 'emerald'],
        ['orders', 'Orders', 'fa-receipt', 'primary'],
        ['builds', 'Builds In Progress', 'fa-microchip', 'cyan'],
        ['repairs', 'Open Repairs', 'fa-screwdriver-wrench', 'violet']
      ],
      signature: 'builds'
    },
    data: {
      builds: [
        { id: 'BLD-501', name: 'Gaming Rig — RGB Beast', customer: 'Kasun Rajapaksa', specs: { cpu: 'Intel i7-13700K', gpu: 'RTX 4070 Ti', ram: '32GB DDR5', ssd: '2TB NVMe' }, total: 685000, status: 'In Build', due: '2026-10-12' },
        { id: 'BLD-502', name: 'Office Workstation', customer: 'Lanka Traders (Pvt) Ltd', specs: { cpu: 'Intel i5-13400', gpu: 'Integrated', ram: '16GB DDR4', ssd: '512GB NVMe' }, total: 215000, status: 'Testing', due: '2026-10-09' },
        { id: 'BLD-503', name: 'Streamer Setup', customer: 'Sanjula TV', specs: { cpu: 'AMD Ryzen 7 7800X3D', gpu: 'RTX 4070', ram: '32GB DDR5', ssd: '1TB NVMe' }, total: 540000, status: 'Quoted', due: '2026-10-15' },
        { id: 'BLD-504', name: 'Budget Home PC', customer: 'Amara Gunaratne', specs: { cpu: 'Intel i3-12100', gpu: 'Integrated', ram: '8GB DDR4', ssd: '256GB NVMe' }, total: 98000, status: 'Ready', due: '2026-10-08' }
      ]
    }
  },

  // ------------------------------------------------------------------
  bookshop: {
    nav: ['dashboard', 'pos', 'products', 'categories', 'customers', 'bulk', 'suppliers', 'stock', 'hr', 'invoices', 'payments', 'reports', 'expenses', 'settings'],
    dashboard: {
      eyebrow: 'ON THE SHELVES',
      title: 'Bookshop Dashboard',
      sub: 'Title sales, school orders and stationery movement.',
      icon: 'fa-book',
      trendTitle: 'Daily Book Sales',
      categoryTitle: 'Sales by Section',
      recentTitle: 'Recent Sales',
      kpis: [
        ['income', 'Total Sales', 'fa-sack-dollar', 'emerald'],
        ['orders', 'Sales Count', 'fa-receipt', 'primary'],
        ['bulk', 'Bulk Orders', 'fa-graduation-cap', 'indigo'],
        ['products', 'Titles In Stock', 'fa-book', 'amber']
      ],
      signature: 'bulk'
    },
    data: {
      bulk: [
        { id: 'BO-301', institution: 'Ananda College — Grade 10', contact: 'Mr. Wijesuriya', items: [['Grade 10 Maths Workbook', 120], ['Science Past Papers 2025', 120]], total: 138000, status: 'Packing', due: '2026-10-11' },
        { id: 'BO-302', institution: 'Visakha Vidyalaya Library', contact: 'Ms. Perera', items: [['English Grammar in Use', 60], ['World Atlas Map Book', 40]], total: 162000, status: 'Pending', due: '2026-10-14' },
        { id: 'BO-303', institution: 'Sunrise Tuition Center', contact: 'Mr. Fernando', items: [['A4 Exercise Book 200pg', 500], ['Stabilo Pens (12 Pack)', 80]], total: 96000, status: 'Delivered', due: '2026-10-05' }
      ]
    }
  },

  // ------------------------------------------------------------------
  pharmacy: {
    nav: ['dashboard', 'pos', 'clinic', 'prescriptions', 'products', 'categories', 'customers', 'suppliers', 'stock', 'expiry', 'hr', 'invoices', 'payments', 'reports', 'expenses', 'settings'],
    dashboard: {
      eyebrow: 'HEALTHCARE',
      title: 'Pharmacy & Clinic Dashboard',
      sub: 'Medicine sales, prescriptions and today\u2019s clinic in one view.',
      icon: 'fa-prescription-bottle-medical',
      trendTitle: 'Daily Medicine Sales',
      categoryTitle: 'Sales by Medicine Class',
      recentTitle: 'Recent Bills',
      kpis: [
        ['income', 'Total Sales', 'fa-sack-dollar', 'emerald'],
        ['prescriptions', 'Pending Rx', 'fa-file-prescription', 'primary'],
        ['patients', 'Clinic Patients', 'fa-user-doctor', 'cyan'],
        ['expiring', 'Expiring Soon', 'fa-calendar-xmark', 'rose']
      ],
      signature: 'clinic'
    },
    data: {
      prescriptions: [
        { id: 'RX-9001', patient: 'Kamal Perera', doctor: 'Dr. Nimal Perera', date: '2026-10-09', status: 'Packed', meds: [['Paracetamol 500mg (10)', 1], ['Omeprazole 20mg (10)', 1]] },
        { id: 'RX-9002', patient: 'Nimali Fernando', doctor: 'Dr. Nimal Perera', date: '2026-10-09', status: 'Pending', meds: [['Amoxicillin 500mg (10)', 2], ['Panadol Extra (10)', 1]] },
        { id: 'RX-9003', patient: 'Ravi Chandran', doctor: 'Dr. Ayesha Nawaz', date: '2026-10-09', status: 'Pending', meds: [['Vitamin C 500mg (30)', 1], ['Multivitamin Syrup 200ml', 1]] },
        { id: 'RX-9004', patient: 'Deepika Kumari', doctor: 'Dr. Sandya Fernando', date: '2026-10-08', status: 'Dispensed', meds: [['Baby Diapers (M) 30', 1]] }
      ]
    }
  },

  // ------------------------------------------------------------------
  salon: {
    nav: ['dashboard', 'pos', 'appointments', 'tables', 'products', 'categories', 'customers', 'hr', 'stock', 'invoices', 'payments', 'reports', 'expenses', 'settings'],
    dashboard: {
      eyebrow: 'THE FLOOR',
      title: 'Salon & Spa Dashboard',
      sub: 'Today\u2019s bookings, stylist load and service revenue.',
      icon: 'fa-scissors',
      trendTitle: 'Daily Service Revenue',
      categoryTitle: 'Revenue by Service',
      recentTitle: 'Recent Checkouts',
      kpis: [
        ['income', 'Total Revenue', 'fa-sack-dollar', 'emerald'],
        ['bookings', 'Today\u2019s Bookings', 'fa-calendar-check', 'pink'],
        ['aov', 'Avg Ticket', 'fa-calculator', 'cyan'],
        ['staff', 'Stylists On Duty', 'fa-scissors', 'violet']
      ],
      signature: 'bookings'
    },
    data: {
      bookings: [
        { id: 'BK-701', client: 'Hashini Perera', service: 'Ladies Cut & Blow Dry', stylist: 'Ishara', time: '10:00 AM', price: 3500, status: 'Completed' },
        { id: 'BK-702', client: 'Dilani Silva', service: 'Hair Color (Full)', stylist: 'Ishara', time: '11:30 AM', price: 9500, status: 'Checked-in' },
        { id: 'BK-703', client: 'Nadeesha Alwis', service: 'Facial Treatment', stylist: 'Chamari', time: '01:00 PM', price: 4500, status: 'Confirmed' },
        { id: 'BK-704', client: 'Thilini Jayasuriya', service: 'Bridal Makeup Package', stylist: 'Chamari', time: '03:30 PM', price: 45000, status: 'Confirmed' },
        { id: 'BK-705', client: 'Anjali Rao', service: 'Full Body Massage', stylist: 'Roshana', time: '05:00 PM', price: 6000, status: 'Confirmed' }
      ]
    }
  },

  // ------------------------------------------------------------------
  fashion: {
    nav: ['dashboard', 'pos', 'products', 'categories', 'variants', 'customers', 'suppliers', 'stock', 'hr', 'invoices', 'payments', 'reports', 'expenses', 'settings'],
    dashboard: {
      eyebrow: 'THE RACK',
      title: 'Fashion Boutique Dashboard',
      sub: 'Best sellers, size stock and seasonal movement.',
      icon: 'fa-shirt',
      trendTitle: 'Daily Store Revenue',
      categoryTitle: 'Sales by Collection',
      recentTitle: 'Recent Sales',
      kpis: [
        ['income', 'Total Sales', 'fa-sack-dollar', 'emerald'],
        ['orders', 'Items Sold', 'fa-bag-shopping', 'primary'],
        ['variants', 'Size/Colour SKUs', 'fa-shirt', 'rose'],
        ['products', 'Styles Listed', 'fa-tags', 'purple']
      ],
      signature: 'variants'
    },
    data: {
      variants: [
        { id: 'V-1', product: "Men's Cotton T-Shirt", color: 'Black', size: 'M', sku: 'TS-BLK-M', stock: 12, price: 2500 },
        { id: 'V-2', product: "Men's Cotton T-Shirt", color: 'White', size: 'L', sku: 'TS-WHT-L', stock: 4, price: 2500 },
        { id: 'V-3', product: 'Denim Jeans', color: 'Blue', size: '32', sku: 'DJ-BLU-32', stock: 8, price: 6500 },
        { id: 'V-4', product: 'Denim Jeans', color: 'Black', size: '34', sku: 'DJ-BLK-34', stock: 2, price: 6800 },
        { id: 'V-5', product: 'Ladies Summer Dress', color: 'Floral', size: 'S', sku: 'LS-FLR-S', stock: 6, price: 5500 },
        { id: 'V-6', product: 'Running Shoes', color: 'Grey', size: '42', sku: 'RS-GRY-42', stock: 3, price: 12500 },
        { id: 'V-7', product: 'Kids T-Shirt', color: 'Yellow', size: '8Y', sku: 'KT-YEL-8', stock: 15, price: 1800 },
        { id: 'V-8', product: 'Formal Office Shirt', color: 'Sky', size: 'M', sku: 'FS-SKY-M', stock: 9, price: 4200 }
      ]
    }
  },

  // ------------------------------------------------------------------
  online: {
    nav: ['dashboard', 'pos', 'fulfillment', 'couriers', 'credit', 'products', 'categories', 'customers', 'stock', 'invoices', 'reports', 'expenses', 'sms', 'settings'],
    dashboard: {
      eyebrow: 'ONLINE OPS',
      title: 'Online Store Control Center',
      sub: 'COD orders, delivery fulfilment and receivables at a glance.',
      icon: 'fa-globe',
      trendTitle: 'Daily Online Revenue',
      categoryTitle: 'Sales by Category',
      recentTitle: 'Recent Online Orders',
      kpis: [
        ['income', 'Online Sales', 'fa-sack-dollar', 'emerald'],
        ['orders', 'Orders', 'fa-cart-shopping', 'primary'],
        ['cod', 'COD In Transit', 'fa-truck-fast', 'amber'],
        ['due', 'Receivables Due', 'fa-file-invoice-dollar', 'rose']
      ],
      signature: 'fulfillment'
    },
    data: {
      fulfillment: [
        { id: 'F-3001', order: '#ORD-3001', customer: 'K. Perera', phone: '+94 77 100 1001', city: 'Colombo', items: 3, cod: 14500, courier: 'Pronto Lanka', tracking: 'PRT8841201', status: 'Pending', placed: '2h ago' },
        { id: 'F-3002', order: '#ORD-3002', customer: 'Nimali Fernando', phone: '+94 71 100 1002', city: 'Kandy', items: 1, cod: 4500, courier: 'Koombiyo', tracking: 'KMB7712043', status: 'Packed', placed: '5h ago' },
        { id: 'F-3003', order: '#ORD-3003', customer: 'Saman Silva', phone: '+94 76 100 1003', city: 'Galle', items: 2, cod: 9800, courier: 'Pronto Lanka', tracking: 'PRT8841277', status: 'Shipped', placed: 'Yesterday' },
        { id: 'F-3004', order: '#ORD-3004', customer: 'Dilani Jayasuriya', phone: '+94 77 100 1004', city: 'Negombo', items: 4, cod: 21300, courier: 'Domex', tracking: 'DMX5590312', status: 'Delivered', placed: '2 days ago' },
        { id: 'F-3005', order: '#ORD-3005', customer: 'Ruwan Dias', phone: '+94 71 100 1005', city: 'Matara', items: 1, cod: 6500, courier: 'Koombiyo', tracking: 'KMB7712199', status: 'Shipped', placed: 'Yesterday' },
        { id: 'F-3006', order: '#ORD-3006', customer: 'Iresha Gamage', phone: '+94 76 100 1006', city: 'Jaffna', items: 2, cod: 12750, courier: 'Domex', tracking: 'DMX5590455', status: 'Pending', placed: '3h ago' },
        { id: 'F-3007', order: '#ORD-3007', customer: 'Chathura Weerasinghe', phone: '+94 77 100 1007', city: 'Kurunegala', items: 1, cod: 8900, courier: 'Pronto Lanka', tracking: 'PRT8841300', status: 'Returned', reason: 'Customer refused at door', placed: '4 days ago' },
        { id: 'F-3008', order: '#ORD-3008', customer: 'Amaya Rathnayake', phone: '+94 71 100 1008', city: 'Colombo', items: 5, cod: 31800, courier: 'PickMe Flash', tracking: 'PKM5590881', status: 'Delivered', placed: '5 days ago' },
        { id: 'F-3009', order: '#ORD-3009', customer: 'K. Perera', phone: '+94 77 100 1001', city: 'Colombo', items: 2, cod: 7600, courier: 'Koombiyo', tracking: 'KMB7712301', status: 'Delivered', placed: '6 days ago' },
        { id: 'F-3010', order: '#ORD-3010', customer: 'Nimali Fernando', phone: '+94 71 100 1002', city: 'Kandy', items: 1, cod: 2900, courier: 'Pronto Lanka', tracking: 'PRT8841410', status: 'Returned', reason: 'Damaged in transit', placed: '7 days ago' },
        { id: 'F-3011', order: '#ORD-3011', customer: 'Saman Silva', phone: '+94 76 100 1003', city: 'Galle', items: 3, cod: 11200, courier: '—', tracking: '', status: 'Cancelled', reason: 'Customer cancelled before dispatch', placed: '3 days ago' },
        { id: 'F-3012', order: '#ORD-3012', customer: 'Iresha Gamage', phone: '+94 76 100 1006', city: 'Jaffna', items: 1, cod: 4500, courier: '—', tracking: '', status: 'Cancelled', reason: 'Out of stock', placed: 'Yesterday' }
      ]
    }
  }
};

// Merge extras onto the presets
function applyIndustryExtras() {
  if (typeof BUSINESS_PRESETS === 'undefined') return;
  Object.keys(INDUSTRY_EXTRAS).forEach(id => {
    const biz = BUSINESS_PRESETS[id];
    const ex = INDUSTRY_EXTRAS[id];
    if (!biz || !ex) return;
    if (ex.nav) biz.nav = ex.nav;
    if (ex.dashboard) biz.dashboard = ex.dashboard;
    if (ex.data) biz.moduleData = ex.data;
    if (ex.ingredients) biz.ingredients = ex.ingredients;
    if (ex.recipes) biz.recipes = ex.recipes;
    // Every shop gets the SMS centre
    if (Array.isArray(biz.nav) && !biz.nav.includes('sms')) {
      const at = biz.nav.indexOf('settings');
      if (at >= 0) biz.nav.splice(at, 0, 'sms');
      else biz.nav.push('sms');
    }
    // Every shop gets Credit & Dues (before SMS/settings)
    if (Array.isArray(biz.nav) && !biz.nav.includes('credit')) {
      const anchor = biz.nav.indexOf('sms');
      const at = anchor >= 0 ? anchor : biz.nav.indexOf('settings');
      if (at >= 0) biz.nav.splice(at, 0, 'credit');
      else biz.nav.push('credit');
    }
  });
}
applyIndustryExtras();

// Ingredient emoji tokens -> real emoji (kept short in the seed data)
const ING_EMOJI = {
  rice: '\u{1F35A}', drumstick: '\u{1F357}', coconut: '\u{1F965}', oil: '\u{1F9F4}', onion: '\u{1F9C5}',
  tomato: '\u{1F345}', chili: '\u{1F336}\uFE0F', spice: '\u{1F9C2}', egg: '\u{1F95A}', cheese: '\u{1F9C0}',
  flour: '\u{1F33E}', butter: '\u{1F9C8}', chocolate: '\u{1F36B}', orange: '\u{1F34A}', milo: '\u2615',
  sugar: '\u{1F36C}', squid: '\u{1F991}', noodles: '\u{1F35C}', shrimp: '\u{1F990}', beef: '\u{1F969}',
  bun: '\u{1F354}', icecream: '\u{1F366}'
};

function buildIngredients(biz) {
  const raw = (biz && biz.ingredients) || [];
  return raw.map(r => ({
    id: r[0], name: r[1], emoji: ING_EMOJI[r[2]] || '\u{1F4E6}',
    unit: r[3], stock: Number(r[4]) || 0, cost: Number(r[5]) || 0, reorder: Number(r[6]) || 0
  }));
}

// Couriers available for online order delivery
const COURIERS = [
  { id: 'pronto', name: 'Pronto Lanka', prefix: 'PRT', base: 350, zones: 'Island-wide', icon: 'fa-bolt', connected: true },
  { id: 'koombiyo', name: 'Koombiyo', prefix: 'KMB', base: 300, zones: 'Island-wide', icon: 'fa-truck', connected: true },
  { id: 'domex', name: 'Domex', prefix: 'DMX', base: 320, zones: 'Western & Central', icon: 'fa-truck-fast', connected: true },
  { id: 'slpost', name: 'SL Post Courier', prefix: 'SLP', base: 250, zones: 'Island-wide', icon: 'fa-envelope', connected: false },
  { id: 'pickme', name: 'PickMe Flash', prefix: 'PKM', base: 400, zones: 'Colombo & Suburbs', icon: 'fa-motorcycle', connected: true },
  { id: 'uber', name: 'Uber Connect', prefix: 'UBC', base: 450, zones: 'Colombo', icon: 'fa-car', connected: false }
];

function courierByName(name) {
  return COURIERS.find(c => c.name === name) || null;
}

// Which module a business owns (used by nav + router)
const MODULE_META = {  kitchen:       { title: 'Kitchen Display (KOT)', sub: 'Live order tickets for the kitchen.', icon: 'fa-fire-burner', tone: 'rose', addLabel: 'New Ticket' },
  purchase:      { title: 'Purchase Orders', sub: 'Raise and track supplier orders.', icon: 'fa-file-invoice', tone: 'emerald', addLabel: 'New Purchase Order' },
  warranty:      { title: 'Warranty & IMEI Registry', sub: 'Warranty periods and IMEI/serial records.', icon: 'fa-shield-halved', tone: 'sky', addLabel: 'Register Device' },
  builds:        { title: 'Custom PC Builds', sub: 'Track custom builds from quote to delivery.', icon: 'fa-microchip', tone: 'cyan', addLabel: 'New Build' },
  bulk:          { title: 'Bulk & School Orders', sub: 'Institutional and wholesale book orders.', icon: 'fa-graduation-cap', tone: 'indigo', addLabel: 'New Bulk Order' },
  prescriptions: { title: 'Prescriptions', sub: 'Prescription queue linked to the clinic.', icon: 'fa-file-prescription', tone: 'teal', addLabel: 'New Prescription' },
  appointments:  { title: 'Appointments', sub: 'Salon booking calendar and client queue.', icon: 'fa-calendar-check', tone: 'pink', addLabel: 'New Booking' },
  variants:      { title: 'Size & Colour Stock', sub: 'Variant-level stock across sizes and colours.', icon: 'fa-shirt', tone: 'rose', addLabel: 'New Variant' },
  fulfillment:   { title: 'Order Fulfilment (COD)', sub: 'Pack, ship and track cash-on-delivery orders.', icon: 'fa-truck-fast', tone: 'violet', addLabel: 'New Order' },
  couriers:      { title: 'Courier Services', sub: 'Connected delivery partners and their performance.', icon: 'fa-truck-fast', tone: 'sky', addLabel: 'Connect Courier' }
};
