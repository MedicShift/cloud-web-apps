using CoreApiApp.Data.Repositories.Interfaces;
using CoreApiApp.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sieve.Models;

namespace CoreApiApp.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class StaffController : ControllerBase
{
    public IStaffRepository _staffRepository;
    
    public StaffController(IStaffRepository staffRepository)
    {
        _staffRepository = staffRepository;
    }
    
    [HttpGet("All")]
    public async Task<IActionResult> GetAllStaff(string sorts, int page, int pageSize, string filters = "")
    {
        var seiveModel = new SieveModel
        {
            Filters = filters,
            Sorts = sorts,
            Page = page,
            PageSize = pageSize
        };
            
        var hospitalGuid = User.FindFirst("hospital_guid")?.Value;
        if (hospitalGuid != null)
        {
            return Ok(await _staffRepository.GetAllHospitalStaffsAsync(seiveModel, Guid.Parse(hospitalGuid)));
        }
        return NotFound();
    }

    // [HttpGet("{id}")]
    // public async Task<IActionResult> GetStaffById(Guid id) { /* ... */ }

    [HttpPost]
    public async Task<ActionResult<string>> CreateStaff(CreateStaffRequest request)
    {
        request.HospitalId = Guid.Parse(User.FindFirst("hospital_guid")?.Value);
        var response = await _staffRepository.CreateHospitalStaffAsync(request);
        if (!response)
        {
            return Conflict(new { message = "User already exists" });
        }

        return Ok(new { success = true, message = "User added successfully." });
    }
    
    [HttpPut]
    public async Task<ActionResult<string>> UpdateStaff(UpdateStaffRequest request)
    {
        request.StaffGuid = Guid.Parse(User.FindFirst("staff_guid")?.Value);
        var response = await _staffRepository.UpdateHospitalStaffAsync(request);
        
        if (!response)
        {
            return Conflict(new { message = "Failed to update staff" });
        }
        return Ok(new { success = true, message = "Staff updated successfully" });
    }

    [HttpDelete]
    public async Task<ActionResult<string>> DeleteStaff(Guid staffGuid)
    {
        var response = await _staffRepository.DeleteHospitalStaffAsync(staffGuid);
        
        if (!response)
        {
            return Conflict(new { message = "Failed to delete staff" });
        }
        return Ok(new { success = true, message = "Staff deleted successfully" });
    }
}