from django.urls import path
from .views import login_view, list_items, register_view

urlpatterns = [
    path('login/', login_view),
    path('items/', list_items),
    path('register/', register_view),
]
