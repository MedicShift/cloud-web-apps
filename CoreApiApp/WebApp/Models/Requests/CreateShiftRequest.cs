namespace CoreApiApp.Models.Requests;

public class CreateShiftRequest
{
    public required string ShiftType { get; set; }
    public required string StartTime { get; set; }
    public required string EndTime { get; set; }
}