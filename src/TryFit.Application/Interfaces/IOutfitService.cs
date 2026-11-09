using TryFit.Application.DTOs;

namespace TryFit.Application.Interfaces;

public interface IOutfitService
{
    Task<List<OutfitDto>> GetAllOutfitsAsync(CancellationToken cancellationToken = default);
    Task<OutfitDto?> GetOutfitByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<OutfitDto> CreateOutfitAsync(CreateOutfitDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteOutfitAsync(Guid id, CancellationToken cancellationToken = default);
    BodyMetricsDto CalculateMetrics(double heightCm, double weightKg);
}
