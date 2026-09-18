from django.core.management.base import BaseCommand
from datetime import date, timedelta

from apps.accounts.models import HotelProfile, LabProfile, SupplierProfile, User, WarehouseProfile
from apps.catalog.models import Category, Ingredient
from apps.hotels.models import SubscriptionPlan
from apps.labs.models import TestType, VerificationRequest, Certificate
from apps.suppliers.models import Batch
from apps.traceability.models import ColdChainLog
from apps.notifications.models import Notification
from apps.warehouse.models import WarehouseInventory, WarehouseStockMovement
from django.db import transaction
from django.utils import timezone


class Command(BaseCommand):
    help = "Seed demo catalog data, test types, subscription plans, and one demo user per role, plus a pre-seeded verified batch for demo."

    def handle(self, *args, **options):
        self._seed_catalog()
        self._seed_test_types()
        self._seed_subscription_plans()
        self._seed_demo_users()
        self._seed_warehouse_users()
        self._seed_demo_batch()
        self._seed_warehouse_inventory()
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

    def _seed_warehouse_users(self):
        if not User.objects.filter(email="warehouse1@jpureva.com").exists():
            u = User.objects.create_user(
                username="warehouse1@jpureva.com", email="warehouse1@jpureva.com",
                password="demopass123", role=User.Role.WAREHOUSE,
                approval_status=User.ApprovalStatus.APPROVED,
            )
            WarehouseProfile.objects.create(
                user=u, warehouse_name="Jaipur Central Warehouse", warehouse_code="JAIPUR-WH-01",
                address="123 Industrial Area", city="Jaipur", state="Rajasthan",
                contact_person="Ramesh Kumar", contact_phone="9876543210",
                storage_type="Cold Storage", is_active=True,
            )

        if not User.objects.filter(email="warehouse2@jpureva.com").exists():
            u = User.objects.create_user(
                username="warehouse2@jpureva.com", email="warehouse2@jpureva.com",
                password="demopass123", role=User.Role.WAREHOUSE,
                approval_status=User.ApprovalStatus.APPROVED,
            )
            WarehouseProfile.objects.create(
                user=u, warehouse_name="Jaipur West Warehouse", warehouse_code="JAIPUR-WH-02",
                address="456 Logistics Park", city="Jaipur", state="Rajasthan",
                contact_person="Sita Devi", contact_phone="8765432109",
                storage_type="Dry Storage", is_active=True,
            )

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
                stage=ColdChainLog.Stage.WAREHOUSE,
                location_name='Cold Room A',
                temperature_c=4.5,
                humidity_pct=65.0,
                recorded_by=supplier_user,
                recorded_at=timezone.now(),
            )
        else:
            self.stdout.write("Demo batch already exists, skipping.")

    def _seed_warehouse_inventory(self):
        # Get warehouse profiles
        warehouse1 = WarehouseProfile.objects.get(warehouse_code="JAIPUR-WH-01")
        warehouse2 = WarehouseProfile.objects.get(warehouse_code="JAIPUR-WH-02")

        # Get the verified batch of Paneer from supplier
        paneer_batch = Batch.objects.get(ingredient__name="Paneer", status=Batch.Status.VERIFIED)

        # Create inventory for warehouse1
        # We'll receive the full quantity
        inventory1, created = WarehouseInventory.objects.get_or_create(
            warehouse=warehouse1,
            batch=paneer_batch,
            defaults={
                'received_quantity': paneer_batch.quantity,
                'available_quantity': paneer_batch.quantity,
                'unit': paneer_batch.unit,
                'storage_location': 'Cold Room A',
                'storage_bin': 'Shelf 1',
                'inventory_status': WarehouseInventory.InventoryStatus.AVAILABLE,
            }
        )
        if not created:
            # Update if needed
            inventory1.received_quantity = paneer_batch.quantity
            inventory1.available_quantity = paneer_batch.quantity
            inventory1.save()

        # Create additional batches for other ingredients
        # We'll create a few more batches and mark them as VERIFIED
        # We'll also create inventory for them in warehouse1 and warehouse2

        # Get ingredients
        tomato = Ingredient.objects.get(name="Tomato")
        turmeric = Ingredient.objects.get(name="Turmeric")
        chicken = Ingredient.objects.get(name="Chicken")

        # Create batches
        batches_data = [
            (tomato, 100.0, "kg", date(2026, 8, 5), date(2026, 8, 20)),
            (turmeric, 50.0, "kg", date(2026, 7, 1), date(2026, 7, 30)),
            (chicken, 30.0, "kg", date(2026, 8, 1), date(2026, 8, 10)),
        ]

        for ingredient, quantity, unit, sowing_date, harvest_date in batches_data:
            batch, created = Batch.objects.get_or_create(
                ingredient=ingredient,
                supplier=paneer_batch.supplier,  # use same supplier for simplicity
                defaults={
                    'quantity': quantity,
                    'unit': unit,
                    'sowing_date': sowing_date,
                    'harvest_date': harvest_date,
                    'status': Batch.Status.VERIFIED,
                }
            )
            if not created:
                # Update status to VERIFIED if not already
                batch.status = Batch.Status.VERIFIED
                batch.save(update_fields=['status'])
            # Create inventory for warehouse1
            inv1, _ = WarehouseInventory.objects.get_or_create(
                warehouse=warehouse1,
                batch=batch,
                defaults={
                    'received_quantity': quantity,
                    'available_quantity': quantity,
                    'unit': unit,
                    'storage_location': 'Cold Room A' if ingredient.name != 'Tomato' else 'Produce Rack A1',
                    'storage_bin': 'Shelf 1',
                    'inventory_status': WarehouseInventory.InventoryStatus.AVAILABLE,
                }
            )
            # Create inventory for warehouse2 for some items
            if ingredient.name in ['Tomato', 'Chicken']:
                inv2, _ = WarehouseInventory.objects.get_or_create(
                    warehouse=warehouse2,
                    batch=batch,
                    defaults={
                        'received_quantity': quantity * 0.5,
                        'available_quantity': quantity * 0.5,
                        'unit': unit,
                        'storage_location': 'Dry Storage',
                        'storage_bin': 'Shelf 2',
                        'inventory_status': WarehouseInventory.InventoryStatus.AVAILABLE,
                    }
                )

        # Create some ColdChainLog records for warehouse inventory
        # We'll add logs for the paneer batch in warehouse1
        now = timezone.now()
        ColdChainLog.objects.create(
            batch=paneer_batch,
            stage=ColdChainLog.Stage.WAREHOUSE,
            location_name='Cold Room A',
            temperature_c=4.5,
            humidity_pct=65.0,
            recorded_by=warehouse1.user,
            recorded_at=now,
        )
        ColdChainLog.objects.create(
            batch=paneer_batch,
            stage=ColdChainLog.Stage.WAREHOUSE,
            location_name='Cold Room A',
            temperature_c=5.0,
            humidity_pct=70.0,
            recorded_by=warehouse1.user,
            recorded_at=now + timedelta(minutes=5),
        )
        # Intentionally create an alert reading
        ColdChainLog.objects.create(
            batch=paneer_batch,
            stage=ColdChainLog.Stage.WAREHOUSE,
            location_name='Cold Room A',
            temperature_c=9.0,  # above threshold
            humidity_pct=85.0,
            recorded_by=warehouse1.user,
            recorded_at=now + timedelta(minutes=10),
        )
        # Then a normal reading
        ColdChainLog.objects.create(
            batch=paneer_batch,
            stage=ColdChainLog.Stage.WAREHOUSE,
            location_name='Cold Room A',
            temperature_c=4.0,
            humidity_pct=60.0,
            recorded_by=warehouse1.user,
            recorded_at=now + timedelta(minutes=15),
        )