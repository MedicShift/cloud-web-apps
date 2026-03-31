from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from models.base import Base
import uuid

class StaffRole(Base):
    __tablename__ = "staff_role"

    id = Column(Integer, primary_key=True, index=True)
    guid = Column(String, default=lambda: str(uuid.uuid4()), unique=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"))
    role = Column(String)  # e.g., "HospitalAdmin"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    staff = relationship("Staff", back_populates="staff_roles")