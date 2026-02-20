from django.contrib.auth import authenticate, login, get_user_model
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Item
from .serializers import ItemSerializer


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


User = get_user_model()


@api_view(["POST"])
def register_view(request):
    username = request.data.get("email")
    password = request.data.get("password")
    password2 = request.data.get("password2")

    # ---- Missing fields ----
    if not username or not password:
        return Response({"error": "Missing username or password"}, status=status.HTTP_400_BAD_REQUEST)

    # ---- Password mismatch ----
    if password2 is not None and password != password2:
        return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

    # ---- Duplicate user ----
    if User.objects.filter(username=username).exists():
        return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

    # ---- Create user ----
    User.objects.create_user(username=username, password=password)

    return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
