using CoreApiApp.Models;
using CoreApiApp.Models.Requests;
using CoreApiApp.Services;
using CoreApiApp.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CoreApiApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpPost("Login")]
        public async Task<ActionResult<string>> Login(StaffLoginModel request)
        {
            var token = await authService.LoginAsync(request);
            if (token == null)
            {
                return Unauthorized("Invalid email or password");
            }

            var jwtToken = new
            {
                accessToken = token
            };

            return Ok(jwtToken);
        }
        
        [HttpPost("Register")]
        public async Task<ActionResult<string>> Register(CreateStaffRequest request)
        {
            var response = await authService.RegisterStaffAsync(request);
            if (!response)
            {
                return Conflict(new { message = "User already exists" });
            }

            return Ok(new { success = true, message = "User registered successfully." });
        }
    }
}