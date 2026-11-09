using Microsoft.EntityFrameworkCore;
using TryFit.Application.Interfaces;
using TryFit.Domain.Entities;

namespace TryFit.Infrastructure.Persistence;

public class TryFitDbContext : DbContext, ITryFitDbContext
{
    public TryFitDbContext(DbContextOptions<TryFitDbContext> options) : base(options)
    {
    }

    public DbSet<Outfit> Outfits => Set<Outfit>();
    public DbSet<OutfitItem> OutfitItems => Set<OutfitItem>();
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Outfit>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(150);
            entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)");
            
            entity.HasMany(e => e.Items)
                  .WithOne(i => i.Outfit)
                  .HasForeignKey(i => i.OutfitId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OutfitItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(250);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.ImageUrl).IsRequired();
        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(100);
        });
    }
}
