using Microsoft.AspNetCore.Mvc;
using TryFit.Application.DTOs;
using TryFit.Application.Interfaces;

namespace TryFit.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BodyProfileController : ControllerBase
{
    private readonly IOutfitService _outfitService;

    public BodyProfileController(IOutfitService outfitService)
    {
        _outfitService = outfitService;
    }

    [HttpGet("calculate")]
    public ActionResult<BodyMetricsDto> Calculate([FromQuery] double height = 168.0, [FromQuery] double weight = 60.0)
    {
        if (height < 120 || height > 220) height = 168.0;
        if (weight < 35 || weight > 200) weight = 60.0;

        var metrics = _outfitService.CalculateMetrics(height, weight);
        return Ok(metrics);
    }
}
