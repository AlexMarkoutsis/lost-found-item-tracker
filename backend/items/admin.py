from django.contrib import admin
from .models import Item, UserProfile, ActivityLog, TESTU

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "category", "location", "date_reported", "reporter")
    list_filter = ("status", "category", "location")
    search_fields = ("title", "description", "location")

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "display_name", "role")
    list_filter = ("role",)

@admin.register(TESTU)
class TESTUAdmin(admin.ModelAdmin):
    list_display = ("use", "display_nam", "rol")

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ("user", "action", "item", "timestamp")
    list_filter = ("action", "timestamp")
