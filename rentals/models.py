from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
import uuid

class CustomUser(AbstractUser):
    pass


class Category(models.Model):
    slug = models.CharField(max_length=50, primary_key=True, blank=True)
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50, default='grid')
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            from django.utils.text import slugify
            self.slug = slugify(self.name) or 'cat-1'
        super().save(*args, **kwargs)


class RentalItem(models.Model):
    item_id = models.CharField(max_length=50, unique=True, primary_key=True, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='rental_items', null=True, blank=True)
    title = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='items')
    category_name = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, default='Toshkent')
    district = models.CharField(max_length=100, blank=True)
    price_per_day = models.BigIntegerField(default=0)
    deposit = models.BigIntegerField(default=0)
    rating = models.FloatField(default=5.0)
    reviews_count = models.IntegerField(default=0)
    is_top = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    image = models.TextField(blank=True, default='')
    images = models.JSONField(default=list, blank=True)
    specs = models.JSONField(default=dict, blank=True)
    description = models.TextField(blank=True)
    owner_name = models.CharField(max_length=150, blank=True, default='')
    owner_phone = models.CharField(max_length=50, blank=True, default='')
    views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.item_id:
            self.item_id = f"item-{uuid.uuid4().hex[:8]}"
        if self.category and not self.category_name:
            self.category_name = self.category.name
        if not self.image and self.images and len(self.images) > 0:
            self.image = self.images[0]
        elif self.image and (not self.images or len(self.images) == 0):
            self.images = [self.image]
        super().save(*args, **kwargs)

    def to_dict(self):
        return {
            'id': self.item_id,
            'title': self.title,
            'category': self.category_id,
            'categoryName': self.category_name or (self.category.name if self.category else ''),
            'city': self.city,
            'district': self.district,
            'pricePerDay': self.price_per_day,
            'deposit': self.deposit,
            'rating': self.rating,
            'reviewsCount': self.reviews_count,
            'isTop': self.is_top,
            'isAvailable': self.is_available,
            'image': self.image,
            'images': self.images or ([self.image] if self.image else []),
            'specs': self.specs or {},
            'description': self.description,
            'ownerName': self.owner_name,
            'ownerPhone': self.owner_phone,
            'views': self.views,
            'createdAt': self.created_at.strftime('%Y-%m-%d') if self.created_at else ''
        }


class Booking(models.Model):
    STATUS_CHOICES = (
        ('kutilmoqda', 'Kutilmoqda'),
        ('tasdiqlangan', 'Tasdiqlangan'),
        ('yakunlangan', 'Yakunlangan'),
        ('bekor', 'Bekor qilingan'),
    )

    booking_id = models.CharField(max_length=50, unique=True, primary_key=True, blank=True)
    item = models.ForeignKey(RentalItem, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    item_title = models.CharField(max_length=255, blank=True)
    item_category = models.CharField(max_length=100, blank=True)
    client_name = models.CharField(max_length=150, blank=True)
    client_phone = models.CharField(max_length=50, blank=True)
    passport_number = models.CharField(max_length=50, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    days_count = models.IntegerField(default=1)
    daily_price = models.BigIntegerField(default=0)
    total_price = models.BigIntegerField(default=0)
    deposit = models.BigIntegerField(default=0)
    discount_amount = models.BigIntegerField(default=0)
    promo_code = models.CharField(max_length=50, blank=True, default='')
    payment_method = models.CharField(max_length=50, default='Payme')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='kutilmoqda')
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.booking_id} - {self.client_name}"

    def save(self, *args, **kwargs):
        if not self.booking_id:
            import random
            self.booking_id = f"ORD-{random.randint(1000, 9999)}"
        if self.item:
            if not self.item_title:
                self.item_title = self.item.title
            if not self.item_category:
                self.item_category = self.item.category_name
        super().save(*args, **kwargs)

    def to_dict(self):
        return {
            'id': self.booking_id,
            'itemId': self.item_id if self.item else '',
            'itemTitle': self.item_title,
            'itemCategory': self.item_category,
            'clientName': self.client_name,
            'clientPhone': self.client_phone,
            'passportNumber': self.passport_number,
            'startDate': self.start_date.strftime('%Y-%m-%d') if self.start_date else '',
            'endDate': self.end_date.strftime('%Y-%m-%d') if self.end_date else '',
            'daysCount': self.days_count,
            'dailyPrice': self.daily_price,
            'totalPrice': self.total_price,
            'deposit': self.deposit,
            'discountAmount': self.discount_amount,
            'promoCode': self.promo_code,
            'paymentMethod': self.payment_method,
            'status': self.status,
            'note': self.note,
            'createdAt': self.created_at.isoformat() if self.created_at else ''
        }


class Comment(models.Model):
    item = models.ForeignKey(RentalItem, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    rating = models.IntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Comment by {self.user.username} on {self.item.title}"

    def to_dict(self):
        return {
            'id': self.id,
            'itemId': self.item.item_id,
            'username': self.user.username,
            'text': self.text,
            'rating': self.rating,
            'createdAt': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else ''
        }

