using Sieve.Attributes;

namespace CoreApiApp.Data.Entities;

public class Staff
{
    public int Id { get; set; }
    public Guid Guid { get; set; }
    
    [Sieve(CanFilter = true, CanSort = true)]
    public string FirstName { get; set; }
    
    [Sieve(CanFilter = true, CanSort = true)]
    public string LastName { get; set; }
    [Sieve(CanSort = true)]
    public string EmailId { get; set; }
    public string PasswordHash { get; set; }
    public int HospitalId { get; set; }
    public int? DepartmentId { get; set; }
    public Department? Department { get; set; } = null;
    public Hospital Hospital { get; set; }
    
    public Designation Designation { get; set; }
    
    public int DesignationId { get; set; }
    public bool IsAdmin { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    
    public ICollection<Schedule> Schedules { get; set; }
    public ICollection<Request> Requests { get; set; }
    public ICollection<LeaveRequest> LeaveRequests { get; set; }

}