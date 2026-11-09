using TryFit.Domain.Common;
using TryFit.Domain.Enums;

namespace TryFit.Domain.Entities;

public class OutfitItem : BaseEntity
{
    public Guid OutfitId { get; set; }
    public Outfit? Outfit { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? Brand { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; } = "TL";
    public string ImageUrl { get; set; } = string.Empty;
    public string ProductUrl { get; set; } = string.Empty;
    public ClothingCategory Category { get; set; }
    
    // 3D Sahne yerleşim parametreleri (opsiyonel fine-tuning)
    public double ScaleMultiplier { get; set; } = 1.0;
    public double OffsetY { get; set; } = 0.0;
}
