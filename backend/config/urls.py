from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
# from ..items import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('items.urls')),
    # path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]