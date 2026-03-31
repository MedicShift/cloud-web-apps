from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from models.base import Base
import uuid

class Request(Base):
    __tablename__ = "request"

    id = Column(Integer, primary_key=True, index=True)
    guid = Column(String, default=lambda: str(uuid.uuid4()), unique=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"))
    request_type_id = Column(Integer, ForeignKey("request_type.id"))
    description = Column(Text)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    staff = relationship("Staff", back_populates="requests")
    request_type = relationship("RequestType", back_populates="requests")

class RequestType(Base):
    __tablename__ = "request_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    requests = relationship("Request", back_populates="request_type")

class LeaveRequest(Base):
    __tablename__ = "leave_request"

    id = Column(Integer, primary_key=True, index=True)
    guid = Column(String, default=lambda: str(uuid.uuid4()), unique=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    reason = Column(Text)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    staff = relationship("Staff", back_populates="leave_requests")