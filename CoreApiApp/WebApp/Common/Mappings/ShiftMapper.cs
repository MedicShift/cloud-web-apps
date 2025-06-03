using CoreApiApp.Data.Entities;
using CoreApiApp.Models.Responses;

namespace CoreApiApp.Common.Mappings;

public class ShiftMapper
{
    public static ShiftResponse ToResponse(Shift shift)
    {

        return new ShiftResponse()
        {
            Guid = shift.Guid,
            ShiftType = shift.ShiftType,
            StartTime = shift.StartTime,
            EndTime = shift.EndTime
        };
    }
    
    public static List<ShiftResponse> ToResponseList(List<Shift> shift)
    {
        return shift.Select(s => ToResponse(s)).ToList();
    }
}