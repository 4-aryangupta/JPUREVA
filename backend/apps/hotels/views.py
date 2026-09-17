from django.utils import timezone
from django.utils.text import slugify
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.permissions import IsHotel
from apps.suppliers.models import Batch
from apps.suppliers.serializers import BatchSerializer
from apps.traceability.models import TrustBadge
from apps.traceability.qr_utils import generate_qr_file, hotel_trust_url
from apps.traceability.serializers import TrustBadgeSerializer

from .models import ComplianceDocument, HotelSubscription, SubscriptionPlan
from .serializers import ComplianceDocumentSerializer, HotelSubscriptionSerializer, SubscriptionPlanSerializer


class ProductListView(generics.ListAPIView):
    serializer_class = BatchSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Batch.objects.filter(status=Batch.Status.LISTED).select_related("supplier", "ingredient__category")
        params = self.request.query_params
        if category := params.get("category"):
            qs = qs.filter(ingredient__category__slug=category)
        if supplier := params.get("supplier"):
            qs = qs.filter(supplier_id=supplier)
        if price_min := params.get("price_min"):
            qs = qs.filter(price_per_unit__gte=price_min)
        if price_max := params.get("price_max"):
            qs = qs.filter(price_per_unit__lte=price_max)
        return qs.order_by("-created_at")


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = BatchSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Batch.objects.filter(status=Batch.Status.LISTED)


class ComplianceDocumentListCreateView(generics.ListCreateAPIView):
    serializer_class = ComplianceDocumentSerializer
    permission_classes = [IsHotel]

    def get_queryset(self):
        return ComplianceDocument.objects.filter(hotel=self.request.user.hotel_profile).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(hotel=self.request.user.hotel_profile)


class TrustBadgeView(APIView):
    permission_classes = [IsHotel]

    def get(self, request):
        hotel = request.user.hotel_profile
        badge, created = TrustBadge.objects.get_or_create(
            hotel=hotel, defaults={"public_slug": self._make_slug(hotel)}
        )
        if created or not badge.qr_image:
            self._regenerate(badge)
        return Response(TrustBadgeSerializer(badge).data)

    def _make_slug(self, hotel):
        base = slugify(hotel.business_name)[:24]
        return f"{base}-{hotel.id}"

    def _regenerate(self, badge):
        qr_file = generate_qr_file(hotel_trust_url(badge.public_slug), f"{badge.public_slug}.png")
        badge.qr_image.save(qr_file.name, qr_file, save=False)
        badge.regenerated_at = timezone.now()
        badge.save(update_fields=["qr_image", "regenerated_at"])


class TrustBadgeRegenerateView(APIView):
    permission_classes = [IsHotel]

    def post(self, request):
        hotel = request.user.hotel_profile
        badge, _ = TrustBadge.objects.get_or_create(
            hotel=hotel, defaults={"public_slug": TrustBadgeView()._make_slug(hotel)}
        )
        TrustBadgeView()._regenerate(badge)
        return Response(TrustBadgeSerializer(badge).data)


class SubscriptionPlanListView(generics.ListAPIView):
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.AllowAny]


class HotelSubscriptionView(APIView):
    permission_classes = [IsHotel]

    def get(self, request):
        sub = HotelSubscription.objects.filter(hotel=request.user.hotel_profile).first()
        if not sub:
            return Response(None)
        return Response(HotelSubscriptionSerializer(sub).data)

    def post(self, request):
        hotel = request.user.hotel_profile
        plan = SubscriptionPlan.objects.get(id=request.data["plan_id"])
        sub, _ = HotelSubscription.objects.update_or_create(
            hotel=hotel,
            defaults={"plan": plan, "status": HotelSubscription.Status.ACTIVE},
        )
        return Response(HotelSubscriptionSerializer(sub).data)
