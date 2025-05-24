using CoreApiApp.Common.Enums;

namespace CoreApiApp.Data.Entities;

public class Hospital
{
    public int Id { get; set; }
    public Guid Guid { get; set; }
    public string Name { get; set; }
    public string EmailId { get; set; }
    public string Address { get; set; }
    public string ContactInfo { get; set; }
    public SetupStatus SetupStatus {get;set;}
    public PlanStatus PlanStatus {get;set;}
    public DateTime PlanExpiresOn { get; set; }
    public string CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public ICollection<Staff> Staffs { get; set; } = null!;
}