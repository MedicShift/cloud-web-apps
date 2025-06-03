namespace CoreApiApp.Models.Responses;

public class StaffViewModel
{
    public Guid Guid { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string? DepartmentName { get; set; } = null;
    public string Designation { get; set; }
}