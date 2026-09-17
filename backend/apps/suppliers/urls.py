from django.urls import path

from .views import (
    BatchDetailView,
    BatchListCreateView,
    BatchPhotoUploadView,
    FulfillOrderItemView,
    ListBatchForSaleView,
    RequestVerificationView,
    SupplierColdChainLogListCreateView,
    SupplierIncomingOrdersView,
    SupplierLedgerListView,
)

urlpatterns = [
    path("batches/", BatchListCreateView.as_view(), name="batches"),
    path("batches/<uuid:pk>/", BatchDetailView.as_view(), name="batch-detail"),
    path("batches/<uuid:batch_id>/photos/", BatchPhotoUploadView.as_view(), name="batch-photo-upload"),
    path("batches/<uuid:batch_id>/request-verification/", RequestVerificationView.as_view(), name="request-verification"),
    path("batches/<uuid:batch_id>/list/", ListBatchForSaleView.as_view(), name="list-batch"),
    path("orders/", SupplierIncomingOrdersView.as_view(), name="supplier-orders"),
    path("orders/<int:item_id>/fulfill/", FulfillOrderItemView.as_view(), name="fulfill-order-item"),
    path("coldchain-logs/", SupplierColdChainLogListCreateView.as_view(), name="supplier-coldchain-logs"),
    path("ledger/", SupplierLedgerListView.as_view(), name="supplier-ledger"),
]
