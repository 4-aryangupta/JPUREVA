import secrets
import uuid

from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


def generate_public_id() -> str:
    """Short URL-safe id used in public QR links, e.g. batch scan URLs."""
    return secrets.token_urlsafe(8)


class UUIDPublicIdModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    public_id = models.CharField(
        max_length=16, unique=True, default=generate_public_id, editable=False
    )

    class Meta:
        abstract = True
