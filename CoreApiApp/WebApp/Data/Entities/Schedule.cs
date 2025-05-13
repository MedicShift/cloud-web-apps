namespace CoreApiApp.Data.Entities;

public class Schedule
{
    public int Id { get; set; }
    public Guid Guid { get; set; }
    public int StaffId { get; set; }
    public int ShiftId { get; set; }
    public int DepartmentId { get; set; }
    public DateTime AssignedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}