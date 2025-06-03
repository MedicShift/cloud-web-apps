namespace CoreApiApp.Models.Requests;

public class CreateShiftRequest
{
    public string ShiftType { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
}