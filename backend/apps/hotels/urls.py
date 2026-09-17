from django.urls import path

from apps.orders.views import (
    CartItemDetailView,
    CartView,
    CheckoutView,
    HotelOrderDetailView,
    HotelOrderListView,
)

from .views import (
    ComplianceDocumentListCreateView,
    HotelSubscriptionView,
    ProductDetailView,
    ProductListView,
    SubscriptionPlanListView,
    TrustBadgeRegenerateView,
    TrustBadgeView,
)

urlpatterns = [
    path("products/", ProductListView.as_view(), name="products"),
    path("products/<uuid:pk>/", ProductDetailView.as_view(), name="product-detail"),
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/items/<int:item_id>/", CartItemDetailView.as_view(), name="cart-item-detail"),
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("orders/", HotelOrderListView.as_view(), name="hotel-orders"),
    path("orders/<int:pk>/", HotelOrderDetailView.as_view(), name="hotel-order-detail"),
    path("compliance-documents/", ComplianceDocumentListCreateView.as_view(), name="compliance-documents"),
    path("trust-badge/", TrustBadgeView.as_view(), name="trust-badge"),
    path("trust-badge/regenerate/", TrustBadgeRegenerateView.as_view(), name="trust-badge-regenerate"),
    path("subscription-plans/", SubscriptionPlanListView.as_view(), name="subscription-plans"),
    path("subscription/", HotelSubscriptionView.as_view(), name="hotel-subscription"),
]
