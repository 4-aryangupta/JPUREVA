from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="icon key, e.g. 'leaf', 'flask', 'truck'")

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Ingredient(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="ingredients")
    name = models.CharField(max_length=150)
    unit_default = models.CharField(max_length=20, default="kg")
    expected_min_harvest_days = models.PositiveIntegerField(
        null=True, blank=True, help_text="Minimum biologically plausible days from sowing to harvest"
    )
    expected_max_harvest_days = models.PositiveIntegerField(null=True, blank=True)
    image = models.ImageField(upload_to="ingredients/", blank=True, null=True)

    class Meta:
        unique_together = ("category", "name")

    def __str__(self):
        return self.name
