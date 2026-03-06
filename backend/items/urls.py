from django.urls import path
from .views import (
    login_view,
    list_items,
    NoteListCreate,
    NoteDelete,
    CreateUserView, create_item,
)

urlpatterns = [
    # Items
    path("items/", list_items, name="items"),
    path('items/create/', create_item, name="create-item"),


    # Notes
    path("notes/", NoteListCreate.as_view(), name="note-list"),
    path("notes/<int:pk>/delete/", NoteDelete.as_view(), name="note-delete"),
]
