using CdfsPalomasAPI.Data;
using CdfsPalomasAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CdfsPalomasAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpGet("hash")]
    public IActionResult GenerarHash([FromQuery] string contrasena)
    {
        var hash = BCrypt.Net.BCrypt.HashPassword(contrasena);
        return Ok(new { hash });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Activo);

        if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Contrasena, usuario.Contrasena))
            return Unauthorized(new { message = "Credenciales incorrectas" });

        var token = GenerarToken(usuario.Id, usuario.Email, usuario.Rol);

        return Ok(new LoginResponseDto
        {
            Token = token,
            Nombre = usuario.Nombre,
            Rol = usuario.Rol
        });
    }

    private string GenerarToken(int id, string email, string rol)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, id.ToString()),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, rol)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    [HttpGet("perfil")]
    [Authorize]
    public async Task<IActionResult> GetPerfil()
    {
        var idUsuario = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var usuario = await _context.Usuarios.FindAsync(idUsuario);
        if (usuario == null) return NotFound();

        return Ok(new { usuario.Id, usuario.Nombre, usuario.Email, usuario.Rol });
    }

    [HttpPut("perfil")]
    [Authorize]
    public async Task<IActionResult> ActualizarPerfil([FromBody] ActualizarPerfilDto dto)
    {
        var idUsuario = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var usuario = await _context.Usuarios.FindAsync(idUsuario);
        if (usuario == null) return NotFound();

        var emailExiste = await _context.Usuarios
            .AnyAsync(u => u.Email == dto.Email && u.Id != idUsuario);
        if (emailExiste) return BadRequest(new { message = "El email ya está en uso" });

        usuario.Nombre = dto.Nombre;
        usuario.Email = dto.Email;
        await _context.SaveChangesAsync();

        return Ok(new { usuario.Id, usuario.Nombre, usuario.Email, usuario.Rol });
    }

    [HttpPut("cambiar-contrasena")]
    [Authorize]
    public async Task<IActionResult> CambiarContrasena([FromBody] CambiarContrasenaDto dto)
    {
        var idUsuario = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var usuario = await _context.Usuarios.FindAsync(idUsuario);
        if (usuario == null) return NotFound();

        if (!BCrypt.Net.BCrypt.Verify(dto.ContrasenaActual, usuario.Contrasena))
            return BadRequest(new { message = "La contraseña actual es incorrecta" });

        usuario.Contrasena = BCrypt.Net.BCrypt.HashPassword(dto.NuevaContrasena);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Contraseña actualizada correctamente" });
    }
}

