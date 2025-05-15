using CoreApiApp.Common.Enums;

namespace CoreApiApp.Models.Responses;

public class StaffResponse
{
    public Guid Guid { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string? DepartmentName { get; set; } = null;
    public int Role { get; set; }
    
}