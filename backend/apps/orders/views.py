from decimal import Decimal

from django.db import transaction
from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.permissions import IsHotel
from apps.suppliers.models import Batch

from .models import Cart, CartItem, Order, OrderItem, OrderStatusEvent
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
        batch = Batch.objects.get(id=request.data["batch_id"], status=Batch.Status.LISTED)
        quantity = Decimal(str(request.data.get("quantity", 1)))
        item, created = CartItem.objects.get_or_create(cart=cart, batch=batch, defaults={"quantity": quantity})
        if not created:
            item.quantity += quantity
            item.save(update_fields=["quantity"])
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
        for cart_item in items:
            batch = cart_item.batch
            if batch.available_quantity is not None and cart_item.quantity > batch.available_quantity:
                raise ValidationError(f"Insufficient stock for {batch.ingredient.name}.")
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

            if batch.available_quantity is not None:
                batch.available_quantity -= cart_item.quantity
                if batch.available_quantity <= 0:
                    batch.status = Batch.Status.SOLD_OUT
                batch.save(update_fields=["available_quantity", "status"])

        # Order stays PENDING (stock is already reserved above) until an admin approves it in
        # the admin panel — that's when suppliers are notified and paid out via the ledger.
        order.total_amount = total
        order.save(update_fields=["total_amount"])
        OrderStatusEvent.objects.create(
            order=order, status=Order.Status.PENDING, created_by=request.user, note="Awaiting admin approval."
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
