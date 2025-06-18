using Sieve.Attributes;

namespace CoreApiApp.Data.Entities;

public class Designation
{
    public int Id { get; set; }
    public Guid Guid { get; set; }
    
    [Sieve(CanSort = true, CanFilter = true)]
    public required string Title { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<Staff> Staffs { get; set; } = null!;

}