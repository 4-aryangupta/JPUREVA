from rest_framework import serializers
from .models import WarehouseInventory, WarehouseStockMovement
from apps.accounts.models import WarehouseProfile, User
from apps.suppliers.models import Batch


class WarehouseProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = WarehouseProfile
        exclude = ['user']


class WarehouseInventorySerializer(serializers.ModelSerializer):
    warehouse_name = serializers.CharField(source='warehouse.warehouse_name', read_only=True)
    warehouse_code = serializers.CharField(source='warehouse.warehouse_code', read_only=True)
    ingredient_name = serializers.CharField(source='batch.ingredient.name', read_only=True)
    ingredient_unit = serializers.CharField(source='batch.ingredient.unit_default', read_only=True)
    supplier_name = serializers.CharField(source='batch.supplier.fpo_name', read_only=True)
    batch_public_id = serializers.CharField(source='batch.public_id', read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)
    total_allocated = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = WarehouseInventory
        fields = [
            'id', 'warehouse', 'warehouse_name', 'warehouse_code',
            'batch', 'batch_public_id', 'ingredient_name', 'ingredient_unit',
            'supplier_name', 'received_quantity', 'available_quantity',
            'reserved_quantity', 'dispatched_quantity', 'unit',
            'storage_location', 'storage_bin', 'inventory_status',
            'expiry_date', 'is_low_stock', 'total_allocated',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class WarehouseStockMovementSerializer(serializers.ModelSerializer):
    movement_type_display = serializers.CharField(source='get_movement_type_display', read_only=True)
    actor_email = serializers.CharField(source='actor.email', read_only=True)
    warehouse_inventory_info = serializers.CharField(source='warehouse_inventory.__str__', read_only=True)

    class Meta:
        model = WarehouseStockMovement
        fields = [
            'id', 'warehouse_inventory', 'warehouse_inventory_info',
            'quantity', 'movement_type', 'movement_type_display',
            'actor', 'actor_email', 'timestamp', 'note'
        ]
        read_only_fields = ['id', 'timestamp']


class WarehouseInventoryUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WarehouseInventory
        fields = [
            'available_quantity', 'reserved_quantity', 'dispatched_quantity',
            'storage_location', 'storage_bin', 'inventory_status'
        ]

    def validate(self, attrs):
        # Ensure quantities are valid
        instance = self.instance
        if instance:
            available = attrs.get('available_quantity', instance.available_quantity)
            reserved = attrs.get('reserved_quantity', instance.reserved_quantity)
            dispatched = attrs.get('dispatched_quantity', instance.dispatched_quantity)

            total_allocated = available + reserved + dispatched
            if total_allocated > instance.received_quantity:
                raise serializers.ValidationError(
                    "Allocated quantity cannot exceed received quantity."
                )

        return attrs