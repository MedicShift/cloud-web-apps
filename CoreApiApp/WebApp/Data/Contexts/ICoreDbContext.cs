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
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}