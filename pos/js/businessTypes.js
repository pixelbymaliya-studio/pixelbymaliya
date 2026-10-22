// =====================================================================
// PIXEL BY MALIYA POS — MULTI-BUSINESS PRESET ENGINE
// One demo account that morphs into a top-tier POS for any industry.
// =====================================================================

// ---------- Theme + full industry presets ----------
const BUSINESS_PRESETS = {
  restaurant: {
    id: 'restaurant',
    name: 'Restaurant & Café',
    short: 'Restaurant',
    icon: 'fa-utensils',
    emoji: '🍽️',
    tagline: 'Fine dining, fast food, cafés & cloud kitchens',
    storeName: 'Pixel POS',
    barcodePrefix: '89',
    theme: { primary: '#f97316', primaryDark: '#ea580c', primaryRgb: '249 115 22', accent: '#fbbf24', gradFrom: '#f97316', gradTo: '#ef4444', glow: '249 115 22' },
    terminology: { product: 'Menu Item', products: 'Menu', customer: 'Guest', addProduct: 'Add Menu Item', pos: 'Restaurant POS', stock: 'Kitchen Stock', supplier: 'Suppliers', order: 'Order' },
    nav: ['dashboard', 'pos', 'tables', 'rooms', 'products', 'categories', 'customers', 'hr', 'stock', 'quotations', 'invoices', 'payments', 'reports', 'expenses', 'users', 'settings'],
    categories: ['All', 'Starters', 'Rice & Curry', 'Kottu & Noodles', 'Burgers & Pizza', 'Beverages', 'Desserts'],
    dashboardLabel: 'Restaurant Command Center',
    products: [
      ['Chicken Cheese Kottu (Full)', '🍜', 1450, 650, 100, 'portion', 'Kottu & Noodles'],
      ['Special Mixed Fried Rice', '🍚', 1650, 720, 80, 'portion', 'Rice & Curry'],
      ['Chicken Biryani', '🍛', 1250, 560, 60, 'portion', 'Rice & Curry'],
      ['Seafood Noodles', '🍝', 1350, 610, 45, 'portion', 'Kottu & Noodles'],
      ['Cheese Burger Deluxe', '🍔', 950, 420, 70, 'portion', 'Burgers & Pizza'],
      ['Margherita Pizza (Large)', '🍕', 1600, 700, 40, 'portion', 'Burgers & Pizza'],
      ['Hot Butter Cuttlefish', '🦑', 1200, 540, 35, 'portion', 'Starters'],
      ['Devilled Chicken', '🍗', 1350, 600, 50, 'portion', 'Starters'],
      ['Iced Milo Dinosaur', '🥤', 350, 120, 200, 'glass', 'Beverages'],
      ['Fresh Orange Juice', '🧃', 450, 160, 120, 'glass', 'Beverages'],
      ['Watalappan', '🍮', 350, 110, 60, 'portion', 'Desserts', { attrs: { duration_minutes: 10 } }],
      ['Chocolate Lava Cake', '🍰', 550, 210, 45, 'portion', 'Desserts', { attrs: { duration_minutes: 15 } }]
    ],
    tables: [
      { no: 'T1', seats: 2, zone: 'Main Hall', status: 'OCCUPIED' },
      { no: 'T2', seats: 4, zone: 'Main Hall', status: 'VACANT' },
      { no: 'T3', seats: 4, zone: 'Main Hall', status: 'OCCUPIED' },
      { no: 'T4', seats: 6, zone: 'Main Hall', status: 'VACANT' },
      { no: 'T5', seats: 2, zone: 'Terrace', status: 'RESERVED' },
      { no: 'T6', seats: 4, zone: 'Terrace', status: 'VACANT' },
      { no: 'T7', seats: 8, zone: 'VIP Lounge', status: 'OCCUPIED' },
      { no: 'T8', seats: 4, zone: 'VIP Lounge', status: 'VACANT' }
    ],
    rooms: [
      { no: '101', type: 'Standard AC', price: 6500, status: 'AVAILABLE', guest: null, checkin: null },
      { no: '102', type: 'Standard AC', price: 6500, status: 'OCCUPIED', guest: { name: 'Kasun Silva', id: '921456789V' }, checkin: '2023-11-10 14:30' },
      { no: '103', type: 'Deluxe Suite', price: 12500, status: 'AVAILABLE', guest: null, checkin: null },
      { no: '104', type: 'Family Room', price: 15000, status: 'OCCUPIED', guest: { name: 'Ruwan Kumara', id: '882345671V' }, checkin: '2023-11-12 09:15' },
      { no: '201', type: 'Standard AC', price: 6500, status: 'AVAILABLE', guest: null, checkin: null },
      { no: '202', type: 'Deluxe Suite', price: 12500, status: 'MAINTENANCE', guest: null, checkin: null }
    ],
    expenses: [
      ['Fresh Chicken & Seafood Purchase', 'Inventory Purchase', 42500],
      ['Kitchen Gas Cylinders (5x)', 'Utilities', 12500],
      ['Restaurant Monthly Rent', 'Rent', 85000],
      ['Kitchen Staff Salaries', 'Salaries', 145000]
    ],
    hr: [
      ['Kamal Perera', 'Head Chef', '+94 77 234 5678', 85000, 'Active'],
      ['Nimal Jayasinghe', 'Sous Chef', '+94 71 345 6789', 62000, 'Active'],
      ['Sanduni Silva', 'Head Waitress', '+94 76 456 7890', 45000, 'Active'],
      ['Ruwan Dias', 'Waiter', '+94 77 567 8901', 38000, 'Active'],
      ['Chef Asanka', 'Kitchen Helper', '+94 70 678 9012', 32000, 'On Leave']
    ]
  },

  grocery: {
    id: 'grocery',
    name: 'Grocery & Supermarket',
    short: 'Grocery',
    icon: 'fa-cart-flatbed',
    emoji: '🛒',
    tagline: 'Supermarkets, mini-marts & provision stores',
    storeName: 'Pixel POS',
    barcodePrefix: '47',
    theme: { primary: '#10b981', primaryDark: '#059669', primaryRgb: '16 185 129', accent: '#84cc16', gradFrom: '#10b981', gradTo: '#059669', glow: '16 185 129' },
    terminology: { product: 'Product', products: 'Products', customer: 'Customer', addProduct: 'Add Product', pos: 'Grocery POS', stock: 'Stock & Batches', supplier: 'Suppliers', order: 'Bill' },
    nav: ['dashboard', 'pos', 'products', 'categories', 'customers', 'hr', 'suppliers', 'stock', 'expiry', 'quotations', 'invoices', 'payments', 'reports', 'expenses', 'users', 'settings'],
    categories: ['All', 'Rice & Grains', 'Dairy', 'Bakery', 'Beverages', 'Snacks', 'Vegetables', 'Household', 'Frozen'],
    dashboardLabel: 'Grocery Store Dashboard',
    expiryTracking: true,
    products: [
      ['Samba Rice 1Kg', '🌾', 240, 190, 150, 'kg', 'Rice & Grains', { months: 12, batch: 'RCE-2201' }],
      ['Red Raw Rice 5Kg', '🌾', 1150, 940, 60, 'pkt', 'Rice & Grains', { months: 10, batch: 'RCE-2202' }],
      ['Highland Milk Powder 400g', '🥛', 1050, 920, 40, 'pcs', 'Dairy', { months: 8, batch: 'MLK-3310' }],
      ['Anchor Butter 227g', '🧈', 720, 610, 25, 'pcs', 'Dairy', { months: 3, batch: 'MLK-3311' }],
      ['Fresh Milk 1L', '🥛', 420, 350, 18, 'pkt', 'Dairy', { months: 0.4, batch: 'MLK-3312' }],
      ['Munchee Cream Cracker 190g', '🍪', 180, 140, 85, 'pcs', 'Snacks', { months: 9, batch: 'SNK-4401' }],
      ['Ceylon Black Tea 400g', '🍵', 890, 720, 55, 'pkt', 'Beverages', { months: 14, batch: 'BEV-5501' }],
      ['White Sugar 1Kg', '🧂', 285, 235, 200, 'kg', 'Rice & Grains', { months: 24, batch: 'RCE-2203' }],
      ['Coconut Oil 750ml', '🛢️', 1150, 980, 30, 'btl', 'Household', { months: 18, batch: 'HH-6601' }],
      ['Tomatoes 1Kg', '🍅', 380, 260, 45, 'kg', 'Vegetables', { months: 0.3, batch: 'VEG-7701' }],
      ['Fresh Chicken 1Kg', '🍗', 1250, 1000, 20, 'kg', 'Frozen', { months: 0.25, batch: 'FRZ-8801' }],
      ['Farm Eggs (10 Pack)', '🥚', 480, 400, 35, 'pack', 'Frozen', { months: 1, batch: 'FRZ-8802' }]
    ],
    expenses: [
      ['Vegetable & Fruit Wholesale Purchase', 'Inventory Purchase', 38500],
      ['Electricity Bill - Cold Room', 'Utilities', 24500],
      ['Supermarket Monthly Rent', 'Rent', 120000],
      ['Delivery Van Fuel', 'Maintenance', 18500]
    ],
    hr: [
      ['Sunil Bandara', 'Store Manager', '+94 77 111 2233', 95000, 'Active'],
      ['Priya Fernando', 'Head Cashier', '+94 71 222 3344', 48000, 'Active'],
      ['Nuwan Silva', 'Shelf Stocker', '+94 76 333 4455', 35000, 'Active'],
      ['Deepika Kumari', 'Cashier', '+94 77 444 5566', 38000, 'Active'],
      ['Ravi Chandran', 'Delivery Driver', '+94 70 555 6677', 42000, 'On Leave']
    ]
  },

  phone: {
    id: 'phone',
    name: 'Mobile Phone Shop',
    short: 'Phone Shop',
    icon: 'fa-mobile-screen-button',
    emoji: '📱',
    tagline: 'Smartphones, accessories & repair centers',
    storeName: 'Pixel POS',
    barcodePrefix: '35',
    theme: { primary: '#3b82f6', primaryDark: '#2563eb', primaryRgb: '59 130 246', accent: '#06b6d4', gradFrom: '#3b82f6', gradTo: '#6366f1', glow: '59 130 246' },
    terminology: { product: 'Device', products: 'Devices', customer: 'Customer', addProduct: 'Add Device', pos: 'Mobile POS', stock: 'IMEI Stock', supplier: 'Distributors', order: 'Invoice' },
    nav: ['dashboard', 'pos', 'products', 'categories', 'customers', 'hr', 'suppliers', 'stock', 'repairs', 'quotations', 'invoices', 'payments', 'reports', 'expenses', 'users', 'settings'],
    categories: ['All', 'Smartphones', 'Chargers', 'Cables', 'Cases & Glass', 'Earphones', 'Power Banks', 'Repairs'],
    dashboardLabel: 'Mobile Shop Dashboard',
    serialTracking: 'imei',
    products: [
      ['Apple iPhone 15 128GB', '📱', 285000, 258000, 6, 'pcs', 'Smartphones', { warranty: 12 }],
      ['Samsung Galaxy A55 5G', '📱', 125000, 112000, 12, 'pcs', 'Smartphones', { warranty: 12 }],
      ['Xiaomi Redmi Note 13 Pro', '📱', 89000, 78000, 15, 'pcs', 'Smartphones', { warranty: 12 }],
      ['Anker 65W GaN Charger', '🔌', 12500, 9200, 40, 'pcs', 'Chargers', { warranty: 18 }],
      ['USB-C Braided Cable 1.5m', '🔗', 2500, 1400, 120, 'pcs', 'Cables', { warranty: 6 }],
      ['Apple AirPods Pro 2', '🎧', 78000, 68000, 8, 'pcs', 'Earphones', { warranty: 12 }],
      ['20000mAh Power Bank', '🔋', 15500, 11200, 30, 'pcs', 'Power Banks', { warranty: 12 }],
      ['Tempered Glass Protector', '🛡️', 1500, 450, 200, 'pcs', 'Cases & Glass', { warranty: 0 }],
      ['Premium Phone Case', '📲', 2000, 700, 150, 'pcs', 'Cases & Glass', { warranty: 0 }],
      ['Screen Replacement Service', '🛠️', 12000, 5500, 999, 'job', 'Repairs', { service: true }],
      ['Battery Replacement Service', '🔧', 6500, 2800, 999, 'job', 'Repairs', { service: true }]
    ],
    expenses: [
      ['iPhone & Samsung Stock Order', 'Inventory Purchase', 850000],
      ['Showroom Glass Display Units', 'Maintenance', 65000],
      ['Shop Monthly Rent', 'Rent', 95000],
      ['Sales Staff Salaries', 'Salaries', 180000]
    ],
    hr: [
      ['Ashan Wijesinghe', 'Shop Owner', '+94 77 900 1122', 120000, 'Active'],
      ['Tharindu Perera', 'Senior Sales Exec', '+94 71 900 3344', 55000, 'Active'],
      ['Kavindi Silva', 'Sales Executive', '+94 76 900 5566', 40000, 'Active'],
      ['Dilan Madushanka', 'Technician', '+94 77 900 7788', 48000, 'Active']
    ]
  },

  computer: {
    id: 'computer',
    name: 'Computer & Electronics',
    short: 'Computer Shop',
    icon: 'fa-laptop-code',
    emoji: '💻',
    tagline: 'Laptops, PC builds, components & IT services',
    storeName: 'Pixel POS',
    barcodePrefix: '62',
    theme: { primary: '#6366f1', primaryDark: '#4f46e5', primaryRgb: '99 102 241', accent: '#06b6d4', gradFrom: '#6366f1', gradTo: '#0ea5e9', glow: '99 102 241' },
    terminology: { product: 'Product', products: 'Products', customer: 'Client', addProduct: 'Add Product', pos: 'Electronics POS', stock: 'Serial Stock', supplier: 'Vendors', order: 'Invoice' },
    nav: ['dashboard', 'pos', 'products', 'categories', 'customers', 'hr', 'suppliers', 'stock', 'repairs', 'quotations', 'invoices', 'payments', 'reports', 'expenses', 'users', 'settings'],
    categories: ['All', 'Laptops', 'Desktops', 'Components', 'Monitors', 'Peripherals', 'Networking', 'Services'],
    dashboardLabel: 'Computer Store Dashboard',
    serialTracking: 'serial',
    products: [
      ['Dell Inspiron 15 3520', '💻', 245000, 218000, 8, 'pcs', 'Laptops', { warranty: 24 }],
      ['ASUS TUF Gaming F15', '🎮', 385000, 348000, 5, 'pcs', 'Laptops', { warranty: 24 }],
      ['Custom Gaming Desktop (i7)', '🖥️', 425000, 375000, 4, 'pcs', 'Desktops', { warranty: 24 }],
      ['Intel Core i5 12400F', '🧠', 62000, 54000, 20, 'pcs', 'Components', { warranty: 36 }],
      ['GeForce RTX 4060 8GB', '🎮', 135000, 118000, 10, 'pcs', 'Components', { warranty: 36 }],
      ['Crucial 16GB DDR4 RAM', '🧩', 18500, 14200, 35, 'pcs', 'Components', { warranty: 60 }],
      ['Samsung 1TB NVMe SSD', '💾', 32000, 26500, 25, 'pcs', 'Components', { warranty: 60 }],
      ['Samsung 24" IPS Monitor', '🖥️', 68000, 59000, 12, 'pcs', 'Monitors', { warranty: 36 }],
      ['Logitech G502 Mouse', '🖱️', 22000, 17500, 30, 'pcs', 'Peripherals', { warranty: 24 }],
      ['Mechanical RGB Keyboard', '⌨️', 18500, 13000, 28, 'pcs', 'Peripherals', { warranty: 24 }],
      ['TP-Link WiFi 6 Router', '📶', 24500, 19000, 18, 'pcs', 'Networking', { warranty: 36 }],
      ['PC Assembly & OS Setup', '🛠️', 15000, 3000, 999, 'job', 'Services', { service: true }]
    ],
    expenses: [
      ['Component Bulk Stock Order', 'Inventory Purchase', 620000],
      ['Workshop Tool Purchase', 'Maintenance', 45000],
      ['Showroom Monthly Rent', 'Rent', 110000],
      ['Technician Salaries', 'Salaries', 220000]
    ],
    hr: [
      ['Chamara Gunasekara', 'Store Manager', '+94 77 800 1122', 110000, 'Active'],
      ['Isuru Nissanka', 'PC Build Engineer', '+94 71 800 3344', 72000, 'Active'],
      ['Hashini Weerasinghe', 'Sales Executive', '+94 76 800 5566', 45000, 'Active'],
      ['Buddhika Rathnayake', 'Repair Technician', '+94 77 800 7788', 58000, 'Active']
    ]
  },

  bookshop: {
    id: 'bookshop',
    name: 'Bookshop & Stationery',
    short: 'Bookshop',
    icon: 'fa-book-open',
    emoji: '📚',
    tagline: 'Books, stationery, school & office supplies',
    storeName: 'Pixel POS',
    barcodePrefix: '98',
    theme: { primary: '#d97706', primaryDark: '#b45309', primaryRgb: '217 119 6', accent: '#f59e0b', gradFrom: '#d97706', gradTo: '#f59e0b', glow: '217 119 6' },
    terminology: { product: 'Book / Item', products: 'Catalog', customer: 'Customer', addProduct: 'Add Book', pos: 'Bookstore POS', stock: 'Stock', supplier: 'Publishers', order: 'Invoice' },
    nav: ['dashboard', 'pos', 'products', 'categories', 'customers', 'hr', 'suppliers', 'stock', 'quotations', 'invoices', 'payments', 'reports', 'expenses', 'users', 'settings'],
    categories: ['All', 'Academic', 'Fiction', 'Children', 'Stationery', 'School Items', 'Art Supplies', 'Office'],
    dashboardLabel: 'Bookstore Dashboard',
    products: [
      ['Grade 5 Mathematics Workbook', '📕', 850, 620, 80, 'pcs', 'Academic', { isbn: '978-955-1234-01', author: 'K. Perera', publisher: 'Sarasavi' }],
      ['English Grammar in Use', '📗', 3250, 2600, 30, 'pcs', 'Academic', { isbn: '978-0521-532-629', author: 'Raymond Murphy', publisher: 'Cambridge' }],
      ['Harry Potter Box Set', '📚', 12500, 9800, 12, 'set', 'Fiction', { isbn: '978-1408-854-339', author: 'J.K. Rowling', publisher: 'Bloomsbury' }],
      ['SCIENCE Past Papers 2025', '📄', 1200, 850, 60, 'pcs', 'School Items', { isbn: '978-955-1234-55', author: 'Board', publisher: 'Sarasavi' }],
      ['A4 Exercise Book 200pg', '📒', 350, 210, 300, 'pcs', 'Stationery', {}],
      ['Stabilo Pens (12 Pack)', '🖊️', 950, 650, 55, 'pack', 'Stationery', {}],
      ['World Atlas Map Book', '🗺️', 2100, 1600, 25, 'pcs', 'Academic', { isbn: '978-955-9999-11', author: 'Survey Dept', publisher: 'Sarasavi' }],
      ['A4 Paper Ream 500 Sheets', '📄', 1650, 1320, 90, 'ream', 'Office', {}],
      ['Artist Brush Set (12)', '🎨', 1850, 1250, 20, 'set', 'Art Supplies', {}],
      ['Scientific Calculator', '🧮', 2750, 2100, 40, 'pcs', 'School Items', {}]
    ],
    expenses: [
      ['New Stock Book Orders', 'Inventory Purchase', 145000],
      ['Shop Shelf & Storage', 'Supplies', 32000],
      ['Bookshop Monthly Rent', 'Rent', 78000],
      ['Staff Salaries', 'Salaries', 105000]
    ],
    hr: [
      ['Malini Jayawardena', 'Shop Manager', '+94 77 600 1122', 75000, 'Active'],
      ['Ranga Fernando', 'Sales Assistant', '+94 71 600 3344', 38000, 'Active'],
      ['Sewwandi Perera', 'Cashier', '+94 76 600 5566', 36000, 'Active']
    ]
  },

  pharmacy: {
    id: 'pharmacy',
    name: 'Pharmacy & Wellness',
    short: 'Pharmacy',
    icon: 'fa-prescription-bottle-medical',
    emoji: '💊',
    tagline: 'Medicine, wellness & medical supplies',
    storeName: 'Pixel POS',
    barcodePrefix: '89',
    theme: { primary: '#14b8a6', primaryDark: '#0d9488', primaryRgb: '20 184 166', accent: '#22c55e', gradFrom: '#14b8a6', gradTo: '#0ea5e9', glow: '20 184 166' },
    terminology: { product: 'Medicine', products: 'Medicines', customer: 'Patient', addProduct: 'Add Medicine', pos: 'Pharmacy POS', stock: 'Batch Stock', supplier: 'Pharma Suppliers', order: 'Bill' },
    nav: ['dashboard', 'pos', 'clinic', 'products', 'categories', 'customers', 'hr', 'suppliers', 'stock', 'expiry', 'invoices', 'payments', 'reports', 'expenses', 'users', 'settings'],
    categories: ['All', 'Prescription', 'OTC', 'Vitamins', 'Baby Care', 'Personal Care', 'Medical Devices'],
    dashboardLabel: 'Pharmacy Dashboard',
    expiryTracking: true,
    hasClinic: true,
    products: [
      ['Paracetamol 500mg (10)', '💊', 25, 15, 500, 'strip', 'OTC', { months: 18, batch: 'PCM-1001' }],
      ['Amoxicillin 500mg (10)', '💊', 85, 55, 200, 'strip', 'Prescription', { months: 12, batch: 'AMX-2001', prescription: true }],
      ['Panadol Extra (10)', '💊', 45, 28, 400, 'strip', 'OTC', { months: 20, batch: 'PCM-1002' }],
      ['Omeprazole 20mg (10)', '💊', 55, 32, 250, 'strip', 'Prescription', { months: 15, batch: 'OMP-3001' }],
      ['Vitamin C 500mg (30)', '🍊', 60, 35, 300, 'btl', 'Vitamins', { months: 22, batch: 'VIT-4001' }],
      ['Multivitamin Syrup 200ml', '🧴', 450, 300, 60, 'btl', 'Vitamins', { months: 10, batch: 'VIT-4002' }],
      ['Baby Diapers (M) 30', '🧷', 2100, 1650, 45, 'pack', 'Baby Care', { months: 24, batch: 'BAB-5001' }],
      ['Hand Sanitizer 500ml', '🧴', 650, 420, 80, 'btl', 'Personal Care', { months: 0.5, batch: 'PC-6001' }],
      ['Digital Thermometer', '🌡️', 1850, 1300, 25, 'pcs', 'Medical Devices', {}],
      ['Blood Pressure Monitor', '🩺', 8500, 6800, 12, 'pcs', 'Medical Devices', {}],
      ['First Aid Kit', '🩹', 2450, 1800, 18, 'kit', 'Medical Devices', {}]
    ],
    expenses: [
      ['Pharmaceutical Stock Purchase', 'Inventory Purchase', 285000],
      ['Cold Storage Electricity', 'Utilities', 18500],
      ['Pharmacy Monthly Rent', 'Rent', 82000],
      ['Pharmacist Salaries', 'Salaries', 160000]
    ],
    hr: [
      ['Dr. Nadeeka Fernando', 'Chief Pharmacist', '+94 77 500 1122', 95000, 'Active'],
      ['Sampath Liyanage', 'Pharmacist', '+94 71 500 3344', 62000, 'Active'],
      ['Iresha Madhavi', 'Pharmacy Assistant', '+94 76 500 5566', 38000, 'Active']
    ],
    doctors: [
      ['Dr. Nimal Perera', 'General Physician', 'MBBS, MD', '+94 77 123 4567', 1500, 'Room 1', ['Mon', 'Wed', 'Fri'], '09:00 AM - 12:00 PM'],
      ['Dr. Sandya Fernando', 'Pediatrician', 'MBBS, DCH', '+94 71 234 5678', 2000, 'Room 2', ['Tue', 'Thu'], '04:00 PM - 07:00 PM'],
      ['Dr. Rohan Silva', 'Cardiologist', 'MBBS, MD, MRCP', '+94 76 345 6789', 3000, 'Room 3', ['Sat'], '10:00 AM - 01:00 PM'],
      ['Dr. Ayesha Nawaz', 'Dermatologist', 'MBBS, MD', '+94 70 456 7890', 2500, 'Room 2', ['Mon', 'Thu', 'Sat'], '02:00 PM - 05:00 PM']
    ],
    appointments: [
      ['Kamal Perera', 0, '09:30 AM', 'Waiting'],
      ['Nimali Fernando', 0, '10:00 AM', 'In Consultation'],
      ['Sanjaya Silva', 1, '04:30 PM', 'Scheduled'],
      ['Deepika Kumari', 1, '05:15 PM', 'Scheduled'],
      ['Ravi Chandran', 3, '02:45 PM', 'Waiting']
    ]
  },

  salon: {
    id: 'salon',
    name: 'Salon & Spa',
    short: 'Salon',
    icon: 'fa-scissors',
    emoji: '💇',
    tagline: 'Hair, beauty, nails, spa & wellness',
    storeName: 'Pixel POS',
    barcodePrefix: '70',
    theme: { primary: '#ec4899', primaryDark: '#db2777', primaryRgb: '236 72 153', accent: '#a855f7', gradFrom: '#ec4899', gradTo: '#a855f7', glow: '236 72 153' },
    terminology: { product: 'Service', products: 'Services', customer: 'Client', addProduct: 'Add Service', pos: 'Salon POS', stock: 'Retail Products', supplier: 'Brand Partners', order: 'Appointment' },
    nav: ['dashboard', 'pos', 'tables', 'products', 'categories', 'customers', 'hr', 'stock', 'quotations', 'invoices', 'payments', 'reports', 'expenses', 'users', 'settings'],
    categories: ['All', 'Hair', 'Beauty', 'Nails', 'Spa', 'Packages', 'Products'],
    dashboardLabel: 'Salon & Spa Dashboard',
    tables: [
      { no: 'Chair 1', seats: 1, zone: 'Styling Floor', status: 'OCCUPIED' },
      { no: 'Chair 2', seats: 1, zone: 'Styling Floor', status: 'VACANT' },
      { no: 'Chair 3', seats: 1, zone: 'Styling Floor', status: 'OCCUPIED' },
      { no: 'Nail 1', seats: 1, zone: 'Nail Bar', status: 'VACANT' },
      { no: 'Nail 2', seats: 1, zone: 'Nail Bar', status: 'RESERVED' },
      { no: 'Spa 1', seats: 1, zone: 'Spa Room', status: 'OCCUPIED' }
    ],
    products: [
      ["Men's Haircut", '✂️', 1000, 150, 999, 'service', 'Hair', { service: true, attrs: { duration_minutes: 30 } }],
      ['Ladies Cut & Blow Dry', '💇', 2500, 300, 999, 'service', 'Hair', { service: true, attrs: { duration_minutes: 60 } }],
      ['Hair Color (Full)', '🎨', 8500, 2500, 999, 'service', 'Hair', { service: true, attrs: { duration_minutes: 120 } }],
      ['Keratin Treatment', '✨', 15000, 4500, 999, 'service', 'Hair', { service: true, attrs: { duration_minutes: 180 } }],
      ['Facial Treatment', '🧖', 4500, 800, 999, 'service', 'Beauty', { service: true, attrs: { duration_minutes: 60 } }],
      ['Gel Nail Polish', '💅', 3500, 900, 999, 'service', 'Nails', { service: true, attrs: { duration_minutes: 75 } }],
      ['Full Body Massage', '💆', 6500, 1000, 999, 'service', 'Spa', { service: true, attrs: { duration_minutes: 90 } }],
      ['Head Massage', '💆', 2000, 250, 999, 'service', 'Spa', { service: true, attrs: { duration_minutes: 30 } }],
      ['Bridal Makeup Package', '👰', 25000, 6000, 999, 'package', 'Packages', { service: true, attrs: { duration_minutes: 180 } }],
      ['Salon Shampoo 500ml', '🧴', 2800, 1800, 40, 'btl', 'Products', {}]
    ],
    expenses: [
      ['Salon Product Restock', 'Inventory Purchase', 85000],
      ['Electricity & Water', 'Utilities', 22000],
      ['Lounge Monthly Rent', 'Rent', 95000],
      ['Stylist Salaries', 'Salaries', 185000]
    ],
    hr: [
      ['Nilanthi Perera', 'Master Stylist', '+94 77 300 1122', 85000, 'Active'],
      ['Dilrukshi Silva', 'Beautician', '+94 71 300 3344', 48000, 'Active'],
      ['Chathurika Warnakulasuriya', 'Nail Technician', '+94 76 300 5566', 42000, 'Active'],
      ['Mahesh Kumara', 'Spa Therapist', '+94 77 300 7788', 52000, 'Active']
    ]
  },

  fashion: {
    id: 'fashion',
    name: 'Fashion & Clothing',
    short: 'Fashion',
    icon: 'fa-shirt',
    emoji: '👕',
    tagline: 'Apparel, footwear, bags & accessories',
    storeName: 'Pixel POS',
    barcodePrefix: '20',
    theme: { primary: '#f43f5e', primaryDark: '#e11d48', primaryRgb: '244 63 94', accent: '#8b5cf6', gradFrom: '#f43f5e', gradTo: '#8b5cf6', glow: '244 63 94' },
    terminology: { product: 'Item', products: 'Catalog', customer: 'Customer', addProduct: 'Add Item', pos: 'Fashion POS', stock: 'Stock', supplier: 'Suppliers', order: 'Invoice' },
    nav: ['dashboard', 'pos', 'products', 'categories', 'customers', 'hr', 'suppliers', 'stock', 'quotations', 'invoices', 'payments', 'reports', 'expenses', 'users', 'settings'],
    categories: ['All', 'Men', 'Women', 'Kids', 'Footwear', 'Bags', 'Accessories'],
    dashboardLabel: 'Fashion Store Dashboard',
    products: [
      ["Men's Cotton T-Shirt", '👕', 1950, 1200, 60, 'pcs', 'Men', { sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'White', 'Navy'] }],
      ['Denim Jeans', '👖', 4500, 2900, 35, 'pcs', 'Men', { sizes: ['30', '32', '34', '36'], colors: ['Blue', 'Black'] }],
      ['Ladies Summer Dress', '👗', 5500, 3400, 28, 'pcs', 'Women', { sizes: ['S', 'M', 'L'], colors: ['Floral', 'Red', 'Teal'] }],
      ['Formal Office Shirt', '👔', 3200, 2000, 40, 'pcs', 'Men', { sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Sky Blue'] }],
      ['Running Shoes', '👟', 8500, 5600, 22, 'pair', 'Footwear', { sizes: ['40', '41', '42', '43', '44'], colors: ['Black', 'Grey'] }],
      ['Leather Handbag', '👜', 12000, 7500, 15, 'pcs', 'Bags', { colors: ['Brown', 'Black', 'Tan'] }],
      ['Kids T-Shirt', '👶', 1250, 700, 55, 'pcs', 'Kids', { sizes: ['2Y', '4Y', '6Y'], colors: ['Yellow', 'Blue'] }],
      ['Designer Sunglasses', '🕶️', 3500, 1800, 30, 'pcs', 'Accessories', {}],
      ['Classic Wrist Watch', '⌚', 15000, 9500, 12, 'pcs', 'Accessories', {}],
      ['Cotton Socks (3 Pack)', '🧦', 900, 500, 80, 'pack', 'Accessories', {}]
    ],
    expenses: [
      ['Seasonal Collection Purchase', 'Inventory Purchase', 320000],
      ['Display Mannequins', 'Supplies', 48000],
      ['Boutique Monthly Rent', 'Rent', 130000],
      ['Showroom Staff Salaries', 'Salaries', 210000]
    ],
    hr: [
      ['Shanika Perera', 'Boutique Manager', '+94 77 200 1122', 88000, 'Active'],
      ['Thilini Fernando', 'Fashion Consultant', '+94 71 200 3344', 45000, 'Active'],
      ['Anushka Silva', 'Sales Assistant', '+94 76 200 5566', 38000, 'Active']
    ]
  },

  online: {
    id: 'online',
    name: 'Online Store',
    short: 'Online',
    icon: 'fa-globe',
    emoji: '🛒',
    tagline: 'E-commerce, COD orders & delivery fulfilment',
    storeName: 'Pixel POS',
    barcodePrefix: '77',
    theme: { primary: '#7c3aed', primaryDark: '#6d28d9', primaryRgb: '124 58 237', accent: '#06b6d4', gradFrom: '#7c3aed', gradTo: '#06b6d4', glow: '124 58 237' },
    terminology: { product: 'Product', products: 'Catalog', customer: 'Customer', addProduct: 'Add Product', pos: 'Online POS', stock: 'Stock', supplier: 'Suppliers', order: 'Invoice' },
    nav: ['dashboard', 'pos', 'fulfillment', 'credit', 'products', 'categories', 'customers', 'stock', 'invoices', 'reports', 'expenses', 'sms', 'settings'],
    categories: ['All', 'Mobile Accessories', 'Home & Kitchen', 'Gadgets', 'Beauty', 'Toys', 'Bags'],
    dashboardLabel: 'Online Store Dashboard',
    products: [
      ['Wireless Earbuds Pro', '🎧', 4500, 2800, 120, 'pcs', 'Gadgets', { colors: ['Black', 'White'] }],
      ['Smart Fitness Watch', '⌚', 7500, 4800, 60, 'pcs', 'Gadgets', { colors: ['Black', 'Pink', 'Blue'] }],
      ['Shockproof Phone Case', '📱', 1200, 450, 300, 'pcs', 'Mobile Accessories', { colors: ['Clear', 'Black'] }],
      ['Fast Charger 65W', '🔌', 3500, 2100, 150, 'pcs', 'Mobile Accessories', {}],
      ['Power Bank 20000mAh', '🔋', 6500, 4200, 90, 'pcs', 'Mobile Accessories', { colors: ['Black', 'White'] }],
      ['Ceramic Dinner Set (16pc)', '🍽️', 8500, 5200, 40, 'set', 'Home & Kitchen', {}],
      ['Non-Stick Frying Pan', '🍳', 4200, 2600, 55, 'pcs', 'Home & Kitchen', {}],
      ['LED Desk Lamp', '💡', 3800, 2200, 70, 'pcs', 'Home & Kitchen', { colors: ['White', 'Black'] }],
      ['Vitamin C Face Serum', '🧴', 2900, 1500, 100, 'pcs', 'Beauty', {}],
      ['Hair Dryer 2000W', '💇', 5500, 3600, 45, 'pcs', 'Beauty', {}],
      ['Building Blocks Set (500pc)', '🧱', 6200, 3900, 35, 'box', 'Toys', {}],
      ['RC Racing Car', '🚗', 8900, 5600, 28, 'pcs', 'Toys', { colors: ['Red', 'Blue'] }],
      ['Canvas Backpack', '🎒', 3400, 1900, 80, 'pcs', 'Bags', { colors: ['Grey', 'Navy'] }],
      ['Cotton Face Towel (5 Pack)', '🧺', 1500, 800, 140, 'pack', 'Home & Kitchen', {}]
    ],
    expenses: [
      ['Warehouse Inventory Purchase', 'Inventory Purchase', 850000],
      ['Courier & Delivery Charges', 'Logistics', 120000],
      ['Packaging Materials', 'Supplies', 65000],
      ['Online Ads & Marketing', 'Marketing', 95000],
      ['Warehouse Monthly Rent', 'Rent', 110000],
      ['Packing Staff Salaries', 'Salaries', 175000]
    ],
    hr: [
      ['Dinuka Perera', 'Operations Lead', '+94 77 300 1122', 85000, 'Active'],
      ['Chamodi Silva', 'Packing & Dispatch', '+94 71 300 3344', 42000, 'Active'],
      ['Sahan Fernando', 'Customer Support', '+94 76 300 5566', 50000, 'Active']
    ]
  },

  distribution: {
    id: 'distribution',
    name: 'Distribution & Wholesale',
    short: 'Distribution',
    icon: 'fa-truck-field',
    emoji: '🚚',
    tagline: 'Wholesale distribution to retailer shops, vans & routes',
    storeName: 'Pixel POS Distributor',
    barcodePrefix: '71',
    theme: { primary: '#4f46e5', primaryDark: '#4338ca', primaryRgb: '79 70 229', accent: '#22d3ee', gradFrom: '#4f46e5', gradTo: '#06b6d4', glow: '79 70 229' },
    terminology: { product: 'SKU', products: 'SKU Catalog', customer: 'Retailer', addProduct: 'Add SKU', pos: 'Sales Entry', stock: 'Warehouse Stock', supplier: 'Suppliers', order: 'Invoice' },
    nav: ['dashboard', 'distribution', 'products', 'customers', 'invoices', 'credit', 'reports', 'expenses', 'hr', 'users', 'settings'],
    categories: ['All', 'Beverages', 'Food & Snacks', 'Household', 'Personal Care', 'Stationery', 'Electronics Accessories', 'Mobile Accessories'],
    dashboardLabel: 'Distribution Control Centre',
    products: [
      ['Mineral Water 1L (Case 24)', '💧', 2400, 1920, 200, 'case', 'Beverages'],
      ['Potato Chips 50g (Carton 48)', '🍟', 3840, 2880, 120, 'ctn', 'Food & Snacks'],
      ['Samba Rice 5Kg Bag', '🌾', 1250, 980, 300, 'bag', 'Food & Snacks'],
      ['Cooking Oil 1L', '🛢️', 640, 520, 400, 'btl', 'Household'],
      ['Laundry Detergent 1Kg', '🧼', 480, 360, 250, 'pkt', 'Household'],
      ['Toothpaste 100g', '🦷', 230, 170, 350, 'pcs', 'Personal Care'],
      ['Shampoo Sachet Box (100)', '🧴', 640, 480, 180, 'box', 'Personal Care'],
      ['A4 Paper Ream 500 Sheets', '📄', 1750, 1450, 120, 'ream', 'Stationery'],
      ['USB-C Charging Cable', '🔌', 650, 380, 260, 'pcs', 'Electronics Accessories'],
      ['Tempered Glass Protector', '🛡️', 450, 220, 500, 'pcs', 'Mobile Accessories'],
      ['Earphones Wired OEM', '🎧', 580, 340, 300, 'pcs', 'Mobile Accessories'],
      ['Power Bank 10000mAh', '🔋', 3250, 2550, 90, 'pcs', 'Electronics Accessories']
    ],
    expenses: [
      ['Warehouse Rent - Monthly', 'Rent', 185000],
      ['Delivery Fleet Fuel', 'Logistics', 165000],
      ['Warehouse Electricity', 'Utilities', 38500],
      ['Rep & Van Driver Salaries', 'Salaries', 285000]
    ],
    hr: [
      ['Nimal Silva', 'Distribution Manager', '+94 77 888 1122', 128000, 'Active'],
      ['Sunil Perera', 'Sales Representative', '+94 71 888 3344', 62000, 'Active'],
      ['Roshan Fernando', 'Sales Representative', '+94 76 888 5566', 62000, 'Active'],
      ['Kasun Jayasuriya', 'Van Driver', '+94 77 888 7788', 48000, 'Active'],
      ['Priyantha Bandara', 'Van Driver', '+94 70 888 9900', 48000, 'Active'],
      ['Amal Wei', 'Warehouse Keeper', '+94 76 888 2233', 55000, 'Active']
    ]
  }
};

const BUSINESS_ORDER = ['restaurant', 'grocery', 'phone', 'computer', 'bookshop', 'pharmacy', 'salon', 'fashion', 'online', 'distribution'];

// ---------- Session helpers ----------
function getBusinessId() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const qBiz = urlParams.get('biz');
    if (qBiz && BUSINESS_PRESETS[qBiz] && qBiz !== 'distribution') {
      localStorage.setItem('pixel_business', qBiz);
      return qBiz;
    }
  } catch (e) {}
  try {
    const saved = localStorage.getItem('pixel_business');
    if (saved === 'distribution') {
      localStorage.removeItem('pixel_business');
      return null;
    }
    return saved;
  } catch (e) {
    return null;
  }
}
function setBusinessId(id) {
  try {
    if (id === 'distribution') {
      localStorage.removeItem('pixel_business');
    } else {
      localStorage.setItem('pixel_business', id);
    }
  } catch (e) {}
}
function getBusiness() {
  const id = getBusinessId();
  return BUSINESS_PRESETS[id] || null;
}

// ---------- Deterministic pseudo random so the demo is stable ----------
function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ---------- Catalog builder (turns compact tuples into full products) ----------
function buildCatalog(biz) {
  if (!biz) return [];
  const rand = seededRandom(biz.id.length * 7919 + 13);
  return biz.products.map((row, i) => {
    const [name, emoji, price, cost, stock, unit, category, extra = {}] = row;
    const id = `${biz.id}-p${i + 1}`;
    const attrs = Object.assign({}, extra.attrs || {});

    if (biz.expiryTracking && extra.months !== undefined) {
      const d = new Date();
      d.setDate(d.getDate() + Math.round(extra.months * 30.4));
      attrs.batch_no = extra.batch || `BT-${1000 + i}`;
      attrs.expiry_date = d.toISOString().split('T')[0];
    }
    if (biz.serialTracking === 'imei' && !extra.service) {
      attrs.imei = String(350000000000000 + Math.floor(rand() * 899999999999));
    }
    if (biz.serialTracking === 'serial' && !extra.service) {
      attrs.serial = `SN-${biz.id.slice(0, 2).toUpperCase()}${String(100000 + Math.floor(rand() * 899999))}`;
    }
    if (extra.isbn) {
      attrs.isbn = extra.isbn;
      attrs.author = extra.author || '';
      attrs.publisher = extra.publisher || '';
    }
    if (extra.warranty !== undefined) attrs.warranty_months = extra.warranty;
    if (extra.sizes) attrs.sizes = extra.sizes;
    if (extra.colors) attrs.colors = extra.colors;
    if (extra.prescription) attrs.prescription_required = true;

    return {
      id,
      name,
      emoji,
      sku: `${biz.id.slice(0, 3).toUpperCase()}-${1001 + i}`,
      barcode: `${biz.barcodePrefix}${String(10000 + i * 7)}${i}`,
      category,
      product_type: extra.service ? 'SERVICE' : 'PHYSICAL',
      price: Number(price),
      cost: Number(cost),
      stock_quantity: Number(stock),
      unit: unit || 'pcs',
      attributes: attrs
    };
  });
}

// ---------- Seed orders ----------
// A single shared customer directory keeps orders, credit bills and online
// fulfilment records pointing at the same people, so customer history lines up.
const CUSTOMER_DIRECTORY = [
  { name: 'K. Perera', phone: '+94 77 100 1001' },
  { name: 'Nimali Fernando', phone: '+94 71 100 1002' },
  { name: 'Saman Silva', phone: '+94 76 100 1003' },
  { name: 'Dilani Jayasuriya', phone: '+94 77 100 1004' },
  { name: 'Ruwan Dias', phone: '+94 71 100 1005' },
  { name: 'Iresha Gamage', phone: '+94 76 100 1006' },
  { name: 'Chathura Weerasinghe', phone: '+94 77 100 1007' },
  { name: 'Amaya Rathnayake', phone: '+94 71 100 1008' },
  { name: 'Apex Enterprises', phone: '+94 11 200 3001' },
  { name: 'Global Traders (Pvt) Ltd', phone: '+94 11 200 3002' }
];
const ORDER_CUSTOMER_POOL = CUSTOMER_DIRECTORY.map(c => c.name);
const ORDER_PAYMENTS = ['CASH', 'CARD', 'UPI'];

function customerPhoneFor(name) {
  const hit = CUSTOMER_DIRECTORY.find(c => c.name === name);
  return hit ? hit.phone : '';
}

function buildOrders(biz, catalog) {
  if (!catalog || catalog.length === 0) return [];
  const rand = seededRandom(biz.id.length * 104729 + 7);
  const taxRate = 0.08;
  const N = 26;

  // Target a healthy, profitable month of sales relative to this shop's expenses
  const monthlyExpenses = (biz.expenses || []).reduce((s, e) => s + Number(e[2] || 0), 0);
  const targetRevenue = monthlyExpenses * 1.65 + 25000;

  const weights = Array.from({ length: N }, () => 0.45 + rand());
  const wsum = weights.reduce((a, b) => a + b, 0);

  const orders = [];
  for (let i = 0; i < N; i++) {
    const orderTarget = (targetRevenue * weights[i]) / wsum;
    const lineMap = {};
    const items = [];
    let sum = 0;
    let guard = 0;
    while (sum < orderTarget && guard < 60) {
      guard++;
      const p = catalog[Math.floor(rand() * catalog.length)];
      const qty = 1 + Math.floor(rand() * 3);
      const lineTotal = p.price * qty;
      if (sum > 0 && sum + lineTotal > orderTarget * 1.3) break;
      if (lineMap[p.id]) {
        lineMap[p.id].quantity += qty;
        lineMap[p.id].total = Number((lineMap[p.id].quantity * p.price).toFixed(2));
      } else {
        const it = {
          product_id: p.id, name: p.name, emoji: p.emoji, quantity: qty,
          unit_price: p.price, total: Number(lineTotal.toFixed(2)), notes: ''
        };
        lineMap[p.id] = it;
        items.push(it);
      }
      sum += lineTotal;
    }
    if (items.length === 0) {
      const p = catalog[0];
      items.push({ product_id: p.id, name: p.name, emoji: p.emoji, quantity: 1, unit_price: p.price, total: Number(p.price.toFixed(2)), notes: '' });
    }

    const subtotal = items.reduce((s, it) => s + it.total, 0);
    const tax = Number((subtotal * taxRate).toFixed(2));
    const discount = i % 4 === 0 ? Number((subtotal * 0.05).toFixed(2)) : 0;
    const total = Number((subtotal + tax - discount).toFixed(2));

    // Spread across the last 30 days (index 0 = oldest)
    const dayOffset = 29 - Math.floor((i / N) * 29);
    const hourJitter = Math.floor(rand() * 9) + 9;
    const created = new Date();
    created.setDate(created.getDate() - dayOffset);
    created.setHours(hourJitter, Math.floor(rand() * 59), 0, 0);

    orders.push({
      id: `INV-${2000 + i}`,
      order_number: 2000 + i,
      customer_name: ORDER_CUSTOMER_POOL[i % ORDER_CUSTOMER_POOL.length],
      customer_phone: customerPhoneFor(ORDER_CUSTOMER_POOL[i % ORDER_CUSTOMER_POOL.length]),
      items,
      subtotal: Number(subtotal.toFixed(2)),
      tax_amount: tax,
      discount_amount: Number(discount.toFixed(2)),
      total_amount: total,
      total,
      payment_method: ORDER_PAYMENTS[i % ORDER_PAYMENTS.length],
      status: 'COMPLETED',
      created_at: created.toISOString()
    });
  }
  return orders;
}

function buildExpenses(biz) {
  if (!biz) return [];
  return biz.expenses.map((e, i) => ({
    id: `exp-${biz.id}-${i + 1}`,
    title: e[0],
    category: e[1],
    amount: Number(e[2]),
    expense_date: new Date(Date.now() - (i + 1) * 43200000).toISOString().split('T')[0],
    notes: ''
  }));
}

function buildHR(biz) {
  if (!biz) return [];
  return biz.hr.map((h, i) => ({
    id: `emp-${biz.id}-${i + 1}`,
    name: h[0],
    role: h[1],
    phone: h[2],
    salary: Number(h[3]),
    status: h[4],
    joined: new Date(Date.now() - (200 + i * 45) * 86400000).toISOString().split('T')[0],
    attendance: h[4] === 'On Leave' ? 'Leave' : 'Present'
  }));
}

function buildCredit(biz) {
  if (!biz) return [];
  const names = CUSTOMER_DIRECTORY.slice(0, 8).map(c => [c.name, c.phone]);
  const amounts = [24500, 8600, 42000, 12750, 5300, 31800, 9200, 17400];
  const paidRatios = [0, 0.4, 1, 0, 0.5, 0, 0.25, 1];
  const dueOffsets = [-45, -18, -30, 4, 12, -8, 27, -2];
  const base = Date.now();
  return names.map((n, i) => {
    const total = amounts[i];
    const paid = Math.round(total * paidRatios[i]);
    const issued = new Date(base - (Math.abs(dueOffsets[i]) + 30) * 86400000).toISOString().split('T')[0];
    const due = new Date(base + dueOffsets[i] * 86400000).toISOString().split('T')[0];
    return {
      id: `cred-${biz.id}-${i + 1}`,
      customer: n[0],
      phone: n[1],
      invoice: `INV-${1000 + i + 1}`,
      total,
      paid,
      issued,
      due,
      note: ''
    };
  });
}

function buildDoctors(biz) {
  if (!biz || !biz.doctors) return [];
  return biz.doctors.map((d, i) => ({
    id: `doc-${biz.id}-${i + 1}`,
    name: d[0],
    specialization: d[1],
    qualifications: d[2],
    phone: d[3],
    fee: Number(d[4]),
    room: d[5],
    days: d[6] || [],
    hours: d[7] || '',
    status: 'Active',
    patientsToday: 0
  }));
}

function buildAppointments(biz) {
  if (!biz || !biz.appointments) return [];
  const doctors = buildDoctors(biz);
  const today = new Date().toISOString().split('T')[0];
  return biz.appointments.map((a, i) => ({
    id: `apt-${biz.id}-${i + 1}`,
    patient: a[0],
    doctorId: doctors[a[1]] ? doctors[a[1]].id : '',
    doctorName: doctors[a[1]] ? doctors[a[1]].name : 'Unassigned',
    time: a[2],
    status: a[3],
    date: today,
    symptoms: ''
  }));
}

// ---------- Theme engine ----------
function applyTheme(biz) {
  if (!biz) return;
  const t = biz.theme;
  const root = document.documentElement;
  root.style.setProperty('--primary', t.primary);
  root.style.setProperty('--primary-dark', t.primaryDark);
  root.style.setProperty('--primary-rgb', t.primaryRgb);
  root.style.setProperty('--accent', t.accent);
  root.style.setProperty('--grad-from', t.gradFrom);
  root.style.setProperty('--grad-to', t.gradTo);
  root.style.setProperty('--glow', t.glow);
  document.body.setAttribute('data-biz', biz.id);
  document.title = `Pixel By Maliya POS — ${biz.name}`;
  const bar = document.querySelector('meta[name="theme-color"]');
  if (bar) bar.setAttribute('content', t.primary);
}

// ---------- Landing chooser ----------
function renderLanding() {
  const grid = document.getElementById('landing-grid');
  if (!grid) return;
  grid.innerHTML = BUSINESS_ORDER.map((id, i) => {
    const b = BUSINESS_PRESETS[id];
    const isDist = id === 'distribution';
    return `
      <button onclick="${isDist ? "window.location.href='../distribution/index.html'" : `chooseBusiness('${id}')`}"
        class="biz-card group relative overflow-hidden rounded-3xl p-6 text-left border ${isDist ? 'border-emerald-500/50 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/40 ring-1 ring-emerald-500/30' : 'border-white/10 bg-slate-900/70'} backdrop-blur-xl transition-all duration-300 hover:-translate-y-2"
        style="animation: fadeUp 0.6s ${i * 0.06}s both; --biz-glow: ${isDist ? '16 185 129' : b.theme.primaryRgb}">
        <div class="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-30 blur-2xl transition-opacity duration-300 group-hover:opacity-60"
             style="background: radial-gradient(circle, ${isDist ? '#10b981' : b.theme.primary}, transparent 70%)"></div>
        <div class="relative flex items-center justify-between">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
               style="background: linear-gradient(135deg, ${isDist ? '#059669, #10b981' : `${b.theme.gradFrom}, ${b.theme.gradTo}`})">
            <i class="fa-solid ${b.icon} text-white"></i>
          </div>
          <div class="flex flex-col items-end gap-1">
            <span class="text-3xl opacity-80 group-hover:scale-125 transition-transform duration-300">${b.emoji}</span>
            ${isDist ? '<span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">Enterprise Suite</span>' : ''}
          </div>
        </div>
        <h3 class="relative mt-5 text-lg font-extrabold text-white flex items-center gap-2">
          <span>${b.name}</span>
        </h3>
        <p class="relative mt-1 text-xs text-slate-400 leading-relaxed">${b.tagline}</p>
        <div class="relative mt-4 flex items-center text-xs font-bold" style="color:${isDist ? '#34d399' : b.theme.primary}">
          ${isDist ? 'Launch Enterprise DMS (14 Modules)' : 'Launch demo'} <i class="fa-solid ${isDist ? 'fa-arrow-up-right-from-square' : 'fa-arrow-right'} ml-2 transition-transform duration-300 group-hover:translate-x-1"></i>
        </div>
      </button>
    `;
  }).join('');
}

function chooseBusiness(id) {
  if (id === 'distribution') {
    window.location.href = '../distribution/index.html';
    return;
  }
  if (!BUSINESS_PRESETS[id]) return;
  setBusinessId(id);

  const landing = document.getElementById('landing-screen');
  const app = document.getElementById('main-app-container');
  if (landing) landing.classList.add('hidden');
  if (app) app.classList.remove('hidden');
  if (typeof onBusinessChanged === 'function') {
    onBusinessChanged(true);
  }
}

function showLanding() {
  const landing = document.getElementById('landing-screen');
  const app = document.getElementById('main-app-container');
  if (landing) { landing.classList.remove('hidden'); renderLanding(); }
  if (app) app.classList.add('hidden');
}

// ---------- Header switcher ----------
function renderBusinessSwitcher() {
  const menu = document.getElementById('biz-switcher-menu');
  const current = getBusiness();
  const label = document.getElementById('biz-switcher-label');
  if (label && current) label.innerText = current.short;
  const badge = document.getElementById('biz-switcher-icon');
  if (badge && current) badge.className = `fa-solid ${current.icon}`;
  if (!menu) return;
  menu.innerHTML = BUSINESS_ORDER.map(id => {
    const b = BUSINESS_PRESETS[id];
    const active = id === getBusinessId();
    return `
      <button onclick="switchBusiness('${id}')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${active ? 'bg-white/10' : 'hover:bg-white/5'}">
        <span class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs"
              style="background: linear-gradient(135deg, ${b.theme.gradFrom}, ${b.theme.gradTo})">
          <i class="fa-solid ${b.icon}"></i>
        </span>
        <span class="flex-1">
          <span class="block text-xs font-bold text-slate-100 flex items-center justify-between">
            <span>${b.name}</span>
            ${id === 'distribution' ? '<span class="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">Enterprise Suite</span>' : ''}
          </span>
        </span>
        ${active ? `<i class="fa-solid fa-check text-xs" style="color:${b.theme.primary}"></i>` : ''}
      </button>
    `;
  }).join('');
}

function toggleBizSwitcher(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('biz-switcher-menu');
  if (menu) menu.classList.toggle('hidden');
}

function switchBusiness(id) {
  if (id === 'distribution') {
    window.location.href = '../distribution/index.html';
    return;
  }
  setBusinessId(id);
  const menu = document.getElementById('biz-switcher-menu');
  if (menu) menu.classList.add('hidden');

  const app = document.getElementById('main-app-container');
  if (app) app.classList.remove('hidden');
  const landing = document.getElementById('landing-screen');
  if (landing) landing.classList.add('hidden');

  resetBusinessSession();
  if (typeof onBusinessChanged === 'function') {
    onBusinessChanged(false);
  }
}

// wipe per-business in-memory caches so the new industry reloads clean
function resetBusinessSession() {
  if (typeof cart !== 'undefined' && Array.isArray(cart)) cart = [];
  if (typeof activeCategoryFilter !== 'undefined') activeCategoryFilter = '';
  if (typeof availableProducts !== 'undefined') availableProducts = [];
  if (typeof currentPaymentMethod !== 'undefined') currentPaymentMethod = 'CASH';
  if (typeof chartInstance !== 'undefined' && chartInstance) { try { chartInstance.destroy(); } catch (e) {} chartInstance = null; }
  if (typeof categoryChartInstance !== 'undefined' && categoryChartInstance) { try { categoryChartInstance.destroy(); } catch (e) {} categoryChartInstance = null; }
}

document.addEventListener('click', () => {
  const menu = document.getElementById('biz-switcher-menu');
  if (menu && !menu.classList.contains('hidden')) menu.classList.add('hidden');
});
