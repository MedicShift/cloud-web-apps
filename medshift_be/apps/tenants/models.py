from django.db import models
from django_tenants.models import DomainMixin, TenantMixin

from apps.common.models import BaseModel


class Tenant(TenantMixin, BaseModel):
    """
    Represents a tenant (hospital) in the system.
    Extends django-tenants TenantMixin to use PostgreSQL schemas.
    """
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    
    paid_until = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    # Default true, schema will be automatically created and synced when it is saved
    auto_create_schema = True

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Tenant"
        verbose_name_plural = "Tenants"


class Domain(DomainMixin, BaseModel):
    """
    Represents a domain or subdomain routed to a specific tenant.
    Required by django-tenants.
    """
    pass
