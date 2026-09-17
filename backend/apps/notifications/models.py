from django.db import models

from apps.accounts.models import User
from apps.core.models import TimeStampedModel


class Notification(TimeStampedModel):
    class NotifType(models.TextChoices):
        ORDER_UPDATE = "ORDER_UPDATE", "Order Update"
        LAB_RESULT_READY = "LAB_RESULT_READY", "Lab Result Ready"
        COMPLIANCE_EXPIRY = "COMPLIANCE_EXPIRY", "Compliance Expiry"
        VERIFICATION_STATUS = "VERIFICATION_STATUS", "Verification Status"
        ACCOUNT_APPROVAL = "ACCOUNT_APPROVAL", "Account Approval"
        GENERIC = "GENERIC", "Generic"

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    notif_type = models.CharField(max_length=25, choices=NotifType.choices, default=NotifType.GENERIC)
    title = models.CharField(max_length=200)
    body = models.CharField(max_length=500, blank=True)
    link_url = models.CharField(max_length=255, blank=True)
    related_object_type = models.CharField(max_length=50, blank=True)
    related_object_id = models.CharField(max_length=64, blank=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.notif_type} -> {self.recipient.email}"
