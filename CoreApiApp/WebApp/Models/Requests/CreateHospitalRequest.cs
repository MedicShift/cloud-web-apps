namespace CoreApiApp.Models.Requests;

public class CreateHospitalRequest
{
    public required string HospitalName { get; set; }
    public required string EmailId { get; set; }
    public required Address Address { get; set; }
    public required string ContactInfo { get; set; }
}