"""
Root URL configuration for MedShift.

Routes are versioned under /api/v1/ and tenant-aware.
"""

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # OAuth2 provider endpoints
    path("o/", include("oauth2_provider.urls", namespace="oauth2_provider")),

    # API v1
    path("api/v1/auth/", include("apps.users.urls.auth", namespace="auth")),
    path("api/v1/users/", include("apps.users.urls.users", namespace="users")),
    path("api/v1/tenants/", include("apps.tenants.urls", namespace="tenants")),
    path("api/v1/scheduling/", include("apps.scheduling.urls", namespace="scheduling")),
    path("api/v1/timesheets/", include("apps.timesheets.urls", namespace="timesheets")),
    path("api/v1/shifts/", include("apps.shifts.urls", namespace="shifts")),
]
