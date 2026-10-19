/**
 * app.js - Unified Application Logic for Pixel by Maliya
 * Portfolio & Universal Cloud POS System
 */

/* ==================== STATE ==================== */
let currentMainTab = 'graphic';      // 'graphic' | 'web' | 'video' | 'pos'
let currentCategory = 'all';         // 'all' | 'logo' | 'visiting-card' | 'social-media' | 'banner' | 'printing'
let loadedProjects = [];
let currentLightboxImages = [];
let currentLightboxIndex = 0;

/* Built-in Rich Fallback Showcase Data (Ensures the site always looks rich even before Firestore loads) */
const DEFAULT_PROJECTS = [
    {
        id: 'p-pos-1',
        type: 'pos',
        title: 'Pixel Universal POS — Supermarket & Retail Edition',
        description: 'Universal Point of Sale software engineered for fast barcode checkouts, cash/card splits, inventory alerts, and LKR thermal receipt printing. Available in 100% Offline, Cloud & Hybrid sync modes.',
        image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
        tech: 'Offline & Cloud Sync, Thermal Print, Barcode',
        demoUrl: 'pos/index.html'
    },
    {
        id: 'p-pos-2',
        type: 'pos',
        title: 'Restaurant & Dining POS (Offline / Hybrid Sync)',
        description: 'Multi-table dining system with kitchen order tickets, automated discount calculations, and daily cash-drawer closing reports. Full offline local reliability with cloud backups.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        tech: 'KOT Printing, Table Billing, Offline Ready',
        demoUrl: 'pos/index.html'
    },
    {
        id: 'p-pos-3',
        type: 'pos',
        title: 'FMCG Wholesale Distribution & Lorry Van Sales SFA',
        description: 'Field sales automation with Android mobile spot-billing, lorry stock loading & day-end balance reconciliation, tiered quantity price slabs, and dealer credit ledger.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        tech: 'Van Sales App, Lorry Stock, Bluetooth Print, Credit Aging',
        demoUrl: 'pos/index.html'
    },
    {
        id: 'p-1',
        type: 'graphic',
        category: 'visiting-card',
        title: 'Downsouth Car Rental — Premium Visiting Cards',
        description: 'High-end matte finish double-sided visiting cards with luxury embossing and vector typography for automotive rental brand.',
        image: 'https://i.ibb.co/FqJrN9N2/PXL-20260209-185723338.jpg',
        images: ['https://i.ibb.co/FqJrN9N2/PXL-20260209-185723338.jpg']
    },
    {
        id: 'p-2',
        type: 'graphic',
        category: 'logo',
        title: 'Apex Digital Marketing — Corporate Identity',
        description: 'Minimalist brand identity kit including vector mark, primary logo lockup, color system, and business collateral.',
        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
        images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80']
    },
    {
        id: 'p-3',
        type: 'graphic',
        category: 'banner',
        title: 'Grand Opening Flex Banner — 8x4 ft Outdoor',
        description: 'Vibrant outdoor weather-resistant vinyl banner with eye-catching typography, grommet markers, and high-impact visual contrast.',
        image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
        images: ['https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80']
    },
    {
        id: 'p-4',
        type: 'graphic',
        category: 'social-media',
        title: 'Ceylon Gourmet — Instagram & Facebook Campaign Kit',
        description: 'Set of 12 branded social media templates, promotional banners, and story graphics with consistent aesthetic themes.',
        image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
        images: ['https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80']
    },
    {
        id: 'p-5',
        type: 'web',
        title: 'Apex Cloud Logistics Web Portal',
        description: 'Modern corporate website with dynamic shipment tracking, interactive pricing calculator, and mobile responsive dashboard.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        tech: 'Tailwind CSS, JavaScript, Responsive UI, Vercel',
        url: '#'
    },
    {
        id: 'p-6',
        type: 'web',
        title: 'Serendib Luxury Villas & Resorts',
        description: 'Boutique hotel booking showcase featuring direct inquiry integration, full-screen room galleries, and multilingual support.',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        tech: 'HTML5, Glassmorphic UI, Booking Flow',
        url: '#'
    },
    {
        id: 'p-7',
        type: 'video',
        title: 'Urban Streetwear Promo Reel',
        description: 'High-energy 9:16 vertical commercial with kinetic typography, beat synchronization, and cinematic color grading.',
        image: 'video_placeholder.png',
        url: '#'
    }
];

/* Industry details for the interactive POS showcase preview */
const POS_INDUSTRIES = {
    grocery: {
        badge: 'SUPERMARKET & RETAIL',
        title: 'Lightning-Fast Barcode & Touch Checkout',
        desc: 'Engineered for high-volume retail and high-speed queues. Scan barcodes in milliseconds, calculate instant bulk discounts, handle cash, card or customer credit tabs, and print branded thermal receipts in Sri Lankan Rupees (LKR).',
        storeName: 'Pixel Fresh Supermarket',
        features: [
            { icon: 'fas fa-desktop', title: 'Dual-Screen & LankaQR', desc: 'Secondary customer monitor with live bill preview, promo ads & instant LankaQR.' },
            { icon: 'fas fa-barcode', title: 'Barcode & Scale Integration', desc: 'Honeywell, Zebra scanners + RS232 electronic scale produce auto-weighing.' },
            { icon: 'fas fa-network-wired', title: 'Multi-Register LAN Clustering', desc: 'Up to 20 billing counters sync locally via LAN even if internet cable is cut.' },
            { icon: 'fas fa-brain', title: 'AI Demand & Auto-Reorder', desc: 'Predicts stock depletion and auto-generates supplier purchase orders (PO).' },
            { icon: 'fas fa-user-shield', title: 'Anti-Theft Void & Audit Trail', desc: 'Price overrides, voids and drawer opens logged with supervisor PIN; owner alerts.' },
            { icon: 'fas fa-book-bookmark', title: 'Smart ණය පොත (Credit Ledger)', desc: 'Credit limits, overdue aging & SMS reminders sent under YOUR Business Name.' },
            { icon: 'fab fa-whatsapp', title: 'Branded SMS & WhatsApp Bills', desc: 'Send receipts & promo SMS with YOUR official Business Name as the Sender ID.' },
            { icon: 'fas fa-boxes-stacked', title: 'Batch, Expiry & FEFO Inventory', desc: 'FIFO/FEFO stock rotation, expiry countdown radar & supplier damaged returns.' },
            { icon: 'fas fa-mobile-screen-button', title: 'Live Owner Mobile Portal', desc: 'Monitor real-time sales, gross profit margin %, and cashier shifts anywhere.' },
            { icon: 'fas fa-receipt', title: '80mm Thermal & Split Tender', desc: 'High-speed auto-cut print in Sinhala/English + Split Cash, Card & LankaQR.' }
        ],
        items: [
            { name: 'Samba Rice 1Kg', stock: '150 kg', price: 'Rs. 240' },
            { name: 'Cream Cracker 190g', stock: '85 pcs', price: 'Rs. 180' },
            { name: 'Full Cream Milk 400g', stock: '40 pcs', price: 'Rs. 1,050' },
            { name: 'Ceylon BOP Tea', stock: '300 cup', price: 'Rs. 150' }
        ]
    },
    distribution: {
        badge: 'WHOLESALE & FMCG DISTRIBUTION',
        title: 'Enterprise Distribution, Van Sales & Route SFA',
        desc: 'Engineered for FMCG distributors, agencies, wholesale importers, and mobile van sales. Manage lorry stock loading, on-the-spot bluetooth invoice printing, multi-tier wholesale price slabs, and shop-wise credit outstanding recovery.',
        storeName: 'Apex Lanka Mega Distributors (Route: Galle - Matara)',
        features: [
            { icon: 'fas fa-truck-fast', title: 'Van Sales & Spot Billing', desc: 'Android mobile app for spot-billing with belt-clip Bluetooth thermal printer.' },
            { icon: 'fas fa-layer-group', title: 'Multi-Tier Wholesale Price Slabs', desc: 'Tiered volume pricing (1-5 boxes vs 20+ master cartons) & dealer rates.' },
            { icon: 'fas fa-gift', title: 'Free-Issue & Trade Deals (BOGO)', desc: 'Automate schemes like "Buy 10 Get 1 Free" with brand promotion budgets.' },
            { icon: 'fas fa-truck-ramp-box', title: 'Lorry Stock Load & Day-End Balancing', desc: 'Morning loading vs evening stock return; flags cash & item shortages immediately.' },
            { icon: 'fas fa-money-check-dollar', title: 'Dealer Credit Ceilings & PDC Cheques', desc: 'Strict 21/30 day overdue limits & SMS alerts sent under your Agency Name.' },
            { icon: 'fas fa-route', title: 'GPS Route Beat & Geo-Fenced Check-in', desc: 'Assign daily beats and verify reps physically visited shops on the route.' },
            { icon: 'fas fa-box-archive', title: 'Damaged Goods & RTV Claims', desc: 'Segregate damaged & expired stock to claim reimbursements from suppliers.' },
            { icon: 'fas fa-chart-pie', title: 'Agency & Brand Margin Profitability', desc: 'Track sales targets, rep collection commissions & brand-wise gross margins.' },
            { icon: 'fas fa-pallet', title: 'Warehouse Pallet & FEFO Picking', desc: 'Bulk warehouse bin/pallet barcode picking to eliminate expired stock dispatch.' },
            { icon: 'fas fa-comment-sms', title: 'Branded SMS & Bluetooth Print', desc: 'Dispatch invoice alerts with YOUR Company Name as Sender ID + instant print.' }
        ],
        items: [
            { name: 'Maliban Biscuit Carton (24 pkts)', stock: '120 Cartons', price: 'Rs. 4,800' },
            { name: 'Detergent Powder Box (12 pcs)', stock: '85 Boxes', price: 'Rs. 3,600' },
            { name: 'Cooking Oil 1L Crate (10 Btls)', stock: '60 Crates', price: 'Rs. 6,500' },
            { name: 'Ceylon BOP Tea Bulk (5kg)', stock: '40 Bags', price: 'Rs. 5,200' }
        ]
    },
    restaurant: {
        badge: 'RESTAURANT & CAFE',
        title: 'Table Management & Kitchen Order Tickets (KOT)',
        desc: 'Built for busy dining rooms, fast takeaway counters, and cloud kitchens. Manage live table layouts, kitchen printing routes, bill splitting, and automated food ingredient cost deductions.',
        storeName: 'Maliya Bistro & Cafe',
        features: [
            { icon: 'fas fa-utensils', title: 'Kitchen Order Tickets (KOT)', desc: 'Auto-route food orders directly to kitchen & drink orders to the bar printer.' },
            { icon: 'fas fa-chair', title: 'Interactive Floor & Table Map', desc: 'Visual dine-in tables, live occupancy status, and table merge/transfer.' },
            { icon: 'fas fa-tablet-screen-button', title: 'Waiter Mobile Ordering', desc: 'Captains can take orders tableside via any smartphone or Android tablet.' },
            { icon: 'fas fa-pizza-slice', title: 'Modifiers & Recipe Costing', desc: 'Manage portion sizes, spicy levels, extra toppings & auto ingredient deduction.' },
            { icon: 'fas fa-receipt', title: 'Split Bill & Service Charge', desc: 'Split checks by seat or evenly with customizable 10% service charge.' },
            { icon: 'fab fa-whatsapp', title: 'Branded SMS & WhatsApp Invoices', desc: 'Send digital bills & booking SMS with YOUR Restaurant Name as the sender.' },
            { icon: 'fas fa-motorcycle', title: 'Takeaway & Delivery Queue', desc: 'Manage PickMe Food and Uber Eats delivery riders with ticket numbers.' },
            { icon: 'fas fa-qrcode', title: 'LankaQR & Cashier Drawer Log', desc: 'Accept FriMi, Genie, Q+ LankaQR with automated cash drawer shift closing.' },
            { icon: 'fas fa-clock', title: 'Dynamic Happy Hour Specials', desc: 'Automate timed promotional discounts and special beverage combos.' },
            { icon: 'fas fa-boxes-packing', title: 'Kitchen Recipe Ingredient Inventory', desc: 'Auto-deduct raw flour, chicken, and cheese when meals are ordered.' }
        ],
        items: [
            { name: 'Chicken Cheese Kottu', stock: 'Portion', price: 'Rs. 1,450' },
            { name: 'Mixed Fried Rice', stock: 'Portion', price: 'Rs. 1,650' },
            { name: 'Iced Milo Dinosaur', stock: 'Glass', price: 'Rs. 350' },
            { name: 'Garlic Butter Prawns', stock: 'Portion', price: 'Rs. 1,850' }
        ]
    },
    pharmacy: {
        badge: 'PHARMACY & HEALTHCARE',
        title: 'Prescription Tracking & Batch Expiry Radar',
        desc: 'Full regulatory compliance with medicine batch management, expiry date warnings, doctor prescription archiving, and generic-to-brand cross reference search.',
        storeName: 'Lanka Care Pharmacy',
        features: [
            { icon: 'fas fa-prescription', title: 'Generic & Brand Formula Search', desc: 'Instantly find alternatives by active chemical component or trade brand.' },
            { icon: 'fas fa-calendar-xmark', title: 'Batch & Expiry Date Radar', desc: 'Early warning alerts for expiring batches; prevents dispensing expired items.' },
            { icon: 'fas fa-file-medical', title: 'Doctor Prescription Archiving', desc: 'Capture and link doctor prescriptions to patient health records digitally.' },
            { icon: 'fas fa-pills', title: 'Blister Pack & Strip Breakdown', desc: 'Sell by box, strip, or individual tablet with automatic inventory conversion.' },
            { icon: 'fas fa-book-bookmark', title: 'Patient Credit Ledger (ණය පොත)', desc: 'Track regular patient medication dues with automated SMS reminder alerts.' },
            { icon: 'fab fa-whatsapp', title: 'Branded SMS & WhatsApp Dosage', desc: 'Send dosage schedules & refill SMS with YOUR Pharmacy Name as the sender.' },
            { icon: 'fas fa-truck-ramp-box', title: 'Supplier GRN & Auto-Reorder', desc: 'Generate purchase orders (PO) when stock hits minimum safety levels.' },
            { icon: 'fas fa-shield-virus', title: 'Schedule Drug Audit Logs', desc: 'Secure tracking and supervisor approval for regulated narcotics & antibiotics.' },
            { icon: 'fas fa-tags', title: 'Wholesale & Retail Dual Pricing', desc: 'Switch instantly between retail patient pricing and wholesale clinic rates.' },
            { icon: 'fas fa-temperature-arrow-down', title: 'Temperature & Sensitive Tags', desc: 'Flag refrigerated insulin and vaccines for proper storage handling.' }
        ],
        items: [
            { name: 'Paracetamol 500mg', stock: '500 tabs', price: 'Rs. 75' },
            { name: 'Vitamin C 500mg (100s)', stock: '45 packs', price: 'Rs. 650' },
            { name: 'Amoxicillin 250mg', stock: '120 caps', price: 'Rs. 320' },
            { name: 'Digital Thermometer', stock: '25 pcs', price: 'Rs. 1,200' }
        ]
    },
    salon: {
        badge: 'SALON & WELLNESS SPA',
        title: 'Stylist Appointments & Service Packages',
        desc: 'Tailored for beauty salons, barbershops, and spas. Schedule appointments, calculate beautician commissions, package bridal services, and upsell retail cosmetic inventory.',
        storeName: 'Pixel Glamour Salon',
        features: [
            { icon: 'fas fa-calendar-check', title: 'Stylist Appointment Calendar', desc: 'Track chair bookings, time slots, and prevent overlapping reservations.' },
            { icon: 'fas fa-percentage', title: 'Staff Commission Tracking', desc: 'Automated staff commission calculation per service and product sale.' },
            { icon: 'fas fa-spa', title: 'Custom Packages & Bridal Bundles', desc: 'Bundle multiple hair, skin, and makeup services into discounted packages.' },
            { icon: 'fas fa-bottle-droplet', title: 'Retail Product Inventory', desc: 'Track salon shampoos, serums, and cosmetics with barcode scanner sales.' },
            { icon: 'fas fa-comment-sms', title: 'Branded SMS Booking Reminders', desc: 'Send booking confirmation & reminder SMS with YOUR Salon Name as Sender ID.' },
            { icon: 'fab fa-whatsapp', title: 'WhatsApp Invoices & Care Tips', desc: 'Send elegant branded receipts and post-treatment care tips to WhatsApp.' },
            { icon: 'fas fa-user-clock', title: 'Client History & Preferences', desc: 'Log client hair color formulas, preferred stylists, and past visit notes.' },
            { icon: 'fas fa-wallet', title: 'Gift Vouchers & Membership Tabs', desc: 'Issue gift cards, membership packages, and loyalty reward points.' },
            { icon: 'fas fa-stopwatch', title: 'Service Duration & Chair Rotation', desc: 'Monitor average treatment times to optimize salon seating capacity.' },
            { icon: 'fas fa-qrcode', title: 'Split Tender & LankaQR', desc: 'Split tips and service fees across Cash, Visa/Mastercard & QR.' }
        ],
        items: [
            { name: 'Executive Haircut & Wash', stock: '45 mins', price: 'Rs. 1,800' },
            { name: 'Hydra Facial Treatment', stock: '60 mins', price: 'Rs. 4,500' },
            { name: 'Beard Trim & Styling', stock: '20 mins', price: 'Rs. 850' },
            { name: 'Keratin Hair Serum 100ml', stock: '18 pcs', price: 'Rs. 2,900' }
        ]
    },
    fashion: {
        badge: 'CLOTHING & BOUTIQUE',
        title: 'Size, Color & Barcode Tag Management',
        desc: 'Optimized for apparel, footwear, and accessory boutiques. Manage matrix inventory across sizes (S/M/L/XL/XXL) and colors, print barcode clothing tags, and run seasonal sales.',
        storeName: 'Urban Trend Boutique',
        features: [
            { icon: 'fas fa-tags', title: 'Matrix Variants (Size & Color)', desc: 'Multi-dimensional SKU tracking for every size, color, fit, and fabric type.' },
            { icon: 'fas fa-barcode', title: 'Barcode Clothing Tag Printing', desc: 'Generate and print thermal barcode hang-tags and price stickers in-store.' },
            { icon: 'fas fa-gift', title: 'Seasonal Promotions & BOGO', desc: 'Configure Buy-1-Get-1, percentage discounts, and clearance bundles easily.' },
            { icon: 'fas fa-arrow-right-arrow-left', title: 'Exchanges & Credit Notes', desc: 'Frictionless customer returns, exchange billings, and store credit tabs.' },
            { icon: 'fas fa-store', title: 'Multi-Branch Stock Transfer', desc: 'Check stock in other boutique branches and initiate Inter-Branch Transfers.' },
            { icon: 'fab fa-whatsapp', title: 'Branded SMS & WhatsApp VIP Alerts', desc: 'Send receipts & VIP arrival alerts with YOUR Fashion Brand Name as sender.' },
            { icon: 'fas fa-chart-line', title: 'Slow & Fast Moving Stock KPIs', desc: 'Identify dead stock and high-margin bestsellers to optimize purchasing.' },
            { icon: 'fas fa-shield-halved', title: 'Anti-Theft Cashier Surveillance', desc: 'Every price discount override and canceled bill requires supervisor PIN.' },
            { icon: 'fas fa-scissors', title: 'Garment Alteration Work Orders', desc: 'Track tailoring and hem adjustments linked to the customer purchase receipt.' },
            { icon: 'fas fa-credit-card', title: 'Split Tender & Gift Vouchers', desc: 'Split customer payment between cash, debit card, and branded gift cards.' }
        ],
        items: [
            { name: 'Slim Fit Cotton Shirt (L)', stock: '24 pcs', price: 'Rs. 3,450' },
            { name: 'Denim Jeans Regular (32)', stock: '15 pcs', price: 'Rs. 4,800' },
            { name: 'Graphic Casual Tee (M)', stock: '35 pcs', price: 'Rs. 2,100' },
            { name: 'Leather Formal Belt', stock: '12 pcs', price: 'Rs. 1,950' }
        ]
    },
    services: {
        badge: 'PRINTING & DIGITAL SERVICES',
        title: 'Custom Job Sheets & Milestone Invoicing',
        desc: 'Engineered for graphic design studios, printing presses, flex workshops, and repair centers. Manage custom quotations, track job orders from deposit to completion.',
        storeName: 'Pixel by Maliya Studio',
        features: [
            { icon: 'fas fa-clipboard-list', title: 'Job Sheets & Work Orders', desc: 'Create custom printing/design job tickets with deadlines and technical specs.' },
            { icon: 'fas fa-hand-holding-dollar', title: 'Advance Deposits & Balance Tabs', desc: 'Collect advance payments and automatically generate balance bills upon delivery.' },
            { icon: 'fas fa-calculator', title: 'Custom Measurement Pricing', desc: 'Calculate dynamic pricing for flex banners (sq ft) and bulk paper batches.' },
            { icon: 'fas fa-book-bookmark', title: 'Corporate Client Ledger (ණය පොත)', desc: 'Track credit accounts for recurring corporate business clients with terms.' },
            { icon: 'fab fa-whatsapp', title: 'Branded SMS & WhatsApp Estimates', desc: 'Send estimates, receipts & completion SMS under YOUR official Business Name.' },
            { icon: 'fas fa-truck', title: 'Delivery & Proof of Handover', desc: 'Mark jobs as Printed, Quality Checked, and Dispatched with digital signatures.' },
            { icon: 'fas fa-clock', title: 'Milestone Progress Tracker', desc: 'Keep track of designer/technician hours and project delivery deadlines.' },
            { icon: 'fas fa-qrcode', title: 'LankaQR & Direct Bank Transfer', desc: 'Accept direct LankaQR, FriMi, Genie, and wire transfer payment proofs.' },
            { icon: 'fas fa-trash-can', title: 'Raw Material Wastage Tracking', desc: 'Calculate paper sheet off-cuts and flex vinyl roll usage per job.' },
            { icon: 'fas fa-user-lock', title: 'Cashier PIN & Day-End Z-Report', desc: 'Separate petty cash from design advance payments with strict balance logs.' }
        ],
        items: [
            { name: 'Corporate Logo Package', stock: 'Package', price: 'Rs. 8,500' },
            { name: 'Flex Banner Print (6x3 ft)', stock: 'Banner', price: 'Rs. 3,200' },
            { name: 'Visiting Cards (1000 pcs)', stock: 'Box', price: 'Rs. 4,500' },
            { name: 'A4 Color Laser Print', stock: 'Page', price: 'Rs. 50' }
        ]
    }
};

/* ==================== INIT ==================== */
document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initRevealAnimations();
    animateStats();
    initKeyboardShortcuts();
    renderPortfolio();
});

/* ==================== NAVBAR SCROLL ==================== */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('shadow-md', 'bg-white/95');
            navbar.classList.remove('bg-white/88');
        } else {
            navbar.classList.remove('shadow-md', 'bg-white/95');
            navbar.classList.add('bg-white/88');
        }
    });
}

/* ==================== STATS ANIMATION ==================== */
function animateStats() {
    // 1. Design Projects -> 200+
    const elDesign = document.getElementById('stat-design-projects');
    if (elDesign) {
        let countDesign = 0;
        const targetDesign = 200;
        const timerDesign = setInterval(() => {
            countDesign += 5;
            if (countDesign >= targetDesign) {
                countDesign = targetDesign;
                clearInterval(timerDesign);
                elDesign.textContent = countDesign + '+';
            } else {
                elDesign.textContent = countDesign + '+';
            }
        }, 25);
    }

    // 2. POS Projects -> 100+
    const elPos = document.getElementById('stat-pos-projects');
    if (elPos) {
        let countPos = 0;
        const targetPos = 100;
        const timerPos = setInterval(() => {
            countPos += 3;
            if (countPos >= targetPos) {
                countPos = targetPos;
                clearInterval(timerPos);
                elPos.textContent = countPos + '+';
            } else {
                elPos.textContent = countPos + '+';
            }
        }, 30);
    }
}

/* ==================== REVEAL ON SCROLL ==================== */
function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

/* ==================== MAIN PORTFOLIO TABS ==================== */
function switchMainTab(tab) {
    currentMainTab = tab;

    document.querySelectorAll('.main-tab').forEach(btn => {
        btn.classList.remove('active-main-tab');
    });
    const activeBtn = document.getElementById('tab-' + tab);
    if (activeBtn) activeBtn.classList.add('active-main-tab');

    // Show/hide tab panels
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    const targetContent = document.getElementById('content-' + tab);
    if (targetContent) targetContent.classList.remove('hidden');

    renderPortfolio();
}

/* ==================== CATEGORY FILTER ==================== */
function filterCategory(cat) {
    currentCategory = cat;

    document.querySelectorAll('.cat-filter').forEach(btn => {
        btn.classList.remove('active-cat-filter');
    });
    const activeBtn = document.querySelector(`[data-cat="${cat}"]`);
    if (activeBtn) activeBtn.classList.add('active-cat-filter');

    renderPortfolio();
}

/* ==================== RENDER PORTFOLIO ==================== */
async function renderPortfolio() {
    try {
        let projects = [];

        // Check if DB is initialized
        if (typeof DB !== 'undefined' && DB && typeof DB.getProjects === 'function') {
            try {
                const res = await DB.getProjects();
                if (Array.isArray(res) && res.length > 0) {
                    projects = res;
                }
            } catch (err) {
                console.warn('Firestore fetch failed, using curated showcase projects:', err.message);
            }
        }

        // Merge with built-in default showcase data if empty or missing types
        if (projects.length === 0) {
            projects = DEFAULT_PROJECTS;
        } else {
            // Ensure we have POS showcase projects included
            const hasPos = projects.some(p => p.type === 'pos');
            if (!hasPos) {
                projects = [...projects, ...DEFAULT_PROJECTS.filter(p => p.type === 'pos')];
            }
        }

        loadedProjects = projects;

        if (currentMainTab === 'graphic') {
            renderGraphicGrid(projects.filter(p => p.type === 'graphic'));
        } else if (currentMainTab === 'web') {
            renderWebGrid(projects.filter(p => p.type === 'web'));
        } else if (currentMainTab === 'video') {
            renderVideoGrid(projects.filter(p => p.type === 'video'));
        } else if (currentMainTab === 'pos') {
            renderPosGrid(projects.filter(p => p.type === 'pos'));
        }
    } catch (err) {
        console.error('Error rendering portfolio:', err);
    }
}

function renderGraphicGrid(projects) {
    const grid = document.getElementById('graphicGrid');
    const empty = document.getElementById('graphicEmpty');
    if (!grid) return;

    const filtered = currentCategory === 'all'
        ? projects
        : projects.filter(p => p.category === currentCategory);

    if (filtered.length === 0) {
        grid.innerHTML = '';
        if (empty) empty.classList.remove('hidden');
        return;
    }

    if (empty) empty.classList.add('hidden');
    grid.innerHTML = filtered.map(p => createGraphicCard(p)).join('');
}

function renderWebGrid(projects) {
    const grid = document.getElementById('webGrid');
    const empty = document.getElementById('webEmpty');
    if (!grid) return;

    if (projects.length === 0) {
        grid.innerHTML = '';
        if (empty) empty.classList.remove('hidden');
        return;
    }

    if (empty) empty.classList.add('hidden');
    grid.innerHTML = projects.map(p => createWebCard(p)).join('');
}

function renderVideoGrid(projects) {
    const grid = document.getElementById('videoGrid');
    const empty = document.getElementById('videoEmpty');
    if (!grid) return;

    if (projects.length === 0) {
        grid.innerHTML = '';
        if (empty) empty.classList.remove('hidden');
        return;
    }

    if (empty) empty.classList.add('hidden');
    grid.innerHTML = projects.map(p => createVideoCard(p)).join('');
}

function renderPosGrid(projects) {
    const grid = document.getElementById('posGrid');
    const empty = document.getElementById('posEmpty');
    if (!grid) return;

    if (projects.length === 0) {
        grid.innerHTML = '';
        if (empty) empty.classList.remove('hidden');
        return;
    }

    if (empty) empty.classList.add('hidden');
    grid.innerHTML = projects.map(p => createPosCard(p)).join('');
}

/* ==================== CARD GENERATORS (LUXURY WHITE) ==================== */
function createGraphicCard(p) {
    const catLabels = {
        'logo': 'Logo Design',
        'visiting-card': 'Visiting Card',
        'social-media': 'Social Media',
        'banner': 'Outdoor Banner',
        'printing': 'Print Media'
    };
    const label = catLabels[p.category] || (p.category ? p.category.replace('-', ' ') : 'Design');

    return `
    <div class="portfolio-card group cursor-pointer" onclick="openLightbox('${p.id}')">
        <div class="overflow-hidden aspect-[4/3] bg-slate-100 relative">
            <img src="${escapeHtml(p.image || '')}" 
                 alt="${escapeHtml(p.title)}" 
                 loading="lazy" 
                 class="w-full h-full object-cover"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22><rect fill=%22%23f1f5f9%22 width=%22400%22 height=%22300%22/><text x=%22200%22 y=%22150%22 fill=%22%2394a3b8%22 text-anchor=%22middle%22 font-size=%2214%22>Image</text></svg>'" />
            <div class="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div class="w-10 h-10 rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center text-sm">
                    <i class="fas fa-expand"></i>
                </div>
            </div>
        </div>
        <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
                <span class="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200 mb-2 uppercase tracking-wide">${escapeHtml(label)}</span>
                <h3 class="font-display font-bold text-slate-900 text-sm leading-snug">${escapeHtml(p.title)}</h3>
                ${p.description ? `<p class="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">${escapeHtml(p.description)}</p>` : ''}
            </div>
            <div class="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span>Pixel by Maliya</span>
                <span class="text-brand-600 font-bold group-hover:translate-x-0.5 transition-transform">View Full <i class="fas fa-arrow-right text-[9px]"></i></span>
            </div>
        </div>
    </div>`;
}

function createWebCard(p) {
    const techList = p.tech ? p.tech.split(',').map(t => t.trim()).filter(Boolean) : [];

    return `
    <div class="portfolio-card group">
        <div class="overflow-hidden aspect-video bg-slate-100 relative cursor-pointer" onclick="openLightbox('${p.id}')">
            <img src="${escapeHtml(p.image || '')}" 
                 alt="${escapeHtml(p.title)}" 
                 loading="lazy" 
                 class="w-full h-full object-cover"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22340%22><rect fill=%22%23f1f5f9%22 width=%22600%22 height=%22340%22/><text x=%22300%22 y=%22170%22 fill=%22%2394a3b8%22 text-anchor=%22middle%22 font-size=%2214%22>Preview</text></svg>'" />
            <div class="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div class="w-10 h-10 rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center text-sm">
                    <i class="fas fa-expand"></i>
                </div>
            </div>
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
                <span class="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-accent-50 text-accent-700 border border-accent-200 mb-2 uppercase tracking-wide">Web Development</span>
                <h3 class="font-display font-bold text-slate-900 text-lg leading-tight mb-2">${escapeHtml(p.title)}</h3>
                ${p.description ? `<p class="text-slate-600 text-xs sm:text-sm mb-4 leading-relaxed">${escapeHtml(p.description)}</p>` : ''}
                ${techList.length > 0 ? `
                <div class="flex flex-wrap gap-1.5 mb-4">
                    ${techList.map(t => `<span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">${escapeHtml(t)}</span>`).join('')}
                </div>` : ''}
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <a href="${escapeHtml(p.url || '#')}" target="_blank" class="text-brand-600 font-bold text-xs inline-flex items-center gap-1.5 hover:gap-2 transition-all">
                    <span>Explore Live Site</span>
                    <i class="fas fa-external-link-alt text-[10px]"></i>
                </a>
                <a href="https://wa.me/94716125715?text=Hi%20Maliya,%20I%20like%20this%20web%20project:%20${encodeURIComponent(p.title)}" target="_blank" class="text-slate-400 hover:text-emerald-600 text-xs font-semibold">
                    <i class="fab fa-whatsapp"></i> Inquire
                </a>
            </div>
        </div>
    </div>`;
}

function createVideoCard(p) {
    return `
    <div class="portfolio-card group">
        <div class="relative overflow-hidden aspect-video bg-slate-900 cursor-pointer" onclick="openLightbox('${p.id}')">
            <img src="${escapeHtml(p.image || 'video_placeholder.png')}" 
                 alt="${escapeHtml(p.title)}" 
                 loading="lazy" 
                 class="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                 onerror="this.src='video_placeholder.png'" />
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-12 h-12 rounded-full bg-white/90 text-slate-900 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i class="fas fa-play text-sm ml-0.5"></i>
                </div>
            </div>
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
                <span class="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 mb-2 uppercase tracking-wide">Video &amp; Motion</span>
                <h3 class="font-display font-bold text-slate-900 text-base leading-snug mb-2">${escapeHtml(p.title)}</h3>
                ${p.description ? `<p class="text-slate-600 text-xs leading-relaxed line-clamp-2">${escapeHtml(p.description)}</p>` : ''}
            </div>
            <div class="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button onclick="openLightbox('${p.id}')" class="text-rose-600 font-bold text-xs inline-flex items-center gap-1.5">
                    <span>Watch Preview</span>
                    <i class="fas fa-play text-[9px]"></i>
                </button>
            </div>
        </div>
    </div>`;
}

function createPosCard(p) {
    const demoLink = p.demoUrl || 'pos/index.html';
    const techList = p.tech ? p.tech.split(',').map(t => t.trim()).filter(Boolean) : [];

    return `
    <div class="portfolio-card group border-emerald-200/80 bg-white">
        <div class="relative overflow-hidden aspect-video bg-slate-100 cursor-pointer" onclick="window.open('${escapeHtml(demoLink)}', '_blank')">
            <img src="${escapeHtml(p.image || '')}" 
                 alt="${escapeHtml(p.title)}" 
                 loading="lazy" 
                 class="w-full h-full object-cover"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22340%22><rect fill=%22%23ecfdf5%22 width=%22600%22 height=%22340%22/><text x=%22300%22 y=%22170%22 fill=%22%23059669%22 text-anchor=%22middle%22 font-size=%2216%22>Pixel Cloud POS</text></svg>'" />
            <div class="absolute inset-0 bg-emerald-950/20 group-hover:bg-emerald-950/40 transition-all flex items-center justify-center">
                <div class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center gap-2 group-hover:scale-105 transition-transform">
                    <i class="fas fa-desktop"></i>
                    <span>Launch Live Interactive POS</span>
                </div>
            </div>
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
                <div class="flex items-center justify-between mb-2">
                    <span class="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">Cloud · Offline · Hybrid POS</span>
                    <span class="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live App
                    </span>
                </div>
                <h3 class="font-display font-bold text-slate-900 text-lg leading-snug mb-2">${escapeHtml(p.title)}</h3>
                <p class="text-slate-600 text-xs sm:text-sm mb-4 leading-relaxed">${escapeHtml(p.description)}</p>
                ${techList.length > 0 ? `
                <div class="flex flex-wrap gap-1.5 mb-4">
                    ${techList.map(t => `<span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-100">${escapeHtml(t)}</span>`).join('')}
                </div>` : ''}
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <a href="${escapeHtml(demoLink)}" class="btn-luxury-pos px-4 py-2 rounded-lg text-xs font-bold">
                    <i class="fas fa-cash-register text-[10px]"></i>
                    <span>Open Live Terminal</span>
                </a>
                <a href="https://wa.me/94716125715?text=Hi%20Maliya,%20I%20am%20interested%20in%20the%20${encodeURIComponent(p.title)}" target="_blank" class="text-xs font-bold text-slate-700 hover:text-emerald-600">
                    <i class="fab fa-whatsapp text-emerald-500"></i> Quote
                </a>
            </div>
        </div>
    </div>`;
}

/* ==================== POS SHOWCASE INDUSTRY SWITCHER ==================== */
function switchPosPreview(indKey) {
    const data = POS_INDUSTRIES[indKey];
    if (!data) return;

    // Update active chip state
    document.querySelectorAll('.industry-chip').forEach(c => c.classList.remove('active-chip'));
    const activeChip = document.getElementById('chip-' + indKey);
    if (activeChip) activeChip.classList.add('active-chip');

    // Update Text Content
    const bType = document.getElementById('preview-business-type');
    const title = document.getElementById('preview-title');
    const desc = document.getElementById('preview-desc');
    const sName = document.getElementById('mockup-store-name');
    const pGrid = document.getElementById('mockup-products-grid');

    if (bType) bType.textContent = data.badge;
    if (title) title.textContent = data.title;
    if (desc) desc.textContent = data.desc;
    if (sName) sName.textContent = data.storeName;

    const fGrid = document.getElementById('preview-feature-grid');
    if (fGrid && data.features) {
        fGrid.innerHTML = data.features.map(f => `
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-white hover:border-emerald-300 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div class="flex items-center gap-2 font-bold text-slate-800 mb-0.5">
                    <i class="${escapeHtml(f.icon)} text-emerald-600"></i>
                    <span>${escapeHtml(f.title)}</span>
                </div>
                <p class="text-[11px] text-slate-500 leading-tight">${escapeHtml(f.desc)}</p>
            </div>
        `).join('');
    }

    if (pGrid) {
        pGrid.innerHTML = data.items.map(item => `
            <div class="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                    <div class="font-bold text-slate-800">${escapeHtml(item.name)}</div>
                    <div class="text-[10px] text-slate-500">Stock: ${escapeHtml(item.stock)}</div>
                </div>
                <span class="font-bold text-emerald-600">${escapeHtml(item.price)}</span>
            </div>
        `).join('');
    }
}

/* ==================== QUICK WHATSAPP INQUIRY ==================== */
function sendQuickWhatsApp() {
    const name = document.getElementById('contact-name')?.value.trim() || 'A Customer';
    const service = document.getElementById('contact-service')?.value || 'General Inquiry';
    const msg = document.getElementById('contact-msg')?.value.trim() || 'I am interested in your services!';

    const text = `Hi Maliya, my name is ${name}.\nI am contacting you regarding: *${service}*.\n\nProject Details:\n${msg}`;
    const url = `https://wa.me/94716125715?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

/* ==================== LIGHTBOX MODAL ==================== */
function openDirectImage(imgSrc, title) {
    currentLightboxImages = [imgSrc];
    currentLightboxIndex = 0;

    const modal = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    const counter = document.getElementById('lightboxCounter');

    if (!modal || !img) return;

    img.src = imgSrc;
    if (caption) caption.textContent = title || 'Verified Facebook Recommendation';
    if (counter) counter.textContent = '1 / 1';

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function openLightbox(projectId) {
    const project = loadedProjects.find(p => p.id === projectId);
    if (!project) return;

    currentLightboxImages = (project.images && project.images.length > 0) 
        ? project.images 
        : [project.image || 'video_placeholder.png'];
    currentLightboxIndex = 0;

    const modal = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    const counter = document.getElementById('lightboxCounter');

    if (!modal || !img) return;

    img.src = currentLightboxImages[0];
    if (caption) caption.textContent = project.title || '';
    if (counter) counter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
    if (e && e.target && e.target.closest('#lightboxImg')) return;
    const modal = document.getElementById('lightbox');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
}

function changeLightboxImage(dir) {
    if (currentLightboxImages.length <= 1) return;
    currentLightboxIndex = (currentLightboxIndex + dir + currentLightboxImages.length) % currentLightboxImages.length;
    
    const img = document.getElementById('lightboxImg');
    const counter = document.getElementById('lightboxCounter');
    if (img) img.src = currentLightboxImages[currentLightboxIndex];
    if (counter) counter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('lightbox');
        if (!modal || modal.classList.contains('hidden')) return;

        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') changeLightboxImage(-1);
        else if (e.key === 'ArrowRight') changeLightboxImage(1);
    });
}

/* ==================== UTILS ==================== */
function escapeHtml(str) {
    if (!str) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(str).replace(/[&<>"']/g, m => map[m]);
}
