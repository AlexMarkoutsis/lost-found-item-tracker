from django.contrib import admin
from django.urls import path, include
from items.views import CreateUserView, login_view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),

    # Auth endpoints
    path("api/auth/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api/auth/register/", CreateUserView.as_view(), name="register"),
    path("api/auth/login/", login_view, name="login"),

    # All app routes
    path("api/", include("items.urls")),
]
