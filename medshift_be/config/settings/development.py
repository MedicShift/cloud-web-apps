"""
Development settings for MedShift.

Extends base settings with development-specific overrides.
"""

from .base import *  # noqa: F401, F403

# ──────────────────────────────────────────
# Debug
# ──────────────────────────────────────────

DEBUG = True

# ──────────────────────────────────────────
# Hosts
# ──────────────────────────────────────────

ALLOWED_HOSTS = ["*"]

# ──────────────────────────────────────────
# CORS (permissive in dev)
# ──────────────────────────────────────────

CORS_ALLOW_ALL_ORIGINS = True

# ──────────────────────────────────────────
# Django Debug Toolbar
# ──────────────────────────────────────────

INSTALLED_APPS += ["debug_toolbar"]  # noqa: F405

MIDDLEWARE.insert(  # noqa: F405
    MIDDLEWARE.index("django.middleware.common.CommonMiddleware") + 1,  # noqa: F405
    "debug_toolbar.middleware.DebugToolbarMiddleware",
)

INTERNAL_IPS = ["127.0.0.1", "localhost"]

# ──────────────────────────────────────────
# DRF (add browsable API in dev)
# ──────────────────────────────────────────

REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] += [  # noqa: F405
    "rest_framework.renderers.BrowsableAPIRenderer",
]

# ──────────────────────────────────────────
# Email (console backend in dev)
# ──────────────────────────────────────────

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# ──────────────────────────────────────────
# Logging (verbose in dev)
# ──────────────────────────────────────────

LOGGING["root"]["level"] = "DEBUG"  # noqa: F405
LOGGING["handlers"]["console"]["level"] = "DEBUG"  # noqa: F405
