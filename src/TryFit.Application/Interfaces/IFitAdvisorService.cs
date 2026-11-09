using TryFit.Application.DTOs;

namespace TryFit.Application.Interfaces;

public interface IFitAdvisorService
{
    FitAnalysisResultDto AnalyzeFit(FitAnalysisRequestDto request);
}
