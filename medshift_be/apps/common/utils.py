"""
General utility functions.
"""

def generate_slug(name: str) -> str:
    """
    Generate a simple slug from a given string.
    """
    import re
    
    slug = str(name).strip().lower()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_-]+", "-", slug)
    slug = re.sub(r"^-+|-+$", "", slug)
    return slug
