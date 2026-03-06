# from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from django.db.models import Q

from .serializers import UserSerializer, NoteSerializer, ItemSerializer
from .models import Note, Item
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, get_user_model
from django.http import JsonResponse
import json


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


@method_decorator(csrf_exempt, name='dispatch')
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({"success": True, "user": user.username})

        return JsonResponse({"success": False, "error": "Invalid credentials"}, status=400)



@api_view(['GET'])
@permission_classes([AllowAny])
def list_items(request):
    items = Item.objects.all()

    # Status filter
    status_filter = request.GET.get('status')
    if status_filter:
        items = items.filter(status=status_filter.lower())

    # Category filter
    category_filter = request.GET.get('category')
    if category_filter:
        items = items.filter(category__iexact=category_filter)

    # Location filter (partial match)
    location_filter = request.GET.get('location')
    if location_filter:
        items = items.filter(location__icontains=location_filter)

    # Search filter (title or description)
    search_filter = request.GET.get('search')
    if search_filter:
        items = items.filter(
            Q(title__icontains=search_filter) |
            Q(description__icontains=search_filter)
        )

    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def create_item(request):
    serializer = ItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(reporter=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


User = get_user_model()


@api_view(["POST"])
@permission_classes([AllowAny])
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
