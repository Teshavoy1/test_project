from .models import Category, RentalItem, Booking, Comment, CustomUser

INITIAL_CATEGORIES = [
    {'slug': 'all', 'name': 'Barcha Ijaralar', 'icon': 'grid', 'order': 1},
    {'slug': 'auto', 'name': 'Avtomobillar', 'icon': 'car', 'order': 2},
    {'slug': 'realty', 'name': "Ko'chmas Mulk", 'icon': 'home', 'order': 3},
    {'slug': 'tech', 'name': 'Texnika va Gadjetlar', 'icon': 'camera', 'order': 4},
]

INITIAL_ITEMS = [
    {
        'id': 'item-1',
        'title': 'BYD Song Plus Champion EV (2024)',
        'category': 'auto',
        'categoryName': 'Avtomobillar',
        'city': 'Toshkent',
        'district': 'Yunusobod',
        'pricePerDay': 550000,
        'deposit': 1500000,
        'rating': 4.95,
        'reviewsCount': 38,
        'isTop': True,
        'isAvailable': True,
        'image': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
        'images': [
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80'
        ],
        'specs': {
            'Yili': '2024',
            'Dvigatel': 'Elektr (605 km)',
            'Uzatma': 'Avtomat',
            'Konditsioner': 'Mavjud (Iqlim nazorati)',
            "O'rindiqlar": '5 kishilik',
            'Haydovchisiz': 'Mumkin'
        },
        'description': "Yangi BYD Song Plus Champion 2024. Ideal holatda, toza va xushbo'y salon. 605 km zaxiraga ega to'liq elektr krossover. Shahar bo'ylab yoki viloyatlarga sayohat uchun ajoyib tanlov. KASKO sug'urtasi mavjud.",
        'ownerName': 'Apex Car Rental',
        'ownerPhone': '+998 (90) 123-45-67',
        'views': 420
    },
    {
        'id': 'item-2',
        'title': 'Chevrolet Malibu 2 Premier 2.0 Turbo',
        'category': 'auto',
        'categoryName': 'Avtomobillar',
        'city': 'Toshkent',
        'district': 'Mirobod',
        'pricePerDay': 600000,
        'deposit': 2000000,
        'rating': 4.9,
        'reviewsCount': 52,
        'isTop': True,
        'isAvailable': True,
        'image': 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=80',
        'images': [
            'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80'
        ],
        'specs': {
            'Yili': '2023',
            'Dvigatel': '2.0L Turbo (253 o.k.)',
            'Uzatma': "Avtomat 9-pog'ona",
            'Yoqilg\'i': 'Benzin (Ai-95)',
            'Salon': 'Qora charm, lyuk',
            'Haydovchisiz': 'Mumkin'
        },
        'description': "Premium biznes klass Malibu 2. Yangi g'ildiraklar, to'liq tonirovka ruxsatnomasi mavjud. Mehmonlarni kutib olish, to'y marosimlari yoki biznes uchrashuvlar uchun eng zo'r variant.",
        'ownerName': 'Premium Motors Toshkent',
        'ownerPhone': '+998 (97) 777-88-99',
        'views': 680
    },
    {
        'id': 'item-3',
        'title': 'Toshkent City - Zamonaviy 3 Xonali Pentxaus',
        'category': 'realty',
        'categoryName': "Ko'chmas Mulk",
        'city': 'Toshkent',
        'district': 'Shayxontohur',
        'pricePerDay': 1200000,
        'deposit': 2500000,
        'rating': 4.98,
        'reviewsCount': 29,
        'isTop': True,
        'isAvailable': True,
        'image': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
        'images': [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
        ],
        'specs': {
            'Maydoni': '145 m²',
            'Xonalar soni': '3 xona',
            'Qavat': '18 / 22',
            'Internet': 'Tezkor Wi-Fi (500 Mbit/s)',
            'Jihozlar': "To'liq mebel va Smart TV",
            'Manzara': 'Park va favvoralar panoramasi'
        },
        'description': "Toshkent City majmuasida joylashgan lyuks apartament. Markaziy parkka va musiqali favvoraga ajoyib panorama. Barcha qulayliklar: italyan oshxona mebellari, smart uy tizimi, 24/7 qo'riqlash va yer osti avtoturargohi.",
        'ownerName': 'City Luxe Apartments',
        'ownerPhone': '+998 (99) 001-22-33',
        'views': 940
    },
    {
        'id': 'item-4',
        'title': "Amirsoy / Chimyon - Isitiladigan Hovuzli Tog' Dachasi",
        'category': 'realty',
        'categoryName': "Ko'chmas Mulk",
        'city': 'Toshkent viloyati',
        'district': "Bo'stonliq",
        'pricePerDay': 2200000,
        'deposit': 3000000,
        'rating': 4.93,
        'reviewsCount': 44,
        'isTop': True,
        'isAvailable': True,
        'image': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80',
        'images': [
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'
        ],
        'specs': {
            'Hovuz': 'Qishki isitiladigan (32°C) va Yozgi',
            "Sig'imi": '12-15 kishigacha',
            'Yotoqxonalar': '4 ta yotoqxona',
            "Ko'ngilochar": 'PlayStation 5, Bilyard, Karaoke',
            'Sauna': 'Fin saunasi mavjud',
            'Mangal': "Mangal zona, o'choq-qozon"
        },
        'description': "Oila va do'stlar bilan toza tog' havosida unutilmas dam olish maskani. Isitiladigan yopiq hovuz, qulay bilyard zali, kuchli akustik karaoke tizimi. Tog'larning betakror manzarasi.",
        'ownerName': 'Mountain Villa Resort',
        'ownerPhone': '+998 (91) 333-44-55',
        'views': 1200
    },
    {
        'id': 'item-5',
        'title': 'DJI Mini 4 Pro Drone + Fly More Combo (Professional)',
        'category': 'tech',
        'categoryName': 'Texnika va Gadjetlar',
        'city': 'Toshkent',
        'district': 'Chilonzor',
        'pricePerDay': 250000,
        'deposit': 1000000,
        'rating': 4.88,
        'reviewsCount': 19,
        'isTop': False,
        'isAvailable': True,
        'image': 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80',
        'images': [
            'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80'
        ],
        'specs': {
            'Kamera': '4K HDR / 60fps, 48MP',
            'Batareya': '3 ta akkumulyator (100+ daqiqa)',
            'Masofa': '20 km uzatish',
            "Og'irligi": '249 gramm (Ultra yengil)',
            'Komplekt': 'Pult ekranli (RC 2), sumka, filtrlar'
        },
        'description': "Klip, to'y, sayohat va reklama roliklarini suratga olish uchun eng yangi DJI droni. 4K sifat, vertikal video olish (Instagram Reels/TikTok uchun mos). RC 2 ekranli pulti bilan taqdim etiladi.",
        'ownerName': 'VideoPro Rent',
        'ownerPhone': '+998 (93) 555-11-22',
        'views': 310
    },
    {
        'id': 'item-6',
        'title': "Sony PlayStation 5 + 4 Pult + 20 ta Yangi O'yinlar",
        'category': 'tech',
        'categoryName': 'Texnika va Gadjetlar',
        'city': 'Toshkent',
        'district': 'Yakkasaroy',
        'pricePerDay': 130000,
        'deposit': 400000,
        'rating': 4.96,
        'reviewsCount': 67,
        'isTop': True,
        'isAvailable': True,
        'image': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
        'images': [
            'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80'
        ],
        'specs': {
            'Versiya': 'PS5 Disc Edition (Oq)',
            'Pultlar': '4 ta original DualSense',
            "O'yinlar": 'FC 25, Mortal Kombat 1, UFC 5, GTA 5, Spider-Man 2',
            'Yetkazib berish': 'Shaharning istalgan nuqtasiga'
        },
        'description': "Do'stlar va oila davrasida qiziqarli oqshom o'tkazish uchun to'liq to'plam. Eng so'nggi yangi o'yinlar yuklangan. Uyga yetkazib berish va o'rnatib berish xizmati mavjud.",
        'ownerName': 'GameZone Rent',
        'ownerPhone': '+998 (95) 144-88-00',
        'views': 590
    },
    {
        'id': 'item-7',
        'title': 'Chevrolet Tracker 2 Premier Redline (2024)',
        'category': 'auto',
        'categoryName': 'Avtomobillar',
        'city': 'Samarqand',
        'district': 'Markaz',
        'pricePerDay': 420000,
        'deposit': 1200000,
        'rating': 4.87,
        'reviewsCount': 22,
        'isTop': False,
        'isAvailable': True,
        'image': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
        'images': [
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80'
        ],
        'specs': {
            'Yili': '2024',
            'Dvigatel': '1.2 Turbo',
            'Uzatma': 'Avtomat',
            'Yoqilg\'i': 'Benzin',
            'Panoramik lyuk': 'Mavjud',
            'Haydovchisiz': 'Mumkin'
        },
        'description': "Samarqand shahrida qulay va zamonaviy krossover ijarasi. Sayyohlar va shahar mehmonlari uchun qulay shartlar. Aeroport yoki vokzaldan kutib olish imkoniyati.",
        'ownerName': 'Samarkand Car Drive',
        'ownerPhone': '+998 (66) 234-56-78',
        'views': 290
    },
    {
        'id': 'item-8',
        'title': "Kärcher Professional Bug' Tozalagich & Pilesos",
        'category': 'tech',
        'categoryName': 'Texnika va Gadjetlar',
        'city': 'Toshkent',
        'district': "Mirzo Ulug'bek",
        'pricePerDay': 180000,
        'deposit': 300000,
        'rating': 4.79,
        'reviewsCount': 16,
        'isTop': False,
        'isAvailable': True,
        'image': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80',
        'images': [
            'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80'
        ],
        'specs': {
            'Model': 'Kärcher Puzzi 10/1 + SG 4/4',
            'Vazifasi': 'Mebel, gilam va avtosalon ximchistkasi',
            'Kimyoviy vosita': "2 dona original planshet sovg'a",
            "Yo'riqnoma": 'Batafsil video tushuntirish'
        },
        'description': "Uyingizdagi divan, kreslo, gilam va mashina salonini professional darajada yangidek tozalang. Ishlatish juda oson. Komplektda barcha kerakli nasadkalar bor.",
        'ownerName': 'CleanTech Tashkent',
        'ownerPhone': '+998 (90) 808-11-22',
        'views': 215
    },
    {
        'id': 'item-9',
        'title': "Zamonaviy Ofis Maydoni - Mirzo Ulug'bek Biznes Markazi",
        'category': 'realty',
        'categoryName': "Ko'chmas Mulk",
        'city': 'Toshkent',
        'district': "Mirzo Ulug'bek",
        'pricePerDay': 800000,
        'deposit': 1500000,
        'rating': 4.91,
        'reviewsCount': 11,
        'isTop': False,
        'isAvailable': True,
        'image': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
        'images': [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80'
        ],
        'specs': {
            'Maydon': '90 m²',
            'Xodimlar': '10-15 kishilik joy',
            'Jihozlar': 'Stol-stullar, proyektor, doska',
            'Oshxona': 'Kofe mashinasi, muzlatgich',
            'Konferens-zal': 'Mavjud'
        },
        'description': "Kompaniyalar, startaplar yoki seminar-treninglar uchun to'liq jihozlangan zamonaviy ofis. Yuqori tezlikdagi optik internet, konditsionerlar, qulay lokatsiya.",
        'ownerName': 'Hub Business Center',
        'ownerPhone': '+998 (71) 200-00-11',
        'views': 340
    },
    {
        'id': 'item-10',
        'title': 'Kia K5 GT-Line (2024 Qora Sedani)',
        'category': 'auto',
        'categoryName': 'Avtomobillar',
        'city': 'Toshkent',
        'district': 'Sergeli',
        'pricePerDay': 580000,
        'deposit': 1800000,
        'rating': 4.92,
        'reviewsCount': 31,
        'isTop': True,
        'isAvailable': True,
        'image': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1000&q=80',
        'images': [
            'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1000&q=80'
        ],
        'specs': {
            'Yili': '2024',
            'Dvigatel': '2.5L Smartstream',
            'Komplektatsiya': 'GT-Line (Maksimal)',
            'Salon': 'Qizil sport charm',
            'Audio': 'Bose Premium akustika'
        },
        'description': "Sport va hashamat uyg'unligi. Yangi Kia K5 GT-Line. Shovqinsiz qulay yurish, moslashuvchan kruiz-kontrol, 360 daraja kamera va panoramik tom.",
        'ownerName': 'DrivePro Car Rental',
        'ownerPhone': '+998 (90) 999-55-44',
        'views': 510
    }
]

INITIAL_BOOKINGS = [
    {
        'id': 'ORD-8941',
        'itemId': 'item-1',
        'itemTitle': 'BYD Song Plus Champion EV (2024)',
        'itemCategory': 'Avtomobillar',
        'clientName': 'Alisher Qodirov',
        'clientPhone': '+998 90 912 34 56',
        'passportNumber': 'AB 1234567',
        'startDate': '2026-09-30',
        'endDate': '2026-10-03',
        'daysCount': 3,
        'dailyPrice': 550000,
        'totalPrice': 1650000,
        'deposit': 1500000,
        'paymentMethod': 'Payme',
        'status': 'tasdiqlangan',
        'note': "Aeroportdan yetkazib berish so'ralgan"
    },
    {
        'id': 'ORD-8938',
        'itemId': 'item-3',
        'itemTitle': 'Toshkent City - Zamonaviy 3 Xonali Pentxaus',
        'itemCategory': "Ko'chmas Mulk",
        'clientName': 'Sardorbek Umarov',
        'clientPhone': '+998 97 456 78 90',
        'passportNumber': 'AC 9876543',
        'startDate': '2026-10-01',
        'endDate': '2026-10-05',
        'daysCount': 4,
        'dailyPrice': 1200000,
        'totalPrice': 4800000,
        'deposit': 2500000,
        'paymentMethod': 'Click',
        'status': 'kutilmoqda',
        'note': 'Oilaviy mehmonlar bilan dam olish uchun'
    },
    {
        'id': 'ORD-8920',
        'itemId': 'item-6',
        'itemTitle': "Sony PlayStation 5 + 4 Pult + 20 ta Yangi O'yinlar",
        'itemCategory': 'Texnika va Gadjetlar',
        'clientName': 'Bobur Mirzayev',
        'clientPhone': '+998 93 111 22 33',
        'passportNumber': 'AA 5544332',
        'startDate': '2026-09-28',
        'endDate': '2026-09-29',
        'daysCount': 1,
        'dailyPrice': 130000,
        'totalPrice': 130000,
        'deposit': 400000,
        'paymentMethod': 'Naqd',
        'status': 'yakunlangan',
        'note': "O'z vaqtida qaytarildi, hech qanday nuqsonsiz"
    }
]

def seed_database(force=False):
    if force:
        Booking.objects.all().delete()
        RentalItem.objects.all().delete()
        Category.objects.all().delete()

    cat_map = {}
    for cat in INITIAL_CATEGORIES:
        obj, created = Category.objects.get_or_create(
            slug=cat['slug'],
            defaults={
                'name': cat['name'],
                'icon': cat['icon'],
                'order': cat['order']
            }
        )
        cat_map[cat['slug']] = obj

    item_map = {}
    for item in INITIAL_ITEMS:
        cat_obj = cat_map.get(item['category'])
        if not cat_obj:
            cat_obj = cat_map.get('all')
            
        obj, created = RentalItem.objects.get_or_create(
            item_id=item['id'],
            defaults={
                'title': item['title'],
                'category': cat_obj,
                'category_name': item['categoryName'],
                'city': item['city'],
                'district': item['district'],
                'price_per_day': item['pricePerDay'],
                'deposit': item['deposit'],
                'rating': item['rating'],
                'reviews_count': item['reviewsCount'],
                'is_top': item['isTop'],
                'is_available': item['isAvailable'],
                'image': item['image'],
                'images': item['images'],
                'specs': item['specs'],
                'description': item['description'],
                'owner_name': item['ownerName'],
                'owner_phone': item['ownerPhone'],
                'views': item['views']
            }
        )
        item_map[item['id']] = obj

    for b in INITIAL_BOOKINGS:
        item_obj = item_map.get(b['itemId'])
        Booking.objects.get_or_create(
            booking_id=b['id'],
            defaults={
                'item': item_obj,
                'item_title': b['itemTitle'],
                'item_category': b['itemCategory'],
                'client_name': b['clientName'],
                'client_phone': b['clientPhone'],
                'passport_number': b['passportNumber'],
                'start_date': b['startDate'],
                'end_date': b['endDate'],
                'days_count': b['daysCount'],
                'daily_price': b['dailyPrice'],
                'total_price': b['totalPrice'],
                'deposit': b['deposit'],
                'payment_method': b['paymentMethod'],
                'status': b['status'],
                'note': b['note']
            }
        )

    demo_user, created1 = CustomUser.objects.get_or_create(username='mijoz1', defaults={'first_name': 'Jasur', 'last_name': 'Aliyev'})
    if created1:
        demo_user.set_password('123456')
        demo_user.save()

    demo_user2, created2 = CustomUser.objects.get_or_create(username='mijoz2', defaults={'first_name': 'Malika', 'last_name': 'Oripova'})
    if created2:
        demo_user2.set_password('123456')
        demo_user2.save()

    admin_user, created_admin = CustomUser.objects.get_or_create(username='admin', defaults={'is_staff': True, 'is_superuser': True})
    if created_admin:
        admin_user.set_password('admin777')
        admin_user.save()

    if Comment.objects.count() == 0:
        for item_id, obj in item_map.items():
            Comment.objects.create(
                item=obj,
                user=demo_user,
                text="Ajoyib xizmat! Mahsulot judayam toza va tavsifga to'liq mos keladi.",
                rating=5
            )
            Comment.objects.create(
                item=obj,
                user=demo_user2,
                text="Juda ham mamnun qoldim. Egasi ham muomalali inson ekan, tavsiya qilaman!",
                rating=5
            )

