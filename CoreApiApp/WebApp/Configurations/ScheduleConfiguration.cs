using CoreApiApp.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CoreApiApp.Configurations;

public class ScheduleConfiguration : IEntityTypeConfiguration<Schedule>
{
    public void Configure(EntityTypeBuilder<Schedule> builder)
    {
        builder.ToTable("Schedule");

        builder.HasKey(sc => sc.Id);
        
        builder.Property(sc=> sc.Guid)
            .HasDefaultValueSql("NEWID()");
        
        builder.HasOne(sc => sc.Staff)
            .WithMany(s => s.Schedules)
            .HasForeignKey(sc => sc.StaffId)
            .IsRequired(true);
        
        builder.HasOne(sc => sc.Shift)
            .WithMany(sh => sh.Schedules)
            .HasForeignKey(sc => sc.ShiftId)
            .IsRequired(true);
        
        builder.HasOne(sc => sc.Department)
            .WithMany(d => d.Schedules)
            .HasForeignKey(sc => sc.DepartmentId)
            .IsRequired(true);

        builder.Property(sc => sc.ScheduledDate)
            .HasColumnType("NVARCHAR(255)")
            .IsRequired();
        
        builder.Property(sc => sc.CreatedAt)
            .HasColumnType("datetime2")
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired();
        
        builder.Property(sc=> sc.UpdatedAt)
            .HasColumnType("datetime2")
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired()
            .IsConcurrencyToken();
    }
}