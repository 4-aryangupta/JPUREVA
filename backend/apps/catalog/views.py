from rest_framework import generics, permissions

from .models import Category, Ingredient
from .serializers import CategorySerializer, IngredientSerializer


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class IngredientListView(generics.ListAPIView):
    serializer_class = IngredientSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Ingredient.objects.select_related("category").all()
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__slug=category)
        return qs
