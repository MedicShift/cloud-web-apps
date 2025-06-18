using CoreApiApp.Common.Enums;

namespace CoreApiApp.Models.Responses;

public class RequestSummaryResponse
{
    public Guid RequestId { get; set; }
    public Guid RequestTypeId { get; set; }
    public string StartDate { get; set; }
    public string EndDate { get; set; }
    public Guid RequestedBy { get; set; }
    public required string Status { get; set; }
}