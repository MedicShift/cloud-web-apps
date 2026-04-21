from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.common.mixins import OutputSerializerMixin

from .models import Tenant
from .selectors import get_active_tenants, get_tenant_by_id
from .serializers import TenantCreateSerializer, TenantSerializer
from .services import TenantProvisioningService


class TenantViewSet(OutputSerializerMixin, ReadOnlyModelViewSet):
    """
    Read-only viewset for tenants.
    """
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [IsAdminUser]  # Only central admins should see all tenants

    def get_queryset(self):
        return get_active_tenants()


class ProvisionTenantView(APIView):
    """
    Endpoint to provision a new tenant.
    Usually protected or internal-only.
    """
    permission_classes = [IsAdminUser]

    def post(self, request, *args, **kwargs):
        serializer = TenantCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        service = TenantProvisioningService(user=request.user)
        tenant = service.provision_tenant(
            name=serializer.validated_data["name"],
            slug=serializer.validated_data["slug"],
            domain_name=serializer.validated_data["domain_name"]
        )
        
        output_serializer = TenantSerializer(tenant)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)
