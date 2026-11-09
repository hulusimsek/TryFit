using Microsoft.AspNetCore.Mvc;
using TryFit.Application.DTOs;
using TryFit.Application.Interfaces;

namespace TryFit.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OutfitsController : ControllerBase
{
    private readonly IOutfitService _outfitService;

    public OutfitsController(IOutfitService outfitService)
    {
        _outfitService = outfitService;
    }

    [HttpGet]
    public async Task<ActionResult<List<OutfitDto>>> GetAll(CancellationToken cancellationToken)
    {
        var outfits = await _outfitService.GetAllOutfitsAsync(cancellationToken);
        return Ok(outfits);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<OutfitDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var outfit = await _outfitService.GetOutfitByIdAsync(id, cancellationToken);
        if (outfit == null) return NotFound("Kombin bulunamadı.");
        return Ok(outfit);
    }

    [HttpPost]
    public async Task<ActionResult<OutfitDto>> Create([FromBody] CreateOutfitDto dto, CancellationToken cancellationToken)
    {
        var created = await _outfitService.CreateOutfitAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _outfitService.DeleteOutfitAsync(id, cancellationToken);
        if (!result) return NotFound("Silinecek kombin bulunamadı.");
        return NoContent();
    }
}
