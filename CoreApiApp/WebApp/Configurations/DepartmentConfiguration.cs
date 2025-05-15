using CoreApiApp.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CoreApiApp.Configurations;

public class DeparmentConfiguration : IEntityTypeConfiguration<Department>
{
    public void Configure(EntityTypeBuilder<Department> builder)
    {
        builder.ToTable("Department");

        builder.HasKey(d => d.Id);
        
        builder.Property(d => d.Guid)
            .HasDefaultValueSql("NEWID()");

        builder.Property(d => d.Name)
            .HasColumnType("NVARCHAR(256)")
            .IsRequired();
        
        builder.HasMany(d => d.Staffs)
            .WithOne(s => s.Department)
            .HasForeignKey(s => s.DepartmentId)
            .IsRequired(false);

        builder.Property(d => d.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired();

        builder.Property(d => d.UpdatedAt)
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired()
            .IsConcurrencyToken();
    }
    
}