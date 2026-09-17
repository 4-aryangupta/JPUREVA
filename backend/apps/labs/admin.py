from django.contrib import admin

from .models import Certificate, Invoice, TestType, VerificationRequest

admin.site.register(TestType)
admin.site.register(VerificationRequest)
admin.site.register(Certificate)
admin.site.register(Invoice)
