using CoreApiApp.Common.Enums;

namespace CoreApiApp.Data.Entities;

public class StaffRole
{
    public int Id { get; set; }
    public Guid Guid { get; set; }
    public Staff Staff { get; set; }
    public int StaffId { get; set; }
    public Role Role { get; set; }     
    public int? TeamId { get; set; }
    public DateTime AssignedAt { get; set; }
}