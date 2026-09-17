from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.hotels.models import ComplianceDocument
from apps.notifications.models import Notification


class Command(BaseCommand):
    help = "Creates COMPLIANCE_EXPIRY notifications for hotel compliance docs expiring within 30 days or already expired."

    def handle(self, *args, **options):
        today = timezone.localdate()
        soon = today + timedelta(days=30)
        docs = ComplianceDocument.objects.filter(expiry_date__isnull=False, expiry_date__lte=soon).select_related("hotel__user")
        created = 0
        for doc in docs:
            state = "expired" if doc.expiry_date < today else "expiring soon"
            Notification.objects.create(
                recipient=doc.hotel.user,
                notif_type=Notification.NotifType.COMPLIANCE_EXPIRY,
                title=f"{doc.get_doc_type_display()} {state}",
                body=f"Expiry date: {doc.expiry_date.isoformat()}",
                link_url="/hotel/compliance",
            )
            created += 1
        self.stdout.write(self.style.SUCCESS(f"Created {created} compliance expiry notifications."))
