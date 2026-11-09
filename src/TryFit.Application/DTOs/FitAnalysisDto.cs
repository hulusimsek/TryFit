using TryFit.Domain.Enums;

namespace TryFit.Application.DTOs;

public class SizeChartEntryDto
{
    public string Size { get; set; } = "S";
    public double ChestCm { get; set; }
    public double WaistCm { get; set; }
    public double HipsCm { get; set; }
    public double LengthCm { get; set; }
    public double DiffChest { get; set; }
    public double DiffWaist { get; set; }
    public double DiffHips { get; set; }
    public string FitStatus { get; set; } = "ideal"; // tight, snug, ideal, oversize
    public string FitNote { get; set; } = string.Empty;
}

public class DetailedFitReportDto
{
    public string GarmentTitle { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string RecommendedSize { get; set; } = "M";
    public string FabricElasticity { get; set; } = "Esnemez Dokuma";
    public string PrimaryFitAdvice { get; set; } = string.Empty;
    public string LengthMarker { get; set; } = "Kalça Hizasında";
    public double EstimatedLengthFromShoulderCm { get; set; }
    public List<SizeChartEntryDto> SizeMatrix { get; set; } = new();
}

public class GarmentFitDetailDto
{
    public string Title { get; set; } = string.Empty;
    public ClothingCategory Category { get; set; }
    public string RecommendedSize { get; set; } = string.Empty;
    public string LengthAnalysis { get; set; } = string.Empty;
    public string FitAdvice { get; set; } = string.Empty;
    public string SilhouetteNote { get; set; } = string.Empty;
}

public class FitAnalysisResultDto
{
    public double UserHeightCm { get; set; }
    public double UserWeightKg { get; set; }
    public double UserChestCm { get; set; }
    public double UserWaistCm { get; set; }
    public double UserHipsCm { get; set; }
    public double UserInseamCm { get; set; }
    public double Bmi { get; set; }
    public string BmiCategory { get; set; } = string.Empty;
    public int HarmonyScore { get; set; } = 94;
    public string PaletteName { get; set; } = "Doğal & Toprak Tonları";
    public string OverallStylingAdvice { get; set; } = string.Empty;
    public List<GarmentFitDetailDto> ItemFits { get; set; } = new();
    public List<DetailedFitReportDto> DetailedReports { get; set; } = new();
}

public class FitAnalysisRequestDto
{
    public double HeightCm { get; set; } = 168.0;
    public double WeightKg { get; set; } = 58.0;
    public double? CustomChestCm { get; set; }
    public double? CustomWaistCm { get; set; }
    public double? CustomHipsCm { get; set; }
    public double? CustomInseamCm { get; set; }
    public List<CreateOutfitItemDto> Items { get; set; } = new();
}
