from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.db.models import Sum, Q
from django.utils import timezone
from datetime import timedelta

from .models import WarehouseInventory, WarehouseStockMovement
from .serializers import (
    WarehouseProfileSerializer,
    WarehouseInventorySerializer,
    WarehouseStockMovementSerializer,
    WarehouseInventoryUpdateSerializer
)
from apps.accounts.models import WarehouseProfile, User
from apps.core.permissions import IsWarehouse, IsApprovedRole
from apps.suppliers.models import Batch


class WarehouseProfileView(generics.RetrieveAPIView):
    """Get the warehouse profile for the authenticated warehouse user"""
    serializer_class = WarehouseProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsWarehouse]

    def get_object(self):
        return self.request.user.warehouse_profile


class WarehouseInventoryListView(generics.ListAPIView):
    """List inventory items for a warehouse"""
    serializer_class = WarehouseInventorySerializer
    permission_classes = [permissions.IsAuthenticated, IsWarehouse]

    def get_queryset(self):
        warehouse = self.request.user.warehouse_profile
        queryset = WarehouseInventory.objects.filter(warehouse=warehouse)

        # Filter by status if provided
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(inventory_status=status)

        # Filter by low stock if requested
        low_stock = self.request.query_params.get('low_stock', None)
        if low_stock == 'true':
            # Filter in Python since is_low_stock is a property
            queryset = list(filter(lambda item: item.is_low_stock, queryset))

        return queryset


class WarehouseInventoryDetailView(generics.RetrieveUpdateAPIView):
    """Retrieve or update a specific inventory item"""
    serializer_class = WarehouseInventorySerializer
    permission_classes = [permissions.IsAuthenticated, IsWarehouse]

    def get_queryset(self):
        return WarehouseInventory.objects.filter(warehouse=self.request.user.warehouse_profile)

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return WarehouseInventoryUpdateSerializer
        return WarehouseInventorySerializer


class WarehouseStockMovementListView(generics.ListAPIView):
    """List stock movements for a warehouse"""
    serializer_class = WarehouseStockMovementSerializer
    permission_classes = [permissions.IsAuthenticated, IsWarehouse]

    def get_queryset(self):
        warehouse = self.request.user.warehouse_profile
        return WarehouseStockMovement.objects.filter(
            warehouse_inventory__warehouse=warehouse
        ).order_by('-timestamp')


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsWarehouse])
def receive_inventory(request):
    """Receive new inventory into the warehouse"""
    warehouse = request.user.warehouse_profile

    batch_id = request.data.get('batch_id')
    quantity = request.data.get('quantity')
    storage_location = request.data.get('storage_location', '')
    storage_bin = request.data.get('storage_bin', '')

    if not batch_id or not quantity:
        return Response(
            {'error': 'batch_id and quantity are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        batch = Batch.objects.get(id=batch_id, status=Batch.Status.VERIFIED)
    except Batch.DoesNotExist:
        return Response(
            {'error': 'Batch not found or not verified'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Check if inventory already exists for this batch in this warehouse
    inventory, created = WarehouseInventory.objects.get_or_create(
        warehouse=warehouse,
        batch=batch,
        defaults={
            'received_quantity': quantity,
            'available_quantity': quantity,
            'unit': batch.unit,
            'storage_location': storage_location,
            'storage_bin': storage_bin,
            'inventory_status': WarehouseInventory.InventoryStatus.RECEIVING
        }
    )

    if not created:
        # Update existing inventory
        inventory.received_quantity += quantity
        inventory.available_quantity += quantity
        inventory.save()

    # Create stock movement record
    WarehouseStockMovement.objects.create(
        warehouse_inventory=inventory,
        quantity=quantity,
        movement_type=WarehouseStockMovement.MovementType.RECEIVE,
        actor=request.user,
        note=f"Received {quantity} {batch.unit} of {batch.ingredient.name}"
    )

    serializer = WarehouseInventorySerializer(inventory)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsWarehouse])
def reserve_stock(request):
    """Reserve stock for allocation"""
    warehouse = request.user.warehouse_profile

    inventory_id = request.data.get('inventory_id')
    quantity = request.data.get('quantity')

    if not inventory_id or not quantity:
        return Response(
            {'error': 'inventory_id and quantity are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        inventory = WarehouseInventory.objects.get(
            id=inventory_id,
            warehouse=warehouse
        )
    except WarehouseInventory.DoesNotExist:
        return Response(
            {'error': 'Inventory item not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        # Create stock movement which will handle inventory updates
        movement = WarehouseStockMovement.objects.create(
            warehouse_inventory=inventory,
            quantity=quantity,
            movement_type=WarehouseStockMovement.MovementType.RESERVE,
            actor=request.user,
            note=f"Reserved {quantity} {inventory.unit} for allocation"
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = WarehouseInventorySerializer(inventory)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsWarehouse])
def dispatch_stock(request):
    """Dispatch stock from warehouse"""
    warehouse = request.user.warehouse_profile

    inventory_id = request.data.get('inventory_id')
    quantity = request.data.get('quantity')

    if not inventory_id or not quantity:
        return Response(
            {'error': 'inventory_id and quantity are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        inventory = WarehouseInventory.objects.get(
            id=inventory_id,
            warehouse=warehouse
        )
    except WarehouseInventory.DoesNotExist:
        return Response(
            {'error': 'Inventory item not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        # Create stock movement which will handle inventory updates
        movement = WarehouseStockMovement.objects.create(
            warehouse_inventory=inventory,
            quantity=quantity,
            movement_type=WarehouseStockMovement.MovementType.DISPATCH,
            actor=request.user,
            note=f"Dispatched {quantity} {inventory.unit}"
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = WarehouseInventorySerializer(inventory)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsWarehouse])
def release_stock(request):
    """Release stock from reserved back to available"""
    warehouse = request.user.warehouse_profile

    inventory_id = request.data.get('inventory_id')
    quantity = request.data.get('quantity')

    if not inventory_id or not quantity:
        return Response(
            {'error': 'inventory_id and quantity are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        inventory = WarehouseInventory.objects.get(
            id=inventory_id,
            warehouse=warehouse
        )
    except WarehouseInventory.DoesNotExist:
        return Response(
            {'error': 'Inventory item not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        # Create stock movement which will handle inventory updates
        movement = WarehouseStockMovement.objects.create(
            warehouse_inventory=inventory,
            quantity=quantity,
            movement_type=WarehouseStockMovement.MovementType.RELEASE,
            actor=request.user,
            note=f"Released {quantity} {inventory.unit} from reserved to available"
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = WarehouseInventorySerializer(inventory)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsWarehouse])
def warehouse_dashboard(request):
    """Get dashboard data for warehouse"""
    warehouse = request.user.warehouse_profile

    # Get inventory summary
    inventory_items = WarehouseInventory.objects.filter(warehouse=warehouse)

    total_items = inventory_items.count()
    total_quantity = inventory_items.aggregate(
        total=Sum('available_quantity')
    )['total'] or 0

    low_stock_items = [item for item in inventory_items if item.is_low_stock]
    low_stock_count = len(low_stock_items)

    # Get recent movements
    recent_movements = WarehouseStockMovement.objects.filter(
        warehouse_inventory__warehouse=warehouse
    ).order_by('-timestamp')[:10]

    # Get inventory by status
    status_summary = {}
    for status_choice in WarehouseInventory.InventoryStatus.choices:
        status_key = status_choice[0]
        status_count = inventory_items.filter(inventory_status=status_key).count()
        status_summary[status_key] = status_count

    # Get expiring items (within next 7 days)
    seven_days_from_now = timezone.now().date() + timedelta(days=7)
    expiring_items = inventory_items.filter(
        expiry_date__lte=seven_days_from_now,
        expiry_date__gte=timezone.now().date()
    ).count()

    dashboard_data = {
        'warehouse_info': {
            'name': warehouse.warehouse_name,
            'code': warehouse.warehouse_code,
            'storage_type': warehouse.storage_type,
            'is_active': warehouse.is_active
        },
        'inventory_summary': {
            'total_items': total_items,
            'total_quantity': float(total_quantity),
            'low_stock_count': low_stock_count,
            'expiring_soon_count': expiring_items
        },
        'status_summary': status_summary,
        'recent_movements': WarehouseStockMovementSerializer(
            recent_movements, many=True
        ).data,
        'low_stock_items': WarehouseInventorySerializer(
            low_stock_items, many=True
        ).data[:5]  # Limit to 5 items
    }

    return Response(dashboard_data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsWarehouse])
def cold_chain_logs(request):
    """Get cold chain logs for warehouse inventory"""
    from apps.traceability.models import ColdChainLog

    warehouse = request.user.warehouse_profile

    # Get cold chain logs for batches in this warehouse
    logs = ColdChainLog.objects.filter(
        batch__warehouse_inventory__warehouse=warehouse
    ).order_by('-recorded_at')[:50]

    # Format the data for frontend consumption
    formatted_logs = []
    for log in logs:
        formatted_logs.append({
            'id': log.id,
            'batch_id': log.batch.public_id,
            'ingredient_name': log.batch.ingredient.name,
            'stage': log.stage,
            'location_name': log.location_name,
            'temperature_c': float(log.temperature_c),
            'humidity_pct': float(log.humidity_pct),
            'recorded_by': log.recorded_by.email if log.recorded_by else None,
            'recorded_at': log.recorded_at,
            'is_alert': (
                log.temperature_c > 8.0 or  # Example threshold for refrigerated items
                log.temperature_c < 0.0 or
                log.humidity_pct > 90.0
            )
        })

    return Response(formatted_logs)