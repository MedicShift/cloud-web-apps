using CoreApiApp.Common.Enums;
using CoreApiApp.Data.Entities;
using CoreApiApp.Models.Responses;

namespace CoreApiApp.Common.Mappings;

public class LeaveRequestMapper
{
    public static LeaveRequestsSummaryResponse ToResponse(LeaveRequest request)
    {
        var leaveRequest = new LeaveRequestsSummaryResponse()
        {
            RequestGuid = request.Request.Guid,
            RequestTypeId = request.Request.RequestType.Guid,
            RequestedBy = request.Request.Staff.FirstName,
            Status = ((RequestStatus)request.Request.Status).ToString(),
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Reason = request.Reason,
            ReviewedBy = request.Staff.FirstName
        };
        return leaveRequest;
    }
    
    public static List<LeaveRequestsSummaryResponse> ToResponseList(List<LeaveRequest> requestTypes)
    {
        return requestTypes.Select(s => ToResponse(s)).ToList();
    }
}