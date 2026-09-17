from django.db.models import Avg, DurationField, ExpressionWrapper, F
from django.utils import timezone
from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.permissions import IsApprovedRole, IsLab
from apps.notifications.models import Notification
from apps.suppliers.models import Batch
from apps.traceability.qr_utils import batch_scan_url, generate_qr_file

from .models import Certificate, Invoice, TestType, VerificationRequest
from .serializers import (
    CertificateSerializer,
    InvoiceSerializer,
    TestTypeSerializer,
    VerificationRequestSerializer,
)


class TestTypeListView(generics.ListAPIView):
    queryset = TestType.objects.all()
    serializer_class = TestTypeSerializer
    permission_classes = [permissions.IsAuthenticated]


class VerificationRequestListView(generics.ListAPIView):
    serializer_class = VerificationRequestSerializer
    permission_classes = [IsLab]

    def get_queryset(self):
        user = self.request.user
        qs = VerificationRequest.objects.select_related("batch__ingredient", "batch__supplier")
        if user.role != "ADMIN":
            lab = user.lab_profile
            qs = qs.filter(models_q_unclaimed_or_own(lab))
        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)
        return qs.order_by("-created_at")


def models_q_unclaimed_or_own(lab):
    from django.db.models import Q

    return Q(lab__isnull=True) | Q(lab=lab)


class VerificationRequestUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = VerificationRequestSerializer
    permission_classes = [IsLab, IsApprovedRole]

    def get_queryset(self):
        return VerificationRequest.objects.all()

    def perform_update(self, serializer):
        vr = self.get_object()
        if vr.lab_id is None:
            serializer.save(lab=self.request.user.lab_profile)
        else:
            serializer.save()


class CertificateCreateView(APIView):
    permission_classes = [IsLab, IsApprovedRole]

    def post(self, request, request_id):
        vr = VerificationRequest.objects.select_related("batch").get(id=request_id)
        if hasattr(vr, "certificate"):
            raise ValidationError("A certificate already exists for this verification request.")

        lab = request.user.lab_profile
        certificate_number = f"JPV-{vr.batch.public_id}-{int(timezone.now().timestamp())}"
        certificate = Certificate.objects.create(
            verification_request=vr,
            batch=vr.batch,
            lab=lab,
            certificate_number=certificate_number,
            test_results=request.data.get("test_results", {}),
            overall_result=request.data.get("overall_result", Certificate.OverallResult.PASS),
            shelf_life_days=request.data.get("shelf_life_days"),
        )

        vr.status = VerificationRequest.Status.COMPLETED
        vr.lab = lab
        vr.save(update_fields=["status", "lab"])

        batch = vr.batch
        if certificate.overall_result in (Certificate.OverallResult.PASS, Certificate.OverallResult.CONDITIONAL):
            batch.status = Batch.Status.VERIFIED
            qr_file = generate_qr_file(batch_scan_url(batch.public_id), f"{batch.public_id}.png")
            batch.qr_image.save(qr_file.name, qr_file, save=False)
        else:
            batch.status = Batch.Status.REJECTED
        batch.save(update_fields=["status", "qr_image"])

        testing_fee = request.data.get("testing_fee")
        if testing_fee:
            Invoice.objects.create(
                verification_request=vr,
                lab=lab,
                supplier=batch.supplier,
                amount=testing_fee,
            )

        Notification.objects.create(
            recipient=vr.requested_by,
            notif_type=Notification.NotifType.LAB_RESULT_READY,
            title=f"Lab results ready for batch {batch.public_id}",
            body=f"Result: {certificate.overall_result}",
            link_url=f"/supplier/batches/{batch.id}",
        )

        return Response(CertificateSerializer(certificate).data, status=201)


class CertificateListView(generics.ListAPIView):
    serializer_class = CertificateSerializer
    permission_classes = [IsLab]

    def get_queryset(self):
        user = self.request.user
        qs = Certificate.objects.select_related("batch__ingredient", "lab").order_by("-issued_at")
        if user.role != "ADMIN":
            qs = qs.filter(lab=user.lab_profile)
        return qs


class CertificateDetailView(generics.RetrieveAPIView):
    serializer_class = CertificateSerializer
    queryset = Certificate.objects.all()
    permission_classes = [IsLab]


class InvoiceListView(generics.ListAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [IsLab]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return Invoice.objects.all().order_by("-issued_at")
        return Invoice.objects.filter(lab=user.lab_profile).order_by("-issued_at")


class InvoiceMarkPaidView(APIView):
    permission_classes = [IsLab]

    def post(self, request, invoice_id):
        invoice = Invoice.objects.get(id=invoice_id, lab=request.user.lab_profile)
        invoice.status = Invoice.Status.PAID
        invoice.paid_at = timezone.now()
        invoice.save(update_fields=["status", "paid_at"])
        return Response(InvoiceSerializer(invoice).data)


class LabAnalyticsView(APIView):
    permission_classes = [IsLab]

    def get(self, request):
        lab = request.user.lab_profile
        certs = Certificate.objects.filter(lab=lab)
        total = certs.count()
        passed = certs.filter(overall_result=Certificate.OverallResult.PASS).count()
        failed = certs.filter(overall_result=Certificate.OverallResult.FAIL).count()

        turnaround = (
            VerificationRequest.objects.filter(lab=lab, status=VerificationRequest.Status.COMPLETED)
            .annotate(
                turnaround_time=ExpressionWrapper(
                    F("updated_at") - F("created_at"), output_field=DurationField()
                )
            )
            .aggregate(avg=Avg("turnaround_time"))["avg"]
        )
        avg_hours = turnaround.total_seconds() / 3600 if turnaround else None

        return Response({
            "tests_completed": total,
            "pass_count": passed,
            "fail_count": failed,
            "pass_rate": round(passed / total * 100, 1) if total else None,
            "avg_turnaround_hours": round(avg_hours, 1) if avg_hours is not None else None,
        })
