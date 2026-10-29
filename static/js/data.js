// ==========================================
// TOP IJARA - Boshlang'ich Ma'lumotlar Bazasi & Django API Sync
// ==========================================

const INITIAL_CATEGORIES = [
  { id: 'all', name: 'Barcha Ijaralar', icon: 'grid', count: 10 },
  { id: 'auto', name: 'Avtomobillar', icon: 'car', count: 4 },
  { id: 'realty', name: "Ko'chmas Mulk", icon: 'home', count: 3 },
  { id: 'tech', name: 'Texnika va Gadjetlar', icon: 'camera', count: 3 }
];

const INITIAL_ITEMS = [
  {
    id: 'item-1',
    title: 'BYD Song Plus Champion EV (2024)',
    category: 'auto',
    categoryName: 'Avtomobillar',
    city: 'Toshkent',
    district: 'Yunusobod',
    pricePerDay: 550000,
    deposit: 1500000,
    rating: 4.95,
    reviewsCount: 38,
    isTop: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      'Yili': '2024',
      'Dvigatel': 'Elektr (605 km)',
      'Uzatma': 'Avtomat',
      'Konditsioner': 'Mavjud (Iqlim nazorati)',
      'O\'rindiqlar': '5 kishilik',
      'Haydovchisiz': 'Mumkin'
    },
    description: "Yangi BYD Song Plus Champion 2024. Ideal holatda, toza va xushbo'y salon. 605 km zaxiraga ega to'liq elektr krossover. Shahar bo'ylab yoki viloyatlarga sayohat uchun ajoyib tanlov. KASKO sug'urtasi mavjud.",
    ownerName: 'Apex Car Rental',
    ownerPhone: '+998 (90) 123-45-67',
    views: 420,
    createdAt: '2026-09-15'
  },
  {
    id: 'item-2',
    title: 'Chevrolet Malibu 2 Premier 2.0 Turbo',
    category: 'auto',
    categoryName: 'Avtomobillar',
    city: 'Toshkent',
    district: 'Mirobod',
    pricePerDay: 600000,
    deposit: 2000000,
    rating: 4.9,
    reviewsCount: 52,
    isTop: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      'Yili': '2023',
      'Dvigatel': '2.0L Turbo (253 o.k.)',
      'Uzatma': 'Avtomat 9-pog\'ona',
      'Yoqilg\'i': 'Benzin (Ai-95)',
      'Salon': 'Qora charm, lyuk',
      'Haydovchisiz': 'Mumkin'
    },
    description: "Premium biznes klass Malibu 2. Yangi g'ildiraklar, to'liq tonirovka ruxsatnomasi mavjud. Mehmonlarni kutib olish, to'y marosimlari yoki biznes uchrashuvlar uchun eng zo'r variant.",
    ownerName: 'Premium Motors Toshkent',
    ownerPhone: '+998 (97) 777-88-99',
    views: 680,
    createdAt: '2026-09-18'
  },
  {
    id: 'item-3',
    title: 'Toshkent City - Zamonaviy 3 Xonali Pentxaus',
    category: 'realty',
    categoryName: "Ko'chmas Mulk",
    city: 'Toshkent',
    district: 'Shayxontohur',
    pricePerDay: 1200000,
    deposit: 2500000,
    rating: 4.98,
    reviewsCount: 29,
    isTop: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      'Maydoni': '145 m²',
      'Xonalar soni': '3 xona',
      'Qavat': '18 / 22',
      'Internet': 'Tezkor Wi-Fi (500 Mbit/s)',
      'Jihozlar': 'To\'liq mebel va Smart TV',
      'Manzara': 'Park va favvoralar panoramasi'
    },
    description: "Toshkent City majmuasida joylashgan lyuks apartament. Markaziy parkka va musiqali favvoraga ajoyib panorama. Barcha qulayliklar: italyan oshxona mebellari, smart uy tizimi, 24/7 qo'riqlash va yer osti avtoturargohi.",
    ownerName: 'City Luxe Apartments',
    ownerPhone: '+998 (99) 001-22-33',
    views: 940,
    createdAt: '2026-09-10'
  },
  {
    id: 'item-4',
    title: 'Amirsoy / Chimyon - Isitiladigan Hovuzli Tog\' Dachasi',
    category: 'realty',
    categoryName: "Ko'chmas Mulk",
    city: 'Toshkent viloyati',
    district: "Bo'stonliq",
    pricePerDay: 2200000,
    deposit: 3000000,
    rating: 4.93,
    reviewsCount: 44,
    isTop: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      'Hovuz': 'Qishki isitiladigan (32°C) va Yozgi',
      'Sig\'imi': '12-15 kishigacha',
      'Yotoqxonalar': '4 ta yotoqxona',
      'Ko\'ngilochar': 'PlayStation 5, Bilyard, Karaoke',
      'Sauna': 'Fin saunasi mavjud',
      'Mangal': 'Mangal zona, o\'choq-qozon'
    },
    description: "Oila va do'stlar bilan toza tog' havosida unutilmas dam olish maskani. Isitiladigan yopiq hovuz, qulay bilyard zali, kuchli akustik karaoke tizimi. Tog'larning betakror manzarasi.",
    ownerName: 'Mountain Villa Resort',
    ownerPhone: '+998 (91) 333-44-55',
    views: 1200,
    createdAt: '2026-09-20'
  },
  {
    id: 'item-5',
    title: 'DJI Mini 4 Pro Drone + Fly More Combo (Professional)',
    category: 'tech',
    categoryName: 'Texnika va Gadjetlar',
    city: 'Toshkent',
    district: 'Chilonzor',
    pricePerDay: 250000,
    deposit: 1000000,
    rating: 4.88,
    reviewsCount: 19,
    isTop: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      'Kamera': '4K HDR / 60fps, 48MP',
      'Batareya': '3 ta akkumulyator (100+ daqiqa)',
      'Masofa': '20 km uzatish',
      'Og\'irligi': '249 gramm (Ultra yengil)',
      'Komplekt': 'Pult ekranli (RC 2), sumka, filtrlar'
    },
    description: "Klip, to'y, sayohat va reklama roliklarini suratga olish uchun eng yangi DJI droni. 4K sifat, vertikal video olish (Instagram Reels/TikTok uchun mos). RC 2 ekranli pulti bilan taqdim etiladi.",
    ownerName: 'VideoPro Rent',
    ownerPhone: '+998 (93) 555-11-22',
    views: 310,
    createdAt: '2026-09-22'
  },
  {
    id: 'item-6',
    title: 'Sony PlayStation 5 + 4 Pult + 20 ta Yangi O\'yinlar',
    category: 'tech',
    categoryName: 'Texnika va Gadjetlar',
    city: 'Toshkent',
    district: 'Yakkasaroy',
    pricePerDay: 130000,
    deposit: 400000,
    rating: 4.96,
    reviewsCount: 67,
    isTop: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      'Versiya': 'PS5 Disc Edition (Oq)',
      'Pultlar': '4 ta original DualSense',
      'O\'yinlar': 'FC 25, Mortal Kombat 1, UFC 5, GTA 5, Spider-Man 2',
      'Yetkazib berish': 'Shaharning istalgan nuqtasiga'
    },
    description: "Do'stlar va oila davrasida qiziqarli oqshom o'tkazish uchun to'liq to'plam. Eng so'nggi yangi o'yinlar yuklangan. Uyga yetkazib berish va o'rnatib berish xizmati mavjud.",
    ownerName: 'GameZone Rent',
    ownerPhone: '+998 (95) 144-88-00',
    views: 590,
    createdAt: '2026-09-21'
  },
  {
    id: 'item-7',
    title: 'Chevrolet Tracker 2 Premier Redline (2024)',
    category: 'auto',
    categoryName: 'Avtomobillar',
    city: 'Samarqand',
    district: 'Markaz',
    pricePerDay: 420000,
    deposit: 1200000,
    rating: 4.87,
    reviewsCount: 22,
    isTop: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      'Yili': '2024',
      'Dvigatel': '1.2 Turbo',
      'Uzatma': 'Avtomat',
      'Yoqilg\'i': 'Benzin',
      'Panoramik lyuk': 'Mavjud',
      'Haydovchisiz': 'Mumkin'
    },
    description: "Samarqand shahrida qulay va zamonaviy krossover ijarasi. Sayyohlar va shahar mehmonlari uchun qulay shartlar. Aeroport yoki vokzaldan kutib olish imkoniyati.",
    ownerName: 'Samarkand Car Drive',
    ownerPhone: '+998 (66) 234-56-78',
    views: 290,
    createdAt: '2026-09-17'
  },
  {
    id: 'item-8',
    title: 'Kärcher Professional Bug\' Tozalagich & Pilesos',
    category: 'tech',
    categoryName: 'Texnika va Gadjetlar',
    city: 'Toshkent',
    district: 'Mirzo Ulug\'bek',
    pricePerDay: 180000,
    deposit: 300000,
    rating: 4.79,
    reviewsCount: 16,
    isTop: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      'Model': 'Kärcher Puzzi 10/1 + SG 4/4',
      'Vazifasi': 'Mebel, gilam va avtosalon ximchistkasi',
      'Kimyoviy vosita': '2 dona original planshet sovg\'a',
      'Yo\'riqnoma': 'Batafsil video tushuntirish'
    },
    description: "Uyingizdagi divan, kreslo, gilam va mashina salonini professional darajada yangidek tozalang. Ishlatish juda oson. Komplektda barcha kerakli nasadkalar bor.",
    ownerName: 'CleanTech Tashkent',
    ownerPhone: '+998 (90) 808-11-22',
    views: 215,
    createdAt: '2026-09-23'
  },
  {
    id: 'item-9',
    title: 'Zamonaviy Ofis Maydoni - Mirzo Ulug\'bek Biznes Markazi',
    category: 'realty',
    categoryName: "Ko'chmas Mulk",
    city: 'Toshkent',
    district: 'Mirzo Ulug\'bek',
    pricePerDay: 800000,
    deposit: 1500000,
    rating: 4.91,
    reviewsCount: 11,
    isTop: false,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      'Maydon': '90 m²',
      'Xodimlar': '10-15 kishilik joy',
      'Jihozlar': 'Stol-stullar, proyektor, doska',
      'Oshxona': 'Kofe mashinasi, muzlatgich',
      'Konferens-zal': 'Mavjud'
    },
    description: "Kompaniyalar, startaplar yoki seminar-treninglar uchun to'liq jihozlangan zamonaviy ofis. Yuqori tezlikdagi optik internet, konditsionerlar, qulay lokatsiya.",
    ownerName: 'Hub Business Center',
    ownerPhone: '+998 (71) 200-00-11',
    views: 340,
    createdAt: '2026-09-12'
  },
  {
    id: 'item-10',
    title: 'Kia K5 GT-Line (2024 Qora Sedani)',
    category: 'auto',
    categoryName: 'Avtomobillar',
    city: 'Toshkent',
    district: 'Sergeli',
    pricePerDay: 580000,
    deposit: 1800000,
    rating: 4.92,
    reviewsCount: 31,
    isTop: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      'Yili': '2024',
      'Dvigatel': '2.5L Smartstream',
      'Komplektatsiya': 'GT-Line (Maksimal)',
      'Salon': 'Qizil sport charm',
      'Audio': 'Bose Premium akustika'
    },
    description: "Sport va hashamat uyg'unligi. Yangi Kia K5 GT-Line. Shovqinsiz qulay yurish, moslashuvchan kruiz-kontrol, 360 daraja kamera va panoramik tom.",
    ownerName: 'DrivePro Car Rental',
    ownerPhone: '+998 (90) 999-55-44',
    views: 510,
    createdAt: '2026-09-19'
  }
];

const INITIAL_BOOKINGS = [
  {
    id: 'ORD-8941',
    itemId: 'item-1',
    itemTitle: 'BYD Song Plus Champion EV (2024)',
    itemCategory: 'Avtomobillar',
    clientName: 'Alisher Qodirov',
    clientPhone: '+998 90 912 34 56',
    passportNumber: 'AB 1234567',
    startDate: '2026-09-30',
    endDate: '2026-10-03',
    daysCount: 3,
    dailyPrice: 550000,
    totalPrice: 1650000,
    deposit: 1500000,
    paymentMethod: 'Payme',
    status: 'tasdiqlangan',
    note: 'Aeroportdan yetkazib berish so\'ralgan',
    createdAt: '2026-09-29T10:15:00'
  },
  {
    id: 'ORD-8938',
    itemId: 'item-3',
    itemTitle: 'Toshkent City - Zamonaviy 3 Xonali Pentxaus',
    itemCategory: "Ko'chmas Mulk",
    clientName: 'Sardorbek Umarov',
    clientPhone: '+998 97 456 78 90',
    passportNumber: 'AC 9876543',
    startDate: '2026-10-01',
    endDate: '2026-10-05',
    daysCount: 4,
    dailyPrice: 1200000,
    totalPrice: 4800000,
    deposit: 2500000,
    paymentMethod: 'Click',
    status: 'kutilmoqda',
    note: 'Oilaviy mehmonlar bilan dam olish uchun',
    createdAt: '2026-09-29T12:40:00'
  },
  {
    id: 'ORD-8920',
    itemId: 'item-6',
    itemTitle: 'Sony PlayStation 5 + 4 Pult + 20 ta Yangi O\'yinlar',
    itemCategory: 'Texnika va Gadjetlar',
    clientName: 'Bobur Mirzayev',
    clientPhone: '+998 93 111 22 33',
    passportNumber: 'AA 5544332',
    startDate: '2026-09-28',
    endDate: '2026-09-29',
    daysCount: 1,
    dailyPrice: 130000,
    totalPrice: 130000,
    deposit: 400000,
    paymentMethod: 'Naqd',
    status: 'yakunlangan',
    note: 'O\'z vaqtida qaytarildi, hech qanday nuqsonsiz',
    createdAt: '2026-09-28T09:00:00'
  }
];

let itemsCache = null;
let bookingsCache = null;
let categoriesCache = null;

// Database Manager connected to Django REST Endpoints & Local Cache
const DB = {
  async fetchCategories() {
    try {
      const res = await fetch('/api/categories/');
      if (res.ok) {
        categoriesCache = await res.json();
        return categoriesCache;
      }
    } catch (e) {
      console.warn('API fetchCategories error:', e);
    }
    return INITIAL_CATEGORIES;
  },

  getCategoriesSync() {
    return categoriesCache || INITIAL_CATEGORIES;
  },

  async fetchItems(filters = {}) {
    try {
      let url = '/api/items/?';
      if (filters.category && filters.category !== 'all') url += `category=${encodeURIComponent(filters.category)}&`;
      if (filters.city && filters.city !== 'all') url += `city=${encodeURIComponent(filters.city)}&`;
      if (filters.search) url += `search=${encodeURIComponent(filters.search)}&`;
      if (filters.sort) url += `sort=${encodeURIComponent(filters.sort)}&`;
      if (filters.priceMin) url += `price_min=${encodeURIComponent(filters.priceMin)}&`;
      if (filters.priceMax) url += `price_max=${encodeURIComponent(filters.priceMax)}&`;
      if (filters.rooms) url += `rooms=${encodeURIComponent(filters.rooms)}&`;
      if (filters.page) url += `page=${filters.page}&`;
      if (filters.limit) url += `limit=${filters.limit}&`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        itemsCache = data.items || data;
        localStorage.setItem('top_ijara_items', JSON.stringify(itemsCache));
        return data; // returning full pagination object
      }
    } catch (e) {
      console.warn('API fetchItems error:', e);
    }
    const items = this.getItems();
    return { items, total_pages: 1, current_page: 1, total_items: items.length };
  },

  getItems() {
    if (itemsCache) return itemsCache;
    const data = localStorage.getItem('top_ijara_items');
    if (!data) {
      localStorage.setItem('top_ijara_items', JSON.stringify(INITIAL_ITEMS));
      itemsCache = INITIAL_ITEMS;
      return INITIAL_ITEMS;
    }
    itemsCache = JSON.parse(data);
    return itemsCache;
  },

  async saveItems(items) {
    itemsCache = items;
    localStorage.setItem('top_ijara_items', JSON.stringify(items));
  },

  async addItem(itemData) {
    try {
      const res = await fetch('/api/items/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      if (res.ok) {
        const newItem = await res.json();
        await this.fetchItems();
        return newItem;
      }
    } catch (e) {
      console.warn('API create item error:', e);
    }
    // Local fallback
    const items = this.getItems();
    itemData.id = 'item-' + Date.now();
    items.unshift(itemData);
    this.saveItems(items);
    return itemData;
  },

  async updateItem(itemId, itemData) {
    try {
      const res = await fetch(`/api/items/${itemId}/update/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      if (res.ok) {
        await this.fetchItems();
        return;
      }
    } catch (e) {
      console.warn('API update item error:', e);
    }
    const items = this.getItems();
    const idx = items.findIndex(i => i.id === itemId);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...itemData };
      this.saveItems(items);
    }
  },

  async deleteItem(itemId) {
    try {
      const res = await fetch(`/api/items/${itemId}/delete/`, { method: 'POST' });
      if (res.ok) {
        await this.fetchItems();
        return;
      }
    } catch (e) {
      console.warn('API delete item error:', e);
    }
    let items = this.getItems();
    items = items.filter(i => i.id !== itemId);
    this.saveItems(items);
  },

  async toggleTop(itemId) {
    try {
      const res = await fetch(`/api/items/${itemId}/toggle-top/`, { method: 'POST' });
      if (res.ok) {
        await this.fetchItems();
        return;
      }
    } catch (e) {
      console.warn('API toggleTop error:', e);
    }
    const items = this.getItems();
    const item = items.find(i => i.id === itemId);
    if (item) {
      item.isTop = !item.isTop;
      this.saveItems(items);
    }
  },

  async toggleAvailable(itemId) {
    try {
      const res = await fetch(`/api/items/${itemId}/toggle-available/`, { method: 'POST' });
      if (res.ok) {
        await this.fetchItems();
        return;
      }
    } catch (e) {
      console.warn('API toggleAvailable error:', e);
    }
    const items = this.getItems();
    const item = items.find(i => i.id === itemId);
    if (item) {
      item.isAvailable = !item.isAvailable;
      this.saveItems(items);
    }
  },

  async fetchBookings() {
    try {
      const res = await fetch('/api/bookings/');
      if (res.ok) {
        bookingsCache = await res.json();
        localStorage.setItem('top_ijara_bookings', JSON.stringify(bookingsCache));
        return bookingsCache;
      }
    } catch (e) {
      console.warn('API fetchBookings error:', e);
    }
    return this.getBookings();
  },

  getBookings() {
    if (bookingsCache) return bookingsCache;
    const data = localStorage.getItem('top_ijara_bookings');
    if (!data) {
      localStorage.setItem('top_ijara_bookings', JSON.stringify(INITIAL_BOOKINGS));
      bookingsCache = INITIAL_BOOKINGS;
      return INITIAL_BOOKINGS;
    }
    bookingsCache = JSON.parse(data);
    return bookingsCache;
  },

  async saveBookings(bookings) {
    bookingsCache = bookings;
    localStorage.setItem('top_ijara_bookings', JSON.stringify(bookings));
  },

  async addBooking(bookingData) {
    try {
      const res = await fetch('/api/bookings/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const responseData = await res.json();
      if (res.ok) {
        await this.fetchBookings();
        return { success: true, booking: responseData };
      } else {
        // Server conflict yoki boshqa xato
        return { success: false, error: responseData.error || 'Buyurtma saqlanmadi' };
      }
    } catch (e) {
      console.warn('API create booking error:', e);
      return { success: false, error: 'Serverga ulanishda xatolik yuz berdi' };
    }
  },

  async updateBookingStatus(bookingId, status) {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await this.fetchBookings();
        return;
      }
    } catch (e) {
      console.warn('API update booking status error:', e);
    }
    const bookings = this.getBookings();
    const b = bookings.find(x => x.id === bookingId);
    if (b) {
      b.status = status;
      this.saveBookings(bookings);
    }
  },

  async deleteBooking(bookingId) {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/delete/`, { method: 'POST' });
      if (res.ok) {
        await this.fetchBookings();
        return;
      }
    } catch (e) {
      console.warn('API delete booking error:', e);
    }
    let bookings = this.getBookings();
    bookings = bookings.filter(b => b.id !== bookingId);
    this.saveBookings(bookings);
  },

  getFavorites() {
    const data = localStorage.getItem('top_ijara_favorites');
    return data ? JSON.parse(data) : ['item-1', 'item-3'];
  },

  saveFavorites(favs) {
    localStorage.setItem('top_ijara_favorites', JSON.stringify(favs));
  },

  async resetToDefault() {
    try {
      const res = await fetch('/api/admin/reset-db/', { method: 'POST' });
      if (res.ok) {
        await this.fetchItems();
        await this.fetchBookings();
        await this.fetchCategories();
        localStorage.setItem('top_ijara_favorites', JSON.stringify(['item-1', 'item-3']));
        return;
      }
    } catch (e) {
      console.warn('API reset db error:', e);
    }
    localStorage.setItem('top_ijara_items', JSON.stringify(INITIAL_ITEMS));
    localStorage.setItem('top_ijara_bookings', JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem('top_ijara_favorites', JSON.stringify(['item-1', 'item-3']));
    itemsCache = INITIAL_ITEMS;
    bookingsCache = INITIAL_BOOKINGS;
  },

  getAdminCreds() {
    const defaultCreds = { login: 'Muhammadamin', password: 'MuhammadAmin2009' };
    const data = localStorage.getItem('top_ijara_admin_creds');
    if (!data) {
      localStorage.setItem('top_ijara_admin_creds', JSON.stringify(defaultCreds));
      return defaultCreds;
    }
    try {
      const parsed = JSON.parse(data);
      // Eski demo login/parol saqlanib qolgan bo'lsa yangisiga almashtirish
      if (parsed.login === 'admin' && parsed.password === 'admin777') {
        localStorage.setItem('top_ijara_admin_creds', JSON.stringify(defaultCreds));
        return defaultCreds;
      }
      return parsed;
    } catch (e) {
      localStorage.setItem('top_ijara_admin_creds', JSON.stringify(defaultCreds));
      return defaultCreds;
    }
  },

  saveAdminCreds(creds) {
    localStorage.setItem('top_ijara_admin_creds', JSON.stringify(creds));
  },

  isAdminLoggedIn() {
    return sessionStorage.getItem('top_ijara_admin_session') === 'true';
  },

  setAdminLoggedIn(status) {
    if (status) {
      sessionStorage.setItem('top_ijara_admin_session', 'true');
    } else {
      sessionStorage.removeItem('top_ijara_admin_session');
    }
  },

  // Auth Methods
  async checkAuth() {
    try {
      const res = await fetch('/api/auth/me/');
      if (res.ok) return await res.json();
    } catch(e) { console.warn(e); }
    return { authenticated: false };
  },
  
  async login(username, password) {
    const res = await fetch('/api/auth/login/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    });
    return res;
  },

  async register(username, password) {
    const res = await fetch('/api/auth/register/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    });
    return res;
  },

  async logout() {
    await fetch('/api/auth/logout/');
  },

  async fetchMyItems() {
    try {
      const res = await fetch('/api/items/my/');
      if (res.ok) return await res.json();
    } catch(e) { console.warn(e); }
    return [];
  },

  async fetchComments(itemId) {
    try {
      const res = await fetch(`/api/items/${itemId}/comments/`);
      if (res.ok) return await res.json();
    } catch(e) { console.warn(e); }
    return [];
  },

  async addComment(itemId, text, rating = 5) {
    const res = await fetch(`/api/items/${itemId}/comments/create/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, rating })
    });
    return res;
  },

  async fetchBookedDates(itemId) {
    try {
      const res = await fetch(`/api/items/${itemId}/booked-dates/`);
      if (res.ok) return await res.json();
    } catch(e) { console.warn(e); }
    return [];
  },

  async validatePromo(code) {
    try {
      const res = await fetch('/api/promo/validate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      return { ok: res.ok, ...data };
    } catch(e) {
      return { ok: false, valid: false, message: 'Serverga ulanishda xatolik yuz berdi' };
    }
  }
};

