from django.contrib import admin
from django.urls import path, include
from items.views import CreateUserView, login_view, me
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),

    # Auth endpoints
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/register/", CreateUserView.as_view(), name="register"),
    path("api/auth/login/", login_view, name="login"),
    path("api/auth/me/", me, name="me"),

    # All app routes
    path("api/", include("items.urls")),
]
