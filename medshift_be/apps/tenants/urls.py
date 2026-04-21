from django.urls import path

from .views import ProvisionTenantView

app_name = "tenants"

urlpatterns = [
    path("provision/", ProvisionTenantView.as_view(), name="provision_tenant"),
]
