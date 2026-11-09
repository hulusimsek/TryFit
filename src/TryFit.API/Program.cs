using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using TryFit.Domain.Entities;
using TryFit.Domain.Enums;
using TryFit.Infrastructure;
using TryFit.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Controllers & JSON configuration
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// Infrastructure & Persistence
builder.Services.AddInfrastructureServices(builder.Configuration);

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Auto-migrate / Ensure database is created and seed samples
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<TryFitDbContext>();
    dbContext.Database.EnsureCreated();

    // Örnek seed verisi (Kullanıcı ilk açtığında hemen hazır bir Trendyol kombini görebilsin)
    if (!dbContext.Outfits.Any())
    {
        var sampleOutfit = new Outfit
        {
            Title = "Şık Bahar / Ofis Kombini",
            Description = "Trendyol'dan seçilmiş trençkot, basic crop tişört ve yüksek bel mom jean.",
            MannequinHeightCm = 168.0,
            MannequinWeightKg = 58.0,
            Items = new List<OutfitItem>
            {
                new()
                {
                    Title = "Kruvaze Bej Trençkot Kaban",
                    Brand = "Trendyol Curve",
                    Price = 1199.99m,
                    Currency = "TL",
                    ImageUrl = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80",
                    ProductUrl = "https://www.trendyol.com",
                    Category = ClothingCategory.Outerwear
                },
                new()
                {
                    Title = "Ribana Kare Yaka Siyah Crop Bluz",
                    Brand = "Trendyolmilla",
                    Price = 249.90m,
                    Currency = "TL",
                    ImageUrl = "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80",
                    ProductUrl = "https://www.trendyol.com",
                    Category = ClothingCategory.Top
                },
                new()
                {
                    Title = "Yüksek Bel Düz Paça Mavi Jean",
                    Brand = "Trendyolmilla",
                    Price = 649.90m,
                    Currency = "TL",
                    ImageUrl = "https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80",
                    ProductUrl = "https://www.trendyol.com",
                    Category = ClothingCategory.Bottom
                },
                new()
                {
                    Title = "Beyaz Minimalist Deri Sneaker",
                    Brand = "Trendyol Shoes",
                    Price = 849.99m,
                    Currency = "TL",
                    ImageUrl = "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80",
                    ProductUrl = "https://www.trendyol.com",
                    Category = ClothingCategory.Shoes
                }
            }
        };

        sampleOutfit.RecalculateTotalPrice();
        dbContext.Outfits.Add(sampleOutfit);
        dbContext.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
