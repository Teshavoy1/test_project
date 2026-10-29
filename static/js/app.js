// ==========================================
// TOP IJARA - Asosiy Mijoz Ilovasi (Client App)
// ==========================================

let currentCategory = 'all';
let currentSort = 'popular';
let searchQuery = '';
let selectedCity = 'all';
let maxPriceFilter = 5000000;
let currency = 'UZS'; // UZS or USD
const USD_RATE = 12800;

document.addEventListener('DOMContentLoaded', async () => {
  await DB.fetchCategories();
  await DB.fetchItems();
  await DB.fetchBookings();
  initApp();
});

async function initApp() {
  await updateAuthUI();
  renderCategories();
  await renderItems(1);
  updateFavoritesCount();
  setupEventListeners();
  setupDateInputs();
}

let currentUser = null;

async function updateAuthUI() {
  const authStatus = await DB.checkAuth();
  currentUser = authStatus.authenticated ? authStatus.user : null;
  const guestActions = document.getElementById('guestActions');
  const userActions = document.getElementById('userActions');
  if (guestActions && userActions) {
    if (currentUser) {
      guestActions.style.display = 'none';
      userActions.style.display = 'flex';
    } else {
      guestActions.style.display = 'flex';
      userActions.style.display = 'none';
    }
  }
}

function openAuthModal(mode) {
  document.getElementById('authMode').value = mode;
  document.getElementById('authModalTitle').innerText = mode === 'login' ? 'Kirish' : 'Ro\'yxatdan o\'tish';
  document.getElementById('authSubmitBtn').innerText = mode === 'login' ? 'Kirish' : 'Ro\'yxatdan o\'tish';
  document.getElementById('authToggleLink').innerText = mode === 'login' ? 'Ro\'yxatdan o\'tish' : 'Kirish';
  openModal('authModal');
}

function toggleAuthMode() {
  const mode = document.getElementById('authMode').value;
  openAuthModal(mode === 'login' ? 'register' : 'login');
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const mode = document.getElementById('authMode').value;
  const user = document.getElementById('authUsername').value;
  const pass = document.getElementById('authPassword').value;

  let res;
  if (mode === 'login') {
    res = await DB.login(user, pass);
  } else {
    res = await DB.register(user, pass);
  }

  const data = await res.json();
  if (res.ok) {
    showToast(mode === 'login' ? 'Tizimga muvaffaqiyatli kirdingiz!' : 'Ro\'yxatdan o\'tdingiz!', 'success');
    closeModal('authModal');
    await updateAuthUI();
  } else {
    showToast(data.error || 'Xatolik yuz berdi', 'error');
  }
}

async function authLogout() {
  await DB.logout();
  await updateAuthUI();
  showToast('Tizimdan chiqdingiz', 'info');
}

async function showMyAds() {
  currentCategory = 'all';
  searchQuery = '';
  selectedCity = 'all';
  const grid = document.getElementById('itemsGrid');
  const badge = document.getElementById('resultsCountBadge');

  const myItems = await DB.fetchMyItems();

  if (badge) badge.innerText = `Mening e'lonlarim: ${myItems.length} ta`;

  if (myItems.length === 0) {
    grid.innerHTML = `<div class="empty-state">Hali e'lonlaringiz yo'q</div>`;
    return;
  }

  grid.innerHTML = myItems.map(item => generateItemCard(item)).join('');
}

function generateItemCard(item) {
  const favorites = DB.getFavorites();
  const isFav = favorites.includes(item.id);
  const specsPreview = Object.entries(item.specs || {}).slice(0, 3).map(([key, val]) => `
    <span class="spec-pill">${key}: <strong>${val}</strong></span>
  `).join('');

  return `
    <a class="rental-card" data-id="${item.id}" href="/item/${item.id}/" style="cursor:pointer; text-decoration:none; color:inherit; display:block;">
      <div class="card-media">
        <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80'">
        <div class="card-badges">
          ${item.isTop ? '<span class="badge badge-top">PREMIUM</span>' : ''}
          <span class="badge badge-category">${item.categoryName}</span>
        </div>
        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="event.preventDefault(); event.stopPropagation(); toggleFavorite('${item.id}', event)" title="Saqlab qo'yish">
          <svg width="16" height="16" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
        </button>
      </div>
      <div class="card-content">
        <div class="card-meta-top">
          <span class="location-tag">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${item.city}, ${item.district || ''}
          </span>
          <span class="rating-tag">★ ${item.rating || 5.0} <span style="color: var(--text-dim); font-size: 0.74rem;">(${item.reviewsCount || 10})</span></span>
        </div>
        <h3 class="card-title">${item.title}</h3>
        <div class="card-specs-preview">${specsPreview}</div>
        <div class="card-footer">
          <div class="price-block">
            <span class="price-val">${formatPrice(item.pricePerDay)}</span>
            <span class="price-period">1 sutka uchun</span>
          </div>
          <div class="card-actions">
            <span class="btn btn-secondary btn-sm">Tafsilotlar</span>
            <button class="btn btn-primary btn-sm" onclick="event.preventDefault(); event.stopPropagation(); openBookingModal('${item.id}')">Band qilish</button>
          </div>
        </div>
      </div>
    </a>
  `;
}


// Format Price
function formatPrice(amountInUZS) {
  if (currency === 'USD') {
    const usd = Math.round(amountInUZS / USD_RATE);
    return `$${usd.toLocaleString()}`;
  }
  return `${amountInUZS.toLocaleString()} so'm`;
}

// Setup Event Listeners
function setupEventListeners() {
// Theme Toggle
const themeBtn = document.getElementById('themeToggleBtn');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeBtn.innerHTML = newTheme === 'light'
      ? '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
      : '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  });
}

// Currency Toggle
const currencyBtn = document.getElementById('currencyToggleBtn');
if (currencyBtn) {
  currencyBtn.addEventListener('click', () => {
    currency = currency === 'UZS' ? 'USD' : 'UZS';
    currencyBtn.innerText = currency;
    renderItems();
    showToast(`Valyuta ${currency} ga o'zgartirildi`, 'info');
  });
}

// Secret Admin Access from Footer
const secretAdminBtn = document.getElementById('secretAdminFooterBtn');
if (secretAdminBtn) {
  secretAdminBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (DB.isAdminLoggedIn()) {
      toggleAdminView(true);
    } else {
      openAdminLoginModal();
    }
  });
}

// Secret Hotkey Shortcut: Ctrl + Shift + A  yoki  Alt + A
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 'A' || e.key === 'a'))) {
    e.preventDefault();
    if (DB.isAdminLoggedIn()) {
      toggleAdminView(true);
    } else {
      openAdminLoginModal();
    }
  }
});

// URL Hash check: agar manzil satrida #admin bo'lsa
if (window.location.hash === '#admin') {
  if (DB.isAdminLoggedIn()) {
    toggleAdminView(true);
  } else {
    setTimeout(() => openAdminLoginModal(), 400);
  }
}

// Exit Admin
const exitAdminBtn = document.getElementById('exitAdminBtn');
if (exitAdminBtn) {
  exitAdminBtn.addEventListener('click', () => {
    toggleAdminView(false);
  });
}

// Search input & city select
const searchInput = document.getElementById('mainSearchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderItems();
  });
}

const citySelect = document.getElementById('mainCitySelect');
if (citySelect) {
  citySelect.addEventListener('change', (e) => {
    selectedCity = e.target.value;
    renderItems();
  });
}

const sortSelect = document.getElementById('sortSelect');
if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderItems();
  });
}

// Reset Filters Btn
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
if (resetFiltersBtn) {
  resetFiltersBtn.addEventListener('click', () => {
    currentCategory = 'all';
    searchQuery = '';
    selectedCity = 'all';
    if (searchInput) searchInput.value = '';
    if (citySelect) citySelect.value = 'all';
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === 'all');
    });
    renderItems();
    showToast('Barcha filterlar tozalandi', 'info');
  });
}

document.getElementById('filterPriceMin')?.addEventListener('change', () => renderItems(1));
document.getElementById('filterPriceMax')?.addEventListener('change', () => renderItems(1));
document.getElementById('filterRooms')?.addEventListener('change', () => renderItems(1));

  // Favorites trigger
  const favNavBtn = document.getElementById('favNavBtn');
  if (favNavBtn) {
    favNavBtn.addEventListener('click', () => {
      showFavoritesModal();
    });
  }

  // New Ad Button
  const postAdBtn = document.getElementById('postAdBtn');
  if (postAdBtn) {
    postAdBtn.addEventListener('click', () => {
      openAddListingModal();
    });
  }
}

// Toggle Admin View with Strict Auth Check
function toggleAdminView(showAdmin) {
  const clientView = document.getElementById('clientViewContainer');
  const adminView = document.getElementById('adminPanelContainer');
  const heroSection = document.getElementById('heroSection');

  if (showAdmin) {
    if (!DB.isAdminLoggedIn()) {
      openAdminLoginModal();
      return;
    }
    clientView.style.display = 'none';
    if (heroSection) heroSection.style.display = 'none';
    adminView.classList.add('active');
    window.AdminApp.init();
    showToast('Admin boshqaruv paneliga xush kelibsiz', 'info');
  } else {
    clientView.style.display = 'block';
    if (heroSection) heroSection.style.display = 'block';
    adminView.classList.remove('active');
    renderItems();
  }
}

// Admin Logout
function adminLogout() {
  if (confirm("Admin tizimidan chiqishni tasdiqlaysizmi?")) {
    DB.setAdminLoggedIn(false);
    toggleAdminView(false);
    showToast("Admin tizimidan muvaffaqiyatli chiqildi 🔒", "info");
  }
}

// Open Admin Login Modal
function openAdminLoginModal() {
  const modal = document.getElementById('genericModal');
  const modalTitle = document.getElementById('genericModalTitle');
  const modalBody = document.getElementById('genericModalBody');

  modalTitle.innerHTML = `<span>🔐 Xavfsiz Boshqaruv Kirishi</span>`;

  const creds = DB.getAdminCreds();

  modalBody.innerHTML = `
    <div style="max-width: 440px; margin: 0 auto; padding: 10px 0 20px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 58px; height: 58px; margin: 0 auto 12px; background: rgba(99, 102, 241, 0.15); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; color: var(--secondary);">
          <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h4 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 6px;">Administrator Kirishi</h4>
        <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
          Ushbu bo'lim faqat platforma egasi va ma'murlar uchun. Kirish uchun maxfiy login va parolingizni kiriting.
        </p>
      </div>

      <form id="adminLoginForm" onsubmit="handleAdminLoginSubmit(event)" autocomplete="off">
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div class="form-group">
            <label for="adminLoginInput">Admin Login</label>
            <input type="text" id="adminLoginInput" class="form-control" placeholder="Loginni kiriting" required autocomplete="off" value="" autofocus>
          </div>

          <div class="form-group">
            <label for="adminPasswordInput">Maxfiy Parol</label>
            <div style="position: relative; display: flex; align-items: center;">
              <input type="password" id="adminPasswordInput" class="form-control" placeholder="Parolni kiriting" required autocomplete="new-password" value="" style="padding-right: 44px; width: 100%;">
              <button type="button" onclick="togglePasswordVisibility('adminPasswordInput', this)" style="position: absolute; right: 10px; background: transparent; border: none; font-size: 1.1rem; cursor: pointer; padding: 4px;" title="Parolni ko'rish/yashirish">
                👁️
              </button>
            </div>
          </div>

          <div id="adminLoginError" style="display: none; padding: 12px; border-radius: var(--radius-md); background: rgba(244, 63, 94, 0.15); border: 1px solid rgba(244, 63, 94, 0.35); color: #f43f5e; font-size: 0.88rem; text-align: center; font-weight: 600;">
            ⚠️ Login yoki parol noto'g'ri! Iltimos, qaytadan tekshiring.
          </div>

          <div style="display: flex; gap: 12px; margin-top: 10px;">
            <button type="button" class="btn btn-secondary" style="flex: 1;" onclick="closeGenericModal()">Bekor qilish</button>
            <button type="submit" class="btn btn-primary" style="flex: 1.4;">
              <span>Kirish 🔓</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  `;

  openModal('genericModal');
  setTimeout(() => {
    const loginInp = document.getElementById('adminLoginInput');
    const passInp = document.getElementById('adminPasswordInput');
    if (loginInp) {
      loginInp.value = '';
      loginInp.focus();
    }
    if (passInp) {
      passInp.value = '';
    }
  }, 100);
}

function handleAdminLoginSubmit(e) {
  e.preventDefault();
  const loginInp = document.getElementById('adminLoginInput');
  const passInp = document.getElementById('adminPasswordInput');
  const login = loginInp ? loginInp.value.trim() : '';
  const pass = passInp ? passInp.value.trim() : '';
  const creds = DB.getAdminCreds();

  if (login === creds.login && pass === creds.password) {
    if (loginInp) loginInp.value = '';
    if (passInp) passInp.value = '';
    DB.setAdminLoggedIn(true);
    closeGenericModal();
    toggleAdminView(true);
    showToast("Xush kelibsiz, Administrator! ⚡", "success");
  } else {
    if (passInp) {
      passInp.value = '';
      passInp.focus();
    }
    const errorBox = document.getElementById('adminLoginError');
    if (errorBox) {
      errorBox.style.display = 'block';
    }
    showToast("Login yoki parol xato kiritildi!", "error");
  }
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerText = '🙈';
  } else {
    input.type = 'password';
    btn.innerText = '👁️';
  }
}

// Render Categories
function renderCategories() {
  const container = document.getElementById('categoriesBar');
  if (!container) return;

  const items = DB.getItems();

  const counts = {
    all: items.length,
    auto: items.filter(i => i.category === 'auto').length,
    realty: items.filter(i => i.category === 'realty').length,
    tech: items.filter(i => i.category === 'tech').length
  };

  const icons = {
    all: `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
    auto: `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h8l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17a2 2 0 1 0 4 0M15 17a2 2 0 1 0 4 0"></path></svg>`,
    realty: `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    tech: `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`
  };

  const names = {
    all: 'Barcha Takliflar',
    auto: 'Avtomobillar Parki',
    realty: "Mulk va Rezidensiyalar",
    tech: 'Professional Texnika'
  };

  container.innerHTML = ['all', 'auto', 'realty', 'tech'].map(catKey => `
    <button class="category-btn ${currentCategory === catKey ? 'active' : ''}" data-cat="${catKey}" onclick="filterByCategory('${catKey}')">
      ${icons[catKey]}
      <span>${names[catKey]}</span>
      <span class="cat-count">${counts[catKey] || 0}</span>
    </button>
  `).join('');
}

// Filter By Category
function filterByCategory(category) {
  currentCategory = category;
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === category);
  });
  renderItems();
}

// Render Items Grid
async function renderItems(page = 1) {
  const grid = document.getElementById('itemsGrid');
  const countBadge = document.getElementById('resultsCountBadge');
  const pagination = document.getElementById('paginationContainer');
  if (!grid) return;

  const filters = {
    category: currentCategory,
    city: selectedCity,
    search: searchQuery,
    sort: currentSort,
    priceMin: document.getElementById('filterPriceMin')?.value || '',
    priceMax: document.getElementById('filterPriceMax')?.value || '',
    rooms: document.getElementById('filterRooms')?.value || '',
    page: page,
    limit: 12
  };

  const data = await DB.fetchItems(filters);
  const items = data.items;

  if (countBadge) {
    countBadge.innerText = `Jami ${data.total_items} ta sertifikatlangan taklif`;
  }

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="color: var(--text-dim); margin-bottom: 12px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <h4 style="font-size: 1.1rem; margin-bottom: 6px;">Mos takliflar topilmadi</h4>
        <p style="color: var(--text-muted); font-size: 0.88rem;">Qidiruv mezonlarini o'zgartiring yoki filtrlarni dastlabki holatga qaytaring.</p>
        <button class="btn btn-secondary btn-sm" style="margin-top: 14px;" onclick="resetFilters()">Filtrlarni tozalash</button>
      </div>
    `;
    if (pagination) pagination.innerHTML = '';
    return;
  }

  grid.innerHTML = items.map(item => generateItemCard(item)).join('');


  if (pagination) {
    let pagesHtml = '';
    for (let i = 1; i <= data.total_pages; i++) {
      pagesHtml += `<button class="btn ${i === data.current_page ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="renderItems(${i})">${i}</button>`;
    }
    pagination.innerHTML = pagesHtml;
  }
}

// Reset Filters Function
function resetFilters() {
  currentCategory = 'all';
  searchQuery = '';
  selectedCity = 'all';
  const searchInput = document.getElementById('mainSearchInput');
  const citySelect = document.getElementById('mainCitySelect');
  const pMin = document.getElementById('filterPriceMin');
  const pMax = document.getElementById('filterPriceMax');
  const pRooms = document.getElementById('filterRooms');

  if (searchInput) searchInput.value = '';
  if (citySelect) citySelect.value = 'all';
  if (pMin) pMin.value = '';
  if (pMax) pMax.value = '';
  if (pRooms) pRooms.value = '';

  renderCategories();
  renderItems(1);
}

// Favorite Toggle
function toggleFavorite(itemId, event) {
  if (event) event.stopPropagation();
  let favs = DB.getFavorites();
  if (favs.includes(itemId)) {
    favs = favs.filter(id => id !== itemId);
    showToast("Sevimlilardan o'chirildi", 'info');
  } else {
    favs.push(itemId);
    showToast("Sevimlilarga qo'shildi ❤️", 'success');
  }
  DB.saveFavorites(favs);
  updateFavoritesCount();
  renderItems();
}

function updateFavoritesCount() {
  const badge = document.getElementById('favCountBadge');
  if (badge) {
    const favs = DB.getFavorites();
    badge.innerText = favs.length;
    badge.style.display = favs.length > 0 ? 'flex' : 'none';
  }
}

// Favorites Modal
function showFavoritesModal() {
  const favs = DB.getFavorites();
  const allItems = DB.getItems();
  const favItems = allItems.filter(i => favs.includes(i.id));

  const modal = document.getElementById('genericModal');
  const modalTitle = document.getElementById('genericModalTitle');
  const modalBody = document.getElementById('genericModalBody');

  modalTitle.innerText = `Sevimlilar (${favItems.length} ta)`;

  if (favItems.length === 0) {
    modalBody.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <p style="font-size: 2.5rem; margin-bottom: 10px;">🤍</p>
        <h4>Siz hali hech narsa saqlamadingiz</h4>
        <p style="color: var(--text-muted); margin-top: 8px;">O'zingizga yoqqan ijaralarni yurakcha orqali saqlab qo'yishingiz mumkin.</p>
      </div>
    `;
  } else {
    modalBody.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${favItems.map(item => `
          <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-card); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); gap: 12px;">
            <img src="${item.image}" style="width: 70px; height: 50px; border-radius: var(--radius-sm); object-fit: cover;">
            <div style="flex: 1;">
              <h5 style="font-size: 0.95rem; margin-bottom: 4px;">${item.title}</h5>
              <span style="color: var(--primary); font-weight: 700; font-size: 0.9rem;">${formatPrice(item.pricePerDay)} / kun</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-primary btn-sm" onclick="closeGenericModal(); openBookingModal('${item.id}');">Band qilish</button>
              <button class="btn btn-secondary btn-sm" onclick="toggleFavorite('${item.id}'); showFavoritesModal();">O'chirish</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  openModal('genericModal');
}

// Detail / Quick View Modal
function openDetailModal(itemId) {
  const items = DB.getItems();
  const item = items.find(i => i.id === itemId);
  if (!item) return;

  const modal = document.getElementById('genericModal');
  const modalTitle = document.getElementById('genericModalTitle');
  const modalBody = document.getElementById('genericModalBody');

  modalTitle.innerText = item.title;

  const images = item.images && item.images.length > 0 ? item.images : [item.image];
  const thumbsHtml = images.map((img, idx) => `
    <img src="${img}" class="thumb-img ${idx === 0 ? 'active' : ''}" onclick="changeDetailImage('${img}', this)">
  `).join('');

  const specsRows = Object.entries(item.specs || {}).map(([key, val]) => `
    <tr>
      <td>${key}</td>
      <td>${val}</td>
    </tr>
  `).join('');

  modalBody.innerHTML = `
    <div class="detail-grid">
      <div>
        <img id="detailMainImg" class="detail-img-main" src="${images[0]}" alt="${item.title}">
        <div class="detail-thumbs">
          ${thumbsHtml}
        </div>

        <div style="margin-top: 20px;">
          <h4 style="font-size: 1.05rem; margin-bottom: 8px;">Tavsif</h4>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6;">${item.description}</p>
        </div>
      </div>

      <div>
        <div style="background: var(--bg-card); padding: 20px; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
            <span style="font-size: 1.8rem; font-weight: 800; color: var(--primary);">${formatPrice(item.pricePerDay)}</span>
            <span style="color: var(--text-muted); font-size: 0.85rem;">/ 1 kun uchun</span>
          </div>

          <p style="font-size: 0.88rem; color: var(--text-dim); margin-bottom: 16px;">
            Depozit garovi: <strong>${formatPrice(item.deposit || 0)}</strong> (ijara yakunida qaytariladi)
          </p>

          <table class="detail-specs-table">
            <tbody>
              <tr>
                <td>Kategoriya:</td>
                <td><strong>${item.categoryName}</strong></td>
              </tr>
              <tr>
                <td>Manzil:</td>
                <td><strong>${item.city}, ${item.district || ''}</strong></td>
              </tr>
              ${specsRows}
            </tbody>
          </table>

          <div style="margin: 20px 0; padding: 14px; background: rgba(255, 255, 255, 0.03); border-radius: var(--radius-md);">
            <div style="font-size: 0.82rem; color: var(--text-dim); margin-bottom: 4px;">E'lon egasi:</div>
            <div style="font-weight: 700; font-size: 1rem; color: var(--text-main);">${item.ownerName || 'Ishonchli Hamkor'}</div>
            <a href="tel:${item.ownerPhone}" style="color: var(--primary); text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; margin-top: 6px;">
              📞 ${item.ownerPhone || '+998 (90) 000-00-00'}
            </a>
          </div>

          <button class="btn btn-primary" style="width: 100%; padding: 14px;" onclick="closeGenericModal(); openBookingModal('${item.id}');">
            📅 Ushbu ijarani rasmiylashtirish
          </button>
        </div>
      </div>
    </div>
  `;

  openModal('genericModal');
}

function changeDetailImage(src, thumbEl) {
  const mainImg = document.getElementById('detailMainImg');
  if (mainImg) mainImg.src = src;
  document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
  if (thumbEl) thumbEl.classList.add('active');
}

// Booking Modal & Price Calculator
let activeBookingItemId = null;
let _dateInputsInitialized = false;

function setupDateInputs() {
  const today = new Date().toISOString().split('T')[0];
  const startInput = document.getElementById('bookStartDate');
  const endInput = document.getElementById('bookEndDate');

  if (startInput && endInput) {
    startInput.min = today;
    startInput.value = today;

    // Tomorrow by default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    endInput.min = today;
    endInput.value = tomorrow.toISOString().split('T')[0];

    // Listener'larni faqat bir marta qo'shish (duplicate oldini olish)
    if (!_dateInputsInitialized) {
      startInput.addEventListener('change', calculateBookingPrice);
      endInput.addEventListener('change', calculateBookingPrice);
      _dateInputsInitialized = true;
    }
  }
}

async function openBookingModal(itemId) {
  const items = DB.getItems();
  const item = items.find(i => i.id === itemId);
  if (!item) return;

  activeBookingItemId = itemId;

  document.getElementById('bookingItemTitle').innerText = item.title;
  document.getElementById('bookingItemPriceTag').innerText = `${formatPrice(item.pricePerDay)} / kun`;
  document.getElementById('bookingItemImg').src = item.image;

  const promoInput = document.getElementById('bookPromoCode');
  if (promoInput) promoInput.value = '';
  const promoFeedback = document.getElementById('promoFeedbackIndex');
  if (promoFeedback) promoFeedback.innerHTML = '';
  window.indexActivePromoPct = 0;
  window.indexActivePromoCode = '';

  // Submit tugmasini har doim faol holatga qaytarish
  const submitBtn = document.getElementById('bookSubmitBtn');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.style.cursor = 'pointer';
    submitBtn.innerHTML = '<span>Buyurtmani Tasdiqlash</span>';
  }

  setupDateInputs();
  calculateBookingPrice();

  // Band sanalarni yuklash (conflict tekshiruvi uchun)
  await loadIndexBookedRanges(itemId);

  openModal('bookingModal');
}

async function applyPromoCodeIndex() {
  const codeInput = document.getElementById('bookPromoCode');
  const msgEl = document.getElementById('promoFeedbackIndex');
  if (!codeInput || !msgEl) return;
  const code = codeInput.value.trim();
  if (!code) {
    msgEl.innerHTML = '<span style="color:#f43f5e; font-size:0.8rem;">Iltimos, promokodni kiriting!</span>';
    return;
  }
  msgEl.innerHTML = '<span style="color:var(--text-muted); font-size:0.8rem;">Tekshirilmoqda...</span>';
  const res = await DB.validatePromo(code);
  if (res.valid) {
    window.indexActivePromoPct = res.percent;
    window.indexActivePromoCode = code.toUpperCase();
    msgEl.innerHTML = `<span class="promo-badge-active">🎉 ${res.message}</span>`;
  } else {
    window.indexActivePromoPct = 0;
    window.indexActivePromoCode = '';
    msgEl.innerHTML = `<span style="color:#f43f5e; font-size:0.8rem;">❌ ${res.message || 'Noto\'g\'ri promokod'}</span>`;
  }
  calculateBookingPrice();
}

function calculateBookingPrice() {
  const items = DB.getItems();
  const item = items.find(i => i.id === activeBookingItemId);
  if (!item) return;

  const startVal = document.getElementById('bookStartDate').value;
  const endVal = document.getElementById('bookEndDate').value;

  const start = new Date(startVal);
  const end = new Date(endVal);

  let diffTime = end.getTime() - start.getTime();
  let days = Math.ceil(diffTime / (1000 * 3600 * 24));
  if (days <= 0) days = 1;

  const baseRent = item.pricePerDay * days;
  const deposit = item.deposit || 0;

  // Duration discounts
  let durationDiscountPct = 0;
  let tags = [];
  if (days >= 7) {
    durationDiscountPct = 15;
    tags.push('15% (7+ kun)');
  } else if (days >= 3) {
    durationDiscountPct = 5;
    tags.push('5% (3+ kun)');
  }

  const promoPct = window.indexActivePromoPct || 0;
  if (promoPct > 0) {
    tags.push(`${promoPct}% (${window.indexActivePromoCode})`);
  }

  const totalDiscountPct = Math.min(50, durationDiscountPct + promoPct);
  const discountAmount = Math.round((baseRent * totalDiscountPct) / 100);
  const finalRent = Math.max(0, baseRent - discountAmount);
  const total = finalRent + deposit;

  document.getElementById('calcDaysCount').innerText = `${days} kun`;
  document.getElementById('calcRentSum').innerText = formatPrice(baseRent);

  const discountRow = document.getElementById('calcDiscountRowIndex');
  if (discountRow) {
    if (totalDiscountPct > 0) {
      discountRow.style.display = 'flex';
      document.getElementById('calcDiscountTagIndex').innerText = tags.join(' + ');
      document.getElementById('calcDiscountValIndex').innerText = `-${formatPrice(discountAmount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  document.getElementById('calcDepositSum').innerText = formatPrice(deposit);
  document.getElementById('calcGrandTotal').innerText = formatPrice(total);

  return { days, baseRent, discountAmount, finalRent, deposit, total };
}

// Index sahifasi uchun band sanalar keshi
let indexBookedRanges = [];

async function loadIndexBookedRanges(itemId) {
  indexBookedRanges = await DB.fetchBookedDates(itemId);
}

function checkIndexConflict(startVal, endVal) {
  return indexBookedRanges.some(b => {
    return !(endVal < b.startDate || startVal > b.endDate);
  });
}

// Handle Booking Form Submit
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const items = DB.getItems();
    const item = items.find(i => i.id === activeBookingItemId);
    if (!item) return;

    const calc = calculateBookingPrice();
    const clientName = document.getElementById('bookClientName').value.trim();
    const clientPhone = document.getElementById('bookClientPhone').value.trim();
    const passportNumber = document.getElementById('bookClientPassport').value.trim();
    const note = document.getElementById('bookClientNote').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'Payme';
    const startDate = document.getElementById('bookStartDate').value;
    const endDate = document.getElementById('bookEndDate').value;

    if (!clientName || !clientPhone) {
      showToast('Iltimos, ism va telefon raqamingizni kiriting', 'error');
      return;
    }

    // Client-side conflict tekshiruvi
    if (checkIndexConflict(startDate, endDate)) {
      showToast('❌ Ushbu sanalarda mahsulot allaqachon band! Boshqa sanani tanlang.', 'error');
      return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Rasmiylashtirilmoqda...</span>';
    }

    const newBooking = {
      itemId: item.id,
      itemTitle: item.title,
      itemCategory: item.categoryName,
      clientName,
      clientPhone,
      passportNumber: passportNumber || '',
      startDate,
      endDate,
      daysCount: calc.days,
      dailyPrice: item.pricePerDay,
      totalPrice: calc.finalRent,
      deposit: calc.deposit,
      discountAmount: calc.discountAmount || 0,
      promoCode: window.indexActivePromoCode || '',
      paymentMethod,
      status: 'kutilmoqda',
      note,
    };

    const result = await DB.addBooking(newBooking);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Buyurtmani Tasdiqlash</span>';
    }

    if (result && result.success) {
      // Band sanalar keshini yangilash
      await loadIndexBookedRanges(item.id);
      closeModal('bookingModal');
      showReceiptModal(result.booking);
      showToast('Buyurtmangiz muvaffaqiyatli qabul qilindi!', 'success');
    } else {
      const errMsg = (result && result.error) || 'Buyurtma saqlanmadi. Qayta urinib ko\'ring.';
      showToast('❌ ' + errMsg, 'error');
    }
  });
}


// Show Receipt Modal
function showReceiptModal(booking) {
  const modal = document.getElementById('genericModal');
  const modalTitle = document.getElementById('genericModalTitle');
  const modalBody = document.getElementById('genericModalBody');

  modalTitle.innerText = "Ijara Cheki va Tasdiqnoma";

  modalBody.innerHTML = `
    <div class="receipt-card" id="printableReceipt">
      <div class="receipt-header">
        <h4>TOP IJARA PLATFORMASI</h4>
        <p style="font-size: 0.82rem; color: #64748b; margin-top: 4px;">Buyurtma raqami: <strong>#${booking.id}</strong></p>
        <span class="status-pill kutilmoqda" style="margin-top: 8px;">Qabul qilindi (Kutilmoqda)</span>
      </div>

      <div class="receipt-item-box">
        <div style="font-size: 0.78rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Ijaraga olingan obyekt:</div>
        <div style="font-weight: 800; font-size: 1.15rem; color: #0f172a; margin-top: 4px;">${booking.itemTitle}</div>
        <div style="font-size: 0.85rem; color: #475569; margin-top: 4px;">Kategoriya: ${booking.itemCategory}</div>
      </div>

      <div class="receipt-meta-grid">
        <div><strong>Mijoz:</strong> ${booking.clientName}</div>
        <div><strong>Telefon:</strong> ${booking.clientPhone}</div>
        <div><strong>Boshlanish sanasi:</strong> ${booking.startDate}</div>
        <div><strong>Tugash sanasi:</strong> ${booking.endDate}</div>
        <div><strong>Muddat:</strong> ${booking.daysCount} kun</div>
        <div><strong>To'lov turi:</strong> ${booking.paymentMethod}</div>
      </div>

      <div style="margin-bottom: 16px; font-size: 0.9rem; color: #475569;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>Kunlik to'lov (${booking.daysCount} x ${formatPrice(booking.dailyPrice)}):</span>
          <span>${formatPrice(booking.daysCount * booking.dailyPrice)}</span>
        </div>
        ${booking.discountAmount > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #10b981; font-weight: 700;">
          <span>Qo'llanilgan chegirma ${booking.promoCode ? '('+booking.promoCode+')' : ''}:</span>
          <span>-${formatPrice(booking.discountAmount)}</span>
        </div>` : ''}
        <div style="display: flex; justify-content: space-between;">
          <span>Qaytariladigan garov depoziti:</span>
          <span>${formatPrice(booking.deposit)}</span>
        </div>
      </div>

      <div class="receipt-price-summary">
        <span>Jami To'lov Summasi:</span>
        <span style="color: #10b981;">${formatPrice(booking.totalPrice + booking.deposit)}</span>
      </div>
    </div>

    <div style="display: flex; gap: 12px; margin-top: 20px; justify-content: flex-end;">
      <button class="btn btn-secondary" onclick="window.print()">🖨️ Chekni chop etish</button>
      <button class="btn btn-primary" onclick="closeGenericModal()">Tushunarli</button>
    </div>
  `;

  openModal('genericModal');
}

// Add New Listing Modal (Client side "E'lon berish")
function openAddListingModal() {
  if (!currentUser) {
    showToast('E\'lon berish uchun iltimos, avval tizimga kiring', 'error');
    openAuthModal('login');
    return;
  }
  const modal = document.getElementById('genericModal');
  const modalTitle = document.getElementById('genericModalTitle');
  const modalBody = document.getElementById('genericModalBody');

  modalTitle.innerText = "Yangi Ijara E'lonini Joylashtirish";

  modalBody.innerHTML = `
    <form id="clientAddListingForm" onsubmit="handleClientAddListing(event)">
      <div class="form-grid">
        <div class="form-group" style="grid-column: 1 / -1;">
          <label>Ijara Obyekti Nomi *</label>
          <input type="text" id="adTitle" class="form-control" placeholder="Masalan: Chevrolet Onix Premier 2024 yoki Toshkent City Kvartira" required>
        </div>

        <div class="form-group">
          <label>Kategoriya *</label>
          <select id="adCategory" class="form-control" required>
            <option value="auto">🚗 Avtomobillar</option>
            <option value="realty">🏠 Ko'chmas Mulk</option>
            <option value="tech">⚙️ Texnika va Gadjetlar</option>
          </select>
        </div>

        <div class="form-group">
          <label>Shahar / Hudud *</label>
          <select id="adCity" class="form-control" required>
            <option value="Toshkent">Toshkent shahri</option>
            <option value="Toshkent viloyati">Toshkent viloyati (Bo'stonliq/Chirchiq)</option>
            <option value="Samarqand">Samarqand shahri</option>
            <option value="Buxoro">Buxoro shahri</option>
            <option value="Farg'ona">Farg'ona vodiysi</option>
          </select>
        </div>

        <div class="form-group">
          <label>Kunlik Ijara Narxi (so'mda) *</label>
          <input type="number" id="adPrice" class="form-control" placeholder="500000" min="10000" required>
        </div>

        <div class="form-group">
          <label>Garov Depoziti (so'mda)</label>
          <input type="number" id="adDeposit" class="form-control" placeholder="1000000">
        </div>

        <div class="form-group" style="grid-column: 1 / -1;">
          <label>Rasm URL manzili</label>
          <input type="url" id="adImage" class="form-control" placeholder="https://images.unsplash.com/..." value="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80">
        </div>

        <div class="form-group">
          <label>Telefon raqam *</label>
          <input type="text" id="adPhone" class="form-control" placeholder="+998 90 123 45 67" required>
        </div>

        <div class="form-group">
          <label>E'lon beruvchi / Kompaniya</label>
          <input type="text" id="adOwner" class="form-control" placeholder="Ismingiz yoki Agentlik nomi" required>
        </div>

        <div class="form-group" style="grid-column: 1 / -1;">
          <label>Batafsil Tavsif</label>
          <textarea id="adDescription" class="form-control" rows="3" placeholder="Shartlar, qulayliklar va yetkazib berish haqida..."></textarea>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px;">
        <button type="button" class="btn btn-secondary" onclick="closeGenericModal()">Bekor qilish</button>
        <button type="submit" class="btn btn-primary">E'lonni tasdiqlash va joylash</button>
      </div>
    </form>
  `;

  openModal('genericModal');
}

async function handleClientAddListing(event) {
  event.preventDefault();
  const categoryNames = {
    auto: 'Avtomobillar',
    realty: "Ko'chmas Mulk",
    tech: 'Texnika va Gadjetlar'
  };

  const catVal = document.getElementById('adCategory').value;
  const newItem = {
    id: 'item-' + Date.now(),
    title: document.getElementById('adTitle').value.trim(),
    category: catVal,
    categoryName: categoryNames[catVal] || 'Boshqa',
    city: document.getElementById('adCity').value,
    district: 'Markaz',
    pricePerDay: Number(document.getElementById('adPrice').value),
    deposit: Number(document.getElementById('adDeposit').value) || 0,
    rating: 5.0,
    reviewsCount: 1,
    isTop: true,
    isAvailable: true,
    image: document.getElementById('adImage').value || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
    images: [document.getElementById('adImage').value],
    specs: {
      'Holati': 'A\'lo darajada',
      'Yetkazish': 'Kelishiladi',
      'Rasmiylashtirish': 'Passport bilan'
    },
    description: document.getElementById('adDescription').value.trim() || "Yangi qulay ijara taklifi.",
    ownerName: document.getElementById('adOwner').value.trim(),
    ownerPhone: document.getElementById('adPhone').value.trim(),
    views: 1,
    createdAt: new Date().toISOString().split('T')[0]
  };

  await DB.addItem(newItem);
  await DB.fetchCategories();

  closeGenericModal();
  renderCategories();
  renderItems();
  showToast("E'lon muvaffaqiyatli qo'shildi va katalogda paydo bo'ldi!", 'success');
}

// Modal Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function closeGenericModal() {
  closeModal('genericModal');
}

// Toast System
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" style="color: var(--primary);"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    error: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" style="color: var(--accent-rose);"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    info: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" style="color: var(--primary);"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${icons[type] || ''}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
