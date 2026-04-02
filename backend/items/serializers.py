from django.contrib.auth.models import User
from rest_framework import serializers
# from django.contrib.auth.hashers import make_password
from .models import Note, Item, UserProfile, Category, Notification, Message


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "display_name",
            "avatar",
            "bio",
            "role",
            # "is_verified",
            "preferred_building",
            "notify_on_match",
            "notify_on_claim",
            # "notify_email",
            "items_reported",
            "items_claimed",
            "last_active",
        ]
        read_only_fields = ["role", "items_reported", "items_claimed", "last_active"]


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "password", "profile"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already taken.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.is_active = True
        user.set_password(password)
        user.save()

        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}


class ItemSerializer(serializers.ModelSerializer):
    reporter_username = serializers.CharField(source="reporter.username", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Item
        fields = '__all__'
        read_only_fields = ["reporter"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class NotificationSerializer(serializers.ModelSerializer):
    item_title = serializers.CharField(source="item.title", read_only=True)
    actor_username = serializers.CharField(source="actor.username", read_only=True)

    class Meta:
        model = Notification
        fields = ["id", "notif_type", "item_title", "actor_username", "created_at"]


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source="sender.username", read_only=True)
    recipient_username = serializers.CharField(source="recipient.username", read_only=True)

    class Meta:
        model = Message
        fields = [
            "id",
            "sender",
            "sender_username",
            "recipient",
            "recipient_username",
            "content",
            "created_at",
            "read",
        ]
        read_only_fields = ["sender", "created_at", "read"]
