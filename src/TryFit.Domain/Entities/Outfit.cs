using TryFit.Domain.Common;

namespace TryFit.Domain.Entities;

public class Outfit : BaseEntity
{
    public string Title { get; set; } = "Yeni Kombin";
    public string? Description { get; set; }
    public decimal TotalPrice { get; set; }
    
    // Kombinin oluşturulduğu manken ölçüleri
    public double MannequinHeightCm { get; set; } = 168.0;
    public double MannequinWeightKg { get; set; } = 60.0;

    public ICollection<OutfitItem> Items { get; set; } = new List<OutfitItem>();

    public void RecalculateTotalPrice()
    {
        TotalPrice = Items.Sum(i => i.Price);
    }
}
