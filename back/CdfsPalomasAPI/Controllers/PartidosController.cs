using CdfsPalomasAPI.Data;
using CdfsPalomasAPI.DTOs;
using CdfsPalomasAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CdfsPalomasAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PartidosController : ControllerBase
{
    private readonly AppDbContext _context;

    public PartidosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetPartidos([FromQuery] int? idTemporada, [FromQuery] string? categoria)
    {
        var query = _context.Partidos
            .Include(p => p.Competicion)
            .ThenInclude(c => c.Temporada)
            .AsQueryable();

        if (idTemporada.HasValue)
            query = query.Where(p => p.Competicion.IdTemporada == idTemporada);

        if (!string.IsNullOrEmpty(categoria))
            query = query.Where(p => p.Competicion.Categoria == categoria);

        var partidos = await query
            .OrderByDescending(p => p.Fecha)
            .Select(p => new PartidoDto
            {
                Id = p.Id,
                Fecha = p.Fecha,
                Rival = p.Rival,
                GolesFavor = p.GolesFavor,
                GolesContra = p.GolesContra,
                EsLocal = p.EsLocal,
                IdCompeticion = p.IdCompeticion,
                NombreCompeticion = p.Competicion.Nombre,
                Categoria = p.Competicion.Categoria,
                NombreTemporada = p.Competicion.Temporada.Nombre,
                Jugado = p.Jugado
            })
            .ToListAsync();

        return Ok(partidos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPartido(int id)
    {
        var partido = await _context.Partidos
            .Include(p => p.Competicion)
            .ThenInclude(c => c.Temporada)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (partido == null) return NotFound();

        return Ok(new PartidoDto
        {
            Id = partido.Id,
            Fecha = partido.Fecha,
            Rival = partido.Rival,
            GolesFavor = partido.GolesFavor,
            GolesContra = partido.GolesContra,
            EsLocal = partido.EsLocal,
            IdCompeticion = partido.IdCompeticion,
            NombreCompeticion = partido.Competicion.Nombre,
            Categoria = partido.Competicion.Categoria,
            NombreTemporada = partido.Competicion.Temporada.Nombre,
            Jugado = partido.Jugado
        });
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Crear([FromBody] CrearPartidoDto dto)
    {
        var partido = new Partido
        {
            Fecha = dto.Fecha,
            Rival = dto.Rival,
            GolesFavor = dto.GolesFavor,
            GolesContra = dto.GolesContra,
            EsLocal = dto.EsLocal,
            IdCompeticion = dto.IdCompeticion,
            Jugado = dto.Jugado
        };

        _context.Partidos.Add(partido);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPartido), new { id = partido.Id }, partido);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Editar(int id, [FromBody] CrearPartidoDto dto)
    {
        var partido = await _context.Partidos.FindAsync(id);
        if (partido == null) return NotFound();

        partido.Fecha = dto.Fecha;
        partido.Rival = dto.Rival;
        partido.GolesFavor = dto.GolesFavor;
        partido.GolesContra = dto.GolesContra;
        partido.EsLocal = dto.EsLocal;
        partido.IdCompeticion = dto.IdCompeticion;
        partido.Jugado = dto.Jugado;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var partido = await _context.Partidos.FindAsync(id);
        if (partido == null) return NotFound();

        _context.Partidos.Remove(partido);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // GET: api/partidos/resumen?idTemporada=1&idCompeticion=1
    [HttpGet("resumen")]
    public async Task<IActionResult> GetResumen([FromQuery] int? idTemporada, [FromQuery] int? idCompeticion)
    {
        var query = _context.Partidos
            .Include(p => p.Competicion)
            .ThenInclude(c => c.Temporada)
            .Where(p => p.Jugado)
            .AsQueryable();

        if (idTemporada.HasValue)
            query = query.Where(p => p.Competicion.IdTemporada == idTemporada);

        if (idCompeticion.HasValue)
            query = query.Where(p => p.IdCompeticion == idCompeticion);

        var partidos = await query.ToListAsync();

        var resumen = new
        {
            TotalPartidos = partidos.Count,
            Ganados = partidos.Count(p => p.GolesFavor > p.GolesContra),
            Empatados = partidos.Count(p => p.GolesFavor == p.GolesContra),
            Perdidos = partidos.Count(p => p.GolesFavor < p.GolesContra),
            GolesFavor = partidos.Sum(p => p.GolesFavor),
            GolesContra = partidos.Sum(p => p.GolesContra),
            Puntos = partidos.Count(p => p.GolesFavor > p.GolesContra) * 3 +
                     partidos.Count(p => p.GolesFavor == p.GolesContra),
            RachaActual = CalcularRacha(partidos.OrderByDescending(p => p.Fecha).ToList())
        };

        return Ok(resumen);
    }

    private string CalcularRacha(List<Partido> partidos)
    {
        if (!partidos.Any()) return "-";

        var ultimo = partidos.First();
        string tipo = ultimo.GolesFavor > ultimo.GolesContra ? "V" :
                      ultimo.GolesFavor == ultimo.GolesContra ? "E" : "D";
        int count = 1;

        foreach (var p in partidos.Skip(1))
        {
            string resultado = p.GolesFavor > p.GolesContra ? "V" :
                               p.GolesFavor == p.GolesContra ? "E" : "D";
            if (resultado == tipo) count++;
            else break;
        }

        return $"{count}{tipo}";
    }

    [HttpGet("resumen/jugadores")]
    public async Task<IActionResult> GetResumenJugadores([FromQuery] int? idTemporada, [FromQuery] int? idCompeticion)
    {
        var query = _context.Convocatorias
            .Include(c => c.Jugador)
            .Include(c => c.Partido)
            .ThenInclude(p => p.Competicion)
            .ThenInclude(c => c.Temporada)
            .AsQueryable();

        if (idTemporada.HasValue)
            query = query.Where(c => c.Partido.Competicion.IdTemporada == idTemporada);

        if (idCompeticion.HasValue)
            query = query.Where(c => c.Partido.IdCompeticion == idCompeticion);

        var convocatorias = await query.ToListAsync();

        var estadisticas = convocatorias
            .GroupBy(c => new { c.IdJugador, c.Jugador.Nombre, c.Jugador.Apellidos, c.Jugador.Foto })
            .Select(g => new
            {
                IdJugador = g.Key.IdJugador,
                Nombre = g.Key.Nombre,
                Apellidos = g.Key.Apellidos,
                Foto = g.Key.Foto,
                Jugados = g.Count(),
                Titular = g.Count(c => c.Titular),
                Goles = g.Sum(c => c.Goles),
                Amarillas = g.Sum(c => c.Amarillas) + g.Count(c => c.DobleAmarilla) * 2,
                Rojas = g.Count(c => c.Roja)
            })
            .ToList();

        var maxGoles = estadisticas.Max(e => e.Goles);
        var maxJugados = estadisticas.Max(e => e.Jugados);
        var maxTitular = estadisticas.Max(e => e.Titular);
        var maxAmarillas = estadisticas.Max(e => e.Amarillas);
        var maxRojas = estadisticas.Max(e => e.Rojas);

        var topGoleadores = estadisticas
            .Where(e => e.Goles > 0)
            .OrderByDescending(e => e.Goles)
            .TakeWhile((e, i) => i < 3 || e.Goles == estadisticas.OrderByDescending(x => x.Goles).ElementAt(2).Goles)
            .Take(10)
            .ToList();

        var topJugados = estadisticas
            .OrderByDescending(e => e.Jugados)
            .TakeWhile((e, i) => i < 3 || e.Jugados == estadisticas.OrderByDescending(x => x.Jugados).ElementAt(2).Jugados)
            .Take(10)
            .ToList();

        var topTitular = estadisticas
            .OrderByDescending(e => e.Titular)
            .TakeWhile((e, i) => i < 3 || e.Titular == estadisticas.OrderByDescending(x => x.Titular).ElementAt(2).Titular)
            .Take(10)
            .ToList();

        var topAmarillas = estadisticas
            .Where(e => e.Amarillas > 0)
            .OrderByDescending(e => e.Amarillas)
            .FirstOrDefault();

        var topRojas = estadisticas
            .Where(e => e.Rojas > 0)
            .OrderByDescending(e => e.Rojas)
            .FirstOrDefault();

        // Partidos para mayor victoria y peor derrota
        var partidosQuery = _context.Partidos
            .Include(p => p.Competicion)
            .ThenInclude(c => c.Temporada)
            .Where(p => p.Jugado)
            .AsQueryable();

        if (idTemporada.HasValue)
            partidosQuery = partidosQuery.Where(p => p.Competicion.IdTemporada == idTemporada);

        if (idCompeticion.HasValue)
            partidosQuery = partidosQuery.Where(p => p.IdCompeticion == idCompeticion);

        var partidos = await partidosQuery.ToListAsync();

        var mayorVictoria = partidos
            .Where(p => p.GolesFavor > p.GolesContra)
            .OrderByDescending(p => p.GolesFavor - p.GolesContra)
            .FirstOrDefault();

        var peorDerrota = partidos
            .Where(p => p.GolesFavor < p.GolesContra)
            .OrderByDescending(p => p.GolesContra - p.GolesFavor)
            .FirstOrDefault();

        return Ok(new
        {
            TopGoleadores = topGoleadores,
            TopJugados = topJugados,
            TopTitular = topTitular,
            TopAmarillas = topAmarillas,
            TopRojas = topRojas,
            MayorVictoria = mayorVictoria == null ? null : new
            {
                Rival = mayorVictoria.Rival,
                GolesFavor = mayorVictoria.GolesFavor,
                GolesContra = mayorVictoria.GolesContra,
                Fecha = mayorVictoria.Fecha,
                EsLocal = mayorVictoria.EsLocal
            },
            PeorDerrota = peorDerrota == null ? null : new
            {
                Rival = peorDerrota.Rival,
                GolesFavor = peorDerrota.GolesFavor,
                GolesContra = peorDerrota.GolesContra,
                Fecha = peorDerrota.Fecha,
                EsLocal = peorDerrota.EsLocal
            }
        });
    }

    [HttpGet("proximos")]
    public async Task<IActionResult> GetProximos()
    {
        var hoy = DateTime.Today;

        var categorias = await _context.Partidos
            .Include(p => p.Competicion)
            .Where(p => !p.Jugado && p.Fecha >= hoy)
            .Select(p => p.Competicion.Categoria)
            .Distinct()
            .ToListAsync();

        var resultado = new List<object>();

        foreach (var categoria in categorias)
        {
            var partido = await _context.Partidos
                .Include(p => p.Competicion)
                .ThenInclude(c => c.Temporada)
                .Where(p => !p.Jugado && p.Fecha >= hoy && p.Competicion.Categoria == categoria)
                .OrderBy(p => p.Fecha)
                .Select(p => new PartidoDto
                {
                    Id = p.Id,
                    Fecha = p.Fecha,
                    Rival = p.Rival,
                    GolesFavor = p.GolesFavor,
                    GolesContra = p.GolesContra,
                    EsLocal = p.EsLocal,
                    IdCompeticion = p.IdCompeticion,
                    NombreCompeticion = p.Competicion.Nombre,
                    Categoria = p.Competicion.Categoria,
                    NombreTemporada = p.Competicion.Temporada.Nombre,
                    Jugado = p.Jugado
                })
                .FirstOrDefaultAsync();

            if (partido != null)
                resultado.Add(new { Categoria = categoria, Partido = partido });
        }

        return Ok(resultado);
    }

    [HttpGet("{id}/detalle")]
    public async Task<IActionResult> GetDetalle(int id)
    {
        var partido = await _context.Partidos
            .Include(p => p.Competicion)
            .ThenInclude(c => c.Temporada)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (partido == null) return NotFound();

        var convocatorias = await _context.Convocatorias
            .Include(c => c.Jugador)
            .Where(c => c.IdPartido == id)
            .Select(c => new
            {
                c.Id,
                c.IdJugador,
                NombreJugador = c.Jugador.Nombre,
                ApellidosJugador = c.Jugador.Apellidos,
                FotoJugador = c.Jugador.Foto,
                c.Titular,
                c.Goles,
                c.Amarillas,
                c.DobleAmarilla,
                c.Roja
            })
            .OrderByDescending(c => c.Titular)
            .ThenByDescending(c => c.Goles)
            .ToListAsync();

        var golesEquipo = convocatorias.Sum(c => c.Goles);
        var propios = partido.Jugado ? partido.GolesFavor - golesEquipo : 0;

        return Ok(new
        {
            Id = partido.Id,
            Fecha = partido.Fecha,
            Rival = partido.Rival,
            GolesFavor = partido.GolesFavor,
            GolesContra = partido.GolesContra,
            EsLocal = partido.EsLocal,
            Jugado = partido.Jugado,
            NombreCompeticion = partido.Competicion.Nombre,
            Categoria = partido.Competicion.Categoria,
            NombreTemporada = partido.Competicion.Temporada.Nombre,
            Convocatorias = convocatorias,
            GolesEnPropia = propios > 0 ? propios : 0
        });
    }
}