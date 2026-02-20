from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer

# ==================================
from django.contrib.auth import authenticate, login
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Item, UserProfile
from .serializers import ItemSerializer, UserProfileSerializer

@api_view(['POST'])
def register_view(request):
    username = request.data['username']
    password = request.data['password']

    User.objects.create_user(
        username=username,
        password=password
    )
    return Response({
        "username": username,
        "password": password
    })

# @api_view(['POST'])
class CreateUserProfileView(generics.CreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [AllowAny]

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
