namespace CoreApiApp.Models.Responses;

public class ShiftResponse
{
    public Guid Guid { get; set; }
    public required string ShiftType { get; set; }
    public required string StartTime { get; set; }
    public required string EndTime { get; set; }
}