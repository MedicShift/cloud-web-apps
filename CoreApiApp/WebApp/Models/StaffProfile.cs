namespace CoreApiApp.Models;

public class StaffProfile
{
    public required string StaffGuid { get; set; }        
    public required string HospitalGuid { get; set; }        
    public required string FirstName { get; set; }       
    public required string LastName { get; set; }      
    public required string? EmailId { get; set; }           
    public required string Designation { get; set; }           
    public string? Department { get; set; }
}