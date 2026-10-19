// =====================================================================
// PIXEL BY MALIYA POS — HR & STAFF MODULE
// =====================================================================
async function loadHRData() {
  const staff = await api.getHR();
  renderHRStats(staff);
  renderHRTable(staff);
}

function renderHRStats(staff) {
  const total = staff.length;
  const present = staff.filter(s => s.attendance === 'Present' && s.status === 'Active').length;
  const payroll = staff.reduce((s, e) => s + Number(e.salary || 0), 0);
  const t = document.getElementById('hr-total');
  const p = document.getElementById('hr-present');
  const pay = document.getElementById('hr-payroll');
  if (t) t.innerText = total;
  if (p) p.innerText = present;
  if (pay) pay.innerText = `Rs. ${payroll.toLocaleString()}`;
}

function renderHRTable(staff) {
  const tbody = document.getElementById('hr-table-body');
  if (!tbody) return;
  if (!staff || staff.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-slate-500">No staff added yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = staff.map((s, i) => {
    const statusColor = s.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300';
    const attColor = s.attendance === 'Present' ? 'text-emerald-400' : 'text-rose-400';
    const initials = (s.name || 'S').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    return `
      <tr class="border-b border-white/5 hover:bg-white/5 transition-all table-row-enter" style="animation-delay:${i * 0.04}s">
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-xl btn-primary flex items-center justify-center text-white text-xs font-black">${initials}</span>
            <div>
              <p class="font-bold text-slate-100">${s.name}</p>
              <p class="text-[10px] text-slate-500">Joined ${s.joined || '-'}</p>
            </div>
          </div>
        </td>
        <td class="px-4 py-3 text-slate-300 text-xs font-semibold">${s.role}</td>
        <td class="px-4 py-3 text-slate-400 text-xs font-mono">${s.phone || '-'}</td>
        <td class="px-4 py-3 font-extrabold text-emerald-400">Rs. ${Number(s.salary || 0).toLocaleString()}</td>
        <td class="px-4 py-3 text-xs">
          <span class="px-2 py-0.5 rounded ${statusColor} font-semibold">${s.status}</span>
          <span class="${attColor} font-bold ml-2">${s.attendance || 'Present'}</span>
        </td>
        <td class="px-4 py-3 text-right space-x-1">
          <button onclick="toggleAttendance('${s.id}', '${s.attendance}')" title="Toggle attendance" class="px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded-lg transition"><i class="fa-solid fa-calendar-check"></i></button>
          <button onclick="deleteEmployee('${s.id}')" class="px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>`;
  }).join('');
}

async function toggleAttendance(id, current) {
  const next = current === 'Present' ? 'Leave' : 'Present';
  await api.updateEmployee(id, { attendance: next });
  await loadHRData();
  toast(`Attendance marked ${next}`, 'info');
}

async function deleteEmployee(id) {
  await api.deleteEmployee(id);
  await loadHRData();
  toast('Staff removed', 'success');
}

function openAddEmployeeModal() {
  document.getElementById('add-employee-modal').classList.remove('hidden');
}
function closeAddEmployeeModal() {
  document.getElementById('add-employee-modal').classList.add('hidden');
}

async function handleEmployeeSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('emp-name').value;
  const role = document.getElementById('emp-role').value;
  const phone = document.getElementById('emp-phone').value;
  const salary = parseFloat(document.getElementById('emp-salary').value || 0);
  try {
    await api.addEmployee({ name, role, phone, salary });
    closeAddEmployeeModal();
    e.target.reset();
    await loadHRData();
    toast('Staff member added', 'success');
  } catch (err) {
    toast('Error adding staff', 'error');
  }
}
