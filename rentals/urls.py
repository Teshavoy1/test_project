from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_view, name='index'),
    path('login/', views.login_page, name='login_page'),
    path('register/', views.register_page, name='register_page'),
    path('item/<str:item_id>/', views.item_detail_page, name='item_detail_page'),
    path('api/categories/', views.get_categories, name='api_categories'),
    path('api/auth/login/', views.auth_login, name='api_auth_login'),
    path('api/auth/register/', views.auth_register, name='api_auth_register'),
    path('api/auth/logout/', views.auth_logout, name='api_auth_logout'),
    path('api/auth/me/', views.auth_me, name='api_auth_me'),

    path('api/items/', views.get_items, name='api_items'),
    path('api/items/my/', views.get_my_items, name='api_my_items'),
    path('api/items/create/', views.create_item, name='api_create_item'),
    path('api/items/<str:item_id>/', views.get_item_detail, name='api_item_detail'),
    path('api/items/<str:item_id>/booked-dates/', views.get_booked_dates, name='api_booked_dates'),
    path('api/promo/validate/', views.validate_promo, name='api_validate_promo'),
    path('api/items/<str:item_id>/comments/', views.get_comments, name='api_get_comments'),
    path('api/items/<str:item_id>/comments/create/', views.create_comment, name='api_create_comment'),
    path('api/items/<str:item_id>/update/', views.update_item, name='api_update_item'),
    path('api/items/<str:item_id>/delete/', views.delete_item, name='api_delete_item'),
    path('api/items/<str:item_id>/toggle-top/', views.toggle_item_top, name='api_toggle_item_top'),
    path('api/items/<str:item_id>/toggle-available/', views.toggle_item_available, name='api_toggle_item_available'),
    
    path('api/bookings/', views.get_bookings, name='api_bookings'),
    path('api/bookings/create/', views.create_booking, name='api_create_booking'),
    path('api/bookings/<str:booking_id>/status/', views.update_booking_status, name='api_update_booking_status'),
    path('api/bookings/<str:booking_id>/delete/', views.delete_booking, name='api_delete_booking'),
    
    path('api/admin/stats/', views.get_admin_stats, name='api_admin_stats'),
    path('api/admin/reset-db/', views.reset_db, name='api_admin_reset_db'),
    path('api/admin/export-json/', views.export_json, name='api_admin_export_json'),
    path('api/admin/import-json/', views.import_json, name='api_admin_import_json'),
]
