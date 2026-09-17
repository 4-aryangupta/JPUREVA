from django.contrib import admin

from .models import ComplianceDocument, HotelSubscription, SubscriptionPlan

admin.site.register(ComplianceDocument)
admin.site.register(SubscriptionPlan)
admin.site.register(HotelSubscription)
