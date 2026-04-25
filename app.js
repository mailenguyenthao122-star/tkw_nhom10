/* ══════════════════════════════
   app.js — Logic chính
══════════════════════════════ */

/* ── Router ── */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + id);
  if (el) el.classList.add('active');
  window.scrollTo({ top: 0 });

  // Update active nav link
  document.querySelectorAll('.navbar-links a').forEach(a => {
    a.classList.toggle('nav-active', a.dataset.page === id);
  });
}

/* ── Build slot grid ── */
function buildSlots(containerId, takenList) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = ALL_SLOTS.map(t => {
    const taken = takenList.includes(t);
    return `<div class="ts${taken ? ' ts-taken' : ''}"
      ${taken ? '' : `onclick="this.classList.toggle('ts-sel')"`}>${t}</div>`;
  }).join('');
}

function getSlots(containerId) {
  return [...document.querySelectorAll(`#${containerId} .ts-sel`)].map(s => s.textContent.trim());
}

/* ── Build add-ons ── */
function buildAddons(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = ADDONS.map(a => `
    <label class="addon-item" id="${a.id}">
      <input type="checkbox" onchange="this.closest('.addon-item').classList.toggle('addon-sel',this.checked)">
      ${a.emoji} ${a.label}
      <span class="addon-price">${a.priceLabel}</span>
    </label>`).join('');
}

function getAddons(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return [];
  return ADDONS.filter(a => el.querySelector(`#${a.id} input`)?.checked);
}

/* ── Build court cards ── */
function buildCourts() {
  const grid = document.getElementById('courts-grid');
  if (!grid) return;
  grid.innerHTML = Object.entries(COURTS).map(([key, c]) => `
    <div class="court-card" onclick="openDetail('${key}')">
      <div class="court-thumb">
        <div class="court-thumb-ico">🏓</div>
        <span class="ct-status badge-${c.status}">${c.statusLabel}</span>
        <span class="ct-price">từ ${c.price}/h</span>
        <span class="ct-count">🏓 ${c.totalCourts} sân</span>
      </div>
      <div class="court-body">
        <div class="court-name">${c.name}</div>
        <div class="court-addr">📍 ${c.loc}</div>
        <div class="court-stats">
          <span class="cstat">🏓 <strong>${c.totalCourts}</strong> sân</span>
          <span class="cstat-div"></span>
          <span class="cstat">⏰ <strong>${c.hours}</strong></span>
          <span class="cstat-div"></span>
          <span class="cstat">⭐ <strong>${c.rating}</strong> (${c.reviewCount})</span>
        </div>
        <div class="court-tags">${c.tags.map(t => `<span class="court-tag">${t}</span>`).join('')}</div>
        <div class="court-foot">
          <div></div>
          <div class="court-btns">
            <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();openDetail('${key}')">Chi tiết</button>
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();quickBook('${key}')">Đặt sân</button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

/* ── Build services ── */
function buildServices() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;
  const actions = {
    booking: `onclick="showPage('booking')"`,
    hotline: `onclick="toast('Hotline: 1800 6868','ok')"`,
    wip:     `onclick="toast('Tính năng đang phát triển!','ok')"`
  };
  grid.innerHTML = SERVICES.map(s => `
    <div class="svc-card">
      <div class="svc-ico">${s.icon}</div>
      <div class="svc-name">${s.name}</div>
      <div class="svc-desc">${s.desc}</div>
      <div class="svc-price">${s.price}</div>
      <button class="btn-svc" ${actions[s.action]}>Thêm / Đăng ký</button>
    </div>`).join('');
}

/* ── Court count display ── */
function updateCourtsCount() {
  const el = document.getElementById('courts-count');
  if (el) el.textContent = Object.keys(COURTS).length + ' sân';
}
function updateServicesCount() {
  const el = document.getElementById('services-count');
  if (el) el.textContent = SERVICES.length + ' dịch vụ';
}

/* ════════════════════════
   COURT DETAIL
════════════════════════ */
let _curKey = 'pickpark';

function openDetail(key) {
  _curKey = key;
  const c = COURTS[key];

  setText('cd-name',    c.name);
  setText('cd-loc',     '📍 ' + c.loc);
  setText('cd-status',  c.status === 'open' ? '🟢 Còn sân' : '🟠 Gần hết sân');
  setText('cd-price',   '💰 từ ' + c.price + '/h');
  setText('cd-hours',   '⏰ ' + c.hours);
  setText('cd-courts-count', `🏓 ${c.totalCourts} sân`);

  document.getElementById('cd-map').src = c.mapSrc;
  setText('cd-map-cap', c.mapCaption);

  // Rating
  setText('cd-rating-num', c.rating);
  setText('cd-rating-sub', `Dựa trên ${c.reviewCount} đánh giá`);
  document.querySelectorAll('.rbar-fill').forEach((el, i) => {
    el.style.width = (c.ratingBars[i] || 0) + '%';
  });

  // Facilities
  document.getElementById('cd-fac').innerHTML = c.facilities
    .map(f => `<div class="fac-chip">${f}</div>`).join('');

  // Reviews
  document.getElementById('cd-reviews').innerHTML = c.reviews.map(r => `
    <div class="review-card">
      <div class="review-head">
        <span class="review-name">${r.name}</span>
        <span class="review-stars">${r.stars}</span>
      </div>
      <div class="review-text">${r.text}</div>
      <div class="review-date">${r.date}</div>
    </div>`).join('');

  // Sidebar
  setText('cd-sidebar-title', 'Đặt tại ' + c.name.split(' ')[0]);
  buildSlots('cd-slots', c.takenSlots);
  document.getElementById('cd-date').valueAsDate = new Date();

  showPage('court-detail');
}

function bookFromDetail() {
  const c     = COURTS[_curKey];
  const date  = document.getElementById('cd-date').value;
  const num   = document.getElementById('cd-num').value;
  const slots = getSlots('cd-slots');
  if (!slots.length) return toast('Vui lòng chọn ít nhất 1 khung giờ!', 'err');

  _booking = { court: c.name, price: c.price, priceNum: c.priceNum, date, slots, num, addons: [] };
  renderPayment();
  showPage('payment');
}

function quickBook(key) { openDetail(key); }

/* ════════════════════════
   BOOKING FORM
════════════════════════ */
function goToPayment() {
  const name  = document.getElementById('f-name').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  if (!name)  return toast('Vui lòng nhập họ tên!', 'err');
  if (!phone) return toast('Vui lòng nhập số điện thoại!', 'err');

  const sel    = document.getElementById('f-court').value;
  const court  = COURTS[sel];
  const date   = document.getElementById('f-date').value;
  const num    = document.getElementById('f-num').value;
  const slots  = getSlots('main-slots');
  if (!slots.length) return toast('Vui lòng chọn ít nhất 1 khung giờ!', 'err');

  const addons = getAddons('main-addons');

  _booking = { court: court.name, price: court.price, priceNum: court.priceNum, date, slots, num, addons, name, phone };
  renderPayment();
  showPage('payment');
}

/* ════════════════════════
   PAYMENT
════════════════════════ */
let _booking   = {};
let _payMethod = 'direct';

function renderPayment() {
  const d       = _booking;
  const numC    = parseInt(d.num) || 1;
  const hours   = d.slots.length;
  const cTotal  = d.priceNum * hours * numC;
  const aTotal  = (d.addons || []).reduce((s, a) => s + a.price, 0);
  const grand   = cTotal + aTotal;
  const ref     = 'PC' + Math.floor(10000000 + Math.random() * 90000000);

  Object.assign(d, { _cTotal: cTotal, _aTotal: aTotal, _grand: grand, _ref: ref });

  setText('p-court',       d.court);
  setText('p-date',        fmtDate(d.date));
  setText('p-slots',       d.slots.join(', ') + ` (${hours}h)`);
  setText('p-num',         numC + ' sân');
  setText('p-price',       d.price + '/h');
  setText('p-ctotal',      fmtMoney(cTotal));
  setText('p-atotal',      fmtMoney(aTotal));
  setText('p-grand',       fmtMoney(grand));
  setText('p-transfer-amt', fmtMoney(grand));
  setText('p-ref',         ref);

  const addonEl = document.getElementById('p-addons');
  if (addonEl) {
    addonEl.innerHTML = d.addons?.length
      ? d.addons.map(a => `<div class="sum-row"><span class="sk">${a.emoji} ${a.label}</span><span class="sv">+${fmtMoney(a.price)}</span></div>`).join('')
      : `<div style="font-size:.8rem;color:var(--text-muted)">Không có</div>`;
  }
  setPayTab('direct');
}

function setPayTab(t) {
  _payMethod = t;
  document.querySelectorAll('.pay-tab').forEach(el => el.classList.toggle('tab-active', el.dataset.tab === t));
  document.getElementById('pd-direct').style.display   = t === 'direct'   ? 'block' : 'none';
  document.getElementById('pd-transfer').style.display = t === 'transfer' ? 'block' : 'none';
}

function confirmPay() {
  const ok  = Math.random() > 0.15;
  const d   = _booking;
  if (ok) {
    const code = 'PC-' + Math.floor(1000 + Math.random() * 9000);
    setText('s-code',  code);
    setText('s-court', d.court);
    setText('s-date',  fmtDate(d.date));
    setText('s-time',  (d.slots || []).join(', '));
    setText('s-pay',   _payMethod === 'direct' ? '💵 Tại sân' : '🏦 Chuyển khoản');
    setText('s-total', fmtMoney(d._grand || 0));
    showPage('success');
  } else {
    const err = 'ERR-' + Math.floor(1000 + Math.random() * 9000);
    setText('f-errcode', err);
    setText('f-court',   d.court || '—');
    showPage('failure');
  }
}

function copyText(v)    { navigator.clipboard.writeText(v).then(() => toast('Đã sao chép!', 'ok')); }
function copyRef()      { navigator.clipboard.writeText(_booking._ref || '').then(() => toast('Đã sao chép nội dung CK!', 'ok')); }

/* ════════════════════════
   TOAST
════════════════════════ */
let _tt = null;
function toast(msg, type = 'ok') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = `toast t-show ${type === 'ok' ? 't-ok' : 't-err'}`;
  clearTimeout(_tt);
  _tt = setTimeout(() => el.className = 'toast', 3000);
}

/* ════════════════════════
   HELPERS
════════════════════════ */
function setText(id, val) { const e = document.getElementById(id); if (e) e.textContent = val; }
function fmtDate(s) {
  if (!s) return '—';
  return new Date(s + 'T00:00:00').toLocaleDateString('vi-VN', { weekday:'long', day:'2-digit', month:'2-digit', year:'numeric' });
}
function fmtMoney(n) { return Number(n).toLocaleString('vi-VN') + 'đ'; }

/* ════════════════════════
   INIT
════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Default dates
  ['play-date','f-date','cd-date'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.valueAsDate = new Date();
  });

  // Populate court select
  const sel = document.getElementById('f-court');
  if (sel) {
    sel.innerHTML = Object.entries(COURTS).map(([k, c]) =>
      `<option value="${k}">${c.name} — từ ${c.price}/h</option>`).join('');
  }

  // Build all sections
  buildCourts();
  buildServices();
  buildSlots('main-slots', COURTS.pickpark.takenSlots);
  buildAddons('main-addons');
  updateCourtsCount();
  updateServicesCount();

  showPage('courts');  // Trang đầu tiên khi mở app
});