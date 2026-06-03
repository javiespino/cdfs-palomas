using CdfsPalomasAPI.Data;
using CdfsPalomasAPI.DTOs;
using CdfsPalomasAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CdfsPalomasAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NoticiasController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public NoticiasController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpGet]
    public async Task<IActionResult> GetNoticias()
    {
        var noticias = await _context.Noticias
            .Include(n => n.Usuario)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NoticiaDto
            {
                Id = n.Id,
                Titulo = n.Titulo,
                Contenido = n.Contenido,
                Imagen = n.Imagen,
                IdUsuario = n.IdUsuario,
                NombreUsuario = n.Usuario.Nombre,
                CreatedAt = n.CreatedAt
            })
            .ToListAsync();

        return Ok(noticias);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetNoticia(int id)
    {
        var noticia = await _context.Noticias
            .Include(n => n.Usuario)
            .FirstOrDefaultAsync(n => n.Id == id);

        if (noticia == null) return NotFound();

        return Ok(new NoticiaDto
        {
            Id = noticia.Id,
            Titulo = noticia.Titulo,
            Contenido = noticia.Contenido,
            Imagen = noticia.Imagen,
            IdUsuario = noticia.IdUsuario,
            NombreUsuario = noticia.Usuario.Nombre,
            CreatedAt = noticia.CreatedAt
        });
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Crear([FromForm] CrearNoticiaDto dto, IFormFile? imagen)
    {
        var idUsuario = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var noticia = new Noticia
        {
            Titulo = dto.Titulo,
            Contenido = dto.Contenido,
            IdUsuario = idUsuario
        };

        if (imagen != null)
            noticia.Imagen = await GuardarImagen(imagen);

        _context.Noticias.Add(noticia);
        await _context.SaveChangesAsync();
        return Ok(noticia.Id);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Editar(int id, [FromForm] CrearNoticiaDto dto, IFormFile? imagen)
    {
        var noticia = await _context.Noticias.FindAsync(id);
        if (noticia == null) return NotFound();

        noticia.Titulo = dto.Titulo;
        noticia.Contenido = dto.Contenido;

        if (imagen != null)
            noticia.Imagen = await GuardarImagen(imagen);

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var noticia = await _context.Noticias.FindAsync(id);
        if (noticia == null) return NotFound();

        _context.Noticias.Remove(noticia);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private async Task<string> GuardarImagen(IFormFile imagen)
    {
        var carpeta = Path.Combine(_env.WebRootPath ?? "wwwroot", "fotos", "noticias");
        Directory.CreateDirectory(carpeta);

        var nombreFichero = $"{Guid.NewGuid()}{Path.GetExtension(imagen.FileName)}";
        var rutaCompleta = Path.Combine(carpeta, nombreFichero);

        using var stream = new FileStream(rutaCompleta, FileMode.Create);
        await imagen.CopyToAsync(stream);

        return $"/fotos/noticias/{nombreFichero}";
    }
}