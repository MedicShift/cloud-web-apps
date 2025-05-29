using CoreApiApp.Data.Entities;
using CoreApiApp.Models;
using CoreApiApp.Models.Responses;
using Newtonsoft.Json;

namespace CoreApiApp.Common.Mappings;

public class DeparmentMapper
{
    public static DepartmentResponse ToResponse(Department department)
    {
        
        return new DepartmentResponse
        {
            Guid = department.Guid,
            Name = department.Name
        };
    }
    
    public static List<DepartmentResponse> ToResponseList(List<Department> departments)
    {
        return departments.Select(h => ToResponse(h)).ToList();
    }
}