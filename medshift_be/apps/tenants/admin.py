from django.contrib import admin
from django_tenants.admin import TenantAdminMixin

from .models import Domain, Tenant


@admin.register(Tenant)
class TenantAdmin(TenantAdminMixin, admin.ModelAdmin):
    list_display = ("name", "schema_name", "is_active", "created_at")
    search_fields = ("name", "schema_name")
    list_filter = ("is_active",)


@admin.register(Domain)
class DomainAdmin(admin.ModelAdmin):
    list_display = ("domain", "tenant", "is_primary")
    search_fields = ("domain", "tenant__name")
