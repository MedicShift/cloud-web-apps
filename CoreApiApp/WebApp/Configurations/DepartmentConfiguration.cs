using CoreApiApp.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CoreApiApp.Configurations;

public class DepartmentConfiguration : IEntityTypeConfiguration<Department>
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
        
        builder.HasOne(d => d.Hospital)             
            .WithMany(h => h.Departments)        
            .HasForeignKey(d => d.HospitalId)    
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(d => d.CreatedAt)
            .HasColumnType("datetime2")
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired();

        builder.Property(d => d.UpdatedAt)
            .HasColumnType("datetime2")
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired()
            .IsConcurrencyToken();
    }
    
}