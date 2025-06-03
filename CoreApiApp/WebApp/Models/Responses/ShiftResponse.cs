namespace CoreApiApp.Models.Responses;

public class ShiftResponse
{
    public Guid Guid { get; set; }
    public string ShiftType { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
}