using CoreApiApp.Models;

namespace CoreApiApp.Services;

public interface IAuthService
{
    // Task<User?> RegisterAsync(UserLoginModel request);
    Task<string> LoginAsync(UserLoginModel request);
    
}