from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from django.db.models import Q

from .serializers import UserSerializer, UserProfileSerializer, NoteSerializer, ItemSerializer, CategorySerializer, \
    NotificationSerializer, MessageSerializer
from .models import Note, Item, UserProfile, Category, Notification, Message
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import json
from rest_framework import viewsets, permissions
from rest_framework.parsers import FileUploadParser, MultiPartParser, FormParser


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
    return None


@api_view(["GET"])
@permission_classes([AllowAny])
def user_profile_get(request, pk):
    user_profile = get_object_or_404(UserProfile, user_id=pk)
    serializedData = UserProfileSerializer(user_profile).data
    return Response(serializedData)


@api_view(["POST"])
@permission_classes([AllowAny])
def user_profile_edit(request, pk):
    if request.method == "POST":
        new_name = request.data.get('display_name')
        new_description = request.data.get('description')
        new_avatar = request.FILES.get('avatar')

        print(f"\033[92m FILES: \033[0m", request.FILES)
        print(f"\033[92m NEW AVA: \033[0m", new_avatar)
        try:
            user_profile = UserProfile.objects.get(id=pk)
            user_profile.display_name = new_name
            user_profile.description = new_description
            user_profile.avatar = new_avatar
            user_profile.save()
            return Response({"message": "Updated successfully"}, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("THE ERROR:", e)
            return Response({"ERrOR": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"Not a post request"}, status=400)


class UserProfileEdit(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)


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


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_message(request):
    sender = request.user
    recipient_id = request.data.get("recipient")
    content = request.data.get("content")

    if not recipient_id or not content:
        return Response({"error": "Recipient and content required"}, status=400)

    try:
        recipient = User.objects.get(id=recipient_id)
    except User.DoesNotExist:
        return Response({"error": "Recipient not found"}, status=404)

    message = Message.objects.create(
        sender=sender,
        recipient=recipient,
        content=content
    )

    serializer = MessageSerializer(message)
    return Response(serializer.data, status=201)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def inbox(request):
    user = request.user

    # Get all messages where the user is sender or recipient
    messages = Message.objects.filter(
        Q(sender=user) | Q(recipient=user)
    ).order_by("-created_at")

    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def conversation(request, user_id):
    user = request.user

    messages = Message.objects.filter(
        (Q(sender=user) & Q(recipient_id=user_id)) |
        (Q(sender_id=user_id) & Q(recipient=user))
    ).order_by("created_at")

    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def claim_item(request, item_id):
    try:
        item = Item.objects.get(id=item_id)
    except Item.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

    if item.reporter == request.user:
        return Response({"error": "You cannot claim your own item"}, status=400)

    if item.status == "claimed":
        return Response({"error": "Item already claimed"}, status=400)

    # Update item
    item.status = "claimed"
    item.claimed_at = timezone.now()
    item.claimed_by = request.user
    item.save()

    # Send a first system message
    Message.objects.create(
        sender=request.user,
        recipient=item.reporter,
        content="Hi! I believe " + item.title + " belongs to me."
    )

    Notification.objects.create(
        user=item.reporter,
        actor=request.user,
        item=item,
        notif_type="item_claimed",
    )

    return Response({"message": "Item claimed successfully"}, status=200)


@api_view(['GET'])
def user_posted_items(request, pk):
    items = Item.objects.filter(reporter_id=pk).order_by('-date_reported')
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def user_claimed_items(request, pk):
    items = Item.objects.filter(claimed_by_id=pk).order_by('-claimed_at')
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)
