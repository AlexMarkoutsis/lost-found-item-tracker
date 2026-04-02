from django.urls import path
from .views import (
    login_view,
    list_items,
    NoteListCreate,
    NoteDelete,
    CreateUserView, create_item,
    user_profile_get, CategoryListView, NotificationListView, send_message, inbox, conversation
)

urlpatterns = [
    # Items
    path("items/", list_items, name="items"),
    path('items/create/', create_item, name="create-item"),

    # Categories
    path("categories/", CategoryListView.as_view()),

    # User Profile
    # <int:pk> will be the user's id
    path("users/<int:pk>/", user_profile_get, name="user-profile"),

    # Notifications
    path("notifications/", NotificationListView.as_view(), name="notifications"),

    # Messages
    path("messages/", send_message),
    path("messages/inbox/", inbox),
    path("messages/<int:user_id>/", conversation),

    # Notes
    path("notes/", NoteListCreate.as_view(), name="note-list"),
    path("notes/<int:pk>/delete/", NoteDelete.as_view(), name="note-delete"),
]