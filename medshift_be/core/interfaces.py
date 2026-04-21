"""
Core abstract interfaces following Dependency Inversion Principle.
"""

from abc import ABC


class BaseServiceInterface(ABC):
    """
    Abstract interface for all Services.
    All business logic should be contained within Service classes.
    """
    pass


class BaseSelectorInterface(ABC):
    """
    Abstract interface for all Selectors.
    All read-only complex queries should be contained within Selector classes.
    """
    pass
