from datetime import timedelta

from django.db import models
from django.utils import timezone

from apps.accounts.models import HotelProfile
from apps.core.models import TimeStampedModel


class ComplianceDocument(TimeStampedModel):
    class DocType(models.TextChoices):
        FSSAI_LICENSE = "FSSAI_LICENSE", "FSSAI License"
        AUDIT_REPORT = "AUDIT_REPORT", "Audit Report"
        OTHER = "OTHER", "Other"

    class Status(models.TextChoices):
        VALID = "VALID", "Valid"
        EXPIRING_SOON = "EXPIRING_SOON", "Expiring Soon"
        EXPIRED = "EXPIRED", "Expired"

    hotel = models.ForeignKey(HotelProfile, on_delete=models.CASCADE, related_name="compliance_documents")
    doc_type = models.CharField(max_length=20, choices=DocType.choices)
    file = models.FileField(upload_to="compliance_docs/")
    issued_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)

    @property
    def status(self) -> str:
        if not self.expiry_date:
            return self.Status.VALID
        today = timezone.localdate()
        if self.expiry_date < today:
            return self.Status.EXPIRED
        if self.expiry_date <= today + timedelta(days=30):
            return self.Status.EXPIRING_SOON
        return self.Status.VALID

    def __str__(self):
        return f"{self.doc_type} - {self.hotel.business_name}"


class SubscriptionPlan(models.Model):
    class Tier(models.TextChoices):
        BASIC = "BASIC", "Basic"
        PROFESSIONAL = "PROFESSIONAL", "Professional"
        ENTERPRISE = "ENTERPRISE", "Enterprise"

    name = models.CharField(max_length=20, choices=Tier.choices, unique=True)
    price_monthly = models.DecimalField(max_digits=10, decimal_places=2)
    price_annual = models.DecimalField(max_digits=10, decimal_places=2)
    features = models.JSONField(default=dict)

    def __str__(self):
        return self.name


class HotelSubscription(TimeStampedModel):
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        EXPIRED = "EXPIRED", "Expired"
        CANCELLED = "CANCELLED", "Cancelled"

    hotel = models.OneToOneField(HotelProfile, on_delete=models.CASCADE, related_name="subscription")
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.PROTECT, related_name="subscriptions")
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)
    started_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(null=True, blank=True)
    auto_renew = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.hotel.business_name} - {self.plan.name}"
