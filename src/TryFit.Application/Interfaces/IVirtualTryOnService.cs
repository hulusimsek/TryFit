using TryFit.Application.DTOs;

namespace TryFit.Application.Interfaces;

public interface IVirtualTryOnService
{
    Task<TryOnResponseDto> GenerateTryOnAsync(TryOnRequestDto request, CancellationToken cancellationToken = default);
}
