from rest_framework import serializers

from .models import Category, Ingredient


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "icon"]


class IngredientSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Ingredient
        fields = [
            "id", "name", "category", "category_name", "unit_default",
            "expected_min_harvest_days", "expected_max_harvest_days", "image",
        ]
