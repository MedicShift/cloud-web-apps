using CoreApiApp.Common.Enums;

namespace CoreApiApp.Models.Responses;

public class StaffResponse
{
    public List<StaffViewModel> Staffs { get; set; }
    public int TotalCount { get; set; }
    
}