from django.urls import path

from .views import PublicBatchScanView, PublicHotelTrustView

urlpatterns = [
    path("scan/<str:public_id>/", PublicBatchScanView.as_view(), name="public-batch-scan"),
    path("trust/<str:hotel_slug>/", PublicHotelTrustView.as_view(), name="public-hotel-trust"),
]
