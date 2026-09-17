from django.contrib import admin

from .models import Batch, GeoTaggedPhoto, LedgerEntry

admin.site.register(Batch)
admin.site.register(GeoTaggedPhoto)
admin.site.register(LedgerEntry)
