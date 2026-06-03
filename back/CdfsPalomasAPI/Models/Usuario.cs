using System.ComponentModel.DataAnnotations.Schema;

namespace CdfsPalomasAPI.Models;
public class Usuario
{
    public int Id { get; set; }
    public string Nombre { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Contrasena { get; set; } = null!;
    public string Rol { get; set; } = "visitante";
    public bool Activo { get; set; } = true;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}