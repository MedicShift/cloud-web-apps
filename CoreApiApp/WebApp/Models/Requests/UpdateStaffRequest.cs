using CoreApiApp.Common.Enums;

namespace CoreApiApp.Models.Requests;

public class UpdateStaffRequest
{
    public Guid StaffId { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string EmailId { get; set; }
    public Guid? DepartmentId { get; set; }
    public required string Designation { get; set; }
}