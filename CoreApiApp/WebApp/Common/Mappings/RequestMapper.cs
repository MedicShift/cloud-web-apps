using CoreApiApp.Common.Enums;
using CoreApiApp.Data.Entities;
using CoreApiApp.Models.Responses;

namespace CoreApiApp.Common.Mappings;

public class RequestMapper
{
    public static RequestSummaryResponse ToResponse(Request request)
    {
        
        return new RequestSummaryResponse()
        {
            RequestId = request.Guid,
            RequestTypeId = request.RequestType.Guid,
            RequestedBy = request.Staff.Guid,
            Status = ((RequestStatus)request.Status).ToString()
        };
    }
    
    public static List<RequestSummaryResponse> ToResponseList(List<Request> requests)
    {
        return requests.Select(s => ToResponse(s)).ToList();
    }
}