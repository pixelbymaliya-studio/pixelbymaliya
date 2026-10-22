/**
 * app.js - Unified Application Logic for Pixel by Maliya
 * Portfolio & Universal Cloud POS System
 */

/* ==================== STATE ==================== */
let currentMainTab = 'graphic';      // 'graphic' | 'web' | 'app' | 'tshirt' | 'video' | 'pos'
let currentCategory = 'all';         // 'all' | 'logo' | 'visiting-card' | 'social-media' | 'banner' | 'printing'
let loadedProjects = [];
let currentLightboxImages = [];
let currentLightboxIndex = 0;

/* T-Shirt Studio Customizer State */
let currentTshirtColor = { name: 'Pitch Black', hex: '#0F172A' };
let currentTshirtSize = 'M';
let currentTshirtDesign = {
    title: 'Cyber Ronin',
    subtitle: 'Tokyo Neo-Streetwear',
    iconClass: 'fas fa-dragon',
    iconColor: '#818CF8'
};

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
        url: 'https://apexlogistics.lk'
    },
    {
        id: 'p-6',
        type: 'web',
        title: 'Serendib Luxury Villas & Resorts',
        description: 'Boutique hotel booking showcase featuring direct inquiry integration, full-screen room galleries, and multilingual support.',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        tech: 'HTML5, Glassmorphic UI, Booking Flow',
        url: 'https://serendibvillas.lk'
    },
    {
        id: 'p-web-3',
        type: 'web',
        title: 'Downsouth Luxury Car Rentals Web Platform',
        description: 'Premium automotive fleet booking website with vehicle filter matrix, WhatsApp live dispatch inquiry, and high-contrast dark aesthetic.',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
        tech: 'Next.js, Tailwind CSS, Booking System, SEO',
        url: 'https://downsouthrentals.lk'
    },
    {
        id: 'p-web-4',
        type: 'web',
        title: 'Pixel by Maliya Creative Studio',
        description: 'Official digital studio portal with interactive POS terminals, DTF apparel customizer, and portfolio management.',
        image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80',
        tech: 'Vanilla HTML5, Glassmorphism, Tailwind, PWA',
        url: 'https://pixelbymaliya.lk'
    },
    {
        id: 'p-app-1',
        type: 'app',
        title: 'StyleHub Lanka — D2C E-Commerce Mobile App',
        description: 'Direct-to-consumer mobile shopping app with push notification flash sales, LankaQR one-touch checkout, and automated customer loyalty rewards.',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
        tech: 'Flutter, Android & iOS, LankaQR Gateway, Firebase Sync',
        url: 'https://wa.me/94716125715?text=Hi%20Maliya,%20I%20am%20interested%20in%20an%20E-Commerce%20Mobile%20App'
    },
    {
        id: 'p-app-2',
        type: 'app',
        title: 'Galle Feast — Food Delivery & Kitchen Dispatch App',
        description: 'Multi-outlet online food ordering suite. Includes real-time GPS rider delivery tracking, kitchen display system (KDS), and cash-on-delivery management.',
        image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80',
        tech: 'React Native, Live GPS Map, Kitchen KDS, Rider App',
        url: 'https://wa.me/94716125715?text=Hi%20Maliya,%20I%20am%20interested%20in%20a%20Food%20Delivery%20App'
    },
    {
        id: 'p-app-3',
        type: 'app',
        title: 'Apex SFA — FMCG Van Sales & Wholesale Field Rep App',
        description: 'Android tablet/mobile app for mobile route reps. Features on-the-spot Bluetooth thermal invoice printing, shop credit aging checks, and lorry stock balancing.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        tech: 'Android Native, Bluetooth ESC/POS Print, Offline SQLite',
        url: 'https://wa.me/94716125715?text=Hi%20Maliya,%20I%20am%20interested%20in%20a%20Van%20Sales%20SFA%20App'
    },
    {
        id: 'p-app-4',
        type: 'app',
        title: 'Pixel Glamour — Salon & Clinic Appointment Booking App',
        description: 'Streamlined appointment calendar app allowing customers to book specific stylists/doctors, choose time slots, and receive automatic WhatsApp reminders.',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
        tech: 'Mobile Web & Native, Realtime Slots, Automated WhatsApp Alerts',
        url: 'https://wa.me/94716125715?text=Hi%20Maliya,%20I%20am%20interested%20in%20a%20Booking%20App'
    },
    {
        id: 'p-tshirt-1',
        type: 'tshirt',
        title: 'Cyber Ronin Neo-Streetwear Tee',
        description: 'Ultra-HD Direct-to-Film (DTF) neon print on 240 GSM heavy combed cotton. Preshrunk, double-stitched collar, wash-tested over 50+ cycles.',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        tech: '240 GSM Combed Cotton, Neo-Tokyo DTF Print, Wash-Proof',
        status: 'Available Soon / Pre-Orders Open',
        url: '#tshirt-showcase'
    },
    {
        id: 'p-tshirt-2',
        type: 'tshirt',
        title: 'Create Your Legacy — Minimalist Typography Tee',
        description: 'Elegant puff DTF typography with matte finish on luxury Pitch Black cotton. Minimalist street aesthetic engineered for daily comfort.',
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
        tech: '220 GSM Luxury Cotton, Puff DTF Typography, Pitch Black',
        status: 'Available Soon / Pre-Orders Open',
        url: '#tshirt-showcase'
    },
    {
        id: 'p-tshirt-3',
        type: 'tshirt',
        title: 'Dark Manga Hunter — Japanese Anime Graphic Tee',
        description: 'High-contrast detailed manga illustration DTF printed with ultra-vibrant inks. High breathability and zero peeling or cracking.',
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
        tech: '240 GSM Heavyweight, Ultra-Contrast DTF Print',
        status: 'Available Soon / Pre-Orders Open',
        url: '#tshirt-showcase'
    },
    {
        id: 'p-tshirt-4',
        type: 'tshirt',
        title: 'Corporate Brand Uniform Merch Polo & Tee',
        description: 'Bespoke corporate identity t-shirts and polo shirts for company staff, events, and brand campaigns with custom chest logo printing.',
        image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80',
        tech: 'Custom Company Logo, Bulk Merch, Breathable Pique',
        status: 'Custom Orders & Bulk Batches Open',
        url: '#tshirt-showcase'
    },
    {
        id: 'p-v-1',
        type: 'video',
        title: 'Pixel POS Live Walkthrough — Supermarket Barcode & LankaQR Checkout',
        description: 'Watch the full real-time checkout demonstration: dual-screen customer display, rapid barcode scanning, LankaQR instant payment, and thermal bill printing.',
        image: 'https://images.unsplash.com/photo-1556742049-0a67e55722c3?auto=format&fit=crop&w=800&q=80',
        tech: 'Supermarket POS, Barcode Scan, LankaQR, Thermal Printer',
        youtubeUrl: 'https://www.youtube.com/@pixelbymaliya',
        facebookUrl: 'https://www.facebook.com/pixelbymaliya',
        url: 'https://www.youtube.com/@pixelbymaliya'
    },
    {
        id: 'p-v-2',
        type: 'video',
        title: 'Restaurant KOT & Multi-Kitchen Dispatch System in Action',
        description: 'See how waiter tablet orders automatically fire split Kitchen Order Tickets (KOT) to multiple kitchen printers with zero delays and table status tracking.',
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
        tech: 'Restaurant POS, Kitchen KOT, Split Billing, Dine-in/Takeaway',
        youtubeUrl: 'https://www.youtube.com/@pixelbymaliya',
        facebookUrl: 'https://www.facebook.com/pixelbymaliya',
        url: 'https://www.youtube.com/@pixelbymaliya'
    },
    {
        id: 'p-v-3',
        type: 'video',
        title: 'FMCG Van Sales & Wholesale Route Invoicing Demo',
        description: 'Lorry stock loading, field rep Bluetooth invoice printing, customer credit collection ledger, and end-of-day cash settlement breakdown.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        tech: 'Android Mobile App, Bluetooth Thermal Printer, Offline Sync',
        youtubeUrl: 'https://www.youtube.com/@pixelbymaliya',
        facebookUrl: 'https://www.facebook.com/pixelbymaliya',
        url: 'https://www.youtube.com/@pixelbymaliya'
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
    initKeyboardShortcuts();
    initElfsightLazyLoad();
    // Yield non-critical tasks to unblock first paint and main thread
    setTimeout(() => {
        animateStats();
        renderPortfolio();
    }, 50);
});

/* ==================== LAZY LOAD ELFSIGHT REVIEWS ==================== */
function initElfsightLazyLoad() {
    const reviews = document.getElementById('reviews');
    if (!reviews) return;
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    obs.disconnect();
                    loadElfsightScript();
                }
            });
        }, { rootMargin: '300px' });
        obs.observe(reviews);
    } else {
        window.addEventListener('load', () => setTimeout(loadElfsightScript, 2000));
    }
}

function loadElfsightScript() {
    if (document.getElementById('elfsight-script')) return;
    const s = document.createElement('script');
    s.id = 'elfsight-script';
    s.src = 'https://static.elfsight.com/platform/platform.js';
    s.defer = true;
    document.body.appendChild(s);
}

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
        } else if (currentMainTab === 'app') {
            renderAppGrid(projects.filter(p => p.type === 'app'));
        } else if (currentMainTab === 'tshirt') {
            renderTshirtGrid(projects.filter(p => p.type === 'tshirt'));
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

function renderAppGrid(projects) {
    const grid = document.getElementById('appGrid');
    const empty = document.getElementById('appEmpty');
    if (!grid) return;

    if (projects.length === 0) {
        grid.innerHTML = '';
        if (empty) empty.classList.remove('hidden');
        return;
    }

    if (empty) empty.classList.add('hidden');
    grid.innerHTML = projects.map(p => createAppCard(p)).join('');
}

function renderTshirtGrid(projects) {
    const grid = document.getElementById('tshirtGrid');
    const empty = document.getElementById('tshirtEmpty');
    if (!grid) return;

    if (projects.length === 0) {
        grid.innerHTML = '';
        if (empty) empty.classList.remove('hidden');
        return;
    }

    if (empty) empty.classList.add('hidden');
    grid.innerHTML = projects.map(p => createTshirtCard(p)).join('');
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
    const ytUrl = p.youtubeUrl || '';
    const fbUrl = p.facebookUrl || '';

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
            ${(ytUrl || fbUrl) ? `
            <div class="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10" onclick="event.stopPropagation()">
                ${ytUrl ? `<a href="${escapeHtml(ytUrl)}" target="_blank" rel="noopener noreferrer" class="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold shadow-md hover:bg-red-700 flex items-center gap-1 transition-all" title="Watch Reel on YouTube"><i class="fab fa-youtube"></i> Video</a>` : ''}
                ${fbUrl ? `<a href="${escapeHtml(fbUrl)}" target="_blank" rel="noopener noreferrer" class="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold shadow-md hover:bg-blue-700 flex items-center gap-1 transition-all" title="Watch Reel on Facebook"><i class="fab fa-facebook"></i> Video</a>` : ''}
            </div>` : ''}
        </div>
        <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
                <div class="flex items-center justify-between mb-2">
                    <span class="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wide">${escapeHtml(label)}</span>
                    ${(ytUrl || fbUrl) ? `<span class="text-[10px] text-red-600 font-bold flex items-center gap-1"><i class="fas fa-circle-play animate-pulse text-xs"></i> Video Reel</span>` : ''}
                </div>
                <h3 class="font-display font-bold text-slate-900 text-sm leading-snug">${escapeHtml(p.title)}</h3>
                ${p.description ? `<p class="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">${escapeHtml(p.description)}</p>` : ''}
            </div>
            <div class="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                <div class="flex items-center gap-1.5">
                    <span>Pixel by Maliya</span>
                    ${ytUrl ? `<a href="${escapeHtml(ytUrl)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="text-red-500 hover:text-red-600 transition-colors" title="YouTube Video"><i class="fab fa-youtube text-sm"></i></a>` : ''}
                    ${fbUrl ? `<a href="${escapeHtml(fbUrl)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="text-blue-500 hover:text-blue-600 transition-colors" title="Facebook Video"><i class="fab fa-facebook text-sm"></i></a>` : ''}
                </div>
                <span class="text-brand-600 font-bold group-hover:translate-x-0.5 transition-transform">View Full <i class="fas fa-arrow-right text-[9px]"></i></span>
            </div>
        </div>
    </div>`;
}

function createWebCard(p) {
    const techList = p.tech ? p.tech.split(',').map(t => t.trim()).filter(Boolean) : [];
    const liveUrl = p.url && p.url !== '#' ? p.url : 'https://pixelbymaliya.lk';
    const ytUrl = p.youtubeUrl || '';
    const fbUrl = p.facebookUrl || '';
    
    // Clean domain for display pill
    let displayDomain = liveUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '');
    if (!displayDomain || displayDomain === '#') displayDomain = 'live-client-site.lk';

    return `
    <div class="portfolio-card group border-slate-200/90 shadow-md hover:shadow-xl transition-all">
        <!-- Interactive Browser Window Chrome Top Bar -->
        <div class="browser-header-bar flex items-center justify-between px-3.5 py-2.5 bg-slate-900 text-white rounded-t-2xl border-b border-slate-800">
            <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            </div>
            <!-- Browser URL Pill -->
            <a href="${escapeHtml(liveUrl)}" target="_blank" rel="noopener noreferrer" class="browser-url-pill px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 font-mono flex items-center gap-1.5 truncate max-w-[220px] transition-colors border border-slate-700/60" title="Visit live website in new tab">
                <i class="fas fa-lock text-[9px] text-emerald-400"></i>
                <span class="truncate">${escapeHtml(displayDomain)}</span>
            </a>
            <div class="flex items-center gap-2">
                ${ytUrl ? `<a href="${escapeHtml(ytUrl)}" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 transition-colors" title="Watch Demo on YouTube"><i class="fab fa-youtube text-xs"></i></a>` : ''}
                ${fbUrl ? `<a href="${escapeHtml(fbUrl)}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 transition-colors" title="Watch Demo on Facebook"><i class="fab fa-facebook text-xs"></i></a>` : ''}
                <a href="${escapeHtml(liveUrl)}" target="_blank" rel="noopener noreferrer" class="text-xs text-brand-300 hover:text-white transition-colors flex items-center gap-1" title="Open live website in new window">
                    <i class="fas fa-external-link-alt text-[11px]"></i>
                </a>
            </div>
        </div>

        <!-- Preview Image Container with Hover Expand -->
        <div class="overflow-hidden aspect-video bg-slate-100 relative cursor-pointer" onclick="openLightbox('${p.id}')">
            <img src="${escapeHtml(p.image || '')}" 
                 alt="${escapeHtml(p.title)}" 
                 loading="lazy" 
                 class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22340%22><rect fill=%22%23f1f5f9%22 width=%22600%22 height=%22340%22/><text x=%22300%22 y=%22170%22 fill=%22%2394a3b8%22 text-anchor=%22middle%22 font-size=%2214%22>Web Preview</text></svg>'" />
            <div class="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/25 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div class="px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 shadow-lg text-xs font-bold flex items-center gap-1.5">
                    <i class="fas fa-expand"></i>
                    <span>Expand Gallery</span>
                </div>
            </div>
            ${(ytUrl || fbUrl) ? `
            <div class="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 z-10" onclick="event.stopPropagation()">
                ${ytUrl ? `<a href="${escapeHtml(ytUrl)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-lg bg-red-600/90 text-white text-[10px] font-bold backdrop-blur shadow hover:bg-red-700 flex items-center gap-1 transition-all hover:scale-105" title="Watch Demo on YouTube"><i class="fab fa-youtube"></i> Video Demo</a>` : ''}
                ${fbUrl ? `<a href="${escapeHtml(fbUrl)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-lg bg-blue-600/90 text-white text-[10px] font-bold backdrop-blur shadow hover:bg-blue-700 flex items-center gap-1 transition-all hover:scale-105" title="Watch Demo on Facebook"><i class="fab fa-facebook"></i> Video Demo</a>` : ''}
            </div>` : ''}
        </div>

        <!-- Card Details -->
        <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
                <div class="flex items-center justify-between mb-2">
                    <span class="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-accent-50 text-accent-700 border border-accent-200 uppercase tracking-wide">Web Development</span>
                    <span class="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Online
                    </span>
                </div>
                <h3 class="font-display font-bold text-slate-900 text-lg leading-tight mb-2">${escapeHtml(p.title)}</h3>
                ${p.description ? `<p class="text-slate-600 text-xs sm:text-sm mb-4 leading-relaxed">${escapeHtml(p.description)}</p>` : ''}
                ${techList.length > 0 ? `
                <div class="flex flex-wrap gap-1.5 mb-4">
                    ${techList.map(t => `<span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">${escapeHtml(t)}</span>`).join('')}
                </div>` : ''}
            </div>

            <!-- Action Buttons: Live URL, Video & WhatsApp -->
            <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-2">
                    <a href="${escapeHtml(liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn-luxury px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <i class="fas fa-globe text-[11px]"></i>
                        <span>Visit Live Website</span>
                        <i class="fas fa-arrow-up-right-from-square text-[9px] opacity-75"></i>
                    </a>
                    ${ytUrl ? `
                    <a href="${escapeHtml(ytUrl)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1 transition-all" title="Watch Demo on YouTube">
                        <i class="fab fa-youtube text-red-600"></i>
                        <span>Video</span>
                    </a>` : ''}
                    ${fbUrl ? `
                    <a href="${escapeHtml(fbUrl)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-bold flex items-center gap-1 transition-all" title="Watch Demo on Facebook">
                        <i class="fab fa-facebook text-blue-600"></i>
                        <span>Video</span>
                    </a>` : ''}
                </div>
                <a href="https://wa.me/94716125715?text=Hi%20Maliya,%20I%20am%20interested%20in%20a%20website%20like:%20${encodeURIComponent(p.title)}" target="_blank" rel="noopener noreferrer" class="text-slate-500 hover:text-emerald-600 text-xs font-bold flex items-center gap-1 transition-colors ml-auto">
                    <i class="fab fa-whatsapp text-emerald-500 text-sm"></i>
                    <span>Inquire</span>
                </a>
            </div>
        </div>
    </div>`;
}

function createAppCard(p) {
    const techList = p.tech ? p.tech.split(',').map(t => t.trim()).filter(Boolean) : [];
    const appQuoteLink = `https://wa.me/94716125715?text=Hi%20Maliya,%20I%20want%20to%20build%20a%20custom%20mobile%20app%20like:%20${encodeURIComponent(p.title)}`;
    const ytUrl = p.youtubeUrl || '';
    const fbUrl = p.facebookUrl || '';

    return `
    <div class="portfolio-card group border-indigo-200/80 bg-white">
        <!-- Top App Frame Bar -->
        <div class="flex items-center justify-between px-3.5 py-2 bg-indigo-900 text-white rounded-t-2xl border-b border-indigo-800">
            <div class="flex items-center gap-1.5">
                <i class="fab fa-android text-emerald-400 text-xs"></i>
                <i class="fab fa-apple text-slate-200 text-xs"></i>
                <span class="text-[10px] font-bold text-indigo-200 ml-1">Native App</span>
            </div>
            <div class="flex items-center gap-2">
                ${ytUrl ? `<a href="${escapeHtml(ytUrl)}" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 transition-colors" title="Watch App Demo on YouTube"><i class="fab fa-youtube text-xs"></i></a>` : ''}
                ${fbUrl ? `<a href="${escapeHtml(fbUrl)}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 transition-colors" title="Watch App Demo on Facebook"><i class="fab fa-facebook text-xs"></i></a>` : ''}
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 font-mono">Custom Built</span>
            </div>
        </div>

        <div class="overflow-hidden aspect-video bg-slate-100 relative cursor-pointer" onclick="openLightbox('${p.id}')">
            <img src="${escapeHtml(p.image || '')}" 
                 alt="${escapeHtml(p.title)}" 
                 loading="lazy" 
                 class="w-full h-full object-cover"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22340%22><rect fill=%22%23eef2ff%22 width=%22600%22 height=%22340%22/><text x=%22300%22 y=%22170%22 fill=%22%234f46e5%22 text-anchor=%22middle%22 font-size=%2216%22>Mobile Business App</text></svg>'" />
            <div class="absolute inset-0 bg-indigo-950/20 group-hover:bg-indigo-950/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div class="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-lg flex items-center gap-2">
                    <i class="fas fa-mobile-screen-button"></i>
                    <span>View App Showcase</span>
                </div>
            </div>
            ${(ytUrl || fbUrl) ? `
            <div class="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 z-10" onclick="event.stopPropagation()">
                ${ytUrl ? `<a href="${escapeHtml(ytUrl)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-lg bg-red-600/90 text-white text-[10px] font-bold backdrop-blur shadow hover:bg-red-700 flex items-center gap-1 transition-all hover:scale-105" title="Watch App Demo on YouTube"><i class="fab fa-youtube"></i> Demo Video</a>` : ''}
                ${fbUrl ? `<a href="${escapeHtml(fbUrl)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-lg bg-blue-600/90 text-white text-[10px] font-bold backdrop-blur shadow hover:bg-blue-700 flex items-center gap-1 transition-all hover:scale-105" title="Watch App Demo on Facebook"><i class="fab fa-facebook"></i> Demo Video</a>` : ''}
            </div>` : ''}
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
                <div class="flex items-center justify-between mb-2">
                    <span class="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wide">Custom Mobile App</span>
                    <span class="text-[10px] text-indigo-600 font-bold flex items-center gap-1">
                        <i class="fas fa-check-circle text-indigo-500"></i> iOS &amp; Android
                    </span>
                </div>
                <h3 class="font-display font-bold text-slate-900 text-lg leading-tight mb-2">${escapeHtml(p.title)}</h3>
                ${p.description ? `<p class="text-slate-600 text-xs sm:text-sm mb-4 leading-relaxed">${escapeHtml(p.description)}</p>` : ''}
                ${techList.length > 0 ? `
                <div class="flex flex-wrap gap-1.5 mb-4">
                    ${techList.map(t => `<span class="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 text-[11px] font-semibold border border-indigo-100">${escapeHtml(t)}</span>`).join('')}
                </div>` : ''}
            </div>

            <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-2">
                    <a href="${appQuoteLink}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all">
                        <i class="fab fa-whatsapp"></i>
                        <span>Get App Quote</span>
                    </a>
                    ${ytUrl ? `
                    <a href="${escapeHtml(ytUrl)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1 transition-all" title="Watch App Demo on YouTube">
                        <i class="fab fa-youtube text-red-600"></i>
                        <span>Video</span>
                    </a>` : ''}
                    ${fbUrl ? `
                    <a href="${escapeHtml(fbUrl)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-bold flex items-center gap-1 transition-all" title="Watch App Demo on Facebook">
                        <i class="fab fa-facebook text-blue-600"></i>
                        <span>Video</span>
                    </a>` : ''}
                </div>
                <button onclick="document.getElementById('apps-showcase').scrollIntoView({behavior:'smooth'})" class="text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors ml-auto">
                    Interactive Demo <i class="fas fa-arrow-up text-[10px]"></i>
                </button>
            </div>
        </div>
    </div>`;
}

function createTshirtCard(p) {
    const techList = p.tech ? p.tech.split(',').map(t => t.trim()).filter(Boolean) : [];
    const orderLink = `https://wa.me/94716125715?text=Hi%20Maliya,%20I%20am%20interested%20in%20the%20*${encodeURIComponent(p.title)}*%20DTF%20Printed%20T-Shirt%20design!%20When%20will%20it%20be%20available%20for%20order/pre-order?`;
    const ytUrl = p.youtubeUrl || '';
    const fbUrl = p.facebookUrl || '';

    return `
    <div class="portfolio-card group border-rose-200/80 bg-white">
        <!-- T-Shirt Spec Header Bar -->
        <div class="flex items-center justify-between px-3.5 py-2 bg-slate-900 text-white rounded-t-2xl border-b border-slate-800">
            <div class="flex items-center gap-1.5">
                <i class="fas fa-shirt text-rose-400 text-xs"></i>
                <span class="text-[10px] font-bold text-slate-200">240 GSM Combed Cotton</span>
            </div>
            <div class="flex items-center gap-2">
                ${ytUrl ? `<a href="${escapeHtml(ytUrl)}" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 transition-colors" title="Watch Print Reel on YouTube"><i class="fab fa-youtube text-xs"></i></a>` : ''}
                ${fbUrl ? `<a href="${escapeHtml(fbUrl)}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 transition-colors" title="Watch Print Reel on Facebook"><i class="fab fa-facebook text-xs"></i></a>` : ''}
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200 font-bold">Wash-Proof DTF</span>
            </div>
        </div>

        <div class="overflow-hidden aspect-square bg-slate-900 relative cursor-pointer" onclick="openLightbox('${p.id}')">
            <img src="${escapeHtml(p.image || '')}" 
                 alt="${escapeHtml(p.title)}" 
                 loading="lazy" 
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22><rect fill=%22%230f172a%22 width=%22400%22 height=%22400%22/><text x=%22200%22 y=%22200%22 fill=%22%23f43f5e%22 text-anchor=%22middle%22 font-size=%2216%22>DTF T-Shirt</text></svg>'" />
            <div class="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div class="px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 shadow-lg text-xs font-bold flex items-center gap-1.5">
                    <i class="fas fa-expand"></i>
                    <span>Zoom Artwork</span>
                </div>
            </div>
            ${(ytUrl || fbUrl) ? `
            <div class="absolute top-3 left-3 flex items-center gap-1.5 z-10" onclick="event.stopPropagation()">
                ${ytUrl ? `<a href="${escapeHtml(ytUrl)}" target="_blank" rel="noopener noreferrer" class="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold shadow hover:bg-red-700 flex items-center gap-1 transition-all hover:scale-105" title="Watch Print Reel on YouTube"><i class="fab fa-youtube"></i> Reel</a>` : ''}
                ${fbUrl ? `<a href="${escapeHtml(fbUrl)}" target="_blank" rel="noopener noreferrer" class="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold shadow hover:bg-blue-700 flex items-center gap-1 transition-all hover:scale-105" title="Watch Print Reel on Facebook"><i class="fab fa-facebook"></i> Reel</a>` : ''}
            </div>` : ''}
            <div class="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-black border border-amber-400 shadow-md flex items-center gap-1">
                <i class="fas fa-clock text-[10px]"></i>
                <span>Available Soon</span>
            </div>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
                <div class="flex items-center justify-between mb-2">
                    <span class="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide">DTF T-Shirt Studio</span>
                    <span class="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Pre-Orders Open
                    </span>
                </div>
                <h3 class="font-display font-bold text-slate-900 text-base leading-snug mb-2">${escapeHtml(p.title)}</h3>
                ${p.description ? `<p class="text-slate-600 text-xs mb-3 leading-relaxed">${escapeHtml(p.description)}</p>` : ''}
                ${techList.length > 0 ? `
                <div class="flex flex-wrap gap-1 mb-4">
                    ${techList.map(t => `<span class="px-2 py-0.5 rounded bg-rose-50 text-rose-800 text-[10px] font-semibold border border-rose-100">${escapeHtml(t)}</span>`).join('')}
                </div>` : ''}
            </div>

            <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-2">
                    <a href="${orderLink}" target="_blank" rel="noopener noreferrer" class="btn-luxury-primary px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <i class="fab fa-whatsapp"></i>
                        <span>Inquire / Pre-Order</span>
                    </a>
                    ${ytUrl ? `
                    <a href="${escapeHtml(ytUrl)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1 transition-all" title="Watch Print Reel on YouTube">
                        <i class="fab fa-youtube text-red-600"></i>
                        <span>Reel</span>
                    </a>` : ''}
                    ${fbUrl ? `
                    <a href="${escapeHtml(fbUrl)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-bold flex items-center gap-1 transition-all" title="Watch Print Reel on Facebook">
                        <i class="fab fa-facebook text-blue-600"></i>
                        <span>Reel</span>
                    </a>` : ''}
                </div>
                <button onclick="document.getElementById('tshirt-showcase').scrollIntoView({behavior:'smooth'})" class="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 ml-auto">
                    <span>Try on Model</span>
                    <i class="fas fa-arrow-up text-[9px]"></i>
                </button>
            </div>
        </div>
    </div>`;
}

function getYouTubeId(url) {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : null;
}

function createVideoCard(p) {
    const ytUrl = p.youtubeUrl || (p.url && p.url.includes('youtu') ? p.url : '');
    const fbUrl = p.facebookUrl || (p.url && p.url.includes('facebook') ? p.url : '');
    const primaryLink = ytUrl || fbUrl || p.url || '#';
    const techList = p.tech ? p.tech.split(',').map(t => t.trim()).filter(Boolean) : [];

    // Auto-detect YouTube thumbnail if image is missing or placeholder
    const ytId = getYouTubeId(ytUrl);
    let videoThumbnail = p.image || '';
    if (!videoThumbnail || videoThumbnail === 'video_placeholder.png') {
        if (ytId) {
            videoThumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        } else {
            videoThumbnail = 'video_placeholder.png';
        }
    }

    return `
    <div class="portfolio-card group border-rose-200/70 bg-white shadow-md hover:shadow-xl transition-all">
        <!-- Top Video Bar -->
        <div class="flex items-center justify-between px-3.5 py-2 bg-slate-900 text-white rounded-t-2xl border-b border-slate-800">
            <div class="flex items-center gap-1.5">
                <i class="fas fa-circle-play text-red-500 text-xs animate-pulse"></i>
                <span class="text-[10px] font-bold text-slate-200">Video Demonstration</span>
            </div>
            <div class="flex items-center gap-2">
                ${ytUrl ? '<i class="fab fa-youtube text-red-400 text-xs" title="Available on YouTube"></i>' : ''}
                ${fbUrl ? '<i class="fab fa-facebook text-blue-400 text-xs" title="Available on Facebook"></i>' : ''}
            </div>
        </div>

        <div class="relative overflow-hidden aspect-video bg-slate-950 cursor-pointer" onclick="window.open('${escapeHtml(primaryLink)}', '_blank')">
            <img src="${escapeHtml(videoThumbnail)}" 
                 alt="${escapeHtml(p.title)}" 
                 loading="lazy" 
                 class="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                 onerror="${ytId ? `this.src='https://img.youtube.com/vi/${ytId}/hqdefault.jpg'` : `this.src='video_placeholder.png'`}" />
            <div class="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 flex items-center justify-center transition-all">
                <div class="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-red-600 text-white shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i class="fas fa-play text-base ml-1"></i>
                </div>
            </div>
            <!-- Quick Platform Badge Overlays -->
            <div class="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                ${ytUrl ? '<span class="px-2 py-0.5 rounded-md bg-red-600/90 text-white text-[10px] font-bold backdrop-blur flex items-center gap-1"><i class="fab fa-youtube"></i> YouTube</span>' : ''}
                ${fbUrl ? '<span class="px-2 py-0.5 rounded-md bg-blue-600/90 text-white text-[10px] font-bold backdrop-blur flex items-center gap-1"><i class="fab fa-facebook"></i> Facebook</span>' : ''}
            </div>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
                <div class="flex items-center justify-between mb-2">
                    <span class="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide">POS Demo &amp; Motion</span>
                    <span class="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                        <i class="fas fa-eye text-slate-500"></i> Full HD Demo
                    </span>
                </div>
                <h3 class="font-display font-bold text-slate-900 text-base leading-snug mb-2">${escapeHtml(p.title)}</h3>
                ${p.description ? `<p class="text-slate-600 text-xs mb-3 leading-relaxed line-clamp-2">${escapeHtml(p.description)}</p>` : ''}
                ${techList.length > 0 ? `
                <div class="flex flex-wrap gap-1 mb-3">
                    ${techList.map(t => `<span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">${escapeHtml(t)}</span>`).join('')}
                </div>` : ''}
            </div>

            <!-- Direct YouTube and Facebook click actions -->
            <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                    ${ytUrl ? `
                    <a href="${escapeHtml(ytUrl)}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all hover:scale-105" title="Watch demo on YouTube">
                        <i class="fab fa-youtube text-sm"></i>
                        <span>YouTube</span>
                    </a>` : ''}
                    ${fbUrl ? `
                    <a href="${escapeHtml(fbUrl)}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all hover:scale-105" title="Watch demo on Facebook">
                        <i class="fab fa-facebook text-sm"></i>
                        <span>Facebook</span>
                    </a>` : ''}
                    ${(!ytUrl && !fbUrl && p.url && p.url !== '#') ? `
                    <a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all">
                        <i class="fas fa-play text-[10px]"></i>
                        <span>Watch Video</span>
                    </a>` : ''}
                </div>
                <a href="https://wa.me/94716125715?text=Hi%20Maliya,%20I%20watched%20your%20video%20demo:%20${encodeURIComponent(p.title)}" target="_blank" rel="noopener noreferrer" class="text-slate-500 hover:text-emerald-600 text-xs font-bold flex items-center gap-1 transition-colors ml-auto">
                    <i class="fab fa-whatsapp text-emerald-500 text-sm"></i>
                    <span>Inquire</span>
                </a>
            </div>
        </div>
    </div>`;
}

function createPosCard(p) {
    const ytUrl = p.youtubeUrl || (p.url && p.url.includes('youtu') ? p.url : '');
    const fbUrl = p.facebookUrl || (p.url && p.url.includes('facebook') ? p.url : '');
    const videoUrl = ytUrl || fbUrl;
    
    // When a video demo exists (YouTube or Facebook), clicking card/image opens the video directly!
    const primaryActionUrl = videoUrl || p.demoUrl || 'pos/index.html';
    const techList = p.tech ? p.tech.split(',').map(t => t.trim()).filter(Boolean) : [];

    return `
    <div class="portfolio-card group border-emerald-200/80 bg-white shadow-md hover:shadow-xl transition-all">
        <!-- Interactive Preview Container -->
        <div class="relative overflow-hidden aspect-video bg-slate-950 cursor-pointer" onclick="window.open('${escapeHtml(primaryActionUrl)}', '_blank')" title="${videoUrl ? 'Click to watch video demonstration' : 'Click to launch interactive POS terminal'}">
            <img src="${escapeHtml(p.image || '')}" 
                 alt="${escapeHtml(p.title)}" 
                 loading="lazy" 
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22340%22><rect fill=%22%230f172a%22 width=%22600%22 height=%22340%22/><text x=%22300%22 y=%22170%22 fill=%22%2310b981%22 text-anchor=%22middle%22 font-size=%2216%22>POS Video Demo</text></svg>'" />
            
            <!-- Hover Action Overlay -->
            <div class="absolute inset-0 bg-slate-950/25 group-hover:bg-slate-950/45 transition-all flex items-center justify-center">
                ${videoUrl ? `
                <div class="px-4 py-2.5 rounded-xl ${fbUrl ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'} text-white text-xs font-bold shadow-xl flex items-center gap-2 group-hover:scale-110 transition-transform">
                    <i class="${fbUrl ? 'fab fa-facebook' : 'fab fa-youtube'} text-base"></i>
                    <span>${fbUrl ? 'Watch Facebook Video Demo' : 'Watch YouTube Video Demo'}</span>
                    <i class="fas fa-play text-[10px] ml-0.5"></i>
                </div>` : `
                <div class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center gap-2 group-hover:scale-105 transition-transform">
                    <i class="fas fa-desktop"></i>
                    <span>Launch Live Interactive POS</span>
                </div>`}
            </div>

            <!-- Platform Overlay Badges -->
            ${videoUrl ? `
            <div class="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10" onclick="event.stopPropagation()">
                ${ytUrl ? `<a href="${escapeHtml(ytUrl)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold shadow hover:bg-red-700 flex items-center gap-1 transition-all hover:scale-105" title="Watch on YouTube"><i class="fab fa-youtube"></i> YouTube</a>` : ''}
                ${fbUrl ? `<a href="${escapeHtml(fbUrl)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold shadow hover:bg-blue-700 flex items-center gap-1 transition-all hover:scale-105" title="Watch on Facebook"><i class="fab fa-facebook"></i> Facebook</a>` : ''}
            </div>` : ''}
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
                <div class="flex items-center justify-between mb-2">
                    <span class="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${videoUrl ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'} uppercase tracking-wide">
                        ${videoUrl ? 'POS Video Demonstration' : 'Cloud · Offline · Hybrid POS'}
                    </span>
                    <span class="text-[10px] ${videoUrl ? 'text-red-500 font-bold flex items-center gap-1' : 'text-emerald-600 font-bold flex items-center gap-1'}">
                        ${videoUrl ? '<i class="fas fa-circle-play text-xs animate-pulse"></i> Video Demo' : '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live App'}
                    </span>
                </div>
                <h3 class="font-display font-bold text-slate-900 text-base sm:text-lg leading-snug mb-2 cursor-pointer hover:text-blue-600 transition-colors" onclick="window.open('${escapeHtml(primaryActionUrl)}', '_blank')">${escapeHtml(p.title)}</h3>
                ${p.description ? `<p class="text-slate-600 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-3">${escapeHtml(p.description)}</p>` : ''}
                ${techList.length > 0 ? `
                <div class="flex flex-wrap gap-1.5 mb-4">
                    ${techList.map(t => `<span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-100">${escapeHtml(t)}</span>`).join('')}
                </div>` : ''}
            </div>

            <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-2">
                    ${videoUrl ? `
                        ${fbUrl ? `
                        <a href="${escapeHtml(fbUrl)}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105" title="Watch Video Walkthrough on Facebook">
                            <i class="fab fa-facebook text-sm"></i>
                            <span>Watch on Facebook</span>
                        </a>` : ''}
                        ${ytUrl ? `
                        <a href="${escapeHtml(ytUrl)}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105" title="Watch Video Walkthrough on YouTube">
                            <i class="fab fa-youtube text-sm"></i>
                            <span>Watch on YouTube</span>
                        </a>` : ''}
                        ${p.demoUrl ? `
                        <a href="${escapeHtml(p.demoUrl)}" target="_blank" rel="noopener noreferrer" class="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1 transition-all" title="Try Interactive POS Terminal">
                            <i class="fas fa-desktop text-[11px]"></i>
                            <span>Live Terminal</span>
                        </a>` : ''}
                    ` : `
                        <a href="${escapeHtml(primaryActionUrl)}" target="_blank" rel="noopener noreferrer" class="btn-luxury-pos px-3.5 py-2 rounded-lg text-xs font-bold">
                            <i class="fas fa-cash-register text-[10px]"></i>
                            <span>Open Live Terminal</span>
                        </a>
                    `}
                </div>
                <a href="https://wa.me/94716125715?text=Hi%20Maliya,%20I%20am%20interested%20in%20your%20POS%20System:%20${encodeURIComponent(p.title)}" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-slate-700 hover:text-emerald-600 flex items-center gap-1 ml-auto">
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

/* ==================== CUSTOM APP SHOWCASE SWITCHER ==================== */
const APP_INDUSTRIES = {
    ecommerce: {
        badge: 'E-COMMERCE & ONLINE SHOPPING APP',
        title: 'Mobile Shopping Experience with LankaQR & Card Gateway',
        desc: 'Turn your retail brand into a dedicated smartphone application. Send instant push notifications for promotions, reduce checkout drops with 1-touch LankaQR, and offer real-time order delivery updates.',
        appTitle: 'PixelShop Online',
        total: 'Rs. 22,700.00',
        features: [
            { icon: 'fas fa-bell text-indigo-600', title: 'Automated Push Notifications', desc: 'Direct alerts for flash deals, restocks, and order delivery milestones.' },
            { icon: 'fas fa-qrcode text-emerald-600', title: 'LankaQR & Payment Gateway', desc: 'Integrated PayHere, WEBXPAY, and dynamic LankaQR checkout with zero friction.' },
            { icon: 'fas fa-map-location-dot text-amber-600', title: 'Live Order & Delivery Tracking', desc: 'Customers track package dispatch and delivery progress live.' },
            { icon: 'fas fa-shield-halved text-rose-600', title: 'Secure Cloud Admin Portal', desc: 'Manage orders, update product catalogs, and review daily sales from any device.' }
        ],
        items: [
            { icon: 'fas fa-bag-shopping text-indigo-600', name: 'Nike Air Max Sneaker', sub: 'In Stock · Free Delivery', price: 'Rs. 18,500' },
            { icon: 'fas fa-shirt text-rose-500', name: 'Oversized DTF Hoodie', sub: '240 GSM Cotton', price: 'Rs. 4,200' }
        ]
    },
    delivery: {
        badge: 'RESTAURANT & FOOD DELIVERY APP',
        title: 'Direct Ordering, Kitchen KDS & Real-time Rider GPS Tracking',
        desc: 'Own your food delivery channel without surrendering 20–30% commissions to third-party delivery platforms. Instant kitchen order ticketing and Google Maps live rider tracking.',
        appTitle: 'Galle Feast Delivery',
        total: 'Rs. 3,850.00',
        features: [
            { icon: 'fas fa-route text-amber-600', title: 'Live GPS Rider Navigation', desc: 'Customers see real-time rider motorbike position on Google Maps.' },
            { icon: 'fas fa-fire-burner text-rose-600', title: 'Kitchen Order Display (KDS)', desc: 'Incoming orders chime instantly on kitchen tablets for rapid cooking.' },
            { icon: 'fas fa-motorcycle text-indigo-600', title: 'Dedicated Driver Partner App', desc: 'Delivery drivers accept trips, call customers, and capture COD payments.' },
            { icon: 'fas fa-money-bill-wave text-emerald-600', title: 'COD & LankaQR at Doorstep', desc: 'Riders collect Cash on Delivery or present dynamic LankaQR.' }
        ],
        items: [
            { icon: 'fas fa-burger text-amber-500', name: 'Double Cheese Bacon Burger', sub: 'Includes Seasoned Fries', price: 'Rs. 2,450' },
            { icon: 'fas fa-mug-hot text-amber-700', name: 'Artisan Iced Caramel Latte', sub: 'Large 500ml', price: 'Rs. 1,400' }
        ]
    },
    vansales: {
        badge: 'VAN SALES & FIELD SFA AUTOMATION',
        title: 'Mobile Route Billing & Lorry Stock Balancing',
        desc: 'Field force automation app for FMCG distributors and mobile route sales reps. Print 2" or 3" thermal bills on the spot via Bluetooth, enforce dealer credit limits, and balance lorry stock.',
        appTitle: 'Apex Field Rep SFA',
        total: 'Rs. 48,600.00',
        features: [
            { icon: 'fas fa-print text-emerald-600', title: 'Bluetooth Belt-Clip Printing', desc: 'Print official VAT/SVAT invoices instantly at the shop counter.' },
            { icon: 'fas fa-wifi-slash text-indigo-600', title: '100% Offline Database Sync', desc: 'Bill retail shops in rural signal deadzones with instant local database saves.' },
            { icon: 'fas fa-truck-ramp-box text-amber-600', title: 'Lorry Stock Reconciliation', desc: 'Morning dispatch vs evening unsold returns; zero unexplained inventory leaks.' },
            { icon: 'fas fa-book-bookmark text-rose-600', title: 'Dealer Credit Aging ණය පොත', desc: 'Display shop overdue balance before granting new credit terms.' }
        ],
        items: [
            { icon: 'fas fa-box text-indigo-600', name: 'Biscuits Carton (24 Packs)', sub: 'Route Gall-Matara · Tier 1', price: 'Rs. 32,400' },
            { icon: 'fas fa-bottle-water text-cyan-600', name: 'Mineral Water Case (12 Btls)', sub: 'Free-Issue Scheme Applied', price: 'Rs. 16,200' }
        ]
    },
    booking: {
        badge: 'SALON, SPA & CLINIC APPOINTMENTS',
        title: 'Real-Time Chair, Doctor & Consultant Slot Reservations',
        desc: 'Streamline client bookings for beauty salons, barbershops, medical clinics, and wellness spas. Clients select their favorite service provider, pick available hours, and receive WhatsApp confirmations.',
        appTitle: 'Pixel Glamour Booking',
        total: 'Rs. 6,300.00',
        features: [
            { icon: 'fas fa-calendar-check text-brand-600', title: 'Live Chair & Slot Lock', desc: 'Zero double-booking; open time slots update dynamically in real time.' },
            { icon: 'fab fa-whatsapp text-emerald-600', title: 'Automated WhatsApp Reminders', desc: 'Reduces costly no-shows by 80% with automated reminder notifications.' },
            { icon: 'fas fa-user-doctor text-indigo-600', title: 'Staff & Beautician Profiles', desc: 'Clients pick their preferred stylist, consultant, or therapist.' },
            { icon: 'fas fa-credit-card text-rose-600', title: 'Advance Booking Deposit', desc: 'Collect advance reservation fees via LankaQR or card gateway.' }
        ],
        items: [
            { icon: 'fas fa-scissors text-rose-500', name: 'Deluxe Hair Cut & Styling', sub: 'Senior Stylist · 45 mins', price: 'Rs. 2,800' },
            { icon: 'fas fa-spa text-emerald-500', name: 'Hydra Glow Skin Facial', sub: 'Treatment Room 2 · 60 mins', price: 'Rs. 3,500' }
        ]
    },
    erp: {
        badge: 'CUSTOM ERP & ENTERPRISE WORKFLOWS',
        title: 'Bespoke Internal Business Apps for Any Industry',
        desc: 'Tailor-made internal mobile applications engineered for your exact operational workflows. Warehouse barcode picking, factory floor production stages, fleet GPS tracking, and executive dashboards.',
        appTitle: 'Lanka Industrial ERP',
        total: 'Rs. 185,000.00',
        features: [
            { icon: 'fas fa-barcode text-indigo-600', title: 'Warehouse Barcode Scanner', desc: 'Use smartphone camera or Zebra scanner for rapid stock check-in.' },
            { icon: 'fas fa-truck-moving text-amber-600', title: 'Inter-Branch Transfer (IBT)', desc: 'Track goods dispatch notes (GDN) and vehicle departures with timestamps.' },
            { icon: 'fas fa-user-lock text-rose-600', title: 'Role-Based Access Control', desc: 'Granular permissions for warehouse staff, managers, and auditors.' },
            { icon: 'fas fa-chart-pie text-emerald-600', title: 'Live Executive KPI Dashboard', desc: 'Owner monitor showing revenue streams, profit margins, and pending approvals.' }
        ],
        items: [
            { icon: 'fas fa-pallet text-indigo-600', name: 'Batch #8492 Dispatch (Pallet A)', sub: 'Branch: Colombo Hub', price: 'Rs. 120,000' },
            { icon: 'fas fa-clipboard-check text-emerald-600', name: 'Quality Inspection Audit #302', sub: 'Pass Status Verified', price: 'Rs. 65,000' }
        ]
    }
};

function switchAppPreview(indKey) {
    const data = APP_INDUSTRIES[indKey];
    if (!data) return;

    // Update active chip state
    document.querySelectorAll('.industry-chip').forEach(c => {
        if (c.id && c.id.startsWith('appchip-')) {
            c.classList.remove('active-chip');
        }
    });
    const activeChip = document.getElementById('appchip-' + indKey);
    if (activeChip) activeChip.classList.add('active-chip');

    // Update text
    const badgeEl = document.getElementById('app-preview-badge');
    const titleEl = document.getElementById('app-preview-title');
    const descEl = document.getElementById('app-preview-desc');
    const appTitleEl = document.getElementById('phone-app-title');
    const totalEl = document.getElementById('phone-total');

    if (badgeEl) badgeEl.textContent = data.badge;
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (appTitleEl) appTitleEl.textContent = data.appTitle;
    if (totalEl) totalEl.textContent = data.total;

    // Features Checklist
    const featuresEl = document.getElementById('app-preview-features');
    if (featuresEl && data.features) {
        featuresEl.innerHTML = data.features.map(f => `
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-indigo-300 transition-all">
                <div class="flex items-center gap-2 font-bold text-slate-800 mb-1">
                    <i class="${escapeHtml(f.icon)}"></i>
                    <span>${escapeHtml(f.title)}</span>
                </div>
                <p class="text-[11px] text-slate-500">${escapeHtml(f.desc)}</p>
            </div>
        `).join('');
    }

    // Phone items
    const itemsEl = document.getElementById('phone-items-container');
    if (itemsEl && data.items) {
        itemsEl.innerHTML = data.items.map(item => `
            <div class="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between shadow-xs">
                <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                        <i class="${escapeHtml(item.icon)}"></i>
                    </div>
                    <div>
                        <div class="font-bold text-slate-900 text-[11px]">${escapeHtml(item.name)}</div>
                        <div class="text-[9px] text-slate-600">${escapeHtml(item.sub)}</div>
                    </div>
                </div>
                <span class="font-bold text-slate-900 text-xs">${escapeHtml(item.price)}</span>
            </div>
        `).join('');
    }
}

/* ==================== T-SHIRT DTF STUDIO CUSTOMIZER ==================== */
function setTshirtColor(colorHex, colorName) {
    currentTshirtColor = { hex: colorHex, name: colorName };
    const canvas = document.getElementById('tshirtCanvas');
    const label = document.getElementById('tshirtColorLabel');
    const title = document.getElementById('tshirtGraphicTitle');
    
    if (canvas) canvas.style.backgroundColor = colorHex;
    if (label) label.textContent = colorName;

    // Adjust text contrast if canvas is snow white or light
    const isLight = colorHex.toLowerCase() === '#f8fafc' || colorHex.toLowerCase() === '#ffffff';
    if (title) {
        title.style.color = isLight ? '#0f172a' : '#ffffff';
    }

    // Active color button indicator
    document.querySelectorAll('.tshirt-color-btn').forEach(btn => {
        btn.classList.remove('active-color');
        if (btn.getAttribute('onclick')?.includes(colorHex)) {
            btn.classList.add('active-color');
        }
    });

    updateTshirtOrderSummary();
}

function setTshirtSize(size) {
    currentTshirtSize = size;
    document.querySelectorAll('.size-btn').forEach(btn => {
        if (btn.textContent.trim() === size) {
            btn.className = 'size-btn px-2.5 py-1 rounded-lg text-xs font-bold border border-brand-500 bg-brand-50 text-brand-700';
        } else {
            btn.className = 'size-btn px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:border-brand-500';
        }
    });
    updateTshirtOrderSummary();
}

function selectTshirtDesign(title, sub, iconClass, iconColor) {
    currentTshirtDesign = { title, subtitle: sub, iconClass, iconColor };

    const gIcon = document.getElementById('tshirtGraphicIcon');
    const gTitle = document.getElementById('tshirtGraphicTitle');
    const gSub = document.getElementById('tshirtGraphicSub');

    if (gIcon) {
        gIcon.innerHTML = `<i class="${escapeHtml(iconClass)}"></i>`;
        gIcon.style.color = iconColor;
    }
    if (gTitle) gTitle.textContent = title;
    if (gSub) gSub.textContent = sub;

    // Highlight active card
    document.querySelectorAll('.tshirt-design-card').forEach(card => {
        card.classList.remove('active-design-card', 'border-brand-500', 'border-brand-300');
        if (card.getAttribute('onclick')?.includes(title)) {
            card.classList.add('active-design-card', 'border-brand-500');
        }
    });

    updateTshirtOrderSummary();
}

function updateTshirtOrderSummary() {
    const sumEl = document.getElementById('orderSummaryText');
    const priceEl = document.getElementById('orderPriceText');
    
    if (sumEl) {
        sumEl.textContent = `${currentTshirtDesign.title} · ${currentTshirtColor.name} · Size ${currentTshirtSize}`;
    }
    if (priceEl) {
        priceEl.textContent = `Status: Available Soon · Inquire for Pre-Orders & Custom Batches`;
    }
}

function orderCurrentTshirtWhatsApp() {
    if (typeof window.pixelTrackEvent === 'function') {
        window.pixelTrackEvent('whatsapp_click', {
            button_location: 'tshirt_customizer',
            service_category: 'DTF T-Shirts',
            outbound_type: 'whatsapp'
        });
    }

    const msg = `Hi Pixel Team! I am interested in your DTF T-Shirt line:\n\n` +
        `👕 *Design Concept:* ${currentTshirtDesign.title} (${currentTshirtDesign.subtitle})\n` +
        `🎨 *Preview Color:* ${currentTshirtColor.name}\n` +
        `📏 *Target Size:* ${currentTshirtSize}\n` +
        `✨ *Status:* Available Soon / Pre-Order Inquiry\n` +
        `📦 *Material:* 240 GSM 100% Combed Cotton (Wash-Proof DTF)\n\n` +
        `Please let me know when pre-orders open or how I can order a custom batch!`;

    const url = `https://wa.me/94716125715?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

function sendQuickWhatsApp() {
    const name = document.getElementById('contact-name')?.value.trim() || 'A Customer';
    const service = document.getElementById('contact-service')?.value || 'General Inquiry';
    const msg = document.getElementById('contact-msg')?.value.trim() || 'I am interested in your services!';

    if (typeof window.pixelTrackEvent === 'function') {
        window.pixelTrackEvent('whatsapp_click', {
            button_location: 'contact_form_whatsapp',
            service_category: service,
            outbound_type: 'whatsapp'
        });
    }

    const text = `Hi Pixel Team, my name is ${name}.\nI am contacting you regarding: *${service}*.\n\nProject Details:\n${msg}`;
    const url = `https://wa.me/94716125715?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

/* ==================== LIGHTBOX MODAL ==================== */
function openDirectImage(imgSrc, title) {
    currentLightboxImages = [imgSrc];
    currentLightboxIndex = 0;

    if (typeof window.pixelTrackEvent === 'function') {
        window.pixelTrackEvent('portfolio_view', {
            project_id: 'review_screenshot',
            project_title: title || 'Client Review Screenshot',
            project_category: 'Client Reviews'
        });
    }

    const modal = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    const counter = document.getElementById('lightboxCounter');
    const videoLinks = document.getElementById('lightboxVideoLinks');

    if (!modal || !img) return;

    img.src = imgSrc;
    if (caption) caption.textContent = title || 'Verified Facebook Recommendation';
    if (counter) counter.textContent = '1 / 1';
    if (videoLinks) videoLinks.innerHTML = '';

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function openLightbox(projectId) {
    const project = loadedProjects.find(p => p.id === projectId);
    if (!project) return;

    if (typeof window.pixelTrackEvent === 'function') {
        window.pixelTrackEvent('portfolio_view', {
            project_id: project.id || projectId,
            project_title: project.title || 'Portfolio Item',
            project_category: project.category || project.type || 'Portfolio'
        });
    }

    currentLightboxImages = (project.images && project.images.length > 0) 
        ? project.images 
        : [project.image || 'video_placeholder.png'];
    currentLightboxIndex = 0;

    const modal = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    const counter = document.getElementById('lightboxCounter');
    const videoLinks = document.getElementById('lightboxVideoLinks');

    if (!modal || !img) return;

    img.src = currentLightboxImages[0];
    if (caption) caption.textContent = project.title || '';
    if (counter) counter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;

    if (videoLinks) {
        let vHtml = '';
        if (project.youtubeUrl) {
            vHtml += `<a href="${escapeHtml(project.youtubeUrl)}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"><i class="fab fa-youtube text-sm"></i> Watch on YouTube</a>`;
        }
        if (project.facebookUrl) {
            vHtml += `<a href="${escapeHtml(project.facebookUrl)}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"><i class="fab fa-facebook text-sm"></i> Watch on Facebook</a>`;
        }
        videoLinks.innerHTML = vHtml;
    }

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

window.openLightbox = openLightbox;
window.openDirectImage = openDirectImage;
window.closeLightbox = closeLightbox;
window.sendQuickWhatsApp = sendQuickWhatsApp;
window.orderCurrentTshirtWhatsApp = orderCurrentTshirtWhatsApp;

