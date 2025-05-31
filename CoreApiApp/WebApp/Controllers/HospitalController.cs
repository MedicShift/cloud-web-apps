using CoreApiApp.Data.Entities;
using CoreApiApp.Data.Repositories.Interfaces;
using CoreApiApp.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CoreApiApp.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class HospitalController : ControllerBase
    {
        private readonly IHospitalRepository _hospitalRepository;

        public HospitalController(IHospitalRepository hospitalRepository)
        {
            _hospitalRepository = hospitalRepository;
        }
        
        [HttpGet("All")]
        public async Task<IActionResult> GetAllHospitalAsync()
        {
            return Ok(await _hospitalRepository.GetAllHospitalAsync());
        }
        
        [HttpPost]
        public async Task<ActionResult<bool>> CreateHospitalAsync(CreateHospitalRequest request)
        {
            var hospital = new Hospital
            {
                Name = request.HospitalName,
                EmailId = request.EmailId,
                Address = JsonConvert.SerializeObject(request.Address),
                ContactInfo = request.ContactInfo
            };
            
            return Ok(await _hospitalRepository.CreateHospitalAsync(hospital));
        }
        
        [HttpGet("Departments")]
        public async Task<IActionResult> GetDepartmentsAsync()
        {
            var hospitalGuid = Guid.Parse(User.FindFirst("hospital_guid")?.Value);
            return Ok(await _hospitalRepository.GetHospitalDepartmentsAsync(hospitalGuid));
        }
    }
}