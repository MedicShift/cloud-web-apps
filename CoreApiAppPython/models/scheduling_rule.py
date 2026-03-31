from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from models.base import Base
import uuid


class SchedulingRule(Base):
    """Store hospital/department-specific scheduling rules"""
    __tablename__ = "scheduling_rule"

    id = Column(Integer, primary_key=True, index=True)
    guid = Column(String, default=lambda: str(uuid.uuid4()), unique=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospital.id"))
    department_id = Column(Integer, ForeignKey("department.id"), nullable=True)

    # Rule type
    rule_type = Column(String, index=True)  # e.g., "consecutive_night_shifts", "max_shifts_per_week"
    rule_name = Column(String)
    description = Column(String)

    # Rule parameters (stored as JSON)
    parameters = Column(JSON)
    # Example: {"max_consecutive_nights": 2, "mandatory_rest_days": 1}

    is_active = Column(Boolean, default=True)
    priority = Column(Integer, default=0)  # Higher priority rules checked first

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    hospital = relationship("Hospital")
    department = relationship("Department")


class StaffConstraint(Base):
    """Store individual staff member constraints/preferences"""
    __tablename__ = "staff_constraint"

    id = Column(Integer, primary_key=True, index=True)
    guid = Column(String, default=lambda: str(uuid.uuid4()), unique=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"))

    constraint_type = Column(String)  # "max_hours_per_week", "preferred_shifts", "unavailable_days"
    parameters = Column(JSON)
    # Example: {"max_hours": 40, "preferred_shifts": ["morning", "evening"]}

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    staff = relationship("Staff", back_populates="constraints")

# Add to Staff model relationship
# constraints = relationship("StaffConstraint", back_populates="staff")