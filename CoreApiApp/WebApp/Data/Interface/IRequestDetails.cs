namespace CoreApiApp.Data.Entities;

public interface IRequestDetails
{
    public Guid RequestTypeId { get; set; }
    public Guid RequestGuid { get; set; }
    public Guid RequestedBy { get; set; }
   public int RequestId { get; set; }
   public string StartDate { get; set; }
    public string EndDate { get; set; }
    public string Reason { get; set; }
    public int ReviewedBy { get; set; }
}
