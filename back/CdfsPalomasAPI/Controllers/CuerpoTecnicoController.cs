using CdfsPalomasAPI.Data;
using CdfsPalomasAPI.DTOs;
using CdfsPalomasAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CdfsPalomasAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CuerpoTecnicoController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public CuerpoTecnicoController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    // GET: api/cuerpoTecnico — lista de personas
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var personas = await _context.CuerpoTecnico
            .Select(c => new
            {
                c.Id,
                c.Nombre,
                c.Apellidos,
                c.Foto
            })
            .ToListAsync();

        return Ok(personas);
    }

    // GET: api/cuerpoTecnico/asignaciones?idTemporada=1&categoria=Senior
    [HttpGet("asignaciones")]
    public async Task<IActionResult> GetAsignaciones([FromQuery] int? idTemporada, [FromQuery] string? categoria)
    {
        var query = _context.CuerpoTecnicoAsignaciones
            .Include(a => a.CuerpoTecnico)
            .Include(a => a.Temporada)
            .AsQueryable();

        if (idTemporada.HasValue)
            query = query.Where(a => a.IdTemporada == idTemporada);

        if (!string.IsNullOrEmpty(categoria))
            query = query.Where(a => a.Categoria == categoria);

        var asignaciones = await query
            .Select(a => new CuerpoTecnicoAsignacionDto
            {
                Id = a.Id,
                IdCuerpoTecnico = a.IdCuerpoTecnico,
                NombreCompleto = a.CuerpoTecnico.Nombre + " " + a.CuerpoTecnico.Apellidos,
                Foto = a.CuerpoTecnico.Foto,
                IdTemporada = a.IdTemporada,
                NombreTemporada = a.Temporada.Nombre,
                Categoria = a.Categoria,
                Cargo = a.Cargo
            })
            .ToListAsync();

        return Ok(asignaciones);
    }

    // POST: api/cuerpoTecnico — crear persona
    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Crear([FromForm] CuerpoTecnicoDto dto, IFormFile? foto)
    {
        var persona = new CuerpoTecnico
        {
            Nombre = dto.Nombre,
            Apellidos = dto.Apellidos
        };

        if (foto != null)
            persona.Foto = await GuardarFoto(foto);

        _context.CuerpoTecnico.Add(persona);
        await _context.SaveChangesAsync();
        return Ok(new { persona.Id, persona.Nombre, persona.Apellidos, persona.Foto });
    }

    // PUT: api/cuerpoTecnico/5 — editar persona
    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Editar(int id, [FromForm] CuerpoTecnicoDto dto, IFormFile? foto)
    {
        var persona = await _context.CuerpoTecnico.FindAsync(id);
        if (persona == null) return NotFound();

        persona.Nombre = dto.Nombre;
        persona.Apellidos = dto.Apellidos;

        if (foto != null)
            persona.Foto = await GuardarFoto(foto);

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/cuerpoTecnico/5 — eliminar persona
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var persona = await _context.CuerpoTecnico.FindAsync(id);
        if (persona == null) return NotFound();

        _context.CuerpoTecnico.Remove(persona);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // POST: api/cuerpoTecnico/asignaciones — crear asignación
    [HttpPost("asignaciones")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> CrearAsignacion([FromBody] CrearAsignacionDto dto)
    {
        var asignacion = new CuerpoTecnicoAsignacion
        {
            IdCuerpoTecnico = dto.IdCuerpoTecnico,
            IdTemporada = dto.IdTemporada,
            Categoria = dto.Categoria,
            Cargo = dto.Cargo
        };

        _context.CuerpoTecnicoAsignaciones.Add(asignacion);
        await _context.SaveChangesAsync();
        return Ok();
    }

    // DELETE: api/cuerpoTecnico/asignaciones/5 — eliminar asignación
    [HttpDelete("asignaciones/{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> EliminarAsignacion(int id)
    {
        var asignacion = await _context.CuerpoTecnicoAsignaciones.FindAsync(id);
        if (asignacion == null) return NotFound();

        _context.CuerpoTecnicoAsignaciones.Remove(asignacion);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private async Task<string> GuardarFoto(IFormFile foto)
    {
        var carpeta = Path.Combine(_env.WebRootPath ?? "wwwroot", "fotos", "cuerpo-tecnico");
        Directory.CreateDirectory(carpeta);
        var nombreFichero = $"{Guid.NewGuid()}{Path.GetExtension(foto.FileName)}";
        var rutaCompleta = Path.Combine(carpeta, nombreFichero);
        using var stream = new FileStream(rutaCompleta, FileMode.Create);
        await foto.CopyToAsync(stream);
        return $"/fotos/cuerpo-tecnico/{nombreFichero}";
    }
}