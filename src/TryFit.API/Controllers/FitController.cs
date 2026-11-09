using Microsoft.AspNetCore.Mvc;
using TryFit.Application.DTOs;
using TryFit.Application.Interfaces;

namespace TryFit.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FitController : ControllerBase
{
    private readonly IFitAdvisorService _fitAdvisorService;

    public FitController(IFitAdvisorService fitAdvisorService)
    {
        _fitAdvisorService = fitAdvisorService;
    }

    [HttpPost("analyze")]
    public ActionResult<FitAnalysisResultDto> Analyze([FromBody] FitAnalysisRequestDto request)
    {
        var result = _fitAdvisorService.AnalyzeFit(request);
        return Ok(result);
    }
}
