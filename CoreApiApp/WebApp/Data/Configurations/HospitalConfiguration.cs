using CoreApiApp.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CoreApiApp.Data.Configurations;

public class HospitalConfiguration : IEntityTypeConfiguration<Hospital>
{
    public void Configure(EntityTypeBuilder<Hospital> builder)
    {
        builder.ToTable("Hospital");

        builder.HasKey(h => h.Id);
        
        builder.Property(h => h.Guid)
            .HasDefaultValueSql("NEWID()");

        builder.Property(h => h.Name)
            .HasColumnType("NVARCHAR(256)")
            .IsRequired();
        
        builder.Property(h => h.EmailId)
            .HasColumnType("varchar(256)")
            .IsRequired();
        
        builder.Property(h => h.Address)
            .HasColumnType("varchar(512)")
            .IsRequired();
        
        builder.Property(h => h.ContactInfo)
            .HasColumnType("varchar(256)")
            .IsRequired();
        
        builder.HasMany(h => h.Staffs)
            .WithOne(s => s.Hospital)
            .HasForeignKey(s => s.HospitalId)
            .IsRequired();

        builder.Property(h => h.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired();

        builder.Property(h => h.UpdatedAt)
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired()
            .IsConcurrencyToken();
        
        builder.Property(h => h.DeletedAt)
            .IsRequired(false)
            .IsConcurrencyToken();

    }
}