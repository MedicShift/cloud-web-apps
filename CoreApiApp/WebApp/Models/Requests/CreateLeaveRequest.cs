using System.Text.Json.Serialization;

namespace CoreApiApp.Models.Requests;

public class CreateLeaveRequest
{
    public Guid RequestTypeId { get; set; }
    [JsonIgnore]
    public Guid RequestedBy { get; set; }
    public string Reason { get; set; }
    public string StartDate { get; set; }
    public string EndDate { get; set; }
}