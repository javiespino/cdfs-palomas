using CdfsPalomasAPI.Data;
using CdfsPalomasAPI.DTOs;
using CdfsPalomasAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CdfsPalomasAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConvocatoriasController : ControllerBase
{
    private readonly AppDbContext _context;

    public ConvocatoriasController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/convocatorias/partido/5
    [HttpGet("partido/{idPartido}")]
    public async Task<IActionResult> GetPorPartido(int idPartido)
    {
        var convocatorias = await _context.Convocatorias
            .Include(c => c.Jugador)
            .Where(c => c.IdPartido == idPartido)
            .Select(c => new ConvocatoriaDto
            {
                Id = c.Id,
                IdJugador = c.IdJugador,
                NombreJugador = c.Jugador.Nombre,
                ApellidosJugador = c.Jugador.Apellidos,
                FotoJugador = c.Jugador.Foto,
                Titular = c.Titular,
                Goles = c.Goles,
                Amarillas = c.Amarillas,
                DobleAmarilla = c.DobleAmarilla,
                Roja = c.Roja
            })
            .ToListAsync();

        return Ok(convocatorias);
    }

    // POST: api/convocatorias/partido/5 — añadir jugador a convocatoria
    [HttpPost("partido/{idPartido}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Añadir(int idPartido, [FromBody] CrearConvocatoriaDto dto)
    {
        var existe = await _context.Convocatorias
            .AnyAsync(c => c.IdPartido == idPartido && c.IdJugador == dto.IdJugador);

        if (existe) return BadRequest(new { message = "El jugador ya está en la convocatoria" });

        var convocatoria = new Convocatoria
        {
            IdPartido = idPartido,
            IdJugador = dto.IdJugador
        };

        _context.Convocatorias.Add(convocatoria);
        await _context.SaveChangesAsync();
        return Ok();
    }

    // DELETE: api/convocatorias/5 — quitar jugador de convocatoria
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Quitar(int id)
    {
        var convocatoria = await _context.Convocatorias.FindAsync(id);
        if (convocatoria == null) return NotFound();

        _context.Convocatorias.Remove(convocatoria);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // PUT: api/convocatorias/estadisticas/5 — registrar estadísticas de un partido
    [HttpPut("estadisticas/{idPartido}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> ActualizarEstadisticas(int idPartido, [FromBody] List<ActualizarEstadisticasDto> dtos)
    {
        foreach (var dto in dtos)
        {
            var convocatoria = await _context.Convocatorias.FindAsync(dto.IdConvocatoria);
            if (convocatoria == null || convocatoria.IdPartido != idPartido) continue;

            convocatoria.Titular = dto.Titular;
            convocatoria.Goles = dto.Goles;
            convocatoria.Amarillas = dto.Amarillas;
            convocatoria.DobleAmarilla = dto.DobleAmarilla;
            convocatoria.Roja = dto.Roja;
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }
}