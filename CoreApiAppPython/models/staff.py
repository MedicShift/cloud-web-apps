from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from models.base import Base
import uuid

class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    guid = Column(String, default=lambda: str(uuid.uuid4()), unique=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email_id = Column(String, unique=True, index=True)
    password_hash = Column(String)
    hospital_id = Column(Integer, ForeignKey("hospital.id"))
    department_id = Column(Integer, ForeignKey("department.id"), nullable=True)
    designation_id = Column(Integer, ForeignKey("designation.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    hospital = relationship("Hospital", back_populates="staff")
    department = relationship("Department", back_populates="staff")
    designation = relationship("Designation", back_populates="staff")
    schedules = relationship("Schedule", back_populates="staff")
    requests = relationship("Request", back_populates="staff")
    leave_requests = relationship("LeaveRequest", back_populates="staff")
    staff_roles = relationship("StaffRole", back_populates="staff")
    constraints = relationship("StaffConstraint", back_populates="staff")
