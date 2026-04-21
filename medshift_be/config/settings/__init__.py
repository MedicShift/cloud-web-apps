"""
Settings module loader.

Reads DJANGO_SETTINGS_MODULE from the environment to determine which
settings file to load. Defaults to development settings.
"""

import os

from decouple import config

# Allow override via environment variable
environment = config(
    "DJANGO_SETTINGS_MODULE",
    default="config.settings.development",
)

# Set for Django internals
os.environ.setdefault("DJANGO_SETTINGS_MODULE", environment)
