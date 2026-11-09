using TryFit.Domain.Common;
using TryFit.Domain.Enums;

namespace TryFit.Domain.Entities;

public class UserProfile : BaseEntity
{
    public string Name { get; set; } = "Misafir Kullanıcı";
    public double HeightCm { get; set; } = 168.0; // cm cinsinden boy
    public double WeightKg { get; set; } = 60.0;  // kg cinsinden kilo
    public BodyType BodyType { get; set; } = BodyType.Hourglass;
    
    // Opsiyonel detaylı ölçüler (cm)
    public double? ChestCm { get; set; }
    public double? WaistCm { get; set; }
    public double? HipsCm { get; set; }

    public double CalculateBmi()
    {
        var heightInMeters = HeightCm / 100.0;
        if (heightInMeters <= 0) return 21.0;
        return WeightKg / (heightInMeters * heightInMeters);
    }
}
