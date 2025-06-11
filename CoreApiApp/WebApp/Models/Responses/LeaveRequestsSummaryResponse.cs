namespace CoreApiApp.Models.Responses;

public class LeaveRequestsSummaryResponse
{
    public Guid RequestTypeId { get; set; }
    public Guid RequestGuid { get; set; }
    public string RequestedBy { get; set; }
    public required string Status { get; set; }
    public string StartDate { get; set; }
    public string EndDate { get; set; }
    public string Reason { get; set; }
    public string ReviewedBy { get; set; }
}