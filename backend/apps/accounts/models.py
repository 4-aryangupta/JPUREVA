from django.contrib.auth.models import AbstractUser
from django.db import models

from apps.core.models import TimeStampedModel


class User(AbstractUser):
    class Role(models.TextChoices):
        HOTEL = "HOTEL", "Hotel/Restaurant"
        LAB = "LAB", "Lab"
        SUPPLIER = "SUPPLIER", "Supplier/FPO"
        ADMIN = "ADMIN", "Admin"

    class ApprovalStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=16, choices=Role.choices)
    phone = models.CharField(max_length=20, blank=True)
    approval_status = models.CharField(
        max_length=10, choices=ApprovalStatus.choices, default=ApprovalStatus.APPROVED
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"{self.email} ({self.role})"


class SupplierProfile(TimeStampedModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="supplier_profile")
    fpo_name = models.CharField(max_length=255)
    registration_number = models.CharField(max_length=100, blank=True)
    fssai_license_number = models.CharField(max_length=50)
    business_docs = models.FileField(upload_to="onboarding/suppliers/", blank=True, null=True)
    address = models.CharField(max_length=255, blank=True)
    state = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    geo_lat = models.FloatField(null=True, blank=True)
    geo_lng = models.FloatField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="approved_suppliers"
    )

    def __str__(self):
        return self.fpo_name


class LabProfile(TimeStampedModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="lab_profile")
    lab_name = models.CharField(max_length=255)
    nabl_accreditation_number = models.CharField(max_length=100)
    nabl_valid_till = models.DateField(null=True, blank=True)
    accreditation_cert_file = models.FileField(upload_to="onboarding/labs/", blank=True, null=True)
    address = models.CharField(max_length=255, blank=True)
    contact_person = models.CharField(max_length=150, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="approved_labs"
    )

    def __str__(self):
        return self.lab_name


class HotelProfile(TimeStampedModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="hotel_profile")
    business_name = models.CharField(max_length=255)
    fssai_license_number = models.CharField(max_length=50, blank=True)
    gstin = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    cuisine_type = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.business_name
