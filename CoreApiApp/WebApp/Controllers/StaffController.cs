using System.Security.Claims;
using CoreApiApp.Common.Enums;
using CoreApiApp.Data.Repositories.Interfaces;
using CoreApiApp.Models;
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
    private readonly IStaffRepository _staffRepository;
    
    public StaffController(IStaffRepository staffRepository)
    {
        _staffRepository = staffRepository;
    }
    
    [HttpGet("Me")]
    public Task<IActionResult> GetStaffProfile()
    {
        var staffProfile = new StaffProfile()
        {
            StaffGuid = User.FindFirst("staff_guid").Value,
            HospitalGuid = User.FindFirst("hospital_guid").Value,
            FirstName = User.FindFirst("first_name").Value,
            LastName = User.FindFirst("last_name").Value,
            EmailId = User.FindFirst(ClaimTypes.Email).Value,
            Designation = User.FindFirst("designation").Value,
            Department = User.FindFirst("department")?.Value,
            Roles = User.FindAll(ClaimTypes.Role ).Select(c => c.Value).ToList()
        };
        return Task.FromResult<IActionResult>(Ok(staffProfile));
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
        request.HospitalId = Guid.Parse(User.FindFirst("hospital_guid")?.Value!);
            
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
        var response = await _staffRepository.UpdateHospitalStaffAsync(request);
        
        if (!response)
        {
            return Conflict(new { message = "Failed to update staff" });
        }
        return Ok(new { success = true, message = "Staff updated successfully" });
    }

    [HttpDelete]
    public async Task<ActionResult<string>> DeleteStaff(Guid staffId)
    {
        var response = await _staffRepository.DeleteHospitalStaffAsync(staffId);
        
        if (!response)
        {
            return Conflict(new { message = "Failed to delete staff" });
        }
        return Ok(new { success = true, message = "Staff deleted successfully" });
    }
    
            
    [HttpGet("Designations")]
    public async Task<IActionResult> GetDesignationsAsync()
    {
        var hospitalGuid = Guid.Parse(User.FindFirst("hospital_guid")?.Value!);
        return Ok(await _staffRepository.GetStaffDesignationsAsync(hospitalGuid));
    }
    
    [HttpGet("{staffId}/Schedule")]
    public async Task<IActionResult> GetStaffScheduleAsync(Guid staffId, string startDate, string endDate)
    {
        return Ok(await _staffRepository.GetStaffScheduleAsync(staffId, startDate, endDate));
    }
    
    [HttpPost("Schedule")]
    public async Task<ActionResult<string>> CreateSchedule(CreateScheduleRequest request)
    {
        if (request.StaffId == Guid.Empty)
        {
            return BadRequest("Please select a staff member.");
        }

        if (request.ShiftId == Guid.Empty){
            return BadRequest("Please select a shift.");
        }

        if (request.DepartmentGuid == Guid.Empty)
        {
            return BadRequest("Please select a department.");
        }

        if (string.IsNullOrWhiteSpace(request.ScheduleDate))
        {
            return BadRequest("Please provide the schedule date.");
            
        }

        if (!DateTime.TryParse(request.ScheduleDate, out _))
        {
            return BadRequest("Please enter a valid schedule date.");
        }
        
        var response = await _staffRepository.CreateScheduleAsync(request);
        
        if (!response)
        {
            return Conflict(new { message = "Failed to create schedule" });
        }

        return Ok(new { success = true, message = "Created new schedule." });
    }
    
    [HttpPut("Schedule")]
    public async Task<ActionResult<string>> UpdateSchedule(UpdateScheduleRequest request)
    {
        
        var response = await _staffRepository.UpdateScheduleAsync(request);
        
        if (!response)
        {
            return Conflict(new { message = "Failed to update schedule" });
        }
        return Ok(new { success = true, message = "Schedule updated successfully" });
    }

    [HttpDelete("Schedule")]
    public async Task<ActionResult<string>> DeleteSchedule(Guid scheduleGuid)
    {
        var response = await _staffRepository.DeleteScheduleAsync(scheduleGuid);
        
        if (!response)
        {
            return Conflict(new { message = "Failed to delete schedule" });
        }
        return Ok(new { success = true, message = "Schedule deleted successfully" });
    }
    
    [HttpPost("StaffRole")]
    public async Task<ActionResult<string>> AddStaffRole(Role role, Guid staffId)
    {
            
        var response = await _staffRepository.AddStaffRoleAsync(role, staffId);
        if (!response)
        {
            return Conflict(new { message = "Role already exists" });
        }

        return Ok(new { success = true, message = "Role added successfully." });
    }
    
    [HttpDelete("StaffRole")]
    public async Task<ActionResult<string>> DeleteStaffRole(Guid roleGuid)
    {
        var response = await _staffRepository.DeleteStaffRoleAsync(roleGuid);
        
        if (!response)
        {
            return Conflict(new { message = "Failed to delete  ole" });
        }
        return Ok(new { success = true, message = "Role deleted successfully" });
    }
}