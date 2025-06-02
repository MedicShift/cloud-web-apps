using CoreApiApp.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CoreApiApp.Configurations;

public class ShiftConfiguration
{
    public void Configure(EntityTypeBuilder<Shift> builder)
    {
        builder.ToTable("Shift");

        builder.HasKey(s => s.Id);
        
        builder.Property(s=> s.Guid)
            .HasDefaultValueSql("NEWID()");

        builder.Property(s=> s.StartTime)
            .HasColumnType("NVARCHAR(256)")
            .IsRequired();
        
        builder.Property(s=> s.EndTime)
            .HasColumnType("NVARCHAR(256)")
            .IsRequired();

        builder.Property(s=> s.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired();

        builder.Property(s=> s.UpdatedAt)
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired()
            .IsConcurrencyToken();
    }
}