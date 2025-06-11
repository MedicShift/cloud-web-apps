namespace CoreApiApp.Data.Entities;

public class RequestType
{
    public int Id { get; set; }
    public Guid Guid { get; set; }
    public required string Type { get; set; }
    public required string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<Request> Requests { get; set; }
}