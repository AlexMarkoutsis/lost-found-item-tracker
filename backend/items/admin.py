from django.contrib import admin
from .models import Item, UserProfile, ActivityLog, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    list_filter = ("name",)
    search_fields = ("name",)


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "category", "location", "date_reported", "reporter")
    list_filter = ("status", "category", "location")
    search_fields = ("title", "description", "location")


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "avatar", "description", "display_name", "role")
    list_filter = ("role",)


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ("user", "action", "item", "timestamp")
    list_filter = ("action", "timestamp")
