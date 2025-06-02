using CoreApiApp.Data.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoreApiApp.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class DepartmentController : ControllerBase
{
    private readonly IHospitalRepository _hospitalRepository;

    public DepartmentController(IHospitalRepository hospitalRepository)
    {
        _hospitalRepository = hospitalRepository;
    }
    
    [HttpPut]
    public async Task<ActionResult<string>> UpdateStaff(Guid departmentGuid, string departmentName)
    {
        
        var response = await _hospitalRepository.UpdateHospitalDepartmentAsync(departmentName, departmentGuid);
        
        if (!response)
        {
            return Conflict(new { message = "Failed to update department" });
        }
        return Ok(new { success = true, message = "Staff updated department" });
    }
        
    [HttpDelete]
    public async Task<ActionResult<string>> DeleteDepartment(Guid departmentGuid)
    {
        var response = await _hospitalRepository.DeleteHospitalDepartmentAsync(departmentGuid);
        
        if (!response)
        {
            return Conflict(new { message = "Failed to delete department" });
        }
        return Ok(new { success = true, message = "Department deleted successfully" });
    }
}