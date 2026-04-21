"""
Read-only selectors for Users.
"""

from django.db.models import QuerySet

from .models import User


def get_tenant_users() -> QuerySet[User]:
    """
    Returns all users in the current tenant schema.
    """
    return User.objects.all().select_related("role")
