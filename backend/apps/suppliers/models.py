from django.db import models

from apps.accounts.models import SupplierProfile
from apps.catalog.models import Ingredient
from apps.core.models import TimeStampedModel, UUIDPublicIdModel


class Batch(UUIDPublicIdModel, TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PENDING_VERIFICATION = "PENDING_VERIFICATION", "Pending Verification"
        VERIFIED = "VERIFIED", "Verified"
        REJECTED = "REJECTED", "Rejected"
        LISTED = "LISTED", "Listed"
        SOLD_OUT = "SOLD_OUT", "Sold Out"
        EXPIRED = "EXPIRED", "Expired"

    supplier = models.ForeignKey(SupplierProfile, on_delete=models.CASCADE, related_name="batches")
    ingredient = models.ForeignKey(Ingredient, on_delete=models.PROTECT, related_name="batches")
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, default="kg")
    sowing_date = models.DateField(null=True, blank=True)
    harvest_date = models.DateField()
    actual_harvest_days = models.PositiveIntegerField(null=True, blank=True, editable=False)
    is_growth_anomaly = models.BooleanField(default=False, editable=False)
    status = models.CharField(max_length=25, choices=Status.choices, default=Status.DRAFT)
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    available_quantity = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    qr_image = models.ImageField(upload_to="batch_qr/", blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.sowing_date and self.harvest_date:
            self.actual_harvest_days = (self.harvest_date - self.sowing_date).days
            min_days = self.ingredient.expected_min_harvest_days
            self.is_growth_anomaly = bool(
                min_days and self.actual_harvest_days < min_days
            )
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ingredient.name} batch {self.public_id} ({self.supplier.fpo_name})"


class GeoTaggedPhoto(TimeStampedModel):
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(upload_to="batch_photos/")
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    captured_at = models.DateTimeField(null=True, blank=True)
    exif_locked = models.BooleanField(
        default=False, editable=False, help_text="True if lat/lng/timestamp were read from image EXIF data"
    )

    def __str__(self):
        return f"Photo for {self.batch.public_id}"


class LedgerEntry(TimeStampedModel):
    class EntryType(models.TextChoices):
        CREDIT = "CREDIT", "Credit"
        DEBIT = "DEBIT", "Debit"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        PAID = "PAID", "Paid"

    supplier = models.ForeignKey(SupplierProfile, on_delete=models.CASCADE, related_name="ledger_entries")
    order_item = models.ForeignKey(
        "orders.OrderItem", on_delete=models.SET_NULL, null=True, blank=True, related_name="ledger_entries"
    )
    entry_type = models.CharField(max_length=10, choices=EntryType.choices)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    note = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.entry_type} {self.amount} - {self.supplier.fpo_name}"
