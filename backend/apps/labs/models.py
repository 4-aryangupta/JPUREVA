import hashlib
import json

from django.db import models
from django.utils import timezone

from apps.accounts.models import LabProfile, User
from apps.core.models import TimeStampedModel
from apps.suppliers.models import Batch


class TestType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class VerificationRequest(TimeStampedModel):
    class Status(models.TextChoices):
        REQUESTED = "REQUESTED", "Requested"
        ASSIGNED = "ASSIGNED", "Assigned"
        SAMPLE_COLLECTED = "SAMPLE_COLLECTED", "Sample Collected"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"
        REJECTED = "REJECTED", "Rejected"

    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name="verification_requests")
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="verification_requests")
    lab = models.ForeignKey(
        LabProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name="verification_requests"
    )
    requested_tests = models.ManyToManyField(TestType, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.REQUESTED)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"VerificationRequest for {self.batch.public_id} ({self.status})"


class Certificate(TimeStampedModel):
    class OverallResult(models.TextChoices):
        PASS = "PASS", "Pass"
        FAIL = "FAIL", "Fail"
        CONDITIONAL = "CONDITIONAL", "Conditional"

    verification_request = models.OneToOneField(
        VerificationRequest, on_delete=models.CASCADE, related_name="certificate"
    )
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name="certificates")
    lab = models.ForeignKey(LabProfile, on_delete=models.CASCADE, related_name="certificates")
    certificate_number = models.CharField(max_length=50, unique=True)
    test_results = models.JSONField(default=dict, help_text="{test_type_name: {result, measured_value, unit}}")
    overall_result = models.CharField(max_length=15, choices=OverallResult.choices)
    shelf_life_days = models.PositiveIntegerField(null=True, blank=True)
    integrity_hash = models.CharField(max_length=64, editable=False)
    signed_stamp = models.CharField(max_length=255, editable=False)
    pdf_file = models.FileField(upload_to="certificates/", blank=True, null=True)
    issued_at = models.DateTimeField(default=timezone.now)
    is_valid = models.BooleanField(default=True)

    def compute_integrity_hash(self) -> str:
        payload = {
            "certificate_number": self.certificate_number,
            "batch_id": str(self.batch_id),
            "lab_id": self.lab_id,
            "test_results": self.test_results,
            "overall_result": self.overall_result,
            "issued_at": self.issued_at.isoformat(),
        }
        canonical = json.dumps(payload, sort_keys=True)
        return hashlib.sha256(canonical.encode()).hexdigest()

    def save(self, *args, **kwargs):
        self.signed_stamp = f"{self.lab.lab_name}|{self.issued_at.isoformat()}"
        self.integrity_hash = self.compute_integrity_hash()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Certificate {self.certificate_number} ({self.overall_result})"


class Invoice(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        PAID = "PAID", "Paid"

    verification_request = models.ForeignKey(
        VerificationRequest, on_delete=models.CASCADE, related_name="invoices"
    )
    lab = models.ForeignKey(LabProfile, on_delete=models.CASCADE, related_name="invoices")
    supplier = models.ForeignKey(
        "accounts.SupplierProfile", on_delete=models.CASCADE, related_name="lab_invoices"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    issued_at = models.DateTimeField(default=timezone.now)
    paid_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Invoice {self.id} - {self.amount} ({self.status})"
