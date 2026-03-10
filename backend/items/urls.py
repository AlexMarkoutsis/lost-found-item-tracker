from django.urls import path
from .views import (
    login_view,
    list_items,
    NoteListCreate,
    NoteDelete,
    CreateUserView, create_item,
    user_profile_get
)

urlpatterns = [
    # Items
    path("items/", list_items, name="items"),
    path('items/create/', create_item, name="create-item"),

    # User Profile
    # <int:pk> will be the user's id
    path("users/<int:pk>/", user_profile_get, name="user-profile"),

    # Notes
    path("notes/", NoteListCreate.as_view(), name="note-list"),
    path("notes/<int:pk>/delete/", NoteDelete.as_view(), name="note-delete"),
]