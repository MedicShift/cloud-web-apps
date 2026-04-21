import logging

from django.db import transaction

from core.services import BaseService

from .models import Domain, Tenant

logger = logging.getLogger(__name__)


class TenantProvisioningService(BaseService):
    """
    Handles complex business logic for creating a new tenant.
    """

    @transaction.atomic
    def provision_tenant(self, name: str, slug: str, domain_name: str) -> Tenant:
        """
        Creates a new tenant and its associated domain.
        Schema creation is handled automatically by django-tenants.
        """
        logger.info(f"Provisioning new tenant: {name} ({slug})")
        
        schema_name = slug.replace("-", "_").lower()
        
        tenant = Tenant.objects.create(
            name=name,
            slug=slug,
            schema_name=schema_name,
            is_active=True
        )
        
        Domain.objects.create(
            domain=domain_name,
            tenant=tenant,
            is_primary=True
        )
        
        logger.info(f"Tenant provisioned successfully: {tenant.id}")
        return tenant
