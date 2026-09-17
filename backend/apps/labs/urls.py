from django.urls import path

from .views import (
    CertificateCreateView,
    CertificateDetailView,
    CertificateListView,
    InvoiceListView,
    InvoiceMarkPaidView,
    LabAnalyticsView,
    TestTypeListView,
    VerificationRequestListView,
    VerificationRequestUpdateView,
)

urlpatterns = [
    path("test-types/", TestTypeListView.as_view(), name="test-types"),
    path("verification-requests/", VerificationRequestListView.as_view(), name="verification-requests"),
    path("verification-requests/<int:pk>/", VerificationRequestUpdateView.as_view(), name="verification-request-detail"),
    path("verification-requests/<int:request_id>/certificate/", CertificateCreateView.as_view(), name="certificate-create"),
    path("certificates/", CertificateListView.as_view(), name="certificate-list"),
    path("certificates/<int:pk>/", CertificateDetailView.as_view(), name="certificate-detail"),
    path("invoices/", InvoiceListView.as_view(), name="invoices"),
    path("invoices/<int:invoice_id>/mark-paid/", InvoiceMarkPaidView.as_view(), name="invoice-mark-paid"),
    path("analytics/", LabAnalyticsView.as_view(), name="lab-analytics"),
]
