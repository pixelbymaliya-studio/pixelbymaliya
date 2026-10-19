// =====================================================================
// PIXEL BY MALIYA POS — RECIPES & INGREDIENTS (restaurant)
// Attach raw ingredients to a menu item; every sale deducts raw stock.
// =====================================================================

let recipeDraft = [];
let recipesCatalog = [];
let recipesIngredientList = [];

async function loadRecipesData() {
  const [ingredients, recipes, products] = await Promise.all([
    api.getIngredients(), api.getRecipes(), api.getProducts()
  ]);
  recipesIngredientList = ingredients;
  recipesCatalog = products || [];
  renderRecipesKpis(ingredients, recipes);
  renderIngredientsTable(ingredients);
  renderRecipeProductOptions(recipes);
  if (recipesCatalog.length) {
    const sel = document.getElementById('recipe-product-select');
    if (sel && sel.value) await loadRecipeForProduct();
    else { recipeDraft = []; renderRecipeLines(); }
  }
}

function renderRecipesKpis(ingredients, recipes) {
  const grid = document.getElementById('recipes-kpi-grid');
  if (!grid) return;
  const low = ingredients.filter(g => Number(g.stock) <= Number(g.reorder)).length;
  const dishCount = Object.keys(recipes || {}).length;
  const value = ingredients.reduce((s, g) => s + Number(g.stock) * Number(g.cost), 0);
  const card = (label, val, icon, tone, isMoney) => `
    <div class="glass-card rounded-2xl p-4">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">${label}</span>
        <i class="fa-solid ${icon} text-${tone}-400"></i>
      </div>
      <p class="text-2xl font-extrabold text-white mt-2">${isMoney ? 'Rs. ' : ''}<span data-count="${val}">0</span></p>
    </div>`;
  grid.innerHTML =
    card('Ingredients', ingredients.length, 'fa-carrot', 'lime', false) +
    card('Low / Out of Stock', low, 'fa-triangle-exclamation', 'amber', false) +
    card('Dishes with Recipe', dishCount, 'fa-utensils', 'primary', false) +
    card('Stock Value', Math.round(value), 'fa-sack-dollar', 'emerald', true);
  grid.querySelectorAll('[data-count]').forEach(el => {
    const v = parseFloat(el.getAttribute('data-count')) || 0;
    animateCount(el, v, '', 0);
  });
}

function ingStatus(g) {
  const stock = Number(g.stock), reorder = Number(g.reorder);
  if (stock <= 0) return { label: 'Out', cls: 'bg-rose-500/20 text-rose-300' };
  if (stock <= reorder) return { label: 'Low', cls: 'bg-amber-500/20 text-amber-300' };
  return { label: 'OK', cls: 'bg-emerald-500/20 text-emerald-300' };
}

function renderIngredientsTable(ingredients) {
  const body = document.getElementById('ingredients-table-body');
  const count = document.getElementById('ingredients-count');
  if (count) count.innerText = ingredients.length + ' items';
  if (!body) return;
  if (!ingredients.length) {
    body.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-slate-500">No ingredients yet. Click "Add Ingredient".</td></tr>`;
    return;
  }
  body.innerHTML = ingredients.map(g => {
    const st = ingStatus(g);
    return `
      <tr class="border-b border-white/5 hover:bg-white/5 transition">
        <td class="py-2.5 pr-3">
          <div class="flex items-center gap-2">
            <span class="text-lg">${g.emoji || '\u{1F4E6}'}</span>
            <span class="font-semibold text-slate-100">${g.name}</span>
          </div>
        </td>
        <td class="py-2.5 px-3"><span class="font-bold text-slate-100">${Number(g.stock).toLocaleString()}</span> <span class="text-xs text-slate-500">${g.unit}</span></td>
        <td class="py-2.5 px-3 text-slate-300">Rs. ${Number(g.cost).toLocaleString()}</td>
        <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded text-xs font-semibold ${st.cls}">${st.label}</span></td>
        <td class="py-2.5 pl-3 text-right whitespace-nowrap">
          <button onclick="restockIngredient('${g.id}')" class="px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition" title="Add stock"><i class="fa-solid fa-arrow-up"></i></button>
          <button onclick="editIngredient('${g.id}')" class="px-2 py-1 text-xs text-sky-400 hover:bg-sky-500/10 rounded-lg transition" title="Edit"><i class="fa-solid fa-pen"></i></button>
          <button onclick="deleteIngredient('${g.id}')" class="px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition" title="Delete"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>`;
  }).join('');
}

function renderRecipeProductOptions(recipes) {
  const sel = document.getElementById('recipe-product-select');
  if (!sel) return;
  const prev = sel.value;
  sel.innerHTML = recipesCatalog.map(p => {
    const has = recipes && recipes[p.id] ? ' ✔' : '';
    return `<option value="${p.id}">${p.name}${has}</option>`;
  }).join('');
  if (prev) sel.value = prev;
}

async function loadRecipeForProduct() {
  const sel = document.getElementById('recipe-product-select');
  const nameEl = document.getElementById('recipe-current-name');
  if (!sel) return;
  const pid = sel.value;
  const prd = recipesCatalog.find(p => p.id === pid);
  if (nameEl) nameEl.innerText = (prd ? prd.name : 'Dish') + ' — per serving';
  const lines = await api.getRecipe(pid);
  recipeDraft = lines.map(l => ({ ingredientId: l.ingredientId, qty: l.qty }));
  if (recipeDraft.length === 0) recipeDraft.push({ ingredientId: '', qty: 1 });
  renderRecipeLines();
}

function ingredientOptions(selected) {
  return ['<option value="">— select —</option>'].concat(
    recipesIngredientList.map(g => `<option value="${g.id}" ${g.id === selected ? 'selected' : ''}>${g.emoji} ${g.name} (${g.unit})</option>`)
  ).join('');
}

function renderRecipeLines() {
  const wrap = document.getElementById('recipe-lines');
  if (!wrap) return;
  if (!recipeDraft.length) recipeDraft.push({ ingredientId: '', qty: 1 });
  wrap.innerHTML = recipeDraft.map((line, i) => `
    <div class="flex items-center gap-2">
      <select onchange="updateRecipeLine(${i}, 'ingredientId', this.value)" class="flex-1 bg-slate-900/70 border border-white/10 rounded-lg px-2 py-2 text-xs text-slate-100 focus:outline-none focus:border-primary">
        ${ingredientOptions(line.ingredientId)}
      </select>
      <input type="number" step="0.001" min="0" value="${line.qty}" onchange="updateRecipeLine(${i}, 'qty', this.value)" class="w-20 bg-slate-900/70 border border-white/10 rounded-lg px-2 py-2 text-xs text-slate-100 focus:outline-none focus:border-primary">
      <button onclick="removeRecipeLine(${i})" class="px-2 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition"><i class="fa-solid fa-xmark"></i></button>
    </div>`).join('');
}

function updateRecipeLine(i, key, val) {
  if (!recipeDraft[i]) return;
  recipeDraft[i][key] = key === 'qty' ? parseFloat(val) || 0 : val;
}

function addRecipeLine() {
  recipeDraft.push({ ingredientId: '', qty: 1 });
  renderRecipeLines();
}

function removeRecipeLine(i) {
  recipeDraft.splice(i, 1);
  if (!recipeDraft.length) recipeDraft.push({ ingredientId: '', qty: 1 });
  renderRecipeLines();
}

async function saveRecipeForProduct() {
  const sel = document.getElementById('recipe-product-select');
  if (!sel || !sel.value) { toast('Select a menu item first', 'error'); return; }
  const lines = recipeDraft.filter(l => l.ingredientId && Number(l.qty) > 0);
  if (lines.length === 0) { toast('Add at least one ingredient', 'error'); return; }
  await api.saveRecipe(sel.value, lines);
  toast('Recipe saved', 'success');
  await loadRecipesData();
}

async function clearRecipeForProduct() {
  const sel = document.getElementById('recipe-product-select');
  if (!sel || !sel.value) return;
  await api.saveRecipe(sel.value, []);
  toast('Recipe removed', 'info');
  recipeDraft = [{ ingredientId: '', qty: 1 }];
  await loadRecipesData();
}

// ---------- Ingredient CRUD ----------
function openIngredientModal(id) {
  const m = document.getElementById('add-ingredient-modal');
  const title = document.getElementById('ingredient-modal-title');
  const g = id ? recipesIngredientList.find(x => x.id === id) : null;
  document.getElementById('ing-id').value = g ? g.id : '';
  document.getElementById('ing-name').value = g ? g.name : '';
  document.getElementById('ing-unit').value = g ? g.unit : 'kg';
  document.getElementById('ing-stock').value = g ? g.stock : 0;
  document.getElementById('ing-cost').value = g ? g.cost : 0;
  document.getElementById('ing-reorder').value = g ? g.reorder : 0;
  if (title) title.innerText = g ? 'Edit Ingredient' : 'Add Ingredient';
  if (m) m.classList.remove('hidden');
}

function closeIngredientModal() {
  const m = document.getElementById('add-ingredient-modal');
  if (m) m.classList.add('hidden');
}

function editIngredient(id) { openIngredientModal(id); }

async function submitIngredient(e) {
  e.preventDefault();
  const id = document.getElementById('ing-id').value;
  const data = {
    name: document.getElementById('ing-name').value.trim(),
    unit: document.getElementById('ing-unit').value,
    stock: parseFloat(document.getElementById('ing-stock').value) || 0,
    cost: parseFloat(document.getElementById('ing-cost').value) || 0,
    reorder: parseFloat(document.getElementById('ing-reorder').value) || 0
  };
  if (!data.name) { toast('Name is required', 'error'); return; }
  if (id) {
    await api.updateIngredient(id, data);
    toast('Ingredient updated', 'success');
  } else {
    await api.addIngredient(data);
    toast('Ingredient added', 'success');
  }
  closeIngredientModal();
  await loadRecipesData();
}

async function deleteIngredient(id) {
  await api.deleteIngredient(id);
  toast('Ingredient removed', 'info');
  await loadRecipesData();
}

async function restockIngredient(id) {
  const g = recipesIngredientList.find(x => x.id === id);
  if (!g) return;
  const add = prompt(`Add stock for ${g.name} (${g.unit}) — current ${g.stock}:`, '10');
  if (add === null) return;
  const val = parseFloat(add) || 0;
  await api.updateIngredient(id, { stock: Number(g.stock) + val });
  toast(`Added ${val} ${g.unit} to ${g.name}`, 'success');
  await loadRecipesData();
}
