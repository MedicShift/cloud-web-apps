namespace CoreApiApp.Data.Entities;

public class Request
{
    public int Id { get; set; }
    public Guid Guid { get; set; }
    public int StaffId { get; set; }
    public int Status { get; set; }
    public int TypeId { get; set; }
    public DateTime RequestedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}