using CdfsPalomasAPI.Data;
using CdfsPalomasAPI.DTOs;
using CdfsPalomasAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CdfsPalomasAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JugadoresController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public JugadoresController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    // GET: api/jugadores (público)
    [HttpGet]
    public async Task<IActionResult> GetJugadores()
    {
        var jugadores = await _context.Jugadores
            .Where(j => j.Activo)
            .Select(j => new JugadorDto
            {
                Id = j.Id,
                Nombre = j.Nombre,
                Apellidos = j.Apellidos,
                Posicion = j.Posicion,
                Foto = j.Foto,
                Activo = j.Activo
            })
            .ToListAsync();

        return Ok(jugadores);
    }

    // GET: api/jugadores/todos (solo admin, incluye inactivos)
    [HttpGet("todos")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetTodos([FromQuery] int? idTemporada)
    {
        var jugadores = await _context.Jugadores
            .Select(j => new JugadorDto
            {
                Id = j.Id,
                Nombre = j.Nombre,
                Apellidos = j.Apellidos,
                Posicion = j.Posicion,
                Foto = j.Foto,
                Activo = j.Activo
            })
            .ToListAsync();

        if (idTemporada.HasValue)
        {
            var dorsales = await _context.Dorsales
                .Where(d => d.IdTemporada == idTemporada)
                .ToListAsync();

            foreach (var j in jugadores)
                j.Dorsal = dorsales.FirstOrDefault(d => d.IdJugador == j.Id)?.DorsalNumero;
        }

        return Ok(jugadores.OrderBy(j => j.Dorsal ?? 999).ToList());
    }

    // GET: api/jugadores/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetJugador(int id)
    {
        var jugador = await _context.Jugadores.FindAsync(id);
        if (jugador == null) return NotFound();

        return Ok(new JugadorDto
        {
            Id = jugador.Id,
            Nombre = jugador.Nombre,
            Apellidos = jugador.Apellidos,
            Posicion = jugador.Posicion,
            Foto = jugador.Foto,
            Activo = jugador.Activo
        });
    }

    // POST: api/jugadores (solo admin)
    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Crear([FromForm] CrearJugadorDto dto, IFormFile? foto)
    {
        var jugador = new Jugador
        {
            Nombre = dto.Nombre,
            Apellidos = dto.Apellidos,
            Posicion = dto.Posicion,
            Activo = dto.Activo
        };

        if (foto != null)
            jugador.Foto = await GuardarFoto(foto);

        _context.Jugadores.Add(jugador);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetJugador), new { id = jugador.Id }, new JugadorDto
        {
            Id = jugador.Id,
            Nombre = jugador.Nombre,
            Apellidos = jugador.Apellidos,
            Posicion = jugador.Posicion,
            Foto = jugador.Foto,
            Activo = jugador.Activo
        });
    }

    // PUT: api/jugadores/5 (solo admin)
    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Editar(int id, [FromForm] CrearJugadorDto dto, IFormFile? foto)
    {
        var jugador = await _context.Jugadores.FindAsync(id);
        if (jugador == null) return NotFound();

        jugador.Nombre = dto.Nombre;
        jugador.Apellidos = dto.Apellidos;
        jugador.Posicion = dto.Posicion;
        jugador.Activo = dto.Activo;

        if (foto != null)
            jugador.Foto = await GuardarFoto(foto);

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/jugadores/5 (solo admin)
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var jugador = await _context.Jugadores.FindAsync(id);
        if (jugador == null) return NotFound();

        _context.Jugadores.Remove(jugador);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private async Task<string> GuardarFoto(IFormFile foto)
    {
        var carpeta = Path.Combine(_env.WebRootPath ?? "wwwroot", "fotos", "jugadores");
        Directory.CreateDirectory(carpeta);

        var nombreFichero = $"{Guid.NewGuid()}{Path.GetExtension(foto.FileName)}";
        var rutaCompleta = Path.Combine(carpeta, nombreFichero);

        using var stream = new FileStream(rutaCompleta, FileMode.Create);
        await foto.CopyToAsync(stream);

        return $"/fotos/jugadores/{nombreFichero}";
    }

    // GET: api/jugadores/temporada/5
    [HttpGet("temporada/{idTemporada}")]
    public async Task<IActionResult> GetJugadoresPorTemporada(int idTemporada)
    {
        var jugadores = await _context.Convocatorias
            .Include(c => c.Jugador)
            .Include(c => c.Partido)
            .ThenInclude(p => p.Competicion)
            .Where(c => c.Partido.Competicion.IdTemporada == idTemporada)
            .Select(c => c.Jugador)
            .Distinct()
            .Select(j => new JugadorDto
            {
                Id = j.Id,
                Nombre = j.Nombre,
                Apellidos = j.Apellidos,
                Posicion = j.Posicion,
                Foto = j.Foto,
                Activo = j.Activo
            })
            .ToListAsync();

        return Ok(jugadores);
    }

    [HttpGet("filtrar")]
    public async Task<IActionResult> Filtrar([FromQuery] int? idTemporada, [FromQuery] string? categoria)
    {
        var query = _context.Convocatorias
            .Include(c => c.Jugador)
            .Include(c => c.Partido)
            .ThenInclude(p => p.Competicion)
            .ThenInclude(c => c.Temporada)
            .AsQueryable();

        if (idTemporada.HasValue)
            query = query.Where(c => c.Partido.Competicion.IdTemporada == idTemporada);

        if (!string.IsNullOrEmpty(categoria))
            query = query.Where(c => c.Partido.Competicion.Categoria == categoria);

        var jugadores = await query
            .Select(c => c.Jugador)
            .Distinct()
            .Select(j => new JugadorDto
            {
                Id = j.Id,
                Nombre = j.Nombre,
                Apellidos = j.Apellidos,
                Posicion = j.Posicion,
                Foto = j.Foto,
                Activo = j.Activo
            })
            .ToListAsync();

        if (idTemporada.HasValue)
        {
            var dorsales = await _context.Dorsales
                .Where(d => d.IdTemporada == idTemporada)
                .ToListAsync();

            foreach (var j in jugadores)
                j.Dorsal = dorsales.FirstOrDefault(d => d.IdJugador == j.Id)?.DorsalNumero;
        }

        return Ok(jugadores.OrderBy(j => j.Dorsal ?? 999).ToList());
    }

    // GET: api/jugadores/estadisticas?idTemporada=1&categoria=Senior
    [HttpGet("estadisticas")]
    public async Task<IActionResult> GetEstadisticas([FromQuery] int? idTemporada, [FromQuery] string? categoria, [FromQuery] int? idCompeticion)
    {
        var query = _context.Convocatorias
            .Include(c => c.Jugador)
            .Include(c => c.Partido)
            .ThenInclude(p => p.Competicion)
            .ThenInclude(c => c.Temporada)
            .AsQueryable();

        if (idTemporada.HasValue)
            query = query.Where(c => c.Partido.Competicion.IdTemporada == idTemporada);

        if (!string.IsNullOrEmpty(categoria))
            query = query.Where(c => c.Partido.Competicion.Categoria == categoria);

        if (idCompeticion.HasValue)
            query = query.Where(c => c.Partido.IdCompeticion == idCompeticion);

        var estadisticas = await query
            .GroupBy(c => new { c.IdJugador, c.Jugador.Nombre, c.Jugador.Apellidos, c.Jugador.Foto, c.Jugador.Posicion })
            .Select(g => new
            {
                Id = g.Key.IdJugador,
                Nombre = g.Key.Nombre,
                Apellidos = g.Key.Apellidos,
                Foto = g.Key.Foto,
                Posicion = g.Key.Posicion,
                Jugados = g.Count(),
                Titular = g.Count(c => c.Titular),
                Goles = g.Sum(c => c.Goles),
                Amarillas = g.Sum(c => c.Amarillas),
                DobleAmarilla = g.Count(c => c.DobleAmarilla),
                Rojas = g.Count(c => c.Roja)
            })
            .OrderByDescending(e => e.Goles)
            .ThenByDescending(e => e.Jugados)
            .ToListAsync();

        return Ok(estadisticas);
    }

    [HttpGet("estadisticas/historico")]
    public async Task<IActionResult> GetHistorico()
    {
        var categorias = await _context.Convocatorias
            .Include(c => c.Partido)
            .ThenInclude(p => p.Competicion)
            .Select(c => c.Partido.Competicion.Categoria)
            .Distinct()
            .ToListAsync();

        var resultado = new List<object>();

        foreach (var categoria in categorias)
        {
            var jugadores = await _context.Convocatorias
                .Include(c => c.Jugador)
                .Include(c => c.Partido)
                .ThenInclude(p => p.Competicion)
                .Where(c => c.Partido.Competicion.Categoria == categoria)
                .GroupBy(c => new { c.IdJugador, c.Jugador.Nombre, c.Jugador.Apellidos, c.Jugador.Foto, c.Jugador.Posicion })
                .Select(g => new
                {
                    Id = g.Key.IdJugador,
                    Nombre = g.Key.Nombre,
                    Apellidos = g.Key.Apellidos,
                    Foto = g.Key.Foto,
                    Posicion = g.Key.Posicion,
                    Jugados = g.Count(),
                    Titular = g.Count(c => c.Titular),
                    Goles = g.Sum(c => c.Goles),
                    Amarillas = g.Sum(c => c.Amarillas),
                    DobleAmarilla = g.Count(c => c.DobleAmarilla),
                    Rojas = g.Count(c => c.Roja)
                })
                .OrderByDescending(e => e.Goles)
                .ToListAsync();

            resultado.Add(new { Categoria = categoria, Jugadores = jugadores });
        }

        return Ok(resultado);
    }

    [HttpGet("aleatorios")]
    public async Task<IActionResult> GetAleatorios([FromQuery] int cantidad = 3)
    {
        var ultimaTemporada = await _context.Temporadas
            .OrderByDescending(t => t.Id)
            .FirstOrDefaultAsync();

        if (ultimaTemporada == null) return Ok(new List<object>());

        var jugadores = await _context.Convocatorias
            .Include(c => c.Jugador)
            .Include(c => c.Partido)
            .ThenInclude(p => p.Competicion)
            .Where(c => c.Partido.Competicion.IdTemporada == ultimaTemporada.Id
                     && c.Partido.Competicion.Categoria == "Senior"
                     && c.Jugador.Activo)
            .Select(c => c.Jugador)
            .Distinct()
            .Select(j => new JugadorDto
            {
                Id = j.Id,
                Nombre = j.Nombre,
                Apellidos = j.Apellidos,
                Posicion = j.Posicion,
                Foto = j.Foto,
                Activo = j.Activo
            })
            .ToListAsync();

        var aleatorios = jugadores
            .OrderBy(_ => Guid.NewGuid())
            .Take(cantidad)
            .ToList();

        return Ok(aleatorios);
    }
}