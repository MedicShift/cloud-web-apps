from rest_framework import serializers

from .models import Role, User


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ("id", "name", "description")


class UserSerializer(serializers.ModelSerializer):
    """
    Standard user representation.
    """
    role = RoleSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "role", "is_active", "created_at")
        read_only_fields = ("id", "email", "created_at", "is_active")


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new user (password is written, not read).
    """
    password = serializers.CharField(write_only=True)
    role_id = serializers.UUIDField(required=False, write_only=True, allow_null=True)

    class Meta:
        model = User
        fields = ("email", "password", "first_name", "last_name", "role_id")


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating a user's basic info.
    """
    class Meta:
        model = User
        fields = ("first_name", "last_name")
