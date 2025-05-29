using CoreApiApp.Models;
using CoreApiApp.Models.Requests;

namespace CoreApiApp.Services.Interfaces;

public interface IAuthService
{
    Task<string> LoginAsync(StaffLoginModel request);
    
}