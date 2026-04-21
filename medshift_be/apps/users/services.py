import logging
import uuid
from typing import Optional

from django.db import transaction

from core.services import BaseService

from .models import Role, User

logger = logging.getLogger(__name__)


class UserManagementService(BaseService):
    """
    Service for managing users within a tenant environment.
    """

    @transaction.atomic
    def create_tenant_user(
        self, 
        email: str, 
        password: str, 
        first_name: str = "", 
        last_name: str = "", 
        role_id: Optional[uuid.UUID] = None
    ) -> User:
        """
        Creates a new user associated with the current tenant schema.
        """
        logger.info(f"Creating user {email} for tenant schema")
        
        role = None
        if role_id:
            try:
                role = Role.objects.get(id=role_id)
            except Role.DoesNotExist:
                logger.warning(f"Role {role_id} not found, user {email} will be created without role.")

        user = User.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=role
        )
        
        logger.info(f"User {user.id} created successfully")
        return user
