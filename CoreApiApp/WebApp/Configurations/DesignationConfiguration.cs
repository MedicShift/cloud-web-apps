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
