using CoreApiApp.Common.Enums;

namespace CoreApiApp.Models.Requests;

public class CreateStaffRequest
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string EmailId { get; set; }
    public string Password { get; set; }
    public Guid HospitalId { get; set; }
    public Guid? DepartmentId { get; set; }
    public Role Role { get; set; }
    
}