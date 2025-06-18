namespace CoreApiApp.Models.Requests;

public class CreateScheduleRequest
{
    public Guid StaffId { get; set; }
    public Guid ShiftId { get; set; }
    public Guid DepartmentGuid { get; set; }
    public required string ScheduleDate { get; set; }
}