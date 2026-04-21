from rest_framework import serializers

from .models import Domain, Tenant


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ("id", "name", "slug", "schema_name", "is_active", "created_at")
        read_only_fields = ("id", "schema_name", "created_at")


class TenantCreateSerializer(serializers.ModelSerializer):
    """
    Serializer used specifically for provisioning a new tenant.
    """
    domain_name = serializers.CharField(write_only=True)
    name = serializers.CharField(required=True)
    slug = serializers.SlugField(required=True)

    class Meta:
        model = Tenant
        fields = ("name", "slug", "domain_name")
