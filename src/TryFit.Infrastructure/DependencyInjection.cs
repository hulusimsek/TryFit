using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TryFit.Application.Interfaces;
using TryFit.Application.Services;
using TryFit.Infrastructure.ExternalServices;
using TryFit.Infrastructure.Persistence;

namespace TryFit.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? "Data Source=tryfit.db";

        services.AddDbContext<TryFitDbContext>(options =>
            options.UseSqlite(connectionString));

        services.AddScoped<ITryFitDbContext>(provider => 
            provider.GetRequiredService<TryFitDbContext>());

        services.AddHttpClient<ITrendyolScraperService, TrendyolScraperService>();

        services.AddScoped<IOutfitService, OutfitService>();
        services.AddScoped<IFitAdvisorService, FitAdvisorService>();
        services.AddSingleton<ICuratedProductService, CuratedProductService>();
        services.AddHttpClient<IVirtualTryOnService, HuggingFaceTryOnService>();

        return services;
    }
}
