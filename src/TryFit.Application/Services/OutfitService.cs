using Microsoft.EntityFrameworkCore;
using TryFit.Application.DTOs;
using TryFit.Application.Interfaces;
using TryFit.Domain.Entities;
using TryFit.Domain.Enums;

namespace TryFit.Application.Services;

public class OutfitService : IOutfitService
{
    private readonly ITryFitDbContext _context;

    public OutfitService(ITryFitDbContext context)
    {
        _context = context;
    }

    public async Task<List<OutfitDto>> GetAllOutfitsAsync(CancellationToken cancellationToken = default)
    {
        var outfits = await _context.Outfits
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(cancellationToken);

        return outfits.Select(MapToDto).ToList();
    }

    public async Task<OutfitDto?> GetOutfitByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var outfit = await _context.Outfits
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

        return outfit == null ? null : MapToDto(outfit);
    }

    public async Task<OutfitDto> CreateOutfitAsync(CreateOutfitDto dto, CancellationToken cancellationToken = default)
    {
        var outfit = new Outfit
        {
            Title = string.IsNullOrWhiteSpace(dto.Title) ? "Yeni Kombin" : dto.Title,
            Description = dto.Description,
            MannequinHeightCm = dto.MannequinHeightCm > 0 ? dto.MannequinHeightCm : 168.0,
            MannequinWeightKg = dto.MannequinWeightKg > 0 ? dto.MannequinWeightKg : 60.0,
            Items = dto.Items.Select(i => new OutfitItem
            {
                Title = i.Title,
                Brand = i.Brand,
                Price = i.Price,
                Currency = i.Currency,
                ImageUrl = i.ImageUrl,
                ProductUrl = i.ProductUrl,
                Category = i.Category
            }).ToList()
        };

        outfit.RecalculateTotalPrice();

        await _context.Outfits.AddAsync(outfit, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return MapToDto(outfit);
    }

    public async Task<bool> DeleteOutfitAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var outfit = await _context.Outfits.FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
        if (outfit == null) return false;

        _context.Outfits.Remove(outfit);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public BodyMetricsDto CalculateMetrics(double heightCm, double weightKg)
    {
        var heightMeters = heightCm / 100.0;
        var bmi = heightMeters > 0 ? weightKg / (heightMeters * heightMeters) : 21.0;

        string category = bmi switch
        {
            < 18.5 => "Zayıf",
            < 24.9 => "Normal / İdeal",
            < 29.9 => "Hafif Kilolu",
            _ => "Dolgun / Büyük Beden"
        };

        // 3D Three.js ölçek katsayıları (Referans: 168cm, 60kg => Scale 1.0)
        double scaleY = heightCm / 168.0;
        // Kilo genişliği etkiler (BMI artışı x ve z eksenini genişletir)
        double bmiRatio = bmi / 21.26; // 60 / (1.68^2) ≈ 21.26
        double scaleX = Math.Pow(bmiRatio, 0.65);
        double scaleZ = Math.Pow(bmiRatio, 0.60);

        return new BodyMetricsDto
        {
            HeightCm = heightCm,
            WeightKg = weightKg,
            BodyType = BodyType.Hourglass,
            Bmi = Math.Round(bmi, 1),
            BmiCategory = category,
            ScaleY = Math.Round(scaleY, 3),
            ScaleX = Math.Round(scaleX, 3),
            ScaleZ = Math.Round(scaleZ, 3)
        };
    }

    private static OutfitDto MapToDto(Outfit outfit)
    {
        return new OutfitDto
        {
            Id = outfit.Id,
            Title = outfit.Title,
            Description = outfit.Description,
            TotalPrice = outfit.TotalPrice,
            MannequinHeightCm = outfit.MannequinHeightCm,
            MannequinWeightKg = outfit.MannequinWeightKg,
            CreatedAt = outfit.CreatedAt,
            Items = outfit.Items.Select(i => new OutfitItemDto
            {
                Id = i.Id,
                Title = i.Title,
                Brand = i.Brand,
                Price = i.Price,
                Currency = i.Currency,
                ImageUrl = i.ImageUrl,
                ProductUrl = i.ProductUrl,
                Category = i.Category
            }).ToList()
        };
    }
}
