using TryFit.Application.DTOs;

namespace TryFit.Application.Interfaces;

public interface ITrendyolScraperService
{
    Task<TrendyolProductDto> ScrapeProductAsync(string url, CancellationToken cancellationToken = default);
}
