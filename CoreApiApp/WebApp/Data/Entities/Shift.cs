namespace CoreApiApp.Data.Entities;

public class Shift
{
    public int Id { get; set; }
    public Guid Guid { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public string CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}