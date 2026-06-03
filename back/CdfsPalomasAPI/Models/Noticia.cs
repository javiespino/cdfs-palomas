using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CdfsPalomasAPI.Models;

[Table("noticias")]
public class Noticia
{
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string Titulo { get; set; } = null!;

    [Column(TypeName = "nvarchar(max)")]
    public string Contenido { get; set; } = null!;
    public string? Imagen { get; set; }

    [Column("id_usuario")]
    public int IdUsuario { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public Usuario Usuario { get; set; } = null!;
}