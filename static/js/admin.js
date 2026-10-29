// ==========================================
// TOP IJARA - To'liq Admin Boshqaruv Paneli
// ==========================================

window.AdminApp = (function() {
  let activeTab = 'dashboard';
  let adminSearchQuery = '';

  function init() {
    setupAdminNavigation();
    renderActiveTab();
  }

  function setupAdminNavigation() {
    const navButtons = document.querySelectorAll('.admin-nav-item');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = btn.dataset.tab;
        if (!tab) return;
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTab = tab;
        renderActiveTab();
      });
    });
  }

  function renderActiveTab() {
    const contentArea = document.getElementById('adminTabContent');
    if (!contentArea) return;

    if (activeTab === 'dashboard') {
      renderDashboard(contentArea);
    } else if (activeTab === 'listings') {
      renderListingsTab(contentArea);
    } else if (activeTab === 'bookings') {
      renderBookingsTab(contentArea);
    } else if (activeTab === 'settings') {
      renderSettingsTab(contentArea);
    }
  }

  // 1. Dashboard View
  function renderDashboard(container) {
    const items = DB.getItems();
    const bookings = DB.getBookings();

    const totalIncome = bookings
      .filter(b => b.status === 'tasdiqlangan' || b.status === 'yakunlangan')
      .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

    const pendingOrders = bookings.filter(b => b.status === 'kutilmoqda').length;
    const activeRentals = bookings.filter(b => b.status === 'tasdiqlangan').length;

    container.innerHTML = `
      <div class="admin-page-header">
        <div>
          <h2>Boshqaruv Paneli (Dashboard)</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Platforma ko'rsatkichlari va so'nggi faolliklar</p>
        </div>
        <button class="btn btn-primary" onclick="AdminApp.openItemEditModal()">
          <span>➕ Yangi e'lon qo'shish</span>
        </button>
      </div>

      <!-- KPI Metrics -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-info">
            <h5>Jami E'lonlar</h5>
            <div class="metric-num">${items.length} ta</div>
          </div>
          <div class="metric-icon-box blue">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-info">
            <h5>Kutilayotgan Buyurtmalar</h5>
            <div class="metric-num" style="color: var(--accent-amber);">${pendingOrders} ta</div>
          </div>
          <div class="metric-icon-box orange">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-info">
            <h5>Hozirda Ijarada</h5>
            <div class="metric-num" style="color: var(--primary);">${activeRentals} ta</div>
          </div>
          <div class="metric-icon-box green">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-info">
            <h5>Jami Tushum</h5>
            <div class="metric-num" style="font-size: 1.45rem;">${totalIncome.toLocaleString()} so'm</div>
          </div>
          <div class="metric-icon-box purple">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
        </div>
      </div>

      <!-- Quick Recent Orders Table -->
      <div class="admin-table-card">
        <div class="table-toolbar">
          <h4 style="font-size: 1.1rem; font-weight: 700;">So'nggi Kelib Tushgan Buyurtmalar</h4>
          <button class="btn btn-secondary btn-sm" onclick="document.querySelector('[data-tab=bookings]').click()">Barchasini ko'rish →</button>
        </div>
        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mijoz</th>
                <th>Obyekt</th>
                <th>Muddat</th>
                <th>Summa</th>
                <th>Holat</th>
                <th>Harakat</th>
              </tr>
            </thead>
            <tbody>
              ${renderBookingsRows(bookings.slice(0, 5))}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 2. Listings CRUD Tab
  function renderListingsTab(container) {
    const items = DB.getItems();
    const filtered = adminSearchQuery
      ? items.filter(i => i.title.toLowerCase().includes(adminSearchQuery.toLowerCase()) || i.categoryName.toLowerCase().includes(adminSearchQuery.toLowerCase()))
      : items;

    container.innerHTML = `
      <div class="admin-page-header">
        <div>
          <h2>E'lonlar Ro'yxati (${items.length} ta)</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Ijaraga qo'yilgan transport, mulk va uskunalarni boshqarish</p>
        </div>
        <button class="btn btn-primary" onclick="AdminApp.openItemEditModal()">
          <span>➕ Yangi e'lon qo'shish</span>
        </button>
      </div>

      <div class="admin-table-card">
        <div class="table-toolbar">
          <div class="table-search">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="E'lon nomi yoki kategoriya..." value="${adminSearchQuery}" oninput="AdminApp.handleListingSearch(this.value)">
          </div>
          <div>
            <span style="font-size: 0.85rem; color: var(--text-muted);">Jami: ${filtered.length} ta e'lon</span>
          </div>
        </div>

        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Obyekt</th>
                <th>Kategoriya</th>
                <th>Shahar</th>
                <th>Kunlik Narx</th>
                <th>Garov</th>
                <th>TOP / VIP</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(item => `
                <tr>
                  <td>
                    <div class="table-item-info">
                      <img class="table-item-img" src="${item.image}" alt="${item.title}">
                      <div>
                        <strong>${item.title}</strong>
                        <div style="font-size: 0.78rem; color: var(--text-dim);">${item.ownerName || 'Egasiz'} (${item.ownerPhone || ''})</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge badge-category">${item.categoryName}</span></td>
                  <td>${item.city}</td>
                  <td style="color: var(--primary); font-weight: 700;">${item.pricePerDay.toLocaleString()} so'm</td>
                  <td>${item.deposit ? item.deposit.toLocaleString() + ' so\'m' : '—'}</td>
                  <td>
                    <button class="btn btn-sm ${item.isTop ? 'btn-primary' : 'btn-secondary'}" onclick="AdminApp.toggleItemTop('${item.id}')">
                      ${item.isTop ? '⭐ TOP' : 'Oddiy'}
                    </button>
                  </td>
                  <td>
                    <div class="action-btns">
                      <button class="btn-table-action" onclick="AdminApp.openItemEditModal('${item.id}')" title="Tahrirlash">✏️</button>
                      <button class="btn-table-action delete" onclick="AdminApp.deleteItem('${item.id}')" title="O'chirish">🗑️</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 3. Bookings Orders Tab
  function renderBookingsTab(container) {
    const bookings = DB.getBookings();

    container.innerHTML = `
      <div class="admin-page-header">
        <div>
          <h2>Buyurtmalar va Ijaralar (${bookings.length} ta)</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Mijozlar tomonidan yuborilgan buyurtmalarni tasdiqlash va nazorat qilish</p>
        </div>
      </div>

      <div class="admin-table-card">
        <div class="table-toolbar">
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm" onclick="AdminApp.filterBookingsByStatus('all')">Barchasi</button>
            <button class="btn btn-secondary btn-sm" onclick="AdminApp.filterBookingsByStatus('kutilmoqda')">⏳ Kutilmoqda</button>
            <button class="btn btn-secondary btn-sm" onclick="AdminApp.filterBookingsByStatus('tasdiqlangan')">✅ Tasdiqlangan</button>
            <button class="btn btn-secondary btn-sm" onclick="AdminApp.filterBookingsByStatus('yakunlangan')">🏁 Yakunlangan</button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mijoz</th>
                <th>Obyekt</th>
                <th>Sana / Muddat</th>
                <th>To'lov turi & Summa</th>
                <th>Holat</th>
                <th>Boshqaruv</th>
              </tr>
            </thead>
            <tbody>
              ${renderBookingsRows(bookings)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderBookingsRows(bookingsList) {
    if (bookingsList.length === 0) {
      return `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">Hozircha buyurtmalar mavjud emas</td></tr>`;
    }

    return bookingsList.map(b => `
      <tr>
        <td><strong>#${b.id}</strong></td>
        <td>
          <div><strong>${b.clientName}</strong></div>
          <div style="font-size: 0.8rem; color: var(--text-dim);">${b.clientPhone}</div>
          <div style="font-size: 0.74rem; color: var(--text-dim);">${b.passportNumber || ''}</div>
        </td>
        <td>
          <div style="font-weight: 600; max-width: 220px;">${b.itemTitle}</div>
          <div style="font-size: 0.78rem; color: var(--primary);">${b.itemCategory}</div>
        </td>
        <td>
          <div style="font-size: 0.85rem;">${b.startDate} dan ${b.endDate} gacha</div>
          <span class="spec-pill">${b.daysCount} kun</span>
        </td>
        <td>
          <div style="font-weight: 700; color: var(--primary);">${(b.totalPrice || 0).toLocaleString()} so'm</div>
          <div style="font-size: 0.78rem; color: var(--text-dim);">Usul: ${b.paymentMethod || 'Naqd'}</div>
        </td>
        <td>
          <span class="status-pill ${b.status}">${b.status}</span>
        </td>
        <td>
          <div class="action-btns">
            ${b.status === 'kutilmoqda' ? `
              <button class="btn-table-action approve" onclick="AdminApp.updateBookingStatus('${b.id}', 'tasdiqlangan')" title="Tasdiqlash">✅</button>
            ` : ''}
            ${b.status === 'tasdiqlangan' ? `
              <button class="btn-table-action" onclick="AdminApp.updateBookingStatus('${b.id}', 'yakunlangan')" title="Ijarani yakunlash">🏁</button>
            ` : ''}
            <button class="btn-table-action" onclick="AdminApp.showBookingDetails('${b.id}')" title="Chek / Batafsil">📄</button>
            <button class="btn-table-action delete" onclick="AdminApp.deleteBooking('${b.id}')" title="O'chirish">❌</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // 4. Settings & Data Tab
  function renderSettingsTab(container) {
    container.innerHTML = `
      <div class="admin-page-header">
        <div>
          <h2>Tizim Sozlamalari va Baza</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Ma'lumotlar bazasini boshqarish, nusxa olish yoki dastlabki holatga qaytarish</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
        <!-- Password Change Card -->
        <div class="admin-table-card" style="padding: 24px;">
          <h4 style="margin-bottom: 12px; font-size: 1.15rem;">🔐 Admin Parolini O'zgartirish</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 16px;">
            Mijozlar kira olmasligi uchun admin login va maxfiy parolini yangilang.
          </p>
          <form onsubmit="AdminApp.handlePasswordChange(event)" style="display: flex; flex-direction: column; gap: 12px;">
            <div class="form-group">
              <label>Yangi Admin Login</label>
              <input type="text" id="settingAdminLogin" class="form-control" value="${DB.getAdminCreds().login}" required>
            </div>
            <div class="form-group">
              <label>Yangi Parol</label>
              <input type="password" id="settingAdminPass" class="form-control" placeholder="Yangi kuchli parol" required>
            </div>
            <button type="submit" class="btn btn-primary" style="margin-top: 6px;">
              <span>💾 Login va Parolni Saqlash</span>
            </button>
          </form>
        </div>

        <div class="admin-table-card" style="padding: 24px;">
          <h4 style="margin-bottom: 12px; font-size: 1.15rem;">🔄 Dastlabki Demo Bazani Qaytarish</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px;">
            Barcha sinov e'lonlari (Chevrolet Malibu, BYD Song Plus, Toshkent City Pentxaus, PS5 va boshqalar) va namuna buyurtmalarni qayta tiklaydi.
          </p>
          <button class="btn btn-secondary" onclick="AdminApp.resetDemoData()">Bazani qayta tiklash (Reset)</button>
        </div>

        <div class="admin-table-card" style="padding: 24px;">
          <h4 style="margin-bottom: 12px; font-size: 1.15rem;">💾 JSON Ma'lumotlarni Eksport Qilish</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px;">
            Hozirgi barcha e'lonlar va buyurtmalar tarixini zaxira fayl (backup JSON) sifatida kompyuteringizga yuklab oling.
          </p>
          <button class="btn btn-primary" onclick="AdminApp.exportData()">JSON yuklab olish</button>
        </div>
      </div>
    `;
  }

  // Item Add/Edit Modal
  function openItemEditModal(itemId = null) {
    const isEdit = !!itemId;
    const items = DB.getItems();
    const item = isEdit ? items.find(i => i.id === itemId) : {
      title: '',
      category: 'auto',
      city: 'Toshkent',
      district: 'Mirobod',
      pricePerDay: 500000,
      deposit: 1000000,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
      ownerName: 'Apex Rental',
      ownerPhone: '+998 (90) 123-45-67',
      description: '',
      isTop: true
    };

    const modal = document.getElementById('genericModal');
    const modalTitle = document.getElementById('genericModalTitle');
    const modalBody = document.getElementById('genericModalBody');

    modalTitle.innerText = isEdit ? "E'lonni Tahrirlash" : "Yangi Ijara Obyektini Qo'shish";

    modalBody.innerHTML = `
      <form id="adminItemForm" onsubmit="AdminApp.saveItem(event, '${itemId || ''}')">
        <div class="form-grid">
          <div class="form-group" style="grid-column: 1 / -1;">
            <label>Obyekt Nomi (Sarlavha) *</label>
            <input type="text" id="adminFormTitle" class="form-control" value="${item.title || ''}" required placeholder="Masalan: BYD Song Plus 2024">
          </div>

          <div class="form-group">
            <label>Kategoriya *</label>
            <select id="adminFormCategory" class="form-control">
              <option value="auto" ${item.category === 'auto' ? 'selected' : ''}>🚗 Avtomobillar</option>
              <option value="realty" ${item.category === 'realty' ? 'selected' : ''}>🏠 Ko'chmas Mulk</option>
              <option value="tech" ${item.category === 'tech' ? 'selected' : ''}>⚙️ Texnika va Gadjetlar</option>
            </select>
          </div>

          <div class="form-group">
            <label>Shahar *</label>
            <input type="text" id="adminFormCity" class="form-control" value="${item.city || 'Toshkent'}" required>
          </div>

          <div class="form-group">
            <label>Kunlik Ijara Narxi (so'm) *</label>
            <input type="number" id="adminFormPrice" class="form-control" value="${item.pricePerDay || 500000}" required>
          </div>

          <div class="form-group">
            <label>Garov Depoziti (so'm)</label>
            <input type="number" id="adminFormDeposit" class="form-control" value="${item.deposit || 1000000}">
          </div>

          <div class="form-group" style="grid-column: 1 / -1;">
            <label>Rasm URL Manzili</label>
            <input type="url" id="adminFormImage" class="form-control" value="${item.image || ''}">
          </div>

          <div class="form-group">
            <label>E'lon Egasi / Mas'ul shaxs</label>
            <input type="text" id="adminFormOwner" class="form-control" value="${item.ownerName || 'Apex Rental'}">
          </div>

          <div class="form-group">
            <label>Aloqa Telefoni</label>
            <input type="text" id="adminFormPhone" class="form-control" value="${item.ownerPhone || '+998 90 123 45 67'}">
          </div>

          <div class="form-group" style="grid-column: 1 / -1;">
            <label>Batafsil Tavsifi</label>
            <textarea id="adminFormDesc" class="form-control" rows="3">${item.description || ''}</textarea>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
          <button type="button" class="btn btn-secondary" onclick="closeGenericModal()">Bekor qilish</button>
          <button type="submit" class="btn btn-primary">Saqlash</button>
        </div>
      </form>
    `;

    openModal('genericModal');
  }

  async function saveItem(e, existingId) {
    e.preventDefault();
    const items = DB.getItems();
    const catMap = {
      auto: 'Avtomobillar',
      realty: "Ko'chmas Mulk",
      tech: 'Texnika va Gadjetlar'
    };

    const category = document.getElementById('adminFormCategory').value;
    const title = document.getElementById('adminFormTitle').value.trim();
    const city = document.getElementById('adminFormCity').value.trim();
    const pricePerDay = Number(document.getElementById('adminFormPrice').value);
    const deposit = Number(document.getElementById('adminFormDeposit').value) || 0;
    const image = document.getElementById('adminFormImage').value.trim();
    const ownerName = document.getElementById('adminFormOwner').value.trim();
    const ownerPhone = document.getElementById('adminFormPhone').value.trim();
    const description = document.getElementById('adminFormDesc').value.trim();

    if (existingId) {
      await DB.updateItem(existingId, {
        title, category, categoryName: catMap[category] || 'Boshqa',
        city, pricePerDay, deposit, image, description, ownerName, ownerPhone
      });
      showToast("E'lon ma'lumotlari yangilandi!", 'success');
    } else {
      const newItem = {
        title,
        category,
        categoryName: catMap[category] || 'Boshqa',
        city,
        district: 'Markaz',
        pricePerDay,
        deposit,
        rating: 5.0,
        reviewsCount: 1,
        isTop: true,
        isAvailable: true,
        image: image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
        images: [image],
        specs: { 'Holati': 'Ideal', 'Rasmiylashtirish': 'Tezkor' },
        description,
        ownerName,
        ownerPhone,
        views: 1,
        createdAt: new Date().toISOString().split('T')[0]
      };
      await DB.addItem(newItem);
      showToast("Yangi e'lon muvaffaqiyatli qo'shildi!", 'success');
    }

    await DB.fetchCategories();
    closeGenericModal();
    renderActiveTab();
    renderCategories();
  }

  async function deleteItem(itemId) {
    if (!confirm("Haqiqatan ham ushbu e'lonni o'chirib tashlamoqchimisiz?")) return;
    await DB.deleteItem(itemId);
    await DB.fetchCategories();
    showToast("E'lon o'chirildi", 'info');
    renderActiveTab();
    renderCategories();
  }

  async function toggleItemTop(itemId) {
    await DB.toggleTop(itemId);
    showToast(`E'lon holati o'zgartirildi`, 'success');
    renderActiveTab();
  }

  async function updateBookingStatus(orderId, newStatus) {
    await DB.updateBookingStatus(orderId, newStatus);
    showToast(`Buyurtma holati "${newStatus}" ga o'zgartirildi`, 'success');
    renderActiveTab();
  }

  async function deleteBooking(orderId) {
    if (!confirm("Ushbu buyurtmani o'chirishni xohlaysizmi?")) return;
    await DB.deleteBooking(orderId);
    showToast("Buyurtma o'chirildi", 'info');
    renderActiveTab();
  }

  function showBookingDetails(orderId) {
    const bookings = DB.getBookings();
    const b = bookings.find(x => x.id === orderId);
    if (b) {
      showReceiptModal(b);
    }
  }

  function filterBookingsByStatus(status) {
    const bookings = DB.getBookings();
    const filtered = status === 'all' ? bookings : bookings.filter(b => b.status === status);
    const tbody = document.querySelector('.custom-table tbody');
    if (tbody) {
      tbody.innerHTML = renderBookingsRows(filtered);
    }
  }

  function handleListingSearch(q) {
    adminSearchQuery = q;
    const contentArea = document.getElementById('adminTabContent');
    if (contentArea) renderListingsTab(contentArea);
  }

  async function resetDemoData() {
    if (confirm("Diqqat! Barcha o'zgarishlar bekor qilinadi va demo baza qayta tiklanadi. Tasdiqlaysizmi?")) {
      await DB.resetToDefault();
      showToast("Baza dastlabki holatga qaytarildi!", 'success');
      renderActiveTab();
      renderCategories();
    }
  }

  function exportData() {
    const data = {
      items: DB.getItems(),
      bookings: DB.getBookings(),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `top_ijara_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast("Zaxira nusxasi yuklandi!", 'success');
  }

  function handlePasswordChange(e) {
    e.preventDefault();
    const newLogin = document.getElementById('settingAdminLogin').value.trim();
    const newPass = document.getElementById('settingAdminPass').value.trim();

    if (!newLogin || !newPass) {
      showToast("Login va yangi parolni to'liq kiriting!", "error");
      return;
    }

    DB.saveAdminCreds({ login: newLogin, password: newPass });
    showToast("Admin login va paroli muvaffaqiyatli o'zgartirildi! 🔐", "success");
    document.getElementById('settingAdminPass').value = '';
  }

  return {
    init,
    openItemEditModal,
    saveItem,
    deleteItem,
    toggleItemTop,
    updateBookingStatus,
    deleteBooking,
    showBookingDetails,
    filterBookingsByStatus,
    handleListingSearch,
    resetDemoData,
    exportData,
    handlePasswordChange
  };
})();
