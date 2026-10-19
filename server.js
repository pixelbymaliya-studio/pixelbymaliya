require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Serve root studio website & assets
app.use(express.static(path.join(__dirname)));

// 2. Serve dedicated POS application at /pos
app.use('/pos', express.static(path.join(__dirname, 'pos')));

// Initialize Supabase Client
let supabase = null;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase PostgreSQL Client connected successfully!');
  } catch (err) {
    console.warn('⚠️ Could not initialize Supabase client:', err.message);
  }
} else {
  console.log('ℹ️ Running in Local In-Memory Demo Mode.');
}

// Demo Products Catalog
let products = [
  { id: '1', name: 'Samba Rice 1Kg', sku: 'GRC-001', barcode: '8901001', category: 'Grocery', product_type: 'PHYSICAL', price: 240.00, cost: 190.00, stock_quantity: 150, unit: 'kg' },
  { id: '2', name: 'Munchee Super Cream Cracker 190g', sku: 'GRC-002', barcode: '8901002', category: 'Grocery', product_type: 'PHYSICAL', price: 180.00, cost: 140.00, stock_quantity: 85, unit: 'pcs' },
  { id: '3', name: 'Highland Full Cream Milk Powder 400g', sku: 'GRC-003', barcode: '8901003', category: 'Grocery', product_type: 'PHYSICAL', price: 1050.00, cost: 920.00, stock_quantity: 40, unit: 'pcs' },
  { id: '4', name: 'Chicken Cheese Kottu (Full)', sku: 'RST-001', barcode: '8902001', category: 'Food & Dining', product_type: 'PHYSICAL', price: 1450.00, cost: 650.00, stock_quantity: 100, unit: 'portion' },
  { id: '5', name: 'Special Mixed Fried Rice', sku: 'RST-002', barcode: '8902002', category: 'Food & Dining', product_type: 'PHYSICAL', price: 1650.00, cost: 720.00, stock_quantity: 80, unit: 'portion' },
  { id: '6', name: 'Iced Milo Dinosaur', sku: 'RST-003', barcode: '8902003', category: 'Beverages', product_type: 'PHYSICAL', price: 350.00, cost: 120.00, stock_quantity: 200, unit: 'glass' },
  { id: '7', name: 'Ceylon Premium Black Tea', sku: 'RST-004', barcode: '8902004', category: 'Beverages', product_type: 'PHYSICAL', price: 150.00, cost: 35.00, stock_quantity: 300, unit: 'cup' },
  { id: '8', name: 'Corporate Logo Design Package', sku: 'SRV-001', barcode: '8903001', category: 'Services', product_type: 'SERVICE', price: 8500.00, cost: 1500.00, stock_quantity: 999, unit: 'package' },
  { id: '9', name: 'A4 Color Document Printing', sku: 'SRV-002', barcode: '8903002', category: 'Services', product_type: 'SERVICE', price: 50.00, cost: 12.00, stock_quantity: 5000, unit: 'page' },
  { id: '10', name: 'Flex Banner Print (6x3 ft)', sku: 'SRV-003', barcode: '8903003', category: 'Services', product_type: 'SERVICE', price: 3200.00, cost: 1100.00, stock_quantity: 999, unit: 'banner' }
];

let expenses = [
  { id: 'exp-1', title: 'SLT Fiber Broadband Internet Bill', category: 'Utilities', amount: 4850.00, date: new Date().toISOString().split('T')[0], notes: 'Monthly office fiber line' },
  { id: 'exp-2', title: 'Printer Ink Refill & Maintenance', category: 'Maintenance', amount: 3500.00, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], notes: 'Epson ink refill' },
  { id: 'exp-3', title: 'Main Store Shop Rent - Monthly', category: 'Rent', amount: 25000.00, date: new Date(Date.now() - 172800000).toISOString().split('T')[0], notes: 'Commercial space rental lease' }
];

let orders = [
  {
    id: 'ORD-1001',
    order_number: 1001,
    customer_name: 'Kamal Perera (Walk-in)',
    items: [
      { product_id: '1', name: 'Samba Rice 1Kg', quantity: 5, unit_price: 240.00, total: 1200.00 },
      { product_id: '2', name: 'Munchee Super Cream Cracker 190g', quantity: 2, unit_price: 180.00, total: 360.00 }
    ],
    subtotal: 1560.00,
    tax: 124.80,
    discount: 0.00,
    total: 1684.80,
    payment_method: 'CASH',
    status: 'COMPLETED',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

// API Endpoints
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    let orderList = orders;
    let expenseList = expenses;

    if (supabase) {
      const { data: dbOrders } = await supabase.from('orders').select('*');
      const { data: dbExpenses } = await supabase.from('expenses').select('*');
      if (dbOrders && dbOrders.length > 0) orderList = dbOrders;
      if (dbExpenses && dbExpenses.length > 0) expenseList = dbExpenses;
    }

    const totalIncome = orderList.reduce((sum, o) => sum + Number(o.total_amount || o.total || 0), 0);
    const totalExpenses = expenseList.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const netProfit = totalIncome - totalExpenses;

    res.json({
      totalIncome: parseFloat(totalIncome.toFixed(2)),
      totalExpenses: parseFloat(totalExpenses.toFixed(2)),
      netProfit: parseFloat(netProfit.toFixed(2)),
      totalOrdersCount: orderList.length,
      recentTransactions: [...orderList].reverse().slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.get('/api/expenses', (req, res) => {
  res.json(expenses);
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// POS route
app.get('/pos', (req, res) => {
  res.sendFile(path.join(__dirname, 'pos', 'index.html'));
});

// Start unified server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 Pixel By Maliya Unified Website running on port ${PORT}`);
  console.log(`👉 Studio Portfolio: http://localhost:${PORT}/`);
  console.log(`👉 Cloud POS Demo:   http://localhost:${PORT}/pos/`);
  console.log(`===================================================`);
});
