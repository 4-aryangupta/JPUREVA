from django.core.management.base import BaseCommand
from datetime import date

from apps.accounts.models import HotelProfile, LabProfile, SupplierProfile, User
from apps.catalog.models import Category, Ingredient
from apps.hotels.models import SubscriptionPlan
from apps.labs.models import TestType, VerificationRequest, Certificate
from apps.suppliers.models import Batch
from apps.traceability.models import ColdChainLog
from apps.notifications.models import Notification
from django.db import transaction
from django.utils import timezone


class Command(BaseCommand):
    help = "Seed demo catalog data, test types, subscription plans, and one demo user per role, plus a pre-seeded verified batch for demo."

    def handle(self, *args, **options):
        self._seed_catalog()
        self._seed_test_types()
        self._seed_subscription_plans()
        self._seed_demo_users()
        self._seed_demo_batch()
        self.stdout.write(self.style.SUCCESS("Demo data seeded."))

    def _seed_catalog(self):
        data = {
            "Dairy": [("A2 Cow Milk", "litre", 1, 2), ("Paneer", "kg", 1, 3), ("Curd", "kg", 1, 2)],
            "Vegetables": [("Tomato", "kg", 60, 90), ("Spinach", "kg", 30, 45), ("Potato", "kg", 70, 120)],
            "Spices": [("Turmeric", "kg", 210, 270), ("Red Chilli", "kg", 150, 180)],
            "Meat": [("Chicken", "kg", 35, 45), ("Mutton", "kg", 180, 365)],
        }
        icons = {"Dairy": "leaf", "Vegetables": "leaf", "Spices": "leaf", "Meat": "truck"}
        for cat_name, ingredients in data.items():
            category, _ = Category.objects.get_or_create(name=cat_name, defaults={"icon": icons[cat_name]})
            for name, unit, min_days, max_days in ingredients:
                Ingredient.objects.get_or_create(
                    category=category,
                    name=name,
                    defaults={
                        "unit_default": unit,
                        "expected_min_harvest_days": min_days,
                        "expected_max_harvest_days": max_days,
                    },
                )

    def _seed_test_types(self):
        for name, desc in [
            ("Adulteration", "Tests for common adulterants"),
            ("Heavy Metals", "Lead, mercury, arsenic, cadmium screening"),
            ("Microbiological", "Bacterial/fungal contamination screening"),
        ]:
            TestType.objects.get_or_create(name=name, defaults={"description": desc})

    def _seed_subscription_plans(self):
        plans = [
            ("BASIC", 999, 9999, {"max_trust_badges": 1, "priority_support": False, "api_access": False}),
            ("PROFESSIONAL", 2999, 29999, {"max_trust_badges": 3, "priority_support": True, "api_access": False}),
            ("ENTERPRISE", 7999, 79999, {"max_trust_badges": 10, "priority_support": True, "api_access": True}),
        ]
        for name, monthly, annual, features in plans:
            SubscriptionPlan.objects.get_or_create(
                name=name,
                defaults={"price_monthly": monthly, "price_annual": annual, "features": features},
            )

    def _seed_demo_users(self):
        if not User.objects.filter(email="admin@jpureva.com").exists():
            admin = User.objects.create_superuser(
                username="admin@jpureva.com", email="admin@jpureva.com", password="adminpass123"
            )
            admin.role = User.Role.ADMIN
            admin.approval_status = User.ApprovalStatus.APPROVED
            admin.save()

        if not User.objects.filter(email="demo.supplier@jpureva.com").exists():
            u = User.objects.create_user(
                username="demo.supplier@jpureva.com", email="demo.supplier@jpureva.com",
                password="demopass123", role=User.Role.SUPPLIER,
                approval_status=User.ApprovalStatus.APPROVED,
            )
            SupplierProfile.objects.create(
                user=u, fpo_name="Amber Dairy FPO, Jaipur",
                fssai_license_number="FSSAI-DEMO-001", state="Rajasthan", district="Jaipur",
            )

        if not User.objects.filter(email="demo.lab@jpureva.com").exists():
            u = User.objects.create_user(
                username="demo.lab@jpureva.com", email="demo.lab@jpureva.com",
                password="demopass123", role=User.Role.LAB,
                approval_status=User.ApprovalStatus.APPROVED,
            )
            LabProfile.objects.create(
                user=u, lab_name="Jaipur NABL Lab", nabl_accreditation_number="NABL-T-DEMO-001",
            )

        if not User.objects.filter(email="demo.hotel@jpureva.com").exists():
            u = User.objects.create_user(
                username="demo.hotel@jpureva.com", email="demo.hotel@jpureva.com",
                password="demopass123", role=User.Role.HOTEL,
            )
            HotelProfile.objects.create(user=u, business_name="The Jaipur Palace", city="Jaipur")

    def _seed_demo_batch(self):
        # Create a batch for the supplier (Amber Dairy FPO, Jaipur) with Paneer
        # Only create if no such batch exists (idempotent)
        supplier_user = User.objects.get(email="demo.supplier@jpureva.com")
        supplier_profile = supplier_user.supplier_profile
        ingredient = Ingredient.objects.get(name="Paneer")

        if not Batch.objects.filter(ingredient=ingredient, supplier=supplier_profile).exists():
            batch = Batch.objects.create(
                supplier=supplier_profile,
                ingredient=ingredient,
                quantity=50.0,  # 50 kg
                unit="kg",
                sowing_date=date(2026, 8, 1),
                harvest_date=date(2026, 8, 10),
                status=Batch.Status.DRAFT,
            )

            # Request verification for all test types
            vr = VerificationRequest.objects.create(
                batch=batch,
                requested_by=supplier_user,
            )
            vr.requested_tests.set(TestType.objects.all())
            batch.status = Batch.Status.PENDING_VERIFICATION
            batch.save(update_fields=["status"])

            # Create a certificate (lab is the demo lab)
            lab_user = User.objects.get(email="demo.lab@jpureva.com")
            lab_profile = lab_user.lab_profile
            certificate_number = f"JPV-{batch.public_id}-{int(timezone.now().timestamp())}"
            certificate = Certificate.objects.create(
                verification_request=vr,
                batch=batch,
                lab=lab_profile,
                certificate_number=certificate_number,
                test_results={
                    "adulteration": "negative",
                    "heavy_metals": "within limits",
                    "microbiological": "negative",
                },
                overall_result=Certificate.OverallResult.PASS,
                shelf_life_days=7,
            )

            # Update verification request and batch status
            vr.status = VerificationRequest.Status.COMPLETED
            vr.lab = lab_profile
            vr.save(update_fields=["status", "lab"])

            batch.status = Batch.Status.VERIFIED
            # Generate QR code (simplified: we'll just set a placeholder; in reality the signal or view does this)
            # For simplicity, we'll leave qr_image blank; the view will generate on demand.
            batch.save(update_fields=["status"])

            # Optionally, we could also create a cold chain log to show some data
            ColdChainLog.objects.create(
                batch=batch,
                recorded_by=supplier_user,
                temperature_min=4.0,
                temperature_max=8.0,
                humidity_min=60,
                humidity_max=80,
            )
        else:
            self.stdout.write("Demo batch already exists, skipping.")