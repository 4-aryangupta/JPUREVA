from django.db import transaction
from django.db.models import Sum
from django.utils import timezone
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import HotelProfile, LabProfile, SupplierProfile, User
from apps.catalog.models import Category, Ingredient
from apps.catalog.serializers import CategorySerializer
from apps.core.permissions import IsAdmin
from apps.labs.models import Certificate, VerificationRequest
from apps.notifications.models import Notification
from apps.orders.models import Order, OrderStatusEvent
from apps.orders.serializers import OrderSerializer
from apps.suppliers.exif_utils import extract_geo_and_timestamp
from apps.suppliers.models import Batch, GeoTaggedPhoto, LedgerEntry
from apps.suppliers.serializers import BatchSerializer

from .models import AuditLog
from .serializers import AuditLogSerializer, PendingUserSerializer


class PendingApprovalsView(generics.ListAPIView):
    serializer_class = PendingUserSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        return User.objects.filter(
            role__in=[User.Role.SUPPLIER, User.Role.LAB],
            approval_status=User.ApprovalStatus.PENDING,
        ).order_by("date_joined")


class ApproveUserView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, user_id):
        user = User.objects.get(id=user_id)
        user.approval_status = User.ApprovalStatus.APPROVED
        user.save(update_fields=["approval_status"])
        if hasattr(user, "supplier_profile"):
            user.supplier_profile.approved_at = timezone.now()
            user.supplier_profile.approved_by = request.user
            user.supplier_profile.save(update_fields=["approved_at", "approved_by"])
        if hasattr(user, "lab_profile"):
            user.lab_profile.approved_at = timezone.now()
            user.lab_profile.approved_by = request.user
            user.lab_profile.save(update_fields=["approved_at", "approved_by"])
        AuditLog.objects.create(actor=request.user, action="approve_user", target_type="User", target_id=str(user.id))
        Notification.objects.create(
            recipient=user,
            notif_type=Notification.NotifType.ACCOUNT_APPROVAL,
            title="Your account has been approved",
            body="You can now transact on JPureva.",
        )
        return Response(PendingUserSerializer(user).data)


class RejectUserView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, user_id):
        user = User.objects.get(id=user_id)
        user.approval_status = User.ApprovalStatus.REJECTED
        user.save(update_fields=["approval_status"])
        AuditLog.objects.create(actor=request.user, action="reject_user", target_type="User", target_id=str(user.id))
        Notification.objects.create(
            recipient=user,
            notif_type=Notification.NotifType.ACCOUNT_APPROVAL,
            title="Your account application was rejected",
            body="Please contact support for details.",
        )
        return Response(PendingUserSerializer(user).data)


class PendingOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAdmin]
    queryset = Order.objects.filter(status=Order.Status.PENDING).select_related("hotel").order_by("placed_at")


class ApproveOrderView(APIView):
    permission_classes = [IsAdmin]

    @transaction.atomic
    def post(self, request, order_id):
        try:
            order = Order.objects.select_related("hotel__user").get(id=order_id, status=Order.Status.PENDING)
        except Order.DoesNotExist:
            raise ValidationError("Order not found or already actioned.")

        order.status = Order.Status.CONFIRMED
        order.save(update_fields=["status"])
        OrderStatusEvent.objects.create(order=order, status=Order.Status.CONFIRMED, created_by=request.user)

        for item in order.items.select_related("batch", "supplier__user").all():
            LedgerEntry.objects.create(
                supplier=item.supplier,
                order_item=item,
                entry_type=LedgerEntry.EntryType.CREDIT,
                amount=item.subtotal,
                note=f"Order #{order.id}",
            )
            Notification.objects.create(
                recipient=item.supplier.user,
                notif_type=Notification.NotifType.ORDER_UPDATE,
                title="New order received",
                body=f"{item.quantity} {item.batch.unit} of {item.batch.ingredient.name} ordered.",
            )

        Notification.objects.create(
            recipient=order.hotel.user,
            notif_type=Notification.NotifType.ORDER_UPDATE,
            title="Your order has been approved",
            body=f"Order #{order.id} has been confirmed and sent to suppliers.",
        )
        AuditLog.objects.create(actor=request.user, action="approve_order", target_type="Order", target_id=str(order.id))
        return Response(OrderSerializer(order).data)


class RejectOrderView(APIView):
    permission_classes = [IsAdmin]

    @transaction.atomic
    def post(self, request, order_id):
        try:
            order = Order.objects.select_related("hotel__user").get(id=order_id, status=Order.Status.PENDING)
        except Order.DoesNotExist:
            raise ValidationError("Order not found or already actioned.")

        order.status = Order.Status.CANCELLED
        order.save(update_fields=["status"])
        OrderStatusEvent.objects.create(
            order=order, status=Order.Status.CANCELLED, created_by=request.user, note=request.data.get("reason", "")
        )

        for item in order.items.select_related("batch").all():
            batch = item.batch
            if batch.available_quantity is not None:
                batch.available_quantity += item.quantity
                if batch.status == Batch.Status.SOLD_OUT:
                    batch.status = Batch.Status.LISTED
                batch.save(update_fields=["available_quantity", "status"])

        Notification.objects.create(
            recipient=order.hotel.user,
            notif_type=Notification.NotifType.ORDER_UPDATE,
            title="Your order was not approved",
            body=f"Order #{order.id} could not be approved. Please contact support.",
        )
        AuditLog.objects.create(actor=request.user, action="reject_order", target_type="Order", target_id=str(order.id))
        return Response(OrderSerializer(order).data)


class AnalyticsOverviewView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        pending_ledger = LedgerEntry.objects.filter(status=LedgerEntry.Status.PENDING).aggregate(
            total=Sum("amount")
        )["total"]
        return Response({
            "suppliers_total": SupplierProfile.objects.count(),
            "labs_total": LabProfile.objects.count(),
            "hotels_total": HotelProfile.objects.count(),
            "pending_approvals": Order.objects.filter(status=Order.Status.PENDING).count(),
            "batches_total": Batch.objects.count(),
            "batches_listed": Batch.objects.filter(status=Batch.Status.LISTED).count(),
            "verification_requests_pending": VerificationRequest.objects.filter(
                status__in=[VerificationRequest.Status.REQUESTED, VerificationRequest.Status.IN_PROGRESS]
            ).count(),
            "certificates_issued": Certificate.objects.count(),
            "orders_total": Order.objects.count(),
            "ledger_pending_amount": str(pending_ledger or 0),
        })


class UserListView(generics.ListAPIView):
    serializer_class = PendingUserSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        qs = User.objects.all().order_by("-date_joined")
        role = self.request.query_params.get("role")
        status_param = self.request.query_params.get("status")
        if role:
            qs = qs.filter(role=role)
        if status_param:
            qs = qs.filter(approval_status=status_param)
        return qs


class AuditLogListView(generics.ListAPIView):
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdmin]
    queryset = AuditLog.objects.all()


class CatalogCategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAdmin]
    queryset = Category.objects.all()

    def perform_create(self, serializer):
        category = serializer.save()
        AuditLog.objects.create(
            actor=self.request.user, action="create_category", target_type="Category", target_id=str(category.id)
        )


def _get_direct_supplier() -> SupplierProfile:
    """The system supplier that owns batches created directly from the admin catalog
    (price/stock/image set by the admin, no separate supplier/lab verification step)."""
    user, created = User.objects.get_or_create(
        email="direct@jpureva.internal",
        defaults={
            "username": "jpureva-direct",
            "role": User.Role.SUPPLIER,
            "approval_status": User.ApprovalStatus.APPROVED,
        },
    )
    if created:
        user.set_unusable_password()
        user.save(update_fields=["password"])
    supplier, _ = SupplierProfile.objects.get_or_create(
        user=user, defaults={"fpo_name": "JPureva Direct", "fssai_license_number": "ADMIN-DIRECT"}
    )
    return supplier


class AdminItemListCreateView(APIView):
    """Admin-managed storefront items: creates an Ingredient (if new) plus an
    immediately-LISTED Batch with price/stock/image, bypassing the supplier+lab
    verification pipeline so it shows up on /browse right away."""

    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        batches = (
            Batch.objects.filter(supplier=_get_direct_supplier(), status=Batch.Status.LISTED)
            .select_related("ingredient__category")
            .prefetch_related("photos")
            .order_by("-created_at")
        )
        return Response(BatchSerializer(batches, many=True).data)

    @transaction.atomic
    def post(self, request):
        data = request.data
        category_id = data.get("category")
        name = (data.get("name") or "").strip()
        unit_default = data.get("unit_default") or "kg"
        price_per_unit = data.get("price_per_unit")
        available_quantity = data.get("available_quantity")
        if not category_id or not name or not price_per_unit or not available_quantity:
            raise ValidationError("category, name, price_per_unit and available_quantity are required.")
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            raise ValidationError("Category not found.")

        ingredient, _ = Ingredient.objects.get_or_create(
            category=category,
            name=name,
            defaults={
                "unit_default": unit_default,
                "expected_min_harvest_days": data.get("expected_min_harvest_days") or None,
                "expected_max_harvest_days": data.get("expected_max_harvest_days") or None,
            },
        )

        batch = Batch.objects.create(
            supplier=_get_direct_supplier(),
            ingredient=ingredient,
            quantity=available_quantity,
            unit=unit_default,
            harvest_date=timezone.now().date(),
            status=Batch.Status.LISTED,
            price_per_unit=price_per_unit,
            available_quantity=available_quantity,
        )

        image = request.FILES.get("image")
        if image:
            lat, lng, captured_at, locked = extract_geo_and_timestamp(image)
            GeoTaggedPhoto.objects.create(
                batch=batch, image=image, latitude=lat, longitude=lng, captured_at=captured_at, exif_locked=locked
            )

        AuditLog.objects.create(actor=request.user, action="create_item", target_type="Batch", target_id=str(batch.id))
        return Response(BatchSerializer(batch).data, status=201)


class AdminItemDetailView(APIView):
    permission_classes = [IsAdmin]

    def delete(self, request, pk):
        try:
            batch = Batch.objects.get(id=pk, supplier=_get_direct_supplier())
        except Batch.DoesNotExist:
            raise ValidationError("Item not found.")
        # Delist rather than hard-delete: existing OrderItems PROTECT-reference the batch,
        # and delisting (vs. deleting) keeps past orders' traceability intact.
        batch.status = Batch.Status.EXPIRED
        batch.save(update_fields=["status"])
        AuditLog.objects.create(actor=request.user, action="delist_item", target_type="Batch", target_id=str(batch.id))
        return Response(status=204)
