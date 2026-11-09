namespace TryFit.Application.DTOs;

public class TryOnRequestDto
{
    public string GarmentImageUrl { get; set; } = string.Empty;
    public string GarmentTitle { get; set; } = "Kıyafet";
    public string Category { get; set; } = "Top"; // Top, Bottom, Dress, Outerwear
    public string ModelBodyType { get; set; } = "standard"; // petite, standard, curve
    public string? UserPhotoBase64 { get; set; } // Kullanıcının kendi fotoğrafı (opsiyonel)
    public string ViewAngle { get; set; } = "front"; // front, angle45, side, back
}

public class TryOnResponseDto
{
    public bool Success { get; set; }
    public string? ResultImageUrl { get; set; }
    public string? ErrorMessage { get; set; }
    public long DurationMs { get; set; }
    public string EngineUsed { get; set; } = "Curated VTON / CatVTON Fallback";
    public string ViewAngle { get; set; } = "front";
}
