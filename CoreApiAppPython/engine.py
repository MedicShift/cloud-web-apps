"""
Nurse Scheduling Algorithm with Constraint Satisfaction
Supports configurable hospital-specific rules
"""

from datetime import datetime, date, timedelta
from typing import List, Dict, Optional, Set
from sqlalchemy.orm import Session
from models.staff import Staff
from models.shift import Shift
from models.schedule import Schedule
from models.scheduling_rule import SchedulingRule, StaffConstraint
from models.leave_request import LeaveRequest
from collections import defaultdict


class SchedulingConstraint:
    """Base class for scheduling constraints"""

    def __init__(self, rule: SchedulingRule):
        self.rule = rule
        self.parameters = rule.parameters or {}

    def is_violated(self, staff: Staff, shift: Shift, schedule_date: date,
                    existing_schedules: List[Schedule]) -> bool:
        """Check if assigning this shift violates the constraint"""
        raise NotImplementedError


class ConsecutiveNightShiftConstraint(SchedulingConstraint):
    """Prevents too many consecutive night shifts"""

    def is_violated(self, staff: Staff, shift: Shift, schedule_date: date,
                    existing_schedules: List[Schedule]) -> bool:
        max_consecutive = self.parameters.get("max_consecutive_nights", 2)
        mandatory_rest_days = self.parameters.get("mandatory_rest_days", 1)

        # Check if this is a night shift (e.g., starts after 8 PM)
        if not self._is_night_shift(shift):
            return False

        # Get previous consecutive night shifts
        consecutive_nights = self._count_consecutive_night_shifts(
            staff, schedule_date, existing_schedules
        )

        if consecutive_nights >= max_consecutive:
            return True

        return False

    def _is_night_shift(self, shift: Shift) -> bool:
        """Check if shift is a night shift (starts after 8 PM or before 6 AM)"""
        return shift.start_time.hour >= 20 or shift.start_time.hour < 6

    def _count_consecutive_night_shifts(self, staff: Staff, schedule_date: date,
                                        existing_schedules: List[Schedule]) -> int:
        """Count consecutive night shifts before this date"""
        count = 0
        current_date = schedule_date - timedelta(days=1)

        # Sort schedules by date descending
        staff_schedules = [s for s in existing_schedules if s.staff_id == staff.id]
        schedule_dict = {s.schedule_date: s for s in staff_schedules}

        while current_date in schedule_dict:
            schedule = schedule_dict[current_date]
            if self._is_night_shift(schedule.shift):
                count += 1
                current_date -= timedelta(days=1)
            else:
                break

        return count


class MaxShiftsPerWeekConstraint(SchedulingConstraint):
    """Limits number of shifts per week"""

    def is_violated(self, staff: Staff, shift: Shift, schedule_date: date,
                    existing_schedules: List[Schedule]) -> bool:
        max_shifts = self.parameters.get("max_shifts_per_week", 5)

        # Get start and end of the week
        week_start = schedule_date - timedelta(days=schedule_date.weekday())
        week_end = week_start + timedelta(days=6)

        # Count shifts in this week
        shifts_this_week = sum(
            1 for s in existing_schedules
            if s.staff_id == staff.id and week_start <= s.schedule_date <= week_end
        )

        return shifts_this_week >= max_shifts


class MaxHoursPerWeekConstraint(SchedulingConstraint):
    """Limits total hours per week"""

    def is_violated(self, staff: Staff, shift: Shift, schedule_date: date,
                    existing_schedules: List[Schedule]) -> bool:
        max_hours = self.parameters.get("max_hours_per_week", 40)

        week_start = schedule_date - timedelta(days=schedule_date.weekday())
        week_end = week_start + timedelta(days=6)

        # Calculate hours this week
        total_hours = 0
        for s in existing_schedules:
            if s.staff_id == staff.id and week_start <= s.schedule_date <= week_end:
                hours = self._calculate_shift_hours(s.shift)
                total_hours += hours

        # Add current shift hours
        current_shift_hours = self._calculate_shift_hours(shift)

        return (total_hours + current_shift_hours) > max_hours

    def _calculate_shift_hours(self, shift: Shift) -> float:
        """Calculate shift duration in hours"""
        start = datetime.combine(date.today(), shift.start_time)
        end = datetime.combine(date.today(), shift.end_time)

        # Handle overnight shifts
        if end < start:
            end += timedelta(days=1)

        duration = (end - start).total_seconds() / 3600
        return duration


class MinRestPeriodConstraint(SchedulingConstraint):
    """Ensures minimum rest between shifts"""

    def is_violated(self, staff: Staff, shift: Shift, schedule_date: date,
                    existing_schedules: List[Schedule]) -> bool:
        min_rest_hours = self.parameters.get("min_rest_hours", 12)

        # Check previous day's shift
        prev_date = schedule_date - timedelta(days=1)
        prev_schedule = next(
            (s for s in existing_schedules
             if s.staff_id == staff.id and s.schedule_date == prev_date),
            None
        )

        if not prev_schedule:
            return False

        # Calculate rest period
        prev_end = datetime.combine(prev_date, prev_schedule.shift.end_time)
        current_start = datetime.combine(schedule_date, shift.start_time)

        # Handle overnight shifts
        if prev_schedule.shift.end_time < prev_schedule.shift.start_time:
            prev_end += timedelta(days=1)

        rest_hours = (current_start - prev_end).total_seconds() / 3600

        return rest_hours < min_rest_hours


class FairDistributionConstraint(SchedulingConstraint):
    """Ensures fair distribution of weekend/holiday shifts"""

    def is_violated(self, staff: Staff, shift: Shift, schedule_date: date,
                    existing_schedules: List[Schedule]) -> bool:
        max_weekends_per_month = self.parameters.get("max_weekends_per_month", 2)

        # Check if it's a weekend
        if schedule_date.weekday() < 5:  # Monday = 0, Sunday = 6
            return False

        # Count weekend shifts this month
        month_start = schedule_date.replace(day=1)
        if schedule_date.month == 12:
            month_end = schedule_date.replace(year=schedule_date.year + 1, month=1, day=1)
        else:
            month_end = schedule_date.replace(month=schedule_date.month + 1, day=1)

        weekend_shifts = sum(
            1 for s in existing_schedules
            if s.staff_id == staff.id
            and month_start <= s.schedule_date < month_end
            and s.schedule_date.weekday() >= 5
        )

        return weekend_shifts >= max_weekends_per_month


class SchedulingEngine:
    """Main scheduling engine with constraint satisfaction"""

    CONSTRAINT_CLASSES = {
        "consecutive_night_shifts": ConsecutiveNightShiftConstraint,
        "max_shifts_per_week": MaxShiftsPerWeekConstraint,
        "max_hours_per_week": MaxHoursPerWeekConstraint,
        "min_rest_period": MinRestPeriodConstraint,
        "fair_distribution": FairDistributionConstraint,
    }

    def __init__(self, db: Session):
        self.db = db

    def can_assign_shift(
            self,
            staff: Staff,
            shift: Shift,
            schedule_date: date,
            department_id: int
    ) -> tuple[bool, List[str]]:
        """
        Check if a staff member can be assigned to a shift
        Returns: (can_assign: bool, violated_rules: List[str])
        """
        violations = []

        # Get existing schedules for this staff member
        existing_schedules = self.db.query(Schedule).filter(
            Schedule.staff_id == staff.id,
            Schedule.schedule_date >= schedule_date - timedelta(days=30)
        ).all()

        # Check if staff is on leave
        if self._is_on_leave(staff, schedule_date):
            violations.append("Staff is on approved leave")
            return False, violations

        # Get applicable rules for this hospital/department
        rules = self._get_applicable_rules(staff.hospital_id, department_id)

        # Check each constraint
        for rule in rules:
            if not rule.is_active:
                continue

            constraint_class = self.CONSTRAINT_CLASSES.get(rule.rule_type)
            if not constraint_class:
                continue

            constraint = constraint_class(rule)
            if constraint.is_violated(staff, shift, schedule_date, existing_schedules):
                violations.append(f"{rule.rule_name}: {rule.description}")

        return len(violations) == 0, violations

    def generate_schedule(
            self,
            department_id: int,
            start_date: date,
            end_date: date,
            required_coverage: Dict[str, int]  # shift_name -> number of staff needed
    ) -> Dict[date, List[Dict]]:
        """
        Generate optimized schedule for a department
        required_coverage example: {"Morning": 3, "Evening": 2, "Night": 2}
        """
        schedule = defaultdict(list)

        # Get all available staff for this department
        available_staff = self.db.query(Staff).filter(
            Staff.department_id == department_id
        ).all()

        # Get all shifts
        shifts = self.db.query(Shift).all()
        shift_map = {s.name: s for s in shifts}

        current_date = start_date
        while current_date <= end_date:
            for shift_name, count_needed in required_coverage.items():
                shift = shift_map.get(shift_name)
                if not shift:
                    continue

                assigned_count = 0
                for staff in available_staff:
                    if assigned_count >= count_needed:
                        break

                    can_assign, violations = self.can_assign_shift(
                        staff, shift, current_date, department_id
                    )

                    if can_assign:
                        schedule[current_date].append({
                            "staff_id": staff.id,
                            "staff_name": f"{staff.first_name} {staff.last_name}",
                            "shift_id": shift.id,
                            "shift_name": shift.name,
                            "department_id": department_id
                        })
                        assigned_count += 1

                # Warning if not enough staff
                if assigned_count < count_needed:
                    schedule[current_date].append({
                        "warning": f"Insufficient staff for {shift_name}: need {count_needed}, assigned {assigned_count}"
                    })

            current_date += timedelta(days=1)

        return dict(schedule)

    def _is_on_leave(self, staff: Staff, schedule_date: date) -> bool:
        """Check if staff has approved leave on this date"""
        leave = self.db.query(LeaveRequest).filter(
            LeaveRequest.staff_id == staff.id,
            LeaveRequest.status == "approved",
            LeaveRequest.start_date <= schedule_date,
            LeaveRequest.end_date >= schedule_date
        ).first()

        return leave is not None

    def _get_applicable_rules(
            self,
            hospital_id: int,
            department_id: Optional[int] = None
    ) -> List[SchedulingRule]:
        """Get all active scheduling rules for hospital/department"""
        query = self.db.query(SchedulingRule).filter(
            SchedulingRule.hospital_id == hospital_id,
            SchedulingRule.is_active == True
        )

        if department_id:
            query = query.filter(
                (SchedulingRule.department_id == department_id) |
                (SchedulingRule.department_id.is_(None))
            )
        else:
            query = query.filter(SchedulingRule.department_id.is_(None))

        return query.order_by(SchedulingRule.priority.desc()).all()