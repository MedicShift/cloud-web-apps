namespace CoreApiApp.Models.Responses;

public class ScheduleResponse
{
    public Guid Guid { get; set; }
    public required string StaffName { get; set; }
    public required string ShiftType { get; set; }
    public required string DepartmentName { get; set; }
    public required string ScheduledDate { get; set; }
}