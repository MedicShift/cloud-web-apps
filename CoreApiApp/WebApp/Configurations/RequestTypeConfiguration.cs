using CoreApiApp.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CoreApiApp.Configurations;

public class RequestTypeConfiguration : IEntityTypeConfiguration<RequestType>
{
    public void Configure(EntityTypeBuilder<RequestType> builder)
    {
        builder.ToTable("RequestType");
        
        builder.HasKey(rt => rt.Id);
        
        builder.Property(rt=> rt.Guid)
            .HasDefaultValueSql("NEWID()");
        
        builder.Property(rt => rt.Name)
            .HasColumnType("NVARCHAR(256)")
            .IsRequired();

        builder.Property(rt => rt.Description)
            .HasColumnType("NVARCHAR(512)");
        
        builder.Property(rt => rt.CreatedAt)
            .HasColumnType("datetime2")
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired();
        
        builder.Property(rt=> rt.UpdatedAt)
            .HasColumnType("datetime2")
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired()
            .IsConcurrencyToken();
    }
}