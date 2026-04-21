from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.common.mixins import OutputSerializerMixin
from apps.common.permissions import IsTenantAdmin

from .models import User
from .selectors import get_tenant_users
from .serializers import UserCreateSerializer, UserSerializer, UserUpdateSerializer
from .services import UserManagementService


class UserViewSet(OutputSerializerMixin, ModelViewSet):
    """
    ViewSet for managing users within a tenant.
    """
    permission_classes = [IsAuthenticated, IsTenantAdmin]
    serializer_class = UserSerializer

    def get_queryset(self):
        return get_tenant_users()

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        elif self.action in ["update", "partial_update"]:
            return UserUpdateSerializer
        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):
        """
        Use the service layer to create a user.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        service = UserManagementService(user=request.user)
        user = service.create_tenant_user(
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
            first_name=serializer.validated_data.get("first_name", ""),
            last_name=serializer.validated_data.get("last_name", ""),
            role_id=serializer.validated_data.get("role_id")
        )
        
        output_serializer = UserSerializer(user)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["GET", "PATCH"], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Endpoint for the currently authenticated user to view/update their own profile.
        """
        user = request.user
        if request.method == "GET":
            serializer = UserSerializer(user)
            return Response(serializer.data)
            
        elif request.method == "PATCH":
            serializer = UserUpdateSerializer(user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            # Return full user repr on update
            return Response(UserSerializer(user).data)
