using Microsoft.EntityFrameworkCore;
using TryFit.Application.DTOs;
using TryFit.Application.Services;
using TryFit.Domain.Enums;
using TryFit.Infrastructure.Persistence;
using Xunit;

namespace TryFit.UnitTests;

public class OutfitServiceTests
{
    private TryFitDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<TryFitDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new TryFitDbContext(options);
    }

    [Fact]
    public void CalculateMetrics_ShouldReturnAccurateBmiAndScales()
    {
        var context = CreateInMemoryContext();
        var service = new OutfitService(context);

        var metrics = service.CalculateMetrics(168, 60);

        Assert.Equal(21.3, metrics.Bmi);
        Assert.Equal("Normal / İdeal", metrics.BmiCategory);
        Assert.Equal(1.0, metrics.ScaleY);
        Assert.True(metrics.ScaleX > 0.9 && metrics.ScaleX < 1.1);
    }

    [Fact]
    public async Task CreateOutfit_ShouldSaveToDatabase_AndCalculateTotalPrice()
    {
        var context = CreateInMemoryContext();
        var service = new OutfitService(context);

        var dto = new CreateOutfitDto
        {
            Title = "Bahar Şıklığı",
            MannequinHeightCm = 170,
            MannequinWeightKg = 55,
            Items = new List<CreateOutfitItemDto>
            {
                new()
                {
                    Title = "Trendyol Bluz",
                    Price = 250m,
                    Category = ClothingCategory.Top,
                    ImageUrl = "https://example.com/top.jpg"
                },
                new()
                {
                    Title = "Trendyol Jean",
                    Price = 550m,
                    Category = ClothingCategory.Bottom,
                    ImageUrl = "https://example.com/bottom.jpg"
                }
            }
        };

        var result = await service.CreateOutfitAsync(dto);

        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal(800m, result.TotalPrice);
        Assert.Equal(2, result.Items.Count);

        var allOutfits = await service.GetAllOutfitsAsync();
        Assert.Single(allOutfits);
    }

    [Fact]
    public async Task DeleteOutfit_ShouldRemoveFromDatabase()
    {
        var context = CreateInMemoryContext();
        var service = new OutfitService(context);

        var created = await service.CreateOutfitAsync(new CreateOutfitDto
        {
            Title = "Silinecek Kombin",
            Items = new()
        });

        var deleted = await service.DeleteOutfitAsync(created.Id);

        Assert.True(deleted);
        var all = await service.GetAllOutfitsAsync();
        Assert.Empty(all);
    }

    [Fact]
    public void FitAdvisorService_ShouldProvideTailoredFitRecommendations()
    {
        var advisor = new FitAdvisorService();
        var request = new FitAnalysisRequestDto
        {
            HeightCm = 162,
            WeightKg = 54,
            Items = new List<CreateOutfitItemDto>
            {
                new() { Title = "Bej Trençkot", Category = ClothingCategory.Outerwear },
                new() { Title = "Yüksek Bel Mom Jean", Category = ClothingCategory.Bottom }
            }
        };

        var result = advisor.AnalyzeFit(request);

        Assert.Equal(20.6, result.Bmi);
        Assert.Equal("İdeal / Fit Orantı", result.BmiCategory);
        Assert.Equal(2, result.ItemFits.Count);
        Assert.Contains("162", result.ItemFits[0].LengthAnalysis);
        Assert.Contains("36", result.ItemFits[0].RecommendedSize);
    }

    [Fact]
    public void CuratedProductService_ShouldReturn10ProductsAcrossCategories()
    {
        var service = new TryFit.Infrastructure.ExternalServices.CuratedProductService();
        var products = service.GetCuratedProducts();

        Assert.Equal(10, products.Count);
        Assert.Equal(3, products.Count(p => p.Category == ClothingCategory.Top));
        Assert.Equal(3, products.Count(p => p.Category == ClothingCategory.Dress));
        Assert.Equal(2, products.Count(p => p.Category == ClothingCategory.Outerwear));
        Assert.Equal(2, products.Count(p => p.Category == ClothingCategory.Bottom));

        // Check multi-angles are present
        Assert.All(products, p =>
        {
            Assert.False(string.IsNullOrEmpty(p.MultiAngles.Front));
            Assert.False(string.IsNullOrEmpty(p.MultiAngles.Angle45));
            Assert.False(string.IsNullOrEmpty(p.MultiAngles.Side));
            Assert.False(string.IsNullOrEmpty(p.MultiAngles.Back));
            Assert.True(p.SizeChart.Count >= 3);
        });
    }

    [Fact]
    public void FitAdvisorService_ShouldCalculateCustomMeasurementsDelta()
    {
        var advisor = new FitAdvisorService();
        var request = new FitAnalysisRequestDto
        {
            HeightCm = 170,
            WeightKg = 62,
            CustomChestCm = 94,
            CustomWaistCm = 74,
            CustomHipsCm = 100,
            Items = new List<CreateOutfitItemDto>
            {
                new() { Title = "Siyah Hoodie", Category = ClothingCategory.Top }
            }
        };

        var result = advisor.AnalyzeFit(request);

        Assert.Equal(94, result.UserChestCm);
        Assert.Equal(74, result.UserWaistCm);
        Assert.Equal(100, result.UserHipsCm);
        Assert.NotEmpty(result.DetailedReports);
        Assert.True(result.DetailedReports[0].SizeMatrix.Count >= 5);
    }
}
