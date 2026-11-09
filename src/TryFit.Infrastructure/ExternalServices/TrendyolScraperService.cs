using System.Globalization;
using System.Net;
using System.Text.Json;
using System.Text.RegularExpressions;
using HtmlAgilityPack;
using TryFit.Application.DTOs;
using TryFit.Application.Interfaces;
using TryFit.Domain.Enums;

namespace TryFit.Infrastructure.ExternalServices;

public class TrendyolScraperService : ITrendyolScraperService
{
    private readonly HttpClient _httpClient;

    public TrendyolScraperService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.DefaultRequestHeaders.Add("User-Agent", 
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");
        _httpClient.DefaultRequestHeaders.Add("Accept-Language", "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7");
    }

    public async Task<TrendyolProductDto> ScrapeProductAsync(string url, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(url))
        {
            throw new ArgumentException("Geçerli bir Trendyol linki giriniz.", nameof(url));
        }

        url = url.Trim();

        try
        {
            var response = await _httpClient.GetAsync(url, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                // Fallback to URL heuristic if Trendyol challenge or rate limit occurs
                return CreateFallbackFromUrl(url);
            }

            var html = await response.Content.ReadAsStringAsync(cancellationToken);
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            // 1. JSON-LD Structured Data Arama
            var jsonLdNodes = doc.DocumentNode.SelectNodes("//script[@type='application/ld+json']");
            if (jsonLdNodes != null)
            {
                foreach (var node in jsonLdNodes)
                {
                    try
                    {
                        using var jsonDoc = JsonDocument.Parse(node.InnerText);
                        var root = jsonDoc.RootElement;
                        
                        if (root.TryGetProperty("@type", out var typeProp) && typeProp.GetString() == "Product")
                        {
                            string title = root.TryGetProperty("name", out var nameProp) ? nameProp.GetString() ?? "" : "";
                            string image = "";
                            if (root.TryGetProperty("image", out var imgProp))
                            {
                                image = imgProp.ValueKind == JsonValueKind.Array 
                                    ? imgProp[0].GetString() ?? "" 
                                    : imgProp.GetString() ?? "";
                            }

                            decimal price = 0;
                            if (root.TryGetProperty("offers", out var offersProp))
                            {
                                if (offersProp.TryGetProperty("price", out var priceProp))
                                {
                                    if (priceProp.ValueKind == JsonValueKind.Number)
                                        price = priceProp.GetDecimal();
                                    else if (decimal.TryParse(priceProp.GetString(), NumberStyles.Any, CultureInfo.InvariantCulture, out var parsedPrice))
                                        price = parsedPrice;
                                }
                            }

                            string brand = "";
                            if (root.TryGetProperty("brand", out var brandProp))
                            {
                                if (brandProp.ValueKind == JsonValueKind.Object && brandProp.TryGetProperty("name", out var brandName))
                                    brand = brandName.GetString() ?? "";
                                else if (brandProp.ValueKind == JsonValueKind.String)
                                    brand = brandProp.GetString() ?? "";
                            }

                            if (!string.IsNullOrEmpty(title) && !string.IsNullOrEmpty(image))
                            {
                                var detectedCat = DetectCategory(title);
                                var subCat = DetectSubCategory(title);
                                var (colName, hex) = DetectColor(title);
                                return new TrendyolProductDto
                                {
                                    Title = WebUtility.HtmlDecode(title),
                                    Brand = brand,
                                    Price = price > 0 ? price : 499.99m,
                                    ImageUrl = image,
                                    ProductUrl = url,
                                    Category = detectedCat,
                                    SubCategory = subCat,
                                    DetectedColor = colName,
                                    HexColor = hex
                                };
                            }
                        }
                    }
                    catch
                    {
                        // Sonraki json-ld'yi veya meta tag'leri dene
                    }
                }
            }

            // 2. OpenGraph Meta Etiketleri Arama (og:title, og:image)
            var ogTitle = doc.DocumentNode.SelectSingleNode("//meta[@property='og:title']")?.GetAttributeValue("content", "");
            var ogImage = doc.DocumentNode.SelectSingleNode("//meta[@property='og:image']")?.GetAttributeValue("content", "");
            var ogDescription = doc.DocumentNode.SelectSingleNode("//meta[@property='og:description']")?.GetAttributeValue("content", "");

            if (!string.IsNullOrEmpty(ogTitle) && !string.IsNullOrEmpty(ogImage))
            {
                decimal price = ExtractPriceFromText(ogDescription ?? "");
                var decodedTitle = WebUtility.HtmlDecode(ogTitle);
                var (colName, hex) = DetectColor(decodedTitle);
                return new TrendyolProductDto
                {
                    Title = decodedTitle,
                    Brand = ExtractBrandFromTitle(ogTitle),
                    Price = price > 0 ? price : 399.99m,
                    ImageUrl = ogImage,
                    ProductUrl = url,
                    Category = DetectCategory(ogTitle),
                    SubCategory = DetectSubCategory(decodedTitle),
                    DetectedColor = colName,
                    HexColor = hex
                };
            }

            return CreateFallbackFromUrl(url);
        }
        catch
        {
            return CreateFallbackFromUrl(url);
        }
    }

    public static string DetectSubCategory(string title)
    {
        var lower = title.ToLowerInvariant();
        if (lower.Contains("hoodie") || lower.Contains("kapüşon") || lower.Contains("kapuson") || lower.Contains("sweatshirt"))
            return "hoodie";
        if (lower.Contains("trençkot") || lower.Contains("trench") || lower.Contains("kaban") || lower.Contains("palto") || lower.Contains("parka"))
            return "coat";
        if (lower.Contains("ceket") || lower.Contains("blazer") || lower.Contains("hırka") || lower.Contains("mont"))
            return "jacket";
        if (lower.Contains("etek") || lower.Contains("skirt"))
            return "skirt";
        if (lower.Contains("pantolon") || lower.Contains("jean") || lower.Contains("kot") || lower.Contains("tayt") || lower.Contains("şort"))
            return "jeans";
        if (lower.Contains("elbise") || lower.Contains("tulum"))
            return "dress";
        if (lower.Contains("ayakkabı") || lower.Contains("bot") || lower.Contains("sneaker") || lower.Contains("topuklu") || lower.Contains("sandalet"))
            return "shoes";
        return "tshirt";
    }

    public static (string ColorName, string Hex) DetectColor(string title)
    {
        var lower = title.ToLowerInvariant();
        if (lower.Contains("siyah") || lower.Contains("black") || lower.Contains("antrasit")) return ("Siyah", "#161616");
        if (lower.Contains("beyaz") || lower.Contains("white") || lower.Contains("ekru") || lower.Contains("krem")) return ("Beyaz", "#f8f8f8");
        if (lower.Contains("bej") || lower.Contains("camel") || lower.Contains("vizon") || lower.Contains("kahverengi") || lower.Contains("kahve")) return ("Bej", "#bfa07e");
        if (lower.Contains("lacivert") || lower.Contains("indigo")) return ("Lacivert", "#1c2b48");
        if (lower.Contains("mavi") || lower.Contains("jean") || lower.Contains("denim")) return ("Mavi", "#2d5282");
        if (lower.Contains("kırmızı") || lower.Contains("bordo") || lower.Contains("vişne")) return ("Kırmızı", "#9b1b24");
        if (lower.Contains("haki") || lower.Contains("yeşil") || lower.Contains("zeytin")) return ("Haki", "#3c583a");
        if (lower.Contains("pembe") || lower.Contains("pudra") || lower.Contains("rose")) return ("Pembe", "#dc9ea9");
        if (lower.Contains("gri") || lower.Contains("melanj") || lower.Contains("füme")) return ("Gri", "#69727d");
        if (lower.Contains("sarı") || lower.Contains("hardal")) return ("Hardal", "#d49a37");
        if (lower.Contains("turuncu") || lower.Contains("kiremit")) return ("Kiremit", "#b84f28");
        if (lower.Contains("mor") || lower.Contains("lila")) return ("Lila", "#7a4e82");
        return ("Standart", "#262626");
    }

    private static ClothingCategory DetectCategory(string title)
    {
        var lower = title.ToLowerInvariant();
        if (lower.Contains("elbise") || lower.Contains("tulum"))
            return ClothingCategory.Dress;
        if (lower.Contains("pantolon") || lower.Contains("jean") || lower.Contains("etek") || lower.Contains("şort") || lower.Contains("tayt"))
            return ClothingCategory.Bottom;
        if (lower.Contains("ceket") || lower.Contains("mont") || lower.Contains("kaban") || lower.Contains("hırka") || lower.Contains("trençkot") || lower.Contains("blazer"))
            return ClothingCategory.Outerwear;
        if (lower.Contains("ayakkabı") || lower.Contains("bot") || lower.Contains("çizme") || lower.Contains("sneaker") || lower.Contains("topuklu") || lower.Contains("sandalet"))
            return ClothingCategory.Shoes;
        if (lower.Contains("çanta") || lower.Contains("kemer") || lower.Contains("şapka") || lower.Contains("kolye"))
            return ClothingCategory.Accessory;

        // Varsayılan üst giyim
        return ClothingCategory.Top;
    }

    private static string ExtractBrandFromTitle(string title)
    {
        var parts = title.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
        return parts.Length > 0 ? parts[0] : "Trendyol";
    }

    private static decimal ExtractPriceFromText(string text)
    {
        var match = Regex.Match(text, @"(\d+[\.,]?\d*)\s*(?:TL|₺)");
        if (match.Success)
        {
            var raw = match.Groups[1].Value.Replace(".", "").Replace(",", ".");
            if (decimal.TryParse(raw, NumberStyles.Any, CultureInfo.InvariantCulture, out var price))
                return price;
        }
        return 0;
    }

    private static TrendyolProductDto CreateFallbackFromUrl(string url)
    {
        // URL'den ürün ismini tahmin etme (örn: .../trendyolmilla/siyah-bluz-p-12345)
        var uri = new Uri(url.StartsWith("http") ? url : "https://" + url);
        var lastSegment = uri.Segments.LastOrDefault()?.Trim('/') ?? "trendyol-urun";
        var readableName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(lastSegment.Replace("-", " "));
        var (colName, hex) = DetectColor(readableName);

        return new TrendyolProductDto
        {
            Title = readableName.Length > 5 ? readableName : "Trendyol Kadın Giyim Ürünü",
            Brand = "Trendyol Koleksiyon",
            Price = 449.90m,
            Currency = "TL",
            ImageUrl = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
            ProductUrl = url,
            Category = DetectCategory(readableName),
            SubCategory = DetectSubCategory(readableName),
            DetectedColor = colName,
            HexColor = hex
        };
    }
}
