"""
Shared DRF mixins.
"""

from rest_framework import serializers


class OutputSerializerMixin:
    """
    Mixin that allows specifying a different serializer for output (e.g., detail representation)
    than the one used for input validation.
    """
    def get_serializer_class(self):
        if hasattr(self, "output_serializer_class") and self.request.method in ["GET"]:
            return self.output_serializer_class
        return super().get_serializer_class()


class inline_serializer(serializers.Serializer):
    """
    Helper to create an inline serializer class quickly.
    Useful for ad-hoc outputs without creating a separate class.
    """
    def __init__(self, *args, **kwargs):
        fields = kwargs.pop("fields", {})
        super().__init__(*args, **kwargs)
        for key, field in fields.items():
            self.fields[key] = field
