using CoreApiApp.Data.Entities;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CoreApiApp.Data;

public class CoreDbContext : DbContext, ICoreDbContext, IDataProtectionKeyContext
{
    
    public DbSet<Hospital> Hospital { get; set; }
    public DbSet<Staff> Staff { get; set; }
    public DbSet<Department> Department { get; set; }
    public DbSet<Designation> Designation { get; set; }
    public DbSet<Shift> Shift { get; set; }
    public DbSet<Schedule> Schedule { get; set; }
    public DbSet<RequestType> RequestType { get; set; }
    public DbSet<Request> Request { get; set; }
    public DbSet<LeaveRequest> LeaveRequest { get; set; }
    public new DbSet<T> Set<T>() where T : class => base.Set<T>();

    public DbSet<DataProtectionKey> DataProtectionKeys { get; }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await base.SaveChangesAsync(cancellationToken);
    }

    public CoreDbContext(DbContextOptions<CoreDbContext> options) : base(options) { }
    
    // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    // {
    //     base.OnConfiguring(optionsBuilder);
    //
    //     optionsBuilder
    //         .LogTo(Console.WriteLine, new[] {
    //             DbLoggerCategory.Database.Command.Name,
    //             DbLoggerCategory.Database.Transaction.Name
    //         }, LogLevel.Information)
    //         .EnableSensitiveDataLogging();
    // }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CoreDbContext).Assembly);
    }
}
