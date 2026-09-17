from rest_framework import serializers

from .models import ColdChainLog, TrustBadge


class ColdChainLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColdChainLog
        fields = [
            "id", "batch", "stage", "location_name", "temperature_c", "humidity_pct",
            "recorded_at", "is_within_threshold", "notes", "created_at",
        ]
        read_only_fields = ["id", "is_within_threshold", "created_at"]


class TrustBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrustBadge
        fields = ["id", "hotel", "public_slug", "qr_image", "is_active", "regenerated_at", "created_at"]
        read_only_fields = ["id", "hotel", "public_slug", "qr_image", "regenerated_at", "created_at"]


class PublicColdChainLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColdChainLog
        fields = ["stage", "location_name", "temperature_c", "humidity_pct", "recorded_at", "is_within_threshold"]


class PublicCertificateSerializer(serializers.Serializer):
    certificate_number = serializers.CharField()
    overall_result = serializers.CharField()
    nabl_accreditation_number = serializers.CharField(source="lab.nabl_accreditation_number")
    lab_name = serializers.CharField(source="lab.lab_name")
    issued_at = serializers.DateTimeField()
    shelf_life_days = serializers.IntegerField()
    test_results = serializers.JSONField()
    integrity_hash = serializers.CharField()
    signed_stamp = serializers.CharField()


class PublicBatchScanSerializer(serializers.Serializer):
    """Deliberately excludes price, ledger, and private contact fields."""

    public_id = serializers.CharField()
    ingredient_name = serializers.CharField(source="ingredient.name")
    category_name = serializers.CharField(source="ingredient.category.name")
    quantity = serializers.DecimalField(max_digits=10, decimal_places=2)
    unit = serializers.CharField()
    sowing_date = serializers.DateField()
    harvest_date = serializers.DateField()
    is_growth_anomaly = serializers.BooleanField()
    fpo_name = serializers.CharField(source="supplier.fpo_name")
    fpo_region = serializers.SerializerMethodField()
    status = serializers.CharField()
    photos = serializers.SerializerMethodField()
    coldchain_logs = serializers.SerializerMethodField()
    certificate = serializers.SerializerMethodField()

    def get_fpo_region(self, obj):
        return ", ".join(filter(None, [obj.supplier.district, obj.supplier.state]))

    def get_photos(self, obj):
        return [
            {
                "image": p.image.url if p.image else None,
                "latitude": p.latitude,
                "longitude": p.longitude,
                "captured_at": p.captured_at,
                "exif_locked": p.exif_locked,
            }
            for p in obj.photos.all()
        ]

    def get_coldchain_logs(self, obj):
        return PublicColdChainLogSerializer(obj.coldchain_logs.all(), many=True).data

    def get_certificate(self, obj):
        cert = obj.certificates.filter(is_valid=True).order_by("-issued_at").first()
        if not cert:
            return None
        return PublicCertificateSerializer(cert).data


class PublicTrustBadgeSerializer(serializers.Serializer):
    business_name = serializers.CharField(source="hotel.business_name")
    city = serializers.CharField(source="hotel.city")
    is_active = serializers.BooleanField()
