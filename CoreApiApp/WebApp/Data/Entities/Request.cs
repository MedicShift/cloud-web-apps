namespace CoreApiApp.Data.Entities;

public class Request
{
    public int Id { get; set; }
    public Guid Guid { get; set; }
    public RequestType RequestType { get; set; }
    public int TypeId { get; set; }
    public Staff Staff { get; set; }
    public int RequestedBy { get; set; }
    public int Status { get; set; }
    public DateTime RequestedAt { get; set; }
    public LeaveRequest LeaveRequest { get; set; }
}