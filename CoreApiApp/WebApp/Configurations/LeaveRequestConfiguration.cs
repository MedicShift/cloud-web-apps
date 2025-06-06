using CoreApiApp.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CoreApiApp.Configurations;

public class LeaveRequestConfiguration : IEntityTypeConfiguration<LeaveRequest>
{

    public void Configure(EntityTypeBuilder<LeaveRequest> builder)
    {
        builder.HasKey(lr => lr.Id);
        
        builder.HasOne(lr => lr.Request)
            .WithOne(r=>r.LeaveRequest)
            .HasForeignKey<LeaveRequest>(lr=>lr.RequestId)
            .IsRequired(true);
        
        builder.Property(lr => lr.StartDate)
            .HasColumnType("NVARCHAR(256)")
            .IsRequired(true);
        
        builder.Property(lr => lr.EndDate)
            .HasColumnType("NVARCHAR(256)")
            .IsRequired(true);
        
        builder.Property(lr => lr.Reason)
            .HasColumnType("NVARCHAR(256)")
            .IsRequired(true);

        builder.HasOne(lr => lr.Staff)
            .WithMany(s => s.LeaveRequests)
            .HasForeignKey(lr => lr.ReviewedBy)
            .IsRequired(true)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.Property(r => r.UpdatedAt)
            .HasColumnType("datetime2")
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired();
    }
}