function showPage(id) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  const page = document.getElementById(`page-${id}`);
  if (page) page.classList.add('active');

  document.querySelectorAll('.navbar-links a').forEach(link => {
    link.classList.toggle('nav-active', link.dataset.page === id);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function buildSlots(containerId, takenList) {
  const element = document.getElementById(containerId);
  if (!element) return;

  element.innerHTML = ALL_SLOTS.map(slot => {
    const taken = takenList.includes(slot);
    return `
      <div class="ts${taken ? ' ts-taken' : ''}" ${taken ? '' : `onclick="this.classList.toggle('ts-sel')"`}>
        ${slot}
      </div>
    `;
  }).join('');
}

function getSlots(containerId) {
  return [...document.querySelectorAll(`#${containerId} .ts-sel`)].map(item => item.textContent.trim());
}

function buildAddons(containerId) {
  const element = document.getElementById(containerId);
  if (!element) return;

  element.innerHTML = ADDONS.map(addon => `
    <label class="addon-item" id="${addon.id}">
      <input type="checkbox" onchange="this.closest('.addon-item').classList.toggle('addon-sel', this.checked)">
      ${addon.emoji} ${addon.label}
      <span class="addon-price">${addon.priceLabel}</span>
    </label>
  `).join('');
}

function getAddons(containerId) {
  const element = document.getElementById(containerId);
  if (!element) return [];
  return ADDONS.filter(addon => element.querySelector(`#${addon.id} input`)?.checked);
}

function buildCourtCard(key, court) {
  return `
    <div class="court-card" onclick="openDetail('${key}')">
      <div class="court-thumb">
        <span class="ct-status badge-${court.status}">${court.statusLabel}</span>
        <span class="ct-price">từ ${court.price}/h</span>
        <span class="ct-count">🏓 ${court.totalCourts} sân</span>
      </div>
      <div class="court-body">
        <div class="court-name">${court.name}</div>
        <div class="court-addr">📍 ${court.loc}</div>
        <div class="court-stats">
          <span class="cstat">🏓 <strong>${court.totalCourts}</strong> sân</span>
          <span class="cstat-div"></span>
          <span class="cstat">⏰ <strong>${court.hours}</strong></span>
          <span class="cstat-div"></span>
          <span class="cstat">⭐ <strong>${court.rating}</strong> (${court.reviewCount})</span>
        </div>
        <div class="court-tags">${court.tags.map(tag => `<span class="court-tag">${tag}</span>`).join('')}</div>
        <div class="court-foot">
          <div></div>
          <div class="court-btns">
            <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openDetail('${key}')">Chi tiết</button>
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); quickBook('${key}')">Đặt sân</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildCourts(list = Object.entries(COURTS)) {
  const grid = document.getElementById('courts-grid');
  const emptyState = document.getElementById('courts-empty');
  if (!grid) return;

  grid.innerHTML = list.map(([key, court]) => buildCourtCard(key, court)).join('');
  if (emptyState) emptyState.hidden = list.length !== 0;

  const countElement = document.getElementById('courts-count');
  if (countElement) countElement.textContent = `${list.length} sân`;
}

function buildFeaturedCourts() {
  const grid = document.getElementById('featured-courts-grid');
  if (!grid) return;

  const featured = Object.entries(COURTS)
    .sort(([, a], [, b]) => Number(b.rating) - Number(a.rating))
    .slice(0, 6);

  grid.innerHTML = featured.map(([key, court]) => buildCourtCard(key, court)).join('');
}

function buildServices() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;

  const actions = {
    booking: `onclick="showPage('booking')"`,
    hotline: `onclick="toast('Hotline: 1800 6868', 'ok')"`,
    wip: `onclick="toast('Tính năng đang được phát triển thêm.', 'ok')"`
  };

  grid.innerHTML = SERVICES.map(service => `
    <div class="svc-card">
      <div class="svc-ico">${service.icon}</div>
      <div class="svc-name">${service.name}</div>
      <div class="svc-desc">${service.desc}</div>
      <div class="svc-price">${service.price}</div>
      <button class="btn-svc" ${actions[service.action]}>Thêm / Đăng ký</button>
    </div>
  `).join('');

  const countElement = document.getElementById('services-count');
  if (countElement) countElement.textContent = `${SERVICES.length} dịch vụ`;
}

function applyFilters() {
  const district = document.getElementById('filter-district')?.value || 'all';
  const maxPrice = document.getElementById('filter-price')?.value || 'all';
  const time = document.getElementById('filter-time')?.value || 'all';

  const filtered = Object.entries(COURTS).filter(([, court]) => {
    const districtMatch = district === 'all' || court.loc.includes(district);
    const priceMatch = maxPrice === 'all' || court.priceNum <= Number(maxPrice);
    const [openRaw, closeRaw] = court.hours.split('–').map(part => part.trim());
    const openHour = Number(openRaw.split(':')[0]);
    const closeHour = Number(closeRaw.split(':')[0]);
    const timeMatch =
      time === 'all' ||
      (time === 'morning' && openHour <= 6) ||
      (time === 'afternoon' && openHour <= 13 && closeHour >= 17) ||
      (time === 'evening' && closeHour >= 22);

    return districtMatch && priceMatch && timeMatch;
  });

  buildCourts(filtered);
}

let currentCourtKey = 'pickpark';
let bookingState = {};
let payMethod = 'direct';

function openDetail(key) {
  currentCourtKey = key;
  const court = COURTS[key];

  setText('cd-name', court.name);
  setText('cd-loc', `📍 ${court.loc}`);
  setText('cd-status', court.status === 'open' ? '🟢 Còn sân' : '🟠 Gần hết sân');
  setText('cd-price', `💰 từ ${court.price}/h`);
  setText('cd-hours', `⏰ ${court.hours}`);
  setText('cd-courts-count', `🏓 ${court.totalCourts} sân`);
  setText('cd-map-cap', court.mapCaption);
  setText('cd-rating-num', court.rating);
  setText('cd-rating-sub', `Dựa trên ${court.reviewCount} đánh giá`);
  setText('cd-sidebar-title', `Đặt tại ${court.name}`);

  const map = document.getElementById('cd-map');
  if (map) map.src = court.mapSrc;

  document.querySelectorAll('.rbar-fill').forEach((item, index) => {
    item.style.width = `${court.ratingBars[index] || 0}%`;
  });

  ['rb5', 'rb4', 'rb3', 'rb2', 'rb1'].forEach((id, index) => {
    setText(id, `${court.ratingBars[index] || 0}%`);
  });

  const facilities = document.getElementById('cd-fac');
  if (facilities) {
    facilities.innerHTML = court.facilities.map(item => `<div class="fac-chip">${item}</div>`).join('');
  }

  const reviews = document.getElementById('cd-reviews');
  if (reviews) {
    reviews.innerHTML = court.reviews.map(review => `
      <div class="review-card">
        <div class="review-head">
          <span class="review-name">${review.name}</span>
          <span class="review-stars">${review.stars}</span>
        </div>
        <div class="review-text">${review.text}</div>
        <div class="review-date">${review.date}</div>
      </div>
    `).join('');
  }

  buildSlots('cd-slots', court.takenSlots);
  const dateInput = document.getElementById('cd-date');
  if (dateInput) dateInput.valueAsDate = new Date();

  showPage('court-detail');
}

function quickBook(key) {
  openDetail(key);
}

function bookFromDetail() {
  const court = COURTS[currentCourtKey];
  const date = document.getElementById('cd-date')?.value;
  const num = document.getElementById('cd-num')?.value || '1';
  const slots = getSlots('cd-slots');

  if (!date) return toast('Vui lòng chọn ngày chơi.', 'err');
  if (!slots.length) return toast('Vui lòng chọn ít nhất 1 khung giờ.', 'err');

  bookingState = {
    court: court.name,
    price: court.price,
    priceNum: court.priceNum,
    date,
    slots,
    num,
    addons: []
  };

  renderPayment();
  showPage('payment');
}

function goToPayment() {
  const name = document.getElementById('f-name')?.value.trim();
  const phone = document.getElementById('f-phone')?.value.trim();
  const courtSelect = document.getElementById('f-court');
  const selectedCourt = courtSelect?.value;
  const date = document.getElementById('f-date')?.value;
  const num = document.getElementById('f-num')?.value || '1';
  const slots = getSlots('main-slots');

  if (!name) return toast('Vui lòng nhập họ và tên.', 'err');
  if (!phone) return toast('Vui lòng nhập số điện thoại.', 'err');
  if (!selectedCourt || !COURTS[selectedCourt]) return toast('Vui lòng chọn sân hợp lệ.', 'err');
  if (!date) return toast('Vui lòng chọn ngày chơi.', 'err');
  if (!slots.length) return toast('Vui lòng chọn ít nhất 1 khung giờ.', 'err');

  const court = COURTS[selectedCourt];
  bookingState = {
    court: court.name,
    price: court.price,
    priceNum: court.priceNum,
    date,
    slots,
    num,
    addons: getAddons('main-addons'),
    name,
    phone
  };

  renderPayment();
  showPage('payment');
}

function renderPayment() {
  const data = bookingState;
  const numCourts = Number(data.num) || 1;
  const totalHours = data.slots.length;
  const courtTotal = data.priceNum * totalHours * numCourts;
  const addonTotal = (data.addons || []).reduce((sum, addon) => sum + addon.price, 0);
  const grandTotal = courtTotal + addonTotal;
  const refCode = `PC${Math.floor(10000000 + Math.random() * 90000000)}`;

  Object.assign(data, { courtTotal, addonTotal, grandTotal, refCode });

  setText('p-court', data.court);
  setText('p-date', fmtDate(data.date));
  setText('p-slots', `${data.slots.join(', ')} (${totalHours}h)`);
  setText('p-num', `${numCourts} sân`);
  setText('p-price', `${data.price}/h`);
  setText('p-ctotal', fmtMoney(courtTotal));
  setText('p-atotal', fmtMoney(addonTotal));
  setText('p-grand', fmtMoney(grandTotal));
  setText('p-transfer-amt', fmtMoney(grandTotal));
  setText('p-ref', refCode);

  const addonElement = document.getElementById('p-addons');
  if (addonElement) {
    addonElement.innerHTML = data.addons?.length
      ? data.addons.map(addon => `
          <div class="sum-row">
            <span class="sk">${addon.emoji} ${addon.label}</span>
            <span class="sv">+${fmtMoney(addon.price)}</span>
          </div>
        `).join('')
      : '<div style="font-size:.8rem;color:var(--text-muted)">Không có</div>';
  }

  setPayTab('direct');
}

function setPayTab(tab) {
  payMethod = tab;
  document.querySelectorAll('.pay-tab').forEach(button => {
    button.classList.toggle('tab-active', button.dataset.tab === tab);
  });

  const direct = document.getElementById('pd-direct');
  const transfer = document.getElementById('pd-transfer');
  if (direct) direct.style.display = tab === 'direct' ? 'block' : 'none';
  if (transfer) transfer.style.display = tab === 'transfer' ? 'block' : 'none';
}

function confirmPay() {
  const success = Math.random() > 0.15;
  if (success) {
    const code = `PC-${Math.floor(1000 + Math.random() * 9000)}`;
    setText('s-code', code);
    setText('s-court', bookingState.court);
    setText('s-date', fmtDate(bookingState.date));
    setText('s-time', (bookingState.slots || []).join(', '));
    setText('s-pay', payMethod === 'direct' ? '💵 Tại sân' : '🏦 Chuyển khoản');
    setText('s-total', fmtMoney(bookingState.grandTotal || 0));
    showPage('success');
  } else {
    const errorCode = `ERR-${Math.floor(1000 + Math.random() * 9000)}`;
    setText('f-errcode', errorCode);
    setText('failure-court', bookingState.court || '-');
    showPage('failure');
  }
}

function copyText(value) {
  navigator.clipboard.writeText(value).then(() => toast('Đã sao chép.', 'ok'));
}

function copyRef() {
  navigator.clipboard.writeText(bookingState.refCode || '').then(() => toast('Đã sao chép nội dung chuyển khoản.', 'ok'));
}

function copySuccessCode() {
  const code = document.getElementById('s-code')?.textContent || '';
  if (!code) return;
  navigator.clipboard.writeText(code).then(() => toast('Đã sao chép mã xác nhận.', 'ok'));
}

function submitAuth(event, mode) {
  event.preventDefault();

  if (mode === 'login') {
    const account = document.getElementById('login-account')?.value.trim();
    const password = document.getElementById('login-password')?.value.trim();
    if (!account || !password) return toast('Vui lòng nhập đủ thông tin đăng nhập.', 'err');
    toast('Đăng nhập thành công ở chế độ mô phỏng.', 'ok');
    showPage('home');
    return;
  }

  const name = document.getElementById('register-name')?.value.trim();
  const account = document.getElementById('register-account')?.value.trim();
  const password = document.getElementById('register-password')?.value;
  const confirm = document.getElementById('register-confirm')?.value;

  if (!name || !account || !password || !confirm) return toast('Vui lòng nhập đủ thông tin đăng ký.', 'err');
  if (password !== confirm) return toast('Mật khẩu xác nhận chưa khớp.', 'err');

  toast('Tạo tài khoản thành công ở chế độ mô phỏng.', 'ok');
  showPage('login');
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function fmtDate(dateString) {
  if (!dateString) return '-';
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function fmtMoney(amount) {
  return `${Number(amount).toLocaleString('vi-VN')}đ`;
}

let toastTimer = null;
function toast(message, type = 'ok') {
  const element = document.getElementById('toast');
  if (!element) return;

  element.textContent = message;
  element.className = `toast t-show ${type === 'ok' ? 't-ok' : 't-err'}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    element.className = 'toast';
  }, 3000);
}

function applyQueryState() {
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page');

  if (page && document.getElementById(`page-${page}`)) {
    showPage(page);
    return;
  }

  showPage('home');
}

document.addEventListener('DOMContentLoaded', () => {
  ['play-date', 'f-date', 'cd-date'].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.valueAsDate = new Date();
  });

  const courtSelect = document.getElementById('f-court');
  if (courtSelect) {
    courtSelect.innerHTML = '';
    Object.entries(COURTS).forEach(([key, court]) => {
      courtSelect.add(new Option(`${court.name} - từ ${court.price}/h`, key));
    });
    courtSelect.value = Object.keys(COURTS)[0];
    courtSelect.addEventListener('change', event => {
      const selectedKey = event.target.value;
      buildSlots('main-slots', COURTS[selectedKey].takenSlots);
    });
  }

  buildCourts();
  buildFeaturedCourts();
  buildServices();
  buildSlots('main-slots', COURTS.pickpark.takenSlots);
  buildAddons('main-addons');
  setText('heroCourtCount', `${Object.keys(COURTS).length}+`);
  applyQueryState();
});
