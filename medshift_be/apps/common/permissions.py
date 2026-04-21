"""
Shared DRF permissions.
"""

from rest_framework import permissions


class IsTenantAdmin(permissions.BasePermission):
    """
    Allows access only to users with an ADMIN role for the current tenant.
    Assumes request.user has a role and we are in a tenant context.
    """
    def has_permission(self, request, view):
        if not bool(request.user and request.user.is_authenticated):
            return False
            
        # Example validation - checking the role name
        role = getattr(request.user, "role", None)
        if role and role.name == "ADMIN":
            return True
            
        return request.user.is_superuser
