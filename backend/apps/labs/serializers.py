from rest_framework import serializers

from .models import Certificate, Invoice, TestType, VerificationRequest


class TestTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestType
        fields = ["id", "name", "description"]


class VerificationRequestSerializer(serializers.ModelSerializer):
    batch_public_id = serializers.CharField(source="batch.public_id", read_only=True)
    ingredient_name = serializers.CharField(source="batch.ingredient.name", read_only=True)
    supplier_name = serializers.CharField(source="batch.supplier.fpo_name", read_only=True)
    requested_tests = TestTypeSerializer(many=True, read_only=True)

    class Meta:
        model = VerificationRequest
        fields = [
            "id", "batch", "batch_public_id", "ingredient_name", "supplier_name",
            "requested_by", "lab", "requested_tests", "status", "notes", "created_at",
        ]
        read_only_fields = ["id", "batch", "requested_by", "created_at"]


class CertificateSerializer(serializers.ModelSerializer):
    batch_public_id = serializers.CharField(source="batch.public_id", read_only=True)
    ingredient_name = serializers.CharField(source="batch.ingredient.name", read_only=True)

    class Meta:
        model = Certificate
        fields = [
            "id", "verification_request", "batch", "batch_public_id", "ingredient_name", "lab",
            "certificate_number", "test_results", "overall_result", "shelf_life_days", "integrity_hash",
            "signed_stamp", "pdf_file", "issued_at", "is_valid",
        ]
        read_only_fields = ["id", "batch", "lab", "integrity_hash", "signed_stamp", "issued_at"]


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = [
            "id", "verification_request", "lab", "supplier", "amount",
            "status", "issued_at", "paid_at",
        ]
        read_only_fields = ["id", "lab", "supplier", "issued_at"]
