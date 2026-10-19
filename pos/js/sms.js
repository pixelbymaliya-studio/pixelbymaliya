// =====================================================================
// PIXEL BY MALIYA POS — SMS CENTRE (every shop)
// Bills auto-send an SMS summary; staff can compose and manage the log.
// =====================================================================

const SMS_TEMPLATES = {
  offer:    'Special offer this week only at ',
  reminder: 'Reminder: you have an appointment with us soon. Please arrive 10 minutes early. Thank you!',
  payment:  'Reminder: a balance is due on your account. Please settle at your earliest convenience. Thank you!',
  thanks:   'Thank you for shopping with us! We appreciate your business.'
};

async function loadSmsData() {
  const [list, settings] = await Promise.all([api.getSms(), api.getSmsSettings()]);
  renderSmsStats(list);
  renderSmsLog(list);
  fillSmsSettings(settings);
}

function renderSmsStats(list) {
  const todayKey = new Date().toISOString().split('T')[0];
  const sentToday = list.filter(s => s.status === 'Sent' && (s.created_at || '').slice(0, 10) === todayKey).length;
  const failed = list.filter(s => s.status === 'Failed' || s.status === 'Blocked').length;
  const bills = list.filter(s => s.type === 'Bill').length;
  const credits = (document.getElementById('sms-credits'));
  animateCount(document.getElementById('sms-sent-today'), sentToday, '', 0);
  animateCount(document.getElementById('sms-total'), list.length, '', 0);
  animateCount(document.getElementById('sms-failed'), failed, '', 0);
  animateCount(document.getElementById('sms-bill-count'), bills, '', 0);
  api.getSmsSettings().then(st => { if (credits) credits.innerText = Number(st.credits || 0).toLocaleString(); });
}

function smsStatusClass(s) {
  const map = {
    Sent: 'bg-emerald-500/20 text-emerald-300',
    Failed: 'bg-rose-500/20 text-rose-300',
    Blocked: 'bg-rose-500/20 text-rose-300',
    Skipped: 'bg-slate-500/20 text-slate-300'
  };
  return map[s] || 'bg-slate-500/20 text-slate-300';
}

function renderSmsLog(list) {
  const tbody = document.getElementById('sms-log-body');
  if (!tbody) return;
  if (!list || list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-500">No messages yet. Complete a bill at the POS to auto-send an SMS.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map((s, i) => {
    const when = s.created_at ? new Date(s.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';
    return `
      <tr class="border-b border-white/5 hover:bg-white/5 transition-all table-row-enter" style="animation-delay:${i * 0.03}s">
        <td class="px-4 py-3">
          <p class="font-bold text-slate-100 text-sm">${s.to}</p>
          ${s.customer ? `<p class="text-[10px] text-slate-500">${s.customer}</p>` : ''}
        </td>
        <td class="px-4 py-3 text-xs text-slate-300 max-w-[320px]"><span class="line-clamp-2">${s.message}</span></td>
        <td class="px-4 py-3 text-xs">
          <span class="px-2 py-0.5 rounded ${s.type === 'Bill' ? 'bg-primary/15 text-primary' : 'bg-white/5 text-slate-300'} font-semibold">${s.type}</span>
        </td>
        <td class="px-4 py-3"><span class="px-2 py-0.5 rounded text-xs font-semibold ${smsStatusClass(s.status)}">${s.status}</span></td>
        <td class="px-4 py-3 text-xs text-slate-400">${when}</td>
        <td class="px-4 py-3 text-right"><button onclick="deleteSms('${s.id}')" class="px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition"><i class="fa-solid fa-trash"></i></button></td>
      </tr>`;
  }).join('');
}

function fillSmsSettings(s) {
  s = s || {};
  const en = document.getElementById('sms-enabled');
  const prov = document.getElementById('sms-provider');
  const sender = document.getElementById('sms-sender');
  const mob = document.getElementById('sms-mobile');
  if (en) en.checked = s.enabled !== false;
  if (prov && s.provider) prov.value = s.provider;
  if (sender) sender.value = s.senderId || '';
  if (mob) mob.value = s.mobile || '';
}

// ---------- Auto bill SMS ----------
async function sendBillSms(order) {
  if (!order) return;
  const settings = await api.getSmsSettings();
  const biz = getBusiness();
  const total = Number(order.total ?? order.total_amount ?? 0);
  const itemCount = (order.items || []).length;
  const to = order.customer_phone || settings.mobile || '';
  const msg = `${biz.storeName}: Bill #${order.order_number || order.id} - ${itemCount} item(s) - Total Rs.${total.toFixed(2)}. Thank you for your business!`;
  const rec = await api.sendSms({ to, message: msg, type: 'Bill', customer: order.customer_name || '' });
  if (rec.status === 'Sent') toast(`Bill SMS sent to ${to}`, 'success');
  else if (rec.status === 'Blocked') toast('Bill SMS held — SMS gateway is switched off', 'info');
  else if (rec.status === 'Skipped') toast('Bill SMS skipped — no customer mobile number', 'info');
  else toast('Bill SMS failed — check gateway credits', 'error');
  const sec = document.getElementById('tab-sms');
  if (sec && !sec.classList.contains('hidden')) loadSmsData();
}

// ---------- Compose ----------
function applySmsTemplate() {
  const key = document.getElementById('sms-template-select')?.value;
  const msg = document.getElementById('sms-compose-message');
  const biz = getBusiness();
  if (!key || !msg) return;
  let text = SMS_TEMPLATES[key] || '';
  if (key === 'offer') text = `Special offer this week only at ${biz.storeName}! Visit us to enjoy exclusive discounts.`;
  if (key === 'thanks') text = `${biz.storeName}: Thank you for your business. We look forward to serving you again!`;
  msg.value = text;
  updateSmsCharCount();
}

function updateSmsCharCount() {
  const msg = document.getElementById('sms-compose-message');
  const el = document.getElementById('sms-char-count');
  if (!msg || !el) return;
  const len = msg.value.length;
  const parts = Math.max(1, Math.ceil(len / 160));
  el.innerText = `(${len} chars · ${parts} SMS)`;
}

async function sendSmsCompose() {
  const to = document.getElementById('sms-compose-to')?.value.trim();
  const message = document.getElementById('sms-compose-message')?.value.trim();
  if (!message) { toast('Type a message first', 'error'); return; }
  const rec = await api.sendSms({ to, message, type: 'Manual' });
  if (rec.status === 'Sent') toast('SMS sent', 'success');
  else if (rec.status === 'Blocked') toast('Gateway is switched off', 'error');
  else if (rec.status === 'Skipped') toast('Enter a mobile number', 'error');
  else toast('SMS failed — no credits', 'error');
  document.getElementById('sms-compose-to').value = '';
  document.getElementById('sms-compose-message').value = '';
  document.getElementById('sms-template-select').value = '';
  updateSmsCharCount();
  loadSmsData();
}

async function saveSmsSettings() {
  const patch = {
    enabled: document.getElementById('sms-enabled')?.checked !== false,
    provider: document.getElementById('sms-provider')?.value,
    senderId: document.getElementById('sms-sender')?.value,
    mobile: document.getElementById('sms-mobile')?.value
  };
  await api.saveSmsSettings(patch);
  toast('SMS gateway settings saved', 'success');
  loadSmsData();
}

async function deleteSms(id) {
  await api.deleteSms(id);
  await loadSmsData();
  toast('Message removed', 'info');
}

async function clearSmsLog() {
  const list = await api.getSms();
  for (const s of list) await api.deleteSms(s.id);
  await loadSmsData();
  toast('SMS log cleared', 'info');
}
