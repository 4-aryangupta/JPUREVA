from django.db import models
from django.utils import timezone

from apps.accounts.models import HotelProfile, SupplierProfile, User
from apps.core.models import TimeStampedModel
from apps.suppliers.models import Batch


class Cart(TimeStampedModel):
    hotel = models.OneToOneField(HotelProfile, on_delete=models.CASCADE, related_name="cart")

    def __str__(self):
        return f"Cart for {self.hotel.business_name}"


class CartItem(TimeStampedModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name="cart_items")
    quantity = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ("cart", "batch")

    def __str__(self):
        return f"{self.quantity} x {self.batch.ingredient.name}"


class Order(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CONFIRMED = "CONFIRMED", "Confirmed"
        PACKED = "PACKED", "Packed"
        OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY", "Out for Delivery"
        DELIVERED = "DELIVERED", "Delivered"
        CANCELLED = "CANCELLED", "Cancelled"

    class PaymentStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        PAID = "PAID", "Paid"

    hotel = models.ForeignKey(HotelProfile, on_delete=models.CASCADE, related_name="orders")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    delivery_date = models.DateField()
    delivery_slot = models.CharField(max_length=50, blank=True)
    delivery_address = models.CharField(max_length=255)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    payment_status = models.CharField(max_length=10, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    placed_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Order {self.id} - {self.hotel.business_name} ({self.status})"


class OrderItem(TimeStampedModel):
    class FulfillmentStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        FULFILLED = "FULFILLED", "Fulfilled"

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    batch = models.ForeignKey(Batch, on_delete=models.PROTECT, related_name="order_items")
    supplier = models.ForeignKey(SupplierProfile, on_delete=models.PROTECT, related_name="order_items")
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    fulfillment_status = models.CharField(
        max_length=10, choices=FulfillmentStatus.choices, default=FulfillmentStatus.PENDING
    )

    def __str__(self):
        return f"{self.quantity} x {self.batch.ingredient.name} (Order {self.order_id})"


class OrderStatusEvent(TimeStampedModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="status_events")
    status = models.CharField(max_length=20, choices=Order.Status.choices)
    note = models.CharField(max_length=255, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="order_status_events")

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Order {self.order_id} -> {self.status}"
