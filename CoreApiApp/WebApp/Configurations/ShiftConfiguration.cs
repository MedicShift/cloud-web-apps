using CoreApiApp.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CoreApiApp.Configurations;

public class ShiftConfiguration : IEntityTypeConfiguration<Shift>
{
    public void Configure(EntityTypeBuilder<Shift> builder)
    {
        builder.ToTable("Shift");

        builder.HasKey(s => s.Id);
        
        builder.Property(s=> s.Guid)
            .HasColumnType("UNIQUEIDENTIFIER")
            .HasDefaultValueSql("NEWID()");

        builder.Property(s => s.ShiftType)
            .HasColumnType("NVARCHAR(256)")
            .IsRequired();
        
        builder.Property(s=> s.StartTime)
            .HasColumnType("NVARCHAR(256)")
            .IsRequired();
        
        builder.Property(s=> s.EndTime)
            .HasColumnType("NVARCHAR(256)")
            .IsRequired();
        
        builder.HasOne(s => s.Hospital)             
            .WithMany(h => h.Shifts)        
            .HasForeignKey(d => d.HospitalId)    
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.Property(s=> s.CreatedAt)
            .HasColumnType("DATETIME2") 
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired();

        builder.Property(s=> s.UpdatedAt)
            .HasColumnType("DATETIME2") 
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired()
            .IsConcurrencyToken();
    }
}