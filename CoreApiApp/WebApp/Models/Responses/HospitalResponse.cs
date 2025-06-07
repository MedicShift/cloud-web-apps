using CoreApiApp.Common.Enums;

namespace CoreApiApp.Models.Responses;

public class HospitalResponse
{
    public Guid Guid { get; set; }
    public required string Name { get; set; }
    public required string EmailId { get; set; }
    public required Address Address { get; set; }
    public required string ContactInfo { get; set; }
    public SetupStatus SetupStatus {get;set;}
    public PlanStatus PlanStatus {get;set;}
    public DateTime PlanExpiresOn { get; set; }
}