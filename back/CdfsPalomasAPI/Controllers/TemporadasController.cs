using CdfsPalomasAPI.Data;
using CdfsPalomasAPI.DTOs;
using CdfsPalomasAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CdfsPalomasAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TemporadasController : ControllerBase
{
    private readonly AppDbContext _context;

    public TemporadasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTemporadas()
    {
        var temporadas = await _context.Temporadas
            .Select(t => new TemporadaDto { Id = t.Id, Nombre = t.Nombre })
            .ToListAsync();
        return Ok(temporadas);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Crear([FromBody] TemporadaDto dto)
    {
        var temporada = new Temporada { Nombre = dto.Nombre };
        _context.Temporadas.Add(temporada);
        await _context.SaveChangesAsync();
        return Ok(new TemporadaDto { Id = temporada.Id, Nombre = temporada.Nombre });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Editar(int id, [FromBody] TemporadaDto dto)
    {
        var temporada = await _context.Temporadas.FindAsync(id);
        if (temporada == null) return NotFound();
        temporada.Nombre = dto.Nombre;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var temporada = await _context.Temporadas.FindAsync(id);
        if (temporada == null) return NotFound();
        _context.Temporadas.Remove(temporada);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}