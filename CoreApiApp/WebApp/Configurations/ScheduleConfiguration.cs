using CoreApiApp.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CoreApiApp.Configurations;

public class ScheduleConfiguration
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
            .HasColumnType("NVARCHAR(256)")
            .IsRequired();
        
        builder.Property(sc => sc.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired();
        
        builder.Property(sc=> sc.UpdatedAt)
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired()
            .IsConcurrencyToken();
    }
}