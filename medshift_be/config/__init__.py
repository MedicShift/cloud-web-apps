"""
Config package init.

Exposes the Celery app so that it's loaded on Django startup.
"""

from .celery import app as celery_app

__all__ = ["celery_app"]
