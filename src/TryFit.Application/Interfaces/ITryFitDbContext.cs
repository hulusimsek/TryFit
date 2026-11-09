using Microsoft.EntityFrameworkCore;
using TryFit.Domain.Entities;

namespace TryFit.Application.Interfaces;

public interface ITryFitDbContext
{
    DbSet<Outfit> Outfits { get; }
    DbSet<OutfitItem> OutfitItems { get; }
    DbSet<UserProfile> UserProfiles { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
