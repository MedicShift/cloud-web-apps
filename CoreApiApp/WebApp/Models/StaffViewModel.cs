namespace CoreApiApp.Models;

public class StaffViewModel
{
    public Guid Guid { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public string? DepartmentName { get; set; } = null;
    public required string Designation { get; set; }
}