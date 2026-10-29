import json
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, Sum, Count
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.core.paginator import Paginator
from datetime import datetime
from .models import Category, RentalItem, Booking, Comment
from .seed import seed_database
from .telegram_bot import send_booking_telegram_notification

User = get_user_model()

def index_view(request):
    # Ensure database is seeded on first load
    if Category.objects.count() == 0:
        seed_database()
    return render(request, 'index.html')

def login_page(request):
    return render(request, 'login.html')

def register_page(request):
    return render(request, 'register.html')

def item_detail_page(request, item_id):
    return render(request, 'item_detail.html', {'item_id': item_id})

def get_categories(request):
    if Category.objects.count() == 0:
        seed_database()

    categories = list(Category.objects.values('slug', 'name', 'icon', 'order'))
    total_count = RentalItem.objects.count()

    result = []
    for cat in categories:
        if cat['slug'] == 'all':
            count = total_count
        else:
            count = RentalItem.objects.filter(category_id=cat['slug']).count()
        result.append({
            'id': cat['slug'],
            'name': cat['name'],
            'icon': cat['icon'],
            'count': count
        })
    return JsonResponse(result, safe=False)

def get_items(request):
    if RentalItem.objects.count() == 0:
        seed_database()

    qs = RentalItem.objects.all()

    category = request.GET.get('category', 'all')
    if category and category != 'all':
        qs = qs.filter(category_id=category)

    city = request.GET.get('city', 'all')
    if city and city != 'all':
        qs = qs.filter(city__iexact=city)
        
    price_min = request.GET.get('price_min')
    if price_min and price_min.isdigit():
        qs = qs.filter(price_per_day__gte=int(price_min))
        
    price_max = request.GET.get('price_max')
    if price_max and price_max.isdigit():
        qs = qs.filter(price_per_day__lte=int(price_max))
        
    rooms = request.GET.get('rooms')
    if rooms:
        # Since specs is a JSONField, we can query it this way (works in SQLite JSON1):
        qs = qs.filter(specs__icontains=rooms)

    search = request.GET.get('search', '').strip()
    if search:
        qs = qs.filter(
            Q(title__icontains=search) |
            Q(description__icontains=search) |
            Q(city__icontains=search) |
            Q(district__icontains=search) |
            Q(owner_name__icontains=search)
        )

    sort = request.GET.get('sort', 'popular')
    if sort == 'price-asc':
        qs = qs.order_by('price_per_day')
    elif sort == 'price-desc':
        qs = qs.order_by('-price_per_day')
    elif sort == 'rating':
        qs = qs.order_by('-rating')
    else: # popular / top
        qs = qs.order_by('-is_top', '-rating', '-views', '-created_at')

    # Pagination
    page_number = request.GET.get('page', 1)
    limit = request.GET.get('limit', 12)
    paginator = Paginator(qs, limit)
    
    try:
        page_obj = paginator.page(page_number)
    except:
        page_obj = paginator.page(1)

    items = [item.to_dict() for item in page_obj.object_list]
    return JsonResponse({
        'items': items,
        'total_pages': paginator.num_pages,
        'current_page': page_obj.number,
        'total_items': paginator.count
    }, safe=False)

def get_my_items(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    qs = RentalItem.objects.filter(user=request.user).order_by('-created_at')
    items = [item.to_dict() for item in qs]
    return JsonResponse(items, safe=False)


def get_item_detail(request, item_id):
    try:
        item = RentalItem.objects.get(item_id=item_id)
        item.views += 1
        item.save(update_fields=['views'])
        return JsonResponse(item.to_dict())
    except RentalItem.DoesNotExist:
        return JsonResponse({'error': 'Item not found'}, status=404)

def get_comments(request, item_id):
    try:
        item = RentalItem.objects.get(item_id=item_id)
        comments = [c.to_dict() for c in item.comments.all()]
        return JsonResponse(comments, safe=False)
    except RentalItem.DoesNotExist:
        return JsonResponse({'error': 'Mahsulot topilmadi'}, status=404)

@csrf_exempt
def create_comment(request, item_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Kamentariya qoldirish uchun tizimga kirish yoki ro\'yxatdan o\'tish shart!'}, status=401)

    try:
        item = RentalItem.objects.get(item_id=item_id)
        data = json.loads(request.body)
        text = data.get('text', '').strip()
        rating = int(data.get('rating', 5))

        if not text:
            return JsonResponse({'error': 'Kamentariya matni bo\'sh bo\'lishi mumkin emas'}, status=400)

        comment = Comment.objects.create(
            item=item,
            user=request.user,
            text=text,
            rating=rating
        )

        count = item.comments.count()
        item.reviews_count = count
        all_ratings = item.comments.values_list('rating', flat=True)
        if all_ratings:
            item.rating = round(sum(all_ratings) / len(all_ratings), 1)
        item.save(update_fields=['reviews_count', 'rating'])

        return JsonResponse(comment.to_dict(), status=201)
    except RentalItem.DoesNotExist:
        return JsonResponse({'error': 'Mahsulot topilmadi'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def create_item(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Faqat ro\'yxatdan o\'tgan foydalanuvchilar e\'lon qo\'sha oladi!'}, status=401)

    try:
        data = json.loads(request.body)
        cat_slug = data.get('category', 'tech')
        category_obj, _ = Category.objects.get_or_create(
            slug=cat_slug,
            defaults={'name': data.get('categoryName', cat_slug), 'icon': 'grid'}
        )

        item = RentalItem.objects.create(
            user=request.user,
            title=data.get('title', ''),
            category=category_obj,
            category_name=data.get('categoryName', category_obj.name),
            city=data.get('city', 'Toshkent'),
            district=data.get('district', ''),
            price_per_day=int(data.get('pricePerDay', 0)),
            deposit=int(data.get('deposit', 0)),
            rating=float(data.get('rating', 5.0)),
            reviews_count=int(data.get('reviewsCount', 0)),
            is_top=bool(data.get('isTop', False)),
            is_available=bool(data.get('isAvailable', True)),
            image=data.get('image', ''),
            images=data.get('images', [data.get('image', '')]),
            specs=data.get('specs', {}),
            description=data.get('description', ''),
            owner_name=data.get('ownerName', request.user.username),
            owner_phone=data.get('ownerPhone', '')
        )
        return JsonResponse(item.to_dict(), status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def auth_login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True, 'user': {'username': user.username}})
        else:
            return JsonResponse({'error': 'Login yoki parol noto\'g\'ri'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def auth_register(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Bu login band'}, status=400)
            
        user = User.objects.create_user(username=username, password=password)
        login(request, user)
        return JsonResponse({'success': True, 'user': {'username': user.username}})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def auth_logout(request):
    logout(request)
    return JsonResponse({'success': True})

def auth_me(request):
    if request.user.is_authenticated:
        return JsonResponse({'authenticated': True, 'user': {'username': request.user.username}})
    return JsonResponse({'authenticated': False})

@csrf_exempt
def update_item(request, item_id):
    if request.method not in ['PUT', 'POST']:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        item = RentalItem.objects.get(item_id=item_id)
        data = json.loads(request.body)

        if 'category' in data:
            cat_obj, _ = Category.objects.get_or_create(slug=data['category'], defaults={'name': data['category']})
            item.category = cat_obj
            item.category_name = data.get('categoryName', cat_obj.name)

        if 'title' in data: item.title = data['title']
        if 'city' in data: item.city = data['city']
        if 'district' in data: item.district = data['district']
        if 'pricePerDay' in data: item.price_per_day = int(data['pricePerDay'])
        if 'deposit' in data: item.deposit = int(data['deposit'])
        if 'image' in data: item.image = data['image']
        if 'images' in data: item.images = data['images']
        if 'specs' in data: item.specs = data['specs']
        if 'description' in data: item.description = data['description']
        if 'ownerName' in data: item.owner_name = data['ownerName']
        if 'ownerPhone' in data: item.owner_phone = data['ownerPhone']
        if 'isTop' in data: item.is_top = bool(data['isTop'])
        if 'isAvailable' in data: item.is_available = bool(data['isAvailable'])

        item.save()
        return JsonResponse(item.to_dict())
    except RentalItem.DoesNotExist:
        return JsonResponse({'error': 'Item not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def delete_item(request, item_id):
    if request.method not in ['DELETE', 'POST']:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        item = RentalItem.objects.get(item_id=item_id)
        item.delete()
        return JsonResponse({'success': True, 'id': item_id})
    except RentalItem.DoesNotExist:
        return JsonResponse({'error': 'Item not found'}, status=404)

@csrf_exempt
def toggle_item_top(request, item_id):
    try:
        item = RentalItem.objects.get(item_id=item_id)
        item.is_top = not item.is_top
        item.save(update_fields=['is_top'])
        return JsonResponse({'success': True, 'isTop': item.is_top})
    except RentalItem.DoesNotExist:
        return JsonResponse({'error': 'Item not found'}, status=404)

@csrf_exempt
def toggle_item_available(request, item_id):
    try:
        item = RentalItem.objects.get(item_id=item_id)
        item.is_available = not item.is_available
        item.save(update_fields=['is_available'])
        return JsonResponse({'success': True, 'isAvailable': item.is_available})
    except RentalItem.DoesNotExist:
        return JsonResponse({'error': 'Item not found'}, status=404)

def get_bookings(request):
    if Booking.objects.count() == 0:
        seed_database()
    bookings = [b.to_dict() for b in Booking.objects.all()]
    return JsonResponse(bookings, safe=False)

PROMO_CODES = {
    'TOP10': 10,
    'BARAKA': 10,
    'IJARA20': 20,
    'START5': 5,
}

@csrf_exempt
def validate_promo(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    try:
        data = json.loads(request.body)
        code = data.get('code', '').strip().upper()
        if code in PROMO_CODES:
            percent = PROMO_CODES[code]
            return JsonResponse({'valid': True, 'percent': percent, 'message': f"{percent}% chegirma qo'llanildi!"})
        return JsonResponse({'valid': False, 'message': "Bunday promokod mavjud emas yoki muddati tugagan!"}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def get_booked_dates(request, item_id):
    try:
        item = RentalItem.objects.get(item_id=item_id)
        from django.utils import timezone
        today = timezone.now().date()
        bookings = Booking.objects.filter(
            item=item,
            status__in=['kutilmoqda', 'tasdiqlangan'],
            end_date__gte=today
        ).order_by('start_date')

        booked_ranges = []
        for b in bookings:
            booked_ranges.append({
                'startDate': b.start_date.strftime('%Y-%m-%d'),
                'endDate': b.end_date.strftime('%Y-%m-%d'),
                'status': b.status,
                'client': b.client_name[:2] + '***' if b.client_name else 'Mijoz'
            })
        return JsonResponse(booked_ranges, safe=False)
    except RentalItem.DoesNotExist:
        return JsonResponse({'error': 'Item not found'}, status=404)

@csrf_exempt
def create_booking(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body)
        item_obj = None
        if data.get('itemId'):
            try:
                item_obj = RentalItem.objects.get(item_id=data['itemId'])
            except RentalItem.DoesNotExist:
                pass

        start_str = data.get('startDate')
        end_str = data.get('endDate')
        if not start_str or not end_str:
            return JsonResponse({'error': 'Ijara sanalari to\'liq tanlanmagan!'}, status=400)

        start_date = datetime.strptime(start_str, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_str, '%Y-%m-%d').date()

        if end_date < start_date:
            return JsonResponse({'error': 'Qaytarish sanasi boshlanish sanasidan oldin bo\'lishi mumkin emas!'}, status=400)

        # Sanalar to'qnashuvi (Conflict / Overbooking check)
        if item_obj:
            conflicts = Booking.objects.filter(
                item=item_obj,
                status__in=['kutilmoqda', 'tasdiqlangan'],
                start_date__lte=end_date,
                end_date__gte=start_date
            )
            if conflicts.exists():
                return JsonResponse({
                    'error': 'Kechirasiz! Ushbu sanalarda mahsulot allaqachon band qilingan. Iltimos, boshqa sanalarni tanlang.'
                }, status=400)

        days_count = max(1, (end_date - start_date).days)
        daily_price = int(data.get('dailyPrice', item_obj.price_per_day if item_obj else 0))
        base_rent = daily_price * days_count

        # Muddatli chegirma: 3-6 kun -> 5%, 7+ kun -> 15%
        duration_discount_pct = 0
        if days_count >= 7:
            duration_discount_pct = 15
        elif days_count >= 3:
            duration_discount_pct = 5

        # Promokod tekshiruvi
        promo_code = data.get('promoCode', '').strip().upper()
        promo_discount_pct = PROMO_CODES.get(promo_code, 0)

        total_discount_pct = min(50, duration_discount_pct + promo_discount_pct)
        discount_amount = int(base_rent * total_discount_pct / 100)
        final_total = max(0, base_rent - discount_amount)
        deposit = int(data.get('deposit', item_obj.deposit if item_obj else 0))

        booking = Booking.objects.create(
            item=item_obj,
            item_title=data.get('itemTitle', item_obj.title if item_obj else 'Ijara Mahsulot'),
            item_category=data.get('itemCategory', item_obj.category_name if item_obj else ''),
            client_name=data.get('clientName', ''),
            client_phone=data.get('clientPhone', ''),
            passport_number=data.get('passportNumber', ''),
            start_date=start_date,
            end_date=end_date,
            days_count=days_count,
            daily_price=daily_price,
            total_price=final_total,
            deposit=deposit,
            discount_amount=discount_amount,
            promo_code=promo_code if promo_discount_pct > 0 else '',
            payment_method=data.get('paymentMethod', 'Payme'),
            status=data.get('status', 'kutilmoqda'),
            note=data.get('note', '')
        )

        # Telegram bot orqali bildirishnoma yuborish
        try:
            send_booking_telegram_notification(booking, item_obj)
        except Exception as e:
            print(f"[Telegram bildirishnoma xatosi]: {e}")

        return JsonResponse(booking.to_dict(), status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def update_booking_status(request, booking_id):
    if request.method not in ['PATCH', 'POST']:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        booking = Booking.objects.get(booking_id=booking_id)
        data = json.loads(request.body)
        if 'status' in data:
            booking.status = data['status']
            booking.save(update_fields=['status'])
        return JsonResponse(booking.to_dict())
    except Booking.DoesNotExist:
        return JsonResponse({'error': 'Booking not found'}, status=404)

@csrf_exempt
def delete_booking(request, booking_id):
    if request.method not in ['DELETE', 'POST']:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        booking = Booking.objects.get(booking_id=booking_id)
        booking.delete()
        return JsonResponse({'success': True, 'id': booking_id})
    except Booking.DoesNotExist:
        return JsonResponse({'error': 'Booking not found'}, status=404)

def get_admin_stats(request):
    total_items = RentalItem.objects.count()
    pending_bookings = Booking.objects.filter(status='kutilmoqda').count()
    active_bookings = Booking.objects.filter(status='tasdiqlangan').count()
    
    total_revenue_dict = Booking.objects.filter(status='yakunlangan').aggregate(total=Sum('total_price'))
    total_revenue = total_revenue_dict['total'] or 0

    return JsonResponse({
        'totalItems': total_items,
        'pendingBookings': pending_bookings,
        'activeBookings': active_bookings,
        'totalRevenue': total_revenue
    })

@csrf_exempt
def reset_db(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    seed_database(force=True)
    return JsonResponse({'success': True, 'message': 'Baza dastlabki holatga keltirildi'})

def export_json(request):
    items = [i.to_dict() for i in RentalItem.objects.all()]
    bookings = [b.to_dict() for b in Booking.objects.all()]
    data = {
        'items': items,
        'bookings': bookings
    }
    response = HttpResponse(json.dumps(data, indent=2, ensure_ascii=False), content_type='application/json')
    response['Content-Disposition'] = 'attachment; filename="top_ijara_backup.json"'
    return response

@csrf_exempt
def import_json(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body)
        items_data = data.get('items', [])
        bookings_data = data.get('bookings', [])

        if items_data:
            RentalItem.objects.all().delete()
            for item in items_data:
                cat_slug = item.get('category', 'tech')
                cat_obj, _ = Category.objects.get_or_create(slug=cat_slug, defaults={'name': item.get('categoryName', cat_slug)})
                RentalItem.objects.create(
                    item_id=item['id'],
                    title=item['title'],
                    category=cat_obj,
                    category_name=item.get('categoryName', cat_obj.name),
                    city=item['city'],
                    district=item.get('district', ''),
                    price_per_day=item['pricePerDay'],
                    deposit=item['deposit'],
                    rating=item.get('rating', 5.0),
                    reviews_count=item.get('reviewsCount', 0),
                    is_top=item.get('isTop', False),
                    is_available=item.get('isAvailable', True),
                    image=item.get('image', ''),
                    images=item.get('images', []),
                    specs=item.get('specs', {}),
                    description=item.get('description', ''),
                    owner_name=item.get('ownerName', ''),
                    owner_phone=item.get('ownerPhone', ''),
                    views=item.get('views', 0)
                )

        if bookings_data:
            Booking.objects.all().delete()
            for b in bookings_data:
                item_obj = RentalItem.objects.filter(item_id=b.get('itemId')).first()
                Booking.objects.create(
                    booking_id=b['id'],
                    item=item_obj,
                    item_title=b.get('itemTitle', ''),
                    item_category=b.get('itemCategory', ''),
                    client_name=b.get('clientName', ''),
                    client_phone=b.get('clientPhone', ''),
                    passport_number=b.get('passportNumber', ''),
                    start_date=b.get('startDate'),
                    end_date=b.get('endDate'),
                    days_count=b.get('daysCount', 1),
                    daily_price=b.get('dailyPrice', 0),
                    total_price=b.get('totalPrice', 0),
                    deposit=b.get('deposit', 0),
                    payment_method=b.get('paymentMethod', 'Payme'),
                    status=b.get('status', 'kutilmoqda'),
                    note=b.get('note', '')
                )

        return JsonResponse({'success': True, 'message': 'Ma\'lumotlar muvaffaqiyatli tiklandi'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
