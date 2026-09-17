from django.urls import path

from .views import (
    AdminItemDetailView,
    AdminItemListCreateView,
    AnalyticsOverviewView,
    ApproveOrderView,
    ApproveUserView,
    AuditLogListView,
    CatalogCategoryListCreateView,
    PendingApprovalsView,
    PendingOrdersView,
    RejectOrderView,
    RejectUserView,
    UserListView,
)

urlpatterns = [
    # "Approvals" in the admin panel means hotel checkout orders awaiting admin sign-off,
    # not new supplier/lab accounts (self-registration for those roles is disabled — see
    # apps/accounts/urls.py). The old user-approval endpoints are kept, unused, under
    # approvals/users/ in case supplier/lab onboarding is reintroduced later.
    path("approvals/", PendingOrdersView.as_view(), name="pending-order-approvals"),
    path("approvals/<int:order_id>/approve/", ApproveOrderView.as_view(), name="approve-order"),
    path("approvals/<int:order_id>/reject/", RejectOrderView.as_view(), name="reject-order"),
    path("approvals/users/", PendingApprovalsView.as_view(), name="pending-user-approvals"),
    path("approvals/users/<int:user_id>/approve/", ApproveUserView.as_view(), name="approve-user"),
    path("approvals/users/<int:user_id>/reject/", RejectUserView.as_view(), name="reject-user"),
    path("analytics/overview/", AnalyticsOverviewView.as_view(), name="analytics-overview"),
    path("users/", UserListView.as_view(), name="admin-users"),
    path("audit-log/", AuditLogListView.as_view(), name="audit-log"),
    path("catalog/categories/", CatalogCategoryListCreateView.as_view(), name="admin-catalog-categories"),
    path("catalog/items/", AdminItemListCreateView.as_view(), name="admin-catalog-items"),
    path("catalog/items/<uuid:pk>/", AdminItemDetailView.as_view(), name="admin-catalog-item-detail"),
]
