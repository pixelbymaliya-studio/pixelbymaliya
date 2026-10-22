/**
 * PIXEL DISTRIBUTION SUITE — CORE DATABASE & BUSINESS LOGIC ENGINE
 * Developer: Pixel by Maliya
 * Product: Pixel Distribution Suite
 * Tagline: Smarter Distribution. Complete Business Control.
 * 
 * 100% Original Synthetic Demonstration Dataset for Sri Lankan FMCG & Wholesale Distribution.
 * Features reactive event publishing and LocalStorage persistence with instant Demo Reset.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PixelDMS = root.PixelDMS || {};
    root.PixelDMS.DB = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  const STORAGE_KEY = 'pixel_dms_store_v1';

  // 100% Original Synthetic Data Seed
  function getInitialSeed() {
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      
      // Warehouses & Mobile Fleet Depots
      warehouses: [
        { id: 'WH-01', code: 'HUB-KEL', name: 'Central Logistics Hub', location: 'Kelaniya Industrial Zone', type: 'CENTRAL_WAREHOUSE', capacity: '15,000 Cases', manager: 'Sunil Weerasinghe' },
        { id: 'WH-02', code: 'DEP-RTM', name: 'Colombo South Depot', location: 'Ratmalana Logistics Park', type: 'REGIONAL_DEPOT', capacity: '8,000 Cases', manager: 'Rohan Jayatilleke' },
        { id: 'VAN-01', code: 'VAN-METRO', name: 'Sales Van 01 (Colombo Metro)', vehicleNo: 'WP NB-4821', type: 'MOBILE_VAN', capacity: '350 Cases', repId: 'REP-01', routeId: 'RT-01' },
        { id: 'VAN-02', code: 'VAN-GMPH', name: 'Sales Van 02 (Gampaha-Negombo)', vehicleNo: 'WP NC-9214', type: 'MOBILE_VAN', capacity: '400 Cases', repId: 'REP-02', routeId: 'RT-02' },
        { id: 'VAN-03', code: 'VAN-KNDY', name: 'Sales Van 03 (Kandy Highway)', vehicleNo: 'WP ND-3156', type: 'MOBILE_VAN', capacity: '420 Cases', repId: 'REP-03', routeId: 'RT-03' }
      ],

      // Routes
      routes: [
        { id: 'RT-01', code: 'RT-COL-METRO', name: 'Route 01: Colombo Metro & Suburbs', coverage: 'Pettah, Borella, Nugegoda, Dehiwala', repId: 'REP-01', vehicleId: 'VAN-01', frequency: 'Daily', activeOutlets: 28, targetLKR: 1800000 },
        { id: 'RT-02', code: 'RT-GMP-NEGB', name: 'Route 02: Gampaha & Negombo FMCG Corridor', coverage: 'Kelaniya, Wattala, Ja-Ela, Negombo', repId: 'REP-02', vehicleId: 'VAN-02', frequency: 'Mon, Wed, Fri', activeOutlets: 24, targetLKR: 1500000 },
        { id: 'RT-03', code: 'RT-KND-HWAY', name: 'Route 03: Kandy & Central Highway', coverage: 'Kadawatha, Nittambuwa, Kegalle, Kandy', repId: 'REP-03', vehicleId: 'VAN-03', frequency: 'Tue, Thu, Sat', activeOutlets: 22, targetLKR: 1600000 },
        { id: 'RT-04', code: 'RT-SOU-COAST', name: 'Route 04: Southern Coastal Line', coverage: 'Panadura, Kalutara, Galle, Matara', repId: 'REP-04', vehicleId: null, frequency: 'Key Accounts Direct', activeOutlets: 18, targetLKR: 2000000 }
      ],

      // Sales Representatives
      salesReps: [
        { id: 'REP-01', code: 'REP-101', name: 'Nuwan Bandara', phone: '+94 77 234 5671', routeId: 'RT-01', vanId: 'VAN-01', monthlyTarget: 1800000, mtdSales: 1420500, mtdCollections: 1290000, commissionRate: 1.5, status: 'ON_ROUTE' },
        { id: 'REP-02', code: 'REP-102', name: 'Dimuthu Silva', phone: '+94 71 892 3410', routeId: 'RT-02', vanId: 'VAN-02', monthlyTarget: 1500000, mtdSales: 1180400, mtdCollections: 1050200, commissionRate: 1.5, status: 'ON_ROUTE' },
        { id: 'REP-03', code: 'REP-103', name: 'Chaminda Fernando', phone: '+94 76 541 2398', routeId: 'RT-03', vanId: 'VAN-03', monthlyTarget: 1600000, mtdSales: 1340200, mtdCollections: 1120000, commissionRate: 1.5, status: 'ON_ROUTE' },
        { id: 'REP-04', code: 'REP-104', name: 'Kasun Perera', phone: '+94 70 312 9081', routeId: 'RT-04', vanId: null, monthlyTarget: 2000000, mtdSales: 1690000, mtdCollections: 1540000, commissionRate: 2.0, status: 'KEY_ACCOUNTS' }
      ],

      // FMCG & Wholesale Product Catalog
      products: [
        {
          id: 'PRD-001',
          code: 'BEV-TEA-01',
          name: 'Ceylon Gold Premium BOPF Tea (500g)',
          category: 'Beverages',
          packaging: 'Case of 24 Packs',
          unitsPerCase: 24,
          unitCost: 600,
          caseCost: 14400,
          unitWholesalePrice: 758.33,
          caseWholesalePrice: 18200,
          retailMRP: 850,
          reorderLevel: 80,
          barcode: '793512300018',
          stock: { 'WH-01': 320, 'WH-02': 100, 'VAN-01': 25, 'VAN-02': 18, 'VAN-03': 30 }
        },
        {
          id: 'PRD-002',
          code: 'FOD-COC-02',
          name: 'Sunburst Pure Coconut Milk 400ml Can',
          category: 'Food Essentials',
          packaging: 'Carton of 24 Cans',
          unitsPerCase: 24,
          unitCost: 300,
          caseCost: 7200,
          unitWholesalePrice: 380,
          caseWholesalePrice: 9120,
          retailMRP: 440,
          reorderLevel: 100,
          barcode: '793512300025',
          stock: { 'WH-01': 480, 'WH-02': 150, 'VAN-01': 35, 'VAN-02': 28, 'VAN-03': 22 }
        },
        {
          id: 'PRD-003',
          code: 'BIS-CRM-03',
          name: 'Royal Crisp Cream Crackers 200g',
          category: 'Biscuits & Bakery',
          packaging: 'Case of 48 Packs',
          unitsPerCase: 48,
          unitCost: 130,
          caseCost: 6240,
          unitWholesalePrice: 160,
          caseWholesalePrice: 7680,
          retailMRP: 190,
          reorderLevel: 120,
          barcode: '793512300032',
          stock: { 'WH-01': 420, 'WH-02': 120, 'VAN-01': 40, 'VAN-02': 32, 'VAN-03': 25 }
        },
        {
          id: 'PRD-004',
          code: 'SPC-CUR-04',
          name: 'Island Spice Roasted Curry Powder 250g',
          category: 'Spices & Condiments',
          packaging: 'Box of 20 Packs',
          unitsPerCase: 20,
          unitCost: 240,
          caseCost: 4800,
          unitWholesalePrice: 310,
          caseWholesalePrice: 6200,
          retailMRP: 370,
          reorderLevel: 60,
          barcode: '793512300049',
          stock: { 'WH-01': 240, 'WH-02': 70, 'VAN-01': 15, 'VAN-02': 20, 'VAN-03': 18 }
        },
        {
          id: 'PRD-005',
          code: 'DRY-UHT-05',
          name: 'Highland Valley Full Cream UHT Milk 1L',
          category: 'Dairy & Chilled',
          packaging: 'Carton of 12 Cartons',
          unitsPerCase: 12,
          unitCost: 380,
          caseCost: 4560,
          unitWholesalePrice: 480,
          caseWholesalePrice: 5760,
          retailMRP: 550,
          reorderLevel: 90,
          barcode: '793512300056',
          stock: { 'WH-01': 580, 'WH-02': 180, 'VAN-01': 45, 'VAN-02': 30, 'VAN-03': 40 }
        },
        {
          id: 'PRD-006',
          code: 'BEV-CRD-06',
          name: 'Nectar Tropical Fruit Cordial 750ml',
          category: 'Beverages',
          packaging: 'Case of 12 Bottles',
          unitsPerCase: 12,
          unitCost: 450,
          caseCost: 5400,
          unitWholesalePrice: 570,
          caseWholesalePrice: 6840,
          retailMRP: 680,
          reorderLevel: 50,
          barcode: '793512300063',
          stock: { 'WH-01': 210, 'WH-02': 80, 'VAN-01': 18, 'VAN-02': 14, 'VAN-03': 12 }
        },
        {
          id: 'PRD-007',
          code: 'CLN-DET-07',
          name: 'Pearl White Washing Powder 1kg',
          category: 'Home & Hygiene',
          packaging: 'Sack of 10 Packs',
          unitsPerCase: 10,
          unitCost: 380,
          caseCost: 3800,
          unitWholesalePrice: 485,
          caseWholesalePrice: 4850,
          retailMRP: 560,
          reorderLevel: 75,
          barcode: '793512300070',
          stock: { 'WH-01': 320, 'WH-02': 90, 'VAN-01': 20, 'VAN-02': 25, 'VAN-03': 15 }
        },
        {
          id: 'PRD-008',
          code: 'CLN-DSH-08',
          name: 'Active Fresh Lemon Dishwash Gel 500ml',
          category: 'Home & Hygiene',
          packaging: 'Case of 24 Bottles',
          unitsPerCase: 24,
          unitCost: 280,
          caseCost: 6720,
          unitWholesalePrice: 350,
          caseWholesalePrice: 8400,
          retailMRP: 420,
          reorderLevel: 60,
          barcode: '793512300087',
          stock: { 'WH-01': 280, 'WH-02': 60, 'VAN-01': 16, 'VAN-02': 12, 'VAN-03': 14 }
        },
        {
          id: 'PRD-009',
          code: 'GRN-RIC-09',
          name: 'Golden Harvest Basmati Rice 5kg',
          category: 'Grains & Pulses',
          packaging: 'Bale of 5 Bags',
          unitsPerCase: 5,
          unitCost: 2300,
          caseCost: 11500,
          unitWholesalePrice: 2760,
          caseWholesalePrice: 13800,
          retailMRP: 3100,
          reorderLevel: 40,
          barcode: '793512300094',
          stock: { 'WH-01': 150, 'WH-02': 50, 'VAN-01': 10, 'VAN-02': 8, 'VAN-03': 12 }
        },
        {
          id: 'PRD-010',
          code: 'BEV-MLT-10',
          name: 'ChocoDelight Malt Energy Drink 400g',
          category: 'Beverages',
          packaging: 'Carton of 24 Tins',
          unitsPerCase: 24,
          unitCost: 700,
          caseCost: 16800,
          unitWholesalePrice: 850,
          caseWholesalePrice: 20400,
          retailMRP: 990,
          reorderLevel: 45,
          barcode: '793512300100',
          stock: { 'WH-01': 130, 'WH-02': 40, 'VAN-01': 12, 'VAN-02': 10, 'VAN-03': 8 }
        },
        {
          id: 'PRD-011',
          code: 'SPC-CHL-11',
          name: 'Chilli Flakes Grade-A Hot 500g',
          category: 'Spices & Condiments',
          packaging: 'Pack of 10 Bags',
          unitsPerCase: 10,
          unitCost: 550,
          caseCost: 5500,
          unitWholesalePrice: 710,
          caseWholesalePrice: 7100,
          retailMRP: 850,
          reorderLevel: 50,
          barcode: '793512300117',
          stock: { 'WH-01': 290, 'WH-02': 90, 'VAN-01': 22, 'VAN-02': 18, 'VAN-03': 16 }
        },
        {
          id: 'PRD-012',
          code: 'BIS-WFR-12',
          name: 'Crispy Sweet Coconut Wafers 100g',
          category: 'Biscuits & Bakery',
          packaging: 'Outer of 36 Packs',
          unitsPerCase: 36,
          unitCost: 90,
          caseCost: 3240,
          unitWholesalePrice: 115,
          caseWholesalePrice: 4140,
          retailMRP: 140,
          reorderLevel: 90,
          barcode: '793512300124',
          stock: { 'WH-01': 380, 'WH-02': 110, 'VAN-01': 30, 'VAN-02': 28, 'VAN-03': 24 }
        }
      ],

      // Customers & Retail Outlets
      customers: [
        {
          id: 'CUST-101',
          code: 'CUST-COL-001',
          outletName: 'Araliya Super City',
          tradeName: 'Araliya Retail Pvt Ltd',
          category: 'Supermarket',
          contactPerson: 'Kanishka Bandara',
          phone: '+94 11 257 8891',
          mobile: '+94 77 345 6789',
          email: 'accounts@araliyasuper.lk',
          address: 'No. 142, Galle Road, Colombo 03 (Kollupitiya)',
          territory: 'Colombo Metro',
          routeId: 'RT-01',
          creditLimit: 1500000,
          creditPeriodDays: 30,
          currentBalance: 485000,
          creditStatus: 'ACTIVE', // ACTIVE, ON_HOLD, BLOCKED
          taxNumber: 'VAT-100293847-7000',
          createdDate: '2025-01-15'
        },
        {
          id: 'CUST-102',
          code: 'CUST-COL-002',
          outletName: 'Lanka Mega Wholesale',
          tradeName: 'Lanka Mega Trading Stores',
          category: 'Wholesaler',
          contactPerson: 'M. S. Mohamed Farook',
          phone: '+94 11 232 4455',
          mobile: '+94 71 445 9922',
          email: 'farook@lankamega.lk',
          address: '88, 4th Cross Street, Pettah, Colombo 11',
          territory: 'Colombo Metro',
          routeId: 'RT-01',
          creditLimit: 3000000,
          creditPeriodDays: 14,
          currentBalance: 2420000,
          creditStatus: 'ACTIVE',
          taxNumber: 'VAT-199482711-7000',
          createdDate: '2025-01-10'
        },
        {
          id: 'CUST-103',
          code: 'CUST-GMP-001',
          outletName: 'Singha Retail Grocers',
          tradeName: 'Singha Stores & Minimart',
          category: 'Grocer',
          contactPerson: 'Gamini Dissanayake',
          phone: '+94 11 294 1200',
          mobile: '+94 77 812 3490',
          email: 'singhastores@gmail.com',
          address: '215, Negombo Road, Wattala',
          territory: 'Gampaha & Negombo',
          routeId: 'RT-02',
          creditLimit: 600000,
          creditPeriodDays: 14,
          currentBalance: 245500,
          creditStatus: 'ACTIVE',
          taxNumber: 'TIN-48392019',
          createdDate: '2025-02-01'
        },
        {
          id: 'CUST-104',
          code: 'CUST-KND-001',
          outletName: 'Central Food Mart',
          tradeName: 'Central Foods Kandy LLC',
          category: 'Supermarket',
          contactPerson: 'Anura Senanayake',
          phone: '+94 81 223 8840',
          mobile: '+94 76 112 4455',
          email: 'centralfoodkandy@sltnet.lk',
          address: '45, Dalada Veediya, Kandy',
          territory: 'Kandy & Central',
          routeId: 'RT-03',
          creditLimit: 1200000,
          creditPeriodDays: 21,
          currentBalance: 610000,
          creditStatus: 'ACTIVE',
          taxNumber: 'VAT-884920194-7000',
          createdDate: '2025-02-15'
        },
        {
          id: 'CUST-105',
          code: 'CUST-MAT-001',
          outletName: 'Ruhunu Express Distributors',
          tradeName: 'Ruhunu Express Wholesale Pvt Ltd',
          category: 'Wholesaler',
          contactPerson: 'Pradeep Weerakkody',
          phone: '+94 41 222 3456',
          mobile: '+94 77 555 8899',
          email: 'info@ruhunuexpress.lk',
          address: '12, Broadway, Matara Town',
          territory: 'Southern Coastal',
          routeId: 'RT-04',
          creditLimit: 2500000,
          creditPeriodDays: 30,
          currentBalance: 1150000,
          creditStatus: 'ACTIVE',
          taxNumber: 'VAT-903829103-7000',
          createdDate: '2025-01-20'
        },
        {
          id: 'CUST-106',
          code: 'CUST-GAL-001',
          outletName: 'Galle Harbour Stores',
          tradeName: 'Harbour Maritime Provisions',
          category: 'Grocer',
          contactPerson: 'Saman Jayasinghe',
          phone: '+94 91 224 5511',
          mobile: '+94 71 234 9012',
          email: 'galleharbour@sltnet.lk',
          address: '76, Main Street, Fort, Galle',
          territory: 'Southern Coastal',
          routeId: 'RT-04',
          creditLimit: 500000,
          creditPeriodDays: 14,
          currentBalance: 115000,
          creditStatus: 'ACTIVE',
          taxNumber: 'TIN-98432104',
          createdDate: '2025-02-10'
        },
        {
          id: 'CUST-107',
          code: 'CUST-KUR-001',
          outletName: 'Wayamba Fresh Mart',
          tradeName: 'Wayamba Trading Co.',
          category: 'Supermarket',
          contactPerson: 'Nalinda Jayawardena',
          phone: '+94 37 222 8900',
          mobile: '+94 77 678 1234',
          email: 'wayambafresh@gmail.com',
          address: '180, Colombo Road, Kurunegala',
          territory: 'Kandy & Central',
          routeId: 'RT-03',
          creditLimit: 900000,
          creditPeriodDays: 21,
          currentBalance: 840000, // Near limit!
          creditStatus: 'ACTIVE',
          taxNumber: 'VAT-493820192-7000',
          createdDate: '2025-03-01'
        },
        {
          id: 'CUST-108',
          code: 'CUST-KEL-001',
          outletName: 'Kelani Valley Provisions',
          tradeName: 'Kelani Stores',
          category: 'Grocer',
          contactPerson: 'Dhammika Alwis',
          phone: '+94 11 291 3344',
          mobile: '+94 70 890 1234',
          email: 'kelanivalley@outlook.com',
          address: '32, Biyagama Road, Kelaniya',
          territory: 'Gampaha & Negombo',
          routeId: 'RT-02',
          creditLimit: 400000,
          creditPeriodDays: 7,
          currentBalance: 395000,
          creditStatus: 'ON_HOLD', // On hold due to overdue balance
          taxNumber: 'TIN-38291049',
          createdDate: '2025-01-25'
        },
        {
          id: 'CUST-109',
          code: 'CUST-DEH-001',
          outletName: 'Silverline Hypermarket',
          tradeName: 'Silverline Retail Group',
          category: 'Supermarket',
          contactPerson: 'Thushara Rajapaksha',
          phone: '+94 11 273 6611',
          mobile: '+94 77 908 7766',
          email: 'merchandise@silverline.lk',
          address: '310, Galle Road, Dehiwala Junction',
          territory: 'Colombo Metro',
          routeId: 'RT-01',
          creditLimit: 2000000,
          creditPeriodDays: 30,
          currentBalance: 880000,
          creditStatus: 'ACTIVE',
          taxNumber: 'VAT-667788990-7000',
          createdDate: '2025-01-18'
        },
        {
          id: 'CUST-110',
          code: 'CUST-NEG-001',
          outletName: 'Negombo Coastal Traders',
          tradeName: 'Coastal Traders Wholesale Agency',
          category: 'Wholesaler',
          contactPerson: 'Joseph Jude Fernando',
          phone: '+94 31 223 9988',
          mobile: '+94 71 556 1209',
          email: 'coastaltraders@yahoo.com',
          address: '154, Beach Road, Negombo',
          territory: 'Gampaha & Negombo',
          routeId: 'RT-02',
          creditLimit: 1800000,
          creditPeriodDays: 14,
          currentBalance: 720000,
          creditStatus: 'ACTIVE',
          taxNumber: 'VAT-223344556-7000',
          createdDate: '2025-02-20'
        }
      ],

      // Sales Invoices
      invoices: [
        {
          id: 'INV-2026-0081',
          invoiceNo: 'INV-0081',
          customerId: 'CUST-101',
          customerName: 'Araliya Super City',
          date: '2026-10-18',
          dueDate: '2026-11-17',
          warehouseId: 'WH-01',
          repId: 'REP-01',
          paymentType: 'CREDIT',
          items: [
            { productId: 'PRD-001', name: 'Ceylon Gold Premium BOPF Tea (500g)', packaging: 'Case of 24 Packs', qty: 10, unitPrice: 18200, discountPct: 2, total: 178360 },
            { productId: 'PRD-002', name: 'Sunburst Pure Coconut Milk 400ml Can', packaging: 'Carton of 24 Cans', qty: 15, unitPrice: 9120, discountPct: 0, total: 136800 },
            { productId: 'PRD-005', name: 'Highland Valley Full Cream UHT Milk 1L', packaging: 'Carton of 12 Cartons', qty: 20, unitPrice: 5760, discountPct: 0, total: 115200 }
          ],
          subtotal: 434400,
          discountAmount: 4040,
          taxAmount: 0,
          totalAmount: 430360,
          paidAmount: 0,
          balanceDue: 430360,
          status: 'UNPAID' // PAID, PARTIAL, UNPAID, OVERDUE
        },
        {
          id: 'INV-2026-0082',
          invoiceNo: 'INV-0082',
          customerId: 'CUST-102',
          customerName: 'Lanka Mega Wholesale',
          date: '2026-10-19',
          dueDate: '2026-11-02',
          warehouseId: 'WH-01',
          repId: 'REP-01',
          paymentType: 'CREDIT',
          items: [
            { productId: 'PRD-003', name: 'Royal Crisp Cream Crackers 200g', packaging: 'Case of 48 Packs', qty: 40, unitPrice: 7680, discountPct: 3, total: 297984 },
            { productId: 'PRD-007', name: 'Pearl White Washing Powder 1kg', packaging: 'Sack of 10 Packs', qty: 30, unitPrice: 4850, discountPct: 2, total: 142590 },
            { productId: 'PRD-009', name: 'Golden Harvest Basmati Rice 5kg', packaging: 'Bale of 5 Bags', qty: 25, unitPrice: 13800, discountPct: 2, total: 338100 }
          ],
          subtotal: 785400,
          discountAmount: 18726,
          taxAmount: 0,
          totalAmount: 766674,
          paidAmount: 300000,
          balanceDue: 466674,
          status: 'PARTIAL'
        },
        {
          id: 'INV-2026-0083',
          invoiceNo: 'INV-0083',
          customerId: 'CUST-103',
          customerName: 'Singha Retail Grocers',
          date: '2026-10-20',
          dueDate: '2026-10-20',
          warehouseId: 'VAN-02',
          repId: 'REP-02',
          paymentType: 'CASH',
          items: [
            { productId: 'PRD-004', name: 'Island Spice Roasted Curry Powder 250g', packaging: 'Box of 20 Packs', qty: 5, unitPrice: 6200, discountPct: 0, total: 31000 },
            { productId: 'PRD-006', name: 'Nectar Tropical Fruit Cordial 750ml', packaging: 'Case of 12 Bottles', qty: 6, unitPrice: 6840, discountPct: 0, total: 41040 }
          ],
          subtotal: 72040,
          discountAmount: 0,
          taxAmount: 0,
          totalAmount: 72040,
          paidAmount: 72040,
          balanceDue: 0,
          status: 'PAID'
        },
        {
          id: 'INV-2026-0084',
          invoiceNo: 'INV-0084',
          customerId: 'CUST-104',
          customerName: 'Central Food Mart',
          date: '2026-10-21',
          dueDate: '2026-11-11',
          warehouseId: 'VAN-03',
          repId: 'REP-03',
          paymentType: 'CHEQUE',
          items: [
            { productId: 'PRD-001', name: 'Ceylon Gold Premium BOPF Tea (500g)', packaging: 'Case of 24 Packs', qty: 12, unitPrice: 18200, discountPct: 2, total: 214032 },
            { productId: 'PRD-010', name: 'ChocoDelight Malt Energy Drink 400g', packaging: 'Carton of 24 Tins', qty: 8, unitPrice: 20400, discountPct: 0, total: 163200 }
          ],
          subtotal: 381600,
          discountAmount: 4368,
          taxAmount: 0,
          totalAmount: 377232,
          paidAmount: 377232, // Paid by PDC cheque
          balanceDue: 0,
          status: 'PAID'
        },
        {
          id: 'INV-2026-0085',
          invoiceNo: 'INV-0085',
          customerId: 'CUST-108',
          customerName: 'Kelani Valley Provisions',
          date: '2026-09-28', // Overdue!
          dueDate: '2026-10-05',
          warehouseId: 'WH-01',
          repId: 'REP-02',
          paymentType: 'CREDIT',
          items: [
            { productId: 'PRD-002', name: 'Sunburst Pure Coconut Milk 400ml Can', packaging: 'Carton of 24 Cans', qty: 20, unitPrice: 9120, discountPct: 0, total: 182400 },
            { productId: 'PRD-008', name: 'Active Fresh Lemon Dishwash Gel 500ml', packaging: 'Case of 24 Bottles', qty: 15, unitPrice: 8400, discountPct: 0, total: 126000 }
          ],
          subtotal: 308400,
          discountAmount: 0,
          taxAmount: 0,
          totalAmount: 308400,
          paidAmount: 0,
          balanceDue: 308400,
          status: 'OVERDUE'
        }
      ],

      // Cheque Pipeline (Crucial for Sri Lankan distributors)
      cheques: [
        {
          id: 'CHQ-1001',
          chequeNumber: '782910',
          bankName: 'Commercial Bank of Ceylon',
          branch: 'Kollupitiya Branch (012)',
          customerId: 'CUST-101',
          customerName: 'Araliya Super City',
          amount: 250000,
          chequeDate: '2026-10-22', // Matured today
          depositDate: '2026-10-22',
          status: 'DEPOSITED', // IN_HAND, DEPOSITED, CLEARED, RETURNED
          receivedByRep: 'REP-01',
          invoiceRef: 'INV-2026-0070',
          notes: 'Standard 21-day post-dated settlement'
        },
        {
          id: 'CHQ-1002',
          chequeNumber: '449102',
          bankName: 'Sampath Bank PLC',
          branch: 'Pettah Wholesale Super Branch (008)',
          customerId: 'CUST-102',
          customerName: 'Lanka Mega Wholesale',
          amount: 500000,
          chequeDate: '2026-10-24', // Due in 2 days
          depositDate: null,
          status: 'IN_HAND',
          receivedByRep: 'REP-01',
          invoiceRef: 'INV-2026-0075',
          notes: 'PDC received during weekly collection'
        },
        {
          id: 'CHQ-1003',
          chequeNumber: '881290',
          bankName: 'Hatton National Bank (HNB)',
          branch: 'Kandy City Centre Branch (044)',
          customerId: 'CUST-104',
          customerName: 'Central Food Mart',
          amount: 377232,
          chequeDate: '2026-10-28',
          depositDate: null,
          status: 'IN_HAND',
          receivedByRep: 'REP-03',
          invoiceRef: 'INV-2026-0084',
          notes: 'Direct settlement for Invoice 0084'
        },
        {
          id: 'CHQ-1004',
          chequeNumber: '119283',
          bankName: 'Bank of Ceylon (BOC)',
          branch: 'Wattala Branch (071)',
          customerId: 'CUST-103',
          customerName: 'Singha Retail Grocers',
          amount: 180000,
          chequeDate: '2026-10-15',
          depositDate: '2026-10-16',
          status: 'CLEARED',
          clearedDate: '2026-10-18',
          receivedByRep: 'REP-02',
          invoiceRef: 'INV-2026-0062',
          notes: 'Realized successfully into BOC Main Corporate Account'
        },
        {
          id: 'CHQ-1005',
          chequeNumber: '339104',
          bankName: 'Seylan Bank PLC',
          branch: 'Kelaniya Branch (033)',
          customerId: 'CUST-108',
          customerName: 'Kelani Valley Provisions',
          amount: 145000,
          chequeDate: '2026-10-08',
          depositDate: '2026-10-10',
          status: 'RETURNED',
          returnReason: 'Refer to Drawer (Insufficient Funds)',
          returnDate: '2026-10-12',
          receivedByRep: 'REP-02',
          invoiceRef: 'INV-2026-0065',
          notes: 'Cheque bounced. Customer balance re-debited and credit put on hold.'
        }
      ],

      // Payment Collections
      collections: [
        {
          id: 'COL-501',
          receiptNo: 'REC-0501',
          date: '2026-10-20',
          customerId: 'CUST-103',
          customerName: 'Singha Retail Grocers',
          repId: 'REP-02',
          repName: 'Dimuthu Silva',
          paymentMode: 'CASH',
          amount: 72040,
          invoiceRef: 'INV-2026-0083',
          notes: 'Van cash collection on spot delivery'
        },
        {
          id: 'COL-502',
          receiptNo: 'REC-0502',
          date: '2026-10-19',
          customerId: 'CUST-102',
          customerName: 'Lanka Mega Wholesale',
          repId: 'REP-01',
          repName: 'Nuwan Bandara',
          paymentMode: 'BANK_TRANSFER',
          amount: 300000,
          invoiceRef: 'INV-2026-0082',
          notes: 'Commercial Bank direct online slip upload'
        },
        {
          id: 'COL-503',
          receiptNo: 'REC-0503',
          date: '2026-10-18',
          customerId: 'CUST-109',
          customerName: 'Silverline Hypermarket',
          repId: 'REP-01',
          repName: 'Nuwan Bandara',
          paymentMode: 'CHEQUE',
          amount: 450000,
          invoiceRef: 'INV-2026-0071',
          chequeNo: '556102',
          notes: 'PDC received for 30-day billing cycle'
        }
      ],

      // Van Loading Sheets & Daily Route Reconciliations
      loadingSheets: [
        {
          id: 'LOAD-2026-1022-V1',
          sheetNo: 'LDS-1022-01',
          date: '2026-10-22',
          vanId: 'VAN-01',
          repId: 'REP-01',
          routeId: 'RT-01',
          driver: 'Rathnayake Bandara',
          status: 'ACTIVE_TRIP', // ACTIVE_TRIP, RECONCILED
          loadedItems: [
            { productId: 'PRD-001', name: 'Ceylon Gold Premium BOPF Tea', loadedCases: 30, soldCases: 5, returnCases: 25 },
            { productId: 'PRD-002', name: 'Sunburst Pure Coconut Milk', loadedCases: 40, soldCases: 8, returnCases: 32 },
            { productId: 'PRD-003', name: 'Royal Crisp Cream Crackers', loadedCases: 45, soldCases: 10, returnCases: 35 },
            { productId: 'PRD-005', name: 'Highland Valley Full Cream UHT Milk', loadedCases: 50, soldCases: 12, returnCases: 38 }
          ],
          tripTotalValue: 1824000,
          cashCollected: 124500,
          chequesCollected: 250000,
          creditInvoicesIssued: 380400,
          varianceLKR: 0
        },
        {
          id: 'LOAD-2026-1021-V2',
          sheetNo: 'LDS-1021-02',
          date: '2026-10-21',
          vanId: 'VAN-02',
          repId: 'REP-02',
          routeId: 'RT-02',
          driver: 'Sunil Weeraratne',
          status: 'RECONCILED',
          loadedItems: [
            { productId: 'PRD-004', name: 'Island Spice Curry Powder', loadedCases: 25, soldCases: 10, returnCases: 15 },
            { productId: 'PRD-007', name: 'Pearl White Washing Powder', loadedCases: 30, soldCases: 12, returnCases: 18 }
          ],
          tripTotalValue: 840000,
          cashCollected: 142000,
          chequesCollected: 180000,
          creditInvoicesIssued: 210000,
          varianceLKR: 0,
          reconciledBy: 'Dispatch Supervisor - Ranjith K.'
        }
      ],

      // Returns & Credit Notes
      returns: [
        {
          id: 'RET-2026-001',
          creditNoteNo: 'CN-0041',
          date: '2026-10-17',
          customerId: 'CUST-101',
          customerName: 'Araliya Super City',
          invoiceRef: 'INV-2026-0060',
          productId: 'PRD-005',
          productName: 'Highland Valley Full Cream UHT Milk 1L',
          qty: 2, // 2 cartons
          unitCreditPrice: 5760,
          totalCredit: 11520,
          reason: 'Transit Seal Leakage / Packaging Damage',
          actionTaken: 'CREDIT_NOTE_ISSUED',
          repId: 'REP-01',
          quarantineLocation: 'DAMAGED_POOL_KELANIYA'
        },
        {
          id: 'RET-2026-002',
          creditNoteNo: 'CN-0042',
          date: '2026-10-19',
          customerId: 'CUST-103',
          customerName: 'Singha Retail Grocers',
          invoiceRef: 'INV-2026-0069',
          productId: 'PRD-003',
          productName: 'Royal Crisp Cream Crackers 200g',
          qty: 1,
          unitCreditPrice: 7680,
          totalCredit: 7680,
          reason: 'Crushed Outer Carton During Van Transport',
          actionTaken: 'REPLACED_ON_VAN',
          repId: 'REP-02',
          quarantineLocation: 'DAMAGED_POOL_KELANIYA'
        }
      ],

      // Suppliers & Purchase Management
      suppliers: [
        { id: 'SUP-01', code: 'SUP-AGRO', name: 'Ceylon Agro Foods PLC', category: 'Tea & Coconut', contact: 'R. M. Herath', phone: '+94 11 289 1100', email: 'sales@ceylonagro.lk', address: 'Biyagama Free Trade Zone', balancePayable: 1420000, terms: '30 Days' },
        { id: 'SUP-02', code: 'SUP-LANKAMILLS', name: 'Lanka Mills & Confectionery Ltd', category: 'Biscuits & Bakery', contact: 'Shantha Perera', phone: '+94 11 243 8990', email: 'orders@lankamills.lk', address: 'Makumbura, Pannipitiya', balancePayable: 980000, terms: '21 Days' },
        { id: 'SUP-03', code: 'SUP-HIGHLAND', name: 'Highland Dairies & Agro Corp', category: 'Dairy Products', contact: 'Priyantha Ranasinghe', phone: '+94 52 222 3411', email: 'distribution@highlandcorp.lk', address: 'Nuwara Eliya Agro Estate', balancePayable: 2150000, terms: '14 Days' },
        { id: 'SUP-04', code: 'SUP-OCEAN', name: 'Ocean Breeze Chemical & Hygiene Ltd', category: 'Home & Cleaning', contact: 'Dilshan Silva', phone: '+94 11 254 7788', email: 'dilshan@oceanbreeze.lk', address: 'Ekala Industrial Estate, Ja-Ela', balancePayable: 640000, terms: '30 Days' }
      ],

      // Pricing & Promotional Schemes
      promotions: [
        { id: 'PROMO-01', code: 'SCH-TEA-05', name: '5% Volume Discount on Ceylon Gold Tea (20+ Cases)', category: 'Beverages', type: 'VOLUME_DISCOUNT', minQtyCases: 20, discountPct: 5, validTill: '2026-11-30', status: 'ACTIVE' },
        { id: 'PROMO-02', code: 'SCH-COC-10P1', name: 'Sunburst Coconut Milk Buy 10 Cases Get 1 Free', category: 'Food Essentials', type: 'BUY_X_GET_Y', buyQty: 10, freeQty: 1, validTill: '2026-10-31', status: 'ACTIVE' },
        { id: 'PROMO-03', code: 'SCH-CRACK-3', name: '3% Wholesale Incentive on Royal Crisp Crackers', category: 'Biscuits', type: 'VOLUME_DISCOUNT', minQtyCases: 30, discountPct: 3, validTill: '2026-11-15', status: 'ACTIVE' },
        { id: 'PROMO-04', code: 'SCH-EARLY-2', name: '2% Prompt Payment Cash Settlement Discount', category: 'All Categories', type: 'CASH_DISCOUNT', minQtyCases: 1, discountPct: 2, validTill: '2026-12-31', status: 'ACTIVE' }
      ],

      // Employees & Payroll
      employees: [
        { id: 'EMP-01', name: 'Nuwan Bandara', role: 'Senior Sales Representative', department: 'Field Sales', baseSalary: 65000, commissionEarned: 21307, allowances: 15000, epfDeduction: 5200, netSalary: 96107, phone: '+94 77 234 5671' },
        { id: 'EMP-02', name: 'Dimuthu Silva', role: 'Sales Representative', department: 'Field Sales', baseSalary: 55000, commissionEarned: 17706, allowances: 15000, epfDeduction: 4400, netSalary: 83306, phone: '+94 71 892 3410' },
        { id: 'EMP-03', name: 'Chaminda Fernando', role: 'Sales Representative', department: 'Field Sales', baseSalary: 55000, commissionEarned: 20103, allowances: 15000, epfDeduction: 4400, netSalary: 85703, phone: '+94 76 541 2398' },
        { id: 'EMP-04', name: 'Rathnayake Bandara', role: 'Heavy Vehicle Driver (Van 01)', department: 'Logistics', baseSalary: 50000, commissionEarned: 0, allowances: 18000, epfDeduction: 4000, netSalary: 64000, phone: '+94 77 912 3004' },
        { id: 'EMP-05', name: 'Sunil Weerasinghe', role: 'Warehouse & Dispatch Supervisor', department: 'Warehousing', baseSalary: 75000, commissionEarned: 0, allowances: 12000, epfDeduction: 6000, netSalary: 81000, phone: '+94 71 334 5511' }
      ],

      // Audit Trail
      auditLogs: [
        { id: 'AUD-901', timestamp: '2026-10-22 08:30:15', user: 'Sunil Weerasinghe (Warehouse)', action: 'DISPATCH_VAN', details: 'Van 01 (WP NB-4821) dispatched with 165 cases for Colombo Metro route.' },
        { id: 'AUD-902', timestamp: '2026-10-22 10:14:22', user: 'Nuwan Bandara (Sales Rep)', action: 'CHEQUE_REGISTERED', details: 'Cheque #782910 of LKR 250,000 received from Araliya Super City.' },
        { id: 'AUD-903', timestamp: '2026-10-22 11:45:00', user: 'K. Somapala (Credit Controller)', action: 'CREDIT_HOLD_ENFORCED', details: 'Customer CUST-108 (Kelani Valley Provisions) placed on Credit Hold due to bounced Cheque #339104.' },
        { id: 'AUD-904', timestamp: '2026-10-22 14:02:18', user: 'Dimuthu Silva (Sales Rep)', action: 'INVOICE_GENERATED', details: 'Cash Invoice INV-0083 of LKR 72,040 generated and settled at Singha Retail Grocers.' }
      ]
    };
  }

  // Load from Storage or fallback to fresh initial seed
  let state = null;
  const listeners = [];

  function loadState() {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (serialized) {
        state = JSON.parse(serialized);
        // Ensure all required collections exist
        const seed = getInitialSeed();
        for (const key in seed) {
          if (!state[key]) {
            state[key] = seed[key];
          }
        }
      } else {
        state = getInitialSeed();
        saveState();
      }
    } catch (e) {
      console.warn('LocalStorage error or quota exceeded, using in-memory state:', e);
      state = getInitialSeed();
    }
  }

  function saveState() {
    try {
      state.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      notify();
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }

  function subscribe(fn) {
    if (typeof fn === 'function') {
      listeners.push(fn);
    }
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }

  function notify() {
    listeners.forEach(fn => {
      try {
        fn(state);
      } catch (err) {
        console.error('Error in DB subscriber:', err);
      }
    });
  }

  // Initialize
  loadState();

  // Public Database API
  return {
    getState: () => state,
    subscribe,

    // Reset Demo Data to initial synthetic seed
    resetDemoData: () => {
      state = getInitialSeed();
      saveState();
      return true;
    },

    // 1. Executive Dashboard KPIs & Calculations
    getDashboardStats: () => {
      const invoices = state.invoices || [];
      const collections = state.collections || [];
      const customers = state.customers || [];
      const cheques = state.cheques || [];
      const products = state.products || [];
      const vans = state.warehouses.filter(w => w.type === 'MOBILE_VAN');

      // Gross Sales
      const grossSalesMTD = invoices.reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);
      
      // Today's Sales
      const todayStr = new Date().toISOString().split('T')[0];
      const todaySales = invoices
        .filter(inv => inv.date === todayStr || inv.date === '2026-10-22')
        .reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);

      // Total Collections MTD
      const collectionsMTD = collections.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

      // Outstanding Credit
      const totalOutstandingCredit = customers.reduce((sum, c) => sum + (Number(c.currentBalance) || 0), 0);

      // Cheque Exposure (In Hand + Deposited Uncleared)
      const unclearedCheques = cheques.filter(ch => ch.status === 'IN_HAND' || ch.status === 'DEPOSITED');
      const chequeExposureLKR = unclearedCheques.reduce((sum, ch) => sum + (Number(ch.amount) || 0), 0);

      // Overdue Debtors (Balance on overdue invoices)
      const overdueInvoices = invoices.filter(inv => inv.status === 'OVERDUE');
      const overdueBalanceLKR = overdueInvoices.reduce((sum, inv) => sum + (Number(inv.balanceDue) || 0), 0);

      // Stock Valuation at Wholesale Price
      let totalStockValueWholesale = 0;
      products.forEach(p => {
        let totalCases = 0;
        for (const loc in p.stock) {
          totalCases += (p.stock[loc] || 0);
        }
        totalStockValueWholesale += totalCases * p.caseWholesalePrice;
      });

      // Low Stock Count
      const lowStockProducts = products.filter(p => {
        let total = 0;
        for (const loc in p.stock) total += (p.stock[loc] || 0);
        return total <= p.reorderLevel;
      });

      return {
        grossSalesMTD,
        todaySales,
        collectionsMTD,
        totalOutstandingCredit,
        chequeExposureLKR,
        overdueBalanceLKR,
        totalStockValueWholesale,
        lowStockCount: lowStockProducts.length,
        activeVansCount: vans.length,
        totalOutletsCount: customers.length,
        activeOutletsOnHold: customers.filter(c => c.creditStatus === 'ON_HOLD' || c.creditStatus === 'BLOCKED').length
      };
    },

    // 2. Customers
    getCustomers: () => state.customers,
    getCustomerById: (id) => state.customers.find(c => c.id === id),
    addCustomer: (custData) => {
      const newId = 'CUST-' + (100 + state.customers.length + 1);
      const newCust = {
        id: newId,
        code: 'CUST-NEW-' + String(state.customers.length + 1).padStart(3, '0'),
        outletName: custData.outletName,
        tradeName: custData.tradeName || custData.outletName,
        category: custData.category || 'Grocer',
        contactPerson: custData.contactPerson || 'Proprietor',
        phone: custData.phone || '',
        mobile: custData.mobile || custData.phone || '',
        email: custData.email || '',
        address: custData.address || 'Sri Lanka',
        territory: custData.territory || 'Colombo Metro',
        routeId: custData.routeId || 'RT-01',
        creditLimit: Number(custData.creditLimit) || 500000,
        creditPeriodDays: Number(custData.creditPeriodDays) || 14,
        currentBalance: 0,
        creditStatus: 'ACTIVE',
        taxNumber: custData.taxNumber || '',
        createdDate: new Date().toISOString().split('T')[0]
      };
      state.customers.unshift(newCust);
      
      // Log audit
      state.auditLogs.unshift({
        id: 'AUD-' + Date.now(),
        timestamp: new Date().toLocaleString('en-GB'),
        user: 'Sales Admin',
        action: 'CUSTOMER_CREATED',
        details: `Customer ${newCust.outletName} (${newCust.code}) created with credit limit LKR ${newCust.creditLimit.toLocaleString()}.`
      });

      saveState();
      return newCust;
    },
    updateCustomer: (id, updates) => {
      const cust = state.customers.find(c => c.id === id);
      if (!cust) return null;
      Object.assign(cust, updates);
      saveState();
      return cust;
    },
    toggleCreditHold: (id, reason) => {
      const cust = state.customers.find(c => c.id === id);
      if (!cust) return null;
      cust.creditStatus = cust.creditStatus === 'ACTIVE' ? 'ON_HOLD' : 'ACTIVE';
      
      state.auditLogs.unshift({
        id: 'AUD-' + Date.now(),
        timestamp: new Date().toLocaleString('en-GB'),
        user: 'Credit Controller',
        action: cust.creditStatus === 'ON_HOLD' ? 'CREDIT_HOLD_ENFORCED' : 'CREDIT_HOLD_RELEASED',
        details: `Customer ${cust.outletName} credit status toggled to ${cust.creditStatus}. Reason: ${reason || 'Manual review'}`
      });

      saveState();
      return cust;
    },

    // 3. Products & Inventory
    getProducts: () => state.products,
    getProductById: (id) => state.products.find(p => p.id === id),
    getWarehouses: () => state.warehouses,
    
    // Transfer stock between Central Hub and Sales Vans
    transferStock: (productId, fromLocId, toLocId, qtyCases, notes) => {
      const product = state.products.find(p => p.id === productId);
      if (!product) throw new Error('Product not found');
      
      const currentFromStock = product.stock[fromLocId] || 0;
      if (currentFromStock < qtyCases) {
        throw new Error(`Insufficient stock in ${fromLocId}. Available: ${currentFromStock} cases, Requested: ${qtyCases}`);
      }

      product.stock[fromLocId] = currentFromStock - qtyCases;
      product.stock[toLocId] = (product.stock[toLocId] || 0) + qtyCases;

      state.auditLogs.unshift({
        id: 'AUD-' + Date.now(),
        timestamp: new Date().toLocaleString('en-GB'),
        user: 'Warehouse Supervisor',
        action: 'STOCK_TRANSFERRED',
        details: `Transferred ${qtyCases} cases of ${product.name} from ${fromLocId} to ${toLocId}. ${notes || ''}`
      });

      saveState();
      return { success: true, product };
    },

    // 4. Sales & Invoicing Workflow
    getInvoices: () => state.invoices,
    getInvoiceById: (id) => state.invoices.find(i => i.id === id),
    
    createInvoice: (invoiceData) => {
      const customer = state.customers.find(c => c.id === invoiceData.customerId);
      if (!customer) throw new Error('Customer required');

      // Check credit limit if CREDIT
      if (invoiceData.paymentType === 'CREDIT') {
        if (customer.creditStatus === 'ON_HOLD' || customer.creditStatus === 'BLOCKED') {
          throw new Error(`Cannot invoice on credit. Customer is on ${customer.creditStatus}!`);
        }
        const projectedBalance = customer.currentBalance + Number(invoiceData.totalAmount);
        if (projectedBalance > customer.creditLimit) {
          throw new Error(`Credit limit exceeded! Limit: LKR ${customer.creditLimit.toLocaleString()}, Projected: LKR ${projectedBalance.toLocaleString()}`);
        }
      }

      // Check stock & deduct
      const locId = invoiceData.warehouseId || 'WH-01';
      for (const item of invoiceData.items) {
        const prod = state.products.find(p => p.id === item.productId);
        if (!prod) throw new Error(`Product ${item.productId} not found`);
        const available = prod.stock[locId] || 0;
        if (available < item.qty) {
          throw new Error(`Insufficient stock for ${prod.name} at ${locId}. Available: ${available}, Required: ${item.qty}`);
        }
      }

      // Deduct stock
      for (const item of invoiceData.items) {
        const prod = state.products.find(p => p.id === item.productId);
        prod.stock[locId] = (prod.stock[locId] || 0) - item.qty;
      }

      // Generate invoice record
      const invNum = state.invoices.length + 86;
      const invId = `INV-2026-${String(invNum).padStart(4, '0')}`;
      const totalAmount = Number(invoiceData.totalAmount);
      
      let paidAmount = 0;
      let balanceDue = totalAmount;
      let status = 'UNPAID';

      if (invoiceData.paymentType === 'CASH') {
        paidAmount = totalAmount;
        balanceDue = 0;
        status = 'PAID';
        
        // Auto create collection receipt
        state.collections.unshift({
          id: 'COL-' + Date.now(),
          receiptNo: 'REC-' + String(state.collections.length + 504).padStart(4, '0'),
          date: invoiceData.date || new Date().toISOString().split('T')[0],
          customerId: customer.id,
          customerName: customer.outletName,
          repId: invoiceData.repId || 'REP-01',
          repName: (state.salesReps.find(r => r.id === invoiceData.repId) || {}).name || 'Field Rep',
          paymentMode: 'CASH',
          amount: totalAmount,
          invoiceRef: invId,
          notes: 'Instant cash settlement upon dispatch'
        });
      } else if (invoiceData.paymentType === 'CHEQUE' && invoiceData.chequeDetails) {
        // Cheque payment
        paidAmount = totalAmount;
        balanceDue = 0;
        status = 'PAID';

        state.cheques.unshift({
          id: 'CHQ-' + Date.now(),
          chequeNumber: invoiceData.chequeDetails.chequeNumber,
          bankName: invoiceData.chequeDetails.bankName,
          branch: invoiceData.chequeDetails.branch,
          customerId: customer.id,
          customerName: customer.outletName,
          amount: totalAmount,
          chequeDate: invoiceData.chequeDetails.chequeDate,
          depositDate: null,
          status: 'IN_HAND',
          receivedByRep: invoiceData.repId || 'REP-01',
          invoiceRef: invId,
          notes: invoiceData.chequeDetails.notes || 'Received on invoice creation'
        });
      } else {
        // CREDIT invoice — increase customer balance
        customer.currentBalance += totalAmount;
      }

      const newInvoice = {
        id: invId,
        invoiceNo: `INV-${String(invNum).padStart(4, '0')}`,
        customerId: customer.id,
        customerName: customer.outletName,
        date: invoiceData.date || new Date().toISOString().split('T')[0],
        dueDate: invoiceData.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        warehouseId: locId,
        repId: invoiceData.repId || 'REP-01',
        paymentType: invoiceData.paymentType,
        items: invoiceData.items,
        subtotal: Number(invoiceData.subtotal),
        discountAmount: Number(invoiceData.discountAmount || 0),
        taxAmount: Number(invoiceData.taxAmount || 0),
        totalAmount,
        paidAmount,
        balanceDue,
        status
      };

      state.invoices.unshift(newInvoice);

      // Audit log
      state.auditLogs.unshift({
        id: 'AUD-' + Date.now(),
        timestamp: new Date().toLocaleString('en-GB'),
        user: (state.salesReps.find(r => r.id === invoiceData.repId) || {}).name || 'Billing Executive',
        action: 'INVOICE_GENERATED',
        details: `Invoice ${newInvoice.invoiceNo} (LKR ${totalAmount.toLocaleString()}) created for ${customer.outletName} [${invoiceData.paymentType}]. Stock deducted from ${locId}.`
      });

      saveState();
      return newInvoice;
    },

    // 5. Cheques & Collections Workflow
    getCheques: () => state.cheques,
    addCheque: (chqData) => {
      const newChq = {
        id: 'CHQ-' + Date.now(),
        chequeNumber: chqData.chequeNumber,
        bankName: chqData.bankName,
        branch: chqData.branch || 'Main Branch',
        customerId: chqData.customerId,
        customerName: (state.customers.find(c => c.id === chqData.customerId) || {}).outletName || 'Customer',
        amount: Number(chqData.amount),
        chequeDate: chqData.chequeDate,
        depositDate: chqData.depositDate || null,
        status: chqData.status || 'IN_HAND',
        receivedByRep: chqData.repId || 'REP-01',
        invoiceRef: chqData.invoiceRef || 'N/A',
        notes: chqData.notes || ''
      };
      state.cheques.unshift(newChq);

      state.auditLogs.unshift({
        id: 'AUD-' + Date.now(),
        timestamp: new Date().toLocaleString('en-GB'),
        user: 'Cheque Desk Officer',
        action: 'CHEQUE_REGISTERED',
        details: `Registered Cheque #${newChq.chequeNumber} (${newChq.bankName}) for LKR ${newChq.amount.toLocaleString()} from ${newChq.customerName}.`
      });

      saveState();
      return newChq;
    },

    updateChequeStatus: (id, newStatus, extraData = {}) => {
      const chq = state.cheques.find(c => c.id === id);
      if (!chq) throw new Error('Cheque not found');

      const oldStatus = chq.status;
      chq.status = newStatus;

      if (newStatus === 'DEPOSITED') {
        chq.depositDate = extraData.depositDate || new Date().toISOString().split('T')[0];
      } else if (newStatus === 'CLEARED') {
        chq.clearedDate = extraData.clearedDate || new Date().toISOString().split('T')[0];
      } else if (newStatus === 'RETURNED') {
        chq.returnDate = new Date().toISOString().split('T')[0];
        chq.returnReason = extraData.returnReason || 'Refer to Drawer';
        
        // When a cheque bounces, if the customer's balance was previously reduced, re-debit their balance!
        const cust = state.customers.find(c => c.id === chq.customerId);
        if (cust) {
          cust.currentBalance += chq.amount;
          cust.creditStatus = 'ON_HOLD'; // Auto put on credit hold
        }
      }

      state.auditLogs.unshift({
        id: 'AUD-' + Date.now(),
        timestamp: new Date().toLocaleString('en-GB'),
        user: 'Cash & Bank Controller',
        action: `CHEQUE_${newStatus}`,
        details: `Cheque #${chq.chequeNumber} (${chq.bankName}) status changed from ${oldStatus} to ${newStatus}. ${extraData.returnReason ? 'Reason: ' + extraData.returnReason : ''}`
      });

      saveState();
      return chq;
    },

    getCollections: () => state.collections,
    recordCollection: (colData) => {
      const cust = state.customers.find(c => c.id === colData.customerId);
      if (!cust) throw new Error('Customer required');

      const amount = Number(colData.amount);
      if (amount <= 0) throw new Error('Amount must be greater than zero');

      // Reduce outstanding balance
      cust.currentBalance = Math.max(0, cust.currentBalance - amount);

      const newRec = {
        id: 'COL-' + Date.now(),
        receiptNo: 'REC-' + String(state.collections.length + 505).padStart(4, '0'),
        date: colData.date || new Date().toISOString().split('T')[0],
        customerId: cust.id,
        customerName: cust.outletName,
        repId: colData.repId || 'REP-01',
        repName: (state.salesReps.find(r => r.id === colData.repId) || {}).name || 'Field Rep',
        paymentMode: colData.paymentMode || 'CASH',
        amount,
        invoiceRef: colData.invoiceRef || 'Ledger Credit',
        notes: colData.notes || 'Collection received'
      };

      state.collections.unshift(newRec);

      state.auditLogs.unshift({
        id: 'AUD-' + Date.now(),
        timestamp: new Date().toLocaleString('en-GB'),
        user: newRec.repName,
        action: 'COLLECTION_RECORDED',
        details: `Collected LKR ${amount.toLocaleString()} via ${newRec.paymentMode} from ${cust.outletName}. Customer balance reduced to LKR ${cust.currentBalance.toLocaleString()}.`
      });

      saveState();
      return newRec;
    },

    // 6. Route & Van Sales Management
    getRoutes: () => state.routes,
    getSalesReps: () => state.salesReps,
    getLoadingSheets: () => state.loadingSheets,
    
    // Complete End-of-Day Van Reconciliation
    reconcileVanTrip: (sheetId, reconciliationData) => {
      const sheet = state.loadingSheets.find(s => s.id === sheetId);
      if (!sheet) throw new Error('Loading sheet not found');

      sheet.status = 'RECONCILED';
      sheet.reconciledAt = new Date().toISOString();
      sheet.reconciledBy = reconciliationData.supervisorName || 'Dispatch Supervisor';
      sheet.cashCollected = Number(reconciliationData.physicalCashHandover);
      sheet.chequesCollected = Number(reconciliationData.chequesHandover);
      sheet.varianceLKR = Number(reconciliationData.varianceLKR || 0);

      state.auditLogs.unshift({
        id: 'AUD-' + Date.now(),
        timestamp: new Date().toLocaleString('en-GB'),
        user: sheet.reconciledBy,
        action: 'VAN_EOD_RECONCILED',
        details: `End-of-day reconciliation finalized for ${sheet.sheetNo} (${sheet.vanId}). Handover: Cash LKR ${sheet.cashCollected.toLocaleString()}, Cheques LKR ${sheet.chequesCollected.toLocaleString()}. Variance: LKR ${sheet.varianceLKR}.`
      });

      saveState();
      return sheet;
    },

    // 7. Returns Management
    getReturns: () => state.returns,
    createReturn: (returnData) => {
      const cust = state.customers.find(c => c.id === returnData.customerId);
      const prod = state.products.find(p => p.id === returnData.productId);
      if (!cust || !prod) throw new Error('Customer and Product required');

      const qty = Number(returnData.qty);
      const unitCreditPrice = Number(returnData.unitPrice || prod.caseWholesalePrice);
      const totalCredit = qty * unitCreditPrice;

      const cnNumber = 'CN-' + String(state.returns.length + 43).padStart(4, '0');

      // Deduct from customer balance
      cust.currentBalance = Math.max(0, cust.currentBalance - totalCredit);

      const newReturn = {
        id: 'RET-' + Date.now(),
        creditNoteNo: cnNumber,
        date: returnData.date || new Date().toISOString().split('T')[0],
        customerId: cust.id,
        customerName: cust.outletName,
        invoiceRef: returnData.invoiceRef || 'N/A',
        productId: prod.id,
        productName: prod.name,
        qty,
        unitCreditPrice,
        totalCredit,
        reason: returnData.reason || 'Transit Damage / Expiry',
        actionTaken: returnData.actionTaken || 'CREDIT_NOTE_ISSUED',
        repId: returnData.repId || 'REP-01',
        quarantineLocation: 'DAMAGED_POOL_KELANIYA'
      };

      state.returns.unshift(newReturn);

      state.auditLogs.unshift({
        id: 'AUD-' + Date.now(),
        timestamp: new Date().toLocaleString('en-GB'),
        user: 'Returns Officer',
        action: 'CREDIT_NOTE_ISSUED',
        details: `Issued Credit Note ${cnNumber} for LKR ${totalCredit.toLocaleString()} to ${cust.outletName} for ${qty} cases of ${prod.name}.`
      });

      saveState();
      return newReturn;
    },

    // 8. Suppliers & Purchasing
    getSuppliers: () => state.suppliers,
    receivePurchaseOrder: (poData) => {
      const sup = state.suppliers.find(s => s.id === poData.supplierId);
      const prod = state.products.find(p => p.id === poData.productId);
      if (!sup || !prod) throw new Error('Supplier and Product required');

      const qty = Number(poData.qtyCases);
      const cost = qty * prod.caseCost;

      // Add to Central Hub stock
      prod.stock['WH-01'] = (prod.stock['WH-01'] || 0) + qty;
      sup.balancePayable += cost;

      state.auditLogs.unshift({
        id: 'AUD-' + Date.now(),
        timestamp: new Date().toLocaleString('en-GB'),
        user: 'Stores Receiver',
        action: 'GOODS_RECEIVED_GRN',
        details: `Received ${qty} cases of ${prod.name} from ${sup.name} into Central Hub. Payable increased by LKR ${cost.toLocaleString()}.`
      });

      saveState();
      return { success: true, newStock: prod.stock['WH-01'] };
    },

    // 9. Pricing & Promotions
    getPromotions: () => state.promotions,

    // 10. HR & Payroll
    getEmployees: () => state.employees,

    // 11. Audit Logs
    getAuditLogs: () => state.auditLogs
  };

}));
