using CoreApiApp.Data;
using CoreApiApp.Data.Repositories.Interfaces;
using CoreApiApp.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoreApiApp.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ShiftController : ControllerBase
{
    private readonly IShiftRepository _shiftRepository;
    
    public ShiftController(IShiftRepository shiftRepository)
    {
        _shiftRepository = shiftRepository;
    }
    
    [HttpGet("All")]
    public async Task<IActionResult> GetShiftsAsync()
    {
        var hospitalGuid = Guid.Parse(User.FindFirst("hospital_guid")?.Value!);
        return Ok(await _shiftRepository.GetAllHospitalShiftsAsync(hospitalGuid));
    }
        
    [HttpPost]
    public async Task<ActionResult<bool>> CreateDepartmentAsync(CreateShiftRequest request)
    {
        var hospitalGuid = Guid.Parse(User.FindFirst("hospital_guid")?.Value!);
        return Ok(await _shiftRepository.CreateHospitalShiftAsync(request, hospitalGuid));
    }
    
    [HttpPut]
    public async Task<ActionResult<string>> UpdateShift(UpdateShiftRequest request)
    {
        var response = await _shiftRepository.UpdateHospitalShiftAsync(request);
        
        if (!response)
        {
            return Conflict(new { message = "Failed to update shift" });
        }
        return Ok(new { success = true, message = "Shift updated successfully" });
    }
        
    [HttpDelete]
    public async Task<ActionResult<string>> DeleteShift(Guid shiftGuid)
    {
        var response = await _shiftRepository.DeleteHospitalShiftAsync(shiftGuid);
        
        if (!response)
        {
            return Conflict(new { message = "Failed to delete shift" });
        }
        return Ok(new { success = true, message = "Shift deleted successfully" });
    }
}