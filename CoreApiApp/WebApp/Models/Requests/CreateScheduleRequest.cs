namespace CoreApiApp.Models.Requests;

public class CreateScheduleRequest
{
    public Guid StaffGuid { get; set; }
    public Guid ShiftGuid { get; set; }
    public Guid DepartmentGuid { get; set; }
    public required string ScheduleDate { get; set; }
}