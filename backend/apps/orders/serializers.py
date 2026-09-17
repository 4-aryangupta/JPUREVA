from rest_framework import serializers

from .models import Cart, CartItem, Order, OrderItem, OrderStatusEvent


class CartItemSerializer(serializers.ModelSerializer):
    ingredient_name = serializers.CharField(source="batch.ingredient.name", read_only=True)
    unit_price = serializers.DecimalField(source="batch.price_per_unit", max_digits=10, decimal_places=2, read_only=True)
    supplier_name = serializers.CharField(source="batch.supplier.fpo_name", read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "batch", "ingredient_name", "supplier_name", "quantity", "unit_price", "created_at"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "hotel", "items", "created_at"]


class OrderStatusEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusEvent
        fields = ["id", "status", "note", "created_at"]


class OrderItemSerializer(serializers.ModelSerializer):
    ingredient_name = serializers.CharField(source="batch.ingredient.name", read_only=True)
    supplier_name = serializers.CharField(source="supplier.fpo_name", read_only=True)
    batch_public_id = serializers.CharField(source="batch.public_id", read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "id", "batch", "batch_public_id", "ingredient_name", "supplier_name",
            "quantity", "unit_price", "subtotal", "fulfillment_status",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_events = OrderStatusEventSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "hotel", "status", "delivery_date", "delivery_slot", "delivery_address",
            "total_amount", "payment_status", "placed_at", "items", "status_events",
        ]
        read_only_fields = ["id", "hotel", "status", "total_amount", "payment_status", "placed_at"]


class SupplierOrderItemSerializer(serializers.ModelSerializer):
    ingredient_name = serializers.CharField(source="batch.ingredient.name", read_only=True)
    batch_public_id = serializers.CharField(source="batch.public_id", read_only=True)
    order_id = serializers.IntegerField(source="order.id", read_only=True)
    hotel_name = serializers.CharField(source="order.hotel.business_name", read_only=True)
    delivery_date = serializers.DateField(source="order.delivery_date", read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "id", "order_id", "hotel_name", "batch", "batch_public_id", "ingredient_name",
            "quantity", "unit_price", "subtotal", "fulfillment_status", "delivery_date",
        ]
