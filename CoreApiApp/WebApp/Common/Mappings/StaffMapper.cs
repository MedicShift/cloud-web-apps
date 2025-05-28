using CoreApiApp.Data.Entities;
using CoreApiApp.Models;
using CoreApiApp.Models.Responses;
using Newtonsoft.Json;

namespace CoreApiApp.Common.Mappings;

public class StaffMapper
{
    public static StaffViewModel ToResponse(Staff staff)
    {
        
        return new StaffViewModel()
        {
            Guid = staff.Guid,
            Name = staff.FirstName + " " + staff.LastName,
            Email = staff.EmailId,
            DepartmentName = staff.Department?.Name,
            Role = staff.Role.ToString()
        };
    }
    
    public static List<StaffViewModel> ToResponseList(List<Staff> staffs)
    {
        return staffs.Select(s => ToResponse(s)).ToList();
    }
}