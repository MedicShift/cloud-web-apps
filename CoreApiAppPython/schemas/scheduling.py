from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import date


# Scheduling Rules
class CreateSchedulingRuleRequest(BaseModel):
    hospital_id: int
    department_id: Optional[int] = None
    rule_type: str  # "consecutive_night_shifts", "max_shifts_per_week", etc.
    rule_name: str
    description: str
    parameters: Dict[str, Any]
    priority: int = 0

    class Config:
        json_schema_extra = {
            "example": {
                "hospital_id": 1,
                "department_id": 1,
                "rule_type": "consecutive_night_shifts",
                "rule_name": "Max 2 Consecutive Night Shifts",
                "description": "Staff cannot work more than 2 consecutive night shifts, must have 1 day rest",
                "parameters": {
                    "max_consecutive_nights": 2,
                    "mandatory_rest_days": 1
                },
                "priority": 10
            }
        }


class SchedulingRuleResponse(BaseModel):
    guid: str
    hospital_id: int
    department_id: Optional[int]
    rule_type: str
    rule_name: str
    description: str
    parameters: Dict[str, Any]
    is_active: bool
    priority: int

    class Config:
        from_attributes = True


class UpdateSchedulingRuleRequest(BaseModel):
    guid: str
    rule_name: Optional[str] = None
    description: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None
    priority: Optional[int] = None


# Staff Constraints
class CreateStaffConstraintRequest(BaseModel):
    staff_id: int
    constraint_type: str  # "max_hours_per_week", "preferred_shifts", "unavailable_days"
    parameters: Dict[str, Any]

    class Config:
        json_schema_extra = {
            "example": {
                "staff_id": 1,
                "constraint_type": "max_hours_per_week",
                "parameters": {
                    "max_hours": 40
                }
            }
        }


# Schedule Generation
class GenerateScheduleRequest(BaseModel):
    department_id: int
    start_date: date
    end_date: date
    required_coverage: Dict[str, int]  # shift_name -> count

    class Config:
        json_schema_extra = {
            "example": {
                "department_id": 1,
                "start_date": "2024-04-01",
                "end_date": "2024-04-30",
                "required_coverage": {
                    "Morning": 3,
                    "Evening": 2,
                    "Night": 2
                }
            }
        }


class ScheduleAssignment(BaseModel):
    staff_id: int
    staff_name: str
    shift_id: int
    shift_name: str
    department_id: int


class GenerateScheduleResponse(BaseModel):
    schedule: Dict[str, List[ScheduleAssignment]]  # date -> assignments
    warnings: List[str] = []


class CheckAssignmentRequest(BaseModel):
    staff_id: int
    shift_id: int
    schedule_date: date
    department_id: int


class CheckAssignmentResponse(BaseModel):
    can_assign: bool
    violations: List[str] = []
    staff_name: str
    shift_name: str
    schedule_date: date