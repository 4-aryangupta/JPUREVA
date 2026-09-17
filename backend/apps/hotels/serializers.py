from rest_framework import serializers

from .models import ComplianceDocument, HotelSubscription, SubscriptionPlan


class ComplianceDocumentSerializer(serializers.ModelSerializer):
    status = serializers.CharField(read_only=True)

    class Meta:
        model = ComplianceDocument
        fields = ["id", "hotel", "doc_type", "file", "issued_date", "expiry_date", "status", "created_at"]
        read_only_fields = ["id", "hotel", "created_at"]


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = ["id", "name", "price_monthly", "price_annual", "features"]


class HotelSubscriptionSerializer(serializers.ModelSerializer):
    plan_detail = SubscriptionPlanSerializer(source="plan", read_only=True)

    class Meta:
        model = HotelSubscription
        fields = ["id", "hotel", "plan", "plan_detail", "status", "started_at", "expires_at", "auto_renew"]
        read_only_fields = ["id", "hotel", "status", "started_at"]
