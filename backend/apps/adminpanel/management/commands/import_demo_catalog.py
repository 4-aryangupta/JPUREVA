import json
import urllib.request
from pathlib import Path

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from apps.catalog.models import Category, Ingredient
from apps.suppliers.exif_utils import extract_geo_and_timestamp
from apps.suppliers.models import Batch, GeoTaggedPhoto

from ...views import _get_direct_supplier

CATEGORY_MAP = {
    "vegetables": "Vegetables",
    "grains-pulses": "Grains",
    "spices": "Spices",
    "dairy-oils": "Dairy",
    "meats-dryfruits": "Meat",
}
UNIT_MAP = {"kg": "kg", "Litre": "litre", "Dozen": "dozen"}

DATA_FILE = Path(__file__).resolve().parent / "_demo_catalog_data.json"


class Command(BaseCommand):
    help = (
        "One-off import of the /products marketing page's 50 demo items into the real "
        "admin catalog (Ingredient + LISTED Batch under the JPureva Direct system "
        "supplier, with images), so they show up on /browse and in the admin panel."
    )

    def add_arguments(self, parser):
        parser.add_argument("--skip-images", action="store_true", help="Skip downloading product images.")

    def handle(self, *args, **options):
        items = json.loads(DATA_FILE.read_text(encoding="utf-8"))
        supplier = _get_direct_supplier()
        created, skipped = 0, 0

        for item in items:
            category = Category.objects.get(name=CATEGORY_MAP[item["category"]])
            unit = UNIT_MAP.get(item["unit"], item["unit"].lower())

            ingredient, _ = Ingredient.objects.get_or_create(
                category=category, name=item["name"], defaults={"unit_default": unit}
            )

            if Batch.objects.filter(supplier=supplier, ingredient=ingredient, status=Batch.Status.LISTED).exists():
                skipped += 1
                self.stdout.write(f"Skipping {item['name']} (already imported)")
                continue

            with transaction.atomic():
                batch = Batch.objects.create(
                    supplier=supplier,
                    ingredient=ingredient,
                    quantity=item["stockAvailable"],
                    unit=unit,
                    harvest_date=timezone.now().date(),
                    status=Batch.Status.LISTED,
                    price_per_unit=item["pricePerUnit"],
                    available_quantity=item["stockAvailable"],
                )
                if not options["skip_images"] and item.get("image"):
                    self._attach_image(batch, item["image"])

            created += 1
            self.stdout.write(f"Imported {item['name']}")

        self.stdout.write(self.style.SUCCESS(f"Done. Imported {created}, skipped {skipped}."))

    def _attach_image(self, batch, url):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
        except Exception as exc:
            self.stderr.write(f"  image download failed for {batch.ingredient.name}: {exc}")
            return

        image_file = ContentFile(data, name=f"{batch.ingredient.name.replace(' ', '_')}.jpg")
        lat, lng, captured_at, locked = extract_geo_and_timestamp(image_file)
        GeoTaggedPhoto.objects.create(
            batch=batch, image=image_file, latitude=lat, longitude=lng, captured_at=captured_at, exif_locked=locked
        )
