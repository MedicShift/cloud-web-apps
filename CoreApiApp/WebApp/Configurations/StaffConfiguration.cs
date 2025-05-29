using CoreApiApp.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CoreApiApp.Configurations;

public class StaffConfiguration : IEntityTypeConfiguration<Staff>
{
    public void Configure(EntityTypeBuilder<Staff> builder)
    {
        builder.ToTable("Staff");
        
        builder.HasKey(s => s.Id);
        
        builder.Property(s => s.Guid)
            .HasDefaultValueSql("NEWID()");
        
        builder.Property(s => s.FirstName)
            .HasColumnType("NVARCHAR(256)")
            .IsRequired();
        
        builder.Property(s => s.LastName)
            .HasColumnType("NVARCHAR(256)")
            .IsRequired();
        
        builder.Property(s => s.EmailId)
            .HasColumnType("NVARCHAR(256)")
            .IsRequired();

        builder.Property(s => s.PasswordHash)
            .HasColumnType("NVARCHAR(max)")
            .IsRequired();
        
        builder.Property(s => s.Role)
            .HasColumnType("TINYINT")
            .IsRequired();
        
        builder.Property(s => s.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired();
        
        builder.Property(s => s.UpdatedAt)
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired()
            .IsConcurrencyToken();
        
        builder.Property(s => s.DeletedAt)
            .IsRequired(false)
            .IsConcurrencyToken();
            
    }
}

