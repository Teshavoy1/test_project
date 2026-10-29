import json
import urllib.request
import urllib.parse
from django.conf import settings

def send_booking_telegram_notification(booking, item=None):
    """
    Yangi buyurtma tushganda Telegram bot orqali adminga yoki guruhga xabar yuborish.
    Sozlamalar settings.py da:
    TELEGRAM_BOT_TOKEN = "..."
    TELEGRAM_ADMIN_CHAT_ID = "..."
    """
    bot_token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
    chat_id = getattr(settings, 'TELEGRAM_ADMIN_CHAT_ID', None)

    if not bot_token or not chat_id:
        print(f"[Telegram Bot] Token yoki Chat ID sozlanmagan. Buyurtma: {booking.booking_id}")
        return False

    title = booking.item_title or (item.title if item else "Ijara Mahsulot")
    category = booking.item_category or (item.category_name if item else "")
    
    discount_text = ""
    if booking.discount_amount and booking.discount_amount > 0:
        discount_text = f"\n🏷 <b>Chegirma:</b> -{booking.discount_amount:,} so'm"
        if booking.promo_code:
            discount_text += f" (Promokod: <code>{booking.promo_code}</code>)"

    message = (
        f"🌟 <b>YANGI IJARA BUYURTMASI!</b>\n\n"
        f"🆔 <b>Buyurtma kodi:</b> <code>#{booking.booking_id}</code>\n"
        f"📦 <b>Mahsulot:</b> {title} ({category})\n"
        f"👤 <b>Mijoz:</b> {booking.client_name}\n"
        f"📞 <b>Telefon:</b> <a href=\"tel:{booking.client_phone}\">{booking.client_phone}</a>\n"
        f"🪪 <b>Pasport / ID:</b> {booking.passport_number or 'Kiritilmagan'}\n"
        f"📅 <b>Muddat:</b> {booking.start_date} dan {booking.end_date} gacha ({booking.days_count} kun)\n"
        f"💰 <b>Kunlik narx:</b> {booking.daily_price:,} so'm\n"
        f"{discount_text}"
        f"💵 <b>Jami to'lov:</b> {booking.total_price:,} so'm\n"
        f"🔒 <b>Kafolat depoziti:</b> {booking.deposit:,} so'm\n"
        f"💳 <b>To'lov usuli:</b> {booking.payment_method}\n"
        f"📝 <b>Izoh:</b> {booking.note or 'Yo\'q'}\n\n"
        f"⚡ <i>TOP IJARA Platformasi avtomatik bildirishnomasi</i>"
    )

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        'chat_id': chat_id,
        'text': message,
        'parse_mode': 'HTML',
        'disable_web_page_preview': True
    }

    try:
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=5) as response:
            return response.status == 200
    except Exception as e:
        print(f"[Telegram Bot Xatosi]: {e}")
        return False
