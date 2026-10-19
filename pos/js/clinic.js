// =====================================================================
// PIXEL BY MALIYA POS — IN-HOUSE CLINIC & DOCTORS MODULE (PHARMACY)
// =====================================================================
const CLINIC_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CLINIC_STATUS_FLOW = ['Scheduled', 'Waiting', 'In Consultation', 'Completed'];

function _clinicToday() {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
}
function _clinicInitials(name) {
  return (name || 'D').replace(/^Dr\.?\s*/i, '').split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}
function _clinicStatusStyle(s) {
  switch (s) {
    case 'Completed': return 'bg-emerald-500/20 text-emerald-300';
    case 'In Consultation': return 'bg-sky-500/20 text-sky-300';
    case 'Waiting': return 'bg-amber-500/20 text-amber-300';
    default: return 'bg-slate-500/20 text-slate-300';
  }
}

async function loadClinicData() {
  const [doctors, appointments] = await Promise.all([api.getDoctors(), api.getAppointments()]);
  renderClinicStats(doctors, appointments);
  renderClinicDoctors(doctors);
  renderClinicQueue(appointments, doctors);
}

function renderClinicStats(doctors, appointments) {
  const today = _clinicToday();
  const onDuty = doctors.filter(d => (d.days || []).includes(today)).length;
  const patients = appointments.length;
  const income = appointments.reduce((s, a) => {
    const doc = doctors.find(d => d.id === a.doctorId);
    return s + Number(doc ? doc.fee : 0);
  }, 0);

  const totalEl = document.getElementById('clinic-total-doctors');
  const dutyEl = document.getElementById('clinic-on-duty');
  const patEl = document.getElementById('clinic-patients-today');
  const incEl = document.getElementById('clinic-income');
  if (totalEl) animateCount(totalEl, doctors.length, '', 0);
  if (dutyEl) animateCount(dutyEl, onDuty, '', 0);
  if (patEl) animateCount(patEl, patients, '', 0);
  if (incEl) animateCount(incEl, income, 'Rs. ', 0);

  const dateEl = document.getElementById('clinic-queue-date');
  if (dateEl) dateEl.innerText = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
}

function renderClinicDoctors(doctors) {
  const grid = document.getElementById('clinic-doctors-grid');
  if (!grid) return;
  if (!doctors || doctors.length === 0) {
    grid.innerHTML = `<div class="glass-panel p-6 rounded-2xl text-center text-slate-500 text-sm col-span-full">No doctors added yet. Click "Add Doctor" to build your clinic team.</div>`;
    return;
  }
  const today = _clinicToday();
  grid.innerHTML = doctors.map((d, i) => {
    const initials = _clinicInitials(d.name);
    const hasToday = (d.days || []).includes(today);
    const dayChips = CLINIC_DAYS.map(day => {
      const on = (d.days || []).includes(day);
      const isToday = day === today;
      return `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${on ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-600'} ${isToday && on ? 'ring-1 ring-primary/60' : ''}">${day}</span>`;
    }).join('');
    return `
      <div class="glass-panel p-5 rounded-2xl space-y-3 product-card section-enter" style="animation-delay:${i * 0.05}s">
        <div class="flex items-start gap-3">
          <div class="w-12 h-12 rounded-2xl btn-primary flex items-center justify-center text-white text-sm font-black shrink-0">${initials}</div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <p class="font-bold text-slate-100 truncate">${d.name}</p>
              ${hasToday ? '<span class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">TODAY</span>' : ''}
            </div>
            <p class="text-xs text-primary font-semibold truncate">${d.specialization || 'Doctor'}</p>
            <p class="text-[10px] text-slate-500 truncate">${d.qualifications || ''}</p>
          </div>
          <button onclick="deleteDoctor('${d.id}')" class="text-slate-500 hover:text-rose-400 transition"><i class="fa-solid fa-trash text-xs"></i></button>
        </div>
        <div class="flex flex-wrap gap-1">${dayChips}</div>
        <div class="grid grid-cols-2 gap-2 text-[11px] text-slate-400 border-t border-white/5 pt-3">
          <p><i class="fa-solid fa-door-open mr-1 text-slate-500"></i>${d.room || '—'}</p>
          <p><i class="fa-solid fa-phone mr-1 text-slate-500"></i>${d.phone || '—'}</p>
          <p class="col-span-2"><i class="fa-regular fa-clock mr-1 text-slate-500"></i>${d.hours || 'Schedule TBD'}</p>
        </div>
        <div class="flex items-center justify-between border-t border-white/5 pt-3">
          <div>
            <p class="text-[10px] text-slate-500">Consultation Fee</p>
            <p class="text-sm font-extrabold text-emerald-400">Rs. ${Number(d.fee || 0).toLocaleString()}</p>
          </div>
          <button onclick="bookForDoctor('${d.id}')" class="px-3 py-1.5 bg-primary/15 hover:bg-primary/25 text-primary text-xs font-bold rounded-lg transition">
            <i class="fa-solid fa-calendar-plus mr-1"></i> Book
          </button>
        </div>
      </div>`;
  }).join('');
}

function renderClinicQueue(appointments, doctors) {
  const tbody = document.getElementById('clinic-appointments-body');
  if (!tbody) return;
  if (!appointments || appointments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-slate-500">No appointments for today. Click "New Appointment" to add a patient.</td></tr>`;
    return;
  }
  const week = CLINIC_DAYS;
  tbody.innerHTML = appointments.map((a, i) => {
    const idx = CLINIC_STATUS_FLOW.indexOf(a.status);
    const next = CLINIC_STATUS_FLOW[Math.min(idx + 1, CLINIC_STATUS_FLOW.length - 1)];
    return `
      <tr class="border-b border-white/5 hover:bg-white/5 transition-all table-row-enter" style="animation-delay:${i * 0.04}s">
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-slate-300">${_clinicInitials(a.patient)}</span>
            <div>
              <p class="font-bold text-slate-100">${a.patient}</p>
              ${a.symptoms ? `<p class="text-[10px] text-slate-500">${a.symptoms}</p>` : ''}
            </div>
          </div>
        </td>
        <td class="px-4 py-3 text-xs text-slate-300 font-semibold">${a.doctorName}</td>
        <td class="px-4 py-3 text-xs font-mono text-slate-400">${a.time || '—'}</td>
        <td class="px-4 py-3"><span class="px-2 py-0.5 rounded text-xs font-semibold ${_clinicStatusStyle(a.status)}">${a.status}</span></td>
        <td class="px-4 py-3 text-right space-x-1 whitespace-nowrap">
          ${a.status !== 'Completed'
            ? `<button onclick="advanceAppointment('${a.id}')" title="Mark ${next}" class="px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"><i class="fa-solid fa-forward"></i> ${next}</button>`
            : '<span class="text-xs text-emerald-400 font-bold"><i class="fa-solid fa-circle-check"></i> Done</span>'}
          <button onclick="deleteAppointment('${a.id}')" class="px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>`;
  }).join('');
}

async function advanceAppointment(id) {
  const apts = await api.getAppointments();
  const apt = apts.find(a => a.id === id);
  if (!apt) return;
  const idx = CLINIC_STATUS_FLOW.indexOf(apt.status);
  const next = CLINIC_STATUS_FLOW[Math.min(idx + 1, CLINIC_STATUS_FLOW.length - 1)];
  await api.updateAppointment(id, { status: next });
  await loadClinicData();
  toast(`Patient marked "${next}"`, 'success');
}

async function deleteAppointment(id) {
  await api.deleteAppointment(id);
  await loadClinicData();
  toast('Appointment removed', 'info');
}

async function deleteDoctor(id) {
  await api.deleteDoctor(id);
  await loadClinicData();
  toast('Doctor removed', 'info');
}

// ---------- Doctor modal ----------
function openAddDoctorModal() {
  const wrap = document.getElementById('doc-days');
  if (wrap) {
    wrap.innerHTML = CLINIC_DAYS.map(d => `
      <label class="cursor-pointer">
        <input type="checkbox" value="${d}" class="peer hidden">
        <span class="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 text-slate-400 border border-white/10 peer-checked:bg-primary/20 peer-checked:text-primary peer-checked:border-primary/40 transition-all inline-block">${d}</span>
      </label>`).join('');
  }
  document.getElementById('add-doctor-modal').classList.remove('hidden');
}
function closeAddDoctorModal() {
  document.getElementById('add-doctor-modal').classList.add('hidden');
}
async function handleDoctorSubmit(e) {
  e.preventDefault();
  const days = Array.from(document.querySelectorAll('#doc-days input:checked')).map(i => i.value);
  const data = {
    name: document.getElementById('doc-name').value,
    specialization: document.getElementById('doc-specialization').value || 'General Physician',
    qualifications: document.getElementById('doc-qualifications').value,
    phone: document.getElementById('doc-phone').value,
    fee: parseFloat(document.getElementById('doc-fee').value || 0),
    room: document.getElementById('doc-room').value,
    hours: document.getElementById('doc-hours').value,
    days
  };
  try {
    await api.addDoctor(data);
    closeAddDoctorModal();
    e.target.reset();
    await loadClinicData();
    toast('Doctor added to clinic', 'success');
  } catch (err) {
    toast('Error adding doctor', 'error');
  }
}

// ---------- Appointment modal ----------
async function populateDoctorSelect() {
  const sel = document.getElementById('apt-doctor');
  if (!sel) return;
  const doctors = await api.getDoctors();
  sel.innerHTML = doctors.length
    ? doctors.map(d => `<option value="${d.id}">${d.name} — ${d.specialization}</option>`).join('')
    : '<option value="">No doctors available</option>';
}

async function openAddAppointmentModal() {
  await populateDoctorSelect();
  document.getElementById('add-appointment-modal').classList.remove('hidden');
}
function closeAddAppointmentModal() {
  document.getElementById('add-appointment-modal').classList.add('hidden');
}
async function bookForDoctor(doctorId) {
  await openAddAppointmentModal();
  const sel = document.getElementById('apt-doctor');
  if (sel) sel.value = doctorId;
}
async function handleAppointmentSubmit(e) {
  e.preventDefault();
  const data = {
    patient: document.getElementById('apt-patient').value,
    doctorId: document.getElementById('apt-doctor').value,
    time: document.getElementById('apt-time').value,
    symptoms: document.getElementById('apt-symptoms').value
  };
  try {
    await api.addAppointment(data);
    closeAddAppointmentModal();
    e.target.reset();
    await loadClinicData();
    toast('Appointment booked', 'success');
  } catch (err) {
    toast('Error booking appointment', 'error');
  }
}
