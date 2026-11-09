using Microsoft.AspNetCore.Mvc;
using TryFit.Application.DTOs;
using TryFit.Application.Interfaces;

namespace TryFit.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TryOnController : ControllerBase
{
    private readonly IVirtualTryOnService _tryOnService;

    public TryOnController(IVirtualTryOnService tryOnService)
    {
        _tryOnService = tryOnService;
    }

    [HttpPost("generate")]
    public async Task<ActionResult<TryOnResponseDto>> Generate([FromBody] TryOnRequestDto request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.GarmentImageUrl))
        {
            return BadRequest("Lütfen denenecek kıyafet görselini belirtin.");
        }

        var result = await _tryOnService.GenerateTryOnAsync(request, cancellationToken);
        return Ok(result);
    }
}
