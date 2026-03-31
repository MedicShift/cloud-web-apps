from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from models.base import Base
import uuid

class Hospital(Base):
    __tablename__ = "hospital"

    id = Column(Integer, primary_key=True, index=True)
    guid = Column(String, default=lambda: str(uuid.uuid4()), unique=True, index=True)
    name = Column(String, index=True)
    address = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    staff = relationship("Staff", back_populates="hospital")
    departments = relationship("Department", back_populates="hospital")