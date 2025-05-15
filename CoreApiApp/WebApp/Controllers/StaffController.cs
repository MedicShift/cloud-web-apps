using CoreApiApp.Data.Repositories.Interfaces;
using CoreApiApp.Models.Requests;
using Microsoft.AspNetCore.Mvc;

namespace CoreApiApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StaffController : ControllerBase
{
    public IStaffRepository _staffRepository;
    
    public StaffController(IStaffRepository staffRepository)
    {
        _staffRepository = staffRepository;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAllStaff(Guid hospitalId)
    {
        return Ok(await _staffRepository.GetAllHospitalStaffsAsync(hospitalId));
    }

    // [HttpGet("{id}")]
    // public async Task<IActionResult> GetStaffById(Guid id) { /* ... */ }

    // [HttpPost]
    // public async Task<IActionResult> CreateStaff([FromBody] CreateStaffRequest request)

}