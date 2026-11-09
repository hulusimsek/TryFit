using TryFit.Domain.Enums;

namespace TryFit.Application.DTOs;

public class OutfitDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal TotalPrice { get; set; }
    public double MannequinHeightCm { get; set; }
    public double MannequinWeightKg { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<OutfitItemDto> Items { get; set; } = new();
}

public class OutfitItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Brand { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; } = "TL";
    public string ImageUrl { get; set; } = string.Empty;
    public string ProductUrl { get; set; } = string.Empty;
    public ClothingCategory Category { get; set; }
}

public class CreateOutfitDto
{
    public string Title { get; set; } = "Yeni Kombinim";
    public string? Description { get; set; }
    public double MannequinHeightCm { get; set; } = 168.0;
    public double MannequinWeightKg { get; set; } = 60.0;
    public List<CreateOutfitItemDto> Items { get; set; } = new();
}

public class CreateOutfitItemDto
{
    public string Title { get; set; } = string.Empty;
    public string? Brand { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; } = "TL";
    public string ImageUrl { get; set; } = string.Empty;
    public string ProductUrl { get; set; } = string.Empty;
    public ClothingCategory Category { get; set; }
}

public class BodyMetricsDto
{
    public double HeightCm { get; set; }
    public double WeightKg { get; set; }
    public BodyType BodyType { get; set; }
    public double Bmi { get; set; }
    public string BmiCategory { get; set; } = string.Empty;
    public double ScaleY { get; set; }
    public double ScaleX { get; set; }
    public double ScaleZ { get; set; }
}
