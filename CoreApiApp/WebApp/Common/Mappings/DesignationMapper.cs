using CoreApiApp.Data.Entities;
using CoreApiApp.Models.Responses;

namespace CoreApiApp.Common.Mappings;

public class DesignationMapper
{
    public static DesignationResponse ToResponse(Designation designation)
    {
        
        return new DesignationResponse
        {
            Guid = designation.Guid,
            Title = designation.Title
        };
    }
    
    public static List<DesignationResponse> ToResponseList(List<Designation> designations)
    {
        return designations.Select(h => ToResponse(h)).ToList();
    }
}