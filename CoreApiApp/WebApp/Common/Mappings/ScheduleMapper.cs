using CoreApiApp.Data.Entities;
using CoreApiApp.Models;
using CoreApiApp.Models.Responses;

namespace CoreApiApp.Common.Mappings;

public class ScheduleMapper
{
    public static ScheduleResponse ToResponse(Schedule schedule)
    {

        return new ScheduleResponse()
        {
            Guid = schedule.Guid,
            StaffName = schedule.Staff.FirstName + " " + schedule.Staff.LastName,
            ShiftType = schedule.Shift.ShiftType,
            DepartmentName = schedule.Department.Name,
            ScheduledDate = schedule.ScheduledDate
        };
    }
    
    public static List<ScheduleResponse> ToResponseList(List<Schedule> schedules)
    {
        return schedules.Select(s => ToResponse(s)).ToList();
    }
}