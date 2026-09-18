from django.urls import path
from . import views

app_name = 'warehouse'

urlpatterns = [
    # Warehouse profile
    path('profile/', views.WarehouseProfileView.as_view(), name='warehouse-profile'),

    # Inventory management
    path('inventory/', views.WarehouseInventoryListView.as_view(), name='inventory-list'),
    path('inventory/<int:pk>/', views.WarehouseInventoryDetailView.as_view(), name='inventory-detail'),

    # Stock movements
    path('movements/', views.WarehouseStockMovementListView.as_view(), name='movement-list'),

    # Inventory operations
    path('receive/', views.receive_inventory, name='receive-inventory'),
    path('reserve/', views.reserve_stock, name='reserve-stock'),
    path('dispatch/', views.dispatch_stock, name='dispatch-stock'),
    path('release/', views.release_stock, name='release-stock'),

    # Dashboard and reports
    path('dashboard/', views.warehouse_dashboard, name='warehouse-dashboard'),
    path('cold-chain-logs/', views.cold_chain_logs, name='cold-chain-logs'),
]