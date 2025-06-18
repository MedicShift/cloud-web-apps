using CoreApiApp.Data.Entities;
using CoreApiApp.Models;
using CoreApiApp.Models.Responses;

namespace CoreApiApp.Common.Mappings;

public class RequestTypeMapper
{
    public static RequestTypesResponse ToResponse(RequestType requestType)
    {
        
        return new RequestTypesResponse()
        {
            Guid = requestType.Guid, 
            Type = requestType.Type,
            Description = requestType.Description
        };
    }
    
    public static List<RequestTypesResponse> ToResponseList(List<RequestType> requestTypes)
    {
        return requestTypes.Select(s => ToResponse(s)).ToList();
    }
}