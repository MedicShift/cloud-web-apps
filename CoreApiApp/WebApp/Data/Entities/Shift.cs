namespace CoreApiApp.Data.Entities;

public class Shift
{
    public int Id { get; set; }
    public Guid Guid { get; set; }
    public required string ShiftType { get; set; }
    public required string StartTime { get; set; }
    public required string EndTime { get; set; }
    public Hospital Hospital { get; set; }
    public int HospitalId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<Schedule> Schedules { get; set; }

}