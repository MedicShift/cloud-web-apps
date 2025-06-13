using CoreApiApp.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CoreApiApp.Configurations;

public class StaffRoleConfiguration : IEntityTypeConfiguration<StaffRole>
{
    public void Configure(EntityTypeBuilder<StaffRole> builder)
    {
        builder.ToTable("StaffRole");
        
        builder.HasKey(sr => sr.Id);
        
        builder.Property(sr => sr.Guid)
            .HasDefaultValueSql("NEWID()");

        builder.HasOne(sr => sr.Staff)
            .WithMany(s => s.StaffRoles)
            .HasForeignKey(sr => sr.StaffId);
        
        builder.Property(sr => sr.Role)
            .HasConversion<byte>()
            .IsRequired();

        builder.Property(sr => sr.TeamId)
            .HasColumnType("bigint")
            .IsRequired(false);
        
        builder.Property(sr => sr.AssignedAt)
            .HasColumnType("DATETIME2") 
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired();
    }
}