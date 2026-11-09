using TryFit.Domain.Enums;

namespace TryFit.Application.DTOs;

public class ProductMultiAnglesDto
{
    public string Front { get; set; } = string.Empty;
    public string Angle45 { get; set; } = string.Empty;
    public string Side { get; set; } = string.Empty;
    public string Back { get; set; } = string.Empty;
}

public class ProductSizeSpecDto
{
    public string Size { get; set; } = "S";
    public double ChestCm { get; set; }
    public double WaistCm { get; set; }
    public double HipsCm { get; set; }
    public double LengthCm { get; set; }
}

public class TrendyolProductDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Brand { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; } = "TL";
    public string ImageUrl { get; set; } = string.Empty;
    public string ProductUrl { get; set; } = string.Empty;
    public ClothingCategory Category { get; set; }
    public string? SubCategory { get; set; }
    public string? DetectedColor { get; set; }
    public string? HexColor { get; set; }
    public string FabricElasticity { get; set; } = "Esnemez Dokuma"; // Esnemez, Az Esnek, Likralı
    public string LengthType { get; set; } = "waist"; // crop, waist, hip, knee, midi, maxi
    public double ShoulderToHemCm { get; set; } = 68.0;
    public ProductMultiAnglesDto MultiAngles { get; set; } = new();
    public List<ProductSizeSpecDto> SizeChart { get; set; } = new();
}

public class ScrapeRequestDto
{
    public string Url { get; set; } = string.Empty;
}
