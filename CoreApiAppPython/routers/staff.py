from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from schema import StaffProfile, CreateStaffRequest, UpdateStaffRequest, CreateScheduleRequest, UpdateScheduleRequest
from auth import get_current_user
from models.staff import Staff
from models.schedule import Schedule
from models.staff_role import StaffRole
from auth import get_password_hash
import uuid

router = APIRouter()

@router.get("/staff/me", response_model=StaffProfile)
def get_staff_profile(current_user: Staff = Depends(get_current_user)):
    roles = [role.role for role in current_user.staff_roles]
    return StaffProfile(
        staff_guid=str(current_user.guid),
        hospital_guid=str(current_user.hospital.guid),
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        email_id=current_user.email_id,
        designation=current_user.designation.title,
        department=current_user.department.name if current_user.department else None,
        roles=roles
    )

@router.get("/staff/all")
def get_all_staff(
    sorts: str = "",
    page: int = 1,
    page_size: int = 10,
    filters: str = "",
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Simplified, without Sieve for now
    query = db.query(Staff).filter(Staff.hospital_id == current_user.hospital_id)
    staff = query.offset((page - 1) * page_size).limit(page_size).all()
    return {"data": staff, "total": query.count()}

@router.post("/staff")
def create_staff(
    request: CreateStaffRequest,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if HospitalAdmin
    if not any(role.role == "HospitalAdmin" for role in current_user.staff_roles):
        raise HTTPException(status_code=403, detail="Not authorized")

    existing = db.query(Staff).filter(Staff.email_id == request.email_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="User already exists")

    new_staff = Staff(
        guid=str(uuid.uuid4()),
        first_name=request.first_name,
        last_name=request.last_name,
        email_id=request.email_id,
        password_hash=get_password_hash("defaultpassword"),  # Should generate or ask for password
        hospital_id=current_user.hospital_id,
        department_id=request.department_id,
        designation_id=1  # Need to map designation
    )
    db.add(new_staff)
    db.commit()
    return {"success": True, "message": "User added successfully"}

@router.put("/staff")
def update_staff(
    request: UpdateStaffRequest,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not any(role.role == "HospitalAdmin" for role in current_user.staff_roles):
        raise HTTPException(status_code=403, detail="Not authorized")

    staff = db.query(Staff).filter(Staff.guid == request.guid).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")

    # Update fields
    if request.first_name:
        staff.first_name = request.first_name
    # Add other fields similarly

    db.commit()
    return {"success": True, "message": "Staff updated successfully"}

@router.delete("/staff")
def delete_staff(
    staff_id: str,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not any(role.role == "HospitalAdmin" for role in current_user.staff_roles):
        raise HTTPException(status_code=403, detail="Not authorized")

    staff = db.query(Staff).filter(Staff.guid == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")

    db.delete(staff)
    db.commit()
    return {"success": True, "message": "Staff deleted successfully"}

# Schedule endpoints
@router.post("/staff/schedule")
def create_schedule(
    request: CreateScheduleRequest,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not request.staff_id or not request.shift_id or not request.schedule_date:
        raise HTTPException(status_code=400, detail="Missing required fields")

    schedule = Schedule(
        guid=str(uuid.uuid4()),
        staff_id=request.staff_id,
        shift_id=request.shift_id,
        department_guid=request.department_guid,
        schedule_date=request.schedule_date
    )
    db.add(schedule)
    db.commit()
    return {"success": True, "message": "Schedule created"}

@router.put("/staff/schedule")
def update_schedule(
    request: UpdateScheduleRequest,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    schedule = db.query(Schedule).filter(Schedule.guid == request.guid).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    # Update fields
    db.commit()
    return {"success": True, "message": "Schedule updated"}

@router.delete("/staff/schedule")
def delete_schedule(
    schedule_guid: str,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    schedule = db.query(Schedule).filter(Schedule.guid == schedule_guid).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    db.delete(schedule)
    db.commit()
    return {"success": True, "message": "Schedule deleted"}

# Staff Role
@router.post("/staff/staffrole")
def add_staff_role(
    role: str,
    staff_id: str,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not any(role.role == "HospitalAdmin" for role in current_user.staff_roles):
        raise HTTPException(status_code=403, detail="Not authorized")

    existing = db.query(StaffRole).filter(StaffRole.staff_id == staff_id, StaffRole.role == role).first()
    if existing:
        raise HTTPException(status_code=409, detail="Role already exists")

    staff_role = StaffRole(
        guid=str(uuid.uuid4()),
        staff_id=staff_id,
        role=role
    )
    db.add(staff_role)
    db.commit()
    return {"success": True, "message": "Role added"}

@router.delete("/staff/staffrole")
def delete_staff_role(
    role_guid: str,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not any(role.role == "HospitalAdmin" for role in current_user.staff_roles):
        raise HTTPException(status_code=403, detail="Not authorized")

    role = db.query(StaffRole).filter(StaffRole.guid == role_guid).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    db.delete(role)
    db.commit()
    return {"success": True, "message": "Role deleted"}