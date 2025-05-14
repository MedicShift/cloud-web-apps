namespace CoreApiApp.Data.Entities;

public class ShiftDetail
{
    public int ShiftId { get; set; }
    public Guid Guid { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public string CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}