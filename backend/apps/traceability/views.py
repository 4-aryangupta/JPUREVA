from rest_framework import permissions
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.suppliers.models import Batch

from .models import TrustBadge
from .serializers import PublicBatchScanSerializer, PublicTrustBadgeSerializer


class PublicBatchScanView(APIView):
    """GET /api/public/scan/{batch_public_id}/ — fully anonymous, no auth, no CSRF."""

    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request, public_id):
        try:
            batch = Batch.objects.select_related("supplier", "ingredient__category").prefetch_related(
                "photos", "coldchain_logs", "certificates__lab"
            ).get(public_id=public_id)
        except Batch.DoesNotExist:
            raise NotFound("No batch found for this code.")
        return Response(PublicBatchScanSerializer(batch).data)


class PublicHotelTrustView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request, hotel_slug):
        try:
            badge = TrustBadge.objects.select_related("hotel").get(public_slug=hotel_slug, is_active=True)
        except TrustBadge.DoesNotExist:
            raise NotFound("No active trust badge found for this code.")
        return Response(PublicTrustBadgeSerializer(badge).data)
