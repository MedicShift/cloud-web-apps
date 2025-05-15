using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CoreApiApp.Common.Constants;
using CoreApiApp.Data;
using CoreApiApp.Data.Entities;
using CoreApiApp.Models;
using CoreApiApp.Models.Requests;
using CoreApiApp.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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

    public async Task<bool> RegisterStaffAsync(CreateStaffRequest request)
    {
        if (await _coreDbContext.Staff.AnyAsync(s => s.EmailId == request.EmailId))
        {
            return false;
        }
        
        var hospital = _coreDbContext.Hospital.FirstOrDefault(h => h.Guid == request.HospitalId);
        var department = _coreDbContext.Department.FirstOrDefault(d => d.Guid == request.DepartmentId);

        var staff = new Staff();
        var hashedPassword = new PasswordHasher<Staff>()
            .HashPassword(staff, request.Password);

        staff.EmailId = request.EmailId;
        staff.FirstName = request.FirstName;
        staff.LastName = request.LastName;
        staff.HospitalId = hospital.Id;
        staff.DepartmentId = department?.Id;
        staff.RoleId = request.Role;
        staff.PasswordHash = hashedPassword;
        
        await _coreDbContext.Staff.AddAsync(staff);
        var result = await _coreDbContext.SaveChangesAsync();
        return result > 0;
    }

    public async Task<string> LoginAsync(StaffLoginModel request)
    {
        var user = await _coreDbContext.Staff
            .Include(s => s.Hospital)
            .FirstOrDefaultAsync(u => u.EmailId == request.Email);
        
        var users = new Staff();
        if (user == null)
        {
            return null;
        }
        
        if (new PasswordHasher<Staff>().VerifyHashedPassword(user, user.PasswordHash, request.Password)
            == PasswordVerificationResult.Failed)
        {
            return null;
        }
        
        return  CreateToken(user);
    }
    
    private string CreateToken(Staff staff)
    {
        var claims = new List<Claim>();
        claims.Add(new Claim(ClaimTypes.Name, staff.EmailId));
        claims.Add(new Claim(ClaimTypeConstants.StaffGuid, staff.Guid.ToString()));
        claims.Add(new Claim(ClaimTypeConstants.HospitalGuid, staff.Hospital.Guid.ToString()));
        
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