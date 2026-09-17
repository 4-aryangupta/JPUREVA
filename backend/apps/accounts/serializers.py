from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import HotelProfile, LabProfile, SupplierProfile, User

# Allow all approved roles to log in (supplier/lab enabled for demo)
LOGIN_ALLOWED_ROLES = (User.Role.HOTEL, User.Role.ADMIN, User.Role.SUPPLIER, User.Role.LAB)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["approval_status"] = user.approval_status
        token["email"] = user.email
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        if self.user.role not in LOGIN_ALLOWED_ROLES:
            raise AuthenticationFailed("This account type isn't available right now.")
        return data


class RegisterSupplierSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    fpo_name = serializers.CharField()
    registration_number = serializers.CharField(required=False, allow_blank=True)
    fssai_license_number = serializers.CharField()
    business_docs = serializers.FileField(required=False)
    address = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    district = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            "email", "password", "phone",
            "fpo_name", "registration_number", "fssai_license_number",
            "business_docs", "address", "state", "district",
        ]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        profile_fields = {
            "fpo_name": validated_data.pop("fpo_name"),
            "registration_number": validated_data.pop("registration_number", ""),
            "fssai_license_number": validated_data.pop("fssai_license_number"),
            "business_docs": validated_data.pop("business_docs", None),
            "address": validated_data.pop("address", ""),
            "state": validated_data.pop("state", ""),
            "district": validated_data.pop("district", ""),
        }
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
            phone=validated_data.get("phone", ""),
            role=User.Role.SUPPLIER,
            approval_status=User.ApprovalStatus.PENDING,
        )
        SupplierProfile.objects.create(user=user, **profile_fields)
        return user

    def to_representation(self, instance):
        return {
            "id": instance.id, "email": instance.email,
            "role": instance.role, "approval_status": instance.approval_status,
        }


class RegisterLabSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    lab_name = serializers.CharField()
    nabl_accreditation_number = serializers.CharField()
    nabl_valid_till = serializers.DateField(required=False, allow_null=True)
    accreditation_cert_file = serializers.FileField(required=False)
    address = serializers.CharField(required=False, allow_blank=True)
    contact_person = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            "email", "password", "phone",
            "lab_name", "nabl_accreditation_number", "nabl_valid_till",
            "accreditation_cert_file", "address", "contact_person",
        ]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        profile_fields = {
            "lab_name": validated_data.pop("lab_name"),
            "nabl_accreditation_number": validated_data.pop("nabl_accreditation_number"),
            "nabl_valid_till": validated_data.pop("nabl_valid_till", None),
            "accreditation_cert_file": validated_data.pop("accreditation_cert_file", None),
            "address": validated_data.pop("address", ""),
            "contact_person": validated_data.pop("contact_person", ""),
        }
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
            phone=validated_data.get("phone", ""),
            role=User.Role.LAB,
            approval_status=User.ApprovalStatus.PENDING,
        )
        LabProfile.objects.create(user=user, **profile_fields)
        return user

    def to_representation(self, instance):
        return {
            "id": instance.id, "email": instance.email,
            "role": instance.role, "approval_status": instance.approval_status,
        }


class RegisterHotelSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    business_name = serializers.CharField()
    fssai_license_number = serializers.CharField(required=False, allow_blank=True)
    gstin = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    cuisine_type = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            "email", "password", "phone",
            "business_name", "fssai_license_number", "gstin",
            "address", "city", "cuisine_type",
        ]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        profile_fields = {
            "business_name": validated_data.pop("business_name"),
            "fssai_license_number": validated_data.pop("fssai_license_number", ""),
            "gstin": validated_data.pop("gstin", ""),
            "address": validated_data.pop("address", ""),
            "city": validated_data.pop("city", ""),
            "cuisine_type": validated_data.pop("cuisine_type", ""),
        }
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
            phone=validated_data.get("phone", ""),
            role=User.Role.HOTEL,
            approval_status=User.ApprovalStatus.APPROVED,
        )
        HotelProfile.objects.create(user=user, **profile_fields)
        return user

    def to_representation(self, instance):
        return {
            "id": instance.id, "email": instance.email,
            "role": instance.role, "approval_status": instance.approval_status,
        }


class SupplierProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierProfile
        exclude = ["user"]


class LabProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabProfile
        exclude = ["user"]


class HotelProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelProfile
        exclude = ["user"]


class MeSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "email", "phone", "role", "approval_status", "profile"]

    def get_profile(self, obj):
        if obj.role == User.Role.SUPPLIER and hasattr(obj, "supplier_profile"):
            return SupplierProfileSerializer(obj.supplier_profile).data
        if obj.role == User.Role.LAB and hasattr(obj, "lab_profile"):
            return LabProfileSerializer(obj.lab_profile).data
        if obj.role == User.Role.HOTEL and hasattr(obj, "hotel_profile"):
            return HotelProfileSerializer(obj.hotel_profile).data
        return None
