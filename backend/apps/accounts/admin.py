from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import HotelProfile, LabProfile, SupplierProfile, User


@admin.register(User)
class JPurevaUserAdmin(UserAdmin):
    list_display = ("email", "username", "role", "approval_status", "is_active", "is_staff")
    list_filter = ("role", "approval_status", "is_active")
    fieldsets = UserAdmin.fieldsets + (
        ("JPureva", {"fields": ("role", "approval_status", "phone")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("JPureva", {"fields": ("email", "role", "approval_status", "phone")}),
    )
    ordering = ("email",)


@admin.register(SupplierProfile)
class SupplierProfileAdmin(admin.ModelAdmin):
    list_display = ("fpo_name", "user", "fssai_license_number", "state", "approved_at")
    search_fields = ("fpo_name", "user__email")


@admin.register(LabProfile)
class LabProfileAdmin(admin.ModelAdmin):
    list_display = ("lab_name", "user", "nabl_accreditation_number", "approved_at")
    search_fields = ("lab_name", "user__email")


@admin.register(HotelProfile)
class HotelProfileAdmin(admin.ModelAdmin):
    list_display = ("business_name", "user", "city")
    search_fields = ("business_name", "user__email")
