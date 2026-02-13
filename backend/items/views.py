from django.contrib.auth import authenticate
from django.views import View
from rest_framework import status
# from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from .models import Item
from .serializers import ItemSerializer, UserSerializer


class Login(View):
    def post(self, request):
        email = request.POST["email"]
        password = request.POST["password"]

        user = authenticate(request, username=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(user).data
            })

        return Response({"error": "invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class ItemList(View):
    def get(self, request):
        status_filter = request.GET["status"]
        items = Item.objects.all()

        if status_filter:
            items = items.filter(status=status_filter.lower())

        serializer = ItemSerializer(items, many=True)


"""
@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(request, username=email, password=password)

    if user is not None:
        login(request, user)
        return Response({"message": "Login successful"}, status=status.HTTP_200_OK)

    return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def list_items(request):
    status_filter = request.GET.get('status')
    items = Item.objects.all()

    if status_filter:
        items = items.filter(status=status_filter.lower())

    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)
"""
