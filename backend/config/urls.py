from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.urls import re_path
from django.views.static import serve

from apps.core.views import health_check

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health_check),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/admin/", include("apps.adminpanel.urls")),
    path("api/catalog/", include("apps.catalog.urls")),
    path("api/suppliers/", include("apps.suppliers.urls")),
    path("api/warehouse/", include("apps.warehouse.urls")),
    path("api/labs/", include("apps.labs.urls")),
    path("api/hotels/", include("apps.hotels.urls")),
    path("api/orders/", include("apps.orders.urls")),
    path("api/notifications/", include("apps.notifications.urls")),
    path("api/public/", include("apps.traceability.public_urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += [
        re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
    ]