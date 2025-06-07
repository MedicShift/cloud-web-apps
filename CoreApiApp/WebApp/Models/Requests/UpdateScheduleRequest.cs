namespace CoreApiApp.Models.Requests;

public class UpdateScheduleRequest
{
    public Guid ScheduleId { get; set; }
    public Guid StaffId { get; set; }
    public Guid ShiftId { get; set; }
    public Guid DepartmentGuid { get; set; }
    public required string ScheduleDate { get; set; }
}