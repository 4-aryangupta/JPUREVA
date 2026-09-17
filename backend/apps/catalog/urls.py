from django.urls import path

from .views import CategoryListView, IngredientListView

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="categories"),
    path("ingredients/", IngredientListView.as_view(), name="ingredients"),
]
