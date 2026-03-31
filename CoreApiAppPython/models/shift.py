from sqlalchemy import Column, Integer, String, DateTime, Time
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from models.base import Base

class Shift(Base):
    __tablename__ = "shift"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    start_time = Column(Time)
    end_time = Column(Time)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    schedules = relationship("Schedule", back_populates="shift")