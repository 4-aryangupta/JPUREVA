from django.urls import path

from .views import CartView, CartItemDetailView, CheckoutView, HotelOrderListView, HotelOrderDetailView, PaymentProcessView

app_name = "orders"

urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/item/<int:item_id>/", CartItemDetailView.as_view(), name="cart-item-detail"),
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("", HotelOrderListView.as_view(), name="order-list"),
    path("<int:order_id>/", HotelOrderDetailView.as_view(), name="order-detail"),
    path("<int:order_id>/payment/", PaymentProcessView.as_view(), name="payment-process"),
]
