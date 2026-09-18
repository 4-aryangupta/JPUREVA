from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.permissions import IsHotel
from apps.suppliers.models import Batch

from .models import Cart, CartItem, Order, OrderItem, OrderStatusEvent, Payment
from .serializers import CartSerializer, OrderSerializer


class CartView(APIView):
    permission_classes = [IsHotel]

    def get_cart(self, request):
        cart, _ = Cart.objects.get_or_create(hotel=request.user.hotel_profile)
        return cart

    def get(self, request):
        return Response(CartSerializer(self.get_cart(request)).data)

    def post(self, request):
        cart = self.get_cart(request)
        batch = Batch.objects.get(public_id=request.data["batch_id"], status=Batch.Status.LISTED)
        quantity = Decimal(str(request.data.get("quantity", 1)))
        item, created = CartItem.objects.get_or_create(cart=cart, batch=batch, defaults={"quantity": quantity})
        if not created:
            # Reserve additional stock for increased quantity
            if not batch.reserve_stock(quantity):
                raise ValidationError(f"Insufficient stock for {batch.ingredient.name}.")
            item.quantity += quantity
            item.save(update_fields=["quantity"])
        else:
            # Reserve stock for new item
            if not batch.reserve_stock(quantity):
                raise ValidationError(f"Insufficient stock for {batch.ingredient.name}.")
        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)


class CartItemDetailView(APIView):
    permission_classes = [IsHotel]

    def patch(self, request, item_id):
        item = CartItem.objects.get(id=item_id, cart__hotel=request.user.hotel_profile)
        item.quantity = Decimal(str(request.data["quantity"]))
        item.save(update_fields=["quantity"])
        return Response(CartSerializer(item.cart).data)

    def delete(self, request, item_id):
        item = CartItem.objects.get(id=item_id, cart__hotel=request.user.hotel_profile)
        cart = item.cart
        item.delete()
        return Response(CartSerializer(cart).data)


class CheckoutView(APIView):
    permission_classes = [IsHotel]

    @transaction.atomic
    def post(self, request):
        hotel = request.user.hotel_profile
        cart, _ = Cart.objects.get_or_create(hotel=hotel)
        items = list(cart.items.select_related("batch__supplier").all())
        if not items:
            raise ValidationError("Cart is empty.")

        delivery_date = request.data.get("delivery_date")
        delivery_address = request.data.get("delivery_address")
        if not delivery_date or not delivery_address:
            raise ValidationError("delivery_date and delivery_address are required.")

        order = Order.objects.create(
            hotel=hotel,
            delivery_date=delivery_date,
            delivery_slot=request.data.get("delivery_slot", ""),
            delivery_address=delivery_address,
        )

        total = Decimal("0")
        total = Decimal("0")
        for cart_item in items:
            batch = cart_item.batch
            # Validate batch is still suitable for checkout (not rejected/expired)
            if batch.status in [Batch.Status.REJECTED, Batch.Status.EXPIRED]:
                raise ValidationError(f"Batch {batch.public_id} is no longer available for checkout.")
            # Stock is already reserved from when item was added to cart
            unit_price = batch.price_per_unit
            subtotal = unit_price * cart_item.quantity
            OrderItem.objects.create(
                order=order,
                batch=batch,
                supplier=batch.supplier,
                quantity=cart_item.quantity,
                unit_price=unit_price,
                subtotal=subtotal,
            )
            total += subtotal
            OrderItem.objects.create(
                order=order,
                batch=batch,
                supplier=batch.supplier,
                quantity=cart_item.quantity,
                unit_price=unit_price,
                subtotal=subtotal,
            )
            total += subtotal

        # Create payment record (initially pending)
        Payment.objects.create(
            order=order,
            amount=total,
            method=request.data.get("payment_method", Payment.Method.CREDIT_CARD),  # Default method
        )

        # Order stays PENDING (stock is reserved) until payment is processed
        order.total_amount = total
        order.save(update_fields=["total_amount"])
        OrderStatusEvent.objects.create(
            order=order, status=Order.Status.PENDING, created_by=request.user, note="Awaiting payment."
        )

        cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class HotelOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsHotel]

    def get_queryset(self):
        return Order.objects.filter(hotel=self.request.user.hotel_profile).order_by("-placed_at")


class HotelOrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsHotel]

    def get_queryset(self):
        return Order.objects.filter(hotel=self.request.user.hotel_profile)


class PaymentProcessView(APIView):
    """Process payment for an order."""
    permission_classes = [IsHotel]

    def post(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id, hotel=request.user.hotel_profile)
            payment = order.payment
        except (Order.DoesNotExist, Payment.DoesNotExist):
            raise ValidationError("Order or payment not found.")

        if payment.status != Payment.Status.PENDING:
            raise ValidationError(f"Payment is already {payment.status.lower()}.")

        # Update payment status to processing
        payment.status = Payment.Status.PROCESSING
        payment.save(update_fields=["status"])

        # TODO: Integrate with actual payment gateway here
        # For now, we'll simulate success/failure based on a flag
        # In real implementation, this would call payment gateway API

        # Simulate payment processing - in real app, this would be async
        # For demo, let's assume payment succeeds if amount < 1000 (simplistic)
        if order.total_amount < 1000:  # Simulate successful payment
            payment.status = Payment.Status.COMPLETED
            payment.transaction_id = f"txn_{timezone.now().timestamp()}"
            payment.gateway_response = {"simulated": True, "amount": float(order.total_amount)}

            # Confirm the reserved stock (move from reserved to sold)
            for item in order.items.all():
                item.batch.confirm_stock(item.quantity)

            # Update order status
            order.payment_status = Order.PaymentStatus.PAID
            order.status = Order.Status.CONFIRMED
            order.save(update_fields=["payment_status", "status"])

            OrderStatusEvent.objects.create(
                order=order, status=Order.Status.CONFIRMED, created_by=request.user, note="Payment completed."
            )
        else:  # Simulate failed payment
            payment.status = Payment.Status.FAILED
            payment.failed_reason = "Insufficient funds (simulated)"
            payment.gateway_response = {"error": "insufficient_funds"}

            # Release the reserved stock back to available
            for item in order.items.all():
                item.batch.release_stock(item.quantity)

            # Update order status
            order.status = Order.Status.CANCELLED
            order.save(update_fields=["status"])

            OrderStatusEvent.objects.create(
                order=order, status=Order.Status.CANCELLED, created_by=request.user, note="Payment failed."
            )

        payment.save()

        return Response(OrderSerializer(order).data)
