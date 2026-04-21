"""
Core service classes.
"""

from .interfaces import BaseServiceInterface


class BaseService(BaseServiceInterface):
    """
    Base service class.
    Provides standard utilities that might be needed across all services.
    """
    def __init__(self, user=None):
        """
        Optionally inject the user executing the service.
        """
        self.user = user
