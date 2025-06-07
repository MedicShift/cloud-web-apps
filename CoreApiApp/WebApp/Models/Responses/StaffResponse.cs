using CoreApiApp.Common.Enums;

namespace CoreApiApp.Models.Responses;

public class StaffResponse
{
    public required List<StaffViewModel> Staffs { get; set; }
    public int TotalCount { get; set; }
    
}