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

            Response.Cookies.Append("accessToken", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // only over HTTPS
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddHours(1)
            });

            return Ok(new { message = "Login successful" });
        }
        
        [HttpPost("Logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Append("accessToken", "", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(-1)
            });

            return Ok(new { message = "Logged out successfully" });
        }
        
    }
}