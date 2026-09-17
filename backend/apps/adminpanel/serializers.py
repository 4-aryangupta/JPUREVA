from rest_framework import serializers

from apps.accounts.models import User

from .models import AuditLog


class PendingUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "role", "approval_status", "date_joined"]


class AuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, default=None)

    class Meta:
        model = AuditLog
        fields = ["id", "actor", "actor_email", "action", "target_type", "target_id", "metadata", "created_at"]
