from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from models.base import Base
import uuid

class Schedule(Base):
    __tablename__ = "schedule"

    id = Column(Integer, primary_key=True, index=True)
    guid = Column(String, default=lambda: str(uuid.uuid4()), unique=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"))
    shift_id = Column(Integer, ForeignKey("shift.id"))
    department_id = Column(Integer, ForeignKey("department.id"))
    department = relationship("Department")
    schedule_date = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    staff = relationship("Staff", back_populates="schedules")
    shift = relationship("Shift", back_populates="schedules")