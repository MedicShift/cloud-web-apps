namespace CoreApiApp.Entities;

public class User
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
}