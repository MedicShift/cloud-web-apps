using System.Security.Claims;
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
    public IStaffRepository _staffRepository;
    
    public StaffController(IStaffRepository staffRepository)
    {
        _staffRepository = staffRepository;
    }
    
    [HttpGet("Me")]
    public async Task<IActionResult> GetStaffProfile()
    {
        var staffProfile = new StaffProfile()
        {
            StaffGuid = User.FindFirst("staff_guid").Value,
            HospitalGuid = User.FindFirst("hospital_guid").Value,
            FirstName = User.FindFirst("first_name").Value,
            LastName = User.FindFirst("last_name").Value,
            EmailId = User.FindFirst(ClaimTypes.Email)?.Value,
            Designation = User.FindFirst("designation").Value
        };
        return Ok(staffProfile);
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
        request.HospitalGuid = Guid.Parse(User.FindFirst("hospital_guid")?.Value);
        
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
    
            
    [HttpGet("Designations")]
    public async Task<IActionResult> GetDesignationsAsync()
    {
        var hospitalGuid = Guid.Parse(User.FindFirst("hospital_guid")?.Value);
        return Ok(await _staffRepository.GetStaffDesignationsAsync(hospitalGuid));
    }
    
    [HttpGet("Schedule")]
    public async Task<IActionResult> GetAllSchedules(string sorts, int page, int pageSize, string filters = "")
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
            return Ok(await _staffRepository.GetSchedulesAsync(seiveModel, Guid.Parse(hospitalGuid)));
        }
        
        return NotFound();
    }

    [HttpPost("Schedule")]
    public async Task<ActionResult<string>> CreateSchedule(CreateScheduleRequest request)
    {
        if (request.StaffGuid == Guid.Empty)
        {
            return BadRequest("Please select a staff member.");
        }

        if (request.ShiftGuid == Guid.Empty){
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
}