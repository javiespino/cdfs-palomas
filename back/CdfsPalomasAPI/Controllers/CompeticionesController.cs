using CdfsPalomasAPI.Data;
using CdfsPalomasAPI.DTOs;
using CdfsPalomasAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CdfsPalomasAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompeticionesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CompeticionesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCompeticiones()
    {
        var competiciones = await _context.Competiciones
            .Include(c => c.Temporada)
            .Select(c => new CompeticionDto
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Categoria = c.Categoria,
                IdTemporada = c.IdTemporada,
                NombreTemporada = c.Temporada.Nombre
            })
            .ToListAsync();
        return Ok(competiciones);
    }

    [HttpGet("temporada/{idTemporada}")]
    public async Task<IActionResult> GetPorTemporada(int idTemporada)
    {
        var competiciones = await _context.Competiciones
            .Where(c => c.IdTemporada == idTemporada)
            .Include(c => c.Temporada)
            .Select(c => new CompeticionDto
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Categoria = c.Categoria,
                IdTemporada = c.IdTemporada,
                NombreTemporada = c.Temporada.Nombre
            })
            .ToListAsync();
        return Ok(competiciones);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Crear([FromBody] CrearCompeticionDto dto)
    {
        var competicion = new Competicion
        {
            Nombre = dto.Nombre,
            Categoria = dto.Categoria,
            IdTemporada = dto.IdTemporada
        };
        _context.Competiciones.Add(competicion);
        await _context.SaveChangesAsync();

        return Ok(new CompeticionDto
        {
            Id = competicion.Id,
            Nombre = competicion.Nombre,
            Categoria = competicion.Categoria,
            IdTemporada = competicion.IdTemporada
        });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Editar(int id, [FromBody] CrearCompeticionDto dto)
    {
        var competicion = await _context.Competiciones.FindAsync(id);
        if (competicion == null) return NotFound();

        competicion.Nombre = dto.Nombre;
        competicion.Categoria = dto.Categoria;
        competicion.IdTemporada = dto.IdTemporada;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var competicion = await _context.Competiciones.FindAsync(id);
        if (competicion == null) return NotFound();

        _context.Competiciones.Remove(competicion);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}