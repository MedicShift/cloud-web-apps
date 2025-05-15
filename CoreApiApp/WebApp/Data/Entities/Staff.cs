namespace CoreApiApp.Data.Entities;

public class Staff
{
    public int Id { get; set; }
    public Guid Guid { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string EmailId { get; set; }
    public string PasswordHash { get; set; }
    public int HospitalId { get; set; }
    public int? DepartmentId { get; set; }
    public Department Department { get; set; } = null!;
    public Hospital Hospital { get; set; } = null!;
    public bool IsAdmin { get; set; }
    public int RoleId { get; set; }
    public string CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}