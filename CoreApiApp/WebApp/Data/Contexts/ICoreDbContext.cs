using CoreApiApp.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CoreApiApp.Data;

public interface ICoreDbContext
{
    DbSet<Hospital> Hospital { get; set; }
    DbSet<Staff> Staff { get; set; }
    DbSet<Department> Department { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}