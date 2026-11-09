using TryFit.Application.DTOs;

namespace TryFit.Application.Interfaces;

public interface ICuratedProductService
{
    IReadOnlyList<TrendyolProductDto> GetCuratedProducts();
    TrendyolProductDto? GetProductById(string id);
}
