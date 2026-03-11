from django.contrib import admin
from .models import Item, UserProfile, ActivityLog
from django.contrib.auth.models import User


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "category", "location", "date_reported", "reporter")
    list_filter = ("status", "category", "location")
    search_fields = ("title", "description", "location")


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "display_name", "role")
    list_filter = ("role",)


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ("user", "action", "item", "timestamp")
    list_filter = ("action", "timestamp")

    admin.site.unregister(User)

@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "is_staff", "is_superuser", "is_active")
    list_filter = ("is_staff", "is_superuser", "is_active")
    search_fields = ("username", "email")