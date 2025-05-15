namespace CoreApiApp.Models.Responses;

public class HospitalResponse
{
    public Guid Guid { get; set; }
    public string Name { get; set; }
    public string EmailId { get; set; }
    public Address Address { get; set; }
    public string ContactInfo { get; set; }
}