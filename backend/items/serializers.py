from django.contrib.auth.models import User
from rest_framework import serializers
# from django.contrib.auth.hashers import make_password
from .models import Note, Item, UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'


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

        # Create profile automatically
        UserProfile.objects.create(
            user=user,
            display_name=user.username,
            role="standard"
        )

        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}


class ItemSerializer(serializers.ModelSerializer):
    reporter_username = serializers.CharField(source="reporter.username", read_only=True)

    class Meta:
        model = Item
        fields = '__all__'
        read_only_fields = ["reporter"]
