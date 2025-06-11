using System.ComponentModel.DataAnnotations.Schema;

namespace CoreApiApp.Data.Entities;

public class LeaveRequest : IRequestDetails
{
    public int Id { get; set; }
    public Request Request { get; set; }
    [NotMapped]
    public Guid RequestTypeId { get; set; }
    [NotMapped]
    public Guid RequestGuid { get; set; }
    [NotMapped]
    public Guid RequestedBy { get; set; }
    public int RequestId { get; set; }
    public Staff Staff { get; set; }
    public required string StartDate { get; set; }
    public required string EndDate { get; set; }
    public required string Reason { get; set; }
    public int ReviewedBy { get; set; }
    public DateTime UpdatedAt { get; set; }
}