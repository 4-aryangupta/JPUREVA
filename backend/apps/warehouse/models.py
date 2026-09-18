from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from apps.accounts.models import WarehouseProfile, User
from apps.suppliers.models import Batch
from apps.core.models import TimeStampedModel, UUIDPublicIdModel


class WarehouseInventory(UUIDPublicIdModel, TimeStampedModel):
    class InventoryStatus(models.TextChoices):
        RECEIVING = "RECEIVING", "Receiving"
        AVAILABLE = "AVAILABLE", "Available"
        RESERVED = "RESERVED", "Reserved"
        QUARANTINED = "QUARANTINED", "Quarantined"
        DISPATCHED = "DISPATCHED", "Dispatched"
        EXPIRED = "EXPIRED", "Expired"
        OUT_OF_STOCK = "OUT_OF_STOCK", "Out of Stock"

    warehouse = models.ForeignKey(WarehouseProfile, on_delete=models.CASCADE, related_name="inventory_items")
    batch = models.ForeignKey(Batch, on_delete=models.PROTECT, related_name="warehouse_inventory")
    received_quantity = models.DecimalField(max_digits=10, decimal_places=2)
    available_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    reserved_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    dispatched_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    unit = models.CharField(max_length=20, help_text="Unit of measurement (e.g., kg, L)")
    storage_location = models.CharField(max_length=100, blank=True, help_text="e.g., Cold Room A")
    storage_bin = models.CharField(max_length=50, blank=True, help_text="e.g., Shelf 1")
    inventory_status = models.CharField(
        max_length=20, choices=InventoryStatus.choices, default=InventoryStatus.RECEIVING
    )
    expiry_date = models.DateField(null=True, blank=True, help_text="Expiry date if applicable")
    received_at = models.DateTimeField(auto_now_add=True)
    last_stock_update = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.received_quantity > self.batch.quantity:
            raise ValidationError(
                _("Received quantity cannot exceed batch quantity.")
            )
        # Ensure quantities are non-negative
        if self.available_quantity < 0 or self.reserved_quantity < 0 or self.dispatched_quantity < 0:
            raise ValidationError(_("Quantities cannot be negative."))
        # Ensure total allocated does not exceed received
        allocated = self.available_quantity + self.reserved_quantity + self.dispatched_quantity
        if allocated > self.received_quantity:
            raise ValidationError(
                _("Allocated quantity cannot exceed received quantity.")
            )

    def save(self, *args, **kwargs):
        self.clean()
        # If unit not set, copy from batch
        if not self.unit:
            self.unit = self.batch.unit
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.warehouse.warehouse_name} - {self.batch.ingredient.name} ({self.batch.public_id})"

    @property
    def total_allocated(self):
        return self.available_quantity + self.reserved_quantity + self.dispatched_quantity

    @property
    def is_low_stock(self):
        # Define low stock threshold as 10% of received quantity or 10 units, whichever is greater
        from decimal import Decimal
        threshold = max(self.received_quantity * Decimal('0.1'), Decimal('10'))
        return self.available_quantity < threshold


class WarehouseStockMovement(TimeStampedModel):
    class MovementType(models.TextChoices):
        RECEIVE = "RECEIVE", "Receive"
        RESERVE = "RESERVE", "Reserve"
        RELEASE = "RELEASE", "Release"
        DISPATCH = "DISPATCH", "Dispatch"
        ADJUSTMENT = "ADJUSTMENT", "Adjustment"
        SPOILAGE = "SPOILAGE", "Spoilage"
        EXPIRY = "EXPIRY", "Expiry"

    warehouse_inventory = models.ForeignKey(WarehouseInventory, on_delete=models.CASCADE, related_name="stock_movements")
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    movement_type = models.CharField(max_length=20, choices=MovementType.choices)
    timestamp = models.DateTimeField(auto_now_add=True)
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="warehouse_stock_movements")
    note = models.CharField(max_length=255, blank=True)

    def save(self, *args, **kwargs):
        # Update inventory quantities based on movement type
        inventory = self.warehouse_inventory
        if self.movement_type == self.MovementType.RECEIVE:
            # Receive increases received_quantity and available_quantity
            inventory.received_quantity += self.quantity
            inventory.available_quantity += self.quantity
        elif self.movement_type == self.MovementType.RESERVE:
            # Reserve moves from available to reserved
            if inventory.available_quantity < self.quantity:
                raise ValidationError(_("Not enough available stock to reserve."))
            inventory.available_quantity -= self.quantity
            inventory.reserved_quantity += self.quantity
        elif self.movement_type == self.MovementType.RELEASE:
            # Release moves from reserved to available
            if inventory.reserved_quantity < self.quantity:
                raise ValidationError(_("Not enough reserved stock to release."))
            inventory.reserved_quantity -= self.quantity
            inventory.available_quantity += self.quantity
        elif self.movement_type == self.MovementType.DISPATCH:
            # Dispatch moves from reserved to dispatched (or available if not reserved?)
            # We'll assume dispatch from reserved stock
            if inventory.reserved_quantity < self.quantity:
                raise ValidationError(_("Not enough reserved stock to dispatch."))
            inventory.reserved_quantity -= self.quantity
            inventory.dispatched_quantity += self.quantity
        elif self.movement_type == self.MovementType.ADJUSTMENT:
            # Adjustment can be positive or negative; we'll add to available
            inventory.available_quantity += self.quantity
            # Ensure available doesn't go negative
            if inventory.available_quantity < 0:
                raise ValidationError(_("Adjustment would make available quantity negative."))
        elif self.movement_type == self.MovementType.SPOILAGE:
            # Spoilage reduces available quantity
            if inventory.available_quantity < self.quantity:
                raise ValidationError(_("Not enough available stock for spoilage."))
            inventory.available_quantity -= self.quantity
        elif self.movement_type == self.MovementType.EXPIRY:
            # Expiry reduces available quantity
            if inventory.available_quantity < self.quantity:
                raise ValidationError(_("Not enough available stock for expiry."))
            inventory.available_quantity -= self.quantity
            inventory.inventory_status = WarehouseInventory.InventoryStatus.EXPIRED
        # Update inventory status based on quantities
        self._update_inventory_status(inventory)
        inventory.save()
        super().save(*args, **kwargs)

    def _update_inventory_status(self, inventory):
        """Update inventory status based on current quantities."""
        if inventory.dispatched_quantity >= inventory.received_quantity:
            inventory.inventory_status = WarehouseInventory.InventoryStatus.DISPATCHED
        elif inventory.available_quantity <= 0:
            inventory.inventory_status = WarehouseInventory.InventoryStatus.OUT_OF_STOCK
        elif inventory.reserved_quantity > 0:
            inventory.inventory_status = WarehouseInventory.InventoryStatus.RESERVED
        else:
            inventory.inventory_status = WarehouseInventory.InventoryStatus.AVAILABLE

    def __str__(self):
        return f"{self.movement_type} {self.quantity} {self.warehouse_inventory.unit} for {self.warehouse_inventory.batch.public_id}"