namespace CoreApiApp.Data.Entities;

public class Schedule
{
    public int Id { get; set; }
    public Guid Guid { get; set; }
    public Staff Staff { get; set; }
    public int StaffId { get; set; }
    public Shift Shift { get; set; }
    public int ShiftId { get; set; }
    public string ScheduledDate { get; set; }
    public string CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
}