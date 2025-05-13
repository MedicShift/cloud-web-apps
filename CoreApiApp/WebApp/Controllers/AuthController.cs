using CoreApiApp.Models;
using CoreApiApp.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CoreApiApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpPost("Login")]
        public async Task<ActionResult<string>> Login(UserLoginModel request)
        {
            var token = await authService.LoginAsync(request);
            if (token == null)
            {
                return Unauthorized("Invalid email or password");
            }

            return Ok(token);
        }
        
        
    }
}