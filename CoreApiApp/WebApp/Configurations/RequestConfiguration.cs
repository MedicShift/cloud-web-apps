using CoreApiApp.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CoreApiApp.Configurations;

public class RequestConfiguration : IEntityTypeConfiguration<Request>
{
    public void Configure(EntityTypeBuilder<Request> builder)
    {
        builder.HasKey(r => r.Id);
        
        builder.Property(r=> r.Guid)
            .HasDefaultValueSql("NEWID()");
        
        builder.HasOne(r=>r.RequestType)
            .WithMany(r => r.Requests)
            .HasForeignKey(r => r.TypeId)
            .IsRequired(true);
        
        builder.HasOne(r => r.Staff)
            .WithMany(s=>s.Requests)
            .HasForeignKey(r=>r.RequestedBy)
            .IsRequired(true)
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.Property(r => r.Status)
            .HasColumnType("TINYINT")
            .HasDefaultValue(0)
            .IsRequired();

        builder.Property(r => r.RequestedAt)
            .HasColumnType("datetime2")
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired();


    }
}