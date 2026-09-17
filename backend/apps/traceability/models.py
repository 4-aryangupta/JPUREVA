from django.db import models

from apps.accounts.models import HotelProfile, User
from apps.core.models import TimeStampedModel
from apps.suppliers.models import Batch


class ColdChainLog(TimeStampedModel):
    class Stage(models.TextChoices):
        WAREHOUSE = "WAREHOUSE", "Warehouse"
        TRANSIT = "TRANSIT", "Transit"
        DELIVERY = "DELIVERY", "Delivery"

    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name="coldchain_logs")
    stage = models.CharField(max_length=15, choices=Stage.choices)
    location_name = models.CharField(max_length=200, blank=True)
    temperature_c = models.FloatField()
    humidity_pct = models.FloatField(null=True, blank=True)
    recorded_at = models.DateTimeField()
    recorded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="coldchain_logs")
    is_within_threshold = models.BooleanField(default=True)
    notes = models.CharField(max_length=255, blank=True)

    SAFE_MIN_C = 0.0
    SAFE_MAX_C = 8.0

    def save(self, *args, **kwargs):
        self.is_within_threshold = self.SAFE_MIN_C <= self.temperature_c <= self.SAFE_MAX_C
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["recorded_at"]

    def __str__(self):
        return f"{self.batch.public_id} - {self.stage} @ {self.temperature_c}C"


class TrustBadge(TimeStampedModel):
    """Hotel-level aggregate QR (distinct from the per-batch traceability QR)."""

    hotel = models.OneToOneField(HotelProfile, on_delete=models.CASCADE, related_name="trust_badge")
    public_slug = models.SlugField(max_length=40, unique=True)
    qr_image = models.ImageField(upload_to="trust_badges/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    regenerated_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"TrustBadge for {self.hotel.business_name}"
