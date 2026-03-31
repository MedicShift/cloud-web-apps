from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime

# Auth
class StaffLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Staff
class StaffProfile(BaseModel):
    staff_guid: str
    hospital_guid: str
    first_name: str
    last_name: str
    email_id: EmailStr
    designation: str
    department: Optional[str]
    roles: List[str]

class CreateStaffRequest(BaseModel):
    first_name: str
    last_name: str
    email_id: EmailStr
    hospital_id: str
    department_id: Optional[str]
    designation: str

class UpdateStaffRequest(BaseModel):
    guid: str
    first_name: Optional[str]
    last_name: Optional[str]
    email_id: Optional[EmailStr]
    department_id: Optional[str]
    designation: Optional[str]

# Schedule
class CreateScheduleRequest(BaseModel):
    staff_id: str
    shift_id: str
    department_guid: str
    schedule_date: str

class UpdateScheduleRequest(BaseModel):
    guid: str
    staff_id: Optional[str]
    shift_id: Optional[str]
    department_guid: Optional[str]
    schedule_date: Optional[str]

# Hospital
class CreateHospitalRequest(BaseModel):
    name: str
    address: str

# Shift
class CreateShiftRequest(BaseModel):
    name: str
    start_time: str
    end_time: str

class UpdateShiftRequest(BaseModel):
    guid: str
    name: Optional[str]
    start_time: Optional[str]
    end_time: Optional[str]

# Request
class CreateLeaveRequest(BaseModel):
    start_date: datetime
    end_date: datetime
    reason: str

class UpdateLeaveRequest(BaseModel):
    guid: str
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    reason: Optional[str]