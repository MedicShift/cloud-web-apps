using CoreApiApp.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CoreApiApp.Data;

public interface ICoreDbContext
{
    DbSet<Hospital> Hospital { get; set; }
    DbSet<Staff> Staff { get; set; }
    DbSet<Department> Department { get; set; }
    DbSet<Designation> Designation { get; set; }
    DbSet<Shift> Shift { get; set; }
    DbSet<Schedule> Schedule { get; set; }
    DbSet<RequestType> RequestType { get; set; }
    DbSet<Request> Request { get; set; }
    DbSet<LeaveRequest> LeaveRequest { get; set; }
    DbSet<StaffRole> StaffRole { get; set; }
    
    DbSet<T> Set<T>() where T : class;
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}