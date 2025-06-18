namespace CoreApiApp.Models.Requests;

public class UpdateLeaveRequest
{
    public Guid RequestId { get; set; }
    public Guid RequestTypeId { get; set; }
    public string Reason { get; set; }
    public string StartDate { get; set; }
    public string EndDate { get; set; }
}
