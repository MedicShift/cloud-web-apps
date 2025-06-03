namespace CoreApiApp.Models.Requests;

public class UpdateShiftRequest
{
    public Guid ShiftGuid { get; set; }
    public string ShiftType { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
}