namespace CoreApiApp.Data.Entities;

public class Department
{
    public int Id { get; set; }
    public Guid Guid { get; set; }
    public required string Name { get; set; }
    public required string CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<Staff> Staffs { get; set; } = null!;

}