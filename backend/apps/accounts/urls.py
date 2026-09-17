from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CustomTokenObtainPairView,
    LogoutView,
    MeView,
    RegisterHotelView,
)

# Supplier/lab self-registration is disabled for now (hotel-only signup).
# The RegisterSupplierView/RegisterLabView classes remain in views.py, unrouted,
# in case supplier/lab onboarding is reintroduced later.
urlpatterns = [
    path("register/hotel/", RegisterHotelView.as_view(), name="register-hotel"),
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
]
