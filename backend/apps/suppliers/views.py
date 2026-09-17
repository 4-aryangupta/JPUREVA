from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.permissions import IsApprovedRole, IsSupplier
from apps.labs.models import TestType, VerificationRequest
from apps.notifications.models import Notification
from apps.orders.models import Order, OrderItem
from apps.orders.serializers import SupplierOrderItemSerializer
from apps.traceability.models import ColdChainLog
from apps.traceability.serializers import ColdChainLogSerializer

from .models import Batch, GeoTaggedPhoto, LedgerEntry
from .serializers import BatchSerializer, GeoTaggedPhotoSerializer, LedgerEntrySerializer


class BatchListCreateView(generics.ListCreateAPIView):
    serializer_class = BatchSerializer
    permission_classes = [IsSupplier, IsApprovedRole]

    def get_queryset(self):
        return Batch.objects.filter(supplier=self.request.user.supplier_profile).order_by("-created_at")


class BatchDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BatchSerializer
    permission_classes = [IsSupplier]

    def get_queryset(self):
        return Batch.objects.filter(supplier=self.request.user.supplier_profile)


class BatchPhotoUploadView(generics.CreateAPIView):
    serializer_class = GeoTaggedPhotoSerializer
    permission_classes = [IsSupplier, IsApprovedRole]

    def perform_create(self, serializer):
        batch = Batch.objects.get(id=self.kwargs["batch_id"], supplier=self.request.user.supplier_profile)
        serializer.save(batch=batch)


class RequestVerificationView(APIView):
    permission_classes = [IsSupplier, IsApprovedRole]

    def post(self, request, batch_id):
        batch = Batch.objects.get(id=batch_id, supplier=request.user.supplier_profile)
        if batch.status not in (Batch.Status.DRAFT, Batch.Status.REJECTED):
            return Response(
                {"detail": f"Batch is already {batch.status}."}, status=status.HTTP_400_BAD_REQUEST
            )
        test_type_ids = request.data.get("test_type_ids", [])
        vr = VerificationRequest.objects.create(batch=batch, requested_by=request.user)
        if test_type_ids:
            vr.requested_tests.set(TestType.objects.filter(id__in=test_type_ids))
        batch.status = Batch.Status.PENDING_VERIFICATION
        batch.save(update_fields=["status"])
        return Response({"verification_request_id": vr.id, "batch_status": batch.status}, status=status.HTTP_201_CREATED)


class ListBatchForSaleView(APIView):
    permission_classes = [IsSupplier, IsApprovedRole]

    def post(self, request, batch_id):
        batch = Batch.objects.get(id=batch_id, supplier=request.user.supplier_profile)
        if batch.status != Batch.Status.VERIFIED:
            return Response(
                {"detail": "Only VERIFIED batches can be listed for sale."}, status=status.HTTP_400_BAD_REQUEST
            )
        price = request.data.get("price_per_unit")
        quantity = request.data.get("available_quantity", batch.quantity)
        if not price:
            return Response({"detail": "price_per_unit is required."}, status=status.HTTP_400_BAD_REQUEST)
        batch.price_per_unit = price
        batch.available_quantity = quantity
        batch.status = Batch.Status.LISTED
        batch.save(update_fields=["price_per_unit", "available_quantity", "status"])
        return Response(BatchSerializer(batch).data)


class SupplierIncomingOrdersView(generics.ListAPIView):
    serializer_class = SupplierOrderItemSerializer
    permission_classes = [IsSupplier]

    def get_queryset(self):
        return (
            OrderItem.objects.filter(supplier=self.request.user.supplier_profile)
            .exclude(order__status=Order.Status.PENDING)
            .order_by("-created_at")
        )


class FulfillOrderItemView(APIView):
    permission_classes = [IsSupplier]

    def patch(self, request, item_id):
        item = OrderItem.objects.get(id=item_id, supplier=request.user.supplier_profile)
        item.fulfillment_status = OrderItem.FulfillmentStatus.FULFILLED
        item.save(update_fields=["fulfillment_status"])
        Notification.objects.create(
            recipient=item.order.hotel.user,
            notif_type=Notification.NotifType.ORDER_UPDATE,
            title="Order item fulfilled",
            body=f"{item.batch.ingredient.name} has been fulfilled by the supplier.",
        )
        return Response(SupplierOrderItemSerializer(item).data)


class SupplierColdChainLogListCreateView(generics.ListCreateAPIView):
    serializer_class = ColdChainLogSerializer
    permission_classes = [IsSupplier, IsApprovedRole]

    def get_queryset(self):
        qs = ColdChainLog.objects.filter(batch__supplier=self.request.user.supplier_profile)
        batch_id = self.request.query_params.get("batch")
        if batch_id:
            qs = qs.filter(batch_id=batch_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(recorded_by=self.request.user)


class SupplierLedgerListView(generics.ListAPIView):
    serializer_class = LedgerEntrySerializer
    permission_classes = [IsSupplier]

    def get_queryset(self):
        return LedgerEntry.objects.filter(supplier=self.request.user.supplier_profile).order_by("-created_at")
