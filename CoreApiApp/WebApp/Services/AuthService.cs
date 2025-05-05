using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CoreApiApp.Entities;
using CoreApiApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Shared.Infra.CoreStore.Abstractions;

namespace CoreApiApp.Services;

public class AuthService : IAuthService
{
    private readonly ICoreDbContext _coreDbContext;
    private readonly IConfiguration _config;
    
    public AuthService(ICoreDbContext coreDbContext,
      IConfiguration config)
    {
        _coreDbContext = coreDbContext;
        _config = config;
    }

    public async Task<User?> RegisterAsync(UserLoginModel request)
    {
        if (await _coreDbContext.Users.AnyAsync(u => u.Email == request.Email))
        {
            return null;
        }

        var user = new User();
        var hashedPassword = new PasswordHasher<User>()
            .HashPassword(user, request.Password);
        
        user.Email = request.Email;
        user.PasswordHash = hashedPassword;
        // _coreDbContext.Users.Add(user);
        return user;
    }

    public async Task<string> LoginAsync(UserLoginModel request)
    {
        var user = await _coreDbContext.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
        {
            return null;
        }
        
        if (new PasswordHasher<Shared.Domain.Cloud.Entities.Core.User>().VerifyHashedPassword(user, user.PasswordHash, request.Password)
            == PasswordVerificationResult.Failed)
        {
            return null;
        }
        
        return  CreateToken(user);
    }
    
    private string CreateToken(Shared.Domain.Cloud.Entities.Core.User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Email)
        };
        
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config.GetValue<string>("AppSettings:TokenKey")));
        
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512); //need token length of 512 bits or 64 bytes

        var tokenDescriptor = new JwtSecurityToken(
            issuer: _config.GetValue<string>("AppSettings:Issuer"),
            audience: _config.GetValue<string>("AppSettings:Audience"),
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds
        );
        
        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }
}