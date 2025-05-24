using CoreApiApp.Data.Entities;
using CoreApiApp.Models;
using CoreApiApp.Models.Responses;
using Newtonsoft.Json;

namespace CoreApiApp.Common.Mappings;

public class StaffMapper
{
    public static StaffResponse ToResponse(Staff staff)
    {
        
        return new StaffResponse()
        {
            Guid = staff.Guid,
            Name = staff.FirstName + " " + staff.LastName,
            Email = staff.EmailId,
            DepartmentName = staff.Department?.Name,
            Role = staff.Role
        };
    }
    
    public static List<StaffResponse> ToResponseList(List<Staff> staffs)
    {
        return staffs.Select(s => ToResponse(s)).ToList();
    }
}