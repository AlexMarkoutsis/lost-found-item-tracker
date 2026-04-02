from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from django.db.models import Q

from .serializers import UserSerializer, UserProfileSerializer, NoteSerializer, ItemSerializer, CategorySerializer, \
    NotificationSerializer
from .models import Note, Item, UserProfile, Category, Notification
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


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

@api_view(["GET"])
@permission_classes([AllowAny])
def user_profile_get(request, pk):
    user_profile = get_object_or_404(UserProfile, user_id=pk)
    serializedData = UserProfileSerializer(user_profile).data
    return Response(serializedData)
    pass


@api_view(["POST"])
@permission_classes([AllowAny])
def user_profile_post(request):
    serializer = UserProfileSerializer(data=request.data)
    return Response(serializer.errors, status=400)
    pass


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
        items = items.filter(category_id=category_filter)

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
        item = serializer.save(reporter=request.user)
        currentuser = request.user

        if currentuser.profile.role == 'admin':
            Notification.objects.create(
            user=currentuser,
            actor=item.reporter,
            item=item,
            notif_type="item_posted",
            )
        else:
            Notification.objects.create(
            user=currentuser,
            actor=currentuser,
            item=item,
            notif_type="item_posted",
            )

        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = user.profile

        if profile.role == "admin":
            notifications = Notification.objects.all().order_by("-created_at")
        else:
            notifications = Notification.objects.filter(user=user).order_by("-created_at")

        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
