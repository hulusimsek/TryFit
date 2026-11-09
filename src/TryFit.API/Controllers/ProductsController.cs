using Microsoft.AspNetCore.Mvc;
using TryFit.Application.DTOs;
using TryFit.Application.Interfaces;

namespace TryFit.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ITrendyolScraperService _scraperService;
    private readonly ICuratedProductService _curatedService;

    public ProductsController(
        ITrendyolScraperService scraperService,
        ICuratedProductService curatedService)
    {
        _scraperService = scraperService;
        _curatedService = curatedService;
    }

    [HttpGet("curated")]
    public ActionResult<IReadOnlyList<TrendyolProductDto>> GetCuratedProducts()
    {
        var products = _curatedService.GetCuratedProducts();
        return Ok(products);
    }

    [HttpGet("curated/{id}")]
    public ActionResult<TrendyolProductDto> GetCuratedProductById(string id)
    {
        var product = _curatedService.GetProductById(id);
        if (product == null)
            return NotFound("Ürün bulunamadı.");
        return Ok(product);
    }

    [HttpPost("scrape")]
    public async Task<ActionResult<TrendyolProductDto>> ScrapeProduct([FromBody] ScrapeRequestDto request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Url))
        {
            return BadRequest("Lütfen geçerli bir ürün URL'i belirtin.");
        }

        var product = await _scraperService.ScrapeProductAsync(request.Url, cancellationToken);
        return Ok(product);
    }
}
