namespace CoreApiApp.Models.Responses;

public class StaffViewModel
{
    public Guid Guid { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string? DepartmentName { get; set; } = null;
    public string Role { get; set; }
}