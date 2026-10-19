// =====================================================================
// PIXEL BY MALIYA POS — ROOM MANAGEMENT MODULE
// =====================================================================

let currentRoomNo = null;

function renderRooms() {
  const grid = document.getElementById('rooms-grid');
  if (!grid) return;

  const biz = getBusiness();
  if (!biz.rooms || biz.rooms.length === 0) {
    grid.innerHTML = `<div class="col-span-full text-center text-slate-400 py-10">No rooms configured for this business.</div>`;
    return;
  }

  grid.innerHTML = biz.rooms.map((room, i) => {
    let statusColor, bgGradient, glowColor, icon;
    
    if (room.status === 'AVAILABLE') {
      statusColor = 'text-emerald-400';
      bgGradient = 'from-emerald-900/40 to-slate-900/80';
      glowColor = 'group-hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]';
      icon = 'fa-door-open';
    } else if (room.status === 'OCCUPIED') {
      statusColor = 'text-rose-400';
      bgGradient = 'from-rose-900/40 to-slate-900/80';
      glowColor = 'group-hover:shadow-[0_0_20px_rgba(251,113,133,0.3)]';
      icon = 'fa-door-closed';
    } else {
      statusColor = 'text-amber-400';
      bgGradient = 'from-amber-900/40 to-slate-900/80';
      glowColor = 'group-hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]';
      icon = 'fa-hammer';
    }

    return `
      <button onclick="openRoomModal('${room.no}')" class="group relative overflow-hidden rounded-3xl text-left border border-white/5 bg-gradient-to-br ${bgGradient} backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${glowColor} glass-card p-5" style="animation: fadeUp 0.4s ${i * 0.05}s both">
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg bg-slate-800/80 border border-white/10 ${statusColor}">
            <i class="fa-solid ${icon}"></i>
          </div>
          <span class="text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10 ${statusColor} bg-slate-900/80">${room.status}</span>
        </div>
        
        <h3 class="text-2xl font-black text-white mb-1">Room ${room.no}</h3>
        <p class="text-sm text-slate-400 mb-4 font-semibold">${room.type} <span class="text-xs font-normal opacity-60 ml-2">Rs. ${room.price.toLocaleString()}</span></p>
        
        ${room.status === 'OCCUPIED' ? `
          <div class="pt-3 border-t border-white/10 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 text-xs">
              <i class="fa-solid fa-user"></i>
            </div>
            <div>
              <p class="text-sm font-bold text-slate-200 truncate">${room.guest?.name || 'Guest'}</p>
              <p class="text-[10px] text-slate-500 font-mono">In: ${room.checkin || 'N/A'}</p>
            </div>
          </div>
        ` : `
          <div class="pt-3 border-t border-white/10 flex items-center justify-between text-slate-500">
            <span class="text-xs">Ready for guest</span>
            <i class="fa-solid fa-arrow-right text-xs opacity-0 group-hover:opacity-100 transition-opacity group-hover:-translate-x-1"></i>
          </div>
        `}
      </button>
    `;
  }).join('');
}

function openRoomModal(no) {
  const biz = getBusiness();
  const room = biz.rooms.find(r => r.no === no);
  if (!room) return;
  
  if (room.status === 'MAINTENANCE') {
    alert("This room is currently under maintenance.");
    return;
  }

  currentRoomNo = no;
  document.getElementById('room-modal').classList.remove('hidden');
  document.getElementById('room-modal-no').value = room.no;
  document.getElementById('room-modal-guest').value = '';
  document.getElementById('room-modal-contact').value = '';
  document.getElementById('room-modal-id').value = '';
  document.getElementById('room-modal-adults').value = '1';
  document.getElementById('room-modal-children').value = '0';

  const guestFields = document.getElementById('room-guest-fields');
  const checkoutInfo = document.getElementById('room-checkout-info');
  const btn = document.getElementById('room-modal-btn');
  const title = document.getElementById('room-modal-title');

  if (room.status === 'AVAILABLE') {
    title.innerText = 'Room Check-In';
    guestFields.classList.remove('hidden');
    checkoutInfo.classList.add('hidden');
    btn.innerText = 'Check In Guest';
    btn.className = 'w-full mt-4 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.4)] transition-all';
  } else {
    title.innerText = 'Room Check-Out';
    guestFields.classList.add('hidden');
    checkoutInfo.classList.remove('hidden');
    document.getElementById('room-modal-guest-disp').innerText = room.guest?.name || 'N/A';
    document.getElementById('room-modal-contact-disp').innerText = room.guest?.contact || 'N/A';
    document.getElementById('room-modal-id-disp').innerText = room.guest?.id || 'N/A';
    document.getElementById('room-modal-pax-disp').innerText = `${room.guest?.adults || 1} Adults, ${room.guest?.children || 0} Children`;
    document.getElementById('room-modal-time').innerText = room.checkin || 'N/A';
    btn.innerText = 'Check Out Guest';
    btn.className = 'w-full mt-4 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all';
  }
}

function closeRoomModal() {
  document.getElementById('room-modal').classList.add('hidden');
  currentRoomNo = null;
}

function saveRoomAction() {
  if (!currentRoomNo) return;
  const biz = getBusiness();
  const room = biz.rooms.find(r => r.no === currentRoomNo);
  
  if (room.status === 'AVAILABLE') {
    const guestName = document.getElementById('room-modal-guest').value.trim();
    const contact = document.getElementById('room-modal-contact').value.trim();
    const guestId = document.getElementById('room-modal-id').value.trim();
    const adults = parseInt(document.getElementById('room-modal-adults').value) || 1;
    const children = parseInt(document.getElementById('room-modal-children').value) || 0;
    
    if (!guestName || !guestId) {
      alert("Please enter at least guest name and ID card number.");
      return;
    }
    
    const now = new Date();
    room.status = 'OCCUPIED';
    room.guest = { name: guestName, contact: contact, id: guestId, adults: adults, children: children };
    room.checkin = now.toISOString().slice(0, 16).replace('T', ' ');
  } else if (room.status === 'OCCUPIED') {
    // Generate simple invoice notification
    console.log(`Generated invoice for Room ${room.no} - Guest: ${room.guest.name}`);
    room.status = 'AVAILABLE';
    room.guest = null;
    room.checkin = null;
  }
  
  closeRoomModal();
  renderRooms();
  playBeep(); // from app.js
}

function openAddRoomModal() {
  document.getElementById('add-room-modal').classList.remove('hidden');
  document.getElementById('add-room-no').value = '';
  document.getElementById('add-room-price').value = '';
  document.getElementById('add-room-type').selectedIndex = 0;
}

function closeAddRoomModal() {
  document.getElementById('add-room-modal').classList.add('hidden');
}

function submitNewRoom() {
  const biz = getBusiness();
  const no = document.getElementById('add-room-no').value.trim();
  const type = document.getElementById('add-room-type').value;
  const price = parseFloat(document.getElementById('add-room-price').value);

  if (!no || isNaN(price)) {
    alert("Please enter a valid room number and price.");
    return;
  }

  // Ensure biz.rooms exists
  if (!biz.rooms) biz.rooms = [];

  // Check if room number already exists
  if (biz.rooms.some(r => r.no.toLowerCase() === no.toLowerCase())) {
    alert(`Room ${no} already exists!`);
    return;
  }

  // Add the new room
  biz.rooms.push({
    no: no,
    type: type,
    price: price,
    status: 'AVAILABLE',
    guest: null,
    checkin: null
  });

  closeAddRoomModal();
  renderRooms();
  playBeep(); // from app.js
}
