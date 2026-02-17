from django.urls import path
from django.contrib import admin
from . import views
from .views import CreateUserView
from .views import login_view, list_items

urlpatterns = [
    path('admin/', admin.site.urls),
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("user/register/", CreateUserView.as_view(), name="register"),
    path('login/', login_view),
    path('items/', list_items),
]
