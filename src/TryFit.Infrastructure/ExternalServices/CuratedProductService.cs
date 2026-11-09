using TryFit.Application.DTOs;
using TryFit.Application.Interfaces;
using TryFit.Domain.Enums;

namespace TryFit.Infrastructure.ExternalServices;

public class CuratedProductService : ICuratedProductService
{
    private readonly List<TrendyolProductDto> _products;

    public CuratedProductService()
    {
        _products = new List<TrendyolProductDto>
        {
            // === 3 HOODIES / SWEATSHIRTS ===
            new()
            {
                Id = "ty-hoodie-01",
                Title = "Oversize Kanguru Cepli Siyah Kapüşonlu Sweatshirt",
                Brand = "Trendyol Collection",
                Price = 599.90m,
                Currency = "TL",
                Category = ClothingCategory.Top,
                SubCategory = "hoodie",
                DetectedColor = "Siyah",
                HexColor = "#161616",
                FabricElasticity = "Şardonlu Kalın Pamuk (Az Esnek)",
                LengthType = "hip",
                ShoulderToHemCm = 70.0,
                ImageUrl = "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
                ProductUrl = "https://www.trendyol.com/trendyol-collection/siyah-kanguru-cepli-oversize-hoodie-p-101",
                MultiAngles = new ProductMultiAnglesDto
                {
                    Front = "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
                    Angle45 = "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80",
                    Side = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
                    Back = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"
                },
                SizeChart = new List<ProductSizeSpecDto>
                {
                    new() { Size = "XS", ChestCm = 104, WaistCm = 98, HipsCm = 96, LengthCm = 67 },
                    new() { Size = "S", ChestCm = 108, WaistCm = 102, HipsCm = 100, LengthCm = 69 },
                    new() { Size = "M", ChestCm = 114, WaistCm = 108, HipsCm = 106, LengthCm = 71 },
                    new() { Size = "L", ChestCm = 120, WaistCm = 114, HipsCm = 112, LengthCm = 73 },
                    new() { Size = "XL", ChestCm = 126, WaistCm = 120, HipsCm = 118, LengthCm = 75 }
                }
            },
            new()
            {
                Id = "ty-hoodie-02",
                Title = "Fermuarlı İçi Polarlı Gri Melanj Rahat Kesim Sweatshirt",
                Brand = "Trendyolmilla",
                Price = 649.90m,
                Currency = "TL",
                Category = ClothingCategory.Top,
                SubCategory = "hoodie",
                DetectedColor = "Gri",
                HexColor = "#8a8f96",
                FabricElasticity = "Orta Esnek Pamuk Karışımı",
                LengthType = "hip",
                ShoulderToHemCm = 68.0,
                ImageUrl = "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
                ProductUrl = "https://www.trendyol.com/trendyolmilla/gri-melanj-fermuarli-hoodie-p-102",
                MultiAngles = new ProductMultiAnglesDto
                {
                    Front = "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
                    Angle45 = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=80",
                    Side = "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&auto=format&fit=crop&q=80",
                    Back = "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80"
                },
                SizeChart = new List<ProductSizeSpecDto>
                {
                    new() { Size = "XS", ChestCm = 98, WaistCm = 92, HipsCm = 94, LengthCm = 65 },
                    new() { Size = "S", ChestCm = 102, WaistCm = 96, HipsCm = 98, LengthCm = 67 },
                    new() { Size = "M", ChestCm = 108, WaistCm = 102, HipsCm = 104, LengthCm = 69 },
                    new() { Size = "L", ChestCm = 114, WaistCm = 108, HipsCm = 110, LengthCm = 71 },
                    new() { Size = "XL", ChestCm = 120, WaistCm = 114, HipsCm = 116, LengthCm = 73 }
                }
            },
            new()
            {
                Id = "ty-hoodie-03",
                Title = "Polo Yaka Nakışlı Ekru Triko Sweatshirt",
                Brand = "Dilvin",
                Price = 529.90m,
                Currency = "TL",
                Category = ClothingCategory.Top,
                SubCategory = "tshirt",
                DetectedColor = "Ekru",
                HexColor = "#f5f2eb",
                FabricElasticity = "Yüksek Esnek Triko Örgü",
                LengthType = "waist",
                ShoulderToHemCm = 56.0,
                ImageUrl = "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
                ProductUrl = "https://www.trendyol.com/dilvin/polo-yaka-ekru-triko-p-103",
                MultiAngles = new ProductMultiAnglesDto
                {
                    Front = "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
                    Angle45 = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
                    Side = "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80",
                    Back = "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80"
                },
                SizeChart = new List<ProductSizeSpecDto>
                {
                    new() { Size = "XS", ChestCm = 84, WaistCm = 68, HipsCm = 88, LengthCm = 54 },
                    new() { Size = "S", ChestCm = 88, WaistCm = 72, HipsCm = 92, LengthCm = 55 },
                    new() { Size = "M", ChestCm = 94, WaistCm = 78, HipsCm = 98, LengthCm = 56 },
                    new() { Size = "L", ChestCm = 100, WaistCm = 84, HipsCm = 104, LengthCm = 58 },
                    new() { Size = "XL", ChestCm = 106, WaistCm = 90, HipsCm = 110, LengthCm = 60 }
                }
            },

            // === 3 DRESSES ===
            new()
            {
                Id = "ty-dress-01",
                Title = "V Yaka Yırtmaçlı Kırmızı Saten Kokteyl Elbisesi",
                Brand = "Trendyol Curve",
                Price = 899.90m,
                Currency = "TL",
                Category = ClothingCategory.Dress,
                SubCategory = "dress",
                DetectedColor = "Kırmızı",
                HexColor = "#a31824",
                FabricElasticity = "Hafif Likralı İpeksi Saten",
                LengthType = "maxi",
                ShoulderToHemCm = 125.0,
                ImageUrl = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
                ProductUrl = "https://www.trendyol.com/trendyol-curve/kirmizi-saten-elbise-p-201",
                MultiAngles = new ProductMultiAnglesDto
                {
                    Front = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
                    Angle45 = "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
                    Side = "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80",
                    Back = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80"
                },
                SizeChart = new List<ProductSizeSpecDto>
                {
                    new() { Size = "XS (34)", ChestCm = 82, WaistCm = 64, HipsCm = 90, LengthCm = 123 },
                    new() { Size = "S (36)", ChestCm = 86, WaistCm = 68, HipsCm = 94, LengthCm = 124 },
                    new() { Size = "M (38)", ChestCm = 92, WaistCm = 74, HipsCm = 100, LengthCm = 125 },
                    new() { Size = "L (40)", ChestCm = 98, WaistCm = 80, HipsCm = 106, LengthCm = 126 },
                    new() { Size = "XL (42)", ChestCm = 104, WaistCm = 86, HipsCm = 112, LengthCm = 127 }
                }
            },
            new()
            {
                Id = "ty-dress-02",
                Title = "Kare Yaka Mini Çiçekli Şifon Yazlık Elbise",
                Brand = "Trendyolmilla",
                Price = 479.90m,
                Currency = "TL",
                Category = ClothingCategory.Dress,
                SubCategory = "dress",
                DetectedColor = "Çok Renkli",
                HexColor = "#e6739f",
                FabricElasticity = "Esnemez Dokuma Şifon (Astarlı)",
                LengthType = "knee",
                ShoulderToHemCm = 84.0,
                ImageUrl = "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
                ProductUrl = "https://www.trendyol.com/trendyolmilla/cicekli-sifon-mini-elbise-p-202",
                MultiAngles = new ProductMultiAnglesDto
                {
                    Front = "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
                    Angle45 = "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80",
                    Side = "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80",
                    Back = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80"
                },
                SizeChart = new List<ProductSizeSpecDto>
                {
                    new() { Size = "XS (34)", ChestCm = 80, WaistCm = 62, HipsCm = 88, LengthCm = 82 },
                    new() { Size = "S (36)", ChestCm = 84, WaistCm = 66, HipsCm = 92, LengthCm = 84 },
                    new() { Size = "M (38)", ChestCm = 90, WaistCm = 72, HipsCm = 98, LengthCm = 86 },
                    new() { Size = "L (40)", ChestCm = 96, WaistCm = 78, HipsCm = 104, LengthCm = 88 },
                    new() { Size = "XL (42)", ChestCm = 102, WaistCm = 84, HipsCm = 110, LengthCm = 90 }
                }
            },
            new()
            {
                Id = "ty-dress-03",
                Title = "Yırtmaçlı Boğazlı Siyah Bodycon Triko Midi Elbise",
                Brand = "Mango",
                Price = 1199.90m,
                Currency = "TL",
                Category = ClothingCategory.Dress,
                SubCategory = "dress",
                DetectedColor = "Siyah",
                HexColor = "#1a1a1a",
                FabricElasticity = "Yüksek Likralı Fitilli Triko",
                LengthType = "midi",
                ShoulderToHemCm = 112.0,
                ImageUrl = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80",
                ProductUrl = "https://www.trendyol.com/mango/siyah-bodycon-midi-elbise-p-203",
                MultiAngles = new ProductMultiAnglesDto
                {
                    Front = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80",
                    Angle45 = "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
                    Side = "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80",
                    Back = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80"
                },
                SizeChart = new List<ProductSizeSpecDto>
                {
                    new() { Size = "XS (34)", ChestCm = 78, WaistCm = 60, HipsCm = 86, LengthCm = 110 },
                    new() { Size = "S (36)", ChestCm = 82, WaistCm = 64, HipsCm = 90, LengthCm = 112 },
                    new() { Size = "M (38)", ChestCm = 88, WaistCm = 70, HipsCm = 96, LengthCm = 113 },
                    new() { Size = "L (40)", ChestCm = 94, WaistCm = 76, HipsCm = 102, LengthCm = 114 },
                    new() { Size = "XL (42)", ChestCm = 100, WaistCm = 82, HipsCm = 108, LengthCm = 115 }
                }
            },

            // === 2 JACKETS / COATS ===
            new()
            {
                Id = "ty-coat-01",
                Title = "Kuşaklı Kruvaze Su Geçirmez Bej Klasik Trençkot",
                Brand = "Trendyol Curve",
                Price = 1499.90m,
                Currency = "TL",
                Category = ClothingCategory.Outerwear,
                SubCategory = "coat",
                DetectedColor = "Bej",
                HexColor = "#bca284",
                FabricElasticity = "Esnemez Dokuma Gabardin Kumaş",
                LengthType = "midi",
                ShoulderToHemCm = 118.0,
                ImageUrl = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
                ProductUrl = "https://www.trendyol.com/trendyol-curve/bej-kruvaze-trenckot-p-301",
                MultiAngles = new ProductMultiAnglesDto
                {
                    Front = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
                    Angle45 = "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80",
                    Side = "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80",
                    Back = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"
                },
                SizeChart = new List<ProductSizeSpecDto>
                {
                    new() { Size = "XS", ChestCm = 96, WaistCm = 88, HipsCm = 100, LengthCm = 116 },
                    new() { Size = "S", ChestCm = 100, WaistCm = 92, HipsCm = 104, LengthCm = 118 },
                    new() { Size = "M", ChestCm = 106, WaistCm = 98, HipsCm = 110, LengthCm = 119 },
                    new() { Size = "L", ChestCm = 112, WaistCm = 104, HipsCm = 116, LengthCm = 120 },
                    new() { Size = "XL", ChestCm = 118, WaistCm = 110, HipsCm = 122, LengthCm = 121 }
                }
            },
            new()
            {
                Id = "ty-coat-02",
                Title = "Fermuarlı Metal Aksesuarlı Siyah Biker Deri Ceket",
                Brand = "Trendyolmilla",
                Price = 1299.00m,
                Currency = "TL",
                Category = ClothingCategory.Outerwear,
                SubCategory = "jacket",
                DetectedColor = "Siyah",
                HexColor = "#111111",
                FabricElasticity = "Esnemez Suni Deri / Kalın Astar",
                LengthType = "waist",
                ShoulderToHemCm = 52.0,
                ImageUrl = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
                ProductUrl = "https://www.trendyol.com/trendyolmilla/siyah-biker-deri-ceket-p-302",
                MultiAngles = new ProductMultiAnglesDto
                {
                    Front = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
                    Angle45 = "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&auto=format&fit=crop&q=80",
                    Side = "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&auto=format&fit=crop&q=80",
                    Back = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"
                },
                SizeChart = new List<ProductSizeSpecDto>
                {
                    new() { Size = "XS", ChestCm = 88, WaistCm = 76, HipsCm = 86, LengthCm = 50 },
                    new() { Size = "S", ChestCm = 92, WaistCm = 80, HipsCm = 90, LengthCm = 52 },
                    new() { Size = "M", ChestCm = 98, WaistCm = 86, HipsCm = 96, LengthCm = 53 },
                    new() { Size = "L", ChestCm = 104, WaistCm = 92, HipsCm = 102, LengthCm = 54 },
                    new() { Size = "XL", ChestCm = 110, WaistCm = 98, HipsCm = 108, LengthCm = 55 }
                }
            },

            // === 2 PANTS / JEANS ===
            new()
            {
                Id = "ty-pants-01",
                Title = "Yüksek Bel Vintage Yıkamalı Mavi Mom Jean Pantolon",
                Brand = "Trendyolmilla",
                Price = 699.90m,
                Currency = "TL",
                Category = ClothingCategory.Bottom,
                SubCategory = "jeans",
                DetectedColor = "Açık Mavi",
                HexColor = "#395b82",
                FabricElasticity = "%100 Pamuk Tok Denim (Esnemez)",
                LengthType = "ankle",
                ShoulderToHemCm = 98.0,
                ImageUrl = "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80",
                ProductUrl = "https://www.trendyol.com/trendyolmilla/vintage-mavi-mom-jean-p-401",
                MultiAngles = new ProductMultiAnglesDto
                {
                    Front = "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80",
                    Angle45 = "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
                    Side = "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80",
                    Back = "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80"
                },
                SizeChart = new List<ProductSizeSpecDto>
                {
                    new() { Size = "26 (XS)", ChestCm = 0, WaistCm = 64, HipsCm = 90, LengthCm = 96 },
                    new() { Size = "28 (S)", ChestCm = 0, WaistCm = 68, HipsCm = 94, LengthCm = 98 },
                    new() { Size = "30 (M)", ChestCm = 0, WaistCm = 74, HipsCm = 100, LengthCm = 99 },
                    new() { Size = "32 (L)", ChestCm = 0, WaistCm = 80, HipsCm = 106, LengthCm = 100 },
                    new() { Size = "34 (XL)", ChestCm = 0, WaistCm = 86, HipsCm = 112, LengthCm = 101 }
                }
            },
            new()
            {
                Id = "ty-pants-02",
                Title = "Yüksek Bel Dökümlü Geniş Paça Siyah Palazzo Pantolon",
                Brand = "Trendyol Curve",
                Price = 749.90m,
                Currency = "TL",
                Category = ClothingCategory.Bottom,
                SubCategory = "jeans",
                DetectedColor = "Siyah",
                HexColor = "#1e1e1e",
                FabricElasticity = "Akıcı Dökümlü Kumaş (Hafif Esnek)",
                LengthType = "maxi",
                ShoulderToHemCm = 106.0,
                ImageUrl = "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
                ProductUrl = "https://www.trendyol.com/trendyol-curve/siyah-palazzo-pantolon-p-402",
                MultiAngles = new ProductMultiAnglesDto
                {
                    Front = "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
                    Angle45 = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
                    Side = "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&auto=format&fit=crop&q=80",
                    Back = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80"
                },
                SizeChart = new List<ProductSizeSpecDto>
                {
                    new() { Size = "XS (34)", ChestCm = 0, WaistCm = 62, HipsCm = 94, LengthCm = 104 },
                    new() { Size = "S (36)", ChestCm = 0, WaistCm = 66, HipsCm = 98, LengthCm = 106 },
                    new() { Size = "M (38)", ChestCm = 0, WaistCm = 72, HipsCm = 104, LengthCm = 107 },
                    new() { Size = "L (40)", ChestCm = 0, WaistCm = 78, HipsCm = 110, LengthCm = 108 },
                    new() { Size = "XL (42)", ChestCm = 0, WaistCm = 84, HipsCm = 116, LengthCm = 109 }
                }
            }
        };
    }

    public IReadOnlyList<TrendyolProductDto> GetCuratedProducts() => _products.AsReadOnly();

    public TrendyolProductDto? GetProductById(string id) =>
        _products.FirstOrDefault(p => string.Equals(p.Id, id, StringComparison.OrdinalIgnoreCase));
}
