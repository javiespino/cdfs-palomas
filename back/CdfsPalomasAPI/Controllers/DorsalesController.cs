using CdfsPalomasAPI.Data;
using CdfsPalomasAPI.DTOs;
using CdfsPalomasAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CdfsPalomasAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DorsalesController : ControllerBase
{
    private readonly AppDbContext _context;

    public DorsalesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("temporada/{idTemporada}")]
    public async Task<IActionResult> GetPorTemporada(int idTemporada)
    {
        var dorsales = await _context.Dorsales
            .Include(d => d.Jugador)
            .Where(d => d.IdTemporada == idTemporada)
            .Select(d => new
            {
                d.Id,
                d.IdJugador,
                NombreJugador = d.Jugador.Nombre,
                ApellidosJugador = d.Jugador.Apellidos,
                d.DorsalNumero,
                d.IdTemporada
            })
            .OrderBy(d => d.DorsalNumero)
            .ToListAsync();

        return Ok(dorsales);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Crear([FromBody] DorsalDto dto)
    {
        var existe = await _context.Dorsales
            .AnyAsync(d => d.IdJugador == dto.IdJugador && d.IdTemporada == dto.IdTemporada);

        if (existe) return BadRequest(new { message = "Este jugador ya tiene dorsal en esta temporada" });

        var dorsal = new Dorsal
        {
            IdJugador = dto.IdJugador,
            IdTemporada = dto.IdTemporada,
            DorsalNumero = dto.DorsalNumero
        };

        _context.Dorsales.Add(dorsal);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Editar(int id, [FromBody] DorsalDto dto)
    {
        var dorsal = await _context.Dorsales.FindAsync(id);
        if (dorsal == null) return NotFound();

        dorsal.DorsalNumero = dto.DorsalNumero;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var dorsal = await _context.Dorsales.FindAsync(id);
        if (dorsal == null) return NotFound();

        _context.Dorsales.Remove(dorsal);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}