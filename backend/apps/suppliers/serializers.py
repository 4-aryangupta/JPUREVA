from rest_framework import serializers

from .exif_utils import extract_geo_and_timestamp
from .models import Batch, GeoTaggedPhoto, LedgerEntry


class GeoTaggedPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeoTaggedPhoto
        fields = ["id", "batch", "image", "latitude", "longitude", "captured_at", "exif_locked", "created_at"]
        read_only_fields = ["latitude", "longitude", "captured_at", "exif_locked"]

    def create(self, validated_data):
        image = validated_data["image"]
        lat, lng, captured_at, locked = extract_geo_and_timestamp(image)
        return GeoTaggedPhoto.objects.create(
            latitude=lat, longitude=lng, captured_at=captured_at, exif_locked=locked, **validated_data
        )


class BatchSerializer(serializers.ModelSerializer):
    photos = GeoTaggedPhotoSerializer(many=True, read_only=True)
    ingredient_name = serializers.CharField(source="ingredient.name", read_only=True)
    supplier_name = serializers.CharField(source="supplier.fpo_name", read_only=True)

    class Meta:
        model = Batch
        fields = [
            "id", "public_id", "supplier", "supplier_name", "ingredient", "ingredient_name",
            "quantity", "unit", "sowing_date", "harvest_date", "actual_harvest_days",
            "is_growth_anomaly", "status", "price_per_unit", "available_quantity",
            "qr_image", "photos", "created_at",
        ]
        read_only_fields = [
            "id", "public_id", "supplier", "actual_harvest_days", "is_growth_anomaly",
            "status", "qr_image",
        ]

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["supplier"] = request.user.supplier_profile
        return super().create(validated_data)


class LedgerEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LedgerEntry
        fields = ["id", "supplier", "order_item", "entry_type", "amount", "status", "note", "created_at"]
        read_only_fields = ["id", "supplier", "created_at"]
