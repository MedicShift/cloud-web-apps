namespace CoreApiApp.Models;

public class ScheduleViewModel
{
    public Guid Guid { get; set; }
    public string StaffName { get; set; }
    public string ShiftType {get; set;}
    public string DepartmentName { get; set; }
    public string ScheduledDate { get; set; }
}