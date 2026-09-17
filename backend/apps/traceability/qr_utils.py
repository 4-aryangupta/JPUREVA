from io import BytesIO

import qrcode
from django.conf import settings
from django.core.files.base import ContentFile


def generate_qr_file(url: str, filename: str) -> ContentFile:
    img = qrcode.make(url)
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    return ContentFile(buffer.getvalue(), name=filename)


def batch_scan_url(public_id: str) -> str:
    return f"{settings.FRONTEND_BASE_URL}/scan/{public_id}"


def hotel_trust_url(slug: str) -> str:
    return f"{settings.FRONTEND_BASE_URL}/trust/{slug}"
