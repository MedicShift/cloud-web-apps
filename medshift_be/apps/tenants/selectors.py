"""
Contains read-only complex queries for Tenants.
Separates read concerns from write concerns (CQRS pattern).
"""

import uuid

from django.db.models import QuerySet

from .models import Tenant


def get_active_tenants() -> QuerySet[Tenant]:
    """
    Returns only active tenants.
    """
    return Tenant.objects.filter(is_active=True)


def get_tenant_by_id(tenant_id: uuid.UUID) -> Tenant:
    """
    Retrieves a single tenant by id.
    """
    return Tenant.objects.get(id=tenant_id)
