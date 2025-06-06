namespace CoreApiApp.Data.Entities;

public class LeaveRequest
{
    public int Id { get; set; }
    public Request Request { get; set; }
    public int RequestId { get; set; }
    public Staff Staff { get; set; }
    public string StartDate { get; set; }
    public string EndDate { get; set; }
    public string Reason { get; set; }
    public int ReviewedBy { get; set; }
    public DateTime UpdatedAt { get; set; }
}