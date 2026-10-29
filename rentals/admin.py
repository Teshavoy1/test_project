import json
from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Category, RentalItem, Booking, CustomUser, Comment

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    pass



@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('slug', 'name', 'icon', 'order')
    prepopulated_fields = {'slug': ('name',)}


class RentalItemForm(forms.ModelForm):
    images = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}),
        required=False,
        help_text="Rasm URL manzillarini oddiy matn, yangi qatordan yoki JSON ko'rinishida yozishingiz mumkin."
    )
    specs = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}),
        required=False,
        help_text="JSON ko'rinishida yoki Kalit: Qiymat formatida yozishingiz mumkin."
    )

    class Meta:
        model = RentalItem
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            if isinstance(self.instance.images, (list, dict)):
                self.initial['images'] = json.dumps(self.instance.images, ensure_ascii=False, indent=2)
            if isinstance(self.instance.specs, (list, dict)):
                self.initial['specs'] = json.dumps(self.instance.specs, ensure_ascii=False, indent=2)

    def clean_images(self):
        data = self.cleaned_data.get('images')
        if not data:
            return []
        if isinstance(data, list):
            return data
        if isinstance(data, str):
            data = data.strip()
            if not data:
                return []
            try:
                parsed = json.loads(data)
                if isinstance(parsed, list):
                    return parsed
                elif isinstance(parsed, str):
                    return [parsed]
            except Exception:
                pass

            cleaned = []
            for line in data.splitlines():
                line = line.strip()
                for char in ['[', ']', '"', "'"]:
                    line = line.strip(char)
                for part in line.split(','):
                    url = part.strip().strip('[]"\'')
                    if url:
                        cleaned.append(url)
            return cleaned
        return []

    def clean_specs(self):
        data = self.cleaned_data.get('specs')
        if not data:
            return {}
        if isinstance(data, dict):
            return data
        if isinstance(data, str):
            data = data.strip()
            if not data:
                return {}
            try:
                parsed = json.loads(data)
                if isinstance(parsed, dict):
                    return parsed
            except Exception:
                pass
            res = {}
            for line in data.splitlines():
                if ':' in line:
                    k, v = line.split(':', 1)
                    res[k.strip()] = v.strip()
            return res
        return {}


@admin.register(RentalItem)
class RentalItemAdmin(admin.ModelAdmin):
    form = RentalItemForm
    list_display = ('item_id', 'title', 'category', 'city', 'price_per_day', 'deposit', 'is_top', 'is_available', 'views')
    list_filter = ('category', 'city', 'is_top', 'is_available')
    search_fields = ('title', 'owner_name', 'owner_phone', 'city', 'district')
    list_editable = ('is_top', 'is_available')
    fields = ('item_id', 'user', 'title', 'category', 'city', 'district', 'price_per_day', 'deposit', 'image', 'images', 'specs', 'description', 'owner_name', 'owner_phone', 'is_top', 'is_available')

    def save_model(self, request, obj, form, change):
        if not obj.user_id and request.user.is_authenticated:
            obj.user = request.user
        if not obj.owner_name and obj.user:
            obj.owner_name = obj.user.get_full_name() or obj.user.username
        super().save_model(request, obj, form, change)


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_id', 'client_name', 'client_phone', 'item_title', 'start_date', 'end_date', 'total_price', 'status', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('booking_id', 'client_name', 'client_phone', 'item_title')
    list_editable = ('status',)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'item', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('text', 'user__username', 'item__title')


