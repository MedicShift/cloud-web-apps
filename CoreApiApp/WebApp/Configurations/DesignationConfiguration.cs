using CoreApiApp.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CoreApiApp.Configurations;

public class DesignationConfiguration : IEntityTypeConfiguration<Designation>
{
    public void Configure(EntityTypeBuilder<Designation> builder)
    {
        builder.ToTable("Designation");

        builder.HasKey(d => d.Id);
        
        builder.Property(d => d.Guid)
            .HasDefaultValueSql("NEWID()");

        builder.Property(d => d.Title)
            .HasColumnType("NVARCHAR(256)")
            .IsRequired();
        
        builder.HasMany(d => d.Staffs)
            .WithOne(s => s.Designation)
            .HasForeignKey(s => s.DesignationId)
            .IsRequired(true);
        
        builder.HasOne(d => d.Hospital)             
            .WithMany(h => h.Designations)        
            .HasForeignKey(d => d.HospitalId)    
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(d => d.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired();

        builder.Property(d => d.UpdatedAt)
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired()
            .IsConcurrencyToken();
    }
    
}
