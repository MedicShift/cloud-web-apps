namespace CoreApiApp.Data.Entities;

public class Department
{
    public int Id { get; set; }
    public Guid Guid { get; set; }
    public string Name { get; set; }
    public int HospitalId { get; set; }
    public string CreatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}