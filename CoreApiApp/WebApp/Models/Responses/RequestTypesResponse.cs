namespace CoreApiApp.Models.Responses;

public class RequestTypesResponse
{
    public Guid Guid { get; set; }
    public required string Type { get; set; }
    public required string Description { get; set; }
}