# 🌟 TOP IJARA - Universal Ijara Platformasi & Admin Panel

O'zbekistondagi avtomobillar, elita ko'chmas mulk va zamonaviy texnikalarni ijaraga berish hamda olish uchun yaratilgan to'liq funksional veb-ilova.

---

## 🚀 Loyiha Imkoniyatlari

### 1. 👥 Mijozlar Qismi (Client View):
- **Universal Katalog**:
  - 🚗 **Avtomobillar** (BYD Song Plus, Malibu 2 Turbo, Kia K5, Tracker 2...)
  - 🏠 **Ko'chmas Mulk** (Toshkent City pentxausi, Amirsoy tog' dachasi, zamonaviy ofislar...)
  - ⚙️ **Texnika va Gadjetlar** (Sony PS5 to'plami, DJI Mini 4 Pro droni, Kärcher uskunalari...)
- **📅 Bandlik Kalendari (Availability Calendar)**: Har bir mahsulot sahifasida qaysi sanalar band ekanligini ko'rsatish va sanalar ustma-ust tushishining (double booking) oldini olish.
- **🏷️ Promokodlar & Muddatli Chegirmalar**:
  - 3-6 kunga: 5% avtomatik chegirma
  - 7+ kunga: 15% avtomatik chegirma
  - Promokodlar: `TOP10` (10%), `BARAKA` (10%), `IJARA20` (20%), `START5` (5%)
- **📄 Rasmiy Ijara Shartnomasi va Chek**: O'zbekiston Respublikasi Fuqarolik Kodeksi 535-moddasiga mos, bevosita chop etiladigan (Print/PDF) rasmiy shartnoma.
- **💬 Tezkor Aloqa Tugmalari**: E'lon egasiga to'g'ridan-to'g'ri Telegram orqali yozish yoki telefon orqali bog'lanish.
- **🤖 Telegram Bot Integratsiyasi**: Yangi buyurtma kelganda avtomatik Telegram bildirishnomasi.
- **Aqlli Qidiruv va Filterlar**: Kategoriya, shahar, narx va reyting bo'yicha tezkor saralash.
- **E'lon Joylashtirish & Sharhlar**: Ro'yxatdan o'tgan mijozlar e'lon qo'sha oladi va fikr-mulohaza (reviews) qoldira oladi.
- **Valyuta va Mavzu Almashtirgich**: UZS / USD hamda Qorong'i (Dark) / Yorug' (Light) mavzular.

---

### 2. 🤖 Telegram Botni Sozlash (Ixtiyoriy):
Yangi buyurtmalarni Telegram orqali qabul qilish uchun `config/settings.py` faylida quyidagi qatorlarni to'ldiring:
```python
TELEGRAM_BOT_TOKEN = '1234567890:ABCdefGhIJKlmNoPQRsTUVwxyZ' # @BotFather dan olingan token
TELEGRAM_ADMIN_CHAT_ID = '123456789'                         # Telegram ID yoki guruh/kanal ID
```

---

### 3. ⚡ To'liq Admin Panel (Boshqaruv):
Sayt yuqori o'ng burchagidagi **"Admin Panel"** tugmasi orqali to'g'ridan-to'g'ri ochiladi:
- 📊 **Dashboard (Statistika)**: Jami e'lonlar, kutilayotgan arizalar, faol ijaralar va jami tushum summasi.
- 📋 **E'lonlarni Boshqarish (CRUD)**: Tahrirlash, o'chirish, **VIP / TOP** maqomini boshqarish.
- 📦 **Buyurtmalar Nazorati**: Buyurtmalarni tasdiqlash (`tasdiqlangan`), yakunlash yoki bekor qilish.
- 💾 **Zaxira va Tiklash**: Ma'lumotlarni JSON export/import qilish.

---

## 💻 Qanday Ishga Tushiriladi?

Django serverini ishga tushirish:

```bash
python manage.py runserver
```

Brauzerda oching:
```
http://127.0.0.1:8000/
```

