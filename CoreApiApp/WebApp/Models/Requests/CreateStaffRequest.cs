using CoreApiApp.Common.Enums;

namespace CoreApiApp.Models.Requests;

public class CreateStaffRequest
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string EmailId { get; set; }
    public Guid? HospitalId { get; set; }
    public Guid? DepartmentId { get; set; }
    public Role Role { get; set; }
    
}