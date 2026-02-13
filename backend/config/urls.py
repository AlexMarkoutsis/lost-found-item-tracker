from django.contrib import admin
from django.urls import path, include
from items.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("items/user/register/", CreateUserView.as_view(), name="register"),
    path("items/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("items/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("items-auth/", include("rest_framework.urls")),
    # forwarding any urls not handled above to items/urls.py
    path("items/", include("items.urls")),

    # path("items/", include("items.urls")),
]
