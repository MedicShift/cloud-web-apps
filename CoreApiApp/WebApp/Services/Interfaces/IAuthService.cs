using CoreApiApp.Models;
using CoreApiApp.Models.Requests;

namespace CoreApiApp.Services.Interfaces;

public interface IAuthService
{
    Task<bool> RegisterStaffAsync(CreateStaffRequest request);
    Task<string> LoginAsync(StaffLoginModel request);
    
}