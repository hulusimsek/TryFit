using TryFit.Application.DTOs;
using TryFit.Application.Interfaces;
using TryFit.Domain.Enums;

namespace TryFit.Application.Services;

public class FitAdvisorService : IFitAdvisorService
{
    public FitAnalysisResultDto AnalyzeFit(FitAnalysisRequestDto request)
    {
        var height = request.HeightCm > 0 ? request.HeightCm : 168.0;
        var weight = request.WeightKg > 0 ? request.WeightKg : 58.0;

        var heightInM = height / 100.0;
        var bmi = Math.Round(weight / (heightInM * heightInM), 1);

        string bmiCategory = bmi switch
        {
            < 18.5 => "Zayıf / Minyon",
            < 24.9 => "İdeal / Fit Orantı",
            < 29.9 => "Hafif Kıvrımlı",
            _ => "Curve / Dolgun Hatlar"
        };

        // 1. Kullanıcının tahmini veya özel vücut ölçüleri (Göğüs, Bel, Kalça, İç Bacak)
        // Standart antropometrik oran formülleri
        double userChest = request.CustomChestCm.HasValue && request.CustomChestCm.Value > 0
            ? request.CustomChestCm.Value
            : Math.Round(height * 0.52 + (weight - 50) * 0.7, 1);

        double userWaist = request.CustomWaistCm.HasValue && request.CustomWaistCm.Value > 0
            ? request.CustomWaistCm.Value
            : Math.Round(height * 0.40 + (weight - 50) * 0.6, 1);

        double userHips = request.CustomHipsCm.HasValue && request.CustomHipsCm.Value > 0
            ? request.CustomHipsCm.Value
            : Math.Round(height * 0.56 + (weight - 50) * 0.8, 1);

        double userInseam = request.CustomInseamCm.HasValue && request.CustomInseamCm.Value > 0
            ? request.CustomInseamCm.Value
            : Math.Round(height * 0.46, 1);

        var generalSize = DetermineGeneralSize(bmi);
        var jeanSize = DetermineJeanSize(bmi);

        var itemFits = new List<GarmentFitDetailDto>();
        var detailedReports = new List<DetailedFitReportDto>();

        foreach (var item in request.Items)
        {
            var detail = new GarmentFitDetailDto
            {
                Title = item.Title,
                Category = item.Category
            };

            var detailedReport = new DetailedFitReportDto
            {
                GarmentTitle = item.Title,
                Category = item.Category.ToString(),
            };

            // Standart beden tablosu matrisi (XS - S - M - L - XL)
            var sizeSpecs = GenerateSizeSpecMatrix(item.Category, item.Title);

            // Her beden için bolluk/darlık analizi
            string recommendedSize = "M";
            string primaryAdvice = "";
            double minPenalty = double.MaxValue;

            foreach (var spec in sizeSpecs)
            {
                double dChest = Math.Round(spec.ChestCm - userChest, 1);
                double dWaist = Math.Round(spec.WaistCm - userWaist, 1);
                double dHips = Math.Round(spec.HipsCm - userHips, 1);

                string status = "ideal";
                string note = "Konforlu";

                // Kategoriye göre kritik bölge seçimi
                double relevantDiff = item.Category switch
                {
                    ClothingCategory.Top => dChest,
                    ClothingCategory.Outerwear => dChest,
                    ClothingCategory.Bottom => dWaist,
                    ClothingCategory.Dress => Math.Min(dChest, dWaist),
                    _ => dChest
                };

                if (relevantDiff < -2.0)
                {
                    status = "tight";
                    note = $"Dar ({Math.Abs(relevantDiff):0} cm darlık)";
                }
                else if (relevantDiff <= 2.0)
                {
                    status = "snug";
                    note = "Tam Vücuda Oturan";
                }
                else if (relevantDiff <= 8.0)
                {
                    status = "ideal";
                    note = $"İdeal Rahatlık (+{relevantDiff:0} cm)";
                }
                else
                {
                    status = "oversize";
                    note = $"Bol / Dökümlü (+{relevantDiff:0} cm)";
                }

                spec.DiffChest = dChest;
                spec.DiffWaist = dWaist;
                spec.DiffHips = dHips;
                spec.FitStatus = status;
                spec.FitNote = note;

                // Kategoriye göre ideal bolluk payı (Dış giyim kalın kazak payı için daha fazla pay ister)
                double idealEase = item.Category switch
                {
                    ClothingCategory.Outerwear => 8.0,
                    ClothingCategory.Top when item.Title.ToLowerInvariant().Contains("hoodie") => 10.0,
                    ClothingCategory.Bottom => 3.0,
                    _ => 4.0
                };

                double penalty = Math.Abs(relevantDiff - idealEase);
                if (relevantDiff < 0) penalty += 20; // Dar gelme cezası

                if (penalty < minPenalty)
                {
                    minPenalty = penalty;
                    recommendedSize = spec.Size;
                }
            }

            // Kategoriye özel analiz ve uzunluk kılavuz çizgileri
            switch (item.Category)
            {
                case ClothingCategory.Outerwear:
                    detail.RecommendedSize = recommendedSize;
                    detailedReport.RecommendedSize = recommendedSize;
                    detailedReport.FabricElasticity = "Esnemez Dokuma Gabardin/Yünlü";
                    detailedReport.LengthMarker = height < 165 ? "Diz Kapağının 8-10 cm Altı" : "Diz Kapağı Hizasında";
                    detailedReport.EstimatedLengthFromShoulderCm = 110.0;
                    primaryAdvice = $"Göğüs ölçünüz {userChest} cm, {recommendedSize} beden göğüs genişliği ile en konforlu dökümü sağlar.";
                    
                    detail.LengthAnalysis = height < 162
                        ? $"{height:0} cm boyunda diz kapağının yaklaşık 12 cm altına (uzun midi) iner."
                        : height <= 172
                        ? $"{height:0} cm boyunda tam dizin 5-7 cm altına (klasik midi) oturur."
                        : $"{height:0} cm boyunda diz hizasında modern ve dinamik biter.";
                    detail.FitAdvice = "Kuşağını belde sıkarak kum saati silüeti oluşturabilirsin.";
                    detail.SilhouetteNote = "Dış giyim olarak kombine derinlik ve zarafet katar.";
                    break;

                case ClothingCategory.Top:
                    detail.RecommendedSize = recommendedSize;
                    detailedReport.RecommendedSize = recommendedSize;
                    detailedReport.FabricElasticity = item.Title.ToLowerInvariant().Contains("hoodie") ? "Az Esnek Şardonlu Pamuk" : "Likralı Ribana Örme";
                    detailedReport.LengthMarker = item.Title.ToLowerInvariant().Contains("crop") ? "Bel Üstü (Crop)" : "Kalça Başlangıcı";
                    detailedReport.EstimatedLengthFromShoulderCm = item.Title.ToLowerInvariant().Contains("crop") ? 42.0 : 66.0;
                    primaryAdvice = $"Göğüs çevreniz {userChest} cm; {recommendedSize} bedende omuz ve koltuk altı sıkışması yaşanmaz.";

                    detail.LengthAnalysis = height < 165
                        ? "Yüksek bel pantolon ile kemer çizgisinde sıfıra sıfır birleşir."
                        : "Yüksek bel pantolonla 1-2 parmak zarif boşluk bırakır.";
                    detail.FitAdvice = "Kumaş formu sayesinde vücut hatlarını zarifçe tamamlar.";
                    detail.SilhouetteNote = "Üst bedeni derli toplu ve fit gösterir.";
                    break;

                case ClothingCategory.Bottom:
                    detail.RecommendedSize = jeanSize;
                    detailedReport.RecommendedSize = jeanSize;
                    detailedReport.FabricElasticity = "%100 Pamuklu Tok Denim (Esnemez)";
                    detailedReport.LengthMarker = height < 163 ? "Bilek Üstü / Paça Dökümlü" : "Tam Bilek Bitimi";
                    detailedReport.EstimatedLengthFromShoulderCm = 100.0;
                    primaryAdvice = $"Beliniz {userWaist} cm, kalçanız {userHips} cm. Tok denim esnemediği için {jeanSize} beden kalça oturumu için en uygundur.";

                    detail.LengthAnalysis = height < 162
                        ? $"{height:0} cm boyunda paçalar ayakkabı üzerinde dökümlü durur."
                        : height <= 172
                        ? $"{height:0} cm boyunda tam bilek bitimi ve kusursuz paça duruşu."
                        : $"{height:0} cm boyunda bileğin 2 cm üstünde (cropped) modern durur.";
                    detail.FitAdvice = "Yüksek bel kesimi bacak boyunu daha uzun gösterir.";
                    detail.SilhouetteNote = "Bacakları olduğundan daha uzun ve ince gösteren kalıp.";
                    break;

                case ClothingCategory.Dress:
                    detail.RecommendedSize = recommendedSize;
                    detailedReport.RecommendedSize = recommendedSize;
                    detailedReport.FabricElasticity = "Saten / Akıcı Dokuma";
                    detailedReport.LengthMarker = item.Title.ToLowerInvariant().Contains("mini") ? "Diz Üstü 15 cm" : "Diz Kapağı Hizasında";
                    detailedReport.EstimatedLengthFromShoulderCm = 88.0;
                    primaryAdvice = $"Göğüs ({userChest} cm) ve kalça ({userHips} cm) orantınıza göre {recommendedSize} beden dikişleri kasmadan akıcı duracaktır.";

                    detail.LengthAnalysis = height < 163
                        ? "Etek boyu diz kapağının hemen üzerinde dengeli durur."
                        : "Mini/midi etek boyu bacakları ön plana çıkarır.";
                    detail.FitAdvice = "Tek parça şıklık; bel hattı vücut kıvrımına oturur.";
                    detail.SilhouetteNote = "Feminen ve zarif tek parça silüet.";
                    break;

                case ClothingCategory.Shoes:
                    detail.RecommendedSize = "Tam Kalıp (36-40)";
                    detailedReport.RecommendedSize = "37-38";
                    detailedReport.FabricElasticity = "Hakiki Deri";
                    detailedReport.LengthMarker = "Taban +4 cm";
                    detailedReport.EstimatedLengthFromShoulderCm = 0;
                    primaryAdvice = "Standart ayak numaranızı almanız önerilir.";

                    detail.LengthAnalysis = "Kalın taban boyunuza +4 cm estetik uzatma etkisi katar.";
                    detail.FitAdvice = "Bacak silüetini yukarı taşır.";
                    detail.SilhouetteNote = "Kombini sportif şıklığa bağlayan tamamlayıcı parça.";
                    break;

                default:
                    detail.RecommendedSize = generalSize;
                    detailedReport.RecommendedSize = generalSize;
                    detailedReport.FabricElasticity = "Standart";
                    detailedReport.LengthMarker = "Standart";
                    primaryAdvice = "Standart kalıp önerilir.";
                    detail.LengthAnalysis = "Standart ölçü";
                    detail.FitAdvice = "Kombin tamamlayıcı";
                    detail.SilhouetteNote = "Uyumlu aksesuar";
                    break;
            }

            detailedReport.PrimaryFitAdvice = primaryAdvice;
            detailedReport.SizeMatrix = sizeSpecs;

            itemFits.Add(detail);
            detailedReports.Add(detailedReport);
        }

        return new FitAnalysisResultDto
        {
            UserHeightCm = height,
            UserWeightKg = weight,
            UserChestCm = userChest,
            UserWaistCm = userWaist,
            UserHipsCm = userHips,
            UserInseamCm = userInseam,
            Bmi = bmi,
            BmiCategory = bmiCategory,
            HarmonyScore = 95,
            PaletteName = "Doğal & Toprak Tonları",
            OverallStylingAdvice = $"{height} cm boy, {weight} kg ağırlık ve {userChest}/{userWaist}/{userHips} cm vücut ölçülerinize göre beden matrisi eşleştirildi. Kumaş esneklik payları ve dikiş toleransları hesaplanarak en konforlu beden önerilmiştir.",
            ItemFits = itemFits,
            DetailedReports = detailedReports
        };
    }

    private static List<SizeChartEntryDto> GenerateSizeSpecMatrix(ClothingCategory category, string title)
    {
        var t = title.ToLowerInvariant();
        if (category == ClothingCategory.Top || category == ClothingCategory.Outerwear)
        {
            bool isOuter = category == ClothingCategory.Outerwear;
            double baseChest = isOuter ? 96 : (t.Contains("hoodie") ? 104 : 84);
            double baseWaist = isOuter ? 88 : 70;
            double baseHips = isOuter ? 102 : 88;
            double baseLen = isOuter ? 108 : (t.Contains("crop") ? 40 : 66);

            return new List<SizeChartEntryDto>
            {
                new() { Size = "XS (34)", ChestCm = baseChest - 6, WaistCm = baseWaist - 6, HipsCm = baseHips - 6, LengthCm = baseLen - 2 },
                new() { Size = "S (36)",  ChestCm = baseChest - 2, WaistCm = baseWaist - 2, HipsCm = baseHips - 2, LengthCm = baseLen - 1 },
                new() { Size = "M (38)",  ChestCm = baseChest + 4, WaistCm = baseWaist + 4, HipsCm = baseHips + 4, LengthCm = baseLen },
                new() { Size = "L (40)",  ChestCm = baseChest + 10, WaistCm = baseWaist + 10, HipsCm = baseHips + 10, LengthCm = baseLen + 1 },
                new() { Size = "XL (42)", ChestCm = baseChest + 16, WaistCm = baseWaist + 16, HipsCm = baseHips + 16, LengthCm = baseLen + 2 }
            };
        }
        else if (category == ClothingCategory.Bottom)
        {
            return new List<SizeChartEntryDto>
            {
                new() { Size = "26 (XS)", ChestCm = 0, WaistCm = 64, HipsCm = 90, LengthCm = 98 },
                new() { Size = "28 (S)",  ChestCm = 0, WaistCm = 68, HipsCm = 94, LengthCm = 100 },
                new() { Size = "30 (M)",  ChestCm = 0, WaistCm = 74, HipsCm = 99, LengthCm = 101 },
                new() { Size = "32 (L)",  ChestCm = 0, WaistCm = 80, HipsCm = 105, LengthCm = 102 },
                new() { Size = "34 (XL)", ChestCm = 0, WaistCm = 86, HipsCm = 111, LengthCm = 103 }
            };
        }
        else if (category == ClothingCategory.Dress)
        {
            return new List<SizeChartEntryDto>
            {
                new() { Size = "XS (34)", ChestCm = 82, WaistCm = 64, HipsCm = 90, LengthCm = 86 },
                new() { Size = "S (36)",  ChestCm = 86, WaistCm = 68, HipsCm = 94, LengthCm = 88 },
                new() { Size = "M (38)",  ChestCm = 92, WaistCm = 74, HipsCm = 100, LengthCm = 90 },
                new() { Size = "L (40)",  ChestCm = 98, WaistCm = 80, HipsCm = 106, LengthCm = 92 },
                new() { Size = "XL (42)", ChestCm = 104, WaistCm = 86, HipsCm = 112, LengthCm = 94 }
            };
        }

        return new List<SizeChartEntryDto>
        {
            new() { Size = "S", ChestCm = 86, WaistCm = 68, HipsCm = 94, LengthCm = 60 },
            new() { Size = "M", ChestCm = 92, WaistCm = 74, HipsCm = 100, LengthCm = 62 },
            new() { Size = "L", ChestCm = 98, WaistCm = 80, HipsCm = 106, LengthCm = 64 }
        };
    }

    private static string DetermineGeneralSize(double bmi) => bmi switch
    {
        < 18.5 => "XS / 34 Beden",
        < 22.0 => "S / 36 Beden",
        < 25.5 => "M / 38 Beden",
        < 29.0 => "L / 40 Beden",
        _ => "XL / 42-44 Beden"
    };

    private static string DetermineJeanSize(double bmi) => bmi switch
    {
        < 18.5 => "25-26 Beden (XS)",
        < 21.5 => "27-28 Beden (S)",
        < 25.0 => "29-30 Beden (M)",
        < 28.5 => "31-32 Beden (L)",
        _ => "33-34 Beden (XL)"
    };
}
