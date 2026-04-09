from django.contrib import admin
from .models import Item, UserProfile, ActivityLog, Category, Notification, Message

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

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("user", "actor", "notif_type", "item", "created_at")
    list_filter = ("notif_type", "created_at")
    search_fields = ("user__username", "actor__username", "item__title")
    ordering = ("-created_at",)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("sender", "recipient", "short_content", "created_at", "read")
    list_filter = ("read", "created_at")
    search_fields = ("sender__username", "recipient__username", "content")
    ordering = ("-created_at",)

    def short_content(self, obj):
        return obj.content[:40] + ("..." if len(obj.content) > 40 else "")
    short_content.short_description = "Content"
