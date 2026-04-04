from django.db import models
from django.conf import settings
 
 
class Tenant(models.Model):
    name       = models.CharField(max_length=255)
    slug       = models.SlugField(unique=True)          # used as subdomain / identifier
    timezone   = models.CharField(max_length=64, default="UTC")
    is_active  = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
 
    def __str__(self):
        return self.name
 
 
class TenantMembership(models.Model):
    class Role(models.TextChoices):
        OWNER   = "owner",   "Owner"
        ADMIN   = "admin",   "Admin"
        MEMBER  = "member",  "Member"
        VIEWER  = "viewer",  "Viewer"
 
    tenant    = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="memberships")
    user      = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="memberships")
    role      = models.CharField(max_length=20, choices=Role.choices, default=Role.MEMBER)
    joined_at = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        unique_together = [("tenant", "user")]
 
    def __str__(self):
        return f"{self.user} @ {self.tenant} ({self.role})"
 